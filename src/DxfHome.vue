<template>
  <q-layout view="hHh lpr fff" data-nosnippet>
    <q-header>
      <q-card style="background-color: white; color: black; height: 80px; display: flex; justify-content: center; align-items: center;">
        <!-- Set background color to white and text color to black -->
        <q-toolbar class="navbarContent">
          <div class="leftNav">
            <img src="./assets/images/cmti.png" alt="Logo" class="Logo" height="70" width="120" />
            <q-file color="black" label-color="black" filled bottom-slots clearable dense :value="inputFile" label="Select file or drag here" style="max-width: 300px;" accept=".dxf" class="selectfile q-ml-xl"
            @input="_OnFileSelected" @clear="_OnFileCleared" >
              <template v-slot:before>
                <q-icon name="folder_open" color="black" />
              </template>
             <template v-slot:after>
                <q-btn dense flat label="URL" @click="urlDialog = true" />
              </template>
            </q-file>
              <!-- <div class="q-pa-md q-gutter-sm" >
                  <q-btn push color="white" text-color="primary" label="Open" @click="openPreviousFiles"></q-btn>
              </div> -->
              <!-- <div class="q-pa-md q-gutter-sm" >
                  <q-btn push color="white" text-color="primary" label="Pdf Viewer" @click="goToPdf"></q-btn>
              </div> -->
          </div>
          <div class="fileCenter">
            <q-toolbar-title :shrink="true" class="logoname">SMART METROLOGY</q-toolbar-title>
          </div>
          <button @click="goToHome" class="home-btn">Home</button>

          <div>
            <div class="info-icon" @click="openInfoPopup">
              <img width="32" height="32" src="https://img.icons8.com/glyph-neue/64/4D4D4D/info.png" alt="info"/>
            </div>
          </div>


          <div>
            <div class="user-icon" @click="openUserPopup">
              <img src="https://img.icons8.com/ios-glyphs/30/4D4D4D/user--v1.png" alt="User Icon" />
            </div>
          </div>
        </q-toolbar>
      </q-card>
    </q-header>
    <q-page-container classname="">
      <ViewerPage :dxfUrl="dxfUrl" @dxf-file-loaded="handleDxfFileLoaded" @submit-data="handleSubmitData" @set-data="onSubmitDataTable">
        <div v-if="inputFile === null" class="centralUploader row justify-center items-center">
          <div class="col-auto" style="width: 300px;">
            <q-file
              filled
              bottom-slots
              clearable
              :value="inputFile"
              label="Select file or drag here"
              accept=".dxf"
              class="col"
              @input="_OnFileSelected"
              @clear="_OnFileCleared"
            >
              <template v-slot:before>
                <q-icon name="folder_open" size="xl" />
              </template>
              <!-- <template v-slot:hint>
                            <span>File is processed locally in your browser</span>
                        </template> -->
            </q-file>
          </div>
          <div class="col-auto q-mx-lg q-pb-lg">
            <q-btn label="Load URL" @click="urlDialog = true" />
          </div>
        </div>
      </ViewerPage>
    </q-page-container>

    <div class="info-popup" v-if="isInfoPopupOpen">
      <div class="info-info">
        <div class="info-details">
          <p>We can accommodate and export DXF files in various versions, including <strong>R12, R2000, R2004, R2007, R2010, R2013,</strong> and <strong>R2018.</strong></p>

        </div>
        <div class="info-actions">
          <button class="cancel-button" @click="closeInfoPopup">Cancel</button>
        </div>
      </div>
    </div>

    <div class="user-popup" v-if="isUserPopupOpen">
      <div class="user-info">
        <div class="user-details">
          <div class="username">Central Manufacturing Technology Institute</div>
          <!-- <div class="email">cmti@gmail.com</div> -->
        </div>
        <div class="user-actions">
          <button class="cancel-button" @click="closeUserPopup">Cancel</button>
          <!-- <button class="logout-button">Logout</button> -->
        </div>
      </div>
    </div>


   

    <q-dialog v-model="urlDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6">Load URL</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="q-mb-lg">
            <a href="https://startpage.com/sp/search?q=SECTION%20HEADER%20filetype:dxf" target="_blank"
              >Find some examples</a
            >
          </div>
          <q-form @submit="_OnUrl" class="q-gutter-md" style="width: 400px;">
            <q-input filled v-model="inputUrl" label="Input URL here" bottom-slots>
              <template v-slot:hint>
                <span>Uses <a href="https://allorigins.win">AllOrigins</a> CORS proxy</span>
              </template>
            </q-input>
            <div>
              <q-btn label="Submit" type="submit" color="primary" v-close-popup />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
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
import ViewerPage from "@/components/ViewerPage";
import Connections from "@/components/Connections";
import axios from 'axios';
import { useRouter } from 'vue-router'

