<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { type Bingocard } from "@/src/Bingocard";

export default defineComponent({
    props: {
        bingokaart: {
            type: Object as PropType<Bingocard>,
            required: false,
        },
    },
    data() {
        return {
            userId: this.$store.$state.stateUser.id,
            size: 9,
            bingocard: this.bingokaart,
        }
    },
    methods: {
        generateBingocard() {
            this.bingocard = { userId: this.userId, size: this.size }
            this.$emit('generateFullBingocard', this.bingocard);

            this.size = 9;
        }
    },
    emits: ['generateFullBingocard'],
});
</script>

<template>
    <section class="container" id="generate-container">
        <section class="row justify-content-md-center mt-5 mb-5 bingo-subtable-text">
            <h2 class="mt-4 mb-3 website-logo-text table-title-text" id="bingocards-generate-title-text">Volledige bingokaart genereren</h2>
            <h2 class="mb-4 website-logo-text table-title-text" id="bingocards-generate-format-title-text">Selecteer formaat:</h2>
            <select name="new-bingocard-sizes" v-model="size">
    	        <!--<option name="drie_bij_drie" value="9" selected>3x3</option>-->
                <option name="drie_bij_drie" value="9">3x3</option>
    		    <option name="vier_bij_vier" value="16">4x4</option>
    		    <option name="vijf_bij_vijf" value="25">5x5</option>
    	    </select>
            <button type="button" class="btn btn-success bingo-table-add-button" @click="generateBingocard">Genereer bingokaart</button>
        </section>
    </section>
</template>

<style scoped>
#generate-container {
    max-width: 35rem !important;
}

#bingocards-generate-title-text {
    color: #0070c0 !important; 
    padding: 0 !important;
}

#bingocards-generate-format-title-text {
    color: #1f0c6a !important; 
    padding: 0 !important;
}

</style>