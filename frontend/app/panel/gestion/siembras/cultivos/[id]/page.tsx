"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconEdit,
  IconLoader,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Cultivo {
  nombre: string;
  especie: string;
}

export default function CultivoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [cultivo, setCultivo] = useState<Cultivo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
  });

  useEffect(() => {
    const fetchCultivo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Cultivo/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
            },
          },
        );

        if (res.ok) {
          const { data } = await res.json();
          setCultivo(data);

          setFormData({
            nombre: data.nombre,
            especie: data.especie,
          });
        }
      } catch (error) {
        console.error("Error al cargar el cultivo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCultivo();
  }, [params.id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.nombre.trim()) {
      setFormError("El nombre es requerido");
      return;
    }

    if (!formData.especie.trim()) {
      setFormError("La especie es requerida");
      return;
    }

    setSubmitting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Cultivo/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          especie: formData.especie,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      setFormError("Error al actualizar el cultivo");
      console.log(errorData);
      setSubmitting(false);
      return;
    }

    const { data }: { data: Cultivo } = await res.json();
    setCultivo(data);
    setEditDialogOpen(false);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Cultivo/${params.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.log("Error al eliminar:", errorData);
      setDeleting(false);
      return;
    }

    setDeleting(false);
    setDeleteDialogOpen(false);
    router.push("/cultivos");
  };

  if (loading) {
    return (
      <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!cultivo) {
    return (
      <p className="text-center text-muted-foreground py-10">
        No se encontró el cultivo
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Detalle del Cultivo</h1>
        <p className="text-muted-foreground">
          Información completa del cultivo registrado
        </p>
      </div>

      <div className="border rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <span className="text-sm text-muted-foreground">Nombre</span>
          <p className="font-semibold text-lg">{cultivo.nombre}</p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Especie</span>
          <p className="text-base">{cultivo.especie}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          <IconArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
          <IconEdit className="h-4 w-4 mr-1" /> Editar
        </Button>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <IconTrash className="h-4 w-4 mr-1" /> Eliminar
        </Button>
      </div>

      {/* Dialog para editar */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Cultivo</DialogTitle>
            <DialogDescription>
              Actualiza los datos del cultivo {cultivo.nombre}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4 overflow-y-auto overflow-x-hidden">
              {formError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {formError}
                </div>
              )}
              <div className="grid gap-1">
                <Label htmlFor="nombre">
                  Nombre del cultivo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Tomate"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="especie">
                  Especie <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="especie"
                  placeholder="Chonto"
                  value={formData.especie}
                  onChange={(e) =>
                    setFormData({ ...formData, especie: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el cultivo {cultivo.nombre} ({cultivo.especie}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
