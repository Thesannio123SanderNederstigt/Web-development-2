<script lang="ts">
import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import SportclubsRow from "@/components/sportclubsrow.vue";
import NewSportclubsRow from "@/components/newsportclubsrow.vue";

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
        if (this.$store.getToken === "") {
            this.$router.replace({ path: "/login"});
        } else if (this.$store.getToken != "") {
            this.$store.autoLogin();
        }
    },
    created() {
        this.$store.$state.currentPage = 'sportclubs';

        this.userSportsclubs = this.$store.$state.stateUser.sportsclubs;

        this.fetchSportsclubs();
    },
    methods: {
        async fetchSportsclubs() {
            try {

                let result = await get('/sportsclub/getAll').then( (res) => { return JSON.parse(res.data)});

                if(result.errorMessage) {
                    return false;
                }

                result.forEach((sportclub: Sportsclub) => {

                    let index = this.userSportsclubs.findIndex(s => s.id == sportclub.id);

                    //zit een club niet in de userSportsclubs lijst, voeg deze dan toe aan de otherSportsclubs
                    if(index === -1) {
                        this.otherSportsclubs.push(sportclub);
                    }
                });
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async addUserSportsclub(id: string)
        {
            try {

                let result = await post(`/user/addUserSportsclub/${this.$store.$state.stateUser.id}/${id}`, {}).then( (res) => { return JSON.parse(res.data)});

                if(result.errorMessage) {
                    return false;
                }

                let index = this.otherSportsclubs.findIndex(s => s.id == id);

                if(result == true && index != -1) {

                    let sportclub = this.otherSportsclubs[index];

                    this.otherSportsclubs.splice(index, 1);

                    this.userSportsclubs.push(sportclub);

                    this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async removeUserSportsclub(id: string)
        {
            try {

                let result = await del(`/user/deleteUserSportsclub/${this.$store.$state.stateUser.id}/${id}`).then( (res) => { return JSON.parse(res.data)});

                if(result.errorMessage) {
                    return false;
                }

                let index = this.userSportsclubs.findIndex(s => s.id == id);

                if(result == true && index != -1) {
                    let sportclub = this.userSportsclubs[index];

                    this.userSportsclubs.splice(index, 1);

                    this.otherSportsclubs.push(sportclub); 

                    this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        },
        async addNewSportsclub(sportclub: Sportsclub)
        {
            try {

                let res = await post('/sportsclub/create', { 
                        clubname: sportclub.clubname, 
                        description: sportclub.description, 
                        foundedOn: sportclub.foundedOn,
                        membersAmount: sportclub.membersAmount
                    }).then((res) => { return JSON.parse(res.data)});

                if(res.errorMessage) {
                       return false;
                }

                if(res.id != '') {
                    this.addUserSportsclub(res.id);
                    this.userSportsclubs.push(res as Sportsclub);
                    this.$store.$state.stateUser.sportsclubs = this.userSportsclubs;
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
                            <SportclubsRow v-for="sportclub in otherSportsclubs" :key="sportclub.id" :sportsclub="sportclub" :buttonType="'add'" @addUserSportsclub="addUserSportsclub" @removeUserSportsclub="removeUserSportsclub" />
                        </tbody>
                    </table>
                </section>

            </section>
        <Footer />
    </body>
</template>

<style scoped>

</style>