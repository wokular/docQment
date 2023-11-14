import { mutation, query, internalQuery, internalAction, internalMutation, action } from "./_generated/server";
import { api, internal } from "./_generated/api"
import { v } from "convex/values";

export const handleUserSentMessage = internalMutation({
   args: { 
      user: v.string(),
      text: v.string()
   },
   handler: async (ctx, args) => {

      // Add user message to chats for specific user chat history
      await ctx.db.insert("chats".concat(args.user), {
      text: args.text,
      human: true,
      timestamp_ms: Date.now(),

    });
   },
})

export const handleBotSentMessage = internalMutation({
   args: { 
      user: v.string(), 
      text: v.any()
   },
   handler: async (ctx, args) => {

      // Add bot message to chats for specific user chat history
      await ctx.db.insert("chats".concat(args.user), {
      text: args.text,
      human: false,
      timestamp_ms: Date.now()

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


export const getMessages = query({
  args: {chatName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query(args.chatName).collect()
  },
});

export const getChatHistoryInternal = internalQuery({
   args: {chatName: v.string()},
   handler: async (ctx, args) => {
      return await ctx.db.query(args.chatName).collect()
   },
})

// Internal function to handle user queries and sending bot responses from retrieval qa with langchain
export const userDocumentTextStorageInsert = internalMutation({
   args: {
      text: v.string(),
      user: v.string(),
   }, 
   handler: async (ctx, args) => {

      // Store the uploaded document text
      await ctx.db.insert("userDocumentStorage".concat(args.user), {text: args.text});
   }
})