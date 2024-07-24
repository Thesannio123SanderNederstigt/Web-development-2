<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { type User } from "@/src/User";

export default defineComponent({
    props: {
        gebruiker: {
            type: Object as PropType<User>,
            required: true,
        },
        /*updateError: {
            type: Boolean,
            default: false,
        },
        updateSucces: {
            type: Boolean,
            default: false,
        },
        deleteError: {
            type: Boolean,
            default: false,
        },*/
    },
    data() {
        return {
            id: this.gebruiker.id, //this.$store.$state.stateUser.id,
            username: this.gebruiker.username,
            password: "", //this.gebruiker.password,
            email: this.gebruiker.email,
            isAdmin: this.$store.$state.stateUser.isAdmin, //this.gebruiker.isAdmin,
            isPremium: this.$store.$state.stateUser.isPremium, //this.gebruiker.isPremium,
            cardsAmount: this.$store.$state.stateUser.bingocards.length, //this.gebruiker.cardsAmount, //0
            sharedCardsAmount: this.gebruiker.sharedCardsAmount,
            bingocards: this.gebruiker.bingocards,
            sportsclubs: this.gebruiker.sportsclubs,
            user: this.gebruiker,
            /*updateFout: this.updateError,
            updateGelukt: this.updateSucces,
            deleteFout: this.deleteError,*/
            emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
            alphaNumRegex: /^[a-zA-Z0-9]+$/, // /^[a-z0-9]+$/i,
            validInput: false,
        }
    },
    created() {
        //this.user = this.$store.$state.stateUser;

        /*this.cardsAmount = this.user.bingocards.length;*/
        //this.cardsAmount = this.$store.$state.stateUser.bingocards.length;
    },
    methods: {
        displayBool(isBool: any)
        {
            let isBoolText = "";
            switch(isBool)
            {
                case(true):
                    isBoolText = "Ja";
                    break;
                case(false):
                    isBoolText = "Nee";
                    break;
            }
            return isBoolText;
        },
        updateUser()
        {
            this.user = { id: this.id, username: this.username, password: this.password, email: this.email, isAdmin: this.isAdmin, isPremium: this.isPremium, cardsAmount: this.cardsAmount, sharedCardsAmount: this.sharedCardsAmount, bingocards: this.bingocards, sportsclubs: this.sportsclubs }
            this.$emit('updateUser', this.user);
        },
        removeUser() 
        {
            if(confirm(`Weet u zeker dat u uw account voor Schaatsbingo.nl wilt verwijderen?`)) { //gebruikersaccount
                this.$emit('removeUser', this.id);
            }
        },
        validate()
        {
            this.validInput = this.checkEmail() && this.username != "" && this.checkPassword();
        },
        checkPassword()
        {
            //note: eigenlijk wil je hier nog meer checken voor een ww ipv alleen of dit niet een leeg veld is en minstens 7 tekens bevat (want voor bepaalde speciale chars zoals # of $ werkt de wachtwoord verificatie in de API PHP app niet meer goed vgm...)
            //return !!((this.password === "") ? "" : !!(this.password.length > 7) ? false : !!(this.alphaNumRegex.test(this.assword)));
            return  !!((this.password === "") ? "" : !!(this.password.length > 7 && this.alphaNumRegex.test(this.password)));
        },
        checkEmail()
        {
            //Dit geeft true als de email-invoer niet leeg is en matched aan de regular expression van een valide emailadres, anders geeft dit false terug
            return !!((this.email === "") ? "" : !!(this.emailRegex.test(this.email)));
        }
    },
    emits: ['updateUser', 'removeUser'],
});
</script>

