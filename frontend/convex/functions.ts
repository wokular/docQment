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
      console.log(msgs)
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

export const sendImage = mutation({
   args: { 
      storageId: v.string(),
   },
   handler: async (ctx, args) => {
      const { storageId } = args;
      await ctx.db.insert("images", { storageId });
   }
});

export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    // ...
 
    // Return an upload URL
    const url = await ctx.storage.generateUploadUrl();
    ctx.db.insert("aTable", {
      storageId: url,
      // ...
    });
    return url;
  },
});

export const saveStorageId = mutation({
  // You can customize these as you like
  args: {
    uploaded: v.object({
      storageId: v.string(),
    }),
    // other args...
  },
  handler: async (ctx, args) => {
      console.log("hello");
    // use `args` and/or `ctx.auth` to authorize the user
    // ...
 
    // Save the storageId to the database using `insert`
    ctx.db.insert("aTable", {
      storageId: args.uploaded.storageId,
      // ...
    });
    // or `patch`/`replace`
   //  ctx.db.patch(someId, {
   //    storageId: args.uploaded.storageId,
   //    // ...
   //  });
  },
});