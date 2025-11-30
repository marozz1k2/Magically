"use client";

import { useMyModels, useGenerateImage, useDeleteModel } from "@/hooks/useReplicate";
import { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModelsEmpty } from "@/components/states/empty/Empty";
import {
    Loader2,
    Trash2,
    CheckCircle,
    Clock,
    XCircle,
    Sparkles,
    Info
} from "lucide-react";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const getStatusIcon = (status: string) => {
    switch (status) {
        case "succeeded":
            return <CheckCircle className="size-4 text-green-500" />;
        case "failed":
        case "canceled":
            return <XCircle className="size-4 text-red-500" />;
        default:
            return <Clock className="size-4 text-yellow-500" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "succeeded":
            return "bg-green-500/10 text-green-500";
        case "failed":
        case "canceled":
            return "bg-red-500/10 text-red-500";
        default:
            return "bg-yellow-500/10 text-yellow-500";
    }
};

export const MagicPhoto = () => {
    const { data: models, isLoading } = useMyModels();
    const generateImage = useGenerateImage();
    const deleteModel = useDeleteModel();

    const [selectedModel, setSelectedModel] = useState("");
    const [prompt, setPrompt] = useState("");
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [modelToDelete, setModelToDelete] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin" />
            </div>
        );
    }

    if (!models || models.length === 0) {
        return <ModelsEmpty />;
    }

    const availableModels = models.filter(m => m.status === "succeeded");
    const trainingModels = models.filter(m =>
        m.status === "starting" || m.status === "processing"
    );

    const handleGenerate = async () => {
        if (!selectedModel || !prompt) return;

        const model = models.find(m => m.destination === selectedModel);
        if (!model) return;

        await generateImage.mutateAsync({
            modelDestination: model.destination,
            prompt,
            aspectRatio,
            numOutputs: 1,
        });
    };

    const handleDelete = async () => {
        if (modelToDelete) {
            await deleteModel.mutateAsync(modelToDelete);
            setModelToDelete(null);
        }
    };

    return (
        <section className="flex flex-col container mx-auto max-w-6xl rounded-t-2xl px-4 mt-4 space-y-6">
            <div className="flex items-center justify-between mt-4">
                <div>
                    <h1 className="title-text">Magic Photo</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Generate images using your trained models
                    </p>
                </div>
                <Link href="/create/models">
                    <Button variant="outline">
                        <Sparkles className="size-4 mr-2" />
                        Train New Model
                    </Button>
                </Link>
            </div>

            {trainingModels.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="size-5" />
                            Models in Training
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {trainingModels.map((model) => (
                                <div
                                    key={model.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="size-4 animate-spin" />
                                        <div>
                                            <p className="font-medium">{model.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {model.destination}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={getStatusColor(model.status)}>
                                        {model.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {availableModels.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <Info className="size-12 mx-auto text-muted-foreground" />
                            <h3 className="font-semibold">No Models Ready Yet</h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Your models are still training. This usually takes 10-30 minutes.
                                You'll be able to generate images once training is complete.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Generate Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Model</label>
                                <Select onValueChange={setSelectedModel} value={selectedModel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose your model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableModels.map((model) => (
                                            <SelectItem key={model.id} value={model.destination}>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="size-3 text-green-500" />
                                                    {model.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prompt</label>
                                <Input
                                    placeholder="A portrait of MYFACE in a garden..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Include your trigger word in the prompt
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Aspect Ratio</label>
                                <Select onValueChange={setAspectRatio} value={aspectRatio}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1:1">Square (1:1)</SelectItem>
                                        <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                                        <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                                        <SelectItem value="4:3">Standard (4:3)</SelectItem>
                                        <SelectItem value="3:4">Tall (3:4)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={!selectedModel || !prompt || generateImage.isPending}
                                className="w-full"
                            >
                                {generateImage.isPending ? (
                                    <>
                                        <Loader2 className="size-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Image"
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Your Models</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {availableModels.map((model) => (
                                    <div
                                        key={model.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            {getStatusIcon(model.status)}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{model.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {model.destination}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setModelToDelete(model.id)}
                                        >
                                            <Trash2 className="size-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <AlertDialog open={!!modelToDelete} onOpenChange={() => setModelToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Model?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the model from your list. The model will still exist on Replicate,
                            but you won't be able to use it from this interface anymore.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
};