export default {
  components: { ViewerPage },

  data() {
    return {
      dxfUrl: null,
      selectedFileName: '',
      inputFile: null,
      isLocalFile: false,
      aboutDialog: false,
      urlDialog: false,
      inputUrl: null,
      uploadedFileContent: null,
      isUserPopupOpen: false,
      isInfoPopupOpen: false,
      selectedFiles: [], // Array to store information about previously selected files
      showPreviousFiles: false, // Flag to control visibility of the dialog/modal
      tableData:[],
      savingData: false
    };
  },

  methods: {
    goToHome() {
        this.$router.push('/');
        this.$router.go(0);
      },
    // goToPdf() {
    //   this.$router.push('/pdf')
    // },


    async _OnFileSelected(file) {
      if (!file) {
        console.log("No file selected");
        this._OnFileCleared();
        return;
      }
      console.log("from parent");
      console.log("Selected file:", file.name);
      this.selectedFileName = file.name;

      if (this.dxfUrl && this.isLocalFile) {
        URL.revokeObjectURL(this.dxfUrl);
      }
      this.isLocalFile = true;
      this.inputFile = file;
      
      // //FILENAME 
      // console.log("test");
      // console.log(this.inputFile.name);
      this.dxfUrl = URL.createObjectURL(file);

      // Add information about the selected file to the list of previous files
      this.selectedFiles.push({
        name: file.name,
        url: this.dxfUrl,
      });

      this.loadingTable = true;

      // Load table data asynchronously
      await this.loadTableData();

      // Hide loading indicator
      this.loadingTable = false;
    },

    //Saving to backend end point 
    async handleSubmitData(dataToSubmit) {
      // console.log("I am called dsfds");
      console.log("I am called dsfds", dataToSubmit.uploadedFileContent);
      let sampleData = dataToSubmit.uploadedFileContent.map(item =>  ({ ...item,
        "inspection_report_number": dataToSubmit.inspection_report_number,
         "project_number": dataToSubmit.project_number, 
        "project_name": dataToSubmit.project_name,
        "group": dataToSubmit.group,
        "part_number": dataToSubmit.part_number,
        "part_name": dataToSubmit.part_name,
        "dxf_filename": this.selectedFileName
      }));

      console.log("actual data", sampleData);
      if (this.savingData) {
            return; // Exit the function if data is already being saved
          }
      try {
        this.savingData = true;
        console.log("table",this.tableData);
        console.log(typeof(this.tableData));
        // Prepare the data to send based on the tableData
    //     const dataToSend = this.tableData.map(item => ({
    //       sl_no: item.sl_no,
    //       handle: item.handle,
    //       actual_measurement: item.actual_measurement,
    //       upper_tolerance: item.upper_tolerance,
    //       lower_tolerance: item.lower_tolerance,
    //       measured_value: item.measured_value,
    //       dxf_filename: this.selectedFileName,
    //       inspection_report_number: item.inspection_report_number || '', // Assign empty string if undefined
    // project_number: item.project_number || '', // Assign empty string if undefined
    // project_name: item.project_name || '', // Assign empty string if undefined
    // group: item.group || '', // Assign empty string if undefined
    // part_number: item.part_number || '', // Assign empty string if undefined
    // part_name: item.part_name || '' // Assign empty string if undefined
  
    //     }));
        console.log("APP DATA TO SEND ALL", sampleData);
        // Send the data to the backend endpoint using Axios
        const response = await axios.post('http://172.18.100.240:9999/save-data/', sampleData);
        console.log("RESPONSE : ", response)
        console.log('Data sent successfully');

    // Check response status
    if (response.status === 200) {
      // Log success message
      console.log('Data sent successfully');
      console.log('Response from server:', response.data);
      // Show success message to the user
      this.$q.notify({
        type: 'positive',
        message: 'Data saved successfully'
      });
    } else {
      // Show failure message to the user
      this.$q.notify({
        type: 'negative',
        message: 'Failed to save data. Please try again.'
      });
    }
    } catch (error) {
    // Log error message if the request fails
    console.error('Error sending data to server:', error);
    // Show failure message to the user
    this.$q.notify({
      type: 'negative',
      message: 'Error occurred while saving data. Please try again.'
    });
    } finally {
    // Reset the savingData flag after the save operation is completed or failed
    this.savingData = false;
    }
  },

  onSubmitDataTable(data){
    // console.log("newwww" ,data);
    this.tableData = data;
    console.log("tesssst");
    console.log("outerrrr set data", data);

  },
    async loadTableData() {
      // Your code to process the DXF file and generate table data
      // This code should be optimized for performance

      // For example:
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate table data
      this.tableData = this.generateTableData();
    },

    _OnFileCleared() {
      if (this.inputFile) {
        this.inputFile = null;
        URL.revokeObjectURL(this.dxfUrl);
        this.dxfUrl = null;
        this.$q.notify({
          type: "info",
          message: "File cleared",
        });
      }
    },

    _OnUrl() {
      if (this.inputUrl === null) {
        return;
      }
      const url = this.inputUrl.trim();
      if (url === "") {
        return;
      }
      if (this.dxfUrl && this.isLocalFile) {
        URL.revokeObjectURL(this.dxfUrl);
      }
      this.isLocalFile = false;
      this.inputFile = new File(["remote_file"], url, { type: "text/plain" });
      this.dxfUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
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
    openInfoPopup() {
      this.isInfoPopupOpen = true;
    },
    closeInfoPopup() {
      this.isInfoPopupOpen = false;
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

clearDxfUrl() {
  // Clear dxfUrl when closing the dialog/modal
  this.dxfUrl = null;
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

  created() {
    const aboutBlock = document.getElementById("about");
    this.aboutHtml = aboutBlock.innerHTML;
    aboutBlock.style.display = "none";
    /* For web crawler. */
    document.getElementById("noscript").innerText = aboutBlock.innerText;
    this.loadFromStorage();
  },
  destroyed() {
    if (this.dxfUrl) {
      URL.revokeObjectURL(this.dxfUrl);
    }
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
  // margin-left: 30px;
  font-size: 40px;
}
.fileCenter {
  display: flex;
  align-items: center;
}
a.github:hover {
  text-decoration: none;
}
.selectfile {
  font-family: "CustomFont", Arial, sans-serif;
  align-items: center;
  justify-items: center;
  margin-top: 14px;
  width: 270px;
}
.centralUploader {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  font-family: "CustomFont", Arial, sans-serif;
}
.prevent-scrolling {
  overflow: hidden;
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
.home-btn {
    background-color: #6c757d;
    color: #fff;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-left: 100px;
  }

  .info-popup {
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
.info-info {
  padding: 10px;
}
.info-details {
  margin-bottom: 10px;
}
.info {
  font-weight: bold;
}
.info-actions {
  display: flex;
  justify-content: space-between;
}
// .cancel-button,
// .logout-button {
//   padding: 5px 10px;
//   background-color: #ccc;
//   border: none;
//   border-radius: 3px;
//   cursor: pointer;
// }
// .cancel-button:hover,
// .logout-button:hover {
//   background-color: #bbb;
// }
</style>
