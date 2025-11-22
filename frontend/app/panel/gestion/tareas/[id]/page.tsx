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
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function TareaDetail() {
  const params = useParams();
  const router = useRouter();
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [loading, setLoading] = useState(true);

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

        setLoading(false);
      }
    };

    fetchTarea();
  }, [params.id]);

  if (loading) {
    return (
      <div className="grid place-content-center">
        <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
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

  const fechaProgramada = new Date(tarea.fechaProgramada).toLocaleDateString();
  const fechaFinalizacion = tarea.fechaFinalizacion
    ? new Date(tarea.fechaFinalizacion).toLocaleDateString()
    : "Pendiente";

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <IconArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="space-y-4 ">
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
                {fechaProgramada}
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
    </div>
  );
}
