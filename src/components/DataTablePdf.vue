<template>
  <div >
    <button @click="downloadPDF">Download PDF</button>
    <table >
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Email</th>
          <th>Name</th>
          <th>Age</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(person, index) in persons" :key="index">
          <td>{{ person.name }}</td>
          <td>{{ person.age }}</td>
          <td>{{ person.email }}</td>
          <td>{{ person.name }}</td>
          <td>{{ person.age }}</td>
          <td>{{ person.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      persons: [
        { name: 'John Doe', age: 30, email: 'johndoe@example.com' },
        { name: 'Jane Smith', age: 25, email: 'janesmith@example.com' },
        // ... add more persons if needed
      ],
    };
  },
  methods: {
    async downloadPDF() {
      const table = document.querySelector('table');

      try {
        const canvas = await html2canvas(table, { scale: 1 }); // Adjust scale for better quality (optional)
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('table.pdf'); // Adjust filename if desired

        console.log('PDF downloaded successfully!');
      } catch (error) {
        console.error('Error downloading PDF:', error);
        // Handle errors gracefully, e.g., display an error message to the user
      }
    },
  },
};
</script>