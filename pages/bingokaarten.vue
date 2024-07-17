<script lang="ts">
import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

import BingocardRow from "@/components/bingocardrow.vue"; //../ || @/
import NewBingocardRow from "@/components/newbingocardrow.vue"; //../ || @/
import GenerateBingocard from "../components/generatebingocard.vue"; //@
import CardItemRow from "@/components/carditemrow.vue";
import NewCardItemRow from "@/components/newcarditemrow.vue";

/*
import GenerateBingocard from "../components/generatebingocard.vue" //@
import CardItemRow from "../components/carditemrow.vue" //@
import NewCardItemRow from "../components/newcarditemrow.vue" //@
*/
//vijf componenten (naast de header en footer dus): bingocardrow, newbingocardrow, generatebingocard, carditemrow, newcarditemrow

import { get, post, del } from '@/src/requests';
import { type Bingocard } from "@/src/Bingocard";
import { type cardItem } from "@/src/cardItem"; //

export default defineComponent({
    components: {
        BingocardRow,
        NewBingocardRow,
        GenerateBingocard,
        CardItemRow,
        NewCardItemRow
    },
    /*props: {
        bingokaart: {
            type: Object as PropType<Bingocard>,
            //required: false,
            default: { id: "", userId: ""},
        },
    },*/
    data: () => ({
        userBingocards: [] as Bingocard[],
        //otherBingocards: [] as Bingocard[],
        //selectedBingocard: Bingocard,
        //selectedBingocard: Object as PropType<Bingocard>,
        //selectedBingocard: Object as Bingocard,
        //selectedBingocard: {} as Bingocard,
        generatedBingocardId: "", 
        selectedBingocardId: "",
        showItems: false,
        addItemAllowed: false,
        bingocardItems: [] as cardItem[],
        otherCardItems: [] as cardItem[],
        allCardItems: [] as cardItem[],
    }),
    beforeCreate() {
        if (this.$store.getToken === "") { //this.$store.getToken
            this.$router.replace({ path: "/login"});
        } else if (this.$store.getToken != "") {
            this.$store.autoLogin();
        }
    },
    created() {
        this.$store.$state.currentPage = 'bingokaart';

        this.userBingocards = this.$store.$state.stateUser.bingocards;

        //console.log(`userBingocards: ${JSON.stringify(this.userBingocards)}`);

        //this.fetchBingocards();
    },
    methods: {
        async addNewBingocard(bingocard: Bingocard)
        {
            try {
                //console.log(`attempting to add new bingocard: ${JSON.stringify(bingocard)}`);

                let res = await post('/bingocard/create', { 
                        userId: bingocard.userId,
                        size: bingocard.size
                    }).then((res) => { return JSON.parse(res.data)});

                if(res.errorMessage) {
                       return false;
                }

                if(res.id != '') {
                    //console.log(`stringify of new bingocard: ${JSON.stringify(res)}`);

                    this.userBingocards.push(res as Bingocard);
                    this.$store.$state.stateUser.bingocards = this.userBingocards;

                    return res.id;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async removeBingocard(id: string) 
        {
            try {

                let result = await del(`/bingocard/delete/${id}`).then( (res) => { return JSON.parse(res.data)});

                if(result.errorMessage) {
                    return false;
                }

                let index = this.userBingocards.findIndex(b => b.id == id);

                if(result == true && index != -1) {

                    //visueel verwijderen/weghalen van kaart-item informatie/blok en vars/params mocht de geselecteerde kaart verwijderd zijn
                    if(id === this.selectedBingocardId) {
                        this.bingocardItems = [] as cardItem[];
                        this.otherCardItems = [] as cardItem[];

                        this.selectedBingocardId = "";

                        this.showItems = false;
                    }

                    this.userBingocards.splice(index, 1);

                    this.$store.$state.stateUser.bingocards = this.userBingocards;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async showBingocardItems(id: string) 
        {
            try {
                //als eerste: leeg beide/zowel de bingocardItems als de otherCardItems arrays!
                //empty(this.bingocardItems);
                this.bingocardItems = [] as cardItem[];
                this.otherCardItems = [] as cardItem[];

                //console.log(`lege bingocardItems: ${JSON.stringify(this.bingocardItems)}`);
                //console.log(`lege otherCardItems: ${JSON.stringify(this.otherCardItems)}`);

                //this.showItems = true;

                let index = this.userBingocards.findIndex(b => b.id == id);

                let bingocard = this.userBingocards[index];

                //this.selectedBingocard = bingocard;
                if(bingocard.id != undefined && bingocard.items != undefined && bingocard.size != undefined) {

                    this.selectedBingocardId = bingocard.id;

                    bingocard.items.forEach((cardItem: cardItem) => {

                        /*if(this.$store.$state.stateUser.isPremium == false && cardItem.isPremiumItem == 1) {
                            return;
                        } else {
                            this.bingocardItems.push(cardItem);
                        }*/

                       //als het niet het geval is dat de gebruiker geen premium user is en het kaart-item een premium item is, voeg deze dan toe aan de items van de kaart
                        if(!(this.$store.$state.stateUser.isPremium == false && cardItem.isPremiumItem == 1)) {
                            this.bingocardItems.push(cardItem);
                        }

                        //this.bingocardItems.push(cardItem);

                    });

                    /*
                    console.log(`length van bingocardItems array: ${this.bingocardItems.length}`);
                    console.log(`bingocard size: ${bingocard.size}`);
                    */

                    if(this.bingocardItems.length < bingocard.size) {
                        await this.fetchCardItems();
                        this.addItemAllowed = true;
                    }

                    //await this.fetchCardItems();

                    this.showItems = true;
                }

                //console.log(`resultaat bingocardItems: ${JSON.stringify(this.bingocardItems)}`);
                //console.log(`resultaat otherCardItems: ${JSON.stringify(this.otherCardItems)}`);


                //this.bingocardItems = bingocard.items

                //TODO: vul de bingocardItems array met de items voor het juiste index nummer in de stateUser.bingocards array (dus geen api call = niet nodig als t goed is)
                //await this.fetchCardItems();
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async fetchCardItems() 
        {
            try {

                let result = await get('/carditem/getAll').then( (res) => { return JSON.parse(res.data)}); //cardItem

                if(result.errorMessage) {
                    return false;
                }

                result.forEach((cardItem: cardItem) => {

                    //console.log(cardItem);

                    let index = this.bingocardItems.findIndex(c => c.id == cardItem.id); //const

                    //zit een cardItem niet in de bingocardItems lijst, voeg deze dan toe aan de otherCardItems
                    if(index === -1) {

                       //als het niet het geval is dat de gebruiker geen premium user is en het kaart-item een premium item is, voeg deze dan toe aan de andere kaartitems
                       if(!(this.$store.$state.stateUser.isPremium == false && cardItem.isPremiumItem == 1)) {
                            this.otherCardItems.push(cardItem);
                        }

                        //this.otherCardItems.push(cardItem);
                    }
                });
            } catch (e) {
                console.error(e);
                return false;
            }

        },
        async generateFullBingocard(bingocard: Bingocard) //deze methode wordt aangeroepen vanaf een emit van het generatebingocard component
        {
            try {

                let newBingocardId = await this.addNewBingocard(bingocard);

                if(newBingocardId != false /*&& bingocard.size != undefined*/) {
                    this.generatedBingocardId = newBingocardId;

                    //console.log(`newly generated bingocard id: ${this.generatedBingocardId}`);

                    let result = await get('/carditem/getAll').then( (res) => { return JSON.parse(res.data)}); //cardItem

                    if(result.errorMessage) {
                        return false;
                    }

                    result.forEach((cardItem: cardItem) => {
                        this.allCardItems.push(cardItem); 
                    });

                    //console.log(`all card items array inhoud: ${JSON.stringify(this.allCardItems)}`);

                    if(this.$store.$state.stateUser.isPremium == false) {

                        //console.log(`all card items voor het filteren van premium items: ${JSON.stringify(this.allCardItems)}`);

                        this.allCardItems.forEach((cardItem: cardItem) => {
                            if(cardItem.isPremiumItem == 1) {

                                let premiumIndex = this.allCardItems.findIndex(c => c.id == cardItem.id);
                                this.allCardItems.splice(premiumIndex, 1);
                                //result.splice(index, 1);
                            }
                        });

                        //console.log(`de kaart-items NA het filteren van premium items: ${JSON.stringify(this.allCardItems)}`);
                    }

                    let index = this.userBingocards.findIndex(b => b.id == newBingocardId);

                    let userBingocard = this.userBingocards[index];

                    //console.log(`de nieuwe bingocard: ${JSON.stringify(userBingocard)}`);

                    if(userBingocard.size != undefined && this.userBingocards[index].items != undefined) {

                        for(var i = 0; i < userBingocard.size; i++) {

                            let randomIndex = Math.floor(Math.random() * this.allCardItems.length); //of is dit this.allCardItems.length - 1?
                            let cardItem = this.allCardItems[randomIndex];

                            /*
                            console.log(`de random index gekozen: ${randomIndex}`);
                            console.log(`de lengte van de allCardItems array: ${this.allCardItems.length}`);
                            console.log(`het kaart-item: ${JSON.stringify(cardItem)}`);
                            */

                            //potentieel probleem: ik verwijder nu een item zodra deze is gebruikt, wat voor foutmelding krijg je wanneer de items in allCardItems
                            //op raken voordat de for loop voorbij is? (dus voordat de size van de kaart geheel gevuld kan worden?)

                            //solution poging 2:
                            //bij laatste item in allCardItems array, voeg toe en exit hierna (dus uiteindelijk: voeg toe, totdat de items op zijn of de size for loop wel is gevuld)
                            if(randomIndex == 0 && this.allCardItems.length == 1) { //if(randomIndex === 0 && this.allCardItems.length === 1) {
                                
                                //console.log(`LAATSTE TOEVOEGING aan de bingokaart voor cardItem id: ${cardItem.id}`);
                                
                                await this.addBingocardItem(cardItem.id);

                                this.userBingocards[index].items.push(cardItem);

                                //this.allCardItems.splice(randomIndex, 1);

                                //console.log(`all card items array (binnen loop, voor laatste keer): ${JSON.stringify(this.allCardItems)}`);

                                this.$store.$state.stateUser.bingocards = this.userBingocards;
                                this.allCardItems = [] as cardItem[];
                                this.generatedBingocardId = "";
                                return; 
                            } else if(cardItem != undefined || cardItem != null) { //else {

                                //console.log(`normale toevoeging aan de bingokaart voor cardItem id: ${cardItem.id}`);
                                //console.log(`all card items array (binnen loop, voor normale toevoeging): ${JSON.stringify(this.allCardItems)}`);

                                await this.addBingocardItem(cardItem.id);

                                this.userBingocards[index].items.push(cardItem);

                                this.allCardItems.splice(randomIndex, 1);

                                //console.log(`all card items array (binnen loop, voor normale toevoeging, na verwijderen): ${JSON.stringify(this.allCardItems)}`);
                            }

                            //solution poging 1:
                            /*if(cardItem != undefined || cardItem != null) {
                                //addBingocardItem
                                await this.addBingocardItem(cardItem.id);

                                this.userBingocards[index].items.push(cardItem);

                                this.allCardItems.splice(randomIndex, 1);
                            }*/


                            //geen solution code:
                            /*
                            await this.addBingocardItem(cardItem.id);

                            this.userBingocards[index].items.push(cardItem);

                            this.allCardItems.splice(randomIndex, 1);
                            */

                            /*if(!(this.$store.$state.stateUser.isPremium == false && cardItem.isPremiumItem == 1)) {

                            }*/
                        }
                    }

                    //console.log(`all card items array (na de loop): ${JSON.stringify(this.allCardItems)}`);
                    //console.log(`het generated bingocard Id VOOR het resetten: ${this.generatedBingocardId}`);

                    this.$store.$state.stateUser.bingocards = this.userBingocards;
                    this.allCardItems = [] as cardItem[];
                    this.generatedBingocardId = "";

                    //console.log(`all card items array (na de loop en na verwijderen): ${JSON.stringify(this.allCardItems)}`);
                    //console.log(`het generated bingocard Id na het resetten: ${this.generatedBingocardId}`);

                    //return;

                    /*result.forEach((cardItem: cardItem) => {

                        console.log(cardItem);

                        let index = this.bingocardItems.findIndex(c => c.id == cardItem.id); //const

                        //zit een cardItem niet in de bingocardItems lijst, voeg deze dan toe aan de otherCardItems
                        if(index === -1) {

                        //als het niet het geval is dat de gebruiker geen premium user is en het kaart-item een premium item is, voeg deze dan toe aan de andere kaartitems
                        if(!(this.$store.$state.stateUser.isPremium == false && cardItem.isPremiumItem == 1)) {
                            this.otherCardItems.push(cardItem);
                        }

                        //this.otherCardItems.push(cardItem);
                        }
                    });*/

                    //TODO: fetch cardItems (geen premium items gebruiken als gebruiker dat niet is) 
                    //en voor random cardItem ids (tot de size is bereikt) calls doen naar addBingocardItem               
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async addBingocardItem(/*bingocardId: string,*/ cardItemId: string) 
        {
            try {

                let bingocardId = "";

                if(this.generatedBingocardId != "") {
                    bingocardId = this.generatedBingocardId;
                } else if(this.selectedBingocardId != "") {
                    bingocardId = this.selectedBingocardId;
                }

                //console.log(`the bingocardId to add the item to: ${bingocardId}`);

                let index = this.userBingocards.findIndex(b => b.id == bingocardId);

                let bingocard = this.userBingocards[index];

                if(bingocard.size != undefined && bingocard.items != undefined) {

                    /*console.log(`length van de betreffende bingocard items array: ${bingocard.items.length}`);
                    console.log(`bingocard formaat: ${bingocard.size}`);*/
                    //console.log(`aantal items in bingokaart: ${bingocard.items.length + 1}`);

                    if(bingocard.items.length < bingocard.size) {

                        let result = await post(`/bingocard/addBingocardItem/${bingocardId}/${cardItemId}`, {}).then( (res) => { return JSON.parse(res.data)});

                        if(result.errorMessage) {
                            return false;
                        }

                        //console.log(`did we post the item: ${cardItemId} ?: answer: ${result}`);

                        let otherIndex = this.otherCardItems.findIndex(c => c.id == cardItemId);

                        if(result == true && otherIndex != -1) {

                            let cardItem = this.otherCardItems[otherIndex];

                            this.otherCardItems.splice(otherIndex, 1);

                            this.bingocardItems.push(cardItem);


                            //1 
                            //this.$store.$state.stateUser.bingocards[index].items = this.bingocardItems;

                            //of

                            //2 (voorkeur nu voor methode 2 denk ik)
                            if(this.generatedBingocardId == "" && this.selectedBingocardId != "") { //testen/kijken voor proper state-management of dit nu nodig is of niet (lijkt met wel, maar je weet maar nooit)
                                this.userBingocards[index].items = this.bingocardItems;
                                this.$store.$state.stateUser.bingocards = this.userBingocards;
                            }

                            /*if(this.bingocardItems.length == bingocard.size) {
                                this.addItemAllowed = false;
                            }*/

                        }

                    } else {
                        //console.log(`lengte van de bingokaart wordt overschreven wanneer er nog een item aan de kaart wordt toegevoegd!: lengte: ${bingocard.size}`);
                    }

                    //console.log(`length van de betreffende bingocard items array: ${bingocard.items.length}`);
                    //console.log(`bingocard formaat: ${bingocard.size}`);

                    if(bingocard.items.length == bingocard.size) {
                            this.addItemAllowed = false;
                    }
                }

                //this.userBingocards; .bingocardId check size!

                //API call addBingocardItem

                //TODO: Het eerste wat hier moet gebeuren straks:
                //check size van bingocard (geen api call naar getOne, maar check kaart in userBingocards voor juiste index waar id gelijk is (beter denk ik))!
                //wordt size limiet niet overschreven bij +1 item? (check size van cardItems/items array voor die kaart dus!)
                //dan kan item worden toegevoegd, anders niet (anders foutmeldingslabel tonen ofzo idk)

                //call naar addBingocardItem API endpoint natuurlijk
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async removeBingocardItem(/*bingocardId: string,*/ cardItemId: string) 
        {
            try {

                let bingocardId = this.selectedBingocardId;


                let result = await del(`/bingocard/deleteBingocardItem/${bingocardId}/${cardItemId}`).then( (res) => { return JSON.parse(res.data)});

                if(result.errorMessage) {
                    return false;
                }

                let index = this.bingocardItems.findIndex(c => c.id == cardItemId);

                if(result == true && index != -1) {
                    let cardItem = this.bingocardItems[index];

                    this.bingocardItems.splice(index, 1);

                    this.otherCardItems.push(cardItem); 


                    let userIndex = this.userBingocards.findIndex(b => b.id == bingocardId);
                    this.userBingocards[userIndex].items = this.bingocardItems;
                    this.$store.$state.stateUser.bingocards = this.userBingocards;

                    this.addItemAllowed = true;
                }

                //bingocardId = this.selectedBingocardId dus

                //idee: gebruik de selectedBingocardId als/voor het bingocardId in plaats van 2 arguments verplicht te stellen? (mocht dit niet kunnen/lukken bv?)
            
                //call naar deleteBingocardItem API endpoint uiteraard
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async addNewBingocardItem(cardItem: cardItem) 
        {
            try {
                
                let res = await post('/carditem/create/', { 
                        content: cardItem.content, 
                        category: cardItem.category, 
                        points: cardItem.points,
                        isPremiumItem: cardItem.isPremiumItem
                    }).then((res) => { return JSON.parse(res.data)});

                if(res.errorMessage) {
                       return false;
                }

                if(res.id != '') {

                    //console.log(`stringify van nieuwe kaart-item: ${JSON.stringify(res)}`);

                    this.addBingocardItem(res.id);
                    this.bingocardItems.push(res as cardItem); //.push(res);


                    let index = this.userBingocards.findIndex(b => b.id == this.selectedBingocardId);
                    this.userBingocards[index].items = this.bingocardItems;
                    this.$store.$state.stateUser.bingocards = this.userBingocards;
                    //this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
                }

                //create API call en daarna door naar addBingocardItem 
                //(die checkt of er niet iets verwijderd moet worden uit de otherCardItems, is dit niet het geval, negeer de rest na de API call voor addBingocardItem dan)
                //daarna toevoegen en verwijderen van de juiste respectievelijke lijsten zoals eerder gedaan is (correct) op de sportclubs pagina (zie dat als voorbeeld)
            } catch (e) {
                console.error(e);
                return false;
            }
        }
    }
});
</script>

<template>
    <!--
    //remember: gaan zorgen voor het beperken van een kaart-item array per bingokaart met als limiet de size natuurlijk! 
    //(centraal bingokaart object om mee te geven aan kaartitemrow component wellicht?)
    //en binnen 1 container section (header: volledige bingokaart genereren ipv/naast de nieuwe/onderste rij onderin de mijn bingokaart tabel)
    //met daarin dus een label (selecteer formaat) met een select (box om 3x3, 4x4 of 5x5 te kiezen) en de knop: 'genereer bingokaart', wat de kaart aanmaakt,
    //kaart items selecteert en deze voor de kaart aanmaakt (addBingocardItem API endpoint call dus) en daarna de interne arrays hier bijwerkt
    -->
    <body>
        <Header />
            <section class="container mt-5 mb-5" id="table-container">
                <section class="row justify-content-md-center">
                    <h2 class="mb-4 mt-4 website-logo-text table-title-text">Mijn Bingokaarten</h2>
                </section>

                <section class="table-responsive mb-5">
                    <table class="table table-borderless bsb-table-xl text-nowrap align-middle m-0">
                        <thead class="bingo-table-header-row">
					        <tr>
                                <th>Id</th>
                                <th>Gebruikers Id</th>
						        <th>Score</th>
						        <th>Formaat</th>
						        <th>Aanmaakdatum</th>
						        <th>Laatst bekeken</th>
						        <th>Kaart-items</th>
						        <th></th>
					        </tr>
					    </thead>
                        <tbody>
                            <BingocardRow v-for="bingokaart in userBingocards" :key="bingokaart.id" :bingocard="bingokaart" @showBingocardItems="showBingocardItems" @removeBingocard="removeBingocard" />
                            <NewBingocardRow @addNewBingocard="addNewBingocard" />

                        <!--
                        <tr class="bingocard-subtable-rows">
				    		<td>
				    		  <section class="align-items-center">
				    			<textarea class="bingo-table-columns bingo-id-column table-bingocard-id"></textarea>
				    		  </section>
				    		</td>
                            <td>
                                <section class="align-items-center">
                                    <textarea class="bingo-table-columns bingo-id-column table-bingocard-userId"></textarea>
                                </section>
                            </td>
				    		<td>
				    			<textarea class="bingo-table-columns table-bingocard-score"></textarea>
				    		</td>
				    		<td>
				    			<textarea class="bingo-table-columns table-bingocard-size"></textarea>
				    		</td>
				    		<td>
				    		  <textarea class="bingo-table-columns table-bingocard-creationDate"></textarea>
				    		</td>
				    		<td>
				    			<textarea class="bingo-table-columns table-bingocard-lastAccessedOn"></textarea>
				    		</td>
				    		<td>
				    			<button type="button" class="btn btn-primary bingo-table-buttons table-bingocard-cardItems-button" onclick="showSubtableSection(this.value, 'carditem')">Toon bingokaart-items</button>
				    		</td>
				    		<td>
				    			<button type="button" class="btn btn-warning bingo-table-buttons table-bingocard-edit-button" name="wijzigen" onclick="editBingocard(this.value)">Wijzigen</button>
				    		    <button type="button" class="btn btn-danger bingo-danger-btn bingo-table-buttons table-bingocard-remove-button" name="verwijderen" onclick="if(confirm(`Weet u zeker dat u bingokaart ${this.value} wilt verwijderen?`)){deleteBingocard(this.value)};">Verwijderen</button>
				    		</td>
				    	</tr>
                        -->


                        <!--
                            <tr class="bingocard-table-bottom-row">
					    	<td>
                                <h6 class="bingo-nieuw-header-text"><b>Nieuwe bingokaart:</b></h6>
                            </td>
                            <td>
                                <textarea class="bingo-table-columns new-bingocard-user-id" name="new-bingocard-userId"></textarea>
                            </td>
					    	<td>
					    		<h6 class="bingo-nieuw-header-text">0</h6>
					    	</td>
					    	<td>
					    		<select name="new-bingocard-sizes">
					    			<option name="drie_bij_drie" value="9" selected>9</option>
					    			<option name="vier_bij_vier" value="16">16</option>
					    			<option name="vijf_bij_vijf" value="25">25</option>
					    		</select>
					    	</td>
					    	<td>
					    		<h6 class="bingo-nieuw-header-text"><?php echo date("Y-m-d H:i:s"); ?></h6>
					    	</td>
					    	<td>
					    		<h6 class="bingo-nieuw-header-text"><?php echo date("Y-m-d H:i:s"); ?></h6>
					    	</td>
					    	<td>
					    		<h6 class="bingo-nieuw-header-text">0</h6>
					    	</td>
					    	<td>
					    		<button type="button" class="btn btn-success bingo-table-add-button" onclick="createNewBingocard()">Voeg toe</button>
					    	</td>
					      </tr>
                        -->

                        </tbody>
                    </table>
                </section>

                <GenerateBingocard @generateFullBingocard="generateFullBingocard" />

                <!-- inhoud van generatebingocard.vue component:
                <section class="container" style="max-width: 35rem !important;">
                    <section class="row justify-content-md-center mt-5 mb-5 bingo-subtable-text"> container mt-5 mb-5 bingo-subtable-text
				        <h2 class="mt-4 mb-3 website-logo-text table-title-text" id="bingocards-generate-title-text" style="color: #0070c0 !important; padding: 0 !important;">Volledige bingokaart genereren</h2>
				        <h2 class="mb-4 website-logo-text table-title-text" id="bingocards-generate-format-title-text" style="color: #1f0c6a !important; padding: 0 !important;">Selecteer formaat:</h2>
                        <select name="new-bingocard-sizes">
					        <option name="drie_bij_drie" value="9" selected>3x3</option>
						    <option name="vier_bij_vier" value="16">4x4</option>
						    <option name="vijf_bij_vijf" value="25">5x5</option>
					    </select>
                        <button type="button" class="btn btn-success bingo-table-add-button" @click="generateFullBingocard">Genereer bingokaart</button>
				    </section>
                </section>
                -->


                <section v-if="showItems" class="mb-4 row justify-content-md-center" id="carditems-table-section">
                    <section class="container bingo-subtable-text">			
					    <h2 class="text-center mb-4 mt-4 website-logo-text table-title-text" id="carditems-table-title-text">Kaart-items van bingokaart: </h2>
					    <h2 class="text-center mb-4 mt-4 mr-4 website-logo-text table-title-text" id="carditems-table-title-id-text">{{ selectedBingocardId }}</h2>
				    </section>

                    <section class="table-responsive mb-5">
				        <table class="table table-borderless bsb-table-xl text-nowrap align-middle m-0">
					        <thead class="bingo-table-header-row">
					            <tr>
						            <th>Id</th>
						            <th>Inhoud</th>
						            <th>Categorie</th>
						            <th>Punten</th>
						            <th>Premium Item?</th>
						            <th></th>
					            </tr>
					        </thead>
                            <tbody>
                                
                                <CardItemRow v-for="cardItem in bingocardItems" :key="cardItem.id" :kaartItem="cardItem" :buttonType="'delete'" @addBingocardItem="addBingocardItem" @removeBingocardItem="removeBingocardItem" />
                                <NewCardItemRow v-if="addItemAllowed" @addNewBingocardItem="addNewBingocardItem" />
                                

                                <!--
                                <tr class="bingocard-item-subtable-rows">
					            	<td>
					            	  <section class="align-items-center">
					            		<textarea class="bingo-table-columns bingo-id-column table-bingocard-item-id"></textarea>
					            	  </section>
					            	</td>
					            	<td>
					            		<textarea class="bingo-table-columns bingo-content-column table-bingocard-item-content"></textarea>
					            	</td>
					            	<td>
					            		<textarea class="bingo-table-columns table-bingocard-item-category"></textarea>
					            	</td>
					            	<td>
					            	  <textarea class="bingo-table-columns table-bingocard-item-points"></textarea>
					            	</td>
					            	<td>
					            		<textarea class="bingo-table-columns table-bingocard-item-isPremiumItem"></textarea>
					            	</td>
					            	<td>
					            		<button type="button" class="btn btn-warning bingo-table-buttons table-bingocard-item-edit-button" name="wijzigen" onclick="editBingocardItem(this.value)">Wijzigen</button>
					            		<button type="button" class="btn btn-danger bingo-danger-btn bingo-table-buttons table-bingocard-item-remove-button" name="verwijderen" onclick="if(confirm(`Weet u zeker dat u bingokaart-item ${this.value} van deze bingokaart wilt verwijderen?`)){deleteBingocardItem(this.value);}">Verwijderen</button>
					            	</td>
					            </tr>
                                -->

                                <!--
                                <tr class="bingocard-item-table-bottom-row">
					                <td><h6 class="bingo-nieuw-header-text"><b>Nieuw bingokaart-item:</b></h6></td>
						        	<td>
						        		<textarea class="bingo-table-columns" placeholder="Iets leuks, grappigs of opmerkelijks gerelateerd aan sport wat op een bingokaart kan worden gezet" name="new-bingocard-item-content"></textarea>
						        	</td>
						        	<td>
						        		<select name="new-bingocard-item-content-categories" id="new-bingocard-item-content-select">
						        			<option name="category_0" value="0" selected>standaard tekst</option>
						        			<option name="category_1" value="1">speciaal font of effect</option>
						        			<option name="category_2" value="2">afbeelding</option>
						        			<option name="category_3" value="3">geluidseffect</option>
						        			<option name="category_4" value="4">video</option>
						        			<option name="category_5" value="5">animatie</option>
						        		</select>
						        	</td>
						        	<td>
						        		<textarea class="bingo-table-columns" placeholder="10" name="new-bingocard-item-points"></textarea>
						        	</td>
						        	<td>
                                        DIT STRAKS STANDAARD OP NEE WANNEER GEBRUIKER GEEN PREMIUM IS/HEEFT, EN ANDERS WEL DE OPTIE GEVEN VOOR NIEUWE ITEMS!
						        		<select name="new-premium-bingocard-items" id="new-bingocard-item-premium-select">
						        			<option name="true" value="1">Ja</option>
						        			<option name="false" value="0" selected>Nee</option>
						        		</select>
						        	</td>
						        	<td>
						        		<button type="button" class="btn btn-success bingo-table-add-button" onclick="createBingocardItem()">Voeg toe</button>
						        	</td>
					            </tr>
                                -->

                            </tbody>
                        </table>
                    </section>

                    <section v-if="addItemAllowed">
                        <section class="row container"> <!--row justify-content-md-center || container bingo-subtable-text-->
                            <h2 class="mb-4 mt-4 website-logo-text table-title-text">Andere Kaart-items</h2>
                        </section>

                        <section class="table-responsive mb-5">
				            <table class="table table-borderless bsb-table-xl text-nowrap align-middle m-0">
					            <thead class="bingo-table-header-row">
					                <tr>
					    	            <th>Id</th>
					    	            <th>Inhoud</th>
					    	            <th>Categorie</th>
					    	            <th>Punten</th>
					    	            <th>Premium Item?</th>
					    	            <th></th>
					                </tr>
					            </thead>
                                <tbody>
                                    <CardItemRow v-for="cardItem in otherCardItems" :key="cardItem.id" :kaartItem="cardItem" :buttonType="'add'" @addBingocardItem="addBingocardItem" @removeBingocardItem="removeBingocardItem" />
                                </tbody>
                            </table>
                        </section>
                    </section>

                </section>

            </section>
        <Footer />
    </body>
</template>

<style scoped>

#carditems-table-title-id-text {
    color: #1f0c6a !important;
}

@media screen and (min-width: 960px)
{
    #carditems-table-title-id-text {
        margin-left: 0.5em !important;
    }

    /**/
    .bingo-subtable-text {
        display: flex !important;
    }
    /**/
}

</style>