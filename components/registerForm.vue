<script lang="ts">

import { defineComponent } from "vue";
import { post } from '@/src/requests';

export default defineComponent({
    data() {
        return {
            registerError: false,
            validInput: false,
            newUserNameInput: "",
            newPasswordInput: "",
            newEmailInput: "",
            emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        }
    },

    methods: {
        loginUser()
        {
            this.$emit('showLoginForm');
        },
        displayUserCreated() { //call deze methode na succesvolle uitvoer van de api methode om nieuwe gebruiker aan te maken
            this.$emit('showUserCreated');
        },
        registerSubmit(): boolean {
            event?.preventDefault();
            this.createUser();
            return false;
        },
        async createUser()
        {
            try {
                //if success: this.displayUserCreated();
                //if( await post('/user/create', { username: this.newUserNameInput, password: this.newPasswordInput, email: this.newEmailInput }).then((response) => { return JSON.parse(response.data)})) {
                //if( await post('/user/create', { username: this.newUserNameInput, password: this.newPasswordInput, email: this.newEmailInput })) {
                let res = await post('/user/create', { 
                    username: this.newUserNameInput, 
                    password: this.newPasswordInput, 
                    email: this.newEmailInput 
                }).then((res) => { return JSON.parse(res.data)});

                if(res.errorMessage) {
                    this.registerError = true;
                    return false;
                }

                //if(response !== null && response !== "" && response.id !== ""){
                if(res != null && res.id != "") {
                    console.log(res);
                    this.displayUserCreated();
                } else {
                    this.registerError = true;
                }
            } catch(e) {
                console.error(e);
                return false;
            }

        },
        validate()
        {
            this.validInput = this.checkEmail() && this.newUserNameInput !== "" && this.newPasswordInput !== "";
        },
        checkEmail()
        {
            //Dit geeft true als de email-invoer niet leeg is en matched aan de regular expression van een valide emailadres, anders geeft dit false terug
            return !!((this.newEmailInput === "") ? "" : !!(this.emailRegex.test(this.newEmailInput)));
        }
    },
    emits: ['showUserCreated', 'showLoginForm'],
});
</script>

<template>
    <h2 class="text-center text-secondary mb-4 website-logo-text successtext">Nieuwe gebruiker</h2>
    <form name="register-form" @submit="registerSubmit">
        <section class="row gy-2 overflow-hidden">
            <section class="col-12">
                <section class="form-floating mb-3">
                    <input type="email" class="form-control" id="register-email" placeholder="E-mailadres" required 
                    v-model="newEmailInput" @input="validate" :style="[registerError ? { 'border-color': '#E80F0F'} : {}]" />
                    <label for="form-email" class="form-label">E-mailadres </label>
                </section>
            </section>
            <section class="col-12">
                <section class="form-floating mb-3">
                    <input type="text" class="form-control" name="register-username" placeholder="Gebruikersnaam" id="register-username" required 
                    v-model="newUserNameInput" @input="validate" :style="[registerError ? { 'border-color': '#E80F0F'} : {}]" />
                    <label for="form-username" class="form-label">Gebruikersnaam</label>
                </section>
            </section>
            <section class="col-12">
                <section class="form-floating mb-3">
                    <input type="password" class="form-control" name="register-password" placeholder="Wachtwoord" id="register-password" required 
                    v-model="newPasswordInput" @input="validate" @keypress.prevent.enter="createUser" :style="[registerError ? { 'border-color': '#E80F0F'} : {}]" />
                    <label for="password" class="form-label">Wachtwoord</label>
                </section>
            </section>
            <section class="col-12">
                <p class="m-0 text-secondary text-center warningtext" v-show="registerError">De gebruiker kon niet worden aangemaakt!</p>
            </section>
            <section class="col-12">
                <section class="d-grid mb-3">
                    <button class="btn btn-success btn-lg" type="submit" :disabled="!validInput">Aanmelden</button>
                </section>
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
            <button class="btn btn-primary btn-lg" type="button" @click="loginUser">Inloggen</button>
        </section>
    </section>
</template>

<style scoped>
</style>