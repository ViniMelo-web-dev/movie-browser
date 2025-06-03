import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='w-full bg-[#0F0D23] px-4 rounded-lg mt-5 max-w-3xl mx-auto'>
        <div className='flex items-center relative'>
            <img className='absolute h-5 w-5 left-2' src='search.svg' alt='search-icon'></img>
            <input
            className='py-5 text-base w-full ml-10 outline-hidden placeholder-[#a8b5db] text-gray-200'
            placeholder='Search through thousands of movies'
            value={searchTerm} 
            onChange={(event) => setSearchTerm(event.target.value)}
            type='text'>
            </input>
        </div>
    </div>
  )
}

export default Search