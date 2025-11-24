"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconArrowLeft, IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

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
      try {
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
        }
      } catch (error) {
        console.error("Error al cargar la notificación:", error);
      } finally {
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
      <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!notificacion) {
    return (
      <p className="text-center text-muted-foreground py-10">
        No se encontró la notificación
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Detalle de la Notificación</h1>
        <p className="text-muted-foreground">
          Información completa de la notificación recibida
        </p>
      </div>

      <div className="border rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <span className="text-sm text-muted-foreground">Título</span>
          <p className="font-semibold text-lg">{notificacion.titulo}</p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Mensaje</span>
          <p className="leading-relaxed whitespace-pre-wrap">
            {notificacion.descripcion}
          </p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Estado</span>
          <p
            className={`font-medium ${
              notificacion.leida ? "text-green-600" : "text-blue-600"
            }`}
          >
            {notificacion.leida ? "Leída" : "Nueva"}
          </p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Enviada</span>
          <p>{new Date(notificacion.fechaEnvio).toLocaleString("es-CO")}</p>
        </div>

        {notificacion.leida && notificacion.fechaLeido && (
          <div>
            <span className="text-sm text-muted-foreground">Leída</span>
            <p>{new Date(notificacion.fechaLeido).toLocaleString("es-CO")}</p>
          </div>
        )}

        {!notificacion.leida && (
          <Button onClick={marcarComoLeida} className="w-full">
            Marcar como leída
          </Button>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.back()}>
          <IconArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
    </div>
  );
}
