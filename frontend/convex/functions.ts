import { mutation, query, internalAction, internalMutation, action } from "./_generated/server";
import { api, internal } from "./_generated/api"
import { v } from "convex/values";

import { askGpt } from "./temp";

export const sendMessage = action({
   args: { 
      text: v.string(), 
      user: v.string(),
   },
   handler: async (ctx, args) => {
      console.log("Received message")

      await ctx.runMutation(internal.functions.addToDatabase, {user: args.user, text: args.text, human: true,
      timestamp_ms: Date.now()})
      await ctx.runAction(internal.functions.gptAnalysis, {text: args.text})
      
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

// export const gptAction = action({
//    args: { 
//       text: v.string(), 
//       user: v.string(),
//    },
//    handler: async (ctx, args) => {

//       await ctx.db.insert("chats".concat(args.user), {
//       text: args.text,
//       human: true,
//       timestamp_ms: Date.now(),

//     });
//     console.log("Received message:", args.text)
//       await ctx.runAction(api.functions.gptAnalysis, {
//          text: args.text
//       })
      
//    },
// })


export const gptAnalysis = internalAction({
   args: {
      text: v.string()
   },
   handler: async (ctx, args) => {
      const response = await askGpt(args.text);
      await ctx.runMutation(internal.functions.sendBotMessage, {
         text: response!,
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