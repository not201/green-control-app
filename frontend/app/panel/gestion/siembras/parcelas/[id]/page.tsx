"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  IconArrowLeft,
  IconMapPin,
  IconRuler,
  IconLeaf,
  IconDeviceAnalytics,
  IconLoader,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlant,
  IconCalendar,
  IconPlus,
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
  DialogTrigger,
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
import { TareaCard } from "@/components/tarea-card";

interface Parcela {
  id: number;
  area: number;
  ubicacion: string;
  nombreParcela: string;
  tipoSuelo?: string | null;
  phSuelo?: number | null;
  tieneSiembra: boolean;
  siembraActual?: {
    id: number;
    fechaInicio: string;
    nombreCultivo: string;
  } | null;
}

interface Tarea {
  id: number;
  nombre: string;
  descripcion: string;
  nombreParcela: string;
  completada: boolean;
}

export default function ParcelaDetalles() {
  const params = useParams();
  const router = useRouter();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [parcela, setParcela] = useState<Parcela | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [editFormError, setEditFormError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [editFormData, setEditFormData] = useState({
    nombreParcela: "",
    area: "",
    ubicacion: "",
    tipoSuelo: "",
    phSuelo: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  useEffect(() => {
    const fetchParcela = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Parcela/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
          },
        },
      );

      if (res.ok) {
        const { data }: { data: Parcela } = await res.json();

        setParcela(data);

        // Inicializar formulario de edición con los datos actuales
        setEditFormData({
          nombreParcela: data.nombreParcela,
          area: data.area.toString(),
          ubicacion: data.ubicacion,
          tipoSuelo: data.tipoSuelo || "",
          phSuelo: data.phSuelo?.toString() || "",
        });

        setLoading(false);
      }
    };

    fetchParcela();
  }, [params.id]);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Tarea`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
            },
          },
        );
        if (response.ok) {
          const { data } = await response.json();
          const parcelaTareas = data.filter(
            (t: Tarea) => t.nombreParcela === parcela?.nombreParcela,
          );

          const tareasPendientes = parcelaTareas.filter(
            (t: Tarea) => t.completada === false,
          );

          setTareas(tareasPendientes);
        }
      } catch (error) {
        console.error("Error fetching tareas:", error);
      }
    };

    if (parcela) {
      fetchTareas();
    }
  }, [parcela]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditFormError("");

    if (!editFormData.nombreParcela.trim()) {
      setEditFormError("El nombre de la parcela es requerido");
      return;
    }

    if (!editFormData.area.trim() || parseFloat(editFormData.area) <= 0) {
      setEditFormError("El área debe ser un número mayor a 0");
      return;
    }

    if (!editFormData.ubicacion.trim()) {
      setEditFormError("La ubicación es requerida");
      return;
    }

    setEditSubmitting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Parcela/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
        body: JSON.stringify({
          nombreParcela: editFormData.nombreParcela,
          area: parseFloat(editFormData.area),
          ubicacion: editFormData.ubicacion,
          tipoSuelo: editFormData.tipoSuelo || null,
          phSuelo: editFormData.phSuelo
            ? parseFloat(editFormData.phSuelo)
            : null,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      setEditFormError("Error al actualizar la parcela");
      console.log(errorData);
      setEditSubmitting(false);
      return;
    }

    const { data }: { data: Parcela } = await res.json();
    setParcela(data);
    setEditDialogOpen(false);
    setEditSubmitting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Parcela/${params.id}`,
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
    router.push("/parcelas");
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!selectedDate) {
      setFormError("La fecha es requerida");
      return;
    }

    setSubmitting(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Tarea`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
      },
      body: JSON.stringify({
        parcelaId: parcela!.id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fechaProgramada: selectedDate,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();

      setFormError("Error al crear tarea");
      console.log(errorData);

      setSubmitting(false);
      return;
    }

    const { data }: { data: Tarea } = await res.json();

    setTareas((prev) => [
      ...prev,
      {
        id: data.id,
        nombreParcela: data.nombreParcela,
        nombre: data.nombre,
        completada: data.completada,
        descripcion: data.descripcion,
      },
    ]);

    setFormData({
      nombre: "",
      descripcion: "",
    });

    setOpen(false);
    setSubmitting(false);
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

  if (!parcela) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Parcela no encontrada</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

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

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
          <IconMapPin className="h-6 w-6 text-green-400" />
          {parcela.nombreParcela}
        </h1>

        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-muted-foreground px-1.5 self-start"
          >
            {parcela.tieneSiembra ? (
              <IconPlayerPauseFilled className="fill-green-500 dark:fill-green-400" />
            ) : (
              <IconPlayerPlayFilled />
            )}
            {parcela.tieneSiembra ? "Activa" : "Inactiva"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconRuler className="h-5 w-5" />
              Área
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{parcela.area} ha</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{parcela.ubicacion}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDeviceAnalytics className="h-5 w-5" />
              Tipo de suelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{parcela.tipoSuelo ?? "—"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconLeaf className="h-5 w-5" />
              pH del suelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{parcela.phSuelo ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      {parcela.tieneSiembra && parcela.siembraActual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPlant className="h-5 w-5" />
              Siembra Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Tipo de cultivo</p>
              <p className="text-xl font-semibold">
                {parcela.siembraActual.nombreCultivo}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Fecha de siembra</p>
              <p className="text-xl font-semibold">
                {new Date(parcela.siembraActual.fechaInicio).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!parcela.tieneSiembra && (
        <Card>
          <CardHeader>
            <CardTitle>No hay siembra activa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta parcela no tiene una siembra registrada actualmente.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <IconCalendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Tareas de esta parcela
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <IconPlus className="h-4 w-4" />
                Añadir tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[425px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Nueva Tarea</DialogTitle>
                <DialogDescription>
                  Agrega una nueva tarea específica para esta parcela.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
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
                      placeholder="Mantenimiento de la parcela"
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descripcion: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-1">
                    <Label>Parcela</Label>
                    <Input value={parcela.nombreParcela} disabled />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="fecha">
                      Fecha programada <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      date={selectedDate}
                      onSelect={setSelectedDate}
                      placeholder="Selecciona fecha"
                      disabledBefore={new Date()}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : "Guardar tarea"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {tareas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay tareas asignadas a esta parcela
            </p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tareas.map((tarea) => (
                <TareaCard key={tarea.id} tarea={tarea} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Parcela</DialogTitle>
            <DialogDescription>
              Actualiza los datos de la parcela {parcela.nombreParcela}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4 overflow-y-auto overflow-x-hidden">
              {editFormError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {editFormError}
                </div>
              )}
              <div className="grid gap-1">
                <Label htmlFor="nombreParcela">
                  Nombre de la parcela <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombreParcela"
                  placeholder="Parcela A"
                  value={editFormData.nombreParcela}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      nombreParcela: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="area">
                  Área (hectáreas) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="area"
                  type="number"
                  step="0.01"
                  placeholder="10.5"
                  value={editFormData.area}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, area: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="ubicacion">
                  Ubicación <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ubicacion"
                  placeholder="Sector Norte"
                  value={editFormData.ubicacion}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      ubicacion: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="tipoSuelo">Tipo de suelo</Label>
                <Input
                  id="tipoSuelo"
                  placeholder="Arcilloso"
                  value={editFormData.tipoSuelo}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      tipoSuelo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="phSuelo">pH del suelo</Label>
                <Input
                  id="phSuelo"
                  type="number"
                  step="0.1"
                  placeholder="6.5"
                  value={editFormData.phSuelo}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phSuelo: e.target.value,
                    })
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
              <Button type="submit" disabled={editSubmitting}>
                {editSubmitting ? "Guardando..." : "Guardar cambios"}
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
              la parcela {parcela.nombreParcela} y todos sus datos asociados.
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
