<template>
    <div><!-- Your existing template code --></div>
  </template>
  
  <script>
  import jsPDF from 'jspdf';
  
  export default {
    methods: {
      downloadPdf() {
        // Generate and download the PDF
        const doc = new jsPDF();
        doc.text('CMTI', 10, 10);
        doc.save('cmti.pdf');
      }
    }
  }
  </script>
  