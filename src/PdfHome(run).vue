<template>
    <q-layout view="hHh lpr fff" data-nosnippet>
      <q-header>
        <q-card style="background-color: white; color: black; height: 80px; display: flex; justify-content: center; align-items: center;">
          <!-- Set background color to white and text color to black -->
          <q-toolbar class="navbarContent">
            <div class="leftNav">
              <img src="./assets/images/cmti.png" alt="Logo" class="Logo" height="70" width="120" />
              <div class="button-container">
                <input type="file" @change="handleFileChange" class="hidden" ref="fileInput" accept=".pdf">
                <button @click="$refs.fileInput.click()" class="select-pdf-btn">Select PDF File</button>
                <!-- <button @click="goToHome" class="back-btn">Back</button> -->
                </div>
                <div class="q-pa-md q-gutter-sm" >
                  <q-btn push color="white" text-color="primary" label="Open" @click="openPreviousFiles"></q-btn>
              </div>
            </div>
            <div class="fileCenter">
              <q-toolbar-title :shrink="true" class="logoname">SMART METROLOGY</q-toolbar-title>
            </div>
            <button @click="goToHome" class="back-btn">Back</button>
            <div>
              <div class="user-icon" @click="openUserPopup">
                <img src="https://img.icons8.com/ios-glyphs/30/4D4D4D/user--v1.png" alt="User Icon" />
              </div>
            </div>
          </q-toolbar>
        </q-card>
      </q-header>
      <q-page-container classname="">
        <PdfViewerPage :dxfUrl="dxfUrl" @dxf-file-loaded="handleDxfFileLoaded" @submit-data="handleSubmitData" @set-data="onSubmitDataTable">
            
      <div v-if="inputFile === null" class="centralUploader row justify-center items-center">
        <div v-if="pdfUrl" class="pdf-preview">
        <div class="pdf-preview-inner">
          <embed :src="pdfUrl" type="application/pdf" class="pdf-embed">
        </div>
      </div>
        </div>
        </PdfViewerPage>
      </q-page-container>
  
      <div class="user-popup" v-if="isUserPopupOpen">
        <div class="user-info">
          <div class="user-details">
            <div class="username">CMTI</div>
            <div class="email">cmti@gmail.com</div>
          </div>
          <div class="user-actions">
            <button class="cancel-button" @click="closeUserPopup">Cancel</button>
            <button class="logout-button">Logout</button>
          </div>
        </div>
      </div>
      <q-dialog v-model="showPreviousFiles">
        <q-card>
          <q-card-section>
            <q-list>
              <q-item v-for="(file, index) in selectedFiles" :key="index">
                <q-item-section>
                  <q-item-label>{{ file.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn label="View" @click="viewPreviousFile(file)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-layout>
  </template>
  
  <script>
  import PdfViewerPage from "@/components/PdfViewerPage";
  import axios from 'axios';
  import { useRouter } from 'vue-router'
  
  export default {
    components: { PdfViewerPage },
  
    data() {
      return {
        selectedFileName: '',
        isUserPopupOpen: false,
      };
    },
  
    methods: {
        goToHome() {
        this.$router.push('/')
      },
      goToPdf() {
        this.$router.push('/pdf')
      },
      handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
          this.pdfUrl = URL.createObjectURL(file);
        } else {
          this.pdfUrl = null;
          alert('Please select a valid PDF file.');
        }
      },

    onSubmitDataTable(data){
      // console.log("newwww" ,data);
      this.tableData = data;
      console.log("tesssst");
      console.log("outerrrr set data", data);
    },
  
      handleDxfFileLoaded(data) {
    // Update uploadedFileContent when the DXF file is loaded
    this.uploadedFileContent = data;
  
    // Pass the loaded DXF file content to the ViewerPage component for rendering
    this.$refs.viewerPage.renderDxfFile(data); // Assuming a method called renderDxfFile exists in the ViewerPage component
  },
      openUserPopup() {
        this.isUserPopupOpen = true;
      },
      closeUserPopup() {
        this.isUserPopupOpen = false;
      },
      openPreviousFiles() {
    // Use Axios to fetch filenames from the backend endpoint
    axios.get('http://172.18.100.240:9999/dxf_files/')
        .then(response => {
          console.log("PREEEEEEEEEEEEEEEEEEEEEE")
              console.log(response.data.files)
              this.selectedFiles = response.data.files.map(file => ({
                    name: file,
                    
                }));
  
                // Toggle the flag to show the dialog/modal
                this.showPreviousFiles = true;
  
                console.log("dnmfvvvvvv")
                console.log(this.selectedFiles);
  
        })
        .catch(error => {
            // Handle errors if the request fails
            console.error('Error fetching filenames:', error);
            // Display an error message to the user
            this.$q.notify({
                type: 'negative',
                message: 'Failed to fetch filenames. Please try again.'
            });
        });
  },

  viewPreviousFile(file) {
    // Set the dxfUrl to the selected file's URL
    this.dxfUrl = file.url;
  
    // Save the selected file to browser storage
    this.saveToFileStorage(file);
  
    // Optionally, you may want to close the dialog/modal after selecting the file
    this.showPreviousFiles = false;
  
    // Fetch the file content using the URL
    fetch(this.dxfUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.blob();
  })
  .then(blob => {
    // Handle the fetched blob data
    console.log('Fetched blob data:', blob);
    this.$refs.viewerPage.renderDxfFile(blob); // Assuming a method called renderDxfFile exists in the ViewerPage component
  })
  .catch(error => {
    // Handle fetch errors
    console.error('Fetch error:', error.message);
    // Display an error message to the user
    this.$q.notify({
      type: 'negative',
      message: 'Error occurred: ' + error.message
    });
  });
  
  },
  
  saveToFileStorage(file) {
  // Retrieve previously saved files from storage
  const storedFiles = JSON.parse(localStorage.getItem('selectedFiles')) || [];
  
  // Check if the file name already exists in the list of selected files
  const isFileExists = storedFiles.some(savedFile => savedFile.name === file.name);
  
  // If the file name does not exist, add the selected file to the list of stored files
  if (!isFileExists) {
    storedFiles.push(file);
  }
  
  // Save the updated list of files to storage
  localStorage.setItem('selectedFiles', JSON.stringify(storedFiles));
  },
  
  
  loadFromStorage() {
    // Retrieve previously saved files from storage
    const storedFiles = JSON.parse(localStorage.getItem('selectedFiles')) || [];
    // Set the selectedFiles array to the stored files
    this.selectedFiles = storedFiles;
  },
  
},
  

  };
  </script>
  
  <style scoped lang="less">
  .navbarContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .leftNav {
    display: flex;
  }
  .logoname {
    font-family: "CustomFont2", Arial, sans-serif;
    margin-right: 400px;
    font-size: 40px;
  }
  .fileCenter {
    display: flex;
    align-items: center;
  }
  .centralUploader {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
    font-family: "CustomFont", Arial, sans-serif;
  }
 
  .user-popup {
    position: absolute;
    top: 100px; /* Adjust the top position as needed */
    right: 20px; /* Adjust the right position as needed */
    width: 200px; /* Set the width of the popup */
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000; /* Ensure the popup appears above other elements */
  }
  .user-info {
    padding: 10px;
  }
  .user-details {
    margin-bottom: 10px;
  }
  .username {
    font-weight: bold;
  }
  .user-actions {
    display: flex;
    justify-content: space-between;
  }
  .cancel-button,
  .logout-button {
    padding: 5px 10px;
    background-color: #ccc;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  .cancel-button:hover,
  .logout-button:hover {
    background-color: #bbb;
  }
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
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
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
    width: 1000px;
    height: 800px; /* Increase height as needed */
  }
  
  .pdf-embed {
    width: 100%;
    height: 100%;
  }
  </style>
  