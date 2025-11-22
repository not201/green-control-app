"use client";

import * as React from "react";
import {
  IconBell,
  IconChartBar,
  IconChecklist,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconLeaf,
  IconMapPin,
  IconMessageCircle,
  IconPlant,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { NavSidebar } from "@/components/nav-sidebar";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  navGeneral: [
    {
      title: "Panel",
      url: "/panel",
      icon: IconDashboard,
    },
    {
      title: "Analíticas",
      url: "/panel/general/analiticas",
      icon: IconChartBar,
    },
    {
      title: "Notificaciones",
      url: "/panel/general/notificaciones",
      icon: IconBell,
    },
  ],
  navGestion: [
    {
      title: "Siembras",
      url: "/panel/gestion/siembras",
      icon: IconPlant,
    },
    {
      title: "Parcelas",
      url: "/panel/gestion/parcelas",
      icon: IconMapPin,
    },
    {
      title: "Cultivos",
      url: "/panel/gestion/cultivos",
      icon: IconLeaf,
    },
    {
      title: "Tareas",
      url: "/panel/gestion/tareas",
      icon: IconChecklist,
    },
  ],
  navContabilidad: [
    {
      title: "Costes",
      url: "/panel/contabilidad/costes",
      icon: IconTrendingDown,
    },
    {
      title: "Ingresos",
      url: "/panel/contabilidad/ingresos",
      icon: IconTrendingUp,
    },
  ],
  navOptions: [
    {
      title: "Ayuda",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Soporte",
      url: "#",
      icon: IconMessageCircle,
    },
  ],
};

interface User {
  nombre: string;
  apellido: string;
  avatar?: string;
  correo: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User>({
    nombre: "Cargando...",
    apellido: "",
    correo: "",
    avatar: "/avatars/avatar.jpg",
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Usuario/perfil`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
          },
        },
      );

      if (res.ok) {
        const { data }: { data: User } = await res.json();
        setUser({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
        });
      }
    };

    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/panel">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Green Control</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSidebar label="General" items={data.navGeneral} />
        <NavSidebar label="Gestión" items={data.navGestion} />
        <NavSidebar label="Contabilidad" items={data.navContabilidad} />
        <NavSidebar items={data.navOptions} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
