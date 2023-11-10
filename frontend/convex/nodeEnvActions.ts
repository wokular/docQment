"use node";
import { action } from "./_generated/server";
import { internal } from "./_generated/api"
import { v } from "convex/values";

import {vectorizeAndStoreText, performQAOnUserQuery} from "./retrieval";

export const sendMessage = action({
   args: { 
      text: v.string(), 
      user: v.string(),
   },
   handler: async (ctx, args) => {
      console.log("Received message")

      // Send user query to chat model to perform retrieval-based QA / Also send chat history (idk how to access from separate, non-convex function)
      const botResponse = await performQAOnUserQuery(args.text, args.user, ctx);
      // const botResponse = "Test message";

      // Add message to chatHistory (after performQA due to performQA using chat history for message context, we don't want to include the recently sent user message)
      await ctx.runMutation(internal.functions.handleUserSentMessage, {user: args.user, text: args.text})

      // Send bot message
      await ctx.runMutation(internal.functions.handleBotSentMessage, {user: args.user, text: botResponse})
   }
});

export const userDocumentTextUpload = action({
   args: {
      text: v.string(),
      user: v.string(),
   }, 
   handler: async (ctx, args) => {

      // Store the uploaded document text
      await ctx.runMutation(internal.functions.userDocumentTextStorageInsert, {text: args.text, user: args.user})
      // Send the uploaded document text to be stored in a vector db for chat QA
      try {
         const result = vectorizeAndStoreText(args.text, {"user": args.user})
      } catch (error) {
         console.error("Error in userDocumentTextUpload")
         throw new Error("Couldn't vectorize text (convex: userDocumentTextUpload)");
      }
      
   }
})