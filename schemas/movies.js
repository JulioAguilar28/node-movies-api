import { z } from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string().url('Poster must be a valid URL'),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Biography', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi'])
  )
})

export function validateMovie (object) {
  return movieSchema.safeParse(object)
}

/**
 * Validates movieSchema with partial schema for updating a movie
 * @param {*} object partialMovie
 * @returns movieSchema
 */
export function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}
