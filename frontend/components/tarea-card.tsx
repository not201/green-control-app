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
import { IconCircleCheck, IconCircleCheckFilled } from "@tabler/icons-react";

export function TareaCard({
  tarea,
}: {
  tarea: {
    id: number;
    nombre: string;
    descripcion: string;
    nombreParcela: string;
    completada: boolean;
  };
}) {
  return (
    <Item
      variant="outline"
      className={`@container/card transition-colors hover:border-primary/40 ${!tarea.completada ? "bg-primary/5 border-primary/30" : ""}`}
      asChild
    >
      <Link href={`/panel/general/tareas/${tarea.id}`}>
        <ItemContent className="min-w-0">
          <ItemHeader>
            <ItemTitle className="text-lg truncate">
              {tarea.nombreParcela} - {tarea.nombre}
            </ItemTitle>
          </ItemHeader>
          <ItemDescription className="truncate">
            {tarea.descripcion}
          </ItemDescription>
        </ItemContent>
        <ItemMedia variant="default">
          <Badge
            variant="outline"
            className="text-muted-foreground px-1.5 self-start"
          >
            {tarea.completada ? (
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
            ) : (
              <IconCircleCheck />
            )}
            {tarea.completada ? "Completada" : "Pendiente"}
          </Badge>
        </ItemMedia>
      </Link>
    </Item>
  );
}
