import { defineCollection, z } from "astro:content";

const exercises = defineCollection({
    schema: z.object({
        title: z.string(),
        author: z.string(),
    })
})

export const collections = { exercises }