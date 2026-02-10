
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Domain; 

namespace Persistence
{
    public class AppDbContext : IdentityDbContext<Member>
    {
         public AppDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Member> Members { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<MemberFile> MemberFiles { get; set; }
    public DbSet<Incident> Incidents { get; set; }      
    public DbSet<Address> Addresses { get; set; }
    public DbSet<FamilyMember> FamilyMembers { get; set; }
protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);

    Console.WriteLine("OnModelCreating executed!"); // Debugging log

    // Define Relationships
    builder.Entity<Member>()
        .HasMany(m => m.FamilyMembers)
        .WithOne(fm => fm.Member)
        .HasForeignKey(fm => fm.MemberId)
        .OnDelete(DeleteBehavior.Cascade);

    builder.Entity<Member>()
        .HasMany(m => m.Incidents)
        .WithOne(i => i.Member)
        .HasForeignKey(i => i.MemberId)
        .OnDelete(DeleteBehavior.Cascade);

    builder.Entity<Member>()
        .HasMany(mf => mf.MemberFiles)
        .WithOne(i => i.Member)
        .HasForeignKey(i => i.MemberId)
        .OnDelete(DeleteBehavior.Cascade);

    builder.Entity<Member>()
        .HasMany(m => m.Payments)
        .WithOne(p => p.Member)
        .HasForeignKey(p => p.MemberId)
        .OnDelete(DeleteBehavior.Cascade);

  builder.Entity<Member>()
    .HasMany(m => m.MemberFiles)
    .WithOne(f => f.Member)
    .HasForeignKey(f => f.MemberId)
    .OnDelete(DeleteBehavior.Cascade);

    builder.Entity<MemberFile>()
        .HasOne(f => f.Payment)
        .WithMany(p => p.MemberFiles)
        .HasForeignKey(f => f.PaymentId)
        .OnDelete(DeleteBehavior.NoAction);

    builder.Entity<Member>()
        .HasMany(m => m.Addresses)
        .WithOne(a => a.Member)
        .HasForeignKey(a => a.MemberId)
        .OnDelete(DeleteBehavior.Cascade);

    // Configure decimal precision for PaymentAmount
    builder.Entity<Payment>()
        .Property(p => p.PaymentAmount)
        .HasColumnType("decimal(18,2)"); // 18 total digits, 2 decimal places
}

    }
}