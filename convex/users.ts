import { v } from 'convex/values';
import { mutation, query } from '@/convex/_generated/server';

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
  },
  handler: async (ctx, args) => {
    // If user already exist in table
    const result = await ctx.db
      .query('users')
      .filter((c) => c.eq(c.field('email'), args.email))
      .collect();
    const [user] = result ?? [];

    console.log('user::', user);

    if (!user) {
      // If not, then add user
      const userData = {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: 5000,
      };
      await ctx.db.insert('users', userData);
      console.log('userData::', userData);
      return userData;
    }

    return user;
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .collect();
    const [user] = result ?? [];

    return user;
  },
});
