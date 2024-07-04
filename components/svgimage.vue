<!--<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        }
    },
    created() {
        const Image = defineAsyncComponent(() => import(`../assets/${this.$props.name}.svg`));
    },
    data() {
        return {
            //image: const,
            //Image: defineAsyncComponent(() => import(`../assets/${this.props.name}.svg?component`)),
        }
    }
});
</script>

<template>
    <img :src="Image">
  <Image />
</template>
-->


<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const ImageSvg = defineAsyncComponent(() => import(`../assets/${props.name.toLowerCase()}.svg?component`))
</script>

<template>
  <ImageSvg />
</template>