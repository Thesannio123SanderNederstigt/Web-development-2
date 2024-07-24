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