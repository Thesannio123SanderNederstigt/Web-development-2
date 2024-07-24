<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { get, post, put, del } from '@/src/requests';
import { type cardItem } from "@/src/cardItem";

export default defineComponent({
    props: {
        cardItem: {
            type: Object as PropType<cardItem>,
            required: true,
        },
        size: {
            type: Number,
            required: false,
        }/*,
        checkedOff: {
            type: Boolean,
            required: true,
        }*/
    },
    data() {
        return {
            id: this.cardItem.id,
            content: this.cardItem.content,
            category: this.cardItem.category,
            points: this.cardItem.points,
            isPremiumItem: this.cardItem.isPremiumItem,
            kaartItem: this.cardItem,
            formaat: this.size,
            checkedOff: this.cardItem.checkedOff,
        }
    },
    /*beforeCreate() {

    },
    created() {
        //console.log(`bingokaart formaat: ${this.formaat}`);
    },*/
    methods: {
        checkItem() {
            /*console.log('test, komen we hier?');
            console.log(`checked of item of niet: ${this.checkedOff}`);*/
            if(this.checkedOff) {
                this.checkedOff = false;
            } else {
                this.checkedOff = true;
            }

            this.$emit('updateCardScore', this.id);
        }
    },
    emits: ['updateCardScore'],
});
</script>

<template>
    <!--<section class="col-12 col-md-6 col-lg-4 col-xxl-4" id="bingocard-item-section"> --> <!-- DIT MOET STRAKS DYNAMISCH ZIJN OP BASIS VAN DE SIZE!! col-12 col-md-6 col-lg-4 col-xxl-6 mb-3-->
    <!--<section :class="[formaat == 9 ? 'col-12 col-md-4 col-lg-4 col-xxl-4' : 'col-12 col-md-6 col-lg-4 col-xxl-4', formaat == 16 ? 'col-6 col-md-3 col-lg-3 col-xxl-3' : 'col-12 col-md-6 col-lg-4 col-xxl-4', formaat == 25 ? 'col-12 col-md-3 col-lg-2 col-5-by-5-card' : 'col-12 col-md-6 col-lg-4 col-xxl-4']" id="bingocard-item-section"> --> 
    <section :class="[formaat == 9 ? 'col-12 col-md-4 col-lg-4 col-xxl-4' : '', formaat == 16 ? 'col-6 col-md-3 col-lg-3 col-xxl-3' : '', formaat == 25 ? 'col-12 col-md-3 col-5-by-5-card' : '']" id="bingocard-item-section"> 
    
    <!--<section v-if="formaat == 9" class="col-12 col-md-4 col-lg-4 col-xxl-4" id="bingocard-item-section">-->
        <a class="anchor-tag" @click="checkItem">
            <section class="card text-center border-dark overflow-hidden card-item-inner-section">
                <section :class="[checkedOff ? 'card-body card-content-checked' : 'card-body card-content-unchecked']"> <!-- position relative-->
                <!--<section class="card-body position-relative card-content-unchecked"> -->
                    <!--<h6 class="card-content-line">{{ content }}</h6>--> <!--p-3-->
                    <h6 :class="[formaat == 9 ? 'small-card-content-line' : '', formaat == 16 ? 'medium-card-content-line' : '', formaat == 25 ? 'large-card-content-line' : '']" id="card-content-line">{{ content }}</h6>
                </section>
            </section>
        </a>
    </section>
</template>

<style scoped>

/*VOOR EEN 5x5 kaart: voor de grootste size (pagina op 100%) om 5x5 weer te geven*/
/*VOOR EEN VIER BIJ VIER: col-xxl-3 gebruiken als class!*/
@media (min-width: 1400px) {
    .col-5-by-5-card {
        flex: 0 0 auto;
        width: 20%;
    }
}

#bingocard-item-section {
    margin: 0 !important;
    padding: 0.3em !important;
}

.card-item-inner-section {
    min-height: 15em !important; /*8em of 10em*/
    max-height: 20em !important; /*8em*/
    /*max-width: 20em !important;*/
    /*border-radius: 0 !important;*/ 
    border: 0.2em solid #1f0c6a !important;
}

.card-content-unchecked {
    background-color: #4472c4 !important; 
    color: #ffffff !important;
}

.card-content-unchecked:hover {
    background-color: #008000 !important;
}

.card-content-checked {
    background-color: #008000 !important;
    color: #ffffff !important;
}

.card-content-checked:hover {
    background-color: #4472c4 !important; 
}

.small-card-content-line {
    padding-top: 4rem !important;
}

.medium-card-content-line {
    padding-top: 1.75rem !important;
}

.large-card-content-line {
    padding-top: 1.5rem !important;
}

#card-content-line {
    margin: 0 !important;
    /*padding-top: 4rem !important;*/ /*5x5: 1.5rem 1important; 4x4:2rem 3x3: 4rem*/
    /*padding: 2rem !important;*/
    /*padding: 2rem 1rem !important;*/
    /*padding: 3rem !important;*/
}
</style>