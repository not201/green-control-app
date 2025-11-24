import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "./ui/item";

export function GastoCard({
  gasto,
}: {
  gasto: {
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
      <Link href={`/panel/gestion/contabilidad/gastos/${gasto.id}`}>
        <ItemContent className="min-w-0">
          <ItemHeader>
            <ItemTitle className="text-lg truncate">
              Monto: $COP{gasto.monto.toLocaleString()}
            </ItemTitle>
          </ItemHeader>
          <ItemDescription className="truncate">
            Concepto: {gasto.concepto}
          </ItemDescription>
          {gasto.nombreParcela && (
            <ItemDescription className="truncate">
              Parcela: {gasto.nombreParcela}
            </ItemDescription>
          )}
        </ItemContent>
      </Link>
    </Item>
  );
}
