"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconCircleCheckFilled,
  IconClock,
  IconCalendar,
  IconLoader,
  IconFileText,
  IconCircleCheck,
  IconMapPin,
  IconChecklist,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tarea {
  id: number;
  fechaProgramada: string;
  fechaFinalizacion: string | null;
  nombre: string;
  descripcion: string;
  parcelaId: number;
  nombreParcela: string;
  completada: boolean;
}

interface Parcela {
  id: number;
  nombreParcela: string;
}

export default function TareaDetail() {
  const params = useParams();
  const router = useRouter();
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fechaProgramada, setFechaProgramada] = useState<Date | undefined>(
    undefined,
  );
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    parcelaId: "",
  });

  useEffect(() => {
    const fetchTarea = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Tarea/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
          },
        },
      );

      if (res.ok) {
        const { data }: { data: Tarea } = await res.json();

        setTarea(data);

        // Inicializar formulario de edición con los datos actuales
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          parcelaId: data.parcelaId.toString(),
        });
        setFechaProgramada(
          data.fechaProgramada ? new Date(data.fechaProgramada) : undefined,
        );

        setLoading(false);
      }
    };

    const fetchParcelas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Parcela`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
          },
        });

        if (res.ok) {
          const { data }: { data: Parcela[] } = await res.json();
          setParcelas(data);
        }
      } catch (error) {
        console.error("Error al cargar parcelas:", error);
      }
    };

    fetchTarea();
    fetchParcelas();
  }, [params.id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.nombre.trim()) {
      setFormError("El nombre es requerido");
      return;
    }

    if (!formData.descripcion.trim()) {
      setFormError("La descripción es requerida");
      return;
    }

    if (!formData.parcelaId) {
      setFormError("Debes seleccionar una parcela");
      return;
    }

    if (!fechaProgramada) {
      setFormError("La fecha programada es requerida");
      return;
    }

    setSubmitting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Tarea/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          parcelaId: parseInt(formData.parcelaId),
          fechaProgramada: fechaProgramada,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      setFormError("Error al actualizar la tarea");
      console.log(errorData);
      setSubmitting(false);
      return;
    }

    const { data }: { data: Tarea } = await res.json();
    setTarea(data);
    setEditDialogOpen(false);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Tarea/${params.id}`,
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
    router.push("/tareas");
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

  if (!tarea) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Tarea no encontrada</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  const fechaProgramadaStr = new Date(tarea.fechaProgramada).toLocaleDateString(
    "es-CO",
  );
  const fechaFinalizacion = tarea.fechaFinalizacion
    ? new Date(tarea.fechaFinalizacion).toLocaleDateString("es-CO")
    : "Pendiente";

  return (
    <div className="space-y-4">
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
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
            <IconChecklist className="h-6 w-6 text-blue-400" />
            {tarea.nombre}
          </h1>

          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 self-start"
            >
              {tarea.completada ? (
                <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
              ) : (
                <IconCircleCheck />
              )}
              {tarea.completada ? "Completada" : "Pendiente"}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <IconFileText className="h-4 w-4" />
              Descripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {tarea.descripcion}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                Fecha programada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-2xl font-semibold">
                {fechaProgramadaStr}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <IconClock className="h-4 w-4" />
                Fecha de finalización
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-2xl font-semibold">
                {fechaFinalizacion}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <IconMapPin className="h-4 w-4" />
                Parcela
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-2xl font-semibold">
                {tarea.nombreParcela}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
            <DialogDescription>
              Actualiza los datos de la tarea {tarea.nombre}.
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
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Mantenimiento"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="descripcion">
                  Descripción <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="descripcion"
                  placeholder="Mantenimiento de la parcela"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="parcelaId">
                  Parcela <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.parcelaId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parcelaId: value })
                  }
                >
                  <SelectTrigger id="parcelaId">
                    <SelectValue placeholder="Selecciona una parcela" />
                  </SelectTrigger>
                  <SelectContent>
                    {parcelas.length > 0 ? (
                      parcelas.map((parcela) => (
                        <SelectItem
                          key={parcela.id}
                          value={parcela.id.toString()}
                        >
                          {parcela.nombreParcela}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="sin-parcelas" disabled>
                        No hay parcelas disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="fecha">
                  Fecha programada <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  date={fechaProgramada}
                  onSelect={setFechaProgramada}
                  placeholder="Selecciona fecha"
                  disabledBefore={new Date()}
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
              la tarea "{tarea.nombre}" de la parcela {tarea.nombreParcela}.
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
