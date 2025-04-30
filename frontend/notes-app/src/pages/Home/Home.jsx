import React from 'react'
import FuzzyOverlayExample from '../../components/Fuzzy/FuzzyHero'
import UserBar from '../../components/UserBar/UserBar'

const Home = () => {
  return (
    <>
    
    <div className="flex flex-col h-screen text-center text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black ">
    <UserBar />
     <FuzzyOverlayExample/>
    </div>


    </>
  )
}

export default Home
