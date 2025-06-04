import React from 'react'

const TrendingCard = ({index, moviePoster}) => {
  return (
    <div className='flex w-full items-center mx-5'>
        <p className='fancy-text mt-[22px] text-nowrap'>{index + 1}</p>
        <img className='w-[127px] h-[163px] rounded-lg object-cover -ml-3.5' src={`https://image.tmdb.org/t/p/w500/${moviePoster}`}></img>
    </div>
  )
}

export default TrendingCard