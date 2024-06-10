<template>
  <div class="outer-card" >
    <div class="card-wrapper">
      <!-- First Card: DEVICE-ADDRESS -->
      <div class="custom-card">
        <div class="card-section">
          <div class="text-caption">DEVICE-ADDRESS</div>
          <div class="input-box">
            <select class="custom-select" v-model="selectedDevice" @change="onSelectDevice">
              <option value="" disabled>Select device address</option>
              <option v-for="device in devices" :value="device.address">{{ device.address }}</option>
            </select>
          </div>
          <button class="btn" style="background-color: black; width: 50px; display: flex; align-items: center; justify-content: center; margin-left:16px;" @click="refreshDeviceDetails">
              <img width="18" height="18" src="https://img.icons8.com/ios-filled/50/FFFFFF/available-updates.png" alt="available-updates" style="margin-right: 5px;">
             
            </button>
        </div>
      </div>
      
      <!-- Second Card: DEVICE-NAME -->
      <div class="custom-card">
        <div class="card-section">
          <div class="text-caption">DEVICE-NAME</div>
          <div class="input-box">
            <input class="custom-input" outlined placeholder="Device Name" v-model="deviceName" disabled/>
          </div>
        </div>
      </div>
      
      <!-- Third Card: STATUS -->
      <div class="custom-card">
        <div class="card-section">
          <div class="text-caption">STATUS</div>
          <div class="row items-center">
            <button class="btn" style="background-color: green;margin-right: 10px;width:150px; display: flex; align-items: center; justify-content: center;"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/share-2.png" alt="share-2"/>Connected</button>
            <button class="btn" style="background-color: black; width: 150px; display: flex; align-items: center; justify-content: center;" @click="refreshDeviceDetails">
              <img width="18" height="18" src="https://img.icons8.com/ios-filled/50/FFFFFF/available-updates.png" alt="available-updates" style="margin-right: 5px;">
              Refresh
            </button>
          </div>
        </div>
      </div>
      

      <!-- Export Button -->
      <div class="card-exp">
      <div class="row items-center">
         <!---Set data WORKING-->
        <!-- <button class="save-btn" style="background-color: rgb(10, 151, 17);margin-right: 11px;width:110px; display: flex; align-items: center; justify-content: center;" @click="onSubmitData" >
          <img width="24" height="24" src="https://img.icons8.com/sf-black-filled/64/FFFFFF/save.png" alt="save"/>Save
        </button> -->
        <!-- Inside the template section -->


        
<button @click="downloadPDF" class="save-btn" style="background-color: rgb(10, 151, 17); margin-right: 11px; width: 110px; display: flex; align-items: center; justify-content: center;">
  <img width="24" height="24" src="https://img.icons8.com/sf-black-filled/64/FFFFFF/save.png" alt="save"/>Save
</button>
        <button @click="exportToExcel" class="export-btn" style="background-color: black;width:470px; display: flex; align-items: center; justify-content: center;">
          <img width="24" height="24" src="https://img.icons8.com/sf-black/64/FFFFFF/export.png" alt="export"/>Export
        </button>
      </div>
    </div>
    </div>
    <div>
  </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import XLSX from 'xlsx';



