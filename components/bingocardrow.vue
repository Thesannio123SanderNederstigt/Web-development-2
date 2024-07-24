<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { type Bingocard } from "@/src/Bingocard";

export default defineComponent({
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
            page: this.$store.$state.currentPage,
        }
    },
    methods: {
        displaySize(formaat: any)
        {
            let sizeText = "";
            switch(formaat)
            {
                case(9):
                    sizeText = "3x3";
                    break;

                case(16):
                    sizeText = "4x4";
                    break;

                case(25):
                    sizeText = "5x5";
                    break;
            }
            return sizeText;
        },
        removeBingocard() 
        {
            if(confirm(`Weet u zeker dat u bingokaart ${this.id} van uw account wilt verwijderen?`)) {
                this.$emit('removeBingocard', this.id);
            }
        }
    },
    emits: ['selectBingocard', 'showBingocardItems', 'removeBingocard'],
});
</script>

<template>
    <tr class="bingocard-subtable-rows">
    	<td v-if="page == 'bingokaarten'">
    	  <section class="align-items-center">
    		<textarea class="bingo-table-columns bingo-id-column">{{ id }}</textarea>
    	  </section>
    	</td>
    	<td v-if="page == 'bingokaarten'">
            <section class="align-items-center">
                <textarea class="bingo-table-columns bingo-id-column">{{ gebruikersId }}</textarea>
            </section>
        </td>
    	<td>
    		<textarea class="bingo-table-columns">{{ score }}</textarea>
    	</td>
    	<td>
    		<textarea class="bingo-table-columns">{{ displaySize(formaat) }}</textarea>
    	</td>
    	<td v-if="page == 'bingokaarten'">
    	  <textarea class="bingo-table-columns">{{ aanmaakDatum }}</textarea>
    	</td>
    	<td v-if="page == 'bingokaarten'">
    		<textarea class="bingo-table-columns">{{ laatstBekeken }}</textarea>
    	</td>
        <td v-if="page == 'kaartInvullen'">
            <button type="button" class="btn btn-primary bingo-table-buttons" @click="$emit('selectBingocard', id)">Kaart invullen</button>
        </td>
    	<td v-if="page == 'bingokaarten'">
    		<button type="button" class="btn btn-primary bingo-table-buttons" @click="$emit('showBingocardItems', id)">Toon bingokaart-items</button>
    	</td>
    	<td v-if="page == 'bingokaarten'">
    	    <button type="button" class="btn btn-danger bingo-danger-btn bingo-table-buttons" @click="removeBingocard">Verwijderen</button>
    	</td>
    </tr>
</template>

<style scoped>

</style>