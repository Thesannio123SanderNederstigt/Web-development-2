<script lang="ts">

import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            loginError: false,
            validInput: false,
            usernameInput: "",
            passwordInput: "",
        }
    },
    methods: {
        registerUser(){
            this.$emit('showRegisterForm');
            //this.$router.push("/bla");
        },
        loginSubmit(): boolean {
            event?.preventDefault();
            this.login();
            return false;
        },
        async login()
        {
            try {
                if (await this.$store.login({username: this.usernameInput, password: this.passwordInput})) {
                    //console.log("test test, komen we hier?"); //het antwoord is ja
                    //this.$router.push("/");
                    //this.$router.push("/bla");

                    //this.$router.replace({ path: '/'});

                    if(this.$store.$state.authToken !== "" && this.$store.$state.stateUser.id !== "")
                    {
                        this.$router.replace({ path: '/'});
                    }

                } else {
                    this.loginError = true;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        validate()
        {
            this.validInput = this.usernameInput !== "" && this.passwordInput !== "";
        }
    },
    emits: ['showRegisterForm'],
});
</script>

<template>
    <h2 class="text-center text-secondary mb-4 website-logo-text">Inloggen</h2>
    <form name="login-form" @submit="loginSubmit">
        <section class="row gy-2 overflow-hidden">
            <section class="col-12">
                <section class="form-floating mb-3">
                    <input type="text" class="form-control" name="login-username" id="login-username" placeholder="John Doe" required 
                    v-model="usernameInput" @input="validate" :style="[loginError ? { 'border-color': '#E80F0F'} : {}]" />
                    <label for="form-username" class="form-label">Gebruikersnaam</label>
                </section>
            </section>
            <section class="col-12">
                <section class="form-floating mb-3">
                    <input type="password" class="form-control" name="login-password" id="login-password" placeholder="Wachtwoord" required 
                    v-model="passwordInput" @input="validate" @keypress.prevent.enter="login" :style="[loginError ? { 'border-color': '#E80F0F'} : {}]" />
                    <label for="password" class="form-label">Wachtwoord</label>
                </section>
            </section>
            <section class="col-12">
                <p class="m-0 text-secondary text-center warningtext" v-show="loginError">Onjuiste inloggegevens ingevoerd!</p>
            </section>
        </section>
        <section class="col-12">
            <section class="d-grid my-3">
                <button class="btn btn-primary btn-lg" type="submit" :disabled="!validInput">Log in</button>
            </section>
        </section>
    </form>
    <section class="col-12">
        <section class="d-grid my-3">
            <h1 class="website-logo-text">--- OF ---</h1>
        </section>
    </section>
    <section class="col-12">
        <section class="d-grid my-3">
            <button class="btn btn-success btn-lg" type="button" @click="registerUser">Meld je aan</button>
        </section>
    </section>
</template>

<style scoped>

</style>