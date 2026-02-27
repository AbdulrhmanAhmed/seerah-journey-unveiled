import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["milestone", "battle", "contract", "challenge", "marriage", "diplomacy"];

interface LocationRow {
  id: string;
  name: string;
  name_en: string;
  name_arabic: string;
  x: number;
  y: number;
  description: string;
  description_en: string;
  primary_category: string;
  is_active: boolean;
  travel_data: Record<string, any>;
}

interface EventRow {
  id: string;
  location_id: string;
  label: string;
  label_en: string;
  category: string;
  event_order: number;
}

function LocationForm({
  initial,
  onSave,
  saving,
}: {
  initial?: Partial<LocationRow>;
  onSave: (data: LocationRow) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<LocationRow>({
    id: initial?.id ?? "",
    name: initial?.name ?? "",
    name_en: initial?.name_en ?? "",
    name_arabic: initial?.name_arabic ?? "",
    x: initial?.x ?? 40,
    y: initial?.y ?? 55,
    description: initial?.description ?? "",
    description_en: initial?.description_en ?? "",
    primary_category: initial?.primary_category ?? "milestone",
    is_active: initial?.is_active ?? true,
    travel_data: initial?.travel_data ?? {},
  });
  const isEdit = !!initial?.id;

  const td = form.travel_data as any;

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {!isEdit && (
        <div>
          <label className="text-sm font-medium">ID (unique slug, e.g. "makkah")</label>
          <Input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Name (Arabic)</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} dir="rtl" />
        </div>
        <div>
          <label className="text-sm font-medium">Name (English)</label>
          <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Display Arabic</label>
          <Input value={form.name_arabic} onChange={(e) => setForm({ ...form, name_arabic: e.target.value })} dir="rtl" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">X</label>
          <Input type="number" step="0.1" value={form.x} onChange={(e) => setForm({ ...form, x: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-sm font-medium">Y</label>
          <Input type="number" step="0.1" value={form.y} onChange={(e) => setForm({ ...form, y: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select value={form.primary_category} onValueChange={(v) => setForm({ ...form, primary_category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Description (AR)</label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} dir="rtl" rows={2} />
        </div>
        <div>
          <label className="text-sm font-medium">Description (EN)</label>
          <Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={2} />
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Travel Data</h4>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Camel days (AR)" value={td.camelDays ?? ""} onChange={(e) => setForm({ ...form, travel_data: { ...td, camelDays: e.target.value } })} dir="rtl" />
          <Input placeholder="Camel days (EN)" value={td.camelDaysEn ?? ""} onChange={(e) => setForm({ ...form, travel_data: { ...td, camelDaysEn: e.target.value } })} />
          <Input placeholder="Car hours (AR)" value={td.carHours ?? ""} onChange={(e) => setForm({ ...form, travel_data: { ...td, carHours: e.target.value } })} dir="rtl" />
          <Input placeholder="Car hours (EN)" value={td.carHoursEn ?? ""} onChange={(e) => setForm({ ...form, travel_data: { ...td, carHoursEn: e.target.value } })} />
          <Input placeholder="Distance KM" type="number" value={td.distanceKm ?? ""} onChange={(e) => setForm({ ...form, travel_data: { ...td, distanceKm: parseFloat(e.target.value) || 0 } })} />
          <Input placeholder="From (AR)" value={td.from ?? ""} onChange={(e) => setForm({ ...form, travel_data: { ...td, from: e.target.value } })} dir="rtl" />
          <Input placeholder="From (EN)" value={td.fromEn ?? ""} onChange={(e) => setForm({ ...form, travel_data: { ...td, fromEn: e.target.value } })} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        <span className="text-sm">{form.is_active ? "Active" : "Inactive"}</span>
      </div>
      <Button onClick={() => onSave(form)} disabled={saving || !form.id || !form.name || !form.name_en} className="w-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Location"}
      </Button>
    </div>
  );
}

function EventEditor({ locationId }: { locationId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newEvent, setNewEvent] = useState({ label: "", label_en: "", category: "event" });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events", locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_events")
        .select("*")
        .eq("location_id", locationId)
        .order("event_order");
      if (error) throw error;
      return data as EventRow[];
    },
  });

  const addEvent = useMutation({
    mutationFn: async () => {
      const maxOrder = events.length > 0 ? Math.max(...events.map((e) => e.event_order)) + 1 : 1;
      const { error } = await supabase.from("location_events").insert({
        location_id: locationId,
        label: newEvent.label,
        label_en: newEvent.label_en,
        category: newEvent.category,
        event_order: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events", locationId] });
      setNewEvent({ label: "", label_en: "", category: "event" });
      toast({ title: "Event added" });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("location_events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-events", locationId] }),
  });

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <div className="space-y-3 mt-4">
      <h4 className="font-medium text-sm">Events ({events.length})</h4>
      {events.map((ev) => (
        <div key={ev.id} className="flex items-center justify-between border rounded-md p-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{ev.category}</span>
            <span className="text-sm">{ev.label_en}</span>
            <span className="text-xs text-muted-foreground">{ev.label}</span>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteEvent.mutate(ev.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <div className="border rounded-md p-3 space-y-2 bg-muted/30">
        <div className="grid grid-cols-3 gap-2">
          <Input placeholder="Label (AR)" value={newEvent.label} onChange={(e) => setNewEvent({ ...newEvent, label: e.target.value })} dir="rtl" />
          <Input placeholder="Label (EN)" value={newEvent.label_en} onChange={(e) => setNewEvent({ ...newEvent, label_en: e.target.value })} />
          <Select value={newEvent.category} onValueChange={(v) => setNewEvent({ ...newEvent, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              <SelectItem value="event">event</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => addEvent.mutate()} disabled={!newEvent.label || !newEvent.label_en}>
          <Plus className="h-3 w-3 mr-1" /> Add Event
        </Button>
      </div>
    </div>
  );
}

export default function AdminLocationsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<LocationRow | null>(null);
  const [expandedLoc, setExpandedLoc] = useState<string | null>(null);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("map_locations").select("*").order("created_at");
      if (error) throw error;
      return data as LocationRow[];
    },
  });

  const createLocation = useMutation({
    mutationFn: async (data: LocationRow) => {
      const { error } = await supabase.from("map_locations").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setCreateOpen(false);
      toast({ title: "Location created" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateLocation = useMutation({
    mutationFn: async (data: LocationRow) => {
      const { id, ...rest } = data;
      const { error } = await supabase.from("map_locations").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      setEditingLoc(null);
      toast({ title: "Location updated" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteLocation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("map_locations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      toast({ title: "Location deleted" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("map_locations").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-locations"] }),
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Locations</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Location</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Create Location</DialogTitle></DialogHeader>
            <LocationForm onSave={(d) => createLocation.mutate(d)} saving={createLocation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : locations.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No locations yet.</p>
      ) : (
        <div className="space-y-4">
          {locations.map((loc) => (
            <Card key={loc.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">{loc.primary_category}</span>
                    <CardTitle className="text-lg">{loc.name_en}</CardTitle>
                    <span className="text-sm text-muted-foreground">{loc.name}</span>
                    <span className="text-xs text-muted-foreground">({loc.x}, {loc.y})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={loc.is_active}
                      onCheckedChange={(v) => toggleActive.mutate({ id: loc.id, is_active: v })}
                    />
                    <Dialog open={editingLoc?.id === loc.id} onOpenChange={(o) => !o && setEditingLoc(null)}>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => setEditingLoc(loc)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Edit Location</DialogTitle></DialogHeader>
                        {editingLoc && (
                          <LocationForm
                            initial={editingLoc}
                            onSave={(d) => updateLocation.mutate(d)}
                            saving={updateLocation.isPending}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Delete this location and all its events?")) deleteLocation.mutate(loc.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedLoc(expandedLoc === loc.id ? null : loc.id)}
                    >
                      {expandedLoc === loc.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      Events
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedLoc === loc.id && (
                <CardContent>
                  <EventEditor locationId={loc.id} />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
