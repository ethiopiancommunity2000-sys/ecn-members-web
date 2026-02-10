import axios, { AxiosError, AxiosHeaders} from "axios";
import type { AxiosRequestConfig } from 'axios';
import type { AxiosResponse } from 'axios';
import type { Member, MemberFileDto, Result, User } from "../types";
import createMem from "./helper";
import { router } from "../../router/Routes";


// --------------------------------------------------
// Axios base config
// --------------------------------------------------
const runtimeApiUrl =
  (window as any).__APP_CONFIG__?.API_URL;

axios.defaults.baseURL =
  runtimeApiUrl ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000/api";


const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// --------------------------------------------------
// REQUEST INTERCEPTOR (FIXED – NO NESTING)
// --------------------------------------------------
axios.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? new AxiosHeaders();

    // IMPORTANT: do NOT force Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    const token = localStorage.getItem("jwt");
    const isPublic = config.url?.includes("/account/login");

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// RESPONSE INTERCEPTOR
// --------------------------------------------------
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      console.error("Network / CORS error", error);
      return Promise.reject(error);
    }

    const { status, config, data } = error.response as AxiosResponse<any>;

    switch (status) {
      case 400:
        if (data?.errors) {
          throw Object.values(data.errors).flat();
        }
        break;

      case 401:
        localStorage.removeItem("jwt");
        if (window.location.pathname !== "/login") {
          router.navigate("/login");
        }
        break;

      case 404:
        if (config.url?.includes("/members/") && config.method === "get") {
          router.navigate("/not-found");
        }
        break;

      case 500:
        console.error("Server error", data);
        break;
    }

    return Promise.reject(error);
  }
);

// --------------------------------------------------
// BASIC REQUEST HELPERS (JSON ONLY)
// --------------------------------------------------
const requests = {
  get: <T>(url: string) =>
    axios.get<T>(url).then(responseBody),

  post: <T>(url: string, body: unknown, config?: AxiosRequestConfig) =>
    axios
      .post<T>(url, body, {
        ...config,
        headers: { "Content-Type": "application/json" }
      })
      .then(responseBody),

  put: <T>(url: string, body: unknown, config?: AxiosRequestConfig) =>
    axios
      .put<T>(url, body, {
        ...config,
        headers: { "Content-Type": "application/json" }
      })
      .then(responseBody),

  delete: <T>(url: string) =>
    axios.delete<T>(url).then(responseBody),
};

// --------------------------------------------------
// MEMBERS API
// --------------------------------------------------
const Members = {
  list: () =>
    requests.get<Member[]>("/members"),

  details: (id: string) =>
    requests.get<Member>(`/members/${id}`),

  create: (member: Member, files: File[] = []) =>
    createMem(member, files),

  /**
   * Update member with optional files, fileDescription, and paymentId
   * Returns Member (unwrapped from Result by HandleResult)
   */
  update: (
    member: Member,
    files?: File[],
    fileDescription?: string,
    paymentId?: string
  ) => updateMemberWithFiles(member, files, fileDescription, paymentId),

  /**
   * SAFE helper: update + reload files
   * USE THIS in forms to avoid disappearing images
   */
  updateAndReloadFiles: async (member: Member) => {
    const updated = await updateMember(member);
    const files = await agent.Members.getFiles(member.id);

    return {
      ...updated,
      memberFiles: files
    };
  },


  delete: (id: string) =>
    requests.delete<Result<void>>(`/members/${id}`),

  // -------- FILES (SEPARATE RESOURCE) --------
  uploadFiles: (
    memberId: string,
    files: File[],
    fileDescription?: string,
    paymentId?: string
  ) => uploadFiles(memberId, files, fileDescription, paymentId),

  getFiles: (memberId: string): Promise<MemberFileDto[]> =>
    requests
      .get<MemberFileDto[]>(`/members/files/${memberId}`)
      .then((r) => Array.isArray(r) ? r : []),

  // Get a single file by ID (returns blob for image display)
  getFile: (fileId: string): Promise<Blob> =>
    axios
      .get(`/members/file/${fileId}`, {
        responseType: 'blob'
      })
      .then(response => response.data),

  // Delete a single file by ID
  deleteFile: async (fileId: string): Promise<void> => {
    const response = await axios.delete(`/members/file/${fileId}`);
    // 204 No Content is a successful delete, no data to return
    if (response.status === 204 || response.status === 200) {
      return;
    }
    // If we get here, something unexpected happened
    throw new Error(`Unexpected response status: ${response.status}`);
  },
};

// --------------------------------------------------
// ACCOUNT API
// --------------------------------------------------
const Account = {
  login: (credentials: { username: string; password: string }) =>
    requests.post<User>("/account/login", credentials),

  current: () =>
    requests.get<User>("/account/current"),
};

// --------------------------------------------------
// MEMBER ADDRESSES API
// --------------------------------------------------
const MemberAddresses = {
  delete: (id: string) =>
    requests.delete(`/addresses/${id}`),
};

