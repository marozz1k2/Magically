import api from "@/lib/api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const generateGptImage = async (formData: FormData) => {
    const { data } = await api.post("/gpt/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 900000
    });
    return data;
};

export const useGenerateGptImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: generateGptImage,
        onSuccess: (data) => {
            toast.success("Image generated and saved!");
            queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            return data;
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Generation failed");
        },
    });
};