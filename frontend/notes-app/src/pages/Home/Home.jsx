import React from 'react'
import FuzzyOverlayExample from '../../components/Fuzzy/FuzzyHero'
import UserBar from '../../components/UserBar/UserBar'

const Home = () => {
  return (
    <>
    
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-center flex flex-col  ">
    <UserBar />
     <FuzzyOverlayExample/>
    </div>


    </>
  )
}

export default Home


/*  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (error){
      if(error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };*/