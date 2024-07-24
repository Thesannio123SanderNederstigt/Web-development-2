<script lang="ts">
import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import BingocardRow from "@/components/bingocardrow.vue"; //../ || @/
import BingocardLayout from "@/components/bingocardlayout.vue";

import { type Bingocard } from "@/src/Bingocard";
import { type cardItem } from "@/src/cardItem";

export default defineComponent({
    components: {
        Header,
        Footer,
        BingocardRow,
        BingocardLayout
    },
    data: () => ({
        userBingocards: [] as Bingocard[],
        selectedBingocard: {} as Bingocard,
        displayBingoLayout: false,
        displayCardSelect: false,
    }),
    beforeCreate() {
        if (this.$store.getToken === "") {
            this.$router.replace({ path: "/login"});
        } else if (this.$store.getToken != "") {
            this.$store.autoLogin();
        }
    },
    created() {
        this.$store.$state.currentPage = 'kaartInvullen';

        this.userBingocards = this.$store.$state.stateUser.bingocards;

        this.displayCardSelect = true;

        //console.log(`userBingocards: ${JSON.stringify(this.userBingocards)}`);

    },
    methods: {
        selectBingocard(id: string) {
            this.selectedBingocard = {};
            this.displayBingoLayout = false;

            let index = this.userBingocards.findIndex(b => b.id == id);
            let bingocard = this.userBingocards[index];

            if(bingocard.items != undefined) { // niet ongedefinieerd of null zijn dus

                bingocard.items.forEach((cardItem: cardItem) => {

                    //console.log(`cardItem checked off of niet: ${cardItem.checkedOff}`);

                    if(cardItem.checkedOff == undefined || cardItem.checkedOff == null) {
                        cardItem.checkedOff = false;
                    } /*else {
                        continue; //bij true = lekker laten gaan en laten staan dus
                    }*/
                    //console.log(`cardItem  nu false?: ${cardItem.checkedOff}`);

                });

                this.selectedBingocard = bingocard; //deze meegeven/sturen naar het layout component

                //userBingocards bingokaart inhoud gelijkstellen met wat hierboven is aangepast(?)
                this.userBingocards[index] = this.selectedBingocard;

                //de inhoud van de state gelijkt maken met/aan de userBingocards

                //optie 1: alleen dat item:
                /*let stateIndex = this.$store.$state.stateUser.bingocards.findIndex(b => b.id == id);
                this.$store.$state.stateUser.bingocards[stateIndex] = this.selectedBingocard;*/

                //optie 2: de gehele array bingokaarten overschrijven
                this.$store.$state.stateUser.bingocards = this.userBingocards;


                //forEach cardItem de checkedOff property van undefined naar false zetten by default 
                //(wanneer deze dit was (undefined was dus) denk ik dan? 
                //(want dit is wellicht true wanneer de kaart al gedeeltelijk in deze sessie is/zou zijn ingevuld door de gebruiker))

                this.displayBingoLayout = true;
                this.displayCardSelect = false;

                //console.log(`selected bingocard: ${JSON.stringify(this.selectedBingocard)}`);
            }
        }
    }
});
</script>

<template>
    <body>
        <Header />
            <section class="container mt-5 mb-5" id="table-container">

                <section v-if="displayBingoLayout" class="row justify-content-md-center mt-5 mb-5 bingo-subtable-text"> <!-- row gy-2 gy-xxl-2 mt-2 mb-5 flex-categories-container -->
                    <!--<h2 class="mt-4 mb-3 website-logo-text table-title-text" id="bingocards-generate-title-text">Bingokaart invullen</h2>-->
                    <h2 class="mt-4 mb-3 website-logo-text">Bingokaart invullen</h2>

                    <BingocardLayout :bingocard="selectedBingocard" /> 

                    <!--
                    dus nog twee componenten maken: deze bovenstaande en voor een enkel vakje/item op de kaart
                    binnen dit (bovenstaande) component de items van de kaart gaan sturen naar intern component van 1 vakje 
                    (styling op basis van checkedOff van het item of niet), dynamische layout 
                    (classen bepalen op basis van de kaart size dus: 
                    (col=12 of anders voor flexbox van bootstrap dus, dus alles wel achter elkaar gaan zetten, 
                    dus max 5 items per rij voor max size 5x5, min 3 voor 9 (3x3) 
                    de score update en lastAccessedOn API calls methoden implementeren, de BingoCheck methode implementeren
                    -->

                </section>

                <section v-if="displayCardSelect">

                    <section class="row justify-content-md-center">
                        <h2 class="mb-4 mt-4 website-logo-text table-title-text">Kies een bingokaart</h2> <!-- (selecteer een bingokaart om in te vullen dus) -->
                    </section>

                    <section class="table-responsive mb-5">
                        <table class="table table-borderless bsb-table-xl text-nowrap align-middle m-0">
                            <thead class="bingo-table-header-row">
				    	        <tr>
                                    <!--<th>Id</th>
                                    <th>Gebruikers Id</th>-->
				    		        <th>Score</th>
				    		        <th>Formaat</th>
				    		        <!--<th>Aanmaakdatum</th>
				    		        <th>Laatst bekeken</th>-->
				    		        <th>Kaart selecteren</th>
				    		        <th></th>
				    	        </tr>
				    	    </thead>
                            <tbody>
                                <BingocardRow v-for="bingokaart in userBingocards" :key="bingokaart.id" :bingocard="bingokaart" @selectBingocard="selectBingocard" />
                            </tbody>
                        </table>
                    </section>
                    
                </section>

            </section>
        <Footer />
    </body>
</template>

<style scoped>

</style>