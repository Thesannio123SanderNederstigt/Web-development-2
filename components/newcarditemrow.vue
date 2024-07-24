<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { type cardItem } from "@/src/cardItem";

export default defineComponent({
    props: {
        kaartItem: {
            type: Object as PropType<cardItem>,
            required: false,
        },
    },
    data() {
        return {
            userIsPremium: false,
            content: "",
            category: 0,
            points: 0,
            isPremiumItem: 0,
            cardItem: this.kaartItem,
        }
    },
    created() {
        this.userIsPremium = this.$store.$state.stateUser.isPremium;
    },
    methods: {
        createCardItem()
        {
            this.cardItem = { id: '', content: this.content, category: this.category, points: this.points, isPremiumItem: this.isPremiumItem }
            this.$emit('addNewBingocardItem', this.cardItem);

            this.content = "",
            this.category = 0;
            this.points = 0;
            this.isPremiumItem = 0;
        }
    },
    emits:['addNewBingocardItem'],
});
</script>

<template>
    <tr class="bingocard-item-table-bottom-row">
        <td>
            <h6 class="bingo-nieuw-header-text"><b>Nieuw bingokaart-item:</b></h6>
        </td>
    	<td>
    		<textarea class="bingo-table-columns" placeholder="Iets leuks, grappigs of opmerkelijks gerelateerd aan sport wat op een bingokaart kan worden gezet" name="new-bingocard-item-content" v-model="content"></textarea>
    	</td>
    	<td>
    		<select name="new-bingocard-item-content-categories" v-model="category">
    			<option name="category_0" value="0" selected>standaard tekst</option>
    			<option name="category_1" value="1">speciaal font of effect</option>
    			<option name="category_2" value="2">afbeelding</option>
    			<option name="category_3" value="3">geluidseffect</option>
    			<option name="category_4" value="4">video</option>
    			<option name="category_5" value="5">animatie</option>
    		</select>
    	</td>
    	<td>
    		<textarea class="bingo-table-columns" placeholder="10" name="new-bingocard-item-points" v-model="points"></textarea>
    	</td>
    	<td>
    		<select v-if="userIsPremium" name="new-premium-bingocard-items" v-model="isPremiumItem">
                <option name="false" value="0" selected>Nee</option>
    			<option name="true" value="1">Ja</option>
    		</select>
            <section v-else>
                <h6 class="bingo-nieuw-header-text">Nee</h6>
            </section>
    	</td>
    	<td>
    		<button type="button" class="btn btn-success bingo-table-add-button" id="new-carditem-button" @click="createCardItem">Voeg toe</button>
    	</td>
    </tr>
</template>

<style scoped>
#new-carditem-button {
    min-width: 100% !important;
}
</style>