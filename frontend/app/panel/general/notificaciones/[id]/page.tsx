"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { IconLoader } from "@tabler/icons-react";

interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEnvio: string;
  fechaLeido?: string | null;
  leida: boolean;
}

export default function NotificacionDetalle() {
  const params = useParams();
  const router = useRouter();

  const [notificacion, setNotificacion] = useState<Notificacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificacion = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Notificacion/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
          },
        },
      );

      if (res.ok) {
        const { data }: { data: Notificacion } = await res.json();

        setNotificacion(data);

        setLoading(false);
      }
    };

    fetchNotificacion();
  }, [params.id]);

  const marcarComoLeida = async () => {
    if (!notificacion) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Notificacion/${notificacion.id}/marcar-leida`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
      },
    );

    if (res.ok) {
      setNotificacion({
        ...notificacion,
        leida: true,
        fechaLeido: new Date().toISOString(),
      });
    }
  };

  if (loading) {
    return (
      <div className="grid place-content-center">
        <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!notificacion) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">No se encontró la notificación.</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {notificacion.titulo}
          </CardTitle>

          {notificacion.leida ? (
            <Badge className="bg-green-600/20 text-green-700">Leída</Badge>
          ) : (
            <Badge className="bg-blue-600/20 text-blue-700">Nueva</Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-base text-muted-foreground leading-relaxed wrap-break-word whitespace-pre-wrap">
            {notificacion.descripcion}
          </p>

          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <strong>Enviada:</strong>{" "}
              {new Date(notificacion.fechaEnvio).toLocaleString()}
            </p>

            {notificacion.leida && (
              <p>
                <strong>Leída:</strong>{" "}
                {new Date(notificacion.fechaLeido!).toLocaleString()}
              </p>
            )}
          </div>

          {!notificacion.leida && (
            <Button className="flex gap-2" onClick={marcarComoLeida}>
              <CheckCircle className="h-4 w-4" />
              Marcar como leída
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
