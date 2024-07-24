<script lang="ts">
import { defineComponent, type PropType } from "vue";

import BingocardItem from "@/components/bingocarditem.vue";

import { get, post, put, del } from '@/src/requests';
import { type Bingocard } from "@/src/Bingocard";
import { type cardItem } from "@/src/cardItem";

export default defineComponent({
    components: {
        BingocardItem
    },
    props: {
        bingocard: {
            type: Object as PropType<Bingocard>,
            required: true,
        },
    },
    data() {
        return {
            id: this.bingocard.id,
            gebruikersId: this.bingocard.userId,
            score: this.bingocard.score,
            formaat: this.bingocard.size,
            aanmaakDatum: this.bingocard.creationDate,
            laatstBekeken: this.bingocard.lastAccessedOn,
            bingokaart: this.bingocard,
            bingocardItems: [] as cardItem[],
            numberOfBingos: 0,
            vinkCheck: true,
        }
    },
    /*beforeCreate() {
        //vullen van de bingocardItems array
        if(this.bingokaart.items != undefined) {
            this.bingokaart.items.forEach((cardItem: cardItem) => {
                this.bingocardItems.push(cardItem);
            });
        }
    },*/
    created() {
        try {
            //vullen van de bingocardItems array
            if(this.bingokaart.items != undefined) {
                this.bingokaart.items.forEach((cardItem: cardItem) => {
                    this.bingocardItems.push(cardItem);
                });
            }

            /*console.log(`bingocard Items gevuld: ${JSON.stringify(this.bingocardItems)}`);
            console.log(`bingocard size: ${this.formaat}`);*/
            //this.createBingocardItems();
            this.updateLastAccessed();
            this.bingoCheck();

        } catch (e) {
            console.error(e);
            return false;
        }
    },
    /*beforeUpdate() {
        this.createBingocardItems();
    },*/
    methods: {
        async updateLastAccessed() {
            try {

                let result = await put(`/bingocard/updateLastAccessedOn/${this.id}/`, {}).then( (res) => { return JSON.parse(res.data)});

                if(result.errorMessage) {
                    return false;
                }

                if(result == true) {
                    return true;
                    //console.log('last accessed/laatst bekeken info van de kaart met succes bijgewerkt!');
                } else {
                    return false;
                    //console.log('er is een fout opgetreden in het bijwerken van de laatst bekeken informatie van deze bingokaart!');
                }

            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async updateCardScore(id: string) {

            try {

                let stateIndex = this.$store.$state.stateUser.bingocards.findIndex(b => b.id == this.id);

                let index = this.bingocardItems.findIndex(c => c.id == id);
                //let cardItem = this.bingocardItems[index];

                if(this.$store.$state.stateUser.bingocards[stateIndex].score != undefined && this.bingocardItems[index].points != undefined) {
                    if(this.bingocardItems[index].checkedOff) {
                        this.bingocardItems[index].checkedOff = false;
                        
                        if(!(this.$store.$state.stateUser.bingocards[stateIndex].score <= 0)) {
                            this.$store.$state.stateUser.bingocards[stateIndex].score -= this.bingocardItems[index].points; //cardItem.points;
                        }

                    } else {
                        //cardItem.checkedOff = true;
                        this.bingocardItems[index].checkedOff = true; //if eerder false, dan nu true, al true, dan weer op false zetten (toch? als je iets wilt unchecken dus)
                        this.$store.$state.stateUser.bingocards[stateIndex].score += this.bingocardItems[index].points; //cardItem.points;
                    }

                    //bingokaart score update API call

                    let res = await put(`/bingocard/update/${this.id}`, {   //this.$store.$state.stateUser.id
                            userId: this.gebruikersId,
                            score: this.$store.$state.stateUser.bingocards[stateIndex].score,
                        }).then((res) => { return JSON.parse(res.data)});

                    if(res.errorMessage) {
                        return false;
                    }

                    if(res.id != '') {
                        //console.log(`bingokaart update response: ${JSON.stringify(res)}`);
                        this.$store.$state.stateUser.bingocards[stateIndex].items = this.bingocardItems;

                        this.bingoCheck();

                        return true;
                    }

                    //update de bingokaart voor/van de state (aan het einde, na de score update ook denk ik/lijkt me)
                    //let stateIndex = this.$store.$state.stateUser.bingocards.findIndex(b => b.id == this.id);
                    
                    //this.$store.$state.stateUser.bingocards[stateIndex].items = this.bingocardItems;

                    //console.log(`score updaten voor kaart met item content: ${this.bingocardItems[index].content}`);
                }

            } catch (e) {
                console.error(e);
                return false;
            }
        },
        bingoCheck() {
            let indexNumbers = [] as any[];
            this.numberOfBingos = 0;

            let index = this.$store.$state.stateUser.bingocards.findIndex(b => b.id == this.id);
            let bingocardItems = this.$store.$state.stateUser.bingocards[index].items;

            if(bingocardItems != undefined) {
                switch(this.formaat)
                {
                    case(9): //3x3
                        indexNumbers = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
                        break;

                    case(16): //4x4
                        indexNumbers = [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15], [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15], [0,5,10,15], [3,6,9,12]];
                        break;

                    case(25): //5x5
                        indexNumbers = [[0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24], [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24], [0,6,12,18,24], [4,8,12,16,20]];
                        break;
                }

                /*console.log(`de indexnumbers: ${indexNumbers}`);
                console.log(`de indexnumbers (stringified): ${JSON.stringify(indexNumbers)}`);*/

                indexNumbers.forEach((item: any) => {

                    /*console.log(`het item: ${item}`);
                    console.log(`het item stringified: ${JSON.stringify(item)}`);*/

                    this.vinkCheck = true;

                    for(var i = 0; i < item.length; i++) {

                        if(bingocardItems[item[i]] != undefined) {
                            //console.log(`wat is dit getal: ${item[i]}`);
                            //console.log(`is dit item aangevinkt?: ${bingocardItems[item[i]].checkedOff}`);
                            if(bingocardItems[item[i]].checkedOff != undefined && bingocardItems[item[i]].checkedOff == false) {
                                //console.log(`niet aangevinkt: dus geen bingo toch? item: ${bingocardItems[item[i]].checkedOff}`);
                                this.vinkCheck = false;
                            }/* else vinkCheck = true */
                        } else {
                            this.vinkCheck = false;
                        }
                    }

                    //console.log(`true of false?: ${this.vinkCheck}`);
                    if(this.vinkCheck == true) {
                        this.numberOfBingos++;
                    }

                    /*item.forEach((getal: number) => {
                        if(bingocardItems[getal].checkedOff){}
                    });*/
                });
            }

        }
        /*createBingocardItems() {
            this.bingocardItems = [];

            let stateIndex = this.$store.$state.stateUser.bingocards.findIndex(b => b.id == this.id);
            this.bingokaart = this.$store.$state.stateUser.bingocards[stateIndex];

            console.log(`bingocard Items leeg: ${JSON.stringify(this.bingocardItems)}`);
            console.log(`stateg bingokaart: ${JSON.stringify(this.$store.$state.stateUser.bingocards[stateIndex])}`);
            console.log(`stateg gevulde bingokaart: ${JSON.stringify(this.bingokaart)}`);

            //vullen van de bingocardItems array
            if(this.bingokaart.items != undefined) {
                this.bingokaart.items.forEach((cardItem: cardItem) => {
                    this.bingocardItems.push(cardItem);
                });
            }
            console.log(`bingocard Items gevuld: ${JSON.stringify(this.bingocardItems)}`);
            //uitvoeren/call naar onderstaande updateAccessed() (lastAccessedOn()) methode
            console.log(`bingocard size: ${this.formaat}`);
        }*/

        //lastAccessedOn update method
        //scoreUpdate/itemCheck methode (die ook onderaan naar de bingoCheck() methode gaat/deze laat uitvoeren)
        //bingoCheck() methode (duh)
    }
});
</script>

<template>
    <section v-if="numberOfBingos > 0">
        <h1 class="mt-4 mb-3 website-logo-text bingo-text">Goed gedaan! Je hebt {{ numberOfBingos }} keer bingo op deze kaart!</h1> <!--Bingo!-->
    </section>

    <section class="row gy-2 gy-xxl-2 mt-2 mb-5 bingocard-container">
        <BingocardItem v-for="kaartItem in bingocardItems" :cardItem="kaartItem" :size="formaat" @updateCardScore="updateCardScore" />
        <!--<section class="col-12 col-md-6 col-lg-4 col-xxl-6">
            <BingocardItem v-for="kaartItem in bingocardItems" :cardItem="kaartItem" :size="formaat" />
            <BingocardItem v-for="kaartItem in bingocardItems" :cardItem="kaartItem" />
        </section>-->
    </section>
</template>

<style scoped>
.bingocard-container {
    /*max-width: 1200px !important;*/
    max-width: 1100px !important;
}

.bingo-text {
    color: #afa20d !important;
    font-size: xx-large !important;
}
</style>