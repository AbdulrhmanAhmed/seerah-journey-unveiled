import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LeafletMapPicker from "@/components/LeafletMapPicker";

interface TimelineEventRow {
  id: string;
  year_ce: number;
  year_hijri: string | null;
  era: string;
  title: string;
  title_en: string;
  description: string | null;
  description_en: string | null;
  category: string;
  location_id: string | null;
  path_id: string | null;
  image_url: string | null;
  map_x: number;
  map_y: number;
  is_major: boolean;
  timeline_visible: boolean;
  is_active: boolean;
  display_order: number;
}

const categories = [
  { value: "milestone", label: "Milestone" },
  { value: "battle", label: "Battle" },
  { value: "contract", label: "Treaty" },
  { value: "challenge", label: "Trial" },
  { value: "marriage", label: "Marriage" },
  { value: "diplomacy", label: "Diplomacy" },
];

function EventForm({
  initial,
  onSave,
  saving,
}: {
  initial?: Partial<TimelineEventRow>;
  onSave: (data: Omit<TimelineEventRow, "id">) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    year_ce: initial?.year_ce ?? 622,
    year_hijri: initial?.year_hijri ?? "",
    era: initial?.era ?? "makkah",
    title: initial?.title ?? "",
    title_en: initial?.title_en ?? "",
    description: initial?.description ?? "",
    description_en: initial?.description_en ?? "",
    category: initial?.category ?? "milestone",
    location_id: initial?.location_id ?? "",
    path_id: initial?.path_id ?? "",
    image_url: initial?.image_url ?? "",
    map_x: initial?.map_x ?? 38.5,
    map_y: initial?.map_y ?? 62,
    lat: (initial as any)?.lat ?? 21.4225,
    lng: (initial as any)?.lng ?? 39.8262,
    is_major: initial?.is_major ?? false,
    timeline_visible: initial?.timeline_visible ?? true,
    is_active: initial?.is_active ?? true,
    display_order: initial?.display_order ?? 0,
  });

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">Year (CE)</label>
          <Input type="number" value={form.year_ce} onChange={(e) => setForm({ ...form, year_ce: parseInt(e.target.value) || 570 })} />
        </div>
        <div>
          <label className="text-sm font-medium">Year (Hijri)</label>
          <Input value={form.year_hijri} onChange={(e) => setForm({ ...form, year_hijri: e.target.value })} placeholder="e.g. 1" />
        </div>
        <div>
          <label className="text-sm font-medium">Era</label>
          <Select value={form.era} onValueChange={(v) => setForm({ ...form, era: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="makkah">Makkah</SelectItem>
              <SelectItem value="madinah">Madinah</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Title (Arabic)</label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} dir="rtl" />
        </div>
        <div>
          <label className="text-sm font-medium">Title (English)</label>
          <Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Description (Arabic)</label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} dir="rtl" rows={2} />
        </div>
        <div>
          <label className="text-sm font-medium">Description (English)</label>
          <Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={2} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Latitude</label>
          <Input type="number" step="0.0001" value={form.lat} onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-sm font-medium">Longitude</label>
          <Input type="number" step="0.0001" value={form.lng} onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">📍 Click on map to pick coordinates</label>
        <LeafletMapPicker
          lat={form.lat}
          lng={form.lng}
          onPick={(lat, lng) => setForm({ ...form, lat, lng })}
          height="200px"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Location ID</label>
          <Input value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })} placeholder="e.g. makkah" />
        </div>
        <div>
          <label className="text-sm font-medium">Image URL</label>
          <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="optional" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Display Order</label>
          <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="flex flex-col gap-2 pt-5">
          <div className="flex items-center gap-2">
            <Switch checked={form.is_major} onCheckedChange={(v) => setForm({ ...form, is_major: v })} />
            <span className="text-sm">Major Event</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={form.timeline_visible} onCheckedChange={(v) => setForm({ ...form, timeline_visible: v })} />
          <span className="text-sm">Timeline Visible</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <span className="text-sm">Active</span>
        </div>
      </div>
      <Button
        onClick={() => onSave(form as any)}
        disabled={saving || !form.title || !form.title_en}
        className="w-full"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Event"}
      </Button>
    </div>
  );
}

export default function AdminTimelinePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEventRow | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-timeline-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_events")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as TimelineEventRow[];
    },
  });

  const createEvent = useMutation({
    mutationFn: async (data: Omit<TimelineEventRow, "id">) => {
      const { error } = await supabase.from("timeline_events").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-timeline-events"] });
      setCreateOpen(false);
      toast({ title: "Event created" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...data }: TimelineEventRow) => {
      const { error } = await supabase.from("timeline_events").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-timeline-events"] });
      setEditingEvent(null);
      toast({ title: "Event updated" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("timeline_events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-timeline-events"] });
      toast({ title: "Event deleted" });
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, timeline_visible }: { id: string; timeline_visible: boolean }) => {
      const { error } = await supabase.from("timeline_events").update({ timeline_visible }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-timeline-events"] }),
  });

  const categoryColorMap: Record<string, string> = {
    milestone: "bg-yellow-100 text-yellow-800",
    battle: "bg-red-100 text-red-800",
    contract: "bg-blue-100 text-blue-800",
    challenge: "bg-orange-100 text-orange-800",
    marriage: "bg-pink-100 text-pink-800",
    diplomacy: "bg-green-100 text-green-800",
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Timeline Events</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Create Timeline Event</DialogTitle></DialogHeader>
            <EventForm onSave={(d) => createEvent.mutate(d)} saving={createEvent.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : events.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No timeline events yet.</p>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <Card key={event.id} className={`transition-opacity ${!event.timeline_visible ? "opacity-50" : ""}`}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-muted-foreground w-14">{event.year_ce}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColorMap[event.category] || "bg-gray-100"}`}>
                      {event.category}
                    </span>
                    <CardTitle className="text-sm">{event.title_en}</CardTitle>
                    <span className="text-xs text-muted-foreground">{event.title}</span>
                    {event.is_major && (
                      <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">Major</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => toggleVisibility.mutate({ id: event.id, timeline_visible: !event.timeline_visible })}
                      title="Toggle timeline visibility"
                    >
                      {event.timeline_visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                    <Dialog open={editingEvent?.id === event.id} onOpenChange={(o) => !o && setEditingEvent(null)}>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingEvent(event)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Edit Event</DialogTitle></DialogHeader>
                        {editingEvent && (
                          <EventForm
                            initial={editingEvent}
                            onSave={(d) => updateEvent.mutate({ ...d, id: editingEvent.id } as TimelineEventRow)}
                            saving={updateEvent.isPending}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive"
                      onClick={() => { if (confirm("Delete this event?")) deleteEvent.mutate(event.id); }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
