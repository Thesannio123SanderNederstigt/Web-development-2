<script lang="ts">
//import Header from "@/components/Header.vue"
import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

export default defineComponent({
    components: {
        Header,
        Footer
    },
    beforeCreate() {
        if (this.$store.$state.authToken === "") {
            //console.log("test, doet dit nog iets?");
            //console.log(`token: ${this.$store.getToken}`);
            this.$router.replace({ path: "/login"/*, query: { next: "/" }*/ });
        }
    },
    created() { //dit was bedoeld om te testen, (de nuxt assistant pakt Nuxt niet op, maar door dit te doen werkt de app wel weer.. ok dan...)
        //console.log(`token: ${this.$store.getToken}`);
        //console.log(`amount of points of the first item in the first user bingocard: ${this.$store.$state.stateUser.bingocards[0].items[0].points}`);
        //TODO: maak hier later een lege cycle van dan?

        /*console.log(`created token: ${this.$store.$state.authToken}`);
        console.log(`created state user email: ${this.$store.$state.stateUser.email}`);
        console.log(sessionStorage.getItem("authToken"));
        console.log(sessionStorage.getItem("stateUser"));*/

        //TODO: KIEZEN SANDER, OF STATE OF SESSION STORAGE, MAAR NIET ALLEBEI OF ZOALS NU: DOOR ELKAAR GEBRUIKT 
        //(want nu vult de state zich met wat er in sessionStorage gevonden wordt!!!)
        this.$store.$state.currentPage = 'home';
        //sessionStorage.setItem("currentPage", 'home');

    },
    methods: {
        logStuff()
        {
            //console.log(`test, created token: ${this.$store.$state.authToken}`);
            //console.log(`whut: created state user email: ${this.$store.$state.stateUser.email}`);

            //console.log(sessionStorage.getItem("authToken"));
            //console.log(sessionStorage.getItem("stateUser"));

            this.$store.stateUser.email = 'veranderd@kandit.com';
            this.$store.stateUser.username = 'thisismynamenowlol';

            //console.log(`getUser: ${this.$store.getUser.email}`)
            //console.log(`page: ${this.$store.$state.currentPage}`);

            console.log(`state authToken: ${this.$store.$state.authToken}`);
            console.log(`state user email: ${this.$store.$state.stateUser.email}`);
            console.log(`state user name: ${this.$store.$state.stateUser.email}`);
            console.log(`state current page: ${this.$store.$state.currentPage}`);

            console.log(`session storage token: ${sessionStorage.getItem("authToken")}`);
            console.log(`session storage user: ${sessionStorage.getItem("stateUser")}`);
            //console.log(`session storage current page: ${sessionStorage.getItem("currentPage")}`);
        },
        resetSessionStorage()
        {
            sessionStorage.clear(); //logout?
            this.$store.$reset();
            console.log('Session storage cleared.');
        },
        /*userLogout()
        {
            this.$store.logout();
            this.$router.push("/login");
            //this.$router.push('/login');
            //this.$router.push({path: '/login'});
        }*/
    }
});
</script>

<template>
    <body>
        <Header />
            <section class="container mt-5">
                <section class="row justify-content-md-center">
                    <h1>Welkom bij Schaatsbingo.nl! {{ $store.$state.stateUser.username }}</h1>
                    <h1>Mijn email: {{ $store.$state.stateUser.email }}</h1>
                    <!--<h1>De punten van het eerste item op je eerste bingokaart: {{ $store.$state.stateUser.bingocards[0].items[0].points }}</h1>-->
                    <button @click="logStuff">click me!</button>
                    <button @click="resetSessionStorage">Reset Session Storage</button>
                    <!--<button @click="userLogout">Uitloggen</button>-->
                </section>
            </section>
        <Footer />
    </body>
</template>

<style scoped>
body {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
/*a:-webkit-any-link:hover {
    cursor: pointer;
}

a:hover {
    cursor: pointer;
}*/
</style>