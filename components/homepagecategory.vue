<script lang="ts">
import { defineComponent } from "vue";
import SvgImage from "~/components/svgimage.vue";
//import { SvgImage } from '@/components/svgimage.vue';


//import invulUrl from '@/assets/categorie-kaart-invullen.svg?component';

//import iconUrl from './my-icon.svg?url'

export default defineComponent({
    components: {
        SvgImage
        //invulUrl
    },
    props: {
        category: {
            type: Number,
            required: true,
        },
    },
    created() {
        this.setCategoryData(this.category);
    },
    data() {
        return {
            catName: 'NaN',
            catImage: 'NaN',
            catPage: 'NaN',
        }
    },
    methods: {
        setCategoryData(category: number){
            //switch om de return vars te setten (op basis van of category 0,1,2 of 3 is dus)
            switch(category)
            {
                case(0):
                    this.catName = 'Bingokaarten';
                    this.catImage = 'categorie-bingokaarten';
                    this.catPage = '/bingokaarten';
                    break;

                case(1):
                    this.catName = 'Kaart invullen';
                    this.catImage = 'categorie-kaart-invullen';
                    this.catPage = '/kaartInvullen';
                    break;

                case(2):
                    this.catName = 'Sportclubs';
                    this.catImage = 'categorie-sportclubs';
                    this.catPage = '/sportclubs';
                    break;

                case(3):
                    this.catName = 'Account';
                    this.catImage = 'categorie-account';
                    this.catPage = '/account';
                    break;
            }
        }
    },
    emits: ['goToPage'],
});
</script>

<template>
    <section class="col-12 col-md-6 col-lg-4 col-xxl-6 mb-3">
        <a class="anchor-tag" @click="$emit('goToPage', catPage)">
		    <section class="card text-center border-dark overflow-hidden">
			    <section class="card-body position-relative card-categories">
				    <figure class="m-0 p-0">
                        <SvgImage class="category-comp" :name="catImage" loading="lazy" :alt="catName + ' categorie'" type="image/svg+xml" />
                        <!--<invulUrl class="img-fluid" loading="lazy" :alt="catName + ' categorie'" /> -->
					    <!--<img class="img-fluid" loading="lazy" :src="`@/assets/${catImage.toLowerCase()}.svg`" :alt="catName + ' categorie'" width="172" type="image/svg+xml">--> <!--src="@/assets/categorie-kaart-invullen.svg"-->
					    <figcaption class="mb-0 mt-4 p-0">
					        <h4 class="categorie-text mb-2">{{ catName }}</h4>
					    </figcaption>
				    </figure>
			    </section>
		    </section>
	    </a>
    </section>
</template>

<style scoped>
.card-categories {
    background-color: #2d60b9 !important; 
    padding: 2rem !important;
}

.card-categories:hover {
    background-color: #002060!important
}

.categorie-text {
    font-family: 'Berlin Sans FB' !important;
    color: #ffffff !important;
    font-size: 2em !important;
}

/*.categorie-text:hover {
    color: #f7d012 !important;
}*/

.anchor-tag {
    text-decoration: none !important;
}

.anchor-tag:hover {
    cursor: pointer;
}

.card-categories:hover h4 {
    color: #f7d012 !important;
}

.category-comp {
    scale: 0.85;
    height: auto;
}

@media screen and (max-width: 1400px)
{
    @media screen and (min-width: 992px)
    {
        .category-comp {
            margin-left: -1em;
        }
    }
}
</style>