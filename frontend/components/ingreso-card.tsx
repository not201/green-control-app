import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "./ui/item";

export function IngresoCard({
  ingreso,
}: {
  ingreso: {
    id: number;
    fecha: string;
    monto: number;
    concepto: string;

    nombreParcela?: string;
  };
}) {
  return (
    <Item
      variant="outline"
      className={`@container/card transition-colors hover:border-primary/40`}
      asChild
    >
      <Link href={`/panel/gestion/contabilidad/ingresos/${ingreso.id}`}>
        <ItemContent className="min-w-0">
          <ItemHeader>
            <ItemTitle className="text-lg truncate">
              Monto: $COP{ingreso.monto.toLocaleString()}
            </ItemTitle>
          </ItemHeader>
          <ItemDescription className="truncate">
            Concepto: {ingreso.concepto}
          </ItemDescription>
          {ingreso.nombreParcela && (
            <ItemDescription className="truncate">
              Parcela: {ingreso.nombreParcela}
            </ItemDescription>
          )}
        </ItemContent>
      </Link>
    </Item>
  );
}
