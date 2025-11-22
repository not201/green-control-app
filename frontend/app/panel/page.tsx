"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconChecklist,
  IconBell,
  IconMapPin,
  IconLoader,
} from "@tabler/icons-react";
import * as React from "react";

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

interface Parcela {
  id: number;
  area: number;
  ubicacion: string;
  nombreParcela: string;
  tipoSuelo: string | null;
  phSuelo: number | null;
  tieneSiembra: boolean;
  siembraActual: any | null;
}

interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEnvio: string;
  fechaLeido: string | null;
  leida: boolean;
}

interface Ingreso {
  id: number;
  monto: number;
  fechaPago: string;
}

interface Gasto {
  id: number;
  monto: number;
  fechaGasto: string;
}

interface Analitica {
  ingresos: number;
  gastos: number;
  mes: string;
}

interface PanelData {
  tareas: Tarea[];
  parcelas: Parcela[];
  notificaciones: Notificacion[];
}

export default function PanelPage() {
  const [data, setData] = React.useState<PanelData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const getData = async (endpoint: string) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
              },
            },
          );
          return res;
        };

        const [tareasRes, parcelasRes, notificacionesRes] = await Promise.all([
          getData("/Tarea"),
          getData("/Parcela"),
          getData("/Notificacion"),
        ]);

        const parseJsonSafely = async (response: Response) => {
          if (!response.ok) return { data: [] };
          const text = await response.text();
          if (!text || text.trim() === "") return { data: [] };
          try {
            return JSON.parse(text);
          } catch {
            return { data: [] };
          }
        };

        const [tareasJson, parcelasJson, notificacionesJson] =
          await Promise.all([
            parseJsonSafely(tareasRes),
            parseJsonSafely(parcelasRes),
            parseJsonSafely(notificacionesRes),
          ]);

        setData({
          tareas: tareasJson.data || [],
          parcelas: parcelasJson.data || [],
          notificaciones: notificacionesJson.data || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData({
          tareas: [],
          parcelas: [],
          notificaciones: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const tareasActivas = data?.tareas.filter((t) => !t.completada).length || 0;
  const tareasPendientes = tareasActivas;
  const parcelasActivas =
    data?.parcelas.filter((p) => p.tieneSiembra).length || 0;
  const totalParcelas = data?.parcelas.length || 0;
  const notificacionesNoLeidas =
    data?.notificaciones.filter((n) => !n.leida).length || 0;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Panel de Control</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Monitorea el estado de tus cultivos en tiempo real
        </p>
      </div>

      {loading ? (
        <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
          <IconLoader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !data ? (
        <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
          <p>No hay datos disponibles</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-900/30 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-blue-700 dark:text-blue-400 font-medium">
                    Tareas Activas
                  </CardDescription>
                  <IconChecklist className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {tareasActivas}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                  {tareasPendientes} pendientes
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-900/30 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-green-700 dark:text-green-400 font-medium">
                    Parcelas Activas
                  </CardDescription>
                  <IconMapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">
                  {parcelasActivas}/{totalParcelas}
                </div>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  En producción activa
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-900/30 bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-orange-700 dark:text-orange-400 font-medium">
                    Notificaciones
                  </CardDescription>
                  <IconBell className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {notificacionesNoLeidas}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                  Sin leer
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-linear-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle>Resumen del día</CardTitle>
              <CardDescription>Estado actual de tus cultivos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Parcelas activas</span>
                <span className="text-sm font-bold text-green-600">
                  {parcelasActivas} de {totalParcelas}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm font-medium">Tareas pendientes</span>
                <span className="text-sm font-bold text-orange-600">
                  {tareasPendientes}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">
                  Notificaciones sin leer
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {notificacionesNoLeidas}
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
