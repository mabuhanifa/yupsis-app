"use client";

import { Badge } from "@/components/ui/badge";
import { SyncHistory } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<SyncHistory>[] = [
  {
    accessorKey: "channel",
    header: "Channel",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "Success"
          ? "default"
          : status === "Failed"
          ? "destructive"
          : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "details",
    header: "Details",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <span>{date.toLocaleString()}</span>;
    },
  },
];
