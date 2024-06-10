<template>
  <div class="data-table">
    <div v-if="uploadedFileContent && uploadedFileContent.length > 0">
      <table class="dimension-table">
        <thead>
          <tr>
            <th>Handle</th>
            <th>Actual Measurement</th>
            <th>Upper Tolerance</th>
            <th>Lower Tolerance</th>
            <th>Measured Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dim, index) in uploadedFileContent" :key="index" :class="{ 'selected-row': dim.handle === selectedHandle }" @click="handleRowClick(dim.handle)" ref="tableRows">
            <td>{{ dim.handle }}</td>
            <td>{{ dim.actual_measurement }}</td>
            <td>{{ dim.upper_tolerance }}</td>
            <td>{{ dim.lower_tolerance }}</td>
            <td>{{ dim.measured_value }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="onSubmitData" class="set-button">Set Data</button>
    </div>
    <div class="spacer"></div>
  </div>
</template>

<script>

export default {
  name: 'DataTable',
  props: {
    uploadedFileContent: Array,
    fileName: String
  },
  data() {
    return {
      selectedHandle: null,
      websocket: null // Store the WebSocket connection
    };
  },
  methods: {
    handleRowClick(handle) {
      this.selectedHandle = handle;
      this.$emit("handle-click", handle);
      this.$emit("handle-click-dxf", handle); // Emit a custom event for the DXF diagram
       // Log the entire row values in the console
       console.log('Selected Row:', handle);

      //ALL TABLE DATA VALUES
      // console.log('Entire Data Table:', this.uploadedFileContent);
    },
  //   onSubmitData() {
  //   // Update the measured value of the selected row
  //   this.uploadedFileContent.forEach(dim => {
  //     dim.measured_value = dim.handle === this.selectedHandle ? dim.measured_value : null;
  //   });

  //   // Emit event to save the data
  //   this.$emit('set-data', this.uploadedFileContent);
  //   console.log("DataTable set data :", this.uploadedFileContent);
  // },
 
  // onSubmitData() {
  //   // Filter out only the selected rows and emit their data
   
  //   const uploadedFileContent = this.uploadedFileContent.filter(row => row.measured_value !== null);
  //   this.$emit('set-data', uploadedFileContent);
  //   console.log("DataTable set data :", uploadedFileContent);
    
  // },

  onSubmitData() {
  // Filter out only the selected rows and emit their data
  const uploadedFileContent = this.uploadedFileContent.filter(row => row.measured_value !== null);
  
  // Set measured value to null for the remaining rows
  this.uploadedFileContent.forEach(row => {
    if (row.measured_value === undefined) {
      row.measured_value = 0;
    }
  });

  // Emit event with the data of selected rows
  this.$emit('set-data', uploadedFileContent);
  console.log("DataTable set data:", uploadedFileContent);
},
    updateMeasuredValue(data) {
      // Parse the message to extract the measured value and update the corresponding row
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
      this.websocket = new WebSocket(`ws://172.18.100.240:8989/ws/${handle}`);

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
  background-color: #2578d1;
  color: white;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.set-button:hover {
  background-color: #67aaee; /* Darken button color on hover */
  /* Add any additional styles for the hover effect */
}
</style>