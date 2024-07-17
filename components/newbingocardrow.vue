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
            dateTime: new Date(),
            //thisDateTime: date("Y-m-d H:i:s"),
        }
    },
    created() {
        //this.dateTime = Date.toLocaleString();; //.toLocaleString();
        //this.thisDateTime.toLocaleString();
        //this.dateTime = new Date();
    },
    methods: {
        createBingocard() {
            this.bingocard = { userId: this.userId, size: this.size }
            this.$emit('addNewBingocard', this.bingocard);

            this.size = 9;
            //this.dateTime = date("Y-m-d H:i:s");
            //this.dateTime = Date.toISOString();
            //this.dateTime = Date.toLocaleString();
            this.dateTime = new Date();
        }
    },
    emits: ['addNewBingocard'],
});
</script>

<template>
    <tr class="bingocard-table-bottom-row">
	    <td>
            <h6 class="bingo-nieuw-header-text"><b>Nieuwe bingokaart:</b></h6>
        </td>
        <td>
            <textarea class="bingo-table-columns new-bingocard-user-id" name="new-bingocard-userId" v-model="userId">{{ userId }}</textarea>
        </td>
	   	<td>
	   		<h6 class="bingo-nieuw-header-text">0</h6>
	   	</td>
	   	<td>
	   	    <select name="new-bingocard-sizes" v-model="size">
	   		    <!--<option name="drie_bij_drie" value="9" selected>9</option>-->
                <option name="drie_bij_drie" value="9">3x3</option>
	   			<option name="vier_bij_vier" value="16">4x4</option>
	   			<option name="vijf_bij_vijf" value="25">5x5</option>
	   		</select>
	   	</td>
	   	<td>
	   		<h6 class="bingo-nieuw-header-text bingo-datetime-column">{{ dateTime.toLocaleString('en-GB', { timeZone: 'Europe/Amsterdam' }) }}</h6>
	   	</td>
	   	<td>
	   		<h6 class="bingo-nieuw-header-text bingo-datetime-column">{{ dateTime.toLocaleString('en-GB', { timeZone: 'Europe/Amsterdam' }) }}</h6>
	   	</td>
	   	<td>
	   		<h6 class="bingo-nieuw-header-text">0</h6>
	   	</td>
	   	<td>
	   		<button type="button" class="btn btn-success bingo-table-add-button" id="new-bingocard-button" @click="createBingocard">Voeg toe</button>
	    </td>
    </tr>
</template>

<style scoped>
.bingo-datetime-column {
    max-width: 10em !important;
    text-wrap: wrap !important;
}

#new-bingocard-button {
    min-width: 100% !important;
}
</style>