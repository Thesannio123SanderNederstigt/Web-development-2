<script lang="ts">
import { defineComponent, type PropType } from "vue";
//import { defineComponent } from "vue";
//import { post, del } from '@/src/requests';
import { type Sportsclub } from "@/src/Sportsclub";

export default defineComponent({
    props: {
        sportsclub: {
            type: Object as PropType<Sportsclub>,
            //type: Sportsclub
            required: true,
        },
        buttonType: { //'delete' voor userSportclubs, 'add' voor otherSportsclubs, dan weet je of je de toevoegen of verwijder knop moet weergeven met v-if voor een data returned gekoppeld aan deze property (nice)
            type: String,
            required: true,
        }
    },
    data() {
        return {
            id: this.sportsclub.id,
            clubnaam: this.sportsclub.clubname,
            omschrijving: this.sportsclub.description,
            oprichtingsdatum: this.sportsclub.foundedOn,
            ledenAantal: this.sportsclub.membersAmount,
            button: this.buttonType,
        }
    },
    methods: {
        removeSportsclub() 
        {
            if(confirm(`Weet u zeker dat u de sportclub ${this.clubnaam} van uw account wilt verwijderen?`)) {
                this.$emit('removeUserSportsclub', this.id);
            }
        }
    },
    emits: ['addUserSportsclub', 'removeUserSportsclub'],
});
</script>

<template>
    <tr class="sportsclub-subtable-rows">
  	    <td>
  		    <section class="align-items-center">
  		        <textarea class="bingo-table-columns bingo-id-column">{{ id }}</textarea>
  		    </section>
  		</td>
  		<td>
  			<textarea class="bingo-table-columns bingo-clubname-column">{{ clubnaam }}</textarea>
  		</td>
  		<td>
  			<textarea class="bingo-table-columns bingo-club-description-column">{{ omschrijving }}</textarea>
  		</td>
  		<td>
  		  <textarea class="bingo-table-columns">{{ oprichtingsdatum }}</textarea>
  		</td>
  		<td>
  			<textarea class="bingo-table-columns"> {{  ledenAantal }}</textarea>
  		</td>
  		<td>
  			<button v-if="button == 'delete'" type="button" class="btn btn-danger bingo-danger-btn bingo-table-buttons table-sportsclub-remove-button" name="verwijderen" @click="removeSportsclub">Verwijderen</button>
            <button v-if="button == 'add'" type="button" class="btn btn-success bingo-table-add-button" @click="$emit('addUserSportsclub', id)">Toevoegen</button>
        </td>
  	  </tr>
</template>

<style scoped>

</style>