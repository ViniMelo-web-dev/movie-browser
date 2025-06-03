import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search';
import Card from './components/Card';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');


  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}` :
       `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
       
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.Response === 'False'){
        setMovieList([]);
        throw new Error('Failed to fetch data');
      }

      setMovieList(data.results || []);
      console.log(movieList);

    } catch(error){
      setErrorMessage(error.message || 'Error fetching movies');
      console.log(errorMessage);
    } finally{
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])


  return (
    <main>
      <div className='pattern'></div>
      <header>
        <img className='max-h-20 max-w-20 relative -bottom-5' src='logo.png' alt='page-logo'></img>
        <img  src='hero-img.png' alt='hero-banner'></img>
        <h1 className='text-white max-w-3xl text-[3.9rem] font-bold relative -top-10'>
          Find <span className='text-gradient'>Movies</span> You'll Enjoy Without The Hassle
        </h1>@apply bg-hero-pattern bg-center bg-cover
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
      </header>
      <section>
        <h2 className='my-10'>All Movies</h2>
        <ul className='grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {movieList.map((movie) => <Card key={movie.id} movie={movie}></Card>)}
        </ul>
      </section>
    </main>
  )
}

export default App
