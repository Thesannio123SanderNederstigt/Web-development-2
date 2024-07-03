<script lang="ts">
import { defineComponent } from "vue";
import { put } from '@/src/requests';

export default defineComponent({
    data() {
        return {
            //currentPage: sessionStorage.getItem("currentPage") ?? "",
            currentPage: this.$store.$state.currentPage,
            userIsPremium: false,
            premiumError: false,
            premiumSuccess: false,

            //currentPage: 'what',
            //stateUser: this.$store.$state.stateUser.id,
        }
    },
    created() {
        this.userIsPremium = this.$store.$state.stateUser.isPremium;
        this.premiumError = false;
        this.premiumSuccess = false;
        //this.currentPage = this.$store.$state.currentPage;
        //this.currentPage = this.$store.getCurrentPage();
    },
    methods: {
        /*highlightActivePage()
        { //idee: een state of session prop met de naam die je anders hier zou opzoeken
            var view_page_element = document.getElementById("nav-current-page");
            var current_page = view_page_element.getAttribute("name");
        
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
        
            var current_nav_page = document.getElementById(current_page);
            current_nav_page.className += " active";
        },*/
        async addPremiumFeatures()
        {
            /*this.$store.$state.authToken = "";
            localStorage.getItem('authToken');
            sessionStorage.setItem('authToken', "");*/

            //console.log(`is user premium?: ${this.$store.$state.stateUser.isPremium}`);

            //fetch API call naar updateUser om premium op true te zetten...that's it

            try {
                let res = await put(`/user/update/${this.$store.$state.stateUser.id}`, { 
                    /*username: this.$store.$state.stateUser.username,
                    email: this.$store.$state.stateUser.email,
                    isAdmin: this.$store.$state.stateUser.isAdmin,*/
                    isPremium: 1
                    /*cardsAmount: this.$store.$state.stateUser.cardsAmount,
                    sharedCardsAmount: this.$store.$state.stateUser.sharedCardsAmount*/
                }).then((res) => { return JSON.parse(res.data)});

                if(res.errorMessage) {
                    this.premiumError = true;
                    return false;
                }
                
                if( res != null && res.id != "") {
                    this.$store.$state.stateUser.isPremium = res.isPremium;
                    this.premiumSuccess = true; //display small tekst: gebruiker is succesvol premium nu
                    this.userIsPremium = true;
                }

                //console.log(`is user now premium?: ${this.$store.$state.stateUser.isPremium}`);

                return true;
            } catch(e) {
                console.error(e);
                return false;
            }
        },
        userLogout()
        {
            sessionStorage.clear();
            this.$store.$reset();

            /*sessionStorage.clear();
            this.$store.logout();*/
            this.$router.push("/login");
        },
        navToPage(page: string)
        {
            //console.log(`page path: ${page}`);
            this.$router.replace({path:`${page}`});
        }
    }
});
</script>

<template>
    <section class="container headerfooter">
        <section class="row">
            <section class="col-12">
                <nav class="navbar navbar-expand-lg bsb-navbar bsb-navbar-hover bsb-navbar-caret bsb-tpl-navbar-sticky bg-white border border-dark px-xl-3 headernavbar" data-bsb-sticky-target="#header">
                    <section class="container headerfooter">
                        <h2 class="headernavbar">Schaatsbingo.nl</h2>
                        <p v-if="premiumSuccess" class="text-center text-secondary premium-text" id="premium-success-text">Premium succesvol aangeschaft!</p>
                        <p v-if="premiumError" class="text-center text-secondary premium-text" id="premium-error-text">Premium kon niet worden aangeschaft!</p>
                        <h3 class="headernavbar" id="header-login-info">Welkom {{ $store.$state.stateUser.username }}</h3>
                        <button class="navbar-toggler border-0 headernavbar" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
                            </svg>
                        </button>
                        <section class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                            <section class="offcanvas-header" id="offcanvas-bar-header">
                                <h5 class="offcanvas-title navbar-linkitems" id="offcanvasNavbarLabel">Ga naar</h5>
                                <button type="button" class="btn-close" id="close-button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </section>
                            <section class="offcanvas-body" id="offcanvas-bar-body">
                                <ul class="navbar-nav justify-content-start flex-grow-1" id="navbarlinks">
                                    <li class="nav-item" id="nav-item-home">
                                        <a :class="[currentPage == 'home' ? 'nav-link navbar-linkitems active' : 'nav-link navbar-linkitems']" aria-current="page" @click="navToPage('/')">Start</a>
                                    </li>
                                    <li class="nav-item">
                                        <a :class="[currentPage == 'nieuweKaart' ? 'nav-link navbar-linkitems active' : 'nav-link navbar-linkitems']" @click="navToPage('/nieuweKaart')">Nieuwe kaart maken</a>
                                        <!--<a class="nav-link navbar-linkitems" id="bingo-nav-users" href="/user">Gebruikers</a>-->
                                    </li>
                                    <li class="nav-item">
                                        <a :class="[currentPage == 'kaartInvullen' ? 'nav-link navbar-linkitems active' : 'nav-link navbar-linkitems']" @click="navToPage('/kaartInvullen')">Kaart invullen</a>
                                        <!--<a class="nav-link navbar-linkitems" id="bingo-nav-bingocards" href="/bingocard">Bingokaarten</a>-->
                                    </li>
                                    <li class="nav-item" id="nav-item-club">
                                        <a :class="[currentPage == 'sportclubs' ? 'nav-link navbar-linkitems active' : 'nav-link navbar-linkitems']" @click="navToPage('/sportclubs')">Sportclubs</a>
                                        <!--<a class="nav-link navbar-linkitems" id="bingo-nav-sportsclubs" href="/sportsclub">Sportclubs</a>-->
                                    </li>
                                    <li class="nav-item" id="nav-item-account">
                                        <a :class="[currentPage == 'account' ? 'nav-link navbar-linkitems active' : 'nav-link navbar-linkitems']" @click="navToPage('/account')">Account</a>
                                        <!--<a class="nav-link navbar-linkitems" id="bingo-nav-carditems" href="/carditem">Kaart-items</a>-->
                                    </li>
                                    <li class="nav-item">
                                        <button v-if="!userIsPremium" type="button" class="btn btn-warning bingo-premium-btn" id="premium-button" name="premium" @click="addPremiumFeatures">Premium aanschaffen</button>
                                    </li>
                                </ul>
                                <button type="button" class="btn btn-danger bingo-danger-btn" id="logout-button" name="logout" @click="userLogout">Uitloggen</button>
                            </section>
                        </section>
                    </section>
                </nav>
            </section>
        </section>
    </section>
</template>

<style scoped>
@media screen and (max-width: 1400px)
{
    #offcanvas-bar-body {
        min-height: 4em !important;
    }

    @media screen and (min-width: 1251px)
    {
        .navbar-linkitems {
            margin-top: 0.75em;
        }
    }

    @media screen and (max-width: 1250px)
    {
        #nav-item-home, #nav-item-club, #nav-item-account {
            margin-top: 0.75em;
        }
    }

}

.navbar-linkitems:hover {
    cursor: pointer;
}

#premium-button {
    height: 100%;
}

.premium-text {
    font-size: 1.85em !important;
    font-weight: 500;
    font-family: Berlin Sans FB !important;
    padding: 0.5em !important;
    margin-bottom: 0.5rem !important;
}

#premium-success-text {
    color: #ffc107 !important;
}

#premium-error-text {
    color: #ff0000 !important;
}
</style>