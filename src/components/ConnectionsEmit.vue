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
        <button class="save-btn" style="background-color: rgb(10, 151, 17);margin-right: 11px;width:110px; display: flex; align-items: center; justify-content: center;" @click="onSubmitData" >
          <img width="24" height="24" src="https://img.icons8.com/sf-black-filled/64/FFFFFF/save.png" alt="save"/>Save
        </button>
        <button class="export-btn" style="background-color: black;width:470px; display: flex; align-items: center; justify-content: center;">
          <img width="24" height="24" src="https://img.icons8.com/sf-black/64/FFFFFF/export.png" alt="export"/>Export
        </button>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      devices: [], // Store device addresses and names
      selectedDevice: '', // Store the selected device address
      deviceName: '', // Store the device name
      websocket: null, // WebSocket connection
    };
  },
  props: {
    uploadedFileContent: Array,
    selectedFileName: String,
  },
 methods: {
  async onSubmitData(soething) {
    this.$emit('save-request');
    try {
      // Emit custom event with selected file name and table data
      // console.log("cccccccccccccccccccccccc");
      this.$emit('submit-data', "save data");
    } catch (error) {
      console.error('Error submitting data:', error);
    }

      // try {
      //   const requestData = this.uploadedFileContent.map(item => ({
      //     handle: item.handle,
      //     actual_measurement: item.actual_measurement,
      //     upper_tolerance: item.upper_tolerance,
      //     lower_tolerance: item.lower_tolerance,
      //     measured_value: item.measured_value,
      //     dxf_filename: this.selectedFileName,
      //   }));

      //   const response = await fetch('http://172.18.100.240:8989/save-data/', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ data: requestData }),
      //   });

      //   if (response.ok) {
      //     console.log('Data saved successfully.');
      //   } else {
      //     console.error('Failed to save data.');
      //   }
      // } catch (error) {
      //   console.error('Error saving data:', error);
      // }
    },
    async onSelectDevice() {
      // Check if a device is selected
      if (this.selectedDevice) {
        try {
          // Make an HTTP POST request to the FastAPI endpoint
          const response = await fetch('http://172.18.100.240:8989/address', {
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
        const response = await fetch("http://172.18.100.240:8989/devices");
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

