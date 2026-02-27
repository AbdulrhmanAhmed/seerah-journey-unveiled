import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route, Map, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: pathCount = 0, isLoading: lp } = useQuery({
    queryKey: ["admin-path-count"],
    queryFn: async () => {
      const { count } = await supabase.from("paths").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: locationCount = 0, isLoading: ll } = useQuery({
    queryKey: ["admin-location-count"],
    queryFn: async () => {
      const { count } = await supabase.from("map_locations").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: eventCount = 0, isLoading: le } = useQuery({
    queryKey: ["admin-event-count"],
    queryFn: async () => {
      const { count } = await supabase.from("location_events").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const loading = lp || ll || le;

  const stats = [
    { label: "Paths", value: pathCount, icon: Route, link: "/admin/paths" },
    { label: "Locations", value: locationCount, icon: Map, link: "/admin/locations" },
    { label: "Events", value: eventCount, icon: Calendar, link: "/admin/locations" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} to={s.link}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{s.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
