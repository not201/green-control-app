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
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function ParcelaDetail() {
  const params = useParams();
  const router = useRouter();
  const [parcela, setParcela] = useState<Parcela | null>(null);
  const [loading, setLoading] = useState(true);

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

        setLoading(false);
      }
    };

    fetchParcela();
  }, [params.id]);

  if (loading) {
    return (
      <div className="grid place-content-center">
        <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
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
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <IconArrowLeft className="h-4 w-4" />
        Volver
      </Button>

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
    </div>
  );
}
