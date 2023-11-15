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
            <h2 className="mainHeader">Welcome to <span className="colorHeader">DocuQ</span></h2>
            <h3 className="uploadPhotoInfoText">Upload a photo to get started</h3>
            <h5><a className="uploadPhotoNotSureText" href="#infoCont">Not sure how it works?</a></h5>
         </div>
         <div className="mainContainer">
            <UploadButton></UploadButton>
            <ChatWindow></ChatWindow>
         </div>
         <div className="infoContainer" id="infoCont">
            <Box className="textDqscan" sx={{ margin: "20px", padding: "20px" }}>Welcome to DocuQment! This is a GPT-powered upload-and-retrieval service. What does this mean? You upload some documents of your choice and our service will extract the text from the image, store it in a database, and use it as context to answer your questions in the chat window above. If you've used ChatGPT before, it works similar to that but smarter as it's main job is to answer questions about your documents. Use cases range from summaries of legal documents to answering questions on homework.</Box>
         </div>
         <div className="footerContainer"></div>
      </>
   )
}

export default App
