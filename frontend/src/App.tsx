import { useState } from 'react'
import { Box } from '@mui/material';
import './App.css'
import './components/chatWindow.css'

import UploadButton from './components/uploadButton';
import ChatWindow from './components/chatWindow';

function App() {

   return (
      <>
         <div className="headerContainer">
            <h1 className="mainHeader">Welcome to <span className="colorHeader">DocuQ</span></h1>
            <h3 className="uploadPhotoInfoText">Upload a photo to get started</h3>
            <a className="uploadPhotoNotSureText" href="#infoCont">Not sure how it works?</a>
         </div>
         <div className="mainContainer">
            <UploadButton></UploadButton>
            <ChatWindow></ChatWindow>
         </div>
         <div className="infoContainer" id="infoCont">
            <Box className="textDqscan" sx={{ margin: "20px", padding: "20px" }}>Welcome to DocuQ! As a web based development  we aim to help users understand documents by uploading pictures.Upload a document down below and feel free to ask our chatbot about your document.</Box>
         </div>
         <div className="footerContainer"></div>
      </>
   )
}

export default App
