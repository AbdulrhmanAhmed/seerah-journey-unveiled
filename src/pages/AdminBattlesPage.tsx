import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Loader2, Eye, EyeOff, Swords } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Battle = any;

const outcomes = ["victory", "defeat", "truce", "inconclusive", "withdrawal"];
const kinds = ["ghazwah", "sariyyah"];

const emptyBattle = (): Battle => ({
  slug: "",
  name: "",
  name_en: "",
  kind: "ghazwah",
  sequence_number: null,
  hijri_year: null,
  hijri_month: "",
  gregorian_date: "",
  location_name: "",
  location_name_en: "",
  lat: null,
  lng: null,
  commander_muslim: "",
  commander_muslim_en: "",
  commander_enemy: "",
  commander_enemy_en: "",
  opponents: "",
  opponents_en: "",
  muslim_forces: null,
  enemy_forces: null,
  muslim_casualties: null,
  enemy_casualties: null,
  enemy_captured: null,
  outcome: "inconclusive",
  cause: "",
  cause_en: "",
  summary: "",
  summary_en: "",
  full_story: "",
  full_story_en: "",
  key_events: [],
  quran_references: [],
  hadith_references: [],
  related_event_ids: [],
  image_url: "",
  is_major: false,
  is_active: true,
  display_order: 0,
});

