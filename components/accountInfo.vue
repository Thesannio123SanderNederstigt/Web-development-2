<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { type User } from "@/src/User";

export default defineComponent({
    props: {
        gebruiker: {
            type: Object as PropType<User>,
            required: true,
        },
    },
    data() {
        return {
            id: this.gebruiker.id,
            username: this.gebruiker.username,
            password: "",
            email: this.gebruiker.email,
            isAdmin: this.$store.$state.stateUser.isAdmin,
            isPremium: this.$store.$state.stateUser.isPremium,
            cardsAmount: this.$store.$state.stateUser.bingocards.length,
            sharedCardsAmount: this.gebruiker.sharedCardsAmount,
            bingocards: this.gebruiker.bingocards,
            sportsclubs: this.gebruiker.sportsclubs,
            user: this.gebruiker,
            emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
            alphaNumRegex: /^[a-zA-Z0-9]+$/,
            validInput: false,
        }
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
            <input type="text" class="form-control" name="account-username" id="account-username" 
                v-model="username" @input="validate" />
        </section>
        <section class="col-12">
            <h2 class="mb-3 mt-4 table-title-text account-title-text">Email adres </h2>
            <input type="email" class="form-control" id="account-email" placeholder="E-mailadres"
                v-model="email" @input="validate" />
        </section>

        <section class="col-12 mt-3">
            <h2 class="mb-2 mt-4 table-title-text account-title-text">Wachtwoord wijzigen </h2>
            <input type="password" class="form-control" name="account-password" placeholder="Nieuw Wachtwoord" id="account-password"
                 v-model="password" @input="validate" />
        </section>

        <section class="col-12">
            <h2 class="mt-4 table-title-text account-title-text">Beheerder? </h2>
            <h3 class="mb-3 table-title-text">{{ displayBool(isAdmin) }}</h3>
        </section>
        <section class="col-12">
            <h2 class="mt-4 table-title-text account-title-text">Premium? </h2>
            <h3 class="mb-3 table-title-text">{{ displayBool($store.$state.stateUser.isPremium) }}</h3>
        </section>

        <section class="col-12">
            <h2 class="mt-4 table-title-text account-title-text">Aantal bingokaarten </h2>
            <h3 class="mb-3 table-title-text">{{ cardsAmount }}</h3>
        </section>
        <section class="col-12">
            <h2 class="mt-4 table-title-text account-title-text">Aantal gedeelde bingokaarten </h2>
            <h3 class="mb-3 table-title-text">{{ sharedCardsAmount }}</h3>
        </section>

        <section class="col-12 mb-3">
            <button type="button" class="btn btn-warning btn-lg account-edit-btn" :disabled="!validInput" @click="updateUser">Wijzigen</button>
        </section>

        <section class="col-12">
            <button type="button" class="btn btn-danger bingo-danger-btn btn-lg" @click="removeUser">Account Verwijderen</button>
        </section>

    </section>

</template>

<style scoped>
.account-info {
    max-width: 30rem !important;
}

.account-title-text {
    color: #2a1483 !important;
    font-family: 'Berlin Sans FB' !important;
}
</style>