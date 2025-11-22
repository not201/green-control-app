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
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

        setLoading(false);
      }
    };

    fetchSiembra();
  }, [params.id]);

  if (loading) {
    return (
      <div className="grid place-content-center">
        <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
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
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <IconArrowLeft className="h-4 w-4" />
        Volver
      </Button>

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
                {new Date(siembra.fechaInicio).toLocaleString()}
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
                  ? new Date(siembra.fechaFinal).toLocaleString()
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
                  ? new Date(siembra.fechaGerminacion).toLocaleString()
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
                  ? new Date(siembra.fechaFloracion).toLocaleString()
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
