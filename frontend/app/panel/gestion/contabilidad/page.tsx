"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IconLoader } from "@tabler/icons-react";

interface Ingreso {
  id: number;
  fecha: string;
  monto: number;
  concepto: string;
  notaAdicional: string | null;
}

interface Gasto {
  id: number;
  fecha: string;
  monto: number;
  concepto: string;
  notaAdicional: string | null;
}

interface AnaliticaTemporal {
  mes: string;
  ingresos: number;
  gastos: number;
}

interface AnaliticasData {
  analiticasTemporales: AnaliticaTemporal[];
  totales: {
    ingresosTotales: number;
    gastosTotales: number;
    balanceTotal: number;
    margenPromedio: number;
  };
}

const chartConfig = {
  ingresos: {
    label: "Ingresos",
    color: "#10b981",
  },
  gastos: {
    label: "Gastos",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export default function ContabilidadPage() {
  const [data, setData] = useState<AnaliticasData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

        const [ingresosRes, gastosRes] = await Promise.all([
          getData("/Ingreso"),
          getData("/Gasto"),
        ]);

        const parseJsonSafely = async (response: Response) => {
          if (!response.ok) return { data: [] };
          const text = await response.text();
          if (!text || text.trim() === "") return { data: [] };
          try {
            const parsed = JSON.parse(text);
            return parsed;
          } catch {
            return { data: [] };
          }
        };

        const [ingresosJson, gastosJson] = await Promise.all([
          parseJsonSafely(ingresosRes),
          parseJsonSafely(gastosRes),
        ]);

        const ingresos: Ingreso[] = Array.isArray(ingresosJson.data)
          ? ingresosJson.data
          : [];
        const gastos: Gasto[] = Array.isArray(gastosJson.data)
          ? gastosJson.data
          : [];

        const ingresosTotales = ingresos.reduce(
          (sum, item) => sum + (item.monto || 0),
          0,
        );
        const gastosTotales = gastos.reduce(
          (sum, item) => sum + (item.monto || 0),
          0,
        );
        const balanceTotal = ingresosTotales - gastosTotales;
        const margenPromedio =
          ingresosTotales > 0 ? (balanceTotal / ingresosTotales) * 100 : 0;

        const mesesMap = new Map<
          string,
          { ingresos: number; gastos: number }
        >();

        ingresos.forEach((ingreso) => {
          const fecha = new Date(ingreso.fecha);
          const fechaValida = fecha.getFullYear() > 1 ? fecha : new Date();

          const mesKey = fechaValida.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
          });

          if (!mesesMap.has(mesKey)) {
            mesesMap.set(mesKey, { ingresos: 0, gastos: 0 });
          }
          const mes = mesesMap.get(mesKey)!;
          mes.ingresos += ingreso.monto;
        });

        gastos.forEach((gasto) => {
          const fecha = new Date(gasto.fecha);
          const fechaValida = fecha.getFullYear() > 1 ? fecha : new Date();

          const mesKey = fechaValida.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
          });

          if (!mesesMap.has(mesKey)) {
            mesesMap.set(mesKey, { ingresos: 0, gastos: 0 });
          }
          const mes = mesesMap.get(mesKey)!;
          mes.gastos += gasto.monto;
        });

        const analiticasTemporales: AnaliticaTemporal[] = Array.from(
          mesesMap.entries(),
        )
          .sort((a, b) => {
            const dateA = new Date(a[0]);
            const dateB = new Date(b[0]);
            return dateA.getTime() - dateB.getTime();
          })
          .map(([mes, datos]) => ({
            mes,
            ingresos: datos.ingresos,
            gastos: datos.gastos,
          }));

        setData({
          analiticasTemporales,
          totales: {
            ingresosTotales,
            gastosTotales,
            balanceTotal,
            margenPromedio,
          },
        });
      } catch (error) {
        console.error("Error fetching analiticas:", error);
        setData({
          analiticasTemporales: [],
          totales: {
            ingresosTotales: 0,
            gastosTotales: 0,
            balanceTotal: 0,
            margenPromedio: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tendencia =
    data && data.totales.balanceTotal >= 0 ? "positiva" : "negativa";
  const porcentajeTendencia = data && Math.abs(data.totales.margenPromedio);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Contabilidad</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Visualización de rendimiento y estadísticas financieras
        </p>
      </div>

      {loading ? (
        <div className="place-items-center col-span-1 sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      ) : !data ? (
        <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
          <p>No hay datos disponibles</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-green-200 dark:border-green-900/30 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                  Ingresos Totales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">
                  $COP{data.totales.ingresosTotales.toLocaleString("es-CO")}
                </div>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  Total acumulado
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900/30 bg-linear-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
                  Gastos Totales
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300">
                  $COP{data.totales.gastosTotales.toLocaleString("es-CO")}
                </div>
                <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                  Total acumulado
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-900/30 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Balance Total
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-xl sm:text-2xl font-bold ${
                    data.totales.balanceTotal >= 0
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  $COP{data.totales.balanceTotal.toLocaleString("es-CO")}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                  Ingresos - Gastos
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-900/30 bg-linear-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Margen Promedio
                </CardTitle>
                <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-xl sm:text-2xl font-bold ${
                    data.totales.margenPromedio >= 0
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {data.totales.margenPromedio.toFixed(1)}%
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">
                  Rentabilidad
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolución Financiera</CardTitle>
                <CardDescription>
                  Comparación mensual de ingresos y gastos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.analiticasTemporales &&
                data.analiticasTemporales.length > 0 ? (
                  <ChartContainer config={chartConfig}>
                    <LineChart
                      accessibilityLayer
                      data={data.analiticasTemporales}
                      margin={{ top: 12, bottom: 0, left: 12, right: 12 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="mes"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Line
                        dataKey="ingresos"
                        type="monotone"
                        stroke="var(--color-ingresos)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        dataKey="gastos"
                        type="monotone"
                        stroke="var(--color-gastos)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No hay datos disponibles para mostrar
                  </div>
                )}
              </CardContent>
              {data.analiticasTemporales &&
                data.analiticasTemporales.length > 0 && (
                  <div className="border-t px-6 pt-6">
                    <div className="flex w-full items-start gap-2 text-sm">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                          Tendencia {tendencia} del{" "}
                          {porcentajeTendencia?.toFixed(1)}%{" "}
                          {tendencia === "positiva" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                          Mostrando análisis financiero de{" "}
                          {data.analiticasTemporales.length} mes
                          {data.analiticasTemporales.length !== 1 ? "es" : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
