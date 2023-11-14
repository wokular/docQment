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
         <img
            src={imagePath} className="fileImage" alt="File for upload" />
      </div>
      <div className="fileUploadContainer">
         <form action="submit" onSubmit={submitForm}>
            {/* <button className="button-upload" onClick={handleClick}>
               Select a file
            </button> */}
            <input
               className="button-upload"
               type="file"
               accept="image/png"
               onChange={(event) => {
                  setImagePath(URL.createObjectURL(event.target.files![0]));
               }}
            />
            <input
               type="submit" value={uploadButtonText} className="uploadButton" />
         </form>
      </div>
   </>
}