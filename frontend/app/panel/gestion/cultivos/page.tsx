"use client";

import { CultivoCard } from "@/components/cultivo-card";
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
import { IconLoader } from "@tabler/icons-react";
import { Plus } from "lucide-react";
import * as React from "react";

interface Cultivo {
  id: number;
  nombre: string;
  especie: string;
}

export default function CultivosPage() {
  const [cultivos, setCultivos] = React.useState<Cultivo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nombre: "",
    especie: "",
  });

  React.useEffect(() => {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Cultivo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
      },
      body: JSON.stringify({
        nombre: formData.nombre,
        especie: formData.especie,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();

      setFormError("Error al crear cultivo");
      console.log(errorData);

      return;
    }

    const { data }: { data: Cultivo } = await res.json();

    setCultivos((prev) => [
      ...prev,
      {
        id: data.id,
        nombre: data.nombre,
        especie: data.especie,
      },
    ]);

    setFormData({
      nombre: "",
      especie: "",
    });

    setOpen(false);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Cultivos</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gestiona todos tus cultivos
        </p>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs">
        {loading ? (
          <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
            <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : cultivos.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No hay cultivos disponibles
          </div>
        ) : (
          cultivos.map((cultivo) => (
            <CultivoCard key={cultivo.id} cultivo={cultivo} />
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
            <DialogTitle>Nuevo Cultivo</DialogTitle>
            <DialogDescription>
              Registra un nuevo cultivo en tu sistema de gestión.
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
                  Nombre del cultivo <span className="text-red-500">*</span>
                </Label>
                <Input
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
