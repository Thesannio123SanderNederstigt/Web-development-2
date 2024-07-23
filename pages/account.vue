<script lang="ts">
import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import accountInfo from "../components/accountInfo.vue"; //@/~

//import { get, put, del } from '@/src/requests'; //kijken of get request nodig is of niet
import { put, del } from '@/src/requests';
import { type User } from "@/src/User"; //kijken of dit nodig is of niet

export default defineComponent({
    components: {
        Header,
        Footer,
        accountInfo,
    },
    data: () => ({
        updateError: false,
        updateSuccess: false,
        deleteError: false,
        user: {} as User,
    }),
    beforeCreate() {
        if (this.$store.getToken === "") {
            this.$router.replace({ path: "/login"});
        } else if (this.$store.getToken != "") {
            this.$store.autoLogin();
        }
    },
    created() {
        this.$store.$state.currentPage = 'account';
        this.user = this.$store.$state.stateUser;
    },
    methods: {
        //updateUser & removeUser ? (en getUser voor alle info?)
        async updateUser(user: User)
        {
            try {
                console.log(`attempting to update user: ${JSON.stringify(user)}`);

                let res = await put(`/user/update/${user.id}`, { 
                        username: user.username,
                        password: user.password,
                        email: user.email
                    }).then((res) => { return JSON.parse(res.data)});

                if(res.errorMessage) {
                    this.updateError = true;
                    return false;
                }

                if(res.id != '') {

                    console.log(`response: ${JSON.stringify(res)}`);
                    this.user = user;
                    //this.$store.$state.stateUser.username = user.username;
                    this.$store.$state.stateUser = user;
                    this.updateSuccess = true;
                    return true;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async removeUser(id: string) {
            try {
                let result = await del(`/user/delete/${id}`).then( (res) => { return JSON.parse(res.data)});

                if(result.errorMessage) {
                    this.deleteError = true;
                    return false;
                }

                if(result == true) {
                    //in essentie een logout functie hier (wellicht nog $emitten of verwijzen naar de userLogout() functie van de Header?)
                    sessionStorage.clear();
                    this.$store.$reset();

                    this.$router.push("/login");
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        }
    }
});
</script>

<template>
    <body>
        <Header />

            <section class="container mt-5 mb-5" id="table-container"> 
                <section class="row justify-content-md-center">
                    <h1 class="mt-4 website-logo-text table-title-text">Mijn Accountgegevens</h1>
                </section>

                <section class="col-12">
                    <p class="m-0 text-secondary text-start errortext" v-if="updateError">Uw account kon niet worden bijgwerkt!</p>
                    <p class="mb-4 text-secondary text-start successtext" v-if="updateSuccess">Uw account is succesvol gewijzigd!</p>
                </section>
                <section class="col-12">
                    <p class="m-0 text-secondary text-start errortext" v-if="deleteError">Uw account kon niet succesvol worden verwijderd!</p>
                </section>

                <!--<accountInfo :gebruiker="user" :updateError="updateError" :updateSuccess="updateSuccess" :deleteError="deleteError" @updateUser="updateUser" @removeUser="removeUser" /> -->

                <accountInfo :gebruiker="user" @updateUser="updateUser" @removeUser="removeUser" />
            
            </section>

        <Footer />
    </body>
</template>

<style scoped>
.errortext {
    color: #ee2b1d !important;
    font-size: 1.85em !important;
    font-weight: 500;
}
</style>