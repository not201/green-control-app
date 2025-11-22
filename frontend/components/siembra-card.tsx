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
import { IconCheck, IconLoader } from "@tabler/icons-react";

export function SiembraCard({
  siembra,
}: {
  siembra: {
    id: number;
    nombreParcela: string;
    nombreCultivo: string;
    activa: boolean;
  };
}) {
  return (
    <Item
      variant="outline"
      className={`@container/card transition-colors hover:border-primary/40`}
      asChild
    >
      <Link href={`/panel/gestion/siembras/${siembra.id}`}>
        <ItemContent className="min-w-0">
          <ItemHeader>
            <ItemTitle className="text-lg truncate">
              {siembra.nombreParcela}
            </ItemTitle>
          </ItemHeader>
          <ItemDescription className="truncate">
            Cultivo: {siembra.nombreCultivo}
          </ItemDescription>
        </ItemContent>
        <ItemMedia variant="default">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {siembra.activa ? (
              <IconLoader />
            ) : (
              <IconCheck className="fill-green-500 dark:fill-green-400" />
            )}
            {siembra.activa ? "En proceso" : "Terminada"}
          </Badge>
        </ItemMedia>
      </Link>
    </Item>
  );
}
