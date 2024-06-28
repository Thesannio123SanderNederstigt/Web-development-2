import { defineStore } from 'pinia';
//import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { setToken } from '@/src/axios';
import { post } from '@/src/requests';
import { get } from '@/src/requests';
import { type User } from '@/src/User';

export const useMainStore = defineStore('main', {
    state: () => ({
        authToken: sessionStorage.getItem("authToken") ?? "",
        stateUser: <User>JSON.parse(sessionStorage.getItem("stateUser") ?? "{}"),
        //stateuser: Object as PropType<User>
    }),
    getters: {
        getToken: (state) => state.authToken,
        getUser: (state) => state.stateUser
        //getUser: (state) => <User>state.stateUser
    },
    actions: {
        async login(details: { username: string, password: string }): Promise<boolean> {
            try {
                const res = await post('/user/login', details).then( (res) => { return JSON.parse(res.data)});

                //console.log(`result: ${res}`);

                this.authToken = res.jwt;

                //TODO: kiezen; Welke van deze drie opties ga ik kiezen (voor beide props van de state)?
                sessionStorage.setItem("authToken", res.jwt);
                //this.$state.authToken = res.accessToken;
                //this.authToken = res.accessToken;
                setToken(res.jwt);
    
                const user = await get(`/user/getOne/${res.userId}`).then( (user) => { return JSON.parse(user.data)});

                
                /*let result = user.json();

                console.log(`first result: ${result}`);*/

                this.stateUser = <User>user;//JSON.stringify(user);

                sessionStorage.setItem("stateUser", JSON.stringify(user));

                //sessionStorage.setItem("stateuser", <User>JSON.stringify(user));

                //sessionStorage.setItem("stateUser", user);
                //this.$state.stateUser = user;
                //this.stateUser = user;

                /*if(this.authToken !== "") {
                    return true;
                }*/
    
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        },
    },
})

//export type RootState = ReturnType<typeof useMainStore.state>;
