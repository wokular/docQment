import { mutation, internalMutation} from "./_generated/server";
import { api } from "./_generated/api"
import { v } from "convex/values";

export const sendMessage = mutation({
   args: { text: v.string() },
   handler: async (ctx, args) => {
      console.log("Received message:", args.text)
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