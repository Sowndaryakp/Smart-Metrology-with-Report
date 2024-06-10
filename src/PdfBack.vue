<template>
    <div class="pdf-container">
      <input type="file" @change="handleFileChange" class="hidden" ref="fileInput" accept=".pdf">
      <button @click="$refs.fileInput.click()" class="select-pdf-btn">Select PDF File</button>
      <button @click="goToHome" class="back-btn">Back</button>
      
      <div v-if="pdfUrl" class="pdf-preview">
        <div class="pdf-preview-inner">
          <embed :src="pdfUrl" type="application/pdf" class="pdf-embed">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        pdfUrl: null
      };
    },
    methods: {
      goToHome() {
        this.$router.push('/')
      },
      handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
          this.pdfUrl = URL.createObjectURL(file);
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
  
  .select-pdf-btn {
    background-color: #3490dc;
    color: #fff;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  /* .back-btn {
    background-color: #6c757d;
    color: #fff;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-top: 1rem;
  } */
  /* .back-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #6c757d;
  color: #fff;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
} */
.back-btn {
  background-color: #6c757d;
  color: #fff;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-left: auto; /* Pushes the button to the right */
}
  .pdf-preview {
    margin-top: 1rem;
  }
  
  .pdf-preview-inner {
    background-color: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 1000px;
    height: 800px; /* Increase height as needed */
  }
  
  .pdf-embed {
    width: 100%;
    height: 100%;
  }
  </style>
  