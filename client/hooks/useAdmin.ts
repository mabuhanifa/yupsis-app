import api from "@/lib/api";
import { Channel, DashboardStats } from "@/types";
import { useQuery } from "@tanstack/react-query";

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get("/admin/dashboard/stats");
  return data;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });
};

const fetchChannels = async (): Promise<Channel[]> => {
  const { data } = await api.get("/admin/channels");
  return data;
};

export const useChannels = () => {
  return useQuery({
    queryKey: ["channels"],
    queryFn: fetchChannels,
  });
};
