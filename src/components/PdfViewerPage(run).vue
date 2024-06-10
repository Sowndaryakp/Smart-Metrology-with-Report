<template>
    <q-page class="page-wrapper row items-stretch root">
   <!-- Left Card for PdfViewer -->
   <q-card class="col-auto" style="width: 1216px; height: 780px;">
     <q-card-section style=" height: 739px;">
       <PdfViewer/>
     </q-card-section>
   </q-card>
   <q-card class="col-auto" style="width: 700px;height: 780px;">
     <q-card-section style="height: 780px;">
       <PdfDataTable v-if="uploadedFileContent" :uploadedFileContent="uploadedFileContent" :fileName="uploadedFile.name" @set-data="onSubmitDataTable" @save-request="handleSubmitData"  @dataToSubmit="handleEnteredValues"/>
     </q-card-section>
   </q-card>
  <connections :uploadedFileContentnew="this.filenamenew" style="height: 80px;"
  />
  </q-page>
  </template>
  
  <script>
  import PdfViewer from "@/components/PdfViewer";
  import { DxfViewer as _DxfViewer } from "dxf-viewer";
  import Vue from "vue";
  import LayersList from "@/components/LayersList";
  import PdfDataTable from "@/components/PdfDataTable";
  import axios from 'axios';
  import Connections from './Connections.vue';
  
  export default {
   name: "ViewerPage",
   components: { LayersList, PdfViewer, PdfDataTable,Connections },
  
   props: {
   dxfUrl: {
       type: String,
       uploadedFile: Object,
  
     },
   },
  
   data() {
     return {
       layers: null,
       fonts: [],
       uploadedFileContent: null, // Add a variable to hold uploaded file content
       filenamenew: "p1000",
       inspectionReportNumber: '', // Additional field
        projectNumber: '', // Additional field
        projectName: '', // Additional field
        group: '', // Additional field
        partNumber: '', // Additional field
        partName: '' // Additional field
        
     };
   },
  
   methods: {
     _OnLoaded() {
       const layers = this.$refs.viewer.GetViewer().GetLayers();
       layers.forEach((lyr) => Vue.set(lyr, "isVisible", true));
       this.layers = layers;
       const fileInput = document.querySelector('input[type="file"]'); // Assuming you have only one file input
  
  if (fileInput && fileInput.files.length > 0) {
   // Get the uploaded file data
   this.uploadedFile = fileInput.files[0];
  
  } else {
   console.error('No file uploaded or file input not found.');
  }
  this.uploadAndParseFile();
  this.$emit('dxf-file-loaded', this.uploadedFileContent);
  console.log("ViewerPage Selected filename:", this.uploadedFile.name);
  this.filenamenew = this.uploadedFile.name
  
  this.$emit('file-loaded', this.uploadedFile.name);
     },
  handleSubmitData(data) {
     //Log the selected file name and table data in the console
     // console.log("working");
     this.$emit('submit-data', data);
   },
   onSubmitDataTable(dataToSubmit){
    console.log(dataToSubmit);
      console.log('Data to be submitted:', dataToSubmit); // Add this line for debugging
      this.$emit('submit-data', dataToSubmit);
   },
  
   handleEnteredValues(data) {
      const dataToSubmit = {
      inspection_report_number: this.inspectionReportNumber,
      project_number: this.projectNumber,
      project_name: this.projectName,
      group: this.group,
      part_number: this.partNumber,
      part_name: this.partName,
      uploadedFileContent: data
      };
      console.log('Data to be submitted:', dataToSubmit); // Add this line for debugging
      this.$emit('submit-data', dataToSubmit);
      console.log('Entered values from DataTable:', dataToSubmit); // Ensure this line is correctly placed
  },
  
  
  
     _OnCleared() {
       this.layers = null;
       this.uploadedFileContent = ''; // Clear uploaded file content when cleared
     },
  
     _OnToggleLayer(layer, newState) {
       layer.isVisible = newState;
       this.$refs.viewer.GetViewer().ShowLayer(layer.name, newState);
     },
  
     _OnToggleAll(newState) {
       if (this.layers) {
         for (const layer of this.layers) {
           if (layer.isVisible !== newState) {
             this._OnToggleLayer(layer, newState);
           }
         }
       }
     },
     _handleDxfHandleClickDxf(handle) {
     // Change the color of the corresponding dimension in the DXF diagram
     this.$refs.viewer.GetViewer().ChangeDimensionColor(handle, "#ff0000");
   },
  
  
   _handleDataTableHandleClick(handle) {
     // Handle the click event from DataTable
     // For example, update the color of the clicked handle in the DxfViewer component
     this.$refs.viewer.GetViewer().ChangeHandleColor(handle, "#ff0000");
   },
  
         // Add a new function to handle file upload and send it to the backend
   async uploadAndParseFile() {
     const fileInput = document.querySelector('input[type="file"]');
     if (!fileInput || fileInput.files.length === 0) {
       console.error('No file uploaded or file input not found.');
       return;
     }
  
     const formData = new FormData();
     formData.append('file', fileInput.files[0]);
     try {
       // Send the file to the backend using Axios
       const response = await axios.post('http://172.18.100.240:9999/parse_dxf/', formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       });
       this.uploadedFileContent = response.data;
     } catch (error) {
       console.error('Error uploading and parsing file:', error);
     }
   },
  
   },
  };
  </script>
  
  <style scoped lang="less">
  
  
  </style>
  