// --------------------------------------------------
// UPDATE MEMBER (FORMDATA, WITH OPTIONAL FILES)
// --------------------------------------------------
const updateMemberWithFiles = async (
  member: Member,
  files?: File[],
  fileDescription?: string,
  paymentId?: string
): Promise<Member> => {
  const formData = new FormData();

  // Basic member fields - match MemberDto properties directly
  formData.append("Id", member.id ?? "");
  formData.append("FirstName", member.firstName ?? "");
  formData.append("MiddleName", member.middleName ?? "");
  formData.append("LastName", member.lastName ?? "");
  formData.append("Email", member.email ?? "");
  formData.append("PhoneNumber", member.phoneNumber ?? "");
  formData.append("RegisterDate", member.registerDate ?? "");
  formData.append("ReceiverId", member.receiverId ?? "");
  formData.append("IsActive", String(member.isActive ?? false));
  formData.append("IsAdmin", String(member.isAdmin ?? false));

  if (member.userName) formData.append("UserName", member.userName);
  if (member.bio) formData.append("Bio", member.bio);

  // Nested collections - send as JSON strings that backend will deserialize
  formData.append("AddressesJson", JSON.stringify((member.addresses ?? []).map(addr => ({
    Id: addr.id,
    Street: addr.street,
    City: addr.city,
    State: addr.state,
    Country: addr.country,
    ZipCode: addr.zipCode,
  }))));

  formData.append("FamilyMembersJson", JSON.stringify((member.familyMembers ?? []).map(fm => ({
    Id: fm.id,
    MemberFamilyFirstName: fm.memberFamilyFirstName,
    MemberFamilyMiddleName: fm.memberFamilyMiddleName,
    MemberFamilyLastName: fm.memberFamilyLastName,
    Relationship: fm.relationship,
  }))));

  formData.append("PaymentsJson", JSON.stringify((member.payments ?? []).map(pmt => ({
    Id: pmt.id,
    Amount: typeof pmt.paymentAmount === 'number' ? pmt.paymentAmount : Number(pmt.paymentAmount) || 0,
    PaymentDate: pmt.paymentDate ?? "",
    PaymentType: pmt.paymentType ?? "",
    PaymentRecurringType: pmt.paymentRecurringType ?? "",
  }))));

  formData.append("IncidentsJson", JSON.stringify((member.incidents ?? []).map(inc => {
    const paymentDate = inc.paymentDate || inc.incidentDate || "";
    const incidentDate = inc.incidentDate || inc.paymentDate || "";
    return {
      Id: inc.id,
      IncidentType: inc.incidentType ?? "",
      IncidentDescription: inc.incidentDescription ?? "",
      PaymentDate: paymentDate,
      IncidentDate: incidentDate,
      EventNumber: typeof inc.eventNumber === 'string' ? parseInt(inc.eventNumber, 10) || 0 : inc.eventNumber ?? 0,
    };
  })));

  // Files
  if (files && files.length > 0) {
    files.forEach(file => {
      formData.append("Files", file); // Match backend parameter name
    });
  }

  if (fileDescription) {
    formData.append("FileDescription", fileDescription);
  }

  if (paymentId) {
    formData.append("PaymentId", paymentId);
  }

  return axios
    .put<Member>(`/members/${member.id}`, formData)
    .then((r) => r.data); // HandleResult unwraps Result<MemberDto> to MemberDto directly
};

// --------------------------------------------------
// UPDATE MEMBER (FORMDATA, NO FILES) - For backward compatibility
// --------------------------------------------------
const updateMember = async (member: Member): Promise<Member> => {
  return updateMemberWithFiles(member);
};

// --------------------------------------------------
// UPLOAD FILES (FILES ONLY)
// --------------------------------------------------
const uploadFiles = async (
  memberId: string,
  files: File[],
  fileDescription?: string,
  paymentId?: string
) => {
  const formData = new FormData();

  files.forEach((f) => formData.append("files", f));
  if (fileDescription) formData.append("fileDescription", fileDescription);
  if (paymentId) formData.append("paymentId", paymentId);

  return axios
    .post<Result<MemberFileDto[]>>(
      `/members/uploads/${memberId}`,
      formData
    )
    .then((r) => r.data.value ?? []);
};

// --------------------------------------------------
// OPTIONAL: GENERIC FORMDATA HELPERS (KEEPED)
// --------------------------------------------------
const agentFormData = {
  post: <T>(url: string, body: unknown, config?: AxiosRequestConfig) =>
    axios.post<T>(url, body, config).then(responseBody),

  postFormData: <T>(url: string, body: FormData, config?: AxiosRequestConfig) =>
    axios.post<T>(url, body, config).then(responseBody),
};

// --------------------------------------------------
// EXPORT (COMPLETE)
// --------------------------------------------------
const agent = {
  request: requests,
  Members,
  Account,
  MemberAddresses,
  agentFormData,
  uploads: uploadFiles, // backward compatibility
};

export default agent;
