<template>
  <div class="container">
    <div class="paper">
      <table ref="reportTable">
        <thead>
          <tr>
            <th>INSPECTION REPORT</th>
            <th>PROJECT NUMBER</th>
            <th>PART NUMBER</th>
            <th>GROUP</th>
            <th>PROJECT NAME</th>
            <th>PART NAME</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
              <input v-model="data[index][cellIndex]" :disabled="index === 0">
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
        ["DATE-TIME", "CMM REPORT", "Logo"],
        ["SI.NO", "Upper Tol", "Lower Tol", "Measured Value", "Diff", "Status"],
        ["20", "C Distance 1-2_Y"],
        ["21"],
        ["29"],
        ["30", "C Distance 1-2_Y", "0", "0", "0", "0.2231"],
        ["31"],
      ]
    };
  },
  methods: {
    downloadPDF() {
      console.log("Download PDF button clicked");
      import('jspdf-autotable')
        .then(({ default: autoTable }) => {
          import('jspdf').then(({ default: jsPDF }) => {
            const doc = new jsPDF();
            doc.text("Report", 10, 10); // Title
            const tableRows = [];
            const headers = this.$refs.reportTable.querySelectorAll('thead th');
            const rows = this.$refs.reportTable.querySelectorAll('tbody tr');
            
            // Add headers
            const headerRow = Array.from(headers).map(th => th.textContent);
            tableRows.push(headerRow);

            // Add rows
            rows.forEach(row => {
              const rowData = Array.from(row.children).map(td => td.firstChild.value);
              tableRows.push(rowData);
            });

            // Generate table
            doc.autoTable({
              startY: 20,
              head: [headerRow],
              body: tableRows.slice(1)
            });
            doc.save('report.pdf');
          });
        })
        .catch(error => {
          console.error("Error generating PDF:", error);
        });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px; /* Adjust as needed */
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
  width: 100%;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}

button.green-button {
  background-color: green;
  height: 50px;
  width: 150px; /* Adjust width as needed */
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>
