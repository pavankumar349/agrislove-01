
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Define a type that represents all valid table names in our database
type TableName = keyof Database['public']['Tables'] | string;

// This hook fetches data from a Supabase table and sets up a realtime subscription
export function useRealtimeTable<T>(table: TableName, initialQuery: Record<string, any> = {}) {
  const [rows, setRows] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false });
          
        if (!error && isMounted && data) {
          setRows(data as unknown as T[]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
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
        { event: "*", schema: "public", table: table as string },
        (payload) => {
          setRows((prev) => {
            if (payload.eventType === "INSERT") {
              // Add newly inserted row to start
              return [payload.new as unknown as T, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((row) => 
                (row as any)["id"] === payload.new.id ? (payload.new as unknown as T) : row
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((row) => (row as any)["id"] !== payload.old.id);
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
