import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { aiAssistant } from './schema';

export const InsertSelectedAssistants = mutation({
  args: {
    aiAssistants: v.array(v.object(aiAssistant)),
    userId: v.id('users'),
  },
  handler: async ({ db }, { aiAssistants, userId }) => {
    const insertedIds = await Promise.all(
      aiAssistants.map(
        async (aiAssistant) =>
          await db.insert('userAiAssistants', {
            ...aiAssistant,
            userId,
          })
      )
    );
    return insertedIds;
  },
});

export const GetAllUserAssistants = query({
  args: {
    userId: v.id('users'),
  },
  handler: async ({ db }, { userId }) => {
    const result = await db
      .query('userAiAssistants')
      .filter((q) => q.eq(q.field('userId'), userId))
      .order('desc')
      .collect();

    return result;
  },
});
