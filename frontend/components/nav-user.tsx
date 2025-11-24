"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconMoon,
  IconSun,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle, useTheme } from "./theme-toggle";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    nombre: string;
    apellido: string;
    correo: string;
    avatar?: string;
  };
}) {
  const isDark = useTheme();
  const { isMobile } = useSidebar();
  const router = useRouter();

  const nombreCompleto = user.apellido
    ? `${user.nombre} ${user.apellido}`
    : user.nombre;

  const handleLogout = () => {
    document.cookie =
      "jwToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    localStorage.removeItem("jwToken");
    router.push("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={nombreCompleto} />
                <AvatarFallback className="rounded-lg">
                  <IconUser />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{nombreCompleto}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.correo}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={nombreCompleto} />
                  <AvatarFallback className="rounded-lg">
                    <IconUser />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{nombreCompleto}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.correo}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/panel/cuenta" className="cursor-pointer">
                  <IconUserCircle />
                  Cuenta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onSelect={(e) => e.preventDefault()}
                onClick={() => {
                  const checkbox = document.getElementById(
                    "theme-switch",
                  ) as HTMLButtonElement;
                  checkbox?.click();
                }}
              >
                {isDark ? (
                  <IconMoon className="size-4" />
                ) : (
                  <IconSun className="size-4" />
                )}
                <span className="flex-1 select-none">Tema</span>
                <ThemeToggle />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <IconLogout />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