<template>

    <section class="row gy-2 overflow-hidden account-info">

        <section class="col-12">
            <h2 class="mb-3 mt-4 table-title-text account-title-text">Gebruikersnaam </h2>
            <!--<input type="text" class="form-control" name="account-username" id="account-username" 
                v-model="username" @input="validate" :style="[updateError ? { 'border-color': '#E80F0F'} : {}]" />-->
            <input type="text" class="form-control" name="account-username" id="account-username" 
                v-model="username" @input="validate" />
        </section>
        <section class="col-12">
            <h2 class="mb-3 mt-4 table-title-text account-title-text">Email adres </h2>
            <!--<input type="email" class="form-control" id="account-email" placeholder="E-mailadres"
                v-model="email" @input="validate" :style="[updateError ? { 'border-color': '#E80F0F'} : {}]" />-->
            <input type="email" class="form-control" id="account-email" placeholder="E-mailadres"
                v-model="email" @input="validate" />
        </section>

        <section class="col-12 mt-3">
            <h2 class="mb-2 mt-4 table-title-text account-title-text">Wachtwoord wijzigen </h2>
            <!--<input type="password" class="form-control" name="account-password" placeholder="Nieuw Wachtwoord" id="account-password"
                    v-model="password" @input="validate" :style="[updateError ? { 'border-color': '#E80F0F'} : {}]" />-->
            <input type="password" class="form-control" name="account-password" placeholder="Nieuw Wachtwoord" id="account-password"
                 v-model="password" @input="validate" />
        </section>

        <section class="col-12">
            <h2 class="mt-4 table-title-text account-title-text">Beheerder? </h2>
            <h3 class="mb-3 table-title-text">{{ displayBool(isAdmin) }}</h3>
        </section>
        <section class="col-12">
            <h2 class="mt-4 table-title-text account-title-text">Premium? </h2>
            <h3 class="mb-3 table-title-text">{{ displayBool(isPremium) }}</h3>
        </section>

        <section class="col-12">
            <h2 class="mt-4 table-title-text account-title-text">Aantal bingokaarten </h2>
            <h3 class="mb-3 table-title-text">{{ cardsAmount }}</h3>
        </section>
        <section class="col-12">
            <h2 class="mt-4 table-title-text account-title-text">Aantal gedeelde bingokaarten </h2>
            <h3 class="mb-3 table-title-text">{{ sharedCardsAmount }}</h3>
        </section>


        <!--
        <section class="col-12">
            <p class="m-0 text-secondary text-start warningtext" v-show="updateError">Uw account kon niet worden bijgwerkt!</p>
            <p class="text-center text-secondary mb-4 successtext" v-show="updateSuccess">Uw account is succesvol gewijzigd!</p>
        </section>
        -->
        <section class="col-12 mb-3">
            <!--<button type="button" class="btn btn-warning btn-lg account-edit-btn" :disabled="!validInput" @click="updateUser">Wijzigen/Bewerken</button>-->
            <button type="button" class="btn btn-warning btn-lg account-edit-btn" :disabled="!validInput" @click="updateUser">Wijzigen</button>
        </section>
        <!--
        <section class="col-12">
            <p class="m-0 text-secondary text-start warningtext" v-show="deleteFout">Uw account kon niet succesvol worden verwijderd!</p>
        </section>
        -->
        <section class="col-12">
            <button type="button" class="btn btn-danger bingo-danger-btn btn-lg" @click="removeUser">Account Verwijderen</button>
        </section>

    </section>

    <!--
    <section class="col-12">
        <section class="d-grid my-3">
            <h1 class="website-logo-text">--- OF ---</h1>
        </section>
    </section>
    




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
            <button type="button" class="btn btn-warning btn-lg" :disabled="!validInput" @click="updateUser">Wijzigen/Bewerken</button>
        </section>
        <section class="col-12">
            <button type="button" class="btn btn-danger bingo-danger-btn btn-lg" @click="deleteUser">Account Verwijderen</button>
        </section>
    </section>

    -->

</template>

<style scoped>

.account-info {
    max-width: 30rem !important;
}

.account-title-text {
    color: #2a1483 !important;
    font-family: 'Berlin Sans FB' !important;
}
/*
.account-edit-btn {
    
}
*/
</style>