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
export async function file_eval(imageUrl) {
    return fetch(imageUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.headers.get("Content-Type");
    })
    .then(contentType => {
        console.log("File type:", contentType);
        return contentType;
    })
    .catch(error => {
        console.error("file_eval error: ", error);
    });
}

// Function to convert pdf to png
export async function pdf_to_png(imageUrl) {
    // lol nope
    
}

// Tesseract OCR
export async function tes_OCR(imageUrl) {
    // Precondition: supported file type    
    const res = await file_eval(imageUrl);

    if (res.startsWith("application/pdf")) {
        imageUrl = await pdf_to_png(imageUrl);
    }

    if (res.startsWith("image/")) {
        try {
            const worker = await createWorker('eng');
            const result = await worker.recognize(imageUrl);
            await worker.terminate();
            return result.data.text;
        } catch (error) {
            console.error('OCR error:', error);
            throw(error);
        }
    } else {
        console.log("wrong type dumbass");
        // return("File error");
    }
}