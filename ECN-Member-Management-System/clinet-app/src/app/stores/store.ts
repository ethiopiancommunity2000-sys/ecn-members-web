import { createContext, useContext } from "react";
import MemberStore from "./MemberStore";
import UserStore from "./UserStore";


interface Store {
    memberStore : MemberStore;
    userStore: UserStore;
}

// The states (value)
export const store : Store = {
    memberStore : new MemberStore(),
    userStore: new UserStore()
}

// state provider (context)
export const StoreContext = createContext(store);

export function useStore() {

    return useContext(StoreContext)
}