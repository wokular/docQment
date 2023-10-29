import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api"
import { v } from "convex/values";

export const sendMessage = mutation({
   args: { 
      text: v.string(), 
      user: v.string(),
   },
   handler: async (ctx, args) => {

      await ctx.db.insert("chats".concat(args.user), {
      text: args.text,
      human: true,
      timestamp_ms: Date.now(),
    });
      console.log("Received message:", args.text)
   },
});

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

export const sendBotMessage = mutation({
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