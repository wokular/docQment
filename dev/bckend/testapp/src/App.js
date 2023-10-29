import { tes_OCR, pdf_to_png, file_eval } from "./process-utils";
import React, { useEffect, useState } from 'react';
import './App.css';

function App () {
    const [imagePath, setImagePath] = useState(null);
    const [text, setText] = useState(null);

    const handleChange = (event) => {
        setImagePath(URL.createObjectURL(event.target.files[0]));
    }

    const handleClick = () => {
        console.log(file_eval(imagePath));
        const result = tes_OCR(imagePath)
        .catch(err => {
            console.error("handleClick error: ", err);
        })
        .then(result => {
            let text = result;
            setText(text);
            console.log(text);
        })
    }

    return (
        <div className="App">
            <main className="App-main">
                <h3>Upload:</h3>
                <img 
                    src={imagePath} className="App-image" alt="logo"/>
                <h3>Extracted Text:</h3>
                <div className="text-box">
                    <p> { text } </p>
                </div>
                <input type="file" onChange={handleChange} />
                <button onClick={handleClick} style={{height:50}}>convert to text</button>
            </main>
        </div>
    );
}

export default App