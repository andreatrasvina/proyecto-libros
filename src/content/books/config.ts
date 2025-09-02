import { defineCollection, z } from "astro:content";

const books = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    img: z.string(),
    date: z.string(),
    place: z.string(),
    publisher: z.string(),
    pages: z.number(),
    link: z.string().url().optional(),
  })
})

export const collections = { books }
