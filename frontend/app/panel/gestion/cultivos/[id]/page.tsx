"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconLeaf,
  IconLoader,
  IconFileText,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Cultivo {
  id: number;
  nombre: string;
  especie: string;
}

export default function CultivoDetalle() {
  const params = useParams();
  const router = useRouter();
  const [cultivo, setCultivo] = useState<Cultivo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCultivo = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Cultivo/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
          },
        },
      );

      if (res.ok) {
        const { data }: { data: Cultivo } = await res.json();

        setCultivo(data);

        setLoading(false);
      }
    };

    fetchCultivo();
  }, [params.id]);

  if (loading) {
    return (
      <div className="grid place-content-center">
        <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cultivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Cultivo no encontrado</p>
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
          <IconLeaf className="h-6 w-6 text-green-600" />
          {cultivo.nombre}
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Información del cultivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="text-xl font-semibold">{cultivo.nombre}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Especie</p>
              <p className="text-xl font-semibold">{cultivo.especie}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
