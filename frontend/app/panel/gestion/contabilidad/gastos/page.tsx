"use client";

import { DatePicker } from "@/components/date-picker";
import { GastoCard } from "@/components/gasto-card";
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
import { Input } from "@/components/ui/input";
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

interface Gasto {
  id: number;
  fecha: string;
  monto: number;
  concepto: string;

  nombreParcela?: string;
  esGeneral: boolean;
}

interface Parcela {
  id: number;
  area: number;
  nombreParcela: string;
  tieneSiembra: boolean;
}

export default function GastosPage() {
  const [gastos, setGastos] = React.useState<Gasto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [parcelas, setParcelas] = React.useState<Parcela[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [filtroEstado, setFiltroEstado] = React.useState("todos");
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [formData, setFormData] = React.useState({
    monto: "",
    concepto: "",
    notaAdicional: "",
    parcelaId: undefined as string | undefined,
  });

  React.useEffect(() => {
    const fetchGasto = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Gasto`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
      });

      if (res.ok) {
        const { data }: { data: Gasto[] } = await res.json();

        setGastos(data);

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

    fetchParcela();
    fetchGasto();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.monto.trim()) {
      setFormError("El monto es requerido");
      return;
    }

    if (!formData.concepto.trim()) {
      setFormError("El concepto es requerido");
      return;
    }

    if (!selectedDate) {
      setFormError("La fecha de gasto es requerida");
      return;
    }

    setSubmitting(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Gasto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
      },
      body: JSON.stringify({
        monto: formData.monto,
        concepto: formData.concepto,
        fecha: selectedDate,

        notaAdicional: formData.notaAdicional,
        parcelaId: formData.parcelaId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();

      setFormError("Error al crear gasto");
      console.log(errorData);

      setSubmitting(false);

      return;
    }

    const { data }: { data: Gasto } = await res.json();

    setGastos((prev) => [
      ...prev,
      {
        id: data.id,
        fecha: data.fecha,
        monto: data.monto,
        concepto: data.concepto,

        nombreParcela: data.nombreParcela,
        esGeneral: data.esGeneral,
      },
    ]);

    setFormData({
      concepto: "",
      monto: "",
      notaAdicional: "",
      parcelaId: undefined as string | undefined,
    });

    setOpen(false);
    setSubmitting(false);
  };

  const gastosFiltrados = gastos.filter((g) => {
    if (filtroEstado === "generales") return g.esGeneral === true;
    if (filtroEstado === "por-parcelas") return g.esGeneral === false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gastos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestiona todos tus gastos
          </p>
        </div>
        <div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="generales">Generales</SelectItem>
              <SelectItem value="por-parcelas">Por parcelas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs">
        {loading ? (
          <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-center h-[50vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        ) : gastos.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No hay gastos disponibles
          </div>
        ) : (
          gastosFiltrados.map((gasto) => (
            <GastoCard key={gasto.id} gasto={gasto} />
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
            <DialogTitle>Nuevo Gasto</DialogTitle>
            <DialogDescription>
              Registra un nuevo gasto en tu sistema de gestión.
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
                <Label htmlFor="monto">
                  Monto <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="120000"
                  step="10"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="concepto">
                  Concepto <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Compra de semillas"
                  value={formData.concepto}
                  onChange={(e) =>
                    setFormData({ ...formData, concepto: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="fecha">
                  Fecha de gasto <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  date={selectedDate}
                  onSelect={setSelectedDate}
                  placeholder="Selecciona fecha"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="concepto">Nota adicional</Label>
                <Input
                  placeholder="Semillas de maiz transgénico"
                  value={formData.notaAdicional}
                  onChange={(e) =>
                    setFormData({ ...formData, notaAdicional: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="parcelaId">Parcela</Label>
                <Select
                  value={formData.parcelaId ?? "sin-parcelas"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      parcelaId: value === "sin-parcelas" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger id="parcelaId">
                    <SelectValue placeholder="Gasto general (sin parcela)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sin-parcelas">
                      Gasto general (sin parcela)
                    </SelectItem>
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
                      <SelectItem value="sin-parcelas-disponibles" disabled>
                        No hay parcelas disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
                {submitting ? "Guardando..." : "Guardar gasto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
