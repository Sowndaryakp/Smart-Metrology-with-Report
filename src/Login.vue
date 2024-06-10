<template>
    <div>
      <button @click="loadDxf">DXF</button>
      <button @click="loadPdf">PDF</button>
      <component :is="currentComponent" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  // import Home from '@/Home.vue';
  // import Home2 from '@/Home2.vue';
  
  const currentComponent = ref(null);
  
  const loadDxf = () => {
    currentComponent.value = Home;
  };
  
  const loadPdf = () => {
    currentComponent.value = Home2;
  };
  </script>
  
  <style scoped>
  /* Add your scoped styles here */
  </style>
  