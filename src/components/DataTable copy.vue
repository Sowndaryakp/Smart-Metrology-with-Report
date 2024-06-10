<template>
  <div class="data-table">
    <div v-if="uploadedFileContent && uploadedFileContent.length > 0">
      <div class="heading">Actual-Measured Values</div>
      <table class="dimension-table">
        <thead>
          <tr>
            <th>Handle</th>
            <!-- <th>Dimension Text</th> -->
            <th>Actual Measurement</th>
            <th>Upper Tolerance</th>
            <th>Lower Tolerance</th>
            <th>Measured Value</th>
            <th>Deviation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dim, index) in uploadedFileContent" :key="index" :class="{ 'selected-row': dim.handle === selectedHandle }" @click="handleRowClick(dim.handle)">
            <td>{{ dim.handle }}</td>
            <!-- <td>{{ dim.dimension_text }}</td> -->
            <td>{{ dim.actual_measurement }}</td>
            <td>{{ dim.upper_tolerance }}</td>
            <td>{{ dim.lower_tolerance }}</td>
            <td>{{ dim.measured_value }}</td>
            <td>{{ dim.deviation }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="spacer">


</div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'DataTable',
  props: {
    uploadedFileContent: Array,
  },
  data() {
    return {
      selectedHandle: null,
    };
  },
  methods: {
    handleRowClick(handle) {
  this.selectedHandle = handle;
  this.$emit("handle-click", handle);
  this.$emit("handle-click-dxf", handle); // Emit a custom event for the DXF diagram
  console.log(handle);

  // Fetch measured value from the endpoint
  axios.get(`http://172.18.100.240:9999/measured_value/${this.selectedHandle}`)
    .then(response => {
      console.log(response);
      // Update the measured value of the selected row
      const selectedRow = this.uploadedFileContent.find(row => row.handle === this.selectedHandle);
      if (selectedRow) {
        selectedRow.measured_value = response.data; // Assuming the measured value is in the response data
      }
    })
    .catch(error => {
      console.error('Error fetching measured value:', error);
    });
},
    handleExport() {
      // Implement your export logic here
      console.log('Exporting data...');
    },

    
  },
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
.heading{
  font-size: 3vh;
  font-weight: bolder;
  text-align: center;
  font-family: 'CustomFont', Arial, sans-serif; 
}
.data-table {
  position: relative;
  max-width: 800px; /* Set maximum width */
  max-height: 710px; /* Set maximum height */
  overflow: auto; /* Enable scrolling */
  box-sizing: border-box;
  padding: 10px; /* Consolidate padding */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border: 2px;
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

.export-button {
  background-color: #007bff; /* Change button background color */
  color: white;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  border: none; /* Remove button border */
  border-radius: 5px; /* Add some border radius for a rounded look */
}

.export-button:hover {
  background-color: #0056b3; /* Darken button color on hover */
}
</style>