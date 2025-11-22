"use client";

import { TareaCard } from "@/components/tarea-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import * as React from "react";
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { IconLoader } from "@tabler/icons-react";

interface Tarea {
  id: number;
  nombre: string;
  descripcion: string;
  nombreParcela: string;
  completada: boolean;
}

interface Parcela {
  id: number;
  area: number;
  nombreParcela: string;
  tieneSiembra: boolean;
}

export default function Tareas() {
  const [filtroEstado, setFiltroEstado] = React.useState("todas");
  const [parcelas, setParcelas] = React.useState<Parcela[]>([]);
  const [tareas, setTareas] = React.useState<Tarea[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [formError, setFormError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    parcelaId: "",
    nombre: "",
    descripcion: "",
  });

  React.useEffect(() => {
    const fetchTarea = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Tarea`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
      });

      if (res.ok) {
        const { data }: { data: Tarea[] } = await res.json();

        setTareas(data);

        setLoading(false);
      }
    };

    const fetchParcela = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Parcela`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
      });

      if (res.ok) {
        const { data }: { data: Parcela[] } = await res.json();

        setParcelas(data);

        setLoading(false);
      }
    };

    fetchTarea();
    fetchParcela();
  }, []);

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

    if (!formData.parcelaId.trim()) {
      setFormError("La parcela es requerida");
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
        parcelaId: formData.parcelaId,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fechaProgramada: selectedDate,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();

      setFormError("Error al crear tarea");
      console.log(errorData);

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
      parcelaId: "",
      nombre: "",
      descripcion: "",
    });

    setOpen(false);
    setSubmitting(false);
  };

  const tareasFiltradas = tareas.filter((t) => {
    if (filtroEstado === "completadas") return t.completada === true;
    if (filtroEstado === "pendientes") return t.completada === false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tareas</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Organiza y gestiona todas tus tareas agrícolas
          </p>
        </div>
        <div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="completadas">Completadas</SelectItem>
              <SelectItem value="pendientes">Pendientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs">
        {loading ? (
          <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
            <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tareas.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No hay tareas disponibles
          </div>
        ) : (
          tareasFiltradas.map((tarea) => (
            <TareaCard key={tarea.id} tarea={tarea} />
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg"
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Nueva Tarea</DialogTitle>
            <DialogDescription>
              Agrega una nueva tarea a tu sistema de gestión.
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
    </div>
  );
}
