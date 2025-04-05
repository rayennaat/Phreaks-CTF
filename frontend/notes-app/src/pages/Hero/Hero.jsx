import React from 'react'
import Navbar2 from '../../components/Navbar2/Navbar2'
import FuzzyOverlayExample from '../../components/Fuzzy/FuzzyHero'

const Hero = () => {
  return (
    <>
    
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-center flex flex-col  ">
    <Navbar2 />
     <FuzzyOverlayExample/>
    </div>


    </>
  )
}

export default Hero