"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconLoader,
  IconFlower,
  IconPlant,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { DatePicker } from "@/components/date-picker";

interface Siembra {
  id: number;
  parcelaId: number;
  nombreParcela: string;
  cultivoId: number;
  nombreCultivo: string;
  fechaInicio: string;
  fechaFinal?: string | null;
  fechaGerminacion?: string | null;
  fechaFloracion?: string | null;
  activa: boolean;
}

export default function SiembraDetail() {
  const params = useParams();
  const router = useRouter();

  const [siembra, setSiembra] = useState<Siembra | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(undefined);
  const [fechaFinal, setFechaFinal] = useState<Date | undefined>(undefined);
  const [fechaGerminacion, setFechaGerminacion] = useState<Date | undefined>(
    undefined,
  );
  const [fechaFloracion, setFechaFloracion] = useState<Date | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchSiembra = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Siembra/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
          },
        },
      );

      if (res.ok) {
        const { data }: { data: Siembra } = await res.json();
        setSiembra(data);

        setFechaInicio(
          data.fechaInicio ? new Date(data.fechaInicio) : undefined,
        );
        setFechaFinal(data.fechaFinal ? new Date(data.fechaFinal) : undefined);
        setFechaGerminacion(
          data.fechaGerminacion ? new Date(data.fechaGerminacion) : undefined,
        );
        setFechaFloracion(
          data.fechaFloracion ? new Date(data.fechaFloracion) : undefined,
        );

        setLoading(false);
      }
    };

    fetchSiembra();
  }, [params.id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fechaInicio) {
      setFormError("La fecha de inicio es requerida");
      return;
    }

    setSubmitting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Siembra/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
        body: JSON.stringify({
          parcelaId: siembra?.parcelaId,
          cultivoId: siembra?.cultivoId,
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal || null,
          fechaGerminacion: fechaGerminacion || null,
          fechaFloracion: fechaFloracion || null,
          activa: siembra?.activa,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      setFormError("Error al actualizar la siembra");
      console.log(errorData);
      setSubmitting(false);
      return;
    }

    const { data }: { data: Siembra } = await res.json();
    setSiembra(data);
    setEditDialogOpen(false);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Siembra/${params.id}`,
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
    router.push("/panel/gestion/siembras");
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

  if (!siembra) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Siembra no encontrada</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <IconArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <IconEdit className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <IconTrash className="h-4 w-4 mr-1" /> Eliminar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <IconPlant className="h-7 w-7 text-green-600" />
          {siembra.nombreCultivo}
        </h1>

        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {siembra.activa ? (
            <IconLoader />
          ) : (
            <IconCheck className="fill-green-500 dark:fill-green-400" />
          )}
          {siembra.activa ? "En proceso" : "Terminada"}
        </Badge>

        <Card>
          <CardHeader>
            <CardTitle>Información general</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Cultivo</p>
              <p className="text-xl font-semibold">{siembra.nombreCultivo}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Parcela</p>
              <p className="text-xl font-semibold">{siembra.nombreParcela}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <IconCalendar className="h-4 w-4" />
                Fecha de inicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {new Date(siembra.fechaInicio).toLocaleString("es-CO")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <IconCalendar className="h-4 w-4" />
                Fecha final
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {siembra.fechaFinal
                  ? new Date(siembra.fechaFinal).toLocaleString("es-CO")
                  : "—"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <IconPlant className="h-4 w-4" />
                Germinación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {siembra.fechaGerminacion
                  ? new Date(siembra.fechaGerminacion).toLocaleString("es-CO")
                  : "—"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <IconFlower className="h-4 w-4" />
                Floración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {siembra.fechaFloracion
                  ? new Date(siembra.fechaFloracion).toLocaleString("es-CO")
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Siembra</DialogTitle>
            <DialogDescription>
              Actualiza los datos de la siembra de {siembra.nombreCultivo}.
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
                <Label htmlFor="fechaInicio">
                  Fecha de inicio <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  date={fechaInicio}
                  onSelect={setFechaInicio}
                  placeholder="Selecciona fecha"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="fechaFinal">Fecha final</Label>
                <DatePicker
                  date={fechaFinal}
                  onSelect={setFechaFinal}
                  placeholder="Selecciona fecha"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="fechaGerminacion">Fecha de germinación</Label>
                <DatePicker
                  date={fechaGerminacion}
                  onSelect={setFechaGerminacion}
                  placeholder="Selecciona fecha"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="fechaFloracion">Fecha de floración</Label>
                <DatePicker
                  date={fechaFloracion}
                  onSelect={setFechaFloracion}
                  placeholder="Selecciona fecha"
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
              la siembra de {siembra.nombreCultivo} en {siembra.nombreParcela}.
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
