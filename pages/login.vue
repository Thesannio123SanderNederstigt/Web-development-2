<script lang="ts">
import { defineComponent } from "vue";
import loginForm from "@/components/loginForm.vue";
import registerForm from "~/components/registerForm.vue";

export default defineComponent({
    components: {
        loginForm,
        registerForm
    },
    data() {
        return {
            displayButtons: true,
            displayLoginForm: false,
            displayRegisterForm: false,
            userCreated: false
        }
    },
    beforeCreate() {
        //check of de gebruiker nog een token heeft en naar de homepage ge-routet kan worden
        if (this.$store.$state.authToken !== "") {
            this.$router.push('/');
        }
        //this.loginError = false;
    },
    methods: {
        showLoginForm() {
            this.displayLoginForm = true;
            this.displayRegisterForm = false;
            this.displayButtons = false;
        },
        showRegisterForm() {
            this.userCreated = false;
            this.displayRegisterForm = true;
            this.displayLoginForm = false;
            this.displayButtons = false;
        },
        showUserCreated() {
            this.userCreated = true;
            this.showLoginForm();
        }
    }
});
</script>

<template>
    <body>
        <section class="container" id="logincontainer">
            <section class="row justify-content-center">
                <section class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                    <section class="card border border-light-subtle rounded-3 shadow-sm">
                        <section class="card-body p-3 p-md-4 p-xl-5">
                            <section class="text-center mb-3">
                                <img src="@/assets/schaatsbingo-logo.svg" class="website-logo-image" alt="Schaatsbingo.nl Logo">
                            </section>
                            <h1 class="website-logo-text mb-3">Welkom bij Schaatsbingo.nl!</h1>

                            <p v-if="userCreated" class="text-center text-secondary mb-4 website-logo-text successtext">Account succesvol aangemaakt!</p>

                            <section v-if="displayButtons" class="row gy-2 gy-xxl-2 mt-2 flex-categories-container">
                                <section class="col-12 col-md-6 col-xxl-6 mb-3">
                                    <section class="d-grid my-3">
                                        <button class="btn btn-primary btn-lg" type="button" @click="showLoginForm">Inloggen</button>
                                    </section>
                                </section>
                                <section class="col-12 col-md-6 col-xxl-6 mb-3">
                                    <section class="d-grid my-3">
                                        <button class="btn btn-success btn-lg" type="button" @click="showRegisterForm">Aanmelden</button>
                                    </section>
                                </section>
                            </section>

                            <loginForm v-if="displayLoginForm" @showRegisterForm="showRegisterForm" />
                            <registerForm v-if="displayRegisterForm" @showUserCreated="showUserCreated" @showLoginForm="showLoginForm" />

                        </section>
                    </section>
                </section>
            </section>
        </section>
    </body>
</template>

<style scoped>
body {
    display: block !important;
}

.website-logo-image {
    width: 200px;
    height: 190px;
}
</style>