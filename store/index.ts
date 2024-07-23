import { defineStore } from 'pinia';
//import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { setToken } from '@/src/axios';
import { get, post } from '@/src/requests';
import { type User } from '@/src/User';

export const useMainStore = defineStore('main', {
    state: () => ({
        authToken: sessionStorage.getItem("authToken") ?? "",
        //authToken: '',
        //stateUser: <User>{},
        stateUser: <User>JSON.parse(sessionStorage.getItem("stateUser") ?? "{}"),
        //stateuser: Object as PropType<User>
        //currentPage: sessionStorage.getItem("currentPage") ?? "",
        currentPage: 'start', 

        //straks: voor de bingokaart invul pagina als ik dynamisch iets wil gaan bijhouden welke kaart er hoe is ingevuld/geklikt, 
        //wellicht toch in de store state wat gaan doen? 
        
        //(straks tabel en bingocardRow component gebruiken op kaartInvullen pagina voor selecteren van een kaart),
        //daarna een component wat daarbinnen ook een component gebruikt om de bingokaart weer te geven en interactief te maken 
        //voor design straks googlen op dingen als: vueJS/nuxt components bingocard website, html/css/bootstrap design bingocard webpage ofzo
        //(methoden gaan maken omom bingo te detecteren natuurlijk) (verticale, horizontale of diagonale bingo kunnen spotten straks? (wie weet, we'll see how far we get...))
    }),
    getters: {
        getToken: (state) => state.authToken,
        getUser: (state) => state.stateUser,
        getCurrentPage: (state) => state.currentPage,
        //getUser: (state) => <User>state.stateUser
    },
    actions: {
        async login(details: { username: string, password: string }): Promise<boolean> {
            try {
                let res = await post('/user/login', details).then( (res) => { return JSON.parse(res.data)});

                /*console.log(`result: ${res}`);
                console.log(`what the: ${res.errorMessage}`);
                console.log(`token: ${res.jwt}`);*/

                if(res.errorMessage) {
                    return false;
                } /*else {
                    console.log(`token: ${res.jwt}`);
                }*/


                this.authToken = res.jwt;



                sessionStorage.setItem("authToken", res.jwt);

                setToken(res.jwt);
    
                let user = await get(`/user/getOne/${res.userId}`).then( (user) => { return JSON.parse(user.data)});


                if(!sessionStorage.getItem("stateUser")) {
                    this.stateUser = <User>user;
                    sessionStorage.setItem("stateUser", JSON.stringify(user));
                }
                
                /*if(!(sessionStorage.getItem("stateUser"))) {
                    sessionStorage.setItem("stateUser", JSON.stringify(user));
                }*/



                /*if(sessionStorage.getItem("stateUser")) {
                    this.stateUser = <User>user;
                }*/

                //dit hoeft niet: de api checkt al bij login op of de gebruiker bestaat of niet, hoeft hier dus niet halsoverkop uitgelogd te worden!
                /*if(!(user) || !(user.id)) {
                    sessionStorage.clear();
                }*/



                /*let result = user.json();

                console.log(`first result: ${result}`);*/



                //this.stateUser = <User>user;//JSON.stringify(user);

                //sessionStorage.setItem("stateUser", JSON.stringify(user));



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
        autoLogin() {
            setToken(this.getToken);
        }
        /*logout() {
            //de eerste twee regels doen hier nu niets, want de state is gevuld met sessionStorage vars/props, dus ook de this.stateProp regels in de methodes hierboven
            //zijn nu nutteloos...whoops, ik zal aan het einde van development, in cleanup/straks gaan kiezen om OF session of direct state management storage te gebruiken!
            this.authToken = "";
            this.stateUser = <User>{};
            sessionStorage.clear();
        }*/
    },
})

//export type RootState = ReturnType<typeof useMainStore.state>;
