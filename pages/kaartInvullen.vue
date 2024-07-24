<script lang="ts">
import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import BingocardRow from "@/components/bingocardrow.vue";
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
    },
    methods: {
        selectBingocard(id: string) {
            this.selectedBingocard = {};
            this.displayBingoLayout = false;

            let index = this.userBingocards.findIndex(b => b.id == id);
            let bingocard = this.userBingocards[index];

            if(bingocard.items != undefined) { //zorgen dat de items niet ongedefinieerd of null zijn hier 

                bingocard.items.forEach((cardItem: cardItem) => {

                    if(cardItem.checkedOff == undefined || cardItem.checkedOff == null) {
                        cardItem.checkedOff = false;
                    }
                });

                this.selectedBingocard = bingocard;

                //userBingocards bingokaart inhoud gelijkstellen met wat hierboven is aangepast
                this.userBingocards[index] = this.selectedBingocard;

                //de inhoud van de state gelijkt maken aan de userBingocards
                this.$store.$state.stateUser.bingocards = this.userBingocards;

                this.displayBingoLayout = true;
                this.displayCardSelect = false;
            }
        }
    }
});
</script>

<template>
    <body>
        <Header />
            <section class="container mt-5 mb-5" id="table-container">

                <section v-if="displayBingoLayout" class="row justify-content-md-center mt-5 mb-5 bingo-subtable-text">
                    <h2 class="mt-4 mb-3 website-logo-text">Bingokaart invullen</h2>

                    <BingocardLayout :bingocard="selectedBingocard" /> 

                </section>

                <section v-if="displayCardSelect">

                    <section class="row justify-content-md-center">
                        <h2 class="mb-4 mt-4 website-logo-text table-title-text">Kies een bingokaart</h2>
                    </section>

                    <section class="table-responsive mb-5">
                        <table class="table table-borderless bsb-table-xl text-nowrap align-middle m-0">
                            <thead class="bingo-table-header-row">
				    	        <tr>
				    		        <th>Score</th>
				    		        <th>Formaat</th>
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