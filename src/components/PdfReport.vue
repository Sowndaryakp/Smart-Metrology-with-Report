<template>
  <div class="container">
    <div class="paper">
      <table ref="reportTable">
        <thead>
          <tr>
            <th colspan="2" style="width: 150px;height:70px;text-align: center; vertical-align: middle; font-size:20px;">Date-Time</th>
            <th colspan="4" style="width: 300px;height:70px;text-align: center; vertical-align: middle;font-size:20px">CMM Report</th>
            <th colspan="4" style="width: 100px;height:70px;"><img src="@/assets/images/cmti.png" alt="Logo" class="Logo" height="70" width="150" /></th>
          </tr>
        </thead>
        <tbody>
          
          <tr>
            <td colspan="2" style="width: 150px;height:50px;text-align: center; vertical-align: middle;"><b>INSPECTION REPORT NUMBER</b></td>
            <td colspan="2" style="width: 300px;height:50px;text-align: center; vertical-align: middle;font-size:20px"></td>
            <td colspan="2" style="width: 100px;height:50px;text-align: center; vertical-align: middle;"><b>PROJECT NAME</b></td>
            <td colspan="1" style="width: 90px;height:10px">VM4.5T III</td>
            <td colspan="1" style="width: 90px;height:10px">PAGE 2 OF 4 </td>
          </tr>
          <tr>
            <td colspan="2" style="width: 150px;height:50px;text-align: center; vertical-align: middle;"><b>PROJECT MANAGER</b></td>
            <td colspan="2" style="width: 300px;height:50px;text-align: center; vertical-align: middle;">181100200101</td>
            <td colspan="1" style="width: 100px;height:50px;text-align: center; vertical-align: middle;">GROUP</td>
            <td colspan="3" style="width: 100px;height:50px;text-align: center; vertical-align: middle;">B&C Assy</td>
          </tr>
          <tr>
            <td colspan="0" style="width: 150px;height:50px;text-align: center; vertical-align: middle; ">PART NUMBER</td>
            <td colspan="3" style="width: 300px;height:50px;text-align: center; vertical-align: middle;"></td>
            <td colspan="2" style="width: 100px;height:50px;text-align: center; vertical-align: middle;">PART NAME</td>
            <td colspan="2" style="width: 90px;height:10px"></td>
          </tr>
          <tr v-for="(row, rowIndex) in data.slice(0, 10)" :key="rowIndex">
            <td>{{ row[0] }}</td> <!-- Serial number -->
            <td>
              <input type="text" v-model="row[1]" @input="updateData(rowIndex, 1, $event.target.value)" style="width: 80px">
            </td>
            <td>
              <input type="text" v-model="row[2]" @input="updateData(rowIndex, 2, $event.target.value)" style="width: 80px">
            </td>
            <!-- Additional columns -->
            <td>
              <input type="text" v-model="row[3]" @input="updateData(rowIndex, 3, $event.target.value)" style="width: 70px">
            </td>
            <td>
              <input type="text" v-model="row[4]" @input="updateData(rowIndex, 4, $event.target.value)" style="width: 70px">
            </td>
            <td>
              <input type="text" v-model="row[5]" @input="updateData(rowIndex, 5, $event.target.value)" style="width: 70px">
            </td>
            <td>
              <input type="text" v-model="row[6]" @input="updateData(rowIndex, 6, $event.target.value)" style="width: 70px">
            </td>
            <td>
              <input type="text" v-model="row[7]" @input="updateData(rowIndex, 7, $event.target.value)" style="width: 70px">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="green-button" @click="downloadPDF">Download PDF</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        ["SI.NO", "Name", "Nominal Value", "Upper Tol", "Lower Tol", "Measured Value", "Diff", "Status"],
        ["20", "C Distance 1-2_Y"],
        ["21"],
        ["22"],
        ["21"],
        ["22"],
        ["21"],
        ["22"],
        ["21"],
        ["22"],
        ["21"],
        ["22"],
      ]
    };
  },
  methods: {
    downloadPDF() {
  import('jspdf-autotable')
    .then(({ default: autoTable }) => {
      import('jspdf').then(({ default: jsPDF }) => {
        const doc = new jsPDF();

        // Title
        doc.text("Report", 10, 10);

        const tableRows = [];
        const headers = this.$refs.reportTable.querySelectorAll('thead th');
        const rows = this.$refs.reportTable.querySelectorAll('tbody tr');

        // Add headers
        const headerRow = Array.from(headers).map(th => th.textContent);
        tableRows.push(headerRow);

        // Add rows
        rows.forEach(row => {
          const rowData = Array.from(row.children).map(td => td.textContent);
          tableRows.push(rowData);
        });

        // Generate table
        doc.autoTable({
          startY: 20,
          head: [headerRow],
          body: tableRows.slice(1)
        });

        // Convert image to base64
        const img = new Image();
        img.crossOrigin = "anonymous"; // Handle CORS issues
        img.src = "../src/assets/cmti.png"; // Change the path to the actual image file
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imgData = canvas.toDataURL('image/png');

          // Add image in the first row's last column
          doc.addImage(imgData, 'PNG', 270, 10, 150, 70); // Adjust the position and size as needed

          // Ensure the fourth row is always visible
          doc.setPage(1);

          doc.save('report.pdf');
        };
      });
    })
    .catch(error => {
      console.error("Error generating PDF:", error);
    });
},



    updateData(rowIndex, colIndex, value) {
      if (colIndex !== 0) { // Exclude serial number column
        this.$set(this.data[rowIndex], colIndex, value);
      }
    }
  }
};
</script>


<style scoped>
.container {
  height: 900px;
  max-width: 1000px; /* Adjust as needed */
  margin: 0 auto;
  padding: 20px;
}

.paper {
  width: 100%;
  height: auto;
  overflow-x: auto; /* Enable horizontal scrolling if the table exceeds the width */
}

table {
  border-collapse: collapse;
  width: 900px; /* Adjust as needed */
}

th, td {
  border: 2px solid black;
  padding: 2px;
  text-align: left;
  word-wrap: break-word; /* Ensure long text wraps within cells */
}

th {
  background-color: #f2f2f2;
}

input[type="text"] {
  width: 60px; /* Adjust as needed */
  border: none;
  outline: none;
}

button.green-button {
  background-color: green;
  height: 50px;
  width: 180px; /* Adjust width as needed */
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin: 10px;
}
</style>
