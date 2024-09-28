import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar.js'
function Home() {
  return (
    <>
    <Navbar/>
    <div className='mt-32 mx-5'>
     <h1>Hello,<Link className='mx-2 text-blue-400' to='/loginUser'>Login to your account!</Link></h1>
    </div>
    </>
  )
}

export default Home