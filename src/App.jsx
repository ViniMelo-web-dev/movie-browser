import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx'; 
import MoviePage from './components/MoviePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moviePage" element={<MoviePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
