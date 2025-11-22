import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

export function NotificacionCard({
  notificacion,
}: {
  notificacion: {
    id: number;
    titulo: string;
    descripcion: string;
    fechaEnvio: Date;
    leida: boolean;
  };
}) {
  return (
    <Item
      variant="outline"
      className={`@container/card transition-colors hover:border-primary/40 ${!notificacion.leida ? "bg-primary/5 border-primary/30" : ""}`}
      asChild
    >
      <Link href={`/panel/general/notificaciones/${notificacion.id}`}>
        <ItemContent className="min-w-0">
          <ItemHeader>
            <ItemGroup>
              <ItemTitle className="text-lg">{notificacion.titulo}</ItemTitle>
              <ItemDescription className="text-xs text-muted-foreground">
                {new Date(notificacion.fechaEnvio).toLocaleDateString("es-CO")}
              </ItemDescription>
            </ItemGroup>
          </ItemHeader>
          <ItemDescription className="truncate">
            {notificacion.descripcion}
          </ItemDescription>
        </ItemContent>
        <ItemMedia variant="default">
          {!notificacion.leida && (
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          )}
        </ItemMedia>
      </Link>
    </Item>
  );
}
