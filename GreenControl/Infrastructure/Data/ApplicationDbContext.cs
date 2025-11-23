using Microsoft.EntityFrameworkCore;
using GreenControl.Domain.Entities;

namespace GreenControl.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Parcela> Parcelas { get; set; }
        public DbSet<Cultivo> Cultivos { get; set; }
        public DbSet<Siembra> Siembras { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }
        public DbSet<Gasto> Gastos { get; set; }
        public DbSet<Ingreso> Ingresos { get; set; }
        public DbSet<Tarea> Tareas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Apellido).HasMaxLength(100);
                entity.Property(u => u.Telefono).IsRequired().HasMaxLength(20);
                entity.Property(u => u.Correo).IsRequired().HasMaxLength(100);
                entity.HasIndex(u => u.Correo).IsUnique();
                entity.Property(u => u.Contrasena).IsRequired();
                entity.Property(u => u.FechaCreacion).HasDefaultValueSql("SYSDATE");
            });

            modelBuilder.Entity<Parcela>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Area).HasColumnType("decimal(10,2)").IsRequired();
                entity.Property(p => p.Ubicacion).IsRequired().HasMaxLength(200);
                entity.Property(p => p.NombreParcela).IsRequired().HasMaxLength(100);
                entity.Property(p => p.TipoSuelo).HasMaxLength(50);
                entity.Property(p => p.PhSuelo).HasColumnType("decimal(3,1)");

                entity.HasOne(p => p.Usuario)
                    .WithMany(u => u.Parcelas)
                    .HasForeignKey(p => p.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Cultivo>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Especie).IsRequired().HasMaxLength(100);

                entity.HasOne(c => c.Usuario)
                    .WithMany(u => u.Cultivos)
                    .HasForeignKey(c => c.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Siembra>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.FechaInicio).IsRequired();

                entity.HasOne(s => s.Parcela)
                    .WithOne(p => p.Siembra)
                    .HasForeignKey<Siembra>(s => s.ParcelaId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.Cultivo)
                    .WithMany(c => c.Siembras)
                    .HasForeignKey(s => s.CultivoId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Notificacion>(entity =>
            {
                entity.HasKey(n => n.Id);
                entity.Property(n => n.Titulo).IsRequired().HasMaxLength(150);
                entity.Property(n => n.Descripcion).IsRequired().HasMaxLength(500);
                entity.Property(n => n.FechaEnvio).IsRequired();

                entity.HasOne(n => n.Usuario)
                    .WithMany(u => u.Notificaciones)
                    .HasForeignKey(n => n.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Gasto>(entity =>
            {
                entity.HasKey(g => g.Id);
                entity.Property(g => g.Fecha).IsRequired();
                entity.Property(g => g.Monto).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(g => g.Concepto).IsRequired().HasMaxLength(200);
                entity.Property(g => g.NotaAdicional).HasMaxLength(500);

                entity.HasOne(g => g.Usuario)
                    .WithMany(u => u.Gastos)
                    .HasForeignKey(g => g.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(g => g.Parcela)
                    .WithMany(p => p.Gastos)
                    .HasForeignKey(g => g.ParcelaId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Ingreso>(entity =>
            {
                entity.HasKey(i => i.Id);
                entity.Property(i => i.Fecha).IsRequired();
                entity.Property(i => i.Monto).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(i => i.Concepto).IsRequired().HasMaxLength(200);
                entity.Property(i => i.NotaAdicional).HasMaxLength(500);

                entity.HasOne(i => i.Usuario)
                    .WithMany(u => u.Ingresos)
                    .HasForeignKey(i => i.UsuarioId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(i => i.Parcela)
                    .WithMany(p => p.Ingresos)
                    .HasForeignKey(i => i.ParcelaId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Tarea>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.FechaProgramada).IsRequired();
                entity.Property(t => t.Nombre).IsRequired().HasMaxLength(150);
                entity.Property(t => t.Descripcion).IsRequired().HasMaxLength(500);

                entity.HasOne(t => t.Parcela)
                    .WithMany(p => p.Tareas)
                    .HasForeignKey(t => t.ParcelaId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}