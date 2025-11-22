"use client";

import { DatePicker } from "@/components/date-picker";
import { SiembraCard } from "@/components/siembra-card";
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
import { IconLoader } from "@tabler/icons-react";
import { Plus } from "lucide-react";
import * as React from "react";

interface Siembra {
  id: number;
  nombreParcela: string;
  nombreCultivo: string;
  activa: boolean;
}

interface Cultivo {
  id: number;
  nombre: string;
  especie: string;
}

interface Parcela {
  id: number;
  area: number;
  nombreParcela: string;
  tieneSiembra: boolean;
}

export default function SiembrasPage() {
  const [cultivos, setCultivos] = React.useState<Cultivo[]>([]);
  const [parcelas, setParcelas] = React.useState<Parcela[]>([]);
  const [filtroEstado, setFiltroEstado] = React.useState("todas");
  const [siembras, setSiembras] = React.useState<Siembra[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [formData, setFormData] = React.useState({
    parcelaId: "",
    cultivoId: "",
  });

  React.useEffect(() => {
    const fetchSiembra = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Siembra`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
      });

      if (res.ok) {
        const { data }: { data: Siembra[] } = await res.json();

        setSiembras(data);

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

    const fetchCultivo = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Cultivo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
      });

      if (res.ok) {
        const { data }: { data: Cultivo[] } = await res.json();

        setCultivos(data);

        setLoading(false);
      }
    };

    fetchCultivo();
    fetchParcela();
    fetchSiembra();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.parcelaId.trim()) {
      setFormError("La parcela es requerida");
      return;
    }

    if (!formData.cultivoId.trim()) {
      setFormError("El cultivo es requerido");
      return;
    }

    if (!selectedDate) {
      setFormError("La fecha es requerida");
      return;
    }

    setSubmitting(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Siembra`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
      },
      body: JSON.stringify({
        cultivoId: formData.cultivoId,
        parcelaId: formData.parcelaId,
        fechaInicio: selectedDate,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();

      setFormError("Error al crear siembra");
      console.log(errorData);

      return;
    }

    const { data }: { data: Siembra } = await res.json();

    setSiembras((prev) => [
      ...prev,
      {
        id: data.id,
        nombreParcela: data.nombreParcela,
        nombreCultivo: data.nombreCultivo,
        activa: data.activa,
      },
    ]);

    setFormData({
      cultivoId: "",
      parcelaId: "",
    });

    setOpen(false);
    setSubmitting(false);
  };

  const siembrasFiltradas = siembras.filter((s) => {
    if (filtroEstado === "enProceso") return s.activa === true;
    if (filtroEstado === "terminadas") return s.activa === false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Siembras</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestiona todas tus siembras
          </p>
        </div>
        <div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="terminadas">Terminadas</SelectItem>
              <SelectItem value="enProceso">En proceso</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs">
        {loading ? (
          <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
            <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : siembras.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No hay siembras disponibles
          </div>
        ) : (
          siembrasFiltradas.map((siembra) => (
            <SiembraCard key={siembra.id} siembra={siembra} />
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
            <DialogTitle>Nueva Siembra</DialogTitle>
            <DialogDescription>
              Registra una nueva siembra en tu sistema de gestión.
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
                <Label htmlFor="cultivoId">
                  Cultivo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.cultivoId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cultivoId: value })
                  }
                >
                  <SelectTrigger id="cultivoId">
                    <SelectValue placeholder="Selecciona un cultivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cultivos.length > 0 ? (
                      cultivos.map((cultivo) => (
                        <SelectItem
                          key={cultivo.id}
                          value={cultivo.id.toString()}
                        >
                          {cultivo.nombre} {cultivo.especie}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="sin-cultivos" disabled>
                        No hay cultivos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="fecha">
                  Fecha de inicio <span className="text-red-500">*</span>
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
                {submitting ? "Guardando..." : "Guardar cultivo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
