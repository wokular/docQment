import { mutation, query, internalAction, internalMutation, action } from "./_generated/server";
import { api, internal } from "./_generated/api"
import { v } from "convex/values";

import OpenAI from "openai";
const openai = new OpenAI();

export const sendMessage = action({
   args: { 
      text: v.string(), 
      user: v.string(),
   },
   handler: async (ctx, args) => {
      console.log("Received message")

      await ctx.runMutation(internal.functions.addToDatabase, {user: args.user, text: args.text, human: true,
      timestamp_ms: Date.now()})
      console.log("Asking GPT")
      await ctx.runAction(internal.functions.gptAnalysis, {text: args.text})
      console.log("Here")
   }
});

export const sendBotMessage = internalMutation({
   args: { 
      text: v.string(), 
      user: v.string()
   },
   handler: async (ctx, args) => {
      await ctx.db.insert("chats".concat(args.user), {
      text: args.text,
      human: false,
      timestamp_ms: new Date().getMilliseconds()

    });
      console.log("Received message:", args.text)
   },
});

export const addToDatabase = internalMutation({
   args: { 
      user: v.string(),
      text: v.string(),
      human: v.boolean(),
      timestamp_ms: v.number(),
   },
   handler: async (ctx, args) => {
      await ctx.db.insert("chats".concat(args.user), {
      text: args.text,
      human: args.human,
      timestamp_ms: args.timestamp_ms,

    });
   },
})

export const gptAnalysis = internalAction({
   args: {
      text: v.string()
   },
   handler: async (ctx, args) => {
      console.log("Inside GPT Analyis")
      const apiUrl = 'https://api.openai.com/v1/chat/completions';

      const data = {
         prompt: 'A user asked this question. Respond to them to the best of your ability. If you do not know the answer, do not say so, but merely apologize that you cannot help. Here is the user input: ' + query,
         model: "gpt-3.5-turbo"
      };




      const completion = await openai.chat.completions.create({
         messages: [{ role: "assistant", content: data.prompt }],
         model: data.model, temperature: .9,
      });

      console.log(completion.choices[0], completion.choices[0]["message"]["content"]);

      await ctx.runMutation(internal.functions.sendBotMessage, {
         text: completion.choices[0]["message"]["content"]!,
         user: "Danny"
      });
  }
})

export const clearMessages = mutation({
   args: {
      user: v.string()
   },
   handler: async(ctx, args) => {
      const msgs = await ctx.db.query("chats".concat(args.user)).collect()
      for (let i = 0; i < msgs.length; i++) {
         ctx.db.delete(msgs[i]["_id"])
      }
   }
})


export const getMessages = query({
  args: {chatName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query(args.chatName).collect()
  },
});

// Internal function to handle user queries and sending bot responses from retrieval qa with langchain

export const sendParsedText = mutation({
   args: {
      text: v.string(),
      user: v.string(),
   }, 
   handler: async (ctx, args) => {
      await ctx.db.insert("parsedTextUpload".concat(args.user), {text: args.text});
      // sendTextToVectorizationFunction()
   }
})

export const sendImage = mutation({
   args: { 
      storageId: v.string(),
   },
   handler: async (ctx, args) => {
      const { storageId } = args;
      await ctx.db.insert("images", { storageId });
   }
});