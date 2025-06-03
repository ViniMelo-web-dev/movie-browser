import React from 'react'

const TrendingCard = ({index, moviePoster}) => {
  return (
    <div>
        <p>{index}</p>
        <img src={`https://image.tmdb.org/t/p/w500/${moviePoster}`}></img>
    </div>
  )
}

export default TrendingCard