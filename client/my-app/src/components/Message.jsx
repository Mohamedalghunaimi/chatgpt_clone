import moment from 'moment';
import React, { use, useContext, useEffect, useState } from 'react'
import { FaL, FaUser } from "react-icons/fa6";
import "../assets/prism.css"
import Prism from "prismjs"
import Leading from './Leading';
import { context } from '../pages/Provider';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const Message = ({message,setLoading,loading}) => {
    const {input} = useContext(context);
    useEffect(()=> {
        Prism.highlightAll()
    },[message.content])



  return (
    <div className={`${message.role==="user"?"flex flex-row-reverse":""}`}>
        {
            message.isImage?<>
            <div className=' bg-gray-300 p-[10px] rounded-xl w-fit mt-[10px]'>
                <img src={message.content} className=' w-[500px] cursor-pointer h-[500px]' alt=''/>
            </div>
            </>:<>
            {message.role==="user"?<>
            <div className='flex flex-row-reverse gap-[5px] items-start'>
                <p className='p-[10px] bg-blue-800 text-white rounded-full '><FaUser/></p>
                <div  className={` ${!input?"bg-gray-100 text-black":" bg-slate-600 text-white"} p-[10px] rounded-xl rounded-tr-none mt-[10px]`}>
                <p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                </p>
                <p className=' font-semibold'>{moment(message.createdAt).fromNow()}</p>
                </div>
            </div>            
            </>:<>
            <div className={`p-[10px] ${!input?"bg-gray-100 text-black":" bg-slate-600 text-white"} rounded-xl w-[80%] my-[10px]`}>
                <p className='reset-tw'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                </p>
                <p className=' font-semibold'>{moment(message.createdAt).fromNow()}</p>
            </div>
            </>}
            </>
        }
      
    </div>
  )
}

export default Message
