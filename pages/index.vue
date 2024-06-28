<script lang="ts">
//import Header from "@/components/Header.vue"
import { defineComponent } from "vue"

export default defineComponent({
    components: {
        //Header,
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
        console.log(`created token: ${this.$store.$state.authToken}`);
        console.log(`created state user email: ${this.$store.$state.stateUser.email}`);
        console.log(sessionStorage.getItem("authToken"));
        console.log(sessionStorage.getItem("stateUser"));
    },
    methods: {
        logStuff()
        {
            console.log(`test ${this.$store.$state.authToken}`);
            console.log(`whut: ${this.$store.$state.stateUser.email}`);

            console.log(sessionStorage.getItem("authToken"));
            console.log(sessionStorage.getItem("stateUser"));

            console.log(`getUser: ${this.$store.getUser.email}`)
        },
        resetSessionStorage()
        {
            sessionStorage.clear(); //logout?
        }
    }
});
</script>

<template>
    <main>
        <section>
            <h1>Welkom op Schaatsbingo.nl! {{ $store.$state.stateUser.username }}</h1>
            <!--<h1>De punten van het eerste item op je eerste bingokaart: {{ $store.$state.stateUser.bingocards[0].items[0].points }}</h1>-->
            <button @click="logStuff">click me!</button>
            <button @click="resetSessionStorage">Reset Session Storage</button>

            <table class="pure-table pure-table-horizontal">
                <thead>
                    <tr>
                        <th>User management</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <NuxtLink to="/users">Users</NuxtLink>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <NuxtLink to="/groups">Groups</NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="pure-table pure-table-horizontal">
                <thead>
                    <tr>
                        <th>Target management</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <NuxtLink to="/targets">Targets</NuxtLink>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <NuxtLink to="/questions">Questions</NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="pure-table pure-table-horizontal">
                <thead>
                    <tr>
                        <th>Forums</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <NuxtLink to="/forums">Forums</NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
</template>

<style scoped>
table {
    float: left;
    width: 30%;
    max-width: 300px;
    margin-right: 3em;
    margin-bottom: 1.5em;
}
</style>