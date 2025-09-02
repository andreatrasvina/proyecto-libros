// src/content/exercises/config.ts
import { z, defineCollection } from 'astro:content';

const exercisesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    bookSlug: z.string(),
  }),
});

export const collections = {
  'exercises': exercisesCollection,
};
