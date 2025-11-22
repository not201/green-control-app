"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentIsDark = document.documentElement.classList.contains("dark");
    setIsDark(currentIsDark);
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
    document.documentElement.classList.toggle("dark", checked);
  };

  if (!mounted) {
    return <Switch checked={false} disabled />;
  }

  return (
    <Switch
      checked={isDark}
      onCheckedChange={handleThemeChange}
      className="data-[state=checked]:bg-primary"
    />
  );
}

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const currentIsDark = document.documentElement.classList.contains("dark");
    setIsDark(currentIsDark);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
