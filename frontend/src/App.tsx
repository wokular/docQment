import { useState } from 'react'
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
         <div className="infoContainer" id="infoCont"></div>
         <div className="footerContainer"></div>
      </>
   )
}

export default App
