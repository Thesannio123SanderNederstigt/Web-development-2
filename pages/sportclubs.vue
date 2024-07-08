<script lang="ts">
import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import SportclubsRow from "~/components/sportclubsrow.vue"; //@
import NewSportclubsRow from "../components/newsportclubsrow.vue"; //@
//import NewSportclubsRow from "@/components/newsportclubsrow.vue";

import { get, post, del } from '@/src/requests';
import { type Sportsclub } from "@/src/Sportsclub";

export default defineComponent({
    components: {
        Header,
        Footer,
        SportclubsRow,
        NewSportclubsRow,
    },
    data: () => ({
        userSportsclubs: [] as Sportsclub[],
        otherSportsclubs: [] as Sportsclub[], 
    }),
    beforeCreate() {
        if (this.$store.$state.authToken === "") { //this.$store.getToken
            this.$router.replace({ path: "/login"});
        } else if (this.$store.getToken != "") {
            this.$store.autoLogin();
        }
    },
    created() {
        this.$store.$state.currentPage = 'sportclubs';

        this.userSportsclubs = this.$store.$state.stateUser.sportsclubs;

        this.fetchSportsclubs();

        //TODO: methode maken die nadat deze is gevuld (in created fetch methode aanroepen),
        // de gevonden userSportsclubs uit deze lijst haalt/verwijderd! (of eigenlijk: deze hier hier niet invult)

        //roep methode aan om otherSportsclubs goed te vullen 
        //(straks results van de get call filteren met definitie let index (findIndex in de userSportsclubs) en if index != -1 dan niet invullen voor de otherSportsclubs)
    },
    methods: {
        async fetchSportsclubs() {
            //console.log(`token: ${this.$store.$state.authToken}`);
            /*
            console.log(`stateuser clubs: ${JSON.stringify(this.$store.$state.stateUser.sportsclubs)}`);
            console.log(`userSportsclubs: ${JSON.stringify(this.userSportsclubs)}`);
            console.log(`otherSportsclubs: ${JSON.stringify(this.otherSportsclubs)}`);
            */

            let result = await get('/sportsclub/getAll').then( (res) => { return JSON.parse(res.data)}); //sportclubs

            if(result.errorMessage) { //sportclubs.errorMessage
                return false;
            }

            result.forEach((sportclub: Sportsclub) => { //sportclub: any

                console.log(sportclub);

                let index = this.userSportsclubs.findIndex(s => s.id == sportclub.id); //const

                //console.log(`index: ${index}`);

                //zit een club niet in de userSportsclubs lijst, voeg deze dan toe aan de otherSportsclubs
                if(index === -1) {
                    this.otherSportsclubs.push(sportclub);
                }


                /* //note: dit werkt niet (ook zonder haken werkt dit nog niet)
                if(!(this.userSportsclubs.includes(sportclub))) {
                    console.log(`dezelfde sportclub gevonden: ${sportclub.id}`);
                    this.otherSportsclubs.push(sportclub);
                }
                */
                

                /*
                //TODO: uitzoeken waarom dit blijkbaar andersom werkt???
                if(this.userSportsclubs.findIndex(s => s.id == sportclub.id)) { //if((!this.userSportsclubs.findIndex(s => s.id == sportclub.id))) {
                    //console.log(`voeg toe aan otherSportsclubs: ${sportclub}`);
                    console.log(`andee sportclub gevonden: ${sportclub.id}`);
                    this.otherSportsclubs.push(sportclub);
                } else {

                }
                */

                /*
                //let id = sportclub.id;
                let index = this.userSportsclubs.findIndex(s => s.id == sportclub.id); //id

                if(index != -1 || index == undefined) {
                    this.otherSportsclubs.push(sportclub);
                }*/
            });
            //console.log(`otherSportsclubs: ${JSON.stringify(this.otherSportsclubs)}`);
        },
        async addUserSportsclub(id: string)
        {
            
            let result = await post(`/user/addUserSportsclub/${this.$store.$state.stateUser.id}/${id}`, {}).then( (res) => { return JSON.parse(res.data)});

            if(result.errorMessage) {
                return false;
            }

            let index = this.otherSportsclubs.findIndex(s => s.id == id);

            //deze .findIndex wellicht dus vervangen door/voor .includes()
            if(result == true && index != -1) {
            //if(result == true && this.otherSportsclubs.findIndex(s => s.id == id)) { //if(result == true) {

                /*if(this.otherSportsclubs.findIndex(s => s.id == id)) {
                    const index = this.otherSportsclubs.findIndex(s => s.id == id);
                    const sportclub = this.otherSportsclubs[index];

                    this.otherSportsclubs.splice(index, 1);

                    this.userSportsclubs.push(sportclub);

                    this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
                }*/
                
                //const index = this.otherSportsclubs.findIndex(s => s.id == id); //let of constant?
                let sportclub = this.otherSportsclubs[index]; //const

                this.otherSportsclubs.splice(index, 1);

                this.userSportsclubs.push(sportclub);

                this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
                
            }

            /*
            //doe ook maar iets hiervan nadat je een success/true response hebt denk ik? 
            //also: let of constants gebruiken? (geen idee wat hier beter is/zou zijn, maar ik denk let)

            //const userIndex = this.userSportsclubs.findIndex(s => s.id == id);


            const index = this.otherSportsclubs.findIndex(s => s.id == id);
            const sportclub = this.otherSportsclubs[index];
            this.otherSportsclubs.splice(index, 1);

            //api call naar addUserSportsclub (this.$store.$state.stateUser.id/id)

            //na succesvolle call (zonder errorMessage en if await res.json() == true ), dan:

            this.userSportsclubs.push(sportclub);



            this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
            */

        },
        async removeUserSportsclub(id: string)
        {

            let result = await del(`/user/deleteUserSportsclub/${this.$store.$state.stateUser.id}/${id}`).then( (res) => { return JSON.parse(res.data)});

            if(result.errorMessage) {
                return false;
            }

            let index = this.userSportsclubs.findIndex(s => s.id == id);
            
            if(result == true && index != -1) {
            //if(result == true && this.userSportsclubs.findIndex(s => s.id == id)) {
                let sportclub = this.userSportsclubs[index];

                this.userSportsclubs.splice(index, 1);

                this.otherSportsclubs.push(sportclub); 
                
                this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
            }

            /*
            let index = this.userSportsclubs.findIndex(s => s.id == id);
            let sportclub = this.userSportsclubs[index];
            //dit pas doen na succesvolle api call?
            this.userSportsclubs.splice(index, 1);

            //this.userSportsclubs[index];

            //api call (met this.$store.$state.stateUser.id/id) voor de gebruiker en sportclub id's hier

            //na succesvolle call, maak de stateUser sportsclubs gelijk aan de nieuwe this.userSportsclubs en voeg de club weer toe aan de overige lijst:
            this.otherSportsclubs.push(sportclub); 
            this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
            */
        },
        async addNewSportsclub(sportclub: Sportsclub) //deze methode verplaatsen naar new component! wordt ge-emit/aangeroepen door de newSportclubRow.vue component (om een geheel nieuwe sportclub te maken/toe te voegen dus)
        {
            //console.log(`attempting to add new sportsclub: ${JSON.stringify(sportclub)}`);

            let res = await post('/sportsclub/create', { 
                    clubname: sportclub.clubname, 
                    description: sportclub.description, 
                    foundedOn: sportclub.foundedOn,
                    membersAmount: sportclub.membersAmount
                }).then((res) => { return JSON.parse(res.data)});

            if(res.errorMessage) {
                   return false;
            }

            if(res.id != '') { //geen lege (of undefined?) string als id response
                //this.getNewUserSportsclub(res.id);
                //this.$emit('addUserSportsclub', res.id);

                //console.log(`new sportsclub: ${res}`); //dit geeft [object Object] terug...lol
                //console.log(`stringify of new sportsclub: ${JSON.stringify(res)}`); //dit is correct ontleed met de JSON.stringify methode hier... wederom lol

                this.addUserSportsclub(res.id);
                this.userSportsclubs.push(res as Sportsclub); //.push(res);
                this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
            }

            //eerst api call om nieuw toe te voegen, 
            //gebruik het id wat je terugkrijgt van de API van de nieuwe sportclub 
            //om een call te doen naar bovenstaande addUserSportsclub() methode om deze ook voor de gebruiker toe te voegen
            //(net als de twee stappen/calls die ook in de functions.js gelijk achter elkaar worden uitgevoerd van de development 1 app)

            //this.userSportsclubs.push(sportclub);
        }
     // eerdere TODO: code toevoegen aan bovenstaande methoden wat onder meer na het toevoegen van nieuw,  (verwijderen of toevoegen van gebruiker sportsclub (yep))
     //de teruggegeven nieuw club toevoegen aan de sportclubs data hierboven en daarna stateUser.sportclubs gelijk maken aan deze lijst:
     // zoals dit (waarschijnlijk): this.$store.$state.stateUser.sportsclubs = this.sportsclubs;

    }
});
</script>

