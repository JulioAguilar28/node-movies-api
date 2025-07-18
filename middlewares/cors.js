import cors from 'cors'

export const corsMiddleware = () => cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:5500',
      'http://127.0.0.1:5500'
    ]

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
