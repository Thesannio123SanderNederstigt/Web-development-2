import { defineStore } from 'pinia';
import { setToken } from '@/src/axios';
import { get, post } from '@/src/requests';
import { type User } from '@/src/User';

export const useMainStore = defineStore('main', {
    state: () => ({
        authToken: sessionStorage.getItem("authToken") ?? "",
        stateUser: <User>JSON.parse(sessionStorage.getItem("stateUser") ?? "{}"),
        currentPage: 'start',
    }),
    getters: {
        getToken: (state) => state.authToken,
        getUser: (state) => state.stateUser,
        getCurrentPage: (state) => state.currentPage,
    },
    actions: {
        async login(details: { username: string, password: string }): Promise<boolean> {
            try {
                let res = await post('/user/login', details).then( (res) => { return JSON.parse(res.data)});

                if(res.errorMessage) {
                    return false;
                }

                this.authToken = res.jwt;

                sessionStorage.setItem("authToken", res.jwt);

                setToken(res.jwt);
    
                let user = await get(`/user/getOne/${res.userId}`).then( (user) => { return JSON.parse(user.data)});

                if(!sessionStorage.getItem("stateUser")) {
                    this.stateUser = <User>user;
                    sessionStorage.setItem("stateUser", JSON.stringify(user));
                }
    
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        autoLogin() {
            setToken(this.getToken);
        }
    },
})