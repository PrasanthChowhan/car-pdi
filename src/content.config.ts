import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const storiesCollection = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/stories'
  }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  stories: storiesCollection,
};
