<!-- DwgViewer.vue -->
<template>
    <div>
      <!-- Render DWG viewer here -->
      <div ref="dwgViewerContainer"></div>
    </div>
  </template>
  
  <script>
  import { DwgViewer } from "dwg-viewer";
  
  export default {
    name: "DwgViewer",
    mounted() {
      // Initialize DWG viewer
      this.dwgViewer = new DwgViewer(this.$refs.dwgViewerContainer);
      // Add event listeners or any additional initialization logic
    },
    beforeDestroy() {
      // Destroy DWG viewer instance to prevent memory leaks
      this.dwgViewer.destroy();
    }
  };
  </script>
  