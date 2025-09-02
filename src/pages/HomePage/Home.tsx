import React from 'react'
import { useAuth } from '../../context/AuthContext'
import Auth from './Auth/Auth'

function Home() {
  const {isLoginPageInTheWindow} = useAuth()
  return (
    <div className='w-[100dvw] h-[100dvh] grid-cols-1 sm:grid grid-cols-2 '>
      <Auth/>
      <div className='w-full h-full hidden sm:block'>
        <img src="right-column.png" className='w-full h-full '/>
      </div>
    </div>
  )
}

export default Home
