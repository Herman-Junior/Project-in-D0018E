import React from 'react';
import { Link } from 'react-router-dom';
import {NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='flex items-center justify-between py-5 font-medium'>

      {/* LOGO */}
<div style={{ fontFamily: "'Montserrat Alternates', sans-serif" }} 
  className='flex flex-col items-center leading-none'>
  <span className='text-sm font-black tracking-widest' style={{ color: '#6f1811' }}>MEET</span>
  <span className='text-5xl font-black' style={{ color: '#5a3e19' }}>4</span>
  <span className='text-sm font-black tracking-widest' style={{ color: '#6f1811' }}>MEAT</span>
</div>

      {/* MIDDLE */}
      <ul className='hidden sm:flex gap-5 text-sm text' style={{ color: '#6f1811' }}>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] hidden' style={{ backgroundColor: '#1f1305' }} />
        </NavLink>

        <NavLink to='/products' className='flex flex-col items-center gap-1'>
          <p>PRODUCTS</p>
          <hr className='w-2/4 border-none h-[1.5px] hidden' style={{ backgroundColor: '#1f1305' }} />
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] hidden' style={{ backgroundColor: '#1f1305' }} />
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] hidden' style={{ backgroundColor: '#1f1305' }}/>
        </NavLink>
      </ul>

      <div className='flex items-center gap-6' >
        {/* Search ICON */}
        <svg xmlns="http://www.w3.org/2000/svg" height= "28px" viewBox="0 -960 960 960" width="28px" strokeWidth="0.5" className="cursor-pointer" alt="Search" >
        <path fill="#6f1811" d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>

        {/* PROFILE ICON */}
        <div>
          <div className='group relative'>
            <Link to='/Login'>
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" className="cursor-pointer">
          <path fill="#6f1811" d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
          </Link>
          
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
              <p className='cursor-pointer hover:text-[#5a3e19]' style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: '12px' }}>MyProfile</p>
              <p className='cursor-pointer hover:text-[#5a3e19]' style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: '12px' }}>Orders</p>
              <p className='cursor-pointer hover:text-[#5a3e19]' style={{ fontFamily: "'Montserrat Alternates', sans-serif", fontSize: '12px' }}>LogOut</p>
            </div>
          </div>
        </div>
        <Link to='/cart' className='relative'>
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" className="cursor-pointer">
          <path fill="#6f1811" d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>
          <p className='absolute right right-[5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] font-bold' style={{ fontFamily: "'Montserrat Alternates', sans-serif" }}>9</p>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;