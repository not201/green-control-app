"use client";

import { NotificacionCard } from "@/components/notificacion-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLoader } from "@tabler/icons-react";
import * as React from "react";

interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEnvio: Date;
  leida: boolean;
}

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = React.useState<Notificacion[]>(
    [],
  );
  const [loading, setLoading] = React.useState(true);
  const [filtroEstado, setFiltroEstado] = React.useState("todas");

  React.useEffect(() => {
    const fetchNotificaciones = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Notificacion`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
          },
        },
      );

      if (res.ok) {
        const { data }: { data: Notificacion[] } = await res.json();

        setNotificaciones(data);

        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, []);

  const notificacionesFiltradas = notificaciones.filter((n) => {
    if (filtroEstado === "leidas") return n.leida === true;
    if (filtroEstado === "no-leidas") return n.leida === false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notificaciones</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestiona tus notificaciones
          </p>
        </div>
        <div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="leidas">Leídas</SelectItem>
              <SelectItem value="no-leidas">No leídas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs">
        {loading ? (
          <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-center h-[50vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No hay notificaciones disponibles
          </div>
        ) : (
          notificacionesFiltradas.map((notificacion) => (
            <NotificacionCard
              key={notificacion.id}
              notificacion={notificacion}
            />
          ))
        )}
      </div>
    </div>
  );
}
