<template>
  <div class="outer-card">
    <div class="card-wrapper">
      <!-- First Card: DEVICE-ADDRESS -->
      <div class="custom-card">
        <div class="card-section">
          <div class="text-caption">DEVICE-ADDRESS</div>
          <div class="input-box">
            <select class="custom-select" v-model="selectedDevice" @change="fetchDeviceDetails">
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
            <button v-if="isConnected" class="btn" style="background-color: green;margin-right: 10px;width:150px; display: flex; align-items: center; justify-content: center;">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/share-2.png" alt="share-2"/>Connected
            </button>
            <button v-else class="btn" style="background-color: red;margin-right: 10px;width:150px; display: flex; align-items: center; justify-content: center;">
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/share-2.png" alt="share-2"/>Not Connected
            </button>
            <button class="btn" style="background-color: black; width: 150px; display: flex; align-items: center; justify-content: center;">
              <img width="18" height="18" src="https://img.icons8.com/ios-filled/50/FFFFFF/available-updates.png" alt="available-updates" style="margin-right: 5px;">
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      <!-- Export Button -->
      <div>
        <button class="export-btn" style="background-color: black; display: flex;align-items: center;justify-content: center;"><img width="24" height="24" src="https://img.icons8.com/sf-black/64/FFFFFF/export.png" alt="export"/>Export</button>
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
      isConnected: true,
    };
  },
  methods: {
    async fetchDeviceAddresses() {
      try {
        const response = await fetch("http://172.18.100.240:8989/devices");
        const data = await response.json();
        this.devices = data.devices;
      } catch (error) {
        console.log("Error fetching device addresses: ", error);
      }
    },
    async fetchDeviceDetails() {
  try {
    const response = await fetch(`http://172.18.100.240:8989/devices/${this.selectedDevice}`);
    const data = await response.json();
    console.log("Received device details:", data); // Log received data for debugging
    if (data && data.name) {
      this.deviceName = data.name;
      this.isConnected = true; // Assuming device is connected if name is available
    } else {
      this.deviceName = "Name Not Available";
      this.isConnected = false;
    }
  } catch (error) {
    console.log("Error fetching device details: ", error);
    this.deviceName = "Name Not Available";
    this.isConnected = false;
  }
}



  },
  mounted() {
    this.fetchDeviceAddresses();
  }
};
</script>
<style scoped>
.outer-card{
  /* border:10px; */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

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

.export-btn {
  width: 595px;
  height: 60px;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.custom-select {
  width: 100%; /* Make the dropdown full-width */
  padding: 8px; /* Add padding to the dropdown */
  border: 2px solid #000; /* Add border to the dropdown */
  border-radius: 3px; /* Add border-radius to the dropdown */
  background-color: #fff; /* Set background color of the dropdown */
  color: #000; /* Set text color of the dropdown */
}

</style>
