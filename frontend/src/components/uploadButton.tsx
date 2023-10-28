export default function UploadButton() {

   const handleButtonPress = () => {

   }

   return <>
      <button className="uploadButton" onClick={handleButtonPress}>
         <input type="file" name="file upload" id="fileUploadInput" />
         Upload
      </button>
   </>
}