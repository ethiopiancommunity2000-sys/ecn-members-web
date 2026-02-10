using Application.Dtos;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        // -----------------------------
        // Helper methods
        // -----------------------------
        private static PaymentType ParsePaymentType(string value) =>
            Enum.TryParse(value, true, out PaymentType parsed) ? parsed : PaymentType.Cash;

        private static PaymentRecurringType ParsePaymentRecurringType(string value) =>
            Enum.TryParse(value, true, out PaymentRecurringType parsed) ? parsed : PaymentRecurringType.Monthly;

        private static IncidentType ParseIncidentType(string value) =>
            Enum.TryParse(value, true, out IncidentType parsed) ? parsed : IncidentType.NaturalDeath;

        private static DateTime ParseDate(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return DateTime.MinValue;

            if (DateTime.TryParseExact(value, "yyyy-MM-dd", null,
                    System.Globalization.DateTimeStyles.None, out var iso))
                return iso;

            return DateTime.TryParse(value, out var parsed) ? parsed : DateTime.MinValue;
        }

        private static DateTime ParseIncidentDate(IncidentDto src)
        {
            if (string.IsNullOrWhiteSpace(src.PaymentDate) ||
                src.PaymentDate == "0001-01-01")
                return DateTime.MinValue;

            return ParseDate(src.PaymentDate);
        }

        // -----------------------------
        // Constructor
        // -----------------------------
        public MappingProfiles()
        {
            // =====================================================
            // Member → DTOs (READ)
            // =====================================================
            CreateMap<Member, MemberDto>()
                .ForMember(d => d.Addresses, o => o.MapFrom(s => s.Addresses))
                .ForMember(d => d.FamilyMembers, o => o.MapFrom(s => s.FamilyMembers))
                .ForMember(d => d.Payments, o => o.MapFrom(s => s.Payments))
                .ForMember(d => d.Incidents, o => o.MapFrom(s => s.Incidents))
                .ForMember(d => d.MemberFiles, o => o.MapFrom(s => s.MemberFiles));

            CreateMap<Member, MemberDetailsDto>();
            CreateMap<Member, MemberListDto>();

            // =====================================================
            // MemberDto → Member (UPDATE / CREATE)
            // =====================================================
            var memberMap = CreateMap<MemberDto, Member>();

            memberMap.ForAllMembers(opt =>
                opt.Condition((_, __, srcValue) =>
                    srcValue != null &&
                    (!(srcValue is string s) || !string.IsNullOrWhiteSpace(s))));

            memberMap
                .ForMember(m => m.Id, o => o.Ignore())
                .ForMember(m => m.Addresses, o => o.Ignore())
                .ForMember(m => m.FamilyMembers, o => o.Ignore())
                .ForMember(m => m.MemberFiles, o => o.Ignore())
                .ForMember(m => m.Payments, o => o.Ignore())
                .ForMember(m => m.Incidents, o => o.Ignore());

            // =====================================================
            // Address
            // =====================================================
            CreateMap<Address, AddressDto>().ReverseMap()
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.MemberId, o => o.Ignore())
                .ForMember(d => d.Member, o => o.Ignore());

            // =====================================================
            // FamilyMember
            // =====================================================
            CreateMap<FamilyMember, FamilyMemberDto>().ReverseMap()
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.MemberId, o => o.Ignore())
                .ForMember(d => d.Member, o => o.Ignore());

            // =====================================================
            // Payment
            // =====================================================
            CreateMap<Payment, PaymentDto>()
                .ForMember(d => d.Amount, o => o.MapFrom(s => s.PaymentAmount))
                .ForMember(d => d.PaymentDate, o => o.MapFrom(s => s.PaymentDate.ToString("yyyy-MM-dd")))
                .ForMember(d => d.PaymentType, o => o.MapFrom(s => s.PaymentType.ToString()))
                .ForMember(d => d.PaymentRecurringType, o => o.MapFrom(s => s.PaymentRecurringType.ToString()))
                .ReverseMap()
                .ForMember(d => d.PaymentAmount, o => o.MapFrom(s => s.Amount))
                .ForMember(d => d.PaymentDate, o => o.MapFrom(s => ParseDate(s.PaymentDate)))
                .ForMember(d => d.PaymentType, o => o.MapFrom(s => ParsePaymentType(s.PaymentType)))
                .ForMember(d => d.PaymentRecurringType, o => o.MapFrom(s => ParsePaymentRecurringType(s.PaymentRecurringType)))
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.MemberId, o => o.Ignore())
                .ForMember(d => d.Member, o => o.Ignore());

            // =====================================================
            // Incident
            // =====================================================
            CreateMap<Incident, IncidentDto>()
                .ForMember(d => d.IncidentType, o => o.MapFrom(s => s.IncidentType.ToString()))
                .ForMember(d => d.PaymentDate, o => o.MapFrom(s => s.IncidentDate.ToString("yyyy-MM-dd")))
                .ForMember(d => d.IncidentDate, o => o.MapFrom(s => s.IncidentDate.ToString("yyyy-MM-dd")))
                .ReverseMap()
                .ForMember(d => d.IncidentType, o => o.MapFrom(s => ParseIncidentType(s.IncidentType)))
                .ForMember(d => d.IncidentDate, o => o.MapFrom(s => ParseIncidentDate(s)))
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.MemberId, o => o.Ignore())
                .ForMember(d => d.Member, o => o.Ignore());

            // =====================================================
            // MemberFile (METADATA ONLY — NO BINARY)
            // =====================================================
            CreateMap<MemberFile, MemberFileDto>()
            .ForMember(d => d.Id, o => o.MapFrom(s => s.Id.ToString()))
            .ForMember(d => d.FileName, o => o.MapFrom(s => s.FileName))
            .ForMember(d => d.Size, o => o.MapFrom(s => s.Size))
            .ForMember(d => d.MemberId, o => o.MapFrom(s => s.MemberId))
            .ForMember(d => d.FileDescription, o => o.MapFrom(s => s.FileDescription))
            .ForMember(d => d.PaymentId, o => o.MapFrom(s => s.PaymentId))
            .ForMember(d => d.FileType,
                o => o.MapFrom(s => Path.GetExtension(s.FileName)))
            .ForMember(d => d.DownloadUrl,
                o => o.MapFrom(s => $"/api/members/file/{s.Id}"));




            // NO ReverseMap for MemberFile
            // Files are created ONLY via upload endpoints
        }
    }
}
