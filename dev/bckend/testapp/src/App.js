import { tes_OCR, pdf_to_png, file_eval, translation } from "./process-utils";
import React, { useState } from 'react';
import './App.css';

function App() {
    const [imagePath, setImagePath] = useState(null);
    const [text, setText] = useState(null);

    const handleClick = async (event) => {
        const file = event.target.files[0];
        const fileType = file_eval(URL.createObjectURL(file));

        if (fileType === "application/pdf") {
            // Handle PDF conversion if needed
            const pdfImagePath = await pdf_to_png(URL.createObjectURL(file));
            setImagePath(pdfImagePath);
        } else {
            setImagePath(URL.createObjectURL(file));
        }

        try {
            const result = await tes_OCR(imagePath);
            let extractedText = result;
            setText(translation(extractedText));
            console.log(extractedText);
        } catch (err) {
            console.error("handleClick error: ", err);
        }
    };

    return (
        <div className="App">
            <main className="App-main">
                <h3>Upload:</h3>
                <img src={imagePath} className="App-image" alt="logo" />
                <h3>Extracted Text:</h3>
                <div className="text-box">
                    <p>{text}</p>
                </div>
                <input type="file" onChange={handleClick} />
            </main>
        </div>
    );
}

export default App;
