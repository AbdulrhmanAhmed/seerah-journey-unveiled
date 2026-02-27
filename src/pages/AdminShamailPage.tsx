import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Trait = {
  id: string;
  title: string;
  title_en: string;
  category: string;
  description: string | null;
  description_en: string | null;
  hadith_source: string | null;
  hadith_source_en: string | null;
  story_example: string | null;
  story_example_en: string | null;
  reflection: string | null;
  reflection_en: string | null;
  icon_name: string | null;
  image_url: string | null;
  map_location_id: string | null;
  is_active: boolean;
};

const emptyForm = {
  title: "", title_en: "", category: "Moral",
  description: "", description_en: "",
  hadith_source: "", hadith_source_en: "",
  story_example: "", story_example_en: "",
  reflection: "", reflection_en: "",
  icon_name: "heart", image_url: "", map_location_id: "", is_active: true,
};

export default function AdminShamailPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: traits = [], isLoading } = useQuery({
    queryKey: ["admin-shamail"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shamail_traits").select("*").order("created_at");
      if (error) throw error;
      return data as Trait[];
    },
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["map-locations-list"],
    queryFn: async () => {
      const { data } = await supabase.from("map_locations").select("id, name, name_en");
      return data || [];
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        map_location_id: form.map_location_id || null,
        image_url: form.image_url || null,
      };
      if (editing) {
        const { error } = await supabase.from("shamail_traits").update(payload).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("shamail_traits").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-shamail"] });
      toast.success(editing ? "Trait updated" : "Trait added");
      closeForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shamail_traits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-shamail"] });
      toast.success("Deleted");
    },
  });

  const openEdit = (t: Trait) => {
    setEditing(t.id);
    setForm({
      title: t.title, title_en: t.title_en, category: t.category,
      description: t.description || "", description_en: t.description_en || "",
      hadith_source: t.hadith_source || "", hadith_source_en: t.hadith_source_en || "",
      story_example: t.story_example || "", story_example_en: t.story_example_en || "",
      reflection: t.reflection || "", reflection_en: t.reflection_en || "",
      icon_name: t.icon_name || "heart", image_url: t.image_url || "",
      map_location_id: t.map_location_id || "", is_active: t.is_active,
    });
    setOpen(true);
  };

  const closeForm = () => { setOpen(false); setEditing(null); setForm(emptyForm); };

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shamail Traits</h1>
        <Button onClick={() => { closeForm(); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Trait
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title (AR)</TableHead>
              <TableHead>Title (EN)</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading…</TableCell></TableRow>
            ) : traits.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell>{t.title_en}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell className="text-muted-foreground">{t.icon_name}</TableCell>
                <TableCell>{t.is_active ? "✓" : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(t.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={closeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Trait" : "Add Trait"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title (AR)</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
              <div><Label>Title (EN)</Label><Input value={form.title_en} onChange={(e) => set("title_en", e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moral">Moral (خُلقية)</SelectItem>
                    <SelectItem value="Physical">Physical (خَلقية)</SelectItem>
                    <SelectItem value="Social">Social (اجتماعية)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Icon (Lucide name)</Label><Input value={form.icon_name} onChange={(e) => set("icon_name", e.target.value)} placeholder="heart" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Description (AR)</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} /></div>
              <div><Label>Description (EN)</Label><Textarea value={form.description_en} onChange={(e) => set("description_en", e.target.value)} rows={2} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Hadith (AR)</Label><Textarea value={form.hadith_source} onChange={(e) => set("hadith_source", e.target.value)} rows={2} /></div>
              <div><Label>Hadith (EN)</Label><Textarea value={form.hadith_source_en} onChange={(e) => set("hadith_source_en", e.target.value)} rows={2} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Story (AR)</Label><Textarea value={form.story_example} onChange={(e) => set("story_example", e.target.value)} rows={2} /></div>
              <div><Label>Story (EN)</Label><Textarea value={form.story_example_en} onChange={(e) => set("story_example_en", e.target.value)} rows={2} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Reflection (AR)</Label><Textarea value={form.reflection} onChange={(e) => set("reflection", e.target.value)} rows={2} /></div>
              <div><Label>Reflection (EN)</Label><Textarea value={form.reflection_en} onChange={(e) => set("reflection_en", e.target.value)} rows={2} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} /></div>
              <div>
                <Label>Linked Map Location</Label>
                <Select value={form.map_location_id} onValueChange={(v) => set("map_location_id", v)}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {locations.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.name} — {l.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
              <Button type="submit" disabled={upsert.isPending}>{editing ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
