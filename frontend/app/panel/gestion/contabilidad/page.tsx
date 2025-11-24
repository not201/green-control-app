"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ingreso {
  id: number;
  fecha: string;
  monto: number;
  concepto: string;
  notaAdicional: string | null;
  parcelaId: number | null;
  nombreParcela: string | null;
  esGeneral: boolean;
}

interface Gasto {
  id: number;
  fecha: string;
  monto: number;
  concepto: string;
  notaAdicional: string | null;
  parcelaId: number | null;
  nombreParcela: string | null;
  esGeneral: boolean;
}

interface RentabilidadParcela {
  nombreParcela: string;
  ingresos: number;
  gastos: number;
  balance: number;
  margen: number;
}

interface AnaliticasData {
  totales: {
    ingresosTotales: number;
    gastosTotales: number;
    balanceTotal: number;
    margenPromedio: number;
  };
  rentabilidadPorParcela: RentabilidadParcela[];
}

const columns: ColumnDef<RentabilidadParcela>[] = [
  {
    accessorKey: "nombreParcela",
    header: "Parcela",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("nombreParcela")}</div>
    ),
  },
  {
    accessorKey: "ingresos",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent -ml-4"
        >
          Ingresos
          <IconChevronDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-green-600 dark:text-green-400 font-semibold">
        ${row.getValue<number>("ingresos").toLocaleString("es-CO")}
      </div>
    ),
  },
  {
    accessorKey: "gastos",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent -ml-4"
        >
          Gastos
          <IconChevronDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-red-600 dark:text-red-400 font-semibold">
        ${row.getValue<number>("gastos").toLocaleString("es-CO")}
      </div>
    ),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent -ml-4"
        >
          Balance
          <IconChevronDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const balance = row.getValue<number>("balance");
      return (
        <div
          className={`font-bold ${
            balance >= 0
              ? "text-blue-600 dark:text-blue-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          ${balance.toLocaleString("es-CO")}
        </div>
      );
    },
  },
  {
    accessorKey: "margen",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent -ml-4"
        >
          Margen (%)
          <IconChevronDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const margen = row.getValue<number>("margen");
      return (
        <div
          className={`font-bold ${
            margen >= 0
              ? "text-purple-600 dark:text-purple-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {margen.toFixed(1)}%
        </div>
      );
    },
  },
];

export default function ContabilidadPage() {
  const [data, setData] = useState<AnaliticasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "margen", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sortOrder, setSortOrder] = useState<"mas-rentable" | "menos-rentable">(
    "mas-rentable",
  );

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

        const parcelasMap = new Map<
          string,
          { ingresos: number; gastos: number }
        >();

        ingresos.forEach((ingreso) => {
          if (!ingreso.esGeneral && ingreso.nombreParcela) {
            if (!parcelasMap.has(ingreso.nombreParcela)) {
              parcelasMap.set(ingreso.nombreParcela, {
                ingresos: 0,
                gastos: 0,
              });
            }
            const parcela = parcelasMap.get(ingreso.nombreParcela)!;
            parcela.ingresos += ingreso.monto;
          }
        });

        gastos.forEach((gasto) => {
          if (!gasto.esGeneral && gasto.nombreParcela) {
            if (!parcelasMap.has(gasto.nombreParcela)) {
              parcelasMap.set(gasto.nombreParcela, { ingresos: 0, gastos: 0 });
            }
            const parcela = parcelasMap.get(gasto.nombreParcela)!;
            parcela.gastos += gasto.monto;
          }
        });

        const rentabilidadPorParcela: RentabilidadParcela[] = Array.from(
          parcelasMap.entries(),
        ).map(([nombreParcela, datos]) => ({
          nombreParcela,
          ingresos: datos.ingresos,
          gastos: datos.gastos,
          balance: datos.ingresos - datos.gastos,
          margen:
            datos.ingresos > 0
              ? ((datos.ingresos - datos.gastos) / datos.ingresos) * 100
              : 0,
        }));

        setData({
          totales: {
            ingresosTotales,
            gastosTotales,
            balanceTotal,
            margenPromedio,
          },
          rentabilidadPorParcela,
        });
      } catch (error) {
        console.error("Error fetching analiticas:", error);
        setData({
          totales: {
            ingresosTotales: 0,
            gastosTotales: 0,
            balanceTotal: 0,
            margenPromedio: 0,
          },
          rentabilidadPorParcela: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (sortOrder === "mas-rentable") {
      setSorting([{ id: "margen", desc: true }]);
    } else {
      setSorting([{ id: "margen", desc: false }]);
    }
  }, [sortOrder]);

  const table = useReactTable({
    data: data?.rentabilidadPorParcela || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rentabilidad por parcela</CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort-order" className="sr-only">
                    Ordenar por
                  </Label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value: "mas-rentable" | "menos-rentable") =>
                      setSortOrder(value)
                    }
                  >
                    <SelectTrigger className="w-fit" size="sm" id="sort-order">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mas-rentable">Más rentable</SelectItem>
                      <SelectItem value="menos-rentable">
                        Menos rentable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <IconLayoutColumns className="h-4 w-4" />
                        <span className="hidden lg:inline">Columnas</span>
                        <IconChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {table
                        .getAllColumns()
                        .filter(
                          (column) =>
                            typeof column.accessorFn !== "undefined" &&
                            column.getCanHide(),
                        )
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No hay datos de parcelas con ingresos o gastos.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {table.getRowModel().rows?.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    Mostrando {table.getRowModel().rows.length} parcela(s)
                  </div>
                  <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                      <Label
                        htmlFor="rows-per-page"
                        className="text-sm font-medium"
                      >
                        Filas por página
                      </Label>
                      <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                          table.setPageSize(Number(value));
                        }}
                      >
                        <SelectTrigger
                          size="sm"
                          className="w-20"
                          id="rows-per-page"
                        >
                          <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                          />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[5, 10, 20, 30].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                      Página {table.getState().pagination.pageIndex + 1} de{" "}
                      {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Ir a primera página</span>
                        <IconChevronsLeft />
                      </Button>
                      <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Ir a página anterior</span>
                        <IconChevronLeft />
                      </Button>
                      <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Ir a página siguiente</span>
                        <IconChevronRight />
                      </Button>
                      <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() =>
                          table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Ir a última página</span>
                        <IconChevronsRight />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
