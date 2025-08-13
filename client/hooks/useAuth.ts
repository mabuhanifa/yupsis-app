import api from "@/lib/api";
import { LoginFormValues } from "@/lib/validators";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const login = async (credentials: LoginFormValues) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const useLogin = () => {
  const router = useRouter();
  const authLogin = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authLogin(data.tokens.access.token, data.user);
      router.push("/admin/dashboard");
    },
  });
};
