<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { type Sportsclub } from "@/src/Sportsclub";

export default defineComponent({
    props: {
        sportclub: {
            type: Object as PropType<Sportsclub>,
            required: false,
        },
    },
    data() {
        return {
            clubname: "",
            description: "",
            foundedOn: "",
            membersAmount: 0,
            sportsclub: this.sportclub,
        }
    },
    methods: {
        createSportsclub() 
        {
            this.sportsclub = { id: '', clubname: this.clubname, description: this.description, foundedOn: this.foundedOn, membersAmount: this.membersAmount }
            this.$emit('addNewSportsclub', this.sportsclub);

            this.clubname = "";
            this.description = "";
            this.foundedOn = "1970-01-01";
            this.membersAmount = 0;
        }
    },
    emits: ['addNewSportsclub'],
});
</script>

<template>
    <tr class="sportsclub-table-bottom-row">
	    <td><h6 class="bingo-nieuw-header-text"><b>Nieuwe sportclub:</b></h6></td>
		<td>
			<textarea class="bingo-table-columns" placeholder="Naam van nieuwe sportclub" name="new-sportsclub-clubname" v-model="clubname"></textarea>
		</td>
		<td>
			<textarea class="bingo-table-columns" placeholder="Omschrijving van nieuwe sportclub" name="new-sportsclub-description" v-model="description"></textarea>
		</td>
		<td>
			<input type="date" value="1970-01-01" name="new-sportsclub-foundedOn" v-model="foundedOn">
		</td>
		<td>
			<textarea class="bingo-table-columns" placeholder="1000" name="new-sportsclub-membersAmount" v-model="membersAmount"></textarea>
		</td>
		<td>
			<button type="button" class="btn btn-success bingo-table-add-button" @click="createSportsclub">Voeg toe</button>
		</td>
	</tr>
</template>

<style scoped>

</style>