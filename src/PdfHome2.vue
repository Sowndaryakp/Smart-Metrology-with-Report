<template>
    <div id="pdf-viewer">
      <input type="file" @change="openPdf" accept=".pdf">
      <input type="file" @change="openDwgDxf" accept=".dwg,.dxf">
      <canvas ref="canvas"></canvas>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dimension</th>
            <th>Upper Tolerance</th>
            <th>Lower Tolerance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dimension, index) in dimensions" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ dimension.value }}</td>
            <td>{{ dimension.upperTolerance }}</td>
            <td>{{ dimension.lowerTolerance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
//   import pdfjsLib from 'pdfjs-dist';
  
  export default {
    data() {
      return {
        pdfPath: '',
        pdfDocument: null,
        currentPage: null,
        coverRect: null,
        zoomFactor: 1.0,
        dimensions: []
      }
    },
    methods: {
      openPdf(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.pdfPath = e.target.result;
            this.renderPdf();
          };
          reader.readAsDataURL(file);
        }
      },
      openDwgDxf(event) {
        // Implement DWG/DXF file handling
      },
      renderPdf() {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');
        
        pdfjsLib.getDocument(this.pdfPath).promise.then(pdf => {
          this.pdfDocument = pdf;
          this.showPage(1); // Render first page
        });
      },
      showPage(pageNumber) {
        this.pdfDocument.getPage(pageNumber).then(page => {
          this.currentPage = page;
          const viewport = page.getViewport({ scale: 1 });
          const canvas = this.$refs.canvas;
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        });
      },
      // Implement other methods such as mouse event handlers, zooming, dimension extraction, etc.
    }
  }
  </script>
  
  <style>
  /* Add CSS styling */
  </style>
  