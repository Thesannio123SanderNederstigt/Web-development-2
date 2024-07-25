<script lang="ts">
import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

import BingocardRow from "@/components/bingocardrow.vue";
import NewBingocardRow from "@/components/newbingocardrow.vue";
import GenerateBingocard from "@/components/generatebingocard.vue"; 
import CardItemRow from "@/components/carditemrow.vue";
import NewCardItemRow from "@/components/newcarditemrow.vue";

import { get, post, del } from '@/src/requests';
import { type Bingocard } from "@/src/Bingocard";
import { type cardItem } from "@/src/cardItem"; //

export default defineComponent({
    components: {
        Header,
        Footer,
        BingocardRow,
        NewBingocardRow,
        GenerateBingocard,
        CardItemRow,
        NewCardItemRow
    },
    data: () => ({
        userBingocards: [] as Bingocard[],
        generatedBingocardId: "", 
        selectedBingocardId: "",
        showItems: false,
        addItemAllowed: false,
        bingocardItems: [] as cardItem[],
        otherCardItems: [] as cardItem[],
        allCardItems: [] as cardItem[],
    }),
    beforeCreate() {
        if (this.$store.getToken === "") {
            this.$router.replace({ path: "/login"});
        } else if (this.$store.getToken != "") {
            this.$store.autoLogin();
        }
    },
    created() {
        this.$store.$state.currentPage = 'bingokaarten';

        this.userBingocards = this.$store.$state.stateUser.bingocards;
    },
    methods: {
        async addNewBingocard(bingocard: Bingocard)
        {
            try {

                let res = await post('/bingocard/create', { 
                        userId: bingocard.userId,
                        size: bingocard.size
                    }).then((res) => { return JSON.parse(res.data)});

                if(res.errorMessage) {
                       return false;
                }

                if(res.id != '') {

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
                //legen van zowel de bingocardItems als de otherCardItems arrays
                this.bingocardItems = [] as cardItem[];
                this.otherCardItems = [] as cardItem[];

                let index = this.userBingocards.findIndex(b => b.id == id);

                let bingocard = this.userBingocards[index];

                if(bingocard.id != undefined && bingocard.items != undefined && bingocard.size != undefined) {

                    this.selectedBingocardId = bingocard.id;

                    bingocard.items.forEach((cardItem: cardItem) => {

                       //als het niet het geval is dat de gebruiker geen premium user is en het kaart-item een premium item is, voeg deze dan toe aan de items van de kaart
                        if(!(this.$store.$state.stateUser.isPremium == false && cardItem.isPremiumItem == 1)) {
                            this.bingocardItems.push(cardItem);
                        }

                    });

                    if(this.bingocardItems.length < bingocard.size) {
                        await this.fetchCardItems();
                        this.addItemAllowed = true;
                    }

                    this.showItems = true;
                }
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

                    let index = this.bingocardItems.findIndex(c => c.id == cardItem.id); //const

                    //zit een cardItem niet in de bingocardItems lijst, voeg deze dan toe aan de otherCardItems
                    if(index === -1) {

                       //als het niet het geval is dat de gebruiker geen premium user is en het kaart-item een premium item is, voeg deze dan toe aan de andere kaartitems
                       if(!(this.$store.$state.stateUser.isPremium == false && cardItem.isPremiumItem == 1)) {
                            this.otherCardItems.push(cardItem);
                        }
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

                if(newBingocardId != false) {
                    this.generatedBingocardId = newBingocardId;

                    let result = await get('/carditem/getAll').then( (res) => { return JSON.parse(res.data)});

                    if(result.errorMessage) {
                        return false;
                    }

                    result.forEach((cardItem: cardItem) => {
                        this.allCardItems.push(cardItem); 
                    });

                    if(this.$store.$state.stateUser.isPremium == false) {

                        this.allCardItems.forEach((cardItem: cardItem) => {
                            if(cardItem.isPremiumItem == 1) {

                                let premiumIndex = this.allCardItems.findIndex(c => c.id == cardItem.id);
                                this.allCardItems.splice(premiumIndex, 1);
                            }
                        });
                    }

                    let index = this.userBingocards.findIndex(b => b.id == newBingocardId);

                    let userBingocard = this.userBingocards[index];

                    if(userBingocard.size != undefined && this.userBingocards[index].items != undefined) {

                        for(var i = 0; i < userBingocard.size; i++) {

                            let randomIndex = Math.floor(Math.random() * this.allCardItems.length);
                            let cardItem = this.allCardItems[randomIndex];

                            //bij laatste item in allCardItems array, voeg toe en exit hierna (dus uiteindelijk: voeg toe, totdat de items op zijn of de size for loop wel is gevuld)
                            if(randomIndex == 0 && this.allCardItems.length == 1) { //if(randomIndex === 0 && this.allCardItems.length === 1) {
                                
                                await this.addBingocardItem(cardItem.id);

                                this.userBingocards[index].items.push(cardItem);

                                this.$store.$state.stateUser.bingocards = this.userBingocards;
                                this.allCardItems = [] as cardItem[];
                                this.generatedBingocardId = "";
                                return; 
                            } else if(cardItem != undefined || cardItem != null) {

                                await this.addBingocardItem(cardItem.id);

                                this.userBingocards[index].items.push(cardItem);

                                this.allCardItems.splice(randomIndex, 1);
                            }
                        }
                    }

                    this.$store.$state.stateUser.bingocards = this.userBingocards;
                    this.allCardItems = [] as cardItem[];
                    this.generatedBingocardId = "";             
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async addBingocardItem(cardItemId: string) 
        {
            try {

                let bingocardId = "";

                if(this.generatedBingocardId != "") {
                    bingocardId = this.generatedBingocardId;
                } else if(this.selectedBingocardId != "") {
                    bingocardId = this.selectedBingocardId;
                }

                let index = this.userBingocards.findIndex(b => b.id == bingocardId);

                let bingocard = this.userBingocards[index];

                if(bingocard.size != undefined && bingocard.items != undefined) {

                    if(bingocard.items.length < bingocard.size) {

                        let result = await post(`/bingocard/addBingocardItem/${bingocardId}/${cardItemId}`, {}).then( (res) => { return JSON.parse(res.data)});

                        if(result.errorMessage) {
                            return false;
                        }

                        let otherIndex = this.otherCardItems.findIndex(c => c.id == cardItemId);

                        if(result == true && otherIndex != -1) {

                            let cardItem = this.otherCardItems[otherIndex];

                            this.otherCardItems.splice(otherIndex, 1);

                            this.bingocardItems.push(cardItem);

                            if(this.generatedBingocardId == "" && this.selectedBingocardId != "") {
                                this.userBingocards[index].items = this.bingocardItems;
                                this.$store.$state.stateUser.bingocards = this.userBingocards;
                            }

                        }

                    }

                    if(bingocard.items.length >= bingocard.size) {
                            this.addItemAllowed = false;
                    }
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async removeBingocardItem(cardItemId: string) 
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

                    if(this.userBingocards[userIndex].size != undefined && this.userBingocards[userIndex].items != undefined) {

                        if(this.userBingocards[userIndex].items.length < this.userBingocards[userIndex].size) {
                            this.addItemAllowed = true;
                        }
                    }
                }

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
                    this.addBingocardItem(res.id);
                    this.bingocardItems.push(res as cardItem);

                    let index = this.userBingocards.findIndex(b => b.id == this.selectedBingocardId);
                    this.userBingocards[index].items = this.bingocardItems;
                    this.$store.$state.stateUser.bingocards = this.userBingocards;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        }
    }
});
</script>

<template>
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
                        </tbody>
                    </table>
                </section>

                <GenerateBingocard @generateFullBingocard="generateFullBingocard" />

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

@media screen and (min-width: 1171px)
{
    #carditems-table-title-id-text {
        margin-left: 0.5em !important;
    }

    .bingo-subtable-text {
        display: flex !important;
    }
}
</style>