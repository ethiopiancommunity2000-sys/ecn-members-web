
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class Member : IdentityUser
    {
        //dotnet ef migrations add InitialCreate -p Persistence -s API

        //! public string Id { get; set; } = Guid.NewGuid().ToString(); -> set already in IdentityUser no need in creating a "Member" and also ***Make sure Id is not required in the MemberDTO.
        //! ***Make sure Id is not required in the other Dtos (I.E. Payments...) since it is set in each Domain classes  (public string Id { get; set; } = Guid.NewGuid().ToString();) and Ignore() the "Id" in the mapping profile for creating the objec
   
 
        public string ReceiverId { get; set; }
        
        [Display(Name = "First Name")]
        [Required(ErrorMessage = "First Name is required")]
        public required string FirstName { get; set; }

        [Display(Name = "Middle Name")]
        
        public string MiddleName { get; set; }

        [Display(Name = "Last Name")]
        [Required(ErrorMessage = "Last Name is required")]
        public required string LastName { get; set; }

  
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public bool IsActive { get; set; }
        public bool IsAdmin { get; set; }
       // public DateTime RegisterDate { get; set; } = DateTime.Today;
         public string RegisterDate { get; set; } = DateTime.Today.ToString("MM/dd/yyyy");

        // Navigation properties
        public List<Address> Addresses { get; set; } = new();
        public List<MemberFile> MemberFiles { get; set; } = new();
        public List<Incident> Incidents { get; set; } = new();
        public List<FamilyMember> FamilyMembers { get; set; } = new();
        public List<Payment> Payments { get; set; } = new();

    }
}


//! SQL QUERIES
//====================1=======================
// --'0fcc4bf6-30bf-4bee-98dd-8b3cf858c8c7'
// --'5f3f212b-dc95-4c08-9d95-ccb3fd8c2c0a'
// select * from [dbo].[Members] m
// left join [dbo].[Payment] p
// on m.id = p.MemberId
// where m.id = '01d5dcef-2e4b-4444-a3c7-e4b767925650'
//====================2=======================

//  select * from [dbo].[Members] m
// LEFT JOIN [Addresses] a 
// on m.Id = a.MemberId
// left join FamilyMembers f
// on m.Id = f.MemberId
// left join  MemberFiles x 
// on m.id = x.MemberId
// left join Payment p
// on m.id = p.MemberId
// left join Incidents I
// on m.Id = i.MemberId
//====================3  - proc with @id=======================
//  create proc getCity 
// @id nvarchar(50)
// as
// begin
// select a.State, a.City, a.Street from [dbo].[Members] m
// LEFT JOIN [Addresses] a 
// on m.Id = a.MemberId where m.id =@id
// end

//!====================4-a Ljoin with Offset/Fetch alue=======================
// todo 4-a Ljoin and 4-a Ljoin are doing the same thing with a little diffrences
//      DECLARE @__p_0 INT = 0;  -- Offset value
//      DECLARE @__p_1 INT = 2; -- Fetch value

// 	   SELECT [m1].[Id], [m1].[FirstName], [m1].[LastName], [m1].[RegisterDate], [a].[Id], [a].[City], [a].[Country], 
// 	   [a].[MemberId], [a].[State], [a].[Street], [a].[ZipCode], [f].[Id], [f].[FirstName], [f].[LastName], [f].[MemberId],
// 	   [f].[MiddleName], [m0].[FileName], [m0].[FilePath], [m0].[FileDescription], [m0].[Id], [p].[PaymentAmount], [p].[PaymentDate],
// 	   CAST([p].[PaymentType] AS nvarchar(max)), [p].[Id], [i].[Id], [i].[IncidentDescription], [i].[IncidentDate]
//   FROM (
//       SELECT [m].[Id], [m].[FirstName], [m].[LastName], [m].[RegisterDate]
//       FROM [Members] AS [m]
//     ORDER BY [m].[RegisterDate]
//     OFFSET @__p_0 ROWS FETCH NEXT @__p_1 ROWS ONLY
//   ) AS [m1]
//   LEFT JOIN [Addresses] AS [a] ON [m1].[Id] = [a].[MemberId]
//   LEFT JOIN [FamilyMembers] AS [f] ON [m1].[Id] = [f].[MemberId]
//   LEFT JOIN [MemberFiles] AS [m0] ON [m1].[Id] = [m0].[MemberId]
//   LEFT JOIN [Payment] AS [p] ON [m1].[Id] = [p].[MemberId]
//   LEFT JOIN [Incidents] AS [i] ON [m1].[Id] = [i].[MemberId]
//   ORDER BY [m1].[RegisterDate], [m1].[Id], [a].[Id], [f].[Id], [m0].[Id], [p].[Id]

//!====================4-b Ljoin with Offset/Fetch alue=======================
// todo 4-a Ljoin and 4-a Ljoin are doing the same thing with a little diffrences

//  DECLARE @__p_0 INT = 0;  -- Offset value
// DECLARE @__p_1 INT = 10; -- Fetch value

//! using CTE(comment table expresion)
// WITH MemberCTE AS (
//     SELECT 
//         [m].[Id], 
//         [m].[FirstName], 
//         [m].[LastName], 
//         [m].[RegisterDate],
//         ROW_NUMBER() OVER (ORDER BY [m].[RegisterDate]) AS RowNum
//     FROM 
//         [Members] AS [m]
// )
// SELECT 
//     [m1].[Id], 
//     [m1].[FirstName], 
//     [m1].[LastName], 
//     [m1].[RegisterDate],
//     [a].[City], 
//     [a].[Country], 
//     [a].[State], 
//     [a].[Street], 
//     [a].[ZipCode],
//     [m0].[FileDescription], 
//     [m0].[Id], 
//     [p].[PaymentAmount], 
//     [p].[PaymentDate], 
//     CAST([p].[PaymentType] AS nvarchar(max)) AS PaymentType, 
//     [p].[Id], 
//     [i].[Id],
//     [i].[IncidentDescription], 
//     [i].[IncidentDate]
// FROM 
//     MemberCTE AS [m1]
// LEFT JOIN 
//     [Addresses] AS [a] ON [m1].[Id] = [a].[MemberId]
// LEFT JOIN 
//     [FamilyMembers] AS [f] ON [m1].[Id] = [f].[MemberId]
// LEFT JOIN 
//     [MemberFiles] AS [m0] ON [m1].[Id] = [m0].[MemberId]
// LEFT JOIN 
//     [Payment] AS [p] ON [m1].[Id] = [p].[MemberId]
// LEFT JOIN 
//     [Incidents] AS [i] ON [m1].[Id] = [i].[MemberId]
// WHERE 
//     [m1].RowNum > @__p_0 AND [m1].RowNum <= (@__p_0 + @__p_1)
// ORDER BY 
//     [m1].[RegisterDate], 
//     [m1].[Id];
