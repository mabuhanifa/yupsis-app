"use client";

import { DataTable } from "@/components/ui/data-table";
import { useSyncHistory } from "@/hooks/useSyncHistory";
import { columns } from "./columns";

export default function SyncHistoryPage() {
  const { data: historyData, isLoading } = useSyncHistory({ limit: 100 });

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-8">Sync History</h1>
      {isLoading ? (
        <p>Loading history...</p>
      ) : (
        <DataTable columns={columns} data={historyData?.data || []} />
      )}
    </div>
  );
}
