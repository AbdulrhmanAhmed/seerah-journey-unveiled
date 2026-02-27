import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, GripVertical, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PathRow {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  line_color: string;
  is_active: boolean;
}

interface StepRow {
  id: string;
  path_id: string;
  step_order: number;
  label: string;
  label_en: string;
  description: string;
  description_en: string;
  coord_x: number;
  coord_y: number;
  segment_type: string;
  location_id: string | null;
}

function PathForm({
  initial,
  onSave,
  saving,
}: {
  initial?: Partial<PathRow>;
  onSave: (data: Omit<PathRow, "id">) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    name_en: initial?.name_en ?? "",
    description: initial?.description ?? "",
    description_en: initial?.description_en ?? "",
    line_color: initial?.line_color ?? "200 60% 50%",
    is_active: initial?.is_active ?? true,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name (Arabic)</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} dir="rtl" />
        </div>
        <div>
          <label className="text-sm font-medium">Name (English)</label>
          <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Description (Arabic)</label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} dir="rtl" />
        </div>
        <div>
          <label className="text-sm font-medium">Description (English)</label>
          <Textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Line Color (HSL: "h s% l%")</label>
          <Input value={form.line_color} onChange={(e) => setForm({ ...form, line_color: e.target.value })} placeholder="200 60% 50%" />
          <div className="mt-1 h-4 w-full rounded" style={{ backgroundColor: `hsl(${form.line_color})` }} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <span className="text-sm">{form.is_active ? "Active" : "Inactive"}</span>
        </div>
      </div>
      <Button onClick={() => onSave(form)} disabled={saving || !form.name || !form.name_en} className="w-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Path"}
      </Button>
    </div>
  );
}

function StepEditor({ pathId }: { pathId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingStep, setEditingStep] = useState<StepRow | null>(null);

  const { data: steps = [], isLoading } = useQuery({
    queryKey: ["admin-steps", pathId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("path_steps")
        .select("*")
        .eq("path_id", pathId)
        .order("step_order");
      if (error) throw error;
      return data as StepRow[];
    },
  });

  const addStep = useMutation({
    mutationFn: async () => {
      const maxOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.step_order)) + 1 : 1;
      const { error } = await supabase.from("path_steps").insert({
        path_id: pathId,
        step_order: maxOrder,
        label: "خطوة جديدة",
        label_en: "New Step",
        coord_x: 40,
        coord_y: 55,
        segment_type: "land",
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-steps", pathId] }),
  });

  const updateStep = useMutation({
    mutationFn: async (step: StepRow) => {
      const { error } = await supabase
        .from("path_steps")
        .update({
          label: step.label,
          label_en: step.label_en,
          description: step.description,
          description_en: step.description_en,
          coord_x: step.coord_x,
          coord_y: step.coord_y,
          segment_type: step.segment_type,
          location_id: step.location_id,
          step_order: step.step_order,
        })
        .eq("id", step.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-steps", pathId] });
      setEditingStep(null);
      toast({ title: "Step updated" });
    },
  });

  const deleteStep = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("path_steps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-steps", pathId] }),
  });

  const moveStep = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= steps.length) return;
    const a = steps[index];
    const b = steps[swapIndex];
    await supabase.from("path_steps").update({ step_order: b.step_order }).eq("id", a.id);
    await supabase.from("path_steps").update({ step_order: a.step_order }).eq("id", b.id);
    queryClient.invalidateQueries({ queryKey: ["admin-steps", pathId] });
  };

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Steps ({steps.length})</h4>
        <Button size="sm" variant="outline" onClick={() => addStep.mutate()}>
          <Plus className="h-3 w-3 mr-1" /> Add Step
        </Button>
      </div>
      {steps.map((step, i) => (
        <div key={step.id} className="border rounded-md p-3 space-y-2">
          {editingStep?.id === step.id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Label (AR)" value={editingStep.label} onChange={(e) => setEditingStep({ ...editingStep, label: e.target.value })} dir="rtl" />
                <Input placeholder="Label (EN)" value={editingStep.label_en} onChange={(e) => setEditingStep({ ...editingStep, label_en: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Textarea placeholder="Description (AR)" value={editingStep.description} onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })} dir="rtl" rows={2} />
                <Textarea placeholder="Description (EN)" value={editingStep.description_en} onChange={(e) => setEditingStep({ ...editingStep, description_en: e.target.value })} rows={2} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-xs">X</label>
                  <Input type="number" step="0.1" value={editingStep.coord_x} onChange={(e) => setEditingStep({ ...editingStep, coord_x: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-xs">Y</label>
                  <Input type="number" step="0.1" value={editingStep.coord_y} onChange={(e) => setEditingStep({ ...editingStep, coord_y: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-xs">Segment</label>
                  <Select value={editingStep.segment_type} onValueChange={(v) => setEditingStep({ ...editingStep, segment_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="sea">Sea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs">Location ID</label>
                  <Input value={editingStep.location_id ?? ""} onChange={(e) => setEditingStep({ ...editingStep, location_id: e.target.value || null })} placeholder="optional" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateStep.mutate(editingStep)}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingStep(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs bg-muted px-2 py-0.5 rounded">{step.step_order}</span>
                <span className="text-sm font-medium">{step.label_en}</span>
                <span className="text-xs text-muted-foreground">({step.coord_x}, {step.coord_y})</span>
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{step.segment_type}</span>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveStep(i, "up")} disabled={i === 0}>
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveStep(i, "down")} disabled={i === steps.length - 1}>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingStep(step)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteStep.mutate(step.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminPathsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<PathRow | null>(null);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const { data: paths = [], isLoading } = useQuery({
    queryKey: ["admin-paths"],
    queryFn: async () => {
      const { data, error } = await supabase.from("paths").select("*").order("created_at");
      if (error) throw error;
      return data as PathRow[];
    },
  });

  const createPath = useMutation({
    mutationFn: async (data: Omit<PathRow, "id">) => {
      const { error } = await supabase.from("paths").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-paths"] });
      setCreateOpen(false);
      toast({ title: "Path created" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updatePath = useMutation({
    mutationFn: async ({ id, ...data }: PathRow) => {
      const { error } = await supabase.from("paths").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-paths"] });
      setEditingPath(null);
      toast({ title: "Path updated" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deletePath = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("paths").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-paths"] });
      toast({ title: "Path deleted" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("paths").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-paths"] }),
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Paths</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Path</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Create Path</DialogTitle></DialogHeader>
            <PathForm onSave={(d) => createPath.mutate(d)} saving={createPath.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : paths.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No paths yet. Create your first path.</p>
      ) : (
        <div className="space-y-4">
          {paths.map((path) => (
            <Card key={path.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: `hsl(${path.line_color})` }} />
                    <CardTitle className="text-lg">{path.name_en}</CardTitle>
                    <span className="text-sm text-muted-foreground">{path.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={path.is_active}
                      onCheckedChange={(v) => toggleActive.mutate({ id: path.id, is_active: v })}
                    />
                    <Dialog open={editingPath?.id === path.id} onOpenChange={(o) => !o && setEditingPath(null)}>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => setEditingPath(path)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Edit Path</DialogTitle></DialogHeader>
                        {editingPath && (
                          <PathForm
                            initial={editingPath}
                            onSave={(d) => updatePath.mutate({ ...d, id: editingPath.id } as PathRow)}
                            saving={updatePath.isPending}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Delete this path and all its steps?")) deletePath.mutate(path.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
                    >
                      {expandedPath === path.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      Steps
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedPath === path.id && (
                <CardContent>
                  <StepEditor pathId={path.id} />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
