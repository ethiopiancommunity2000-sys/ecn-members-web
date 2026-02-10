import MemberForm from "./MemberForm";

export function MemberFormWrapper() {
    // MemberForm handles submission internally using the store
    // No need to pass props as it uses useStore() directly
    return <MemberForm />;
}  
