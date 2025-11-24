import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "./ui/item";

export function CultivoCard({
  cultivo,
}: {
  cultivo: {
    id: number;
    nombre: string;
    especie: string;
  };
}) {
  return (
    <Item
      variant="outline"
      className={`@container/card transition-colors hover:border-primary/40`}
      asChild
    >
      <Link href={`/panel/gestion/siembras/cultivos/${cultivo.id}`}>
        <ItemContent className="min-w-0">
          <ItemHeader>
            <ItemTitle className="text-lg truncate">{cultivo.nombre}</ItemTitle>
          </ItemHeader>
          <ItemDescription className="truncate">
            {cultivo.especie}
          </ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  );
}
