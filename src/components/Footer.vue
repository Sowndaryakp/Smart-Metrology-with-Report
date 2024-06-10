<template>
    <footer class="footer">
      <div class="footer-content">
        <!-- Footer content goes here -->
        <p>&copy; 2024 Central Manufacturing Technology Institute. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    // Footer component logic can be added here
  }
  </script>
  
  <style scoped>
 .footer {
  position: fixed; /* Set position to fixed */
  bottom: 0; /* Align to the bottom of the viewport */
  left: 0; /* Align to the left of the viewport */
  width: 100%; /* Full width */
  background-color: #8ab7fa; /* Background color of the footer */
  color: #fff; /* Text color of the footer */
  padding: 20px; /* Padding around the footer content */
  z-index: 1000; /* Ensure footer appears above other content */
  /* height: 60px; */
}
  
  .footer-content {
    max-width: 1200px; /* Max width of the footer content */
    margin: 0 auto; /* Center the footer content horizontally */
    text-align: center; /* Center-align the text within the footer */
  }
  
  .footer p {
    margin: 0; /* Remove default margin for paragraphs */
  }
  </style>
  