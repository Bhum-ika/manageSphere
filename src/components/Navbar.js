import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
   
    return (
        <div className='mb-8'>
          <nav className='flex items-center h-20 max-w-6xl justify-between mx-auto z-10 min-w-full fixed  top-0' >
            <NavLink to="/">
                <div className='ml-5'>
                   
                </div>
            </NavLink>
             <div className=' flex items-center font-md  mr-10 space-x-6'>
                <NavLink to="/" >
                    <p className=' border-2 px-4 py-2 rounded-lg transition-all ease-in-out duration-75 border-black'>Home</p>
                </NavLink>
                <NavLink to="/loginUser">
                    <p className=' border-2 px-4 py-2 rounded-lg transition-all ease-in-out duration-75 border-black'>Login</p>
                </NavLink>
                <NavLink to="#">
                    <p className='border-2 px-4 py-2 rounded-lg transition-all ease-in-out duration-75 border-black'>About Us</p>
                </NavLink>
               
                
            </div>
            
            </nav>  
        </div>
    );
}

export default Navbar;
