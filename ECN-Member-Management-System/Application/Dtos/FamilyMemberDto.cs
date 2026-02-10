

using System;

namespace Application.Dtos
{
    public class FamilyMemberDto
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string MemberFamilyFirstName { get; set; }
        public string MemberFamilyMiddleName { get; set; }
        public string MemberFamilyLastName { get; set; }
        public string Relationship { get; set; }
    }
}