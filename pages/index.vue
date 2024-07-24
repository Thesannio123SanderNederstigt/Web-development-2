<script lang="ts">

import { defineComponent } from "vue"
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import HomepageCategory from "@/components/homepagecategory.vue";

export default defineComponent({
    components: {
        Header,
        Footer,
        HomepageCategory,
    },
    data: () => ({
        categories: [0,1,2,3],
    }),
    beforeCreate() {
        if (this.$store.getToken === "") {
            this.$router.replace({ path: "/login" });
        } else if (this.$store.getToken != "") {
            this.$store.autoLogin();
        }
    },
    created() {
        this.$store.$state.currentPage = 'home';
    },
    methods: {
        goToPage(page: string)
        {
            this.$router.push(`${page}`);
        }
    }
});
</script>

<template>
    <body>
        <Header />
            <section class="container mt-5">
                <section class="row justify-content-md-center">
                    <section class="text-center mb-3">
				        <img src="@/assets/schaatsbingo-logo.svg" class="website-logo-image" alt="Schaatsbingo.nl Logo" width="250" height="240">
			        </section>
			        <h1 class="website-logo-text">Schaatsbingo.nl</h1>
                    <h2 class="text-center text-secondary mb-4 mt-4 website-logo-text">Kies een onderstaande categorie om naartoe te gaan</h2>

                    <section class="row gy-2 gy-xxl-2 mt-2 mb-5 flex-categories-container">
                        <HomepageCategory v-for="category in categories" :key="category" :category="category" @goToPage="goToPage" />
                    </section>
                </section>
            </section>
        <Footer />
    </body>
</template>

<style scoped>
body {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>