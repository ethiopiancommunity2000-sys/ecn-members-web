import { makeAutoObservable, runInAction } from "mobx";
import type { Member, MemberFile } from "../lib/types";
import agent from "../lib/api/agent";
//import { Member } from "../../lib/types";
//import agent from "../../lib/api/agent";

class MemberStore {
  members: Member[] = [];
  member: Member | undefined = undefined;
  memberFiles: MemberFile[] = [];

  memberRegistry = new Map<string, Member>();
  selectedMember: Member | undefined = undefined;

  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }




  public loadAllMembers = async () => {
    // Prevent multiple simultaneous calls
    if (this.loadingInitial) {
      return;
    }
    
    this.setLoadingInitial(true);
    try {
      const response = await agent.Members.list();
      console.log("API Response:", response);
      console.log("Response type:", typeof response);
      console.log("Is array:", Array.isArray(response));
      
      // API returns Member[] directly (HandleResult unwraps Result<Member[]>)
      let members: Member[] = [];
      
      if (Array.isArray(response)) {
        members = response;
      } else if (response && typeof response === 'object') {
        // Handle case where it might be wrapped
        const responseObj = response as { value?: Member[] };
        if ('value' in responseObj && Array.isArray(responseObj.value)) {
          members = responseObj.value;
        } else {
          console.warn("Unexpected response format:", response);
          members = [];
        }
      }

      console.log("Parsed members:", members.length);
      console.log("Members:", members);

      // Normalize member properties (handle both PascalCase and camelCase from API)
      const normalizedMembers = members.map((member: any) => {
        if (!member) return null;
        
        // Normalize payments array
        const paymentsArray = member.payments || member.Payments || [];
        const normalizedPayments = paymentsArray.map((payment: any) => {
          let formattedDate = '';
          if (payment.paymentDate || payment.PaymentDate) {
            const dateStr = payment.paymentDate || payment.PaymentDate;
            try {
              const date = new Date(dateStr);
              if (!isNaN(date.getTime())) {
                formattedDate = date.toISOString().split('T')[0];
              }
            } catch {
              formattedDate = dateStr;
            }
          }
          
          const paymentTypeStr = payment.paymentType || payment.PaymentType || '';
          const recurringTypeStr = payment.paymentRecurringType || payment.PaymentRecurringType || '';
          
          const amountValue = payment.amount ?? payment.Amount ?? payment.paymentAmount ?? payment.PaymentAmount;
          const finalAmount = amountValue != null ? (typeof amountValue === 'number' ? amountValue : parseFloat(String(amountValue))) : 0;
          
          return {
            id: payment.id || payment.Id || '',
            paymentAmount: isNaN(finalAmount) ? 0 : finalAmount,
            paymentDate: formattedDate,
            paymentType: paymentTypeStr,
            paymentRecurringType: recurringTypeStr,
          };
        });
        
        // Normalize addresses array
        const addressesArray = member.addresses || member.Addresses || [];
        const normalizedAddresses = addressesArray.map((address: any) => ({
          id: address.id || address.Id || '',
          street: address.street || address.Street || '',
          city: address.city || address.City || '',
          state: address.state || address.State || '',
          country: address.country || address.Country || '',
          zipCode: address.zipCode || address.ZipCode || '',
        }));
        
        // Normalize family members array
        const familyMembersArray = member.familyMembers || member.FamilyMembers || [];
        const normalizedFamilyMembers = familyMembersArray.map((fm: any) => ({
          id: fm.id || fm.Id || '',
          memberFamilyFirstName: fm.memberFamilyFirstName || fm.MemberFamilyFirstName || '',
          memberFamilyMiddleName: fm.memberFamilyMiddleName || fm.MemberFamilyMiddleName || '',
          memberFamilyLastName: fm.memberFamilyLastName || fm.MemberFamilyLastName || '',
          relationship: fm.relationship || fm.Relationship || '',
        }));
        
        // Normalize incidents array
        const incidentsArray = member.incidents || member.Incidents || [];
        const normalizedIncidents = incidentsArray.map((incident: any) => {
          // Format incident date for date input (YYYY-MM-DD)
          let formattedIncidentDate = '';
          const incidentDateValue = incident.incidentDate || incident.IncidentDate;
          if (incidentDateValue) {
            try {
              const date = new Date(incidentDateValue);
              if (!isNaN(date.getTime())) {
                formattedIncidentDate = date.toISOString().split('T')[0];
              }
            } catch {
              formattedIncidentDate = incidentDateValue;
            }
          }
          
        // Format payment date (legacy field, use incidentDate as fallback)
        // For incidents, paymentDate is the primary field used by the form
        let formattedPaymentDate = '';
        const paymentDateValue = incident.paymentDate || incident.PaymentDate || incidentDateValue;
        if (paymentDateValue) {
          try {
            const date = new Date(paymentDateValue);
            if (!isNaN(date.getTime())) {
              formattedPaymentDate = date.toISOString().split('T')[0];
            }
          } catch {
            formattedPaymentDate = paymentDateValue;
          }
        }
        
        // paymentDate is the source of truth - prioritize it
        // If paymentDate is valid, use it for both fields
        // If paymentDate is empty/MinValue but incidentDate is valid, use incidentDate for both
        let finalPaymentDate = formattedPaymentDate;
        let finalIncidentDate = formattedIncidentDate;
        
        // Check if paymentDate is valid (not empty, not MinValue)
        const isValidPaymentDate = formattedPaymentDate && 
            formattedPaymentDate !== '0001-01-01' && 
            formattedPaymentDate !== '1970-01-01';
        
        // Check if incidentDate is valid (not empty, not MinValue)
        const isValidIncidentDate = formattedIncidentDate && 
            formattedIncidentDate !== '0001-01-01' && 
            formattedIncidentDate !== '1970-01-01';
        
        // If paymentDate is valid, use it for both
        if (isValidPaymentDate) {
          finalPaymentDate = formattedPaymentDate;
          finalIncidentDate = formattedPaymentDate; // Copy paymentDate to incidentDate
        }
        // If paymentDate is invalid but incidentDate is valid, use incidentDate for both
        else if (isValidIncidentDate) {
          finalPaymentDate = formattedIncidentDate; // Copy incidentDate to paymentDate
          finalIncidentDate = formattedIncidentDate;
        }
        // If both are invalid, keep them as empty strings
        else {
          finalPaymentDate = '';
          finalIncidentDate = '';
        }
        
        const eventNumberRaw = incident.eventNumber ?? incident.EventNumber ?? 0;
        const eventNumberValue = typeof eventNumberRaw === 'string' ? parseInt(eventNumberRaw, 10) || 0 : eventNumberRaw ?? 0;
        
        return {
          id: incident.id || incident.Id || '',
          incidentType: incident.incidentType || incident.IncidentType || '',
          incidentDescription: incident.incidentDescription || incident.IncidentDescription || '',
          paymentDate: finalPaymentDate,
          incidentDate: finalIncidentDate,
          eventNumber: eventNumberValue,
        };
      });
        
        // Normalize memberFiles array
        const memberFilesArray = member.memberFiles || member.MemberFiles || [];
        const normalizedMemberFiles = memberFilesArray.map((file: any) => {
          // Handle base64FileData - API returns it as Base64FileData (PascalCase) or base64FileData (camelCase)
          let base64Data = file.base64FileData || file.Base64FileData || '';
          
          // If ImageData is present but base64FileData is not, convert it
          if (!base64Data && (file.imageData || file.ImageData)) {
            // If ImageData is a byte array, we need to convert it to base64
            // But in JSON, byte arrays are usually already base64 strings
            const imageData = file.imageData || file.ImageData;
            if (typeof imageData === 'string') {
              base64Data = imageData;
            } else if (Array.isArray(imageData)) {
              // Convert byte array to base64 string
              const uint8Array = new Uint8Array(imageData);
              const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
              base64Data = btoa(binaryString);
            }
          }
          
          return {
            id: file.id || file.Id || '',
            fileName: file.fileName || file.FileName || '',
            fileType: file.fileType || file.FileType || '',
            base64FileData: base64Data,
            paymentId: file.paymentId || file.PaymentId || '',
            fileDescription: file.fileDescription || file.FileDescription || '',
          };
        });
        
        // Handle both Id/id and other property name variations
        const normalized: Member = {
          id: member.id || member.Id || '',
          firstName: member.firstName || member.FirstName || '',
          receiverId: member.receiverId || member.receiverId || '',
          middleName: member.middleName || member.MiddleName || '',
          lastName: member.lastName || member.LastName || '',
          email: member.email || member.Email || '',
          phoneNumber: member.phoneNumber || member.PhoneNumber || '',
          registerDate: member.registerDate || member.RegisterDate || '',
          isActive: member.isActive ?? member.IsActive ?? false,
          isAdmin: member.isAdmin ?? member.IsAdmin ?? false,
          userName: member.userName || member.UserName,
          bio: member.bio || member.Bio,
          addresses: normalizedAddresses,
          familyMembers: normalizedFamilyMembers,
          memberFiles: normalizedMemberFiles,
          payments: normalizedPayments,
          incidents: normalizedIncidents,
        };
        
        return normalized;
      }).filter((m): m is Member => m !== null && !!m.id);

      console.log("Normalized members:", normalizedMembers.length);
      console.log("Normalized:", normalizedMembers);

      runInAction(() => {
        this.members = normalizedMembers;
        this.memberRegistry.clear();
        normalizedMembers.forEach(member => {
          if (member && member.id) {
            this.memberRegistry.set(member.id, member);
          }
        });
        this.setLoadingInitial(false);
      });
    } catch (error) {
      console.error("Error loading members:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      runInAction(() => {
        this.members = [];
        this.setLoadingInitial(false);
      });
    }
  };






  loadMember = async (id?: string) => {
    try {
      if (!id) throw new Error("Member ID is required");
      console.log('MemberStore.loadMember - Loading member with ID:', id);
      this.setLoading(true);
      const member = await agent.Members.details(id);
      console.log('MemberStore.loadMember - API response (member):', member);
      
      if (!member) {
        console.error('MemberStore.loadMember - No member in response');
        this.setLoading(false);
        return;
      }
      
      console.log('MemberStore.loadMember - Member received:', member?.id, member?.firstName);
      console.log('MemberStore.loadMember - MemberFiles in response:', member?.memberFiles?.length ?? 0);
      if (member?.memberFiles && member.memberFiles.length > 0) {
        console.log('MemberStore.loadMember - MemberFiles details:', member.memberFiles.map(f => ({ id: f.id, fileName: f.fileName, paymentId: f.paymentId })));
      }
      
      // Normalize payments array
      const paymentsArray = member.payments || (member as any).Payments || [];
      const normalizedPayments = paymentsArray.map((payment: any) => {
        let formattedDate = '';
        if (payment.paymentDate || payment.PaymentDate) {
          const dateStr = payment.paymentDate || payment.PaymentDate;
          try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              formattedDate = date.toISOString().split('T')[0];
            }
          } catch {
            formattedDate = dateStr;
          }
        }
        
        const paymentTypeStr = payment.paymentType || payment.PaymentType || '';
        const recurringTypeStr = payment.paymentRecurringType || payment.PaymentRecurringType || '';
        
        const amountValue = payment.amount ?? payment.Amount ?? payment.paymentAmount ?? payment.PaymentAmount;
        const finalAmount = amountValue != null ? (typeof amountValue === 'number' ? amountValue : parseFloat(String(amountValue))) : 0;
        
        return {
          id: payment.id || payment.Id || '',
          paymentAmount: isNaN(finalAmount) ? 0 : finalAmount,
          paymentDate: formattedDate,
          paymentType: paymentTypeStr,
          paymentRecurringType: recurringTypeStr,
        };
      });
      
      // Normalize addresses array
      const addressesArray = member.addresses || (member as any).Addresses || [];
      const normalizedAddresses = addressesArray.map((address: any) => ({
        id: address.id || address.Id || '',
        street: address.street || address.Street || '',
        city: address.city || address.City || '',
        state: address.state || address.State || '',
        country: address.country || address.Country || '',
        zipCode: address.zipCode || address.ZipCode || '',
      }));
      
      // Normalize family members array
      const familyMembersArray = member.familyMembers || (member as any).FamilyMembers || [];
      const normalizedFamilyMembers = familyMembersArray.map((fm: any) => ({
        id: fm.id || fm.Id || '',
        memberFamilyFirstName: fm.memberFamilyFirstName || fm.MemberFamilyFirstName || '',
        memberFamilyMiddleName: fm.memberFamilyMiddleName || fm.MemberFamilyMiddleName || '',
        memberFamilyLastName: fm.memberFamilyLastName || fm.MemberFamilyLastName || '',
        relationship: fm.relationship || fm.Relationship || '',
      }));
      
      // Normalize incidents array
      const incidentsArray = member.incidents || (member as any).Incidents || [];
      const normalizedIncidents = incidentsArray.map((incident: any) => {
        // Format incident date for date input (YYYY-MM-DD)
        let formattedIncidentDate = '';
        const incidentDateValue = incident.incidentDate || incident.IncidentDate;
        if (incidentDateValue) {
          try {
            const date = new Date(incidentDateValue);
            if (!isNaN(date.getTime())) {
              formattedIncidentDate = date.toISOString().split('T')[0];
            }
          } catch {
            formattedIncidentDate = incidentDateValue;
          }
        }
        
        // Format payment date (legacy field, use incidentDate as fallback)
        // For incidents, paymentDate is the primary field used by the form
        let formattedPaymentDate = '';
        const paymentDateValue = incident.paymentDate || incident.PaymentDate || incidentDateValue;
        if (paymentDateValue) {
          try {
            const date = new Date(paymentDateValue);
            if (!isNaN(date.getTime())) {
              formattedPaymentDate = date.toISOString().split('T')[0];
            }
          } catch {
            formattedPaymentDate = paymentDateValue;
          }
        }
        
        // paymentDate is the source of truth - prioritize it
        // If paymentDate is valid, use it for both fields
        // If paymentDate is empty/MinValue but incidentDate is valid, use incidentDate for both
        let finalPaymentDate = formattedPaymentDate;
        let finalIncidentDate = formattedIncidentDate;
        
        // Check if paymentDate is valid (not empty, not MinValue)
        const isValidPaymentDate = formattedPaymentDate && 
            formattedPaymentDate !== '0001-01-01' && 
            formattedPaymentDate !== '1970-01-01';
        
        // Check if incidentDate is valid (not empty, not MinValue)
        const isValidIncidentDate = formattedIncidentDate && 
            formattedIncidentDate !== '0001-01-01' && 
            formattedIncidentDate !== '1970-01-01';
        
        // If paymentDate is valid, use it for both
        if (isValidPaymentDate) {
          finalPaymentDate = formattedPaymentDate;
          finalIncidentDate = formattedPaymentDate; // Copy paymentDate to incidentDate
        }
        // If paymentDate is invalid but incidentDate is valid, use incidentDate for both
        else if (isValidIncidentDate) {
          finalPaymentDate = formattedIncidentDate; // Copy incidentDate to paymentDate
          finalIncidentDate = formattedIncidentDate;
        }
        // If both are invalid, keep them as empty strings
        else {
          finalPaymentDate = '';
          finalIncidentDate = '';
        }
        
        const eventNumberRaw = incident.eventNumber ?? incident.EventNumber ?? 0;
        const eventNumberValue = typeof eventNumberRaw === 'string' ? parseInt(eventNumberRaw, 10) || 0 : eventNumberRaw ?? 0;
        
        return {
          id: incident.id || incident.Id || '',
          incidentType: incident.incidentType || incident.IncidentType || '',
          incidentDescription: incident.incidentDescription || incident.IncidentDescription || '',
          paymentDate: finalPaymentDate,
          incidentDate: finalIncidentDate,
          eventNumber: eventNumberValue,
        };
      });
      
      // Normalize memberFiles array
      const memberFilesArray = member.memberFiles || (member as any).MemberFiles || [];
      const normalizedMemberFiles = memberFilesArray.map((file: any) => {
        // Handle base64FileData - API returns it as Base64FileData (PascalCase) or base64FileData (camelCase)
        let base64Data = file.base64FileData || file.Base64FileData || '';
        
        // If ImageData is present but base64FileData is not, convert it
        if (!base64Data && (file.imageData || file.ImageData)) {
          // If ImageData is a byte array, we need to convert it to base64
          // But in JSON, byte arrays are usually already base64 strings
          const imageData = file.imageData || file.ImageData;
          if (typeof imageData === 'string') {
            base64Data = imageData;
          } else if (Array.isArray(imageData)) {
            // Convert byte array to base64 string
            const uint8Array = new Uint8Array(imageData);
            const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
            base64Data = btoa(binaryString);
          }
        }
        
        return {
          id: file.id || file.Id || '',
          fileName: file.fileName || file.FileName || '',
          fileType: file.fileType || file.FileType || '',
          base64FileData: base64Data,
          paymentId: file.paymentId || file.PaymentId || '',
          fileDescription: file.fileDescription || file.FileDescription || '',
        };
      });
      
      // Normalize the member object
      const normalizedMember: Member = {
        id: member.id || (member as any).Id || '',
        firstName: member.firstName || (member as any).FirstName || '',
        receiverId: member.receiverId || (member as any).receiverId || '',
        middleName: member.middleName || (member as any).MiddleName || '',
        lastName: member.lastName || (member as any).LastName || '',
        email: member.email || (member as any).Email || '',
        phoneNumber: member.phoneNumber || (member as any).PhoneNumber || '',
        registerDate: member.registerDate || (member as any).RegisterDate || '',
        isActive: member.isActive ?? (member as any).IsActive ?? false,
        isAdmin: member.isAdmin ?? (member as any).IsAdmin ?? false,
        userName: member.userName || (member as any).UserName,
        bio: member.bio || (member as any).Bio,
        addresses: normalizedAddresses,
        familyMembers: normalizedFamilyMembers,
        memberFiles: normalizedMemberFiles,
        payments: normalizedPayments,
        incidents: normalizedIncidents,
      };
      
      console.log('MemberStore.loadMember - Normalized MemberFiles count:', normalizedMemberFiles.length);
      if (normalizedMemberFiles.length > 0) {
        console.log('MemberStore.loadMember - Normalized MemberFiles:', normalizedMemberFiles.map((f :any) => ({ id: f.id, fileName: f.fileName, paymentId: f.paymentId })));
      }
      
      runInAction(() => {
        this.selectedMember = normalizedMember;
        // Also update the registry
        if (normalizedMember.id) {
          this.memberRegistry.set(normalizedMember.id, normalizedMember);
        }
        this.setLoading(false);
        console.log('MemberStore.loadMember - Member loaded successfully:', normalizedMember.id);
      });
    } catch (error) {
      console.error('MemberStore.loadMember - Failed to load member:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      this.setLoading(false);
      // Re-throw or set an error state so the UI can show an error message
      throw error;
    }
  }

  async createMember(member: Member) {
    try {
      await agent.Members.create(member);
      runInAction(() => {
        if (member.id) {
          this.memberRegistry.set(member.id, member);
        }
        this.selectedMember = member;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.error('Failed to create member:', error);
    }
  }

  async updateMember(member: Member) {
    try {
      await agent.Members.update(member);
      runInAction(() => {
        if (member.id) {
          this.memberRegistry.set(member.id, member);
        }
        this.selectedMember = member;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  }
  async deleteMember(id: string) {
    try {
      await agent.Members.delete(id);
      runInAction(() => {
        this.memberRegistry.delete(id);
        this.members = this.members.filter(m => m.id !== id);
        this.selectedMember = undefined;
      });
    } catch (error) {
      console.error('Failed to delete member:', error);
      throw error; // Re-throw so the component can handle it
    }
  }

  setSelectedMember = (id: string) => {
    this.selectedMember = this.memberRegistry.get(id);
  };
  
  clearSelectedMember = () => {
    this.selectedMember = undefined;
  };
  
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }
  setLoading = (state: boolean) => {
    this.loading = state;
  }

  setEditMode = (mode: boolean) => {
    this.editMode = mode;
  };

  searchMembers = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return Array.from(this.memberRegistry.values());

    return Array.from(this.memberRegistry.values()).filter(member =>
      member.firstName.toLowerCase().includes(trimmedQuery) ||
      member.lastName.toLowerCase().includes(trimmedQuery) ||
      member.email.toLowerCase().includes(trimmedQuery) ||
      member.phoneNumber.toLowerCase().includes(trimmedQuery)
    );
  };


}

export default MemberStore
