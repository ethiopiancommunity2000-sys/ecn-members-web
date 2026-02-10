import { makeAutoObservable, runInAction } from "mobx";
import agent from "../lib/api/agent";

export default class UserStore {
    token: string | null = localStorage.getItem('jwt');
    username: string | null = null;
    email: string | null = null;

    constructor() {
        makeAutoObservable(this);
        if (this.token) {
            this.getCurrentUser();
        }
    }

    get isLoggedIn() {
        return !!this.token;
    }

    login = async (username: string, password: string) => {
        const user = await agent.Account.login({ username, password });
        runInAction(() => {
            this.token = user.token;
            this.username = user.username;
            this.email = user.email;
        });
        localStorage.setItem('jwt', user.token);
        return user;
    }

    logout = () => {
        this.token = null;
        this.username = null;
        this.email = null;
        localStorage.removeItem('jwt');
    }

    getCurrentUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                this.username = user.username;
                this.email = user.email;
            });
        } catch (error) {
            runInAction(() => {
                this.logout();
            });
        }
    }
}

