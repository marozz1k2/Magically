"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface TrainModelData {
    training: {
        id: string;
        status: string;
        destination: string;
        trigger_word: string;
    };
}

interface GenerateImageData {
    job: {
        id: string;
        userId: string;
        service: string;
        serviceTaskId: string;
        status: string;
        prompt: string;
    };
}

interface ReplicateModel {
    id: string;
    version: string | null;
    name: string;
    destination: string;
    status: string;
    createdAt: string;
}

const trainModel = async (formData: FormData) => {
    const { data } = await api.post<{ data: TrainModelData }>("/replicate/train", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
};

const generateImage = async (values: {
    modelDestination: string;
    prompt: string;
    aspectRatio?: string;
    numOutputs?: number;
}) => {
    const { data } = await api.post<{ data: GenerateImageData }>("/replicate/generate", values);
    return data.data;
};

const getMyModels = async () => {
    const { data } = await api.get<{ data: { models: ReplicateModel[] } }>("/replicate/models");
    return data.data.models;
};

const getTrainingStatus = async (trainingId: string) => {
    const { data } = await api.get(`/replicate/training/${trainingId}`);
    return data.data.training;
};

const deleteModel = async (modelId: string) => {
    const { data } = await api.delete(`/replicate/models/${modelId}`);
    return data;
};

export const useTrainModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: trainModel,
        onSuccess: () => {
            toast.success("Training started! Check your models page for progress.");
            queryClient.invalidateQueries({ queryKey: ["replicateModels"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Training failed");
        },
    });
};

export const useGenerateImage = () => {
    return useMutation({
        mutationFn: generateImage,
        onSuccess: () => {
            toast.success("Image generation started! You'll be notified when it's ready.");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Generation failed");
        },
    });
};

export const useMyModels = () => {
    return useQuery({
        queryKey: ["replicateModels"],
        queryFn: getMyModels,
        refetchInterval: 30000, // Refetch every 30 seconds to update training status
    });
};

export const useTrainingStatus = (trainingId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["trainingStatus", trainingId],
        queryFn: () => getTrainingStatus(trainingId),
        enabled: enabled && !!trainingId,
        refetchInterval: (data) => {
            return 10000;
        },
    });
};


export const useDeleteModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteModel,
        onSuccess: () => {
            toast.success("Model deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["replicateModels"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to delete model");
        },
    });
};