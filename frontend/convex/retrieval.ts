"use node";

const secretKey = process.env["MUSTARD_OPEN_AI"];

import { query } from "./_generated/server";
import { internal } from "./_generated/api";

import { PromptTemplate } from "langchain/prompts";
import {
   RunnableSequence,
   RunnablePassthrough,
} from "langchain/schema/runnable";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConvexVectorStore } from "langchain/vectorstores/convex";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";

// User uploads pictures (ocr'd and sent to be stored in vectordb)
// User asks question (search db, get chat message history)
// Send message response back

// Prompt engineering
const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

   Chat History:
   {chat_history}
   Follow Up Input: {question}
Standalone question:`;

const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(condenseQuestionTemplate);

const answerTemplate = `Answer the question based on the following context, but if no context is provided, use whatever information available:
{context}
Question: {question}
`;
const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);

// Global vector store for documents
// const vectorstore = new HNSWLib(new OpenAIEmbeddings({openAIApiKey: secretKey}), { space: "l2", numDimensions: 1536});
// Global chat model for QA
const model = new ChatOpenAI({ openAIApiKey: secretKey });

interface ChatObject {
   "_creationTime": number,
   "_id": string,
   "human": boolean,
   "text": string,
   "timestamp_ms": number
}

// Format the chat history
function formatChatHistory(chatHistory: ChatObject[]): string[] {
   const formattedMessages: string[] = [];
   let currentHumanMessages: string[] = [];
   let currentBotMessage: string | null = null;

   for (const chatObj of chatHistory) {
      if (chatObj.human) {
         currentHumanMessages.push(chatObj.text.concat(","));
      } else {
         if (currentHumanMessages.length > 0) {
            const humanMsg = `Human: \"${currentHumanMessages.join(" ")}\"`;
            const botMsg = chatObj.text;
            formattedMessages.push(`${humanMsg}\n Assistant: \"${botMsg}\"`);
         } else {
            throw new Error("Logic error: bot should never have a message with no prior human message.")
         }

         currentHumanMessages = [];
      }
   }
   return formattedMessages;
}

// Use a global HNSWLib vector store. Alternatively, store HNSWLib object in dictionary and access based on username
export async function vectorizeAndStoreText(text: string, metadata: object | null, ctx: any) {
   try {
      const vectorstore = new ConvexVectorStore(new OpenAIEmbeddings({ openAIApiKey: secretKey }), { ctx });
      const result = await vectorstore.addDocuments([new Document({ pageContent: text, metadata: metadata || {} })]);
   } catch (e: any) {
      throw new Error("Error in vectorizeAndStoreText: ".concat(e.toString()));
   }
}

// Take a user query, perform QA, send message as bot, store message in chat db
export async function performQAOnUserQuery(userQuery: string, userName: string, ctx: any) {

   // Get the vectorstore as a retriever
   const vectorstore = new ConvexVectorStore(new OpenAIEmbeddings({ openAIApiKey: secretKey }), { ctx });
   const retriever = vectorstore.asRetriever();

   type ConversationalRetrievalQAChainInput = {
      question: string;
      chat_history: [string, string][];
   };

   const standaloneQuestionChain = RunnableSequence.from([
      {
         question: (input: ConversationalRetrievalQAChainInput) => input.question,
         chat_history: (input: ConversationalRetrievalQAChainInput) => input.chat_history,
      },
      CONDENSE_QUESTION_PROMPT,
      model,
      new StringOutputParser(),
   ]);

   const answerChain = RunnableSequence.from([
      {
         context: retriever.pipe(formatDocumentsAsString),
         question: new RunnablePassthrough(),
      },
      ANSWER_PROMPT,
      model,
   ]);

   const conversationalRetrievalQAChain = standaloneQuestionChain.pipe(answerChain);

   // Get chat history and format it
   let chatHistory = await ctx.runQuery(internal.functions.getChatHistoryInternal, { chatName: "chats".concat(userName) });
   console.log("Chat history", chatHistory);
   chatHistory = formatChatHistory(chatHistory);
   console.log("Formatted chat history", chatHistory)

   const result1 = await conversationalRetrievalQAChain.invoke({
      question: userQuery,
      chat_history: chatHistory,
   });
   console.log("OpenAI returned: ", result1["content"])
   return result1["content"]
}