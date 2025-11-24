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
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Gasto {
  id: number;
  fecha: string;
  monto: number;
  concepto: string;
  notaAdicional?: string;
  parcelaId?: number;
  nombreParcela?: string;
  esGeneral: boolean;
}

interface Parcela {
  id: number;
  nombreParcela: string;
}

export default function GastoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [gasto, setGasto] = useState<Gasto | null>(null);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    concepto: "",
    monto: "",
    notaAdicional: "",
    esGeneral: true,
    parcelaId: "",
  });

  useEffect(() => {
    const fetchGasto = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Gasto/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
            },
          },
        );

        if (res.ok) {
          const { data } = await res.json();
          setGasto(data);

          // Inicializar formulario de edición con los datos actuales
          setFormData({
            concepto: data.concepto,
            monto: data.monto.toString(),
            notaAdicional: data.notaAdicional || "",
            esGeneral: data.esGeneral,
            parcelaId: data.parcelaId?.toString() || "",
          });
          setSelectedDate(data.fecha ? new Date(data.fecha) : undefined);
        }
      } catch (error) {
        console.error("Error al cargar el gasto:", error);
      } finally {
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

    fetchGasto();
    fetchParcelas();
  }, [params.id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.concepto.trim()) {
      setFormError("El concepto es requerido");
      return;
    }

    if (!formData.monto.trim() || parseFloat(formData.monto) <= 0) {
      setFormError("El monto debe ser un número mayor a 0");
      return;
    }

    if (!selectedDate) {
      setFormError("La fecha es requerida");
      return;
    }

    if (!formData.esGeneral && !formData.parcelaId) {
      setFormError("Debes seleccionar una parcela");
      return;
    }

    setSubmitting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Gasto/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
        body: JSON.stringify({
          concepto: formData.concepto,
          monto: parseFloat(formData.monto),
          fecha: selectedDate,
          notaAdicional: formData.notaAdicional || null,
          esGeneral: formData.esGeneral,
          parcelaId: formData.esGeneral ? null : parseInt(formData.parcelaId),
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      setFormError("Error al actualizar el gasto");
      console.log(errorData);
      setSubmitting(false);
      return;
    }

    const { data }: { data: Gasto } = await res.json();
    setGasto(data);
    setEditDialogOpen(false);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Gasto/${params.id}`,
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
    router.push("/gastos");
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

  if (!gasto) {
    return (
      <p className="text-center text-muted-foreground py-10">
        No se encontró el gasto
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Detalle del Gasto</h1>
        <p className="text-muted-foreground">
          Información completa del gasto registrado
        </p>
      </div>

      <div className="border rounded-xl p-5 shadow-sm space-y-3">
        <div>
          <span className="text-sm text-muted-foreground">Concepto</span>
          <p className="font-semibold text-lg">{gasto.concepto}</p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Monto</span>
          <p className="text-xl font-bold text-red-600">
            ${gasto.monto.toLocaleString()}
          </p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Fecha</span>
          <p>{new Date(gasto.fecha).toLocaleDateString()}</p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Tipo</span>
          <p>
            {gasto.esGeneral
              ? "Gasto general"
              : `Parcela: ${gasto.nombreParcela}`}
          </p>
        </div>

        {gasto.notaAdicional && (
          <div>
            <span className="text-sm text-muted-foreground">
              Nota adicional
            </span>
            <p className="italic">{gasto.notaAdicional}</p>
          </div>
        )}
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Gasto</DialogTitle>
            <DialogDescription>
              Actualiza los datos del gasto.
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
                <Label htmlFor="concepto">
                  Concepto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="concepto"
                  placeholder="Fertilizante"
                  value={formData.concepto}
                  onChange={(e) =>
                    setFormData({ ...formData, concepto: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="monto">
                  Monto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  placeholder="100000"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="fecha">
                  Fecha <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  date={selectedDate}
                  onSelect={setSelectedDate}
                  placeholder="Selecciona fecha"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="tipo">
                  Tipo de gasto <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.esGeneral ? "general" : "parcela"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      esGeneral: value === "general",
                      parcelaId: value === "general" ? "" : formData.parcelaId,
                    })
                  }
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Gasto general</SelectItem>
                    <SelectItem value="parcela">Gasto de parcela</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!formData.esGeneral && (
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
              )}
              <div className="grid gap-1">
                <Label htmlFor="notaAdicional">Nota adicional</Label>
                <Input
                  id="notaAdicional"
                  placeholder="Información adicional..."
                  value={formData.notaAdicional}
                  onChange={(e) =>
                    setFormData({ ...formData, notaAdicional: e.target.value })
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
              el gasto de {gasto.concepto} por ${gasto.monto.toLocaleString()}.
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
