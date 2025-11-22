"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconSeedlingFilled } from "@tabler/icons-react";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!correo || !contrasena) {
      setError("El correo y la contraseña son requeridos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/inicio-sesion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo,
            contrasena,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        setError(err.mensaje || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      const data = await response.json();

      localStorage.setItem("jwToken", data.data.token);

      router.push("/panel");
    } catch (error) {
      console.error(error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-green-50 via-white to-green-50 dark:from-green-950/20 dark:via-background dark:to-green-950/20">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center pb-4">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <IconSeedlingFilled className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-2">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="correo">
                Correo electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="tu@email.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasena">
                Contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/registrarse"
                className="text-primary hover:underline font-medium"
              >
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
