
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useRealtimeTable<T>(table: string, initialQuery: any) {
  const [rows, setRows] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
        if (!error && isMounted) {
          setRows(data);
        }
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [table, ...Object.values(initialQuery || {})]);

  // Subscribe for realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          setRows((prev) => {
            if (payload.eventType === "INSERT") {
              // Add newly inserted row to start
              return [payload.new as T, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((row) => (row["id"] === payload.new.id ? payload.new : row));
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((row) => row["id"] !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table]);

  return { rows, isLoading, setRows };
}
