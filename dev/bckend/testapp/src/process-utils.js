// dhonk

// process-utils.js : javascript utility to process files

// Process breakdown:   pdf/png/jpg input, gets converted into png for processing
//                      tesseract OSR ==> get strings and return thos
//                      OSR ==> into langchain + chromaDB for embeddings + RAG

// Dependencies:
//      Tesseract
//      

// Import statements
import { createWorker } from 'tesseract.js';

// Function to check fileType
export function file_eval(imageUrl) {
    fetch(imageUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.headers.get("Content-Type");
    })
    .then(contentType => {
        console.log("File type:", contentType);
    })
    .catch(error => {
        console.error("file_eval error: ", error);
    });
}

// Function to convert pdf to png
/*
export function pdf_to_png() {
    // lol nope
}
*/

// Function to gen imageUrl, might not need?
/*
export function url_gen() {
    
}
*/

// Getting Link from Convex


// 

// Tesseract OCR
export async function tes_OCR(imageUrl) {
    // Precondition: supported file type
    const data_patt = /^data:image\/([a-zA-Z]*);base64,([^"]*)$/
    if (!data_patt.test(imageUrl)) {
        if (true) {}
    }

    try {
        const worker = await createWorker('eng');
        const result = await worker.recognize(imageUrl);
        await worker.terminate();
        return result.data.text;
    } catch (error) {
        console.error('OCR error:', error);
        throw(error);
    }
}