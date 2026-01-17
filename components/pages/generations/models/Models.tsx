"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Pencil, Plus, Sparkles, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { CreateModelDialog } from "@/components/shared/create/CreateModelDialog";
import { PublicationImage } from "@/components/shared/publication/PublicationImage";
import { ListLoader } from "@/components/states/loaders/Loaders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useDeleteFluxModel, useFluxModels } from "@/hooks/useFlux";
import { API_URL } from "@/lib/api";

export const Models = () => {
  const t = useTranslations("Pages.Models");
  const { data: models, isLoading } = useFluxModels();
  const deleteModel = useDeleteFluxModel();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modelToEdit, setModelToEdit] = useState<any>(null);

  const handleCreate = () => {
    setModelToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (model: any) => {
    setModelToEdit(model);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this model?")) {
      deleteModel.mutate(id);
    }
  };

  if (isLoading)
    return (
      <div className="section-padding">
        <ListLoader />
      </div>
    );

  return (
    <section className="section-padding container mx-auto max-w-6xl min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 mb-6 gap-4">
        <h1 className="title-text">{t("title")}</h1>
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 w-full sm:w-auto">
          <Button onClick={handleCreate} className="btn-outline flex-1 sm:flex-none gap-2">
            <Plus className="size-4" /> {t("create")}
          </Button>
          <Link href="/create/magic-photo" className="flex-1 sm:flex-none">
            <Button className="btn-solid w-full gap-2">
              <Sparkles className="size-4" /> {t("createMagic")}
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="my-4" />

      {!models || models.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-muted-foreground mb-4">{t("emptyDesc")}</p>
          <Button onClick={handleCreate} className="btn-solid">
            {t("createFirst")}
          </Button>
        </div>
      ) : (
        <div className="grid-3">
          {models.map((model) => (
            <Link href={`/create/models/${model.id}`} key={model.id}>
              <Card className="group relative overflow-hidden theme shadow-none py-0 h-full">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <PublicationImage
                    src={`${API_URL}${model.imagePaths[0]}`}
                    alt={model.name}
                    className="rounded-none!"
                  />
                </div>
                <CardHeader className="">
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <CardTitle className="text-lg truncate">{model.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleEdit(model); }}>
                          <Pencil className="mr-2 size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.preventDefault(); handleDelete(model.id); }}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash className="text-red-500 mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter className="py-4 text-xs text-muted-foreground flex items-end">
                  <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateModelDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modelToEdit={modelToEdit} type="flux" />
    </section>
  );
};