<template>
    <body>
        <Header />
            <section class="container mt-5 mb-5" id="table-container">
                <section class="row justify-content-md-center">
                    <h2 class="mb-4 mt-4 website-logo-text table-title-text">Mijn Sportclubs</h2>
                </section>

                <section class="table-responsive mb-5">
                    <table class="table table-borderless bsb-table-xl text-nowrap align-middle m-0">
                        <thead class="bingo-table-header-row">
	    	                <tr>
	    		                <th>Id</th>
	    		                <th>Clubnaam</th>
	    		                <th>Omschrijving</th>
	    		                <th>Oprichtingsdatum</th>
	    		                <th>Aantal leden</th>
	    		                <th></th>
	    	                </tr>
	    	            </thead>
                        <tbody>
                            <SportclubsRow v-for="sportclub in userSportsclubs" :key="sportclub.id" :sportsclub="sportclub" :buttonType="'delete'" @addUserSportsclub="addUserSportsclub" @removeUserSportsclub="removeUserSportsclub" />
                            <NewSportclubsRow @addNewSportsclub="addNewSportsclub" />
                            <!--sportclubsRow.vue component hier toevoegen! deze in deze eerste tabel voeden met de userSportclubs de tweede vullen met otherSportsclubs!-->
                            <!--hier dan het component newSportsclubRow.vue voor een nieuwe toevoegen!-->
                        </tbody>
                    </table>
                </section>

                <section class="row justify-content-md-center">
                    <h2 class="mt-4 website-logo-text table-title-text">Andere Sportclubs</h2>
                </section>

                <section class="table-responsive mt-5 mb-5">
                    <table class="table table-borderless bsb-table-xl text-nowrap align-middle m-0">
                        <thead class="bingo-table-header-row">
	    	                <tr>
	    		                <th>Id</th>
	    		                <th>Clubnaam</th>
	    		                <th>Omschrijving</th>
	    		                <th>Oprichtingsdatum</th>
	    		                <th>Aantal leden</th>
	    		                <th></th>
	    	                </tr>
	    	            </thead>
                        <tbody>
                            <!--sportclubsRow.vue component hier toevoegen! deze tweede vullen met otherSportsclubs!-->
                            <SportclubsRow v-for="sportclub in otherSportsclubs" :key="sportclub.id" :sportsclub="sportclub" :buttonType="'add'" @addUserSportsclub="addUserSportsclub" @removeUserSportsclub="removeUserSportsclub" />
                        </tbody>
                    </table>
                </section>

            </section>
        <Footer />
    </body>

    <!--
    <section class="row justify-content-md-center" id="sportsclubs-table-section">	
	    <section class="container bingo-subtable-text">
	    	<h2 class="text-center mb-4 mt-4 website-logo-text table-title-text" id="sportsclubs-table-title-text">Sportclubs van gebruiker: </h2>
	    	<h2 class="text-center mb-4 mt-4 mr-4 website-logo-text table-title-text" id="sportsclubs-table-title-id-text"></h2>
	    </section>
    
	    <section class="table-responsive mb-5">
	      <table class="table table-borderless bsb-table-xl text-nowrap align-middle m-0">
	    	<thead class="bingo-table-header-row">
	    	  <tr>
	    		<th>Id</th>
	    		<th>Clubnaam</th>
	    		<th>Omschrijving</th>
	    		<th>Oprichtingsdatum</th>
	    		<th>Aantal leden</th>
	    		<th></th>
	    	  </tr>
	    	</thead>
	    	<tbody id="sportsclub-subtable-body">
	    	  <tr class="sportsclub-subtable-rows">
	    		<td>
	    		  <section class="align-items-center">
	    			<textarea class="bingo-table-columns bingo-id-column table-sportsclub-id"></textarea>
	    		  </section>
	    		</td>
	    		<td>
	    			<textarea class="bingo-table-columns bingo-clubname-column table-sportsclub-clubname"></textarea>
	    		</td>
	    		<td>
	    			<textarea class="bingo-table-columns bingo-club-description-column table-sportsclub-description"></textarea>
	    		</td>
	    		<td>
	    		  <textarea class="bingo-table-columns table-sportsclub-foundedOn"></textarea>
	    		</td>
	    		<td>
	    			<textarea class="bingo-table-columns table-sportsclub-membersAmount"></textarea>
	    		</td>
	    		<td>
	    			<button type="button" class="btn btn-warning bingo-table-buttons table-sportsclub-edit-button" name="wijzigen" onclick="editSportsclub(this.value)">Wijzigen</button>
	    			<button type="button" class="btn btn-danger bingo-danger-btn bingo-table-buttons table-sportsclub-remove-button" name="verwijderen" onclick="if (confirm(`Weet u zeker dat u de sportclub ${this.value} van deze gebruiker wilt verwijderen?`)){deleteUserSportsclub(this.value);}">Verwijderen</button>
	    		</td>
	    	  </tr>
          
	    	  <tr class="sportsclub-table-bottom-row">
	    			<td><h6 class="bingo-nieuw-header-text"><b>Nieuwe sportclub:</b></h6></td>
	    			<td>
	    				<textarea class="bingo-table-columns" placeholder="Naam van mijn sportclub" name="new-sportsclub-clubname"></textarea>
	    			</td>
	    			<td>
	    				<textarea class="bingo-table-columns" placeholder="Omschrijving van mijn eigen sportclub" name="new-sportsclub-description"></textarea>
	    			</td>
	    			<td>
	    				<input type="date" value="1970-01-01" name="new-sportsclub-foundedOn">
	    			</td>
	    			<td>
	    				<textarea class="bingo-table-columns" placeholder="1000" name="new-sportsclub-membersAmount"></textarea>
	    			</td>
	    			<td>
	    				<button type="button" class="btn btn-success bingo-table-add-button" onclick="createUserSportsclub()">Voeg toe</button>
	    			</td>
	    	  </tr>
	    	</tbody>
	      </table>
	    </section>
    
    </section>
    -->

</template>

<style scoped>

</style>