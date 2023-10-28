import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUploadFiles } from "./useUploadFilesAlex";
import { FormEvent, useRef, useState } from "react";

export default function UploadButton() {

   const generateUploadUrl = useMutation(api.functions.generateUploadUrl);
   const saveStorageId = useMutation(api.functions.saveStorageId);
   const { startUpload } = useUploadFiles(generateUploadUrl);

   const imageInput = useRef<HTMLInputElement>(null);
   const [selectedImage, setSelectedImage] = useState<File | null>(null);

   async function handleSendImage(e: FormEvent) {
      e.preventDefault();

      // @ts-ignore
      const res = await startUpload([selectedImage]);
      console.log(res);

      // await use(generateUploadUrl, selectedImage)

      // setSelectedImage(null);
      // imageInput.current!.value = "";
   }

   return <>
      <form onSubmit={handleSendImage}>
         <input type="file" accept="image/*" name="file upload" id="fileUploadInput" ref={imageInput} onChange={(event) => setSelectedImage(event.target.files![0])} />
         <input
            type="submit"
            value="Upload Image"
            disabled={selectedImage === null}
         />
      </form>
   </>
}