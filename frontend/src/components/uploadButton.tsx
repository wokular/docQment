import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUploadFiles } from "./useUploadFilesAlex";
import { FormEvent, useRef, useState } from "react";
import { styled } from "@mui/material/styles"

const VisuallyHiddenInput = styled('input')({
   clip: 'rect(0 0 0 0)',
   clipPath: 'inset(50%)',
   height: 1,
   overflow: 'hidden',
   position: 'absolute',
   bottom: 0,
   left: 0,
   whiteSpace: 'nowrap',
   width: 1,
});

export default function UploadButton() {

   const generateUploadUrl = useMutation(api.functions.generateUploadUrl);
   const { startUpload } = useUploadFiles(generateUploadUrl);

   const imageInput = useRef<HTMLInputElement>(null);
   const hiddenFileInput = useRef(null);
   const [selectedImage, setSelectedImage] = useState<File | null>(null);

   async function handleSendImage(e: FormEvent) {
      e.preventDefault();

      // @ts-ignore
      if (selectedImage == null) {
         return;
      }
      const res = await startUpload([selectedImage]);
      console.log(res);


      // setSelectedImage(null);
      // imageInput.current!.value = "";
   }

   const handleClick = (event) => {
      hiddenFileInput.current.click();
   };

   return <>
      <div className="fileUploadContainer">
         <form action="submit" onSubmit={handleSendImage}>
            <button className="button-upload" onClick={handleClick}>
               Upload a file

            </button>
            <input
               type="file"
               accept="image/*"
               onChange={(event) => setSelectedImage(event.target.files![0])}
               ref={hiddenFileInput}
               style={{ display: 'none' }} // Make the file input element invisible
            />
            <input
               type="submit" value={"Upload"} className="uploadButton" />
         </form>
      </div>
   </>
}