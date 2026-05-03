import React from 'react'
import { FaBrain } from 'react-icons/fa6'

const HelloMessage = () => {
  return (
        <div className={` flex-1 overflow-y-auto flex justify-center items-center `}>
            <div>
                <div className=' flex items-center justify-center capitalize mb-[10px]  gap-[10px]'>
                    <span className=' block p-[10px] bg-blue-600 rounded-lg text-white text-3xl'><FaBrain/></span>
                    <div>
                        <h1 className=' font-bold text-2xl'>quickCPT</h1>
                        <p className=' text-blue-600 font-semibold'>intelligent ai assistant</p>
                    </div>
                </div>
                <h1 className=' capitalize font-bold text-6xl text-gray-500'>ask me anything</h1>
            </div> 
        </div>
  )
}

export default HelloMessage
