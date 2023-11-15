import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { tes_OCR, file_eval } from "../process-utils";

export default function UploadButton() {

   const sendParsedText = useAction(api.nodeEnvActions.userDocumentTextUpload);
   const [imagePath, setImagePath] = useState("");
   const [text, setText] = useState("");
   // Change user name in chatWindow.tsx too
   const [user, setUser] = useState("Danny")
   const [uploadButtonText, setUploadButtonText] = useState("Upload")

   function submitForm(e) {
      e.preventDefault()
      console.log(imagePath, "is the url")

      if (file_eval(imagePath) === "application/pdf") {
         console.log("ispdf");
      }

      if (imagePath == "") { return; }

      tes_OCR(imagePath).catch((err: Error) => {
         console.error("handleClick error: ", err);
      }).then((result: any) => {
         let text = result;
         // text = translation(text);
         console.log(text);
         sendParsedText({ text: text, user: user });
         setUploadButtonText("Uploaded")
         setTimeout(() => {
            setUploadButtonText("Upload")
         }, 2000)
      })
   }

   useEffect(() => {
      if (imagePath != "") {
         setUploadButtonText("Ready for upload")
      } else {
         setUploadButtonText("Upload")
      }
   }, [imagePath])

   return <>
      <div className="currentImgContainer">
         <p className="imageDescText">{imagePath ? "Preview for currently selected image" : "No image selected yet"}</p>
         <img src={imagePath ? imagePath : ""} className="fileImage" alt="" />
      </div>
      <div className="fileUploadContainer">
         <form action="submit" onSubmit={submitForm}>
            <div className="file-input-container">
               <input
                  type="file"
                  accept="image/png"
                  id="file-input"
                  className="file-input"
                  onChange={(event) => {
                     setImagePath(URL.createObjectURL(event.target.files![0]));
                  }}
               />
               <label htmlFor="file-input" className="buttonForUpload">Choose File</label>
            </div>
            <input type="submit" value={uploadButtonText} className="uploadButton" />
         </form>
      </div>
   </>
}