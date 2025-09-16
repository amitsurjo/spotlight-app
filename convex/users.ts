import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"; // ✅ use generated server

// CREATE USER
export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      username: string;
      fullname: string;
      image: string;
      bio?: string;
      email: string;
      clerkId: string;
    }
  ) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});

// GET USER BY CLERK ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx: QueryCtx, args: { clerkId: string }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", args.clerkId))
      .unique();

    return user;
  },
});

// GET CURRENT AUTHENTICATED USER
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
    .first();

  if (!currentUser) throw new Error("User not found");

  return currentUser;
}
