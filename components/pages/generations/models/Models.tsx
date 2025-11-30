"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTrainModel } from "@/hooks/useReplicate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadImage } from "@/components/shared/create/UploadImage";
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";

const formSchema = z.object({
    modelName: z
        .string()
        .min(2, "Model name is required")
        .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed"),
    triggerWord: z
        .string()
        .min(1, "Trigger word required")
        .regex(/^[A-Z0-9]+$/, "Use uppercase letters/numbers only (e.g., MYSTYLE, MYFACE)"),
    loraType: z.enum(["subject", "style"]),
    images: z.array(z.instanceof(File)).min(10, "At least 10 images required (recommended 10-20)"),
});

export const Models = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { 
            modelName: "", 
            triggerWord: "", 
            loraType: "subject" as "subject" | "style",
            images: [] as File[] 
        },
    });
    const trainModel = useTrainModel();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append("modelName", values.modelName);
        formData.append("triggerWord", values.triggerWord);
        formData.append("loraType", values.loraType);
        values.images.forEach((file) => formData.append("replicateImages", file));

        setLoading(true);
        try {
            await trainModel.mutateAsync(formData);
            form.reset();
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-3xl mx-auto">
            <div className="fixed md:hidden h-12 backdrop-blur-2xl w-full top-0 left-0 right-0 text-sm z-10">
                <Link href="/create/magic-photo" className="flex items-center justify-start h-full ml-2 link-text">
                    <ChevronLeft className="size-4" />
                    <span>Magic photo</span>
                </Link>
            </div>
            <Card className="bg-transparent shadow-none border-none mt-8 md:mt-0">
                <CardHeader>
                    <h2 className="title-text">Train Your Custom Model</h2>
                    <CardDescription>
                        Create a personalized AI model to generate images in your unique style or of specific subjects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="modelName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model Name</FormLabel>
                                        <Input 
                                            placeholder="e.g. my-dreamy-style" 
                                            {...field} 
                                        />
                                        <FormDescription>
                                            Use lowercase letters, numbers, and hyphens only
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="loraType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model Type</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select model type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="subject">
                                                    Subject (Person, Character, Object)
                                                </SelectItem>
                                                <SelectItem value="style">
                                                    Style (Art Style, Visual Theme)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Choose 'subject' for people/objects, 'style' for artistic styles
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="triggerWord"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trigger Word</FormLabel>
                                        <Input 
                                            placeholder="e.g. MYFACE or MYSTYLE" 
                                            {...field} 
                                        />
                                        <FormDescription>
                                            A unique word to activate your model (uppercase recommended)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Training Images</FormLabel>
                                        <UploadImage
                                            imageAmount={20}
                                            onChange={(files) => field.onChange(files)}
                                        />
                                        <FormDescription className="flex items-start gap-2">
                                            <Info className="size-4 mt-0.5 shrink-0" />
                                            <span>
                                                Upload 10-20 high-quality images (1024x1024 recommended). 
                                                For subjects: varied poses and backgrounds. 
                                                For styles: consistent style, varied subjects.
                                            </span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="btn-solid w-full"
                            >
                                {loading ? "Starting Training..." : "Start Training (10-30 min)"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
};