"use client";

import type { Icon } from "@tabler/icons-react";

import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavSidebar({
  label,
  items,
  ...props
}: {
  label?: string;
  items: {
    title: string;
    url: string;
    icon: Icon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  const findMostSpecificUrl = () => {
    let bestMatch = "";

    items.forEach((item) => {
      if (pathname === item.url || pathname.startsWith(item.url + "/")) {
        if (item.url.length > bestMatch.length) {
          bestMatch = item.url;
        }
      }

      item.items?.forEach((sub) => {
        if (pathname === sub.url || pathname.startsWith(sub.url + "/")) {
          if (sub.url.length > bestMatch.length) {
            bestMatch = sub.url;
          }
        }
      });
    });

    return bestMatch;
  };

  const activeUrl = findMostSpecificUrl();

  const finalActiveUrl =
    activeUrl === "/panel" && pathname !== "/panel" ? "" : activeUrl;

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="flex flex-col">
        {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
        <SidebarMenu>
          {items.map((item) => {
            if (item.items && item.items.length > 0) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={finalActiveUrl === item.url}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={finalActiveUrl === subItem.url}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              );
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={finalActiveUrl === item.url}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
