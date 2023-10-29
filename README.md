# DocuQ

## About
## Inspiration
Legal documents are difficult. The wording is long, verbose, and almost always opaque. There aren't that many resources to help understand these documents either; it is almost like importance inversely proportional to how clear the wording is. Our project aimed to improve the accessibility of such documents.

This goal is a personal one too. As a team of *(mostly)* second generation immigrants, one shared core memory is translating important documents for our parents. Anything from school emails to W-2's were fair game, making the whole experience an insanely frustrating one for everyone involved.

DocuQ aims to relieve this frustration. Although asking children for help is amazing, our project leverages technology to make this process far smoother.

## What it does
DocuQ is a web-based service that takes a document and generates a chatbot that is able to answer specific questions in a context-aware manner. Any questions - no matter how open ended or specific - can be asked to the chatbot, and it answers the questions with relevant information in a humanlike manner.

## How we built it
We built our project mainly using Convex. Because we wanted to create a web-based platform in a limited amount of time, Convex seemed like the perfect choice. We built our backend databases off Convex, Nodejs, and React in order to create a streamlined web application. This system also connected Convex to other services in order to process uploaded documents and generate helpful chatbot responses.

Tesseract.js was the service we used for OCR to retrieve text from uploaded documents. This information was then processed and put into a Convex database. This plaintext was also processed using LangChain in order to create embeddings from the uploaded document. The vector database was stored in ChromaDB, and Retrieval Augmentation was performed using OpenAI alongside LangChain to generate chatbot responses.

Our frontend was built off of the Vite, React, and MaterialUI frameworks/libraries. We chose this approach because we figured that utilizing Javascript from the ground up would create the most streamlined workflow.

## Challenges we ran into
One challenge we ran into was the difficulty of cross-integrating across services. Accessing and utilizing the services in isolation

## Accomplishments that we're proud of


## What we learned


## What's next for DocQ
Our first step forward with this project is tightening up the remaining loose ends in our development process. Although creating DocQ in a hackathon environment gave us many advantages, it also meant that some processes need some extra TLC. One area in particular is our utilization of Convex databases. Although we benefited massively from the streamlined process, we feel that we could've gone more in-depth with the platform.

Another goal with the project is to further increase the accessibility of our project. This means developing multilingual and mobile integrations so that users can easily use our service. 
