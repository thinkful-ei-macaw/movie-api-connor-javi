require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors') 
// const POKEDEX = require('./pokedex.json')
const MOVIES = require('./movies.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

const { genres = '', country = '', avg_vote = '' } = req.query;

app.get('/movies', function handleGetMovies(req, res) {
  let response = MOVIES.movies;

  // filter our pokemon by name if name query param is present
  if (req.query.genre) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.includes(req.query.country)
    )
  }

  if (req.query.avg_vote) {
    response = response.filter(movie => 
      movie.avg_vote >= Number(req.query.avg_vote)
    )
  }

  res.json(response)
})

// Number(req.query.avg_vote)



const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})