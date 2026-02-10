using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DbInitializer
    {
        private const string DefaultPassword = "Password123!";

        public static async Task SeedData(AppDbContext context, UserManager<Member> userManager)
        {
            await context.Database.MigrateAsync();

            var john = await EnsureMemberAsync(
                userManager,
                new Member
                {
                    UserName = "john_doe",
                    Email = "john.doe@example.com",
                    PhoneNumber = "123-456-7890",
                    FirstName = "John",
                    LastName = "Doe",
                    DisplayName = "John Doe",
                    IsActive = true,
                    IsAdmin = true
                });

            var tom = await EnsureMemberAsync(
                userManager,
                new Member
                {
                    UserName = "tom_smith",
                    Email = "tomSmith@example.com",
                    PhoneNumber = "470-980-2045",
                    FirstName = "Tom",
                    LastName = "Smith",
                    DisplayName = "Tom Smith",
                    IsActive = true,
                    IsAdmin = false
                });

            var getachew = await EnsureMemberAsync(
                userManager,
                new Member
                {
                    UserName = "getachew_hailu",
                    Email = "getachew.hailu@example.com",
                    PhoneNumber = "555-123-4567",
                    FirstName = "Getachew",
                    MiddleName = "T",
                    LastName = "Hailu",
                    DisplayName = "Getachew Hailu",
                    IsActive = true,
                    IsAdmin = true
                   
                });

            if (!context.Payments.Any())
            {
                var payments = new List<Payment>
                {
                    new Payment
                    {
                        PaymentDate = new DateTime(2021, 1, 1),
                        PaymentAmount = 50.00M,
                        PaymentType = PaymentType.CreditCard,
                        PaymentRecurringType = PaymentRecurringType.Annual,
                        MemberId = john.Id
                    },
                    new Payment
                    {
                        PaymentDate = new DateTime(2021, 1, 1),
                        PaymentAmount = 20.00M,
                        PaymentType = PaymentType.ReceiptAttached,
                        PaymentRecurringType = PaymentRecurringType.Monthly,
                        MemberId = john.Id
                    },
                    new Payment
                    {
                        PaymentDate = new DateTime(2024, 1, 15),
                        PaymentAmount = 100.00M,
                        PaymentType = PaymentType.BankTransfer,
                        PaymentRecurringType = PaymentRecurringType.Membership,
                        MemberId = getachew.Id
                    },
                    new Payment
                    {
                        PaymentDate = new DateTime(2024, 2, 20),
                        PaymentAmount = 75.50M,
                        PaymentType = PaymentType.Cash,
                        PaymentRecurringType = PaymentRecurringType.Monthly,
                        MemberId = getachew.Id
                    },
                    new Payment
                    {
                        PaymentDate = new DateTime(2024, 3, 10),
                        PaymentAmount = 150.00M,
                        PaymentType = PaymentType.CreditCard,
                        PaymentRecurringType = PaymentRecurringType.Quarterly,
                        MemberId = getachew.Id
                    }
                };

                await context.Payments.AddRangeAsync(payments);
            }

            if (!context.Addresses.Any())
            {
                var addresses = new List<Address>
                {
                    new Address { Street = "123 Main St", City = "New York", State = "NY", ZipCode = "10001", MemberId = john.Id },
                    new Address { Street = "456 Elm St", City = "Los Angeles", State = "CA", ZipCode = "90001", MemberId = john.Id },
                    new Address { Street = "789 Oak Avenue", City = "Columbus", State = "OH", ZipCode = "43215", Country = "USA", MemberId = getachew.Id },
                    new Address { Street = "321 Pine Street", City = "Westerville", State = "OH", ZipCode = "43081", Country = "USA", MemberId = getachew.Id }
                };

                await context.AddRangeAsync(addresses);
            }

            if (!context.FamilyMembers.Any())
            {
                var familyMembers = new List<FamilyMember>
                {
                    new FamilyMember
                    {
                        MemberFamilyFirstName = "Jane",
                        MemberFamilyLastName = "Doe",
                        MemberFamilyMiddleName = "CBE",
                        Relationship = "Mother",
                        MemberId = john.Id
                    },
                    new FamilyMember
                    {
                        MemberFamilyFirstName = "Sara",
                        MemberFamilyLastName = "Doe",
                        MemberFamilyMiddleName = "Tekle",
                        Relationship = "Sister",
                        MemberId = john.Id
                    },
                    new FamilyMember
                    {
                        MemberFamilyFirstName = "Mulu",
                        MemberFamilyLastName = "Hailu",
                        MemberFamilyMiddleName = "T",
                        Relationship = "Wife",
                        MemberId = getachew.Id
                    },
                    new FamilyMember
                    {
                        MemberFamilyFirstName = "Daniel",
                        MemberFamilyLastName = "Hailu",
                        MemberFamilyMiddleName = "G",
                        Relationship = "Son",
                        MemberId = getachew.Id
                    },
                    new FamilyMember
                    {
                        MemberFamilyFirstName = "Martha",
                        MemberFamilyLastName = "Hailu",
                        MemberFamilyMiddleName = "G",
                        Relationship = "Daughter",
                        MemberId = getachew.Id
                    }
                };

                await context.FamilyMembers.AddRangeAsync(familyMembers);
            }

            if (!context.MemberFiles.Any())
            {
                var memberFiles = new List<MemberFile>
                {
                    new MemberFile
                    {
                        FileName = "john.png",
                        Size = (int)new FileInfo(@"C:\Users\ghail\OneDrive\Pictures\john.png").Length,
                        ImageData = File.ReadAllBytes(@"C:\Users\ghail\OneDrive\Pictures\john.png"),
                        MemberId = john.Id
                    },
                    new MemberFile
                    {
                        FileName = "mark.png",
                        Size = (int)new FileInfo(@"C:\Users\ghail\OneDrive\Pictures\mark.png").Length,
                        ImageData = File.ReadAllBytes(@"C:\Users\ghail\OneDrive\Pictures\mark.png"),
                        MemberId = john.Id
                    },
                    new MemberFile
                    {
                        FileName = "car.jpg",
                        Size = (int)new FileInfo(@"C:\Users\ghail\OneDrive\Pictures\car.jpg").Length,
                        ImageData = File.ReadAllBytes(@"C:\Users\ghail\OneDrive\Pictures\car.jpg"),
                        MemberId = john.Id
                    }
                };

                await context.MemberFiles.AddRangeAsync(memberFiles);
            }

            if (!context.Incidents.Any())
            {
                var incidents = new List<Incident>
                {
                    new Incident
                    {
                        EventNumber = 1,
                        IncidentDescription = "Death",
                        IncidentType = IncidentType.NaturalDeath,
                        MemberId = john.Id
                    },
                    new Incident
                    {
                        EventNumber = 2,
                        IncidentDescription = "Death",
                        IncidentType = IncidentType.NaturalDeath,
                        MemberId = john.Id
                    },
                    new Incident
                    {
                        EventNumber = 1,
                        IncidentDescription = "Medical emergency assistance",
                        IncidentType = IncidentType.AccidentalDeath,
                        IncidentDate = new DateTime(2024, 1, 10),
                        MemberId = getachew.Id
                    },
                    new Incident
                    {
                        EventNumber = 2,
                        IncidentDescription = "Family support needed",
                        IncidentType = IncidentType.NaturalDeath,
                        IncidentDate = new DateTime(2024, 2, 15),
                        MemberId = getachew.Id
                    },
                    new Incident
                    {
                        EventNumber = 3,
                        IncidentDescription = "Community event participation",
                        IncidentType = IncidentType.AccidentalDeath,
                        IncidentDate = new DateTime(2024, 3, 5),
                        MemberId = getachew.Id
                    }
                };

                await context.Incidents.AddRangeAsync(incidents);
            }

            await context.SaveChangesAsync();
        }

        private static async Task<Member> EnsureMemberAsync(UserManager<Member> userManager, Member template)
        {
            var existing = await userManager.FindByEmailAsync(template.Email) ??
                           await userManager.FindByNameAsync(template.UserName);

            if (existing == null)
            {
                var result = await userManager.CreateAsync(template, DefaultPassword);
                if (!result.Succeeded)
                {
                    throw new InvalidOperationException($"Failed to seed user {template.Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }

                return template;
            }

            existing.DisplayName = template.DisplayName;
            existing.FirstName = template.FirstName;
            existing.MiddleName = template.MiddleName;
            existing.LastName = template.LastName;
            existing.PhoneNumber = template.PhoneNumber;
            existing.IsActive = template.IsActive;
            existing.IsAdmin = template.IsAdmin;

            await userManager.UpdateAsync(existing);

            if (!await userManager.CheckPasswordAsync(existing, DefaultPassword))
            {
                var resetToken = await userManager.GeneratePasswordResetTokenAsync(existing);
                var resetResult = await userManager.ResetPasswordAsync(existing, resetToken, DefaultPassword);
                if (!resetResult.Succeeded)
                {
                    throw new InvalidOperationException($"Failed to reset password for {existing.Email}: {string.Join(", ", resetResult.Errors.Select(e => e.Description))}");
                }
            }

            return existing;
        }
    }
}
