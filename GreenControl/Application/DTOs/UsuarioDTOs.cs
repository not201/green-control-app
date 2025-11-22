using System;
using System.ComponentModel.DataAnnotations;

namespace GreenControl.Application.DTOs
{
    public class RegistroRequest
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        public string Nombre { get; set; }

        public string? Apellido { get; set; }

        [Required(ErrorMessage = "El teléfono es requerido")]
        public string Telefono { get; set; }

        [Required(ErrorMessage = "El correo es requerido")]
        [EmailAddress(ErrorMessage = "Correo inválido")]
        public string Correo { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string Contrasena { get; set; }
    }

    public class LoginRequest
    {
        [Required(ErrorMessage = "El correo es requerido")]
        [EmailAddress(ErrorMessage = "Correo inválido")]
        public string Correo { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        public string Contrasena { get; set; }
    }

    public class LoginResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string? Apellido { get; set; }
        public string Correo { get; set; }
        public string Token { get; set; }
    }

    public class UsuarioPerfilResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string? Apellido { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public DateTime FechaCreacion { get; set; }
    }

    public class ActualizarPerfilRequest
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        public string Nombre { get; set; }

        public string? Apellido { get; set; }

        [Required(ErrorMessage = "El teléfono es requerido")]
        public string Telefono { get; set; }
    }

    public class CambiarContrasenaRequest
    {
        [Required(ErrorMessage = "La contraseña actual es requerida")]
        public string ContrasenaActual { get; set; }

        [Required(ErrorMessage = "La nueva contraseña es requerida")]
        [MinLength(6, ErrorMessage = "La nueva contraseña debe tener al menos 6 caracteres")]
        public string NuevaContrasena { get; set; }

        [Required(ErrorMessage = "La confirmación de contraseña es requerida")]
        [Compare("NuevaContrasena", ErrorMessage = "Las contraseñas no coinciden")]
        public string ConfirmarContrasena { get; set; }
    }
}