<template>
    <q-layout view="hHh lpr fff" data-nosnippet>
      <q-header>
        <q-card style="background-color: white; color: black; height: 80px; display: flex; justify-content: center; align-items: center;">
          <!-- Set background color to white and text color to black -->
          <q-toolbar class="navbarContent">
            <div class="leftNav">
              <img src="./assets/images/cmti.png" alt="Logo" class="Logo" height="70" width="120" />
            </div>
            <div class="fileCenter">
              <q-toolbar-title :shrink="true" class="logoname">SMART METROLOGY</q-toolbar-title>
            </div>
            <div>
              <div class="user-icon" @click="openUserPopup">
                <img src="https://img.icons8.com/ios-glyphs/30/4D4D4D/user--v1.png" alt="User Icon" />
              </div>
            </div>
          </q-toolbar>
        </q-card>
      </q-header>
      <q-page-container classname="">
        <!-- <div class="q-pa-md q-gutter-sm">
            <q-btn push color="white" text-color="primary" label="PDF Viewer" @click="goToPdf"></q-btn>
        </div> -->

        <div class="q-pa-md q-gutter-sm">
            <q-btn push color="primary" text-color="white" label="DXF Viewer" @click="goToDxf"></q-btn>
        </div>

        <div class="q-pa-md q-gutter-sm">
            <q-btn push color="primary" text-color="white" label="PDF Viewer" @click="goToPdf"></q-btn>
        </div>
        <!-- <div class="q-pa-md q-gutter-sm">
            <q-btn push color="primary" text-color="white" label="PDF2 Viewer" @click="goToPdf2"></q-btn>
        </div> -->


      </q-page-container>

       <!-- to call  footer  -->
       <Footer/>
  
      <div class="user-popup" v-if="isUserPopupOpen">
        <div class="user-info">
          <div class="user-details">
            <div class="username">CMTI</div>
            <div class="email">cmti@gmail.com</div>
          </div>
          <div class="user-actions">
            <button class="cancel-button" @click="closeUserPopup">Cancel</button>
            <button class="logout-button">Logout</button>
          </div>
        </div>
      </div>
  
      <q-dialog v-model="showPreviousFiles">
        <q-card>
          <q-card-section>
            <q-list>
              <q-item v-for="(file, index) in selectedFiles" :key="index">
                <q-item-section>
                  <q-item-label>{{ file.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn label="View" @click="viewPreviousFile(file)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-layout>
  </template>
  
  <script>
  import ViewerPage from "@/components/ViewerPage";
  import Footer from "@/components/Footer";
  import axios from 'axios';
  import { useRouter } from 'vue-router'
  
  
  export default {
    components: { ViewerPage, Footer },
  
    data() {
      return {
        isUserPopupOpen: false,
      };
    },
  
    methods: {
        goToDxf() {
      this.$router.push('/dxf')
    },
        goToPdf() {
      this.$router.push('/pdf')
    },
    goToPdf2() {
      this.$router.push('/pdf2')
    },
      openUserPopup() {
        this.isUserPopupOpen = true;
      },
      closeUserPopup() {
        this.isUserPopupOpen = false;
      },
    },
  
  };
  </script>
  
  <style scoped lang="less">
  .navbarContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .leftNav {
    display: flex;
  }
  .logoname {
    font-family: "CustomFont2", Arial, sans-serif;
    // margin-right: 200px;
    font-size: 40px;
  }
  .fileCenter {
    display: flex;
    align-items: center;
  }
 
  .centralUploader {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
    font-family: "CustomFont", Arial, sans-serif;
  }
  .prevent-scrolling {
    overflow: hidden;
  }
  .user-popup {
    position: absolute;
    top: 100px; /* Adjust the top position as needed */
    right: 20px; /* Adjust the right position as needed */
    width: 200px; /* Set the width of the popup */
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000; /* Ensure the popup appears above other elements */
  }
  .user-info {
    padding: 10px;
  }
  .user-details {
    margin-bottom: 10px;
  }
  .username {
    font-weight: bold;
  }
  .user-actions {
    display: flex;
    justify-content: space-between;
  }
  .cancel-button,
  .logout-button {
    padding: 5px 10px;
    background-color: #ccc;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  .cancel-button:hover,
  .logout-button:hover {
    background-color: #bbb;
  }
  
  .q-page-container {
    display: flex;
    justify-content: center; /* Align items horizontally */
    align-items: center; /* Align items vertically */
    height: calc(100vh - 80px); /* Set height to fill remaining viewport space */
}
.q-page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 60px);
    /* Add background image properties */
    background-image: url('./assets/images/bg.jpg');
    // background-image: url('./assets/images/bbg.png');
    background-size: cover; /* Adjusts the size of the background image to cover the entire container */
    background-position: center; /* Centers the background image */
  }
  .q-btn {
    padding: 10px 15px; /* Adjust padding to increase button size */
    font-size: 16px; /* Adjust font size for better visibility */
  }
  </style>
  