import type { Address, FamilyMember, Incident, Member, Payment, Result } from "../types";
import agent from "./agent";

// The API's HandleResult returns Ok(result.Value), which is just the string ID, not a Result<string>
const createMember = async (member: Member, files: File[] = []): Promise<string | Result<string>> => {
  if (!member.email) {
    throw new Error("Email is required");
  }

  const normalizeEnumValue = (value?: string | null) => {
    if (!value) return "";
    if (/^[A-Z]/.test(value)) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const serializeAddresses = (addresses?: Address[]) =>
    JSON.stringify(
      (addresses ?? []).map((addr) => ({
        Id: addr.id,
        Street: addr.street,
        City: addr.city,
        State: addr.state,
        Country: addr.country,
        ZipCode: addr.zipCode,
      }))
    );

  const serializeFamilyMembers = (familyMembers?: FamilyMember[]) =>
    JSON.stringify(
      (familyMembers ?? []).map((family) => ({
        Id: family.id,
        MemberFamilyFirstName: family.memberFamilyFirstName,
        MemberFamilyMiddleName: family.memberFamilyMiddleName,
        MemberFamilyLastName: family.memberFamilyLastName,
        Relationship: family.relationship,
      }))
    );

  const serializePayments = (payments?: Payment[]) =>
    JSON.stringify(
      (payments ?? [])
        .filter((payment) => !!payment.paymentType || !!payment.paymentAmount)
        .map((payment) => ({
          Id: payment.id,
          Amount:
            typeof payment.paymentAmount === "number"
              ? payment.paymentAmount
              : Number(payment.paymentAmount) || 0,
          PaymentDate: payment.paymentDate ?? "",
          PaymentType: normalizeEnumValue(payment.paymentType),
          PaymentRecurringType: normalizeEnumValue(payment.paymentRecurringType),
        }))
    );

  const serializeIncidents = (incidents?: Incident[]) =>
    JSON.stringify(
      (incidents ?? [])
        .filter((incident) => !!incident.incidentType || !!incident.paymentDate)
        .map((incident) => {
          const paymentDate = incident.paymentDate || incident.incidentDate || "";
          const incidentDate = incident.incidentDate || incident.paymentDate || "";
          const eventNumber =
            typeof incident.eventNumber === "string"
              ? parseInt(incident.eventNumber, 10) || 0
              : incident.eventNumber ?? 0;
          return {
            Id: incident.id,
            IncidentType: normalizeEnumValue(incident.incidentType),
            IncidentDescription: incident.incidentDescription ?? "",
            PaymentDate: paymentDate,
            IncidentDate: incidentDate,
            EventNumber: eventNumber,
          };
        })
    );

  const formData = new FormData();

  // Basic fields
  formData.append("MemberDto.Id", member.id ?? '');
  formData.append("MemberDto.FirstName", member.firstName ?? '');
  formData.append("MemberDto.MiddleName", member.middleName ?? '');
  formData.append("MemberDto.LastName", member.lastName ?? '');
  formData.append("MemberDto.Email", member.email ?? '');
  formData.append("MemberDto.PhoneNumber", member.phoneNumber ?? '');
  formData.append("MemberDto.RegisterDate", member.registerDate ?? '');
  formData.append("MemberDto.ReceiverId", member.receiverId ?? '');

  // Booleans
  formData.append("MemberDto.IsActive", String(member.isActive ?? false));
  formData.append("MemberDto.IsAdmin", String(member.isAdmin ?? false));

  // Username and Password (for admin members)
  // Note: C# model binding is case-sensitive, use PascalCase to match MemberDto properties
  if (member.userName) {
    formData.append("MemberDto.UserName", member.userName);
  }
  if (member.password) {
    formData.append("MemberDto.Password", member.password);
  }

  // Nested collections as JSON
  formData.append("MemberDto.AddressesJson", serializeAddresses(member.addresses));
  formData.append("MemberDto.FamilyMembersJson", serializeFamilyMembers(member.familyMembers));
  formData.append("MemberDto.PaymentsJson", serializePayments(member.payments));
  formData.append("MemberDto.IncidentsJson", serializeIncidents(member.incidents));

  // Files
  files.forEach(file => formData.append("files", file));

  // POST using agent
  // HandleResult returns Ok(result.Value), so the response is just the string ID
  const response = await agent.agentFormData.postFormData<string>(
    '/members',
    formData
  );

  // Make sure to return the API result (not AxiosResponse)
  // The API returns just the string ID directly
  return response;
};

export default createMember;