export default {
  components: {
  },
  data() {
    return {
      devices: [], // Store device addresses and names
      selectedDevice: '', // Store the selected device address
      deviceName: '', // Store the device name
      websocket: null, // WebSocket connection
      // showChildComponent: false
    };
  },
  props: {
    uploadedFileContent: Array,
    selectedFileName: String,
    // fileName: String,
    uploadedFileContentnew:String
  },
 methods: {

  downloadPDF() {
    console.log("filenameeeeeeeeeee")
  console.log(this.uploadedFileContentnew)

  const endpoint = `http://172.18.100.240:9999/get-data/${encodeURIComponent(this.uploadedFileContentnew)}`;
  // Fetch data from the endpoint
  fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(data => {
      // Log the received data
      console.log('Data received from endpoint:', data);

      // Adjust the content variable to include status column in the table
// Adjust the content variable to include parameter values
let content = `<div><h1 style="font-size: 30px; font-weight: bold; margin-top: -35px;text-align: center;">Report</h1>`;
content += `<img src="@/assets/images/cmti.png" alt="Logo" class="Logo" height="70" width="120" style="position: absolute; top: 10px; right: 10px;" />`;
content += `<div>Inspection Report Number: ${this.inspection_report_number}</div>`;
content += `<div>Project Number: ${this.project_number}</div>`;
content += `<div>Project Name: ${this.project_name}</div>`;
content += `<div>Group: ${this.group}</div>`;
content += `<div>Part Number: ${this.part_number}</div>`;
content += `<div>Part Name: ${this.part_name}</div>`;
content += `<div>Status: ${this.status}</div>`;
content += `<div style=" display: flex; justify-content: space-between; align-items: center; margin-bottom: -40px;">
    <p>29-02-2024 12:38:19</p>
    <img src="@/assets/images/cmti.png" alt="Logo" class="Logo" height="70" width="120" />
</div>`;
content += `<div class="report-body" style="display: flex; margin-top: 10px;">
    <div class="report-section">
        <table class="table-data">
            <tr>
                <th class="table-data1">INSPECTION REPORT</th>
                <td><input type="text" placeholder="Enter inspection report"></td>
            </tr>
            <tr>
                <th>PROJECT NUMBER</th>
                <td><input type="text" placeholder="Enter project number">{{row.project_number }}</td>
            </tr>
            <tr>
                <th>PART NUMBER</th>
                <td><input type="text" placeholder="Enter part numer"></td>
            </tr>
            <tr>
                <th>STATUS</th>
                <td>${this.status}</td> <!-- Display status value -->
            </tr>
        </table>
    </div>

    <div class="report-section">
        <table>
            <tr>
                <th>GROUP</th>
                <td><input type="text" placeholder="Enter group"></td>
            </tr>
            <tr>
                <th>PROJECT NAME</th>
                <td><input type="text" placeholder="Enter project name"></td>
            </tr>
            <tr>
                <th>PART NAME</th>
                <td><input type="text" placeholder="Enter part name"></td>
            </tr>
        </table>
    </div>
</div>`;
content += `<div>Filename: ${this.uploadedFileContentnew}</div>`;
content += `<table style="border-collapse: collapse; width: 100%;" border="1" cellpadding="5">`;
content += `<thead><tr><th style="border: 1px solid #000; background-color: lightblue;">SNO</th>`;
content += `<th style="border: 1px solid #000; background-color: lightblue;">Handle</th>`;
content += `<th style="border: 1px solid #000; background-color: lightblue;">Measured Value</th>`; // New column
content += `<th style="border: 1px solid #000; background-color: lightblue;">Actual Measurement</th>`;
content += `<th style="border: 1px solid #000; background-color: lightblue;">Upper Tolerance</th>`;
content += `<th style="border: 1px solid #000; background-color: lightblue;">Lower Tolerance</th>`;
content += `<th style="border: 1px solid #000; background-color: lightblue;">Status</th></tr></thead>`; // Include status column header

content += `<tbody>`;
data.forEach(row => {
    content += `<tr><td style="border: 1px solid #000;">${row.sl_no}</td>`;
    content += `<td style="border: 1px solid #000;">${row.handle}</td>`;
    content += `<td style="border: 1px solid #000;">${row.measured_value}</td>`;
    content += `<td style="border: 1px solid #000;">${row.actual_measurement}</td>`;
    content += `<td style="border: 1px solid #000;">${row.upper_tolerance}</td>`;
    content += `<td style="border: 1px solid #000;">${row.lower_tolerance}</td>`;
    content += `<td style="border: 1px solid #000;">${row.status}</td></tr>`;
});
content += `</tbody></table></div>`;

// Generate and save PDF
const opt = {
    margin: 1,
    filename: `${this.uploadedFileContentnew}.pdf`, // Add filename to PDF
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
};
html2pdf().from(content).set(opt).save();


    })
    .catch(error => {
      console.error('Error fetching data from endpoint:', error);
    });
},




exportToExcel() {
      // Check if XLSX object is defined
      if (typeof XLSX !== 'undefined') {
        // Your existing code to fetch data and export to Excel
        // Make sure to include XLSX.utils and other XLSX functionality properly
      } else {
        console.error('XLSX library is not properly imported or initialized.');
      }
    },











  // Set data WORKING
  // async onSubmitData(something) {
  //   this.$emit('save-request');
  //   },
  downloadTablePdf() {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Add REPORT text
  doc.setFontSize(16);
  doc.text('REPORT', 10, 10);

  // Add logo (assuming you have a logo image)
  const logo = new Image();
  logo.src = 'path_to_your_logo_image';
  doc.addImage(logo, 'JPEG', 10, 20, 50, 50);

  // Add empty table (adjust the coordinates and size as needed)
  const columns = ['Column 1', 'Column 2', 'Column 3'];
  const rows = [
    ['Row 1 data 1', 'Row 1 data 2', 'Row 1 data 3'],
    ['Row 2 data 1', 'Row 2 data 2', 'Row 2 data 3'],
    // Add more rows as needed
  ];
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 80, // Adjust the starting Y position of the table
  });

  // Save the PDF file
  doc.save('report.pdf');
},

    async onSelectDevice() {
      // Check if a device is selected
      if (this.selectedDevice) {
        try {
          // Make an HTTP POST request to the FastAPI endpoint
          const response = await fetch('http://172.18.100.240:9999/address', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: this.selectedDevice }),
          });

          if (response.ok) {
            // HTTP request successful, do something if needed
            console.log('Device address sent successfully.');
          } else {
            // HTTP request failed
            console.error('Failed to send device address.');
          }
        } catch (error) {
          // An error occurred while making the HTTP request
          console.error('Error sending device address:', error);
        }
      }
    },
    async fetchDeviceDetails() {
      try {
        // Fetch all device details
        const response = await fetch("http://172.18.100.240:9999/devices");
        const data = await response.json();
        // console.log("Received device details:", data);

        if (data && data.devices && data.devices.length > 0) {
          // Store the device details in the devices array
          this.devices = data.devices;

          // Find the selected device object
          const selectedDevice = this.devices.find(device => device.address === this.selectedDevice);

          // Check if the selected device is found
          if (selectedDevice) {
            // Update the deviceName variable with the name of the selected device
            this.deviceName = selectedDevice.name || "Name not available";
          } else {
            this.deviceName = "Name not available";
          }
        } else {
          console.log("No devices received from the server.");
        }
      } catch (error) {
        console.log("Error fetching device details: ", error);
        this.deviceName = "Name not available";
      }
    },
    refreshDeviceDetails() {
      // Fetch device details when the Refresh button is clicked
      this.fetchDeviceDetails();
    }
  },
  mounted() {
    // Fetch initial device details
    this.fetchDeviceDetails();
  }
};
</script>

