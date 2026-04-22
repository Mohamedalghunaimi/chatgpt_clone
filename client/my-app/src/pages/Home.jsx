import React from 'react'
import Sidbar from '../components/Sidbar'
import Content from '../components/Content'

const Home = () => {
  return (
    <>
    <div  className=' flex'>
        <div className='w-[300px] hidden md:block'>
            <Sidbar />
        </div>
        <div className=' flex-1 max-h-screen '>
            <Content />
        </div>
    </div>
    
    </>

  )
}

export default Home
