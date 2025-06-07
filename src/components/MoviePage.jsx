import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import '../styles/movie-page.css'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

const BASE_URL = 'https://api.themoviedb.org/3/movie/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const MoviePage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const moviePage = location.state?.moviePage;

  const backToMain = () => {
    navigate('/', {state: {moviePage: moviePage}});
  }


  const [movie, setMovie] = useState({});
  const [movieTrailer, setMovieTrailer] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const { id } = useParams();

  const fetchMovie = async () => {
    setIsLoading(true)
    try {
      const endpoint = `${BASE_URL}${id}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch specific movie');
      }

      const data = await response.json();


      if (data.response === 'False') {
        setMovie('');
        throw new Error('Error fetching data');
      }

      setMovie(data || '');
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  const fetchMovieVideo = async () => {
    setTrailerLoading(true)
    try {
      const endpoint = `${BASE_URL}${id}/videos`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch trailer');
      }

      const data = await response.json();

      if (data.response === 'False') {
        setMovieTrailer('');
        throw new Error('Failed to fetch trailer info');
      }

      const trailer = data.results.find(
        (video) => video.name.toLowerCase().includes('trailer')
      )

      setMovieTrailer(trailer || data.results[0] || '')
    } catch (error) {
      console.log(error);
    } finally {
      setTrailerLoading(false);
    }
  }

  useEffect(() => {
    fetchMovie()
    fetchMovieVideo()
  }, [])

  const {
    title, release_date, vote_average, vote_count,
    poster_path, genres, revenue, tagline, production_companies,
    budget, spoken_languages, status,
    production_countries, overview, runtime
  } = movie


  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  const formatedDate = new Date(release_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const revenueFormated = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(revenue);

  return (
    <div className='bg-dark-100 bright-shadow rounded-[8px] p-7 max-w-full'>
      <div className='arrow-control flex justify-center mb-5' onClick={backToMain}>
        <img src='../public/arrow-icon.svg' alt='arrow-icon'></img>
      </div>

      <section className='header flex justify-between max-md:flex-wrap'>
        <h2 className='mt-0'>{title ? title : 'N/A'}</h2>
        <div className='bg-[#221F3D] rounded-[4px] p-2 max-h-12 max-md:p-4'>
          <div className='flex items-center'>
            <img className='mx-1.5 max-md:h-3 max-md:mx-0.5' src='../public/star.svg' alt='star-icon'></img>
            <p className='text-gray-100 max-md:text-sm'>
              <span className='text-white font-bold'>
                {vote_average ? vote_average.toFixed(1) : 'N/A'}
              </span>/10
              <span className='mx-1.5 max-md:mx-0'>
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
      <section className='flex flex-col gap-4'>
        <div className='movie-row-content mt-5 items-center'>
          <p>Genres </p>
          <ul className='max-md: flex-wrap'>
            {genres ? genres.map((genre) => (
              <div key={genre.id} className='bg-[#221F3D] rounded-[4px] p-1 px-5'>
                <span className='text-white font-medium'>{genre.name}</span>
              </div>
            )) : 'N/A'}
          </ul>
        </div>
        <div className='movie-row-content'>
          <p>Overview </p>
          <span className='text-white text-[1rem] leading-[175%] text-justify'>{overview}</span>
        </div>   
        <div className='movie-row-content'>
          <p>Release date </p>
          <span>{formatedDate ? formatedDate : 'N/A'}</span>
        </div>
        <div className='movie-row-content'>
          <p>Countries </p>
          <ul className='flex max-md: truncate'>
            {production_countries ? production_countries.map((country) => (
              <div key={country.name}>
                <span className='mr-2'>{country.name}</span>
              {production_countries?.length > 2 && (
                  <span>•</span>
              )}
              </div>
            )) : 'N/A'}
          </ul>
        </div>
        <div className='movie-row-content'>
          <p>Status </p>
          <span>{status ? status : 'N/A'}</span>
        </div>
        <div className='movie-row-content'>
          <p>Language </p>
          <ul>
             {spoken_languages ? spoken_languages.map((country) => (
              <div className='flex items-center' key={country.name}>
                <span className='mr-2'>{country.name}</span>
              {spoken_languages?.length > 1 && (
                  <span>•</span>
              )}
              </div>
            )) : 'N/A'}
          </ul>
        </div>
        <div className='movie-row-content'>
          <p>Budget </p>
          <span>{budget ? `$${budget}` : 'N/A'}</span>
        </div>
        <div className='movie-row-content'>
          <p>Revenue </p>
          <span>{revenue ? `${revenueFormated}`: 'N/A'}</span>
        </div>
        <div className='movie-row-content'>
            <p>Tagline </p>
            <span>{tagline ? tagline : 'N/A'}</span>
        </div>
        <div className='movie-row-content'>
          <p>Production companies</p>
            <div className='flex gap-5 max-md: truncate'>
            {production_companies ? production_companies.map((company) => (
              <div className='flex items-center' key={company.id}>
                <span className='mr-2'>{company.name}</span>
              {production_companies?.length > 1 && (
                  <span>•</span>
              )}
              </div>
            )) : 'N/A'}
            </div>
        </div>
      </section>
    </div>
  )
}

export default MoviePage
