import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/movie-page.css'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

const BASE_URL = 'https://api.themoviedb.org/3/movie/'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const MoviePage = () => {
  const navigate = useNavigate()

  const backToMain = () => {
    navigate('/')
  }

  const [movie, setMovie] = useState({})
  const [movieTrailer, setMovieTrailer] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [trailerLoading, setTrailerLoading] = useState(false)
  const { id } = useParams()

  const fetchMovie = async () => {
    setIsLoading(true)
    try {
      const endpoint = `${BASE_URL}${id}`
      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error('Failed to fetch specific movie')
      }

      const data = await response.json()

      if (data.response === 'False') {
        setMovie('')
        throw new Error('Error fetching data')
      }

      setMovie(data || '')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMovieVideo = async () => {
    setTrailerLoading(true)
    try {
      const endpoint = `${BASE_URL}${id}/videos`
      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error('Failed to fetch trailer')
      }

      const data = await response.json()

      if (data.response === 'False') {
        setMovieTrailer('')
        throw new Error('Failed to fetch trailer info')
      }

      const trailer = data.results.find(
        (video) => video.name.toLowerCase().includes('trailer')
      )

      setMovieTrailer(trailer || data.results[0] || '')
    } catch (error) {
      console.log(error)
    } finally {
      setTrailerLoading(false)
    }
  }

  useEffect(() => {
    fetchMovie()
    fetchMovieVideo()
  }, [])

  const {
    title, release_date, vote_average, vote_count,
    poster_path, genres, revenue, tagline, production_companies,
    bugdet, spoken_languages, status,
    production_countries, overview, runtime
  } = movie

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60

  return (
    <div className='bg-dark-100 bright-shadow rounded-[8px] p-7 max-w-full'>
      <div className='arrow-control flex justify-center mb-5' onClick={backToMain}>
        <img src='../public/arrow-icon.svg' alt='arrow-icon'></img>
      </div>

      <section className='header flex justify-between'>
        <h2 className='mt-0'>{title ? title : 'N/A'}</h2>
        <div className='bg-[#221F3D] rounded-[4px] p-2'>
          <div className='flex items-center'>
            <img className='mx-1.5' src='../public/star.svg' alt='star-icon'></img>
            <p className='text-gray-100'>
              <span className='text-white font-bold'>
                {vote_average ? vote_average.toFixed(1) : 'N/A'}
              </span>/10
              <span className='mx-1.5'>
                ({vote_count ? vote_count : 'N/A'})
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className='text-light-200 float-left'>
        <span>{release_date ? release_date.split('-')[0] : 'N/A'}</span>
        <span> - </span>
        <span>{runtime ? `${hours}h ${minutes}m` : 'N/A'}</span>
      </div>

      <section>
        <div className="mt-10 flex gap-7 items-center">
          <img
            className="w-[18.87rem] h-[27.5rem] rounded-[10px]"
            src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
            alt="Poster"
          />

          <div className="w-full">
            {trailerLoading ? (
              <div className='w-full flex justify-center align-bottom'>
                <Spinner className='scale-150'/>
              </div>
            ) : movieTrailer ? (
              <iframe
                className="rounded-[10px] w-full"
                width="560"
                height="440"
                src={`https://www.youtube.com/embed/${movieTrailer.key}`}
                title={movieTrailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img
                className="w-full h-[27.5rem] rounded-[10px]"
                src="../public/no-trailer.png"
                alt="No trailer available"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MoviePage
