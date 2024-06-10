<template>
     <q-page class="page-wrapper row items-stretch root">
    <!-- Left Card for DxfViewer -->
    <q-card class="col-auto" style="width: 1216px; height: 780px;">
      <q-card-section style=" height: 739px;">
        <slot></slot> <!-- Include the slot here -->
        <DxfViewer ref="viewer" :dxfUrl="dxfUrl" :fonts="fonts"
                   @dxf-loaded="_OnLoaded" @dxf-cleared="_OnCleared" @dxf-message="_OnMessage" />
      </q-card-section>
    </q-card>

    <!-- Center Card for LayersList -->
    <!-- <q-card class="col-auto" style="width: 300px;height: 780px; ">
      <q-card-section style="height: 780px;">
        <LayersList :layers="layers" @toggleLayer="_OnToggleLayer" @toggleAll="_OnToggleAll" />
      </q-card-section>
    </q-card> -->

    <!-- Right Card for DataTable -->
    <q-card class="col-auto" style="width: 700px;height: 780px;">
      <q-card-section style="height: 780px;">
        <DataTable v-if="uploadedFileContent" :uploadedFileContent="uploadedFileContent" :fileName="uploadedFile.name" @set-data="onSubmitDataTable"/>
      </q-card-section>
    </q-card>

   <connections style="height: 80px;" @submit-data="handleSubmitData" @save-request="handleSubmitData"   />
  </q-page>
  </template>
  
  <script>
  import DxfViewer from "@/components/DxfViewer";
  import { DxfViewer as _DxfViewer } from "dxf-viewer";
  import Vue from "vue";
  import mainFont from "@/assets/fonts/Roboto-LightItalic.ttf";
  import aux1Font from "@/assets/fonts/NotoSansDisplay-SemiCondensedLightItalic.ttf";
  import aux2Font from "@/assets/fonts/HanaMinA.ttf";
  import aux3Font from "@/assets/fonts/NanumGothic-Regular.ttf";
  import LayersList from "@/components/LayersList";
  import DataTable from "@/components/DataTable";
  import axios from 'axios';
import Connections from './Connections.vue';
  
  export default {
    name: "ViewerPage",
    components: { LayersList, DxfViewer, DataTable,Connections },
  
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
  this.$emit('file-loaded', this.uploadedFile.name);
      },
  handleSubmitData(data) {
      //Log the selected file name and table data in the console
      // console.log("working");
      this.$emit('submit-data', "save data");
    },
    onSubmitDataTable(data){
      // console.log("working");
      this.$emit('set-data', data);
      console.log("viewerpage set data", data);
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
      _OnMessage(e) {
        let type = "info";
        switch (e.detail.level) {
          case _DxfViewer.MessageLevel.WARN:
            type = "warning";
            break;
          case _DxfViewer.MessageLevel.ERROR:
            type = "negative";
            break;
        }
        this.$q.notify({ type, message: e.detail.message });
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
        const response = await axios.post('http://172.18.100.240:8989/parse_dxf/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Log the JSON data received from the backend
        // console.log('JSON Data from Backend:', response.data);

        // Assuming you want to do something with the received data, you can update the state or perform other actions here
        // For example, update the uploadedFileContent in your data
        this.uploadedFileContent = response.data;
        // console.log("Upppppp : ", this.uploadedFileContent);

      } catch (error) {
        console.error('Error uploading and parsing file:', error);
      }
    },
    handleDxfFileLoaded(data) {
            // Update uploadedFileContent when the DXF file is loaded
            this.uploadedFileContent = data;
        },
        handleFileSelected(file) {
      // Render the DXF file in the viewer
      // Assuming you have a method to render DXF files
      this.renderDxfFile(file);
    },
    renderDxfFile(blob) {
    // Assuming you have a reference to the DxfViewer component named "dxfViewer"
    // Load the DXF file content into the DxfViewer
    this.$refs.dxfViewer.Load(blob);
  }
    },
  
    created() {
      this.fonts = [mainFont, aux1Font, aux2Font, aux3Font];
      this.$parent.$on('file-selected', this.handleFileSelected);
    },
    beforeDestroy() {
    // Remove event listener to prevent memory leaks
    this.$parent.$off('file-selected', this.handleFileSelected);
  }
  };
  </script>
  
  <style scoped lang="less">

  
  .page-wrapper {
  width: 100%; /* Set width to fill the viewport */
  height: 90vh; /* Set height to fill the viewport height */
  overflow: hidden; /* Prevent scrolling */
}
  .root {
    .layersCol {
      border-left: #DBDBDB solid 1px;
    }
  }
  </style>
  