<template>
  <div>
    <div class="flex justify-center items-center">
      <Title />
    </div>

    <div class="relative ">


      <one class=" absolute z-40 scale-110 -translate-y-10" />
      <tow class=" absolute z-30 scale-100 translate-y-6" /> 
      <three class=" absolute z-20 scale-90 translate-y-20" />
      <four class=" absolute z-10 scale-90 " />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import one from './card/one.vue'
import tow from './card/tow.vue'
import three from './card/three.vue'
import four from './card/four.vue'
import Title from './title.vue'


</script>
