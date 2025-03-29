import { v } from 'convex/values';
import { mutation, query } from '@/convex/_generated/server';
import { aiAssistant } from '@/convex/schema';

export const getAllUserAssistants = query({
  args: {
    userId: v.id('users'),
  },
  handler: async ({ db }, { userId }) => {
    const userAiAssistants = await db
      .query('userAiAssistants')
      .filter((q) => q.eq(q.field('userId'), userId))
      .order('desc')
      .collect();

    return userAiAssistants;
  },
});

export const addSelectedAssistants = mutation({
  args: {
    aiAssistants: v.array(v.object(aiAssistant)),
  },
  handler: async ({ db }, { aiAssistants }) => {
    const insertedIds = await Promise.all(
      aiAssistants.map(
        async (aiAssistant) => await db.insert('userAiAssistants', aiAssistant)
      )
    );
    return insertedIds;
  },
});

export const updateUserAiAssistant = mutation({
  args: {
    id: v.id('userAiAssistants'),
    userInstruction: v.string(),
    aiModelId: v.optional(v.string()),
  },
  handler: async ({ db }, { id, userInstruction, aiModelId }) => {
    const updatedAssistant = await db.patch(id, {
      aiModelId,
      userInstruction,
    });

    return updatedAssistant;
  },
});

export const deleteAssistant = mutation({
  args: {
    id: v.id('userAiAssistants'),
  },
  handler: async ({ db }, { id }) => {
    await db.delete(id);
  },
});
