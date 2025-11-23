using System;
using System.Collections.Generic;

namespace GreenControl.Application.DTOs
{
    public class N8NUsuarioInfo
    {
        public int UsuarioId { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
    }

    public class N8NTarea
    {
        public string Nombre { get; set; }
        public string FechaProgramada { get; set; }
        public string NombreParcela { get; set; }
    }

    public class N8NUsuario
    {
        public N8NUsuarioInfo Info { get; set; }
        public List<N8NTarea> Tareas { get; set; }
    }

    public class N8NResponse
    {
        public List<N8NUsuario> Usuarios { get; set; }
    }
}