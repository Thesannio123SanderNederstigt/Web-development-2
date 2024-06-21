import { defineStore } from 'pinia';
//import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { setToken } from '@/src/axios';
import { post } from '@/src/requests';
import { get } from '@/src/requests';
//import { User } from '@/src/User';

export const useMainStore = defineStore('main', {
    state: () => ({
        authToken: sessionStorage.getItem("authToken") ?? "",
        stateUser: JSON.parse(sessionStorage.getItem("stateUser") ?? "{}"),
    }),
    getters: {
        getToken: (state) => state.authToken,
        getUser: (state) => state.stateUser
    },
    actions: {
        async login({ }, details: { username: string, password: string }): Promise<boolean> {
            try {
                const res = await post('/login', details).then( (res) => { return JSON.parse(res.data)});
                //TODO: kiezen; Welke van deze drie opties ga ik kiezen (voor beide props van de state)?
                //sessionStorage.setItem("authToken", res.accessToken);
                //this.$state.authToken = res.accessToken;
                //this.authToken = res.accessToken;
                setToken(res.accessToken);
    
                const user = await get(`/user/getOne/${res.userId}`).then( (user) => { return JSON.parse(user.data)});
                //sessionStorage.setItem("stateUser", user);
                //this.$state.stateUser = user;
                //this.stateUser = user;
    
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        },
    },
})

//export type RootState = ReturnType<typeof useMainStore.state>;
