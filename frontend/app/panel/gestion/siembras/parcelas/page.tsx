"use client";

import { ParcelaCard } from "@/components/parcela-card";
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

interface Parcela {
  id: number;
  area: number;
  nombreParcela: string;
  tieneSiembra: boolean;
}

export default function ParcelasPage() {
  const [filtroEstado, setFiltroEstado] = React.useState("todas");
  const [parcelas, setParcelas] = React.useState<Parcela[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    area: "",
    ubicacion: "",
    nombreParcela: "",
    tipoSuelo: "",
    phSuelo: "",
  });

  React.useEffect(() => {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.nombreParcela.trim()) {
      setFormError("El nombre es requerido");
      return;
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      setFormError("El área debe ser mayor a 0");
      return;
    }

    if (!formData.ubicacion.trim()) {
      setFormError("La ubicación es requerida");
      return;
    }

    setSubmitting(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Parcela`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
      },
      body: JSON.stringify({
        nombreParcela: formData.nombreParcela,
        area: parseFloat(formData.area),
        tipoSuelo: formData.tipoSuelo,
        phSuelo: parseFloat(formData.phSuelo),
        ubicacion: formData.ubicacion,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();

      setFormError("Error al crear parcela");
      console.log(errorData);

      setSubmitting(false);

      return;
    }

    const { data }: { data: Parcela } = await res.json();

    setParcelas((prev) => [
      ...prev,
      {
        id: data.id,
        nombreParcela: data.nombreParcela,
        area: data.area,
        tieneSiembra: data.tieneSiembra,
      },
    ]);

    setFormData({
      nombreParcela: "",
      area: "",
      tipoSuelo: "",
      phSuelo: "",
      ubicacion: "",
    });

    setOpen(false);
    setSubmitting(false);
  };

  const parcelasFiltradas = parcelas.filter((p) => {
    if (filtroEstado === "activas") return p.tieneSiembra === true;
    if (filtroEstado === "inactivas") return p.tieneSiembra === false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Parcelas</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestiona todas tus parcelas
          </p>
        </div>
        <div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="inactivas">Inactivas</SelectItem>
              <SelectItem value="activas">Activas</SelectItem>
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
        ) : parcelas.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No hay parcelas disponibles
          </div>
        ) : (
          parcelasFiltradas.map((parcela) => (
            <ParcelaCard key={parcela.id} parcela={parcela} />
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
            <DialogTitle>Nueva Parcela</DialogTitle>
            <DialogDescription>
              Registra una nueva parcela en tu sistema de gestión.
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
                <Label htmlFor="nombreParcela">
                  Nombre de la parcela <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Parcela Norte"
                  value={formData.nombreParcela}
                  onChange={(e) =>
                    setFormData({ ...formData, nombreParcela: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2 grid-cols-2">
                <div className="grid gap-1">
                  <Label htmlFor="area">
                    Área (hectáreas) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="2.5"
                    step="0.1"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phSuelo">pH del suelo</Label>
                  <Input
                    placeholder="6.5"
                    type="number"
                    step="0.1"
                    value={formData.phSuelo}
                    onChange={(e) =>
                      setFormData({ ...formData, phSuelo: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="ubicacion">
                  Ubicación <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Sector A, Invernadero 1"
                  value={formData.ubicacion}
                  onChange={(e) =>
                    setFormData({ ...formData, ubicacion: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="tipoSuelo">Tipo de suelo</Label>
                <Input
                  placeholder="Arcilloso, Arenoso, etc."
                  value={formData.tipoSuelo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoSuelo: e.target.value })
                  }
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
                {submitting ? "Guardando..." : "Guardar parcela"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
