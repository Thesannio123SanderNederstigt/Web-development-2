<script lang="ts">
import { defineComponent, type PropType } from "vue";

import BingocardItem from "@/components/bingocarditem.vue";

import { put } from '@/src/requests';

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
    created() {
        try {
            //vullen van de bingocardItems array
            if(this.bingokaart.items != undefined) {
                this.bingokaart.items.forEach((cardItem: cardItem) => {
                    this.bingocardItems.push(cardItem);
                });
            }
            this.updateLastAccessed();
            this.bingoCheck();

        } catch (e) {
            console.error(e);
            return false;
        }
    },
    methods: {
        async updateLastAccessed() {
            try {

                let result = await put(`/bingocard/updateLastAccessedOn/${this.id}/`, {}).then( (res) => { return JSON.parse(res.data)});

                if(result.errorMessage) {
                    return false;
                }

                if(result == true) {
                    return true;
                } else {
                    return false;
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

                if(this.$store.$state.stateUser.bingocards[stateIndex].score != undefined && this.bingocardItems[index].points != undefined) {
                    if(this.bingocardItems[index].checkedOff) {
                        this.bingocardItems[index].checkedOff = false;
                        
                        if(!(this.$store.$state.stateUser.bingocards[stateIndex].score <= 0)) {
                            this.$store.$state.stateUser.bingocards[stateIndex].score -= this.bingocardItems[index].points;
                        }

                    } else {
                        this.bingocardItems[index].checkedOff = true;
                        this.$store.$state.stateUser.bingocards[stateIndex].score += this.bingocardItems[index].points;
                    }

                    //update bingocard API call methode uitwerking
                    let res = await put(`/bingocard/update/${this.id}`, {
                            userId: this.gebruikersId,
                            score: this.$store.$state.stateUser.bingocards[stateIndex].score,
                        }).then((res) => { return JSON.parse(res.data)});

                    if(res.errorMessage) {
                        return false;
                    }

                    if(res.id != '') {
                        this.$store.$state.stateUser.bingocards[stateIndex].items = this.bingocardItems;

                        this.bingoCheck();

                        return true;
                    }
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

                indexNumbers.forEach((item: any) => {

                    this.vinkCheck = true;

                    for(var i = 0; i < item.length; i++) {

                        if(bingocardItems[item[i]] != undefined) {

                            if(bingocardItems[item[i]].checkedOff != undefined && bingocardItems[item[i]].checkedOff == false) {
                                this.vinkCheck = false;
                            }

                        } else {
                            this.vinkCheck = false;
                        }
                    }

                    if(this.vinkCheck == true) {
                        this.numberOfBingos++;
                    }
                });
            }

        }
    }
});
</script>

<template>
    <section v-if="numberOfBingos > 0">
        <h1 class="mt-4 mb-3 website-logo-text bingo-text">Goed gedaan! Je hebt {{ numberOfBingos }} keer bingo op deze kaart!</h1> <!--Bingo!-->
    </section>

    <section class="row gy-2 gy-xxl-2 mt-2 mb-5 bingocard-container">
        <BingocardItem v-for="kaartItem in bingocardItems" :cardItem="kaartItem" :size="formaat" @updateCardScore="updateCardScore" />
    </section>
</template>

<style scoped>
.bingocard-container {
    max-width: 1100px !important;
}

.bingo-text {
    color: #afa20d !important;
    font-size: xx-large !important;
}
</style>