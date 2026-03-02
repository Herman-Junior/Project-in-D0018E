import React from 'react'

const Title = ({text1, text2}) => {
    return (
        <div className='inline-flex gap-2 items-center mb-3'>
            <p className='w-8 sm:w-12 h-px sm:h-0.5' style={{ backgroundColor: '#6f1811' }}></p>
            <p style={{ color: '#6f1811' }}>{text1} <span className='font-bold' style={{ color: '#6f1811' }}>{text2}</span></p>
            <p className='w-8 sm:w-12 h-px sm:h-0.5' style={{ backgroundColor: '#6f1811' }}></p>
        </div>
    )
}

export default Title