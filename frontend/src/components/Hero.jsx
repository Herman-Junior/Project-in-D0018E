import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate();

    return (
    <div className='flex flex-col border-y border-(--main-text-color) bg-(--main-text-color)'>
    <div className='w-full flex items-center justify-center py-5 sm:py-5'>
        <div className='text-(--second-text-color) text-center flex flex-col items-center'>
        
        <div className='flex items-center gap-2 mb-2'> 
            <p className='w-8 md:w-12 h-px bg-(--second-text-color) opacity-80'></p>
            <p className='font-medium text-xs md:text-sm uppercase tracking-[0.4em]'>Timeless classics</p>
            <p className='w-8 md:w-12 h-px bg-(--second-text-color) opacity-80'></p>
        </div>

        <h1 className='text-3xl md:text-5xl lg:text-6xl py-2 leading-tight'>
            Latest Arrivals
        </h1>

        <div className='flex items-center gap-2 mt-2 group cursor-pointer'
        onClick={() => navigate('/collection')}>
            <p className='w-10 md:w-14 h-px bg-(--second-text-color) transition-all duration-300 group-hover:bg-(--highlight-color) group-hover:w-16'></p>
            <p className='font-semibold text-sm md:text-base tracking-[0.2em] transition-colors duration-300 group-hover:text-(--highlight-color)'>
            SHOP NOW
            </p>
            <p className='w-10 md:w-14 h-px bg-(--second-text-color) transition-all duration-300 group-hover:bg-(--highlight-color) group-hover:w-16'></p>
        </div>
        </div>
    </div>
    </div>
    )
}

export default Hero
