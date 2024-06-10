<template>
    <div>
      <div>This is Pdf Component</div>
      <button @click="goToHome">Back</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToHome() {
        this.$router.push('/')
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  