import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const TYPES = ["all", "suggestion", "bug", "idea", "other"] as const;

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  suggestion: "default",
  bug: "destructive",
  idea: "secondary",
  other: "outline",
};

export default function AdminFeedbackPage() {
  const [filter, setFilter] = useState<string>("all");

  const { data: feedback = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-feedback", filter],
    queryFn: async () => {
      let q = supabase.from("feedback").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("type", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete feedback");
    } else {
      toast.success("Feedback deleted");
      refetch();
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Feedback</h1>

      <div className="flex gap-2 mb-4">
        {TYPES.map((t) => (
          <Button
            key={t}
            variant={filter === t ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter(t)}
            className="capitalize"
          >
            {t}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : feedback.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No feedback found.</p>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="min-w-[300px]">Message</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant={typeBadgeVariant[item.type] ?? "outline"} className="capitalize">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.name || "—"}</TableCell>
                  <TableCell>{item.email || "—"}</TableCell>
                  <TableCell className="max-w-md whitespace-pre-wrap">{item.message}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.page_url || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
