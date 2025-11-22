import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Badge } from "./ui/badge";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";

export function ParcelaCard({
  parcela,
}: {
  parcela: {
    id: number;
    area: number;
    nombreParcela: string;
    tieneSiembra: boolean;
  };
}) {
  return (
    <Item
      variant="outline"
      className={`@container/card transition-colors hover:border-primary/40`}
      asChild
    >
      <Link href={`/panel/gestion/parcelas/${parcela.id}`}>
        <ItemContent className="min-w-0">
          <ItemHeader>
            <ItemTitle className="text-lg truncate">
              {parcela.nombreParcela}
            </ItemTitle>
          </ItemHeader>
          <ItemDescription className="truncate">
            Area: {parcela.area} ha
          </ItemDescription>
        </ItemContent>
        <ItemMedia variant="default">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {parcela.tieneSiembra ? (
              <IconPlayerPauseFilled className="fill-green-500 dark:fill-green-400" />
            ) : (
              <IconPlayerPlayFilled />
            )}
            {parcela.tieneSiembra ? "Activa" : "Inactiva"}
          </Badge>
        </ItemMedia>
      </Link>
    </Item>
  );
}