export default function AdminBattlesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Battle | null>(null);
  const [open, setOpen] = useState(false);
  const [filterKind, setFilterKind] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: battles = [], isLoading } = useQuery({
    queryKey: ["admin-battles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("battles")
        .select("*")
        .order("hijri_year", { ascending: true })
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data || []) as Battle[];
    },
  });

  const save = useMutation({
    mutationFn: async (b: Battle) => {
      const payload = { ...b };
      // Coerce number-ish fields
      ["sequence_number", "hijri_year", "muslim_forces", "enemy_forces", "muslim_casualties", "enemy_casualties", "enemy_captured", "display_order"].forEach((k) => {
        if (payload[k] === "" || payload[k] === undefined) payload[k] = null;
        else if (payload[k] !== null) payload[k] = Number(payload[k]);
      });
      ["lat", "lng"].forEach((k) => {
        if (payload[k] === "" || payload[k] === undefined) payload[k] = null;
        else if (payload[k] !== null) payload[k] = Number(payload[k]);
      });

      if (b.id) {
        const { id, created_at, updated_at, ...rest } = payload;
        const { error } = await supabase.from("battles").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { id, created_at, updated_at, ...rest } = payload;
        const { error } = await supabase.from("battles").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Saved" });
      qc.invalidateQueries({ queryKey: ["admin-battles"] });
      qc.invalidateQueries({ queryKey: ["battles"] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("battles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Deleted" });
      qc.invalidateQueries({ queryKey: ["admin-battles"] });
      qc.invalidateQueries({ queryKey: ["battles"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async (b: Battle) => {
      const { error } = await supabase.from("battles").update({ is_active: !b.is_active }).eq("id", b.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-battles"] }),
  });

  const filtered = battles.filter((b) => {
    if (filterKind !== "all" && b.kind !== filterKind) return false;
    if (search) {
      const q = search.toLowerCase();
      return (b.name || "").toLowerCase().includes(q) || (b.name_en || "").toLowerCase().includes(q) || (b.slug || "").includes(q);
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Swords className="h-7 w-7 text-secondary" />
          <h1 className="text-3xl font-bold">Battles & Expeditions</h1>
          <Badge variant="outline">{battles.length}</Badge>
        </div>
        <Button onClick={() => { setEditing(emptyBattle()); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Battle
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filterKind} onValueChange={setFilterKind}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All kinds</SelectItem>
            <SelectItem value="ghazwah">Ghazwah</SelectItem>
            <SelectItem value="sariyyah">Sariyyah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Kind</th>
                <th className="p-3">Year</th>
                <th className="p-3">Outcome</th>
                <th className="p-3">Major</th>
                <th className="p-3">Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-medium">{b.name_en || b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.name}</div>
                  </td>
                  <td className="p-3"><Badge variant="outline">{b.kind}</Badge></td>
                  <td className="p-3">{b.hijri_year != null ? `${b.hijri_year} AH` : "—"}</td>
                  <td className="p-3">{b.outcome || "—"}</td>
                  <td className="p-3">{b.is_major ? "★" : ""}</td>
                  <td className="p-3">
                    <Button size="icon" variant="ghost" onClick={() => toggleActive.mutate(b)}>
                      {b.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </td>
                  <td className="p-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(b); setOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      if (confirm(`Delete "${b.name_en || b.name}"?`)) del.mutate(b.id);
                    }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Battle" : "New Battle"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <BattleForm
              value={editing}
              onChange={setEditing}
              onSave={() => save.mutate(editing)}
              saving={save.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function BattleForm({ value, onChange, onSave, saving }: { value: Battle; onChange: (b: Battle) => void; onSave: () => void; saving: boolean }) {
  const set = (k: string, v: any) => onChange({ ...value, [k]: v });
  const jsonField = (k: string) => {
    const cur = value[k];
    return typeof cur === "string" ? cur : JSON.stringify(cur ?? [], null, 2);
  };
  const parseJson = (k: string, v: string) => {
    try { onChange({ ...value, [k]: JSON.parse(v) }); }
    catch { onChange({ ...value, [k]: v }); }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="basic">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="forces">Forces</TabsTrigger>
          <TabsTrigger value="narrative">Narrative</TabsTrigger>
          <TabsTrigger value="events">Key Events</TabsTrigger>
          <TabsTrigger value="refs">Refs & Media</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-3 mt-4">
          <Row>
            <Field label="Slug"><Input value={value.slug || ""} onChange={(e) => set("slug", e.target.value)} /></Field>
            <Field label="Kind">
              <Select value={value.kind} onValueChange={(v) => set("kind", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{kinds.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </Row>
          <Row>
            <Field label="Name (AR)"><Input value={value.name || ""} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Name (EN)"><Input value={value.name_en || ""} onChange={(e) => set("name_en", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Hijri Year"><Input type="number" value={value.hijri_year ?? ""} onChange={(e) => set("hijri_year", e.target.value)} /></Field>
            <Field label="Hijri Month"><Input value={value.hijri_month || ""} onChange={(e) => set("hijri_month", e.target.value)} /></Field>
            <Field label="Gregorian Date"><Input value={value.gregorian_date || ""} onChange={(e) => set("gregorian_date", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Location (AR)"><Input value={value.location_name || ""} onChange={(e) => set("location_name", e.target.value)} /></Field>
            <Field label="Location (EN)"><Input value={value.location_name_en || ""} onChange={(e) => set("location_name_en", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Lat"><Input type="number" step="any" value={value.lat ?? ""} onChange={(e) => set("lat", e.target.value)} /></Field>
            <Field label="Lng"><Input type="number" step="any" value={value.lng ?? ""} onChange={(e) => set("lng", e.target.value)} /></Field>
            <Field label="Sequence #"><Input type="number" value={value.sequence_number ?? ""} onChange={(e) => set("sequence_number", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Major?">
              <div className="flex items-center h-10"><Switch checked={!!value.is_major} onCheckedChange={(v) => set("is_major", v)} /></div>
            </Field>
            <Field label="Active?">
              <div className="flex items-center h-10"><Switch checked={!!value.is_active} onCheckedChange={(v) => set("is_active", v)} /></div>
            </Field>
            <Field label="Display Order"><Input type="number" value={value.display_order ?? 0} onChange={(e) => set("display_order", e.target.value)} /></Field>
          </Row>
        </TabsContent>

        <TabsContent value="forces" className="space-y-3 mt-4">
          <Row>
            <Field label="Commander Muslim (AR)"><Input value={value.commander_muslim || ""} onChange={(e) => set("commander_muslim", e.target.value)} /></Field>
            <Field label="Commander Muslim (EN)"><Input value={value.commander_muslim_en || ""} onChange={(e) => set("commander_muslim_en", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Commander Enemy (AR)"><Input value={value.commander_enemy || ""} onChange={(e) => set("commander_enemy", e.target.value)} /></Field>
            <Field label="Commander Enemy (EN)"><Input value={value.commander_enemy_en || ""} onChange={(e) => set("commander_enemy_en", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Opponents (AR)"><Input value={value.opponents || ""} onChange={(e) => set("opponents", e.target.value)} /></Field>
            <Field label="Opponents (EN)"><Input value={value.opponents_en || ""} onChange={(e) => set("opponents_en", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Muslim Forces"><Input type="number" value={value.muslim_forces ?? ""} onChange={(e) => set("muslim_forces", e.target.value)} /></Field>
            <Field label="Enemy Forces"><Input type="number" value={value.enemy_forces ?? ""} onChange={(e) => set("enemy_forces", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Muslim Martyrs"><Input type="number" value={value.muslim_casualties ?? ""} onChange={(e) => set("muslim_casualties", e.target.value)} /></Field>
            <Field label="Enemy Casualties"><Input type="number" value={value.enemy_casualties ?? ""} onChange={(e) => set("enemy_casualties", e.target.value)} /></Field>
            <Field label="Captured"><Input type="number" value={value.enemy_captured ?? ""} onChange={(e) => set("enemy_captured", e.target.value)} /></Field>
          </Row>
          <Field label="Outcome">
            <Select value={value.outcome || "inconclusive"} onValueChange={(v) => set("outcome", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{outcomes.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </TabsContent>

        <TabsContent value="narrative" className="space-y-3 mt-4">
          <Row>
            <Field label="Cause (AR)"><Textarea rows={3} value={value.cause || ""} onChange={(e) => set("cause", e.target.value)} /></Field>
            <Field label="Cause (EN)"><Textarea rows={3} value={value.cause_en || ""} onChange={(e) => set("cause_en", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Summary (AR)"><Textarea rows={4} value={value.summary || ""} onChange={(e) => set("summary", e.target.value)} /></Field>
            <Field label="Summary (EN)"><Textarea rows={4} value={value.summary_en || ""} onChange={(e) => set("summary_en", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Full Story (AR)"><Textarea rows={10} value={value.full_story || ""} onChange={(e) => set("full_story", e.target.value)} /></Field>
            <Field label="Full Story (EN)"><Textarea rows={10} value={value.full_story_en || ""} onChange={(e) => set("full_story_en", e.target.value)} /></Field>
          </Row>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Field label="Key Events (JSON array of {title, title_en, description, description_en})">
            <Textarea rows={14} value={jsonField("key_events")} onChange={(e) => parseJson("key_events", e.target.value)} className="font-mono text-xs" />
          </Field>
        </TabsContent>

        <TabsContent value="refs" className="mt-4 space-y-3">
          <Field label="Image URL"><Input value={value.image_url || ""} onChange={(e) => set("image_url", e.target.value)} /></Field>
          <Field label="Quran References (JSON)">
            <Textarea rows={6} value={jsonField("quran_references")} onChange={(e) => parseJson("quran_references", e.target.value)} className="font-mono text-xs" />
          </Field>
          <Field label="Hadith References (JSON)">
            <Textarea rows={6} value={jsonField("hadith_references")} onChange={(e) => parseJson("hadith_references", e.target.value)} className="font-mono text-xs" />
          </Field>
          <Field label="Related Event IDs (JSON array)">
            <Textarea rows={3} value={jsonField("related_event_ids")} onChange={(e) => parseJson("related_event_ids", e.target.value)} className="font-mono text-xs" />
          </Field>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button onClick={onSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
    {children}
  </div>
);
