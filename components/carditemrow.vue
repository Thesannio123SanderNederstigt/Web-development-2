<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { type cardItem } from "@/src/cardItem";

export default defineComponent({
    props: {
        kaartItem: {
            type: Object as PropType<cardItem>,
            required: true,
        },
        buttonType: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            id: this.kaartItem.id,
            content: this.kaartItem.content,
            category: this.kaartItem.category,
            points: this.kaartItem.points,
            isPremiumItem: this.kaartItem.isPremiumItem,
            button: this.buttonType,
        }
    },
    methods: {
        displayCategory(categorie: any)
        {
            let categoryText = "";
            switch(categorie)
            {
                case(0):
                    categoryText = "standaard tekst";
                    break;

                case(1):
                    categoryText = "speciaal font of effect";
                    break;

                case(2):
                    categoryText = "afbeelding";
                    break;

                case(3):
                    categoryText = "geluidseffect";
                    break;

                case(4):
                    categoryText = "video";
                    break;

                case(5):
                    categoryText= "animatie";
                    break;
            }
            return categoryText;
        },
        displayPremium(isPremiumItem: any)
        {
            let isPremiumText = "";
            switch(isPremiumItem)
            {
                case(true):
                    isPremiumText = "Ja";
                    break;
                case(false):
                    isPremiumText = "Nee";
                    break;
            }
            return isPremiumText;
        },
        removeBingocardItem() 
        {
            if(confirm(`Weet u zeker dat u bingokaart-item ${this.id} van deze bingokaart wilt verwijderen?`)) {
                this.$emit('removeBingocardItem', this.id);
            }
        }
    },
    emits: ['addBingocardItem', 'removeBingocardItem'],
});
</script>

<template>
    <tr class="bingocard-item-subtable-rows">
        <td>
    	    <section class="align-items-center">
    	        <textarea class="bingo-table-columns bingo-id-column table-bingocard-item-id">{{ id }}</textarea>
    	    </section>
    	</td>
    	<td>
    	    <textarea class="bingo-table-columns bingo-content-column table-bingocard-item-content">{{ content }}</textarea>
    	</td>
    	<td>
    		<textarea class="bingo-table-columns table-bingocard-item-category">{{ displayCategory(category) }}</textarea>
    	</td>
    	<td>
    	  <textarea class="bingo-table-columns table-bingocard-item-points">{{ points }}</textarea>
    	</td>
    	<td>
    		<textarea class="bingo-table-columns table-bingocard-item-isPremiumItem">{{ displayPremium(isPremiumItem) }}</textarea>
    	</td>
    	<td>
    		<button v-if="button == 'delete'" type="button" class="btn btn-danger bingo-danger-btn bingo-table-buttons table-bingocard-item-remove-button" name="verwijderen" @click="removeBingocardItem">Verwijderen</button>
            <button v-if="button == 'add'" type="button" class="btn btn-success bingo-table-add-button" @click="$emit('addBingocardItem', id)">Toevoegen</button>
        </td>
    </tr>
</template>

<style scoped>

</style>