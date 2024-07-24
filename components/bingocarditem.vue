<script lang="ts">
import { defineComponent, type PropType } from "vue";
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
        }
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
    methods: {
        checkItem() {
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
    <section :class="[formaat == 9 ? 'col-12 col-md-4 col-lg-4 col-xxl-4' : '', formaat == 16 ? 'col-6 col-md-3 col-lg-3 col-xxl-3' : '', formaat == 25 ? 'col-12 col-md-3 col-5-by-5-card' : '']" id="bingocard-item-section"> 
        <a class="anchor-tag" @click="checkItem">
            <section class="card text-center border-dark overflow-hidden card-item-inner-section">
                <section :class="[checkedOff ? 'card-body card-content-checked' : 'card-body card-content-unchecked']">
                    <h6 :class="[formaat == 9 ? 'small-card-content-line' : '', formaat == 16 ? 'medium-card-content-line' : '', formaat == 25 ? 'large-card-content-line' : '']" id="card-content-line">{{ content }}</h6>
                </section>
            </section>
        </a>
    </section>
</template>

<style scoped>
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
    min-height: 15em !important;
    max-height: 20em !important;
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
}
</style>