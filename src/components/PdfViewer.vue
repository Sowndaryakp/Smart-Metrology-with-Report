<template>
    <div class="pdf-container">
      <div class="button-container">
        <input type="file" @change="handleFileChange" class="hidden" ref="fileInput" accept=".pdf">
        <button @click="$refs.fileInput.click()" class="select-pdf-btn"><img width="28" height="28" src="https://img.icons8.com/sf-black/64/FFFFFF/file.png" alt="file"/>Select PDF File</button>

        <div class="selected-file-container">
      <div v-if="selectedFileName" class="selected-file-container">
        Selected File: {{ selectedFileName }}
      </div>
    </div>
      </div>
      
      <div v-if="pdfUrl" class="pdf-preview">
        <div class="pdf-preview-inner">
          <embed :src="pdfUrl" type="application/pdf" class="pdf-embed">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
    selectedPdfFileName: String,
    pdfSelectedFile: String,
  },
    data() {
      return {
        pdfUrl: null,
        selectedFileName: null
      };
    },
    methods: {
      handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
          this.pdfUrl = URL.createObjectURL(file);
          this.selectedFileName = file.name; // Update selected file name
          this.$emit('pdf-file-selected', file.name); // Emit event with selected filenameselected filename
        } else {
          this.pdfUrl = null;
          alert('Please select a valid PDF file.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .pdf-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .button-container {
    display: flex;
    justify-content: space-between; /* Distribute items along the main axis */
    align-items: center;
    width: 100%;
  }
  
  .select-pdf-btn {
    background-color: #3490dc;
    color: #fff;
    font-weight: bold;
    padding: 0.3rem 1rem;
    border: none;
    border-radius: 0.25rem;
     /* padding: 0.5rem 1rem; Padding */
    margin: -0.5rem; /* Margin */
    cursor: pointer; /* Cursor on hover */
    font-family: 'Poppins', sans-serif; /* Font family */
    display: flex; /* Display as flex */
    align-items: center; /* Align items vertically */
  }
  
  .select-pdf-btn{
    background-color: #2980b9; 
  }
  .back-btn {
    background-color: #6c757d;
    color: #fff;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  /*align end and space*/
  /* .back-btn {
  background-color: #6c757d;
  color: #fff;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 1rem;
  align-self: flex-end;
} */
  
  .pdf-preview {
    margin-top: 1rem;
  }
  
  .pdf-preview-inner {
    background-color: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 1200px;
    height: 700px; /* Increase height as needed */
  }
  
  .pdf-embed {
    width: 100%;
    height: 100%;
  }
  </style>
  