<template>
    <div class="data-table">
      <div class="report-header">
        <p>29-02-2024 12:38:19</p>
        <h4>REPORT</h4>
        <img src="@/assets/images/cmti.png" alt="Logo" class="Logo" height="70" width="120" />
      </div>
      <div class="report-body">
    <div class="report-section">
      <table class="table-data">
        <tr>
          <th class="table-data1">INSPECTION REPORT</th>
          <td><input type="text" v-model="inspection_report_number" placeholder="Enter inspection report"></td>
        </tr>
        <tr>
          <th>PROJECT NUMBER</th>
          <td><input type="text" v-model="project_number" placeholder="Enter project number"></td>
        </tr>
        <tr>
          <th>PART NUMBER</th>
          <td><input type="text" v-model="part_number" placeholder="Enter part numer"></td>
        </tr>
      </table>
    </div>
  
    <div class="report-section">
      <table>
        <tr>
          <th>GROUP</th>
          <td><input type="text" v-model="group" placeholder="Enter group"></td>
        </tr>
        <tr>
          <th>PROJECT NAME</th>
          <td><input type="text" v-model="project_name" placeholder="Enter project name"></td>
        </tr>
        <tr>
          <th>PART NAME</th>
          <td><input type="text" v-model="part_name" placeholder="Enter part name"></td>
        </tr>
      </table>
    </div>
  </div>
  
      <div v-if="uploadedFileContent && uploadedFileContent.length > 0">
        <table class="dimension-table">
          <thead>
            <tr class="header">
              <th>Sl No</th>
              <!-- <th>Handle</th> -->
              <th>Actual Measurement</th>
              <th>Upper Tolerance</th>
              <th>Lower Tolerance</th>
              <th>Measured Value</th>
              <th>Status</th>
              <th>Actions</th> 
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dim, index) in uploadedFileContent" :key="index" :class="{ 'selected-row': dim.handle === selectedHandle }" @click="handleRowClick(dim.handle)" @dblclick="editRow(index)" ref="tableRows">
              <td>
                <span v-if="!dim.editing">{{ dim.sl_no }}</span>
                <input v-else v-model="dim.sl_no" type="text">
              </td>
              <!-- <td>
                <span v-if="!dim.editing">{{   }}</span>
                <input v-else v-model="dim.handle" type="text">
              </td> -->
              <td>
                <span v-if="!dim.editing">{{ dim.actual_measurement }}</span>
                <input v-else v-model="dim.actual_measurement" type="text">
              </td>
              <td>
                <span v-if="!dim.editing">{{ dim.upper_tolerance }}</span>
                <input v-else v-model="dim.upper_tolerance" type="text">
              </td>
              <td>
                <span v-if="!dim.editing">{{ dim.lower_tolerance }}</span>
                <input v-else v-model="dim.lower_tolerance" type="text">
              </td>
              <td>
                <span v-if="!dim.editing">{{ dim.measured_value }}</span>
                <input v-else v-model="dim.measured_value" type="text">
              </td>
              <td>
                <span v-if="!dim.editing">{{ dim.status }}</span> <!-- Display status when not editing -->
                <input v-else v-model="dim.status" type="text"> <!-- Input field for editing status -->
              </td>
              <td>
                <button v-if="!dim.editing" @click="editRow(index)" class="edit-button">Edit</button>
                <button v-else @click="saveEditedRow(index)" class="save-button">Save</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="onSubmitData" class="set-button">
          <img class="set-img" width="28" height="24" src="https://img.icons8.com/sf-black-filled/64/FFFFFF/save.png" alt="save"/>
          Set Data
        </button>
      </div>
      <div class="spacer"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DataTable',
    props: {
      uploadedFileContent: Array,
      fileName: String,
      inspection_report_number: String, // New props
      project_number: String, // New props
      project_name: String, // New props
      group: String, // New props
      part_number: String, // New props
      part_name: String // New props
      
    },
    data() {
      return {
        selectedHandle: null,
        websocket: null, // Store the WebSocket connection,
        inspection_report_number: String, // New props
        project_number: String, // New props
        project_name: String, // New props
        group: String, // New props
        part_number: String, // New props
        part_name: String // New props
      };
    },
    methods: {
      handleRowClick(handle) {
        this.selectedHandle = handle;
        this.$emit("handle-click", handle);
        this.$emit("handle-click-dxf", handle); // Emit a custom event for the DXF diagram
      },
  
      editRow(index) {
        this.$set(this.uploadedFileContent[index], 'editing', true);
      },
  
      saveEditedRow(index) {
        this.$set(this.uploadedFileContent[index], 'editing', false);
      },
  
      onSubmitData() {
        const dataToSubmit = {
          inspection_report_number: this.inspection_report_number,
          project_number: this.project_number,
          project_name: this.project_name,
          group: this.group,
          part_number: this.part_number,
          part_name: this.part_name,
          uploadedFileContent: this.uploadedFileContent
        };
        this.$emit('submit-data', dataToSubmit);
        console.log("DataTable ALL data Comming ", dataToSubmit);
        // Filter out only the selected rows and emit their data
        const uploadedFileContent = this.uploadedFileContent.filter(row => row.measured_value !== null);
        // Set measured value to null for the remaining rows
        this.uploadedFileContent.forEach(row => {
          if (row.measured_value === undefined) {
            row.measured_value = 0;
          }
        });
        // Emit event with the data of selected rows
        this.$emit('set-data', dataToSubmit);
        this.$emit('save-request');
        console.log("DataTable set data:", uploadedFileContent);
        console.log("SETTING THE DATA");
      },
      updateMeasuredValue(data) {
        const handleValuePair = data.split(',').map(item => item.trim());
        const handle = handleValuePair.find(pair => pair.startsWith('Handle')).split(':')[1].trim();
        const measuredValue = handleValuePair.find(pair => pair.startsWith('measured_value')).split(':')[1].trim();
        // Find the index of the selected row
        const selectedIndex = this.uploadedFileContent.findIndex(row => row.handle === handle);
        if (selectedIndex !== -1) {
          // Update the measured_value in the uploadedFileContent
          this.uploadedFileContent[selectedIndex].measured_value = measuredValue;
          // Use the ref to update the corresponding row in the table
          const selectedRow = this.$refs.tableRows[selectedIndex];
          if (selectedRow) {
            selectedRow.cells[4].textContent = measuredValue; // Assuming measured_value is the 5th column
          }
        }
      },
      handleDxfFileLoaded(data) {
        // Update uploadedFileContent when the DXF file is loaded
        this.uploadedFileContent = data;
      },
      initializeWebSocket(handle) {
        if (this.websocket) {
          this.websocket.close();
        }
        // WebSocket connection to send the selected handle to the backend
        this.websocket = new WebSocket(`ws://172.18.100.240:9999/ws/${handle}`);
        // Handle WebSocket events
        this.websocket.onopen = () => {
          console.log("WebSocket connection opened");
        };
        this.websocket.onclose = () => {
          console.log("WebSocket connection closed");
        };
        this.websocket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
        this.websocket.onmessage = (event) => {
          // Update the measured value when new data is received
          this.updateMeasuredValue(event.data);
        };
      }
    },
    watch: {
      selectedHandle(newHandle) {
        if (newHandle) {
          this.initializeWebSocket(newHandle);
        }
      }
    },
    mounted() {
    // Initialize uploadedFileContent with empty "status" property for each item
    this.uploadedFileContent = this.uploadedFileContent.map(item => ({
      ...item,
      status: "" // Add status parameter with an empty value
    }));
  }
  };
  </script>
  
  <style scoped>
  @font-face {
      font-family: 'CustomFont'; /* Specify the name of your font */
      src: url('../assets/fonts/Montserrat-SemiBold.ttf') format('truetype'); /* Adjust the path to your font file */
      /* You can include additional font variations (e.g., bold, italic) if available */
  }
  @font-face {
      font-family: 'CustomFont2'; /* Specify the name of your font */
      src: url('../assets/fonts/Designer.otf') format('opentype'); /* Adjust the path to your font file */
      /* You can include additional font variations (e.g., bold, italic) if available */
  }
  @font-face {
      font-family: 'CustomFont3'; /* Specify the name of your font */
      src: url('../assets/fonts/StretchPro.otf') format('opentype'); /* Adjust the path to your font file */
      /* You can include additional font variations (e.g., bold, italic) if available */
  }
  .data-table {
    position: relative;
    max-width: 800px;
    max-height: 710px;
    overflow: auto;
    box-sizing: border-box;
    padding: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-family: 'CustomFont', Arial, sans-serif;
  }
  
  .dimension-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .dimension-table th,
  .dimension-table td {
    border: 1px solid #ccc;
    padding: 8px;
  }
  
  .dimension-table th {
    background-color: #f2f2f2;
  }
  
  .dimension-table tr.selected-row {
    background-color: rgb(92, 160, 192);
  }
  
  .set-button {
    background-color: #25d13c;
    color: white;
    padding: 8px 16px;
    margin-top: 10px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    width: 140px;
    height: 50px;
  }
  
  .set-button:hover {
    background-color: #67aaee;
  }
  
  .dimension-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; /* Add this line to ensure fixed table layout */
  }
  
  .dimension-table th,
  .dimension-table td {
    border: 1px solid #ccc;
    padding: 9px;
    overflow: hidden; /* Add this line to prevent content overflow */
  }
  
  .edit-button {
    background-color: #06ccfd; /* Green */
    color: white;
    border: none;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    transition-duration: 0.4s;
    cursor: pointer;
  }
  
  .edit-button:hover {
    background-color: #4592a0; /* Darker Green */
  }
  
  .save-button {
    background-color: #06ba00; /* Blue */
    color: white;
    border: none;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    transition-duration: 0.4s;
    cursor: pointer;
  }
  
  .save-button:hover {
    background-color: #0077A3; /* Darker Blue */
  }
  
  .header{
    background-color: #85d6f3;
  }
  
  #inspection-report {
    font-family: Arial, sans-serif;
    width: 100%;
  }
  
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
    padding: 5px;
  }
  
  th {
    text-align: left;
  }
  
  #cmm-report {
    font-family: Arial, sans-serif;
    width: 100%;
  }
  
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -30px;
    margin-bottom: -60px;
  }
  
  
  .report-body {
    display: flex;
    margin: 18px 2px ;
  }
  
  
  /*giving space between the left and right
  /* .report-section {
    flex: 1;
    margin-right: 20px; 
  } */
  
  .report-section:last-child {
    margin-right: 0; /* Remove margin from the last section to prevent extra space */
  }
  
  .report-section table {
    width: 100%; /* Ensure the table fills the available space */
  }
  
  .report-section th {
    text-align: left;
  }
  
  .report-section input {
    width: calc(100% - 6px); /* Adjust input width considering padding and borders */
    padding: 6px;
    box-sizing: border-box;
  }
  .report-body tr:nth-child(odd) {
    background-color: #f2f2f2;
  }
  </style>
  