<style scoped>
.outer-card{
  /* border:10px; */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  margin-bottom: 8px;
  
}
.page-wrapper {
  width: 100%; /* Set width to fill the viewport */
  height: 100vh; /* Set height to fill the viewport height */
  overflow: hidden; /* Prevent scrolling */
}
.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-right: 30px;
  font-family: 'CustomFont', Arial, sans-serif;
  border: 2px;
  margin-top: 14px;
}
.custom-card {
  width: 414px;
  margin-bottom: 10px; /* Add margin to create space between cards */
  margin-right: 17px; 
  border: 1px solid #ccc;
  border-radius: 5px;
}
.card-section {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 10px;
}
.text-caption {
  font-weight: bold;
  margin-right: 10px;
}
.custom-input {
  border: 2px solid #000;
  border-radius: 3px;
  width: 100%; /* Set input width to 100% */
}
.btn {
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
.btn:hover {
  opacity: 0.8; /* Reduce opacity on hover */
}
.export-btn {
  width: 430px;
  height: 60px;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
.export-btn:hover {
  opacity: 0.8; /* Reduce opacity on hover */
  background-color: #a5a0a0;
}
.save-btn {
  width: 80px;
  height: 60px;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
.save-btn:hover {
  opacity: 0.6; /* Reduce opacity on hover */
  background-color: rgb(181, 233, 181);
}
.custom-select {
  width: 100%; /* Make the dropdown full-width */
  padding: 8px; /* Add padding to the dropdown */
  border: 2px solid #000; /* Add border to the dropdown */
  border-radius: 3px; /* Add border-radius to the dropdown */
  background-color: #fff; /* Set background color of the dropdown */
  color: #000; /* Set text color of the dropdown */
}

.card-exp{
  /* margin-bottom: 20px; */
}
</style>

