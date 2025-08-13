import api from "@/lib/api";
import { PaginatedResponse, SyncHistory } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface SyncHistoryParams {
  page?: number;
  limit?: number;
}

const fetchSyncHistory = async (
  params: SyncHistoryParams
): Promise<PaginatedResponse<SyncHistory>> => {
  const { data } = await api.get("/admin/sync/history", { params });
  return data;
};

export const useSyncHistory = (params: SyncHistoryParams) => {
  return useQuery({
    queryKey: ["syncHistory", params],
    queryFn: () => fetchSyncHistory(params),
  });
};
