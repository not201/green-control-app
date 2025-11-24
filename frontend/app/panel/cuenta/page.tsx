"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconMail,
  IconPhone,
  IconUser,
  IconKey,
  IconLoader,
  IconEdit,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  avatar?: string;
  telefono: string;
}

export default function UsuarioPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  });
  const [passwordData, setPasswordData] = useState({
    contrasenaActual: "",
    contrasenaNueva: "",
    confirmarContrasena: "",
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Usuario/perfil`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
            },
          },
        );

        if (res.ok) {
          const { data }: { data: Usuario } = await res.json();
          setUsuario(data);
          setFormData({
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            telefono: data.telefono,
          });
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  const handleEdit = async () => {
    setFormError("");

    if (!formData.nombre.trim()) {
      setFormError("El nombre es requerido");
      return;
    }

    if (!formData.correo.trim()) {
      setFormError("El email es requerido");
      return;
    }

    if (!formData.telefono.trim()) {
      setFormError("El teléfono es requerido");
      return;
    }

    setSubmitting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Usuario/${usuario?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          telefono: formData.telefono,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      setFormError("Error al actualizar la información");
      console.log(errorData);
      setSubmitting(false);
      return;
    }

    const { data }: { data: Usuario } = await res.json();
    setUsuario(data);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    if (!passwordData.contrasenaActual.trim()) {
      setPasswordError("La contraseña actual es requerida");
      return;
    }

    if (!passwordData.contrasenaNueva.trim()) {
      setPasswordError("La nueva contraseña es requerida");
      return;
    }

    if (passwordData.contrasenaNueva.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (passwordData.contrasenaNueva !== passwordData.confirmarContrasena) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    setChangingPassword(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Usuario/cambiar-contrasena`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
        body: JSON.stringify({
          contrasenaActual: passwordData.contrasenaActual,
          nuevaContrasena: passwordData.contrasenaNueva,
          confirmarContrasena: passwordData.confirmarContrasena,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      setPasswordError(errorData.mensaje || "Error al cambiar la contraseña");
      console.log(errorData);
      setChangingPassword(false);
      return;
    }

    setPasswordData({
      contrasenaActual: "",
      contrasenaNueva: "",
      confirmarContrasena: "",
    });
    setShowPasswordDialog(false);
    setChangingPassword(false);
  };

  const handleDelete = async () => {
    setDeleting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Usuario/${usuario?.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwToken")}`,
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.log("Error al eliminar:", errorData);
      setDeleting(false);
      return;
    }

    localStorage.removeItem("jwToken");
    setDeleting(false);
    setDeleteDialogOpen(false);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">
          No se pudo cargar la información del usuario
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Mi Cuenta</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gestiona tu información personal
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                <AvatarImage
                  src={usuario.avatar || "/placeholder.svg"}
                  alt={usuario.nombre}
                />
                <AvatarFallback>
                  <IconUser className="h-12 w-12 sm:h-16 sm:w-16" />
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl sm:text-2xl">
              {usuario.nombre}
            </CardTitle>
            <CardDescription>{usuario.correo}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <IconMail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{usuario.correo}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <IconPhone className="h-4 w-4 text-muted-foreground" />
              <span>{usuario.telefono}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información de contacto
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {formError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                disabled={!editMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Correo electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                disabled={!editMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                disabled={!editMode}
              />
            </div>
            {!editMode ? (
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setEditMode(!editMode)}
                  variant={editMode ? "destructive" : "default"}
                >
                  {editMode || <IconEdit className="h-4 w-4 mr-1" />}
                  {editMode || "Editar información"}
                </Button>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      nombre: usuario.nombre,
                      apellido: usuario.apellido,
                      correo: usuario.correo,
                      telefono: usuario.telefono,
                    });
                    setFormError("");
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleEdit} disabled={submitting}>
                  {submitting ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>Gestiona tu contraseña y seguridad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 md:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(true)}
            >
              <IconKey className="h-4 w-4 mr-1" />
              Cambiar contraseña
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Eliminar cuenta
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Ingresa tu contraseña actual y la nueva
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {passwordError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {passwordError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="current-password">
                Contraseña actual <span className="text-red-500">*</span>
              </Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                value={passwordData.contrasenaActual}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    contrasenaActual: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">
                Nueva contraseña <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={passwordData.contrasenaNueva}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    contrasenaNueva: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirmar nueva contraseña{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={passwordData.confirmarContrasena}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmarContrasena: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setPasswordData({
                  contrasenaActual: "",
                  contrasenaNueva: "",
                  confirmarContrasena: "",
                });
                setPasswordError("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? "Cambiando..." : "Cambiar contraseña"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              tu cuenta y todos tus datos asociados. Serás redirigido al inicio
              de sesión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Eliminando..." : "Eliminar cuenta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
