import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaBrain } from 'react-icons/fa';
import { IoSend } from "react-icons/io5";
import { context } from '../pages/Provider';
import Message from './Message';
import axios from 'axios';
  import {  toast } from 'react-toastify';
import Leading from './Leading';

const Content = () => {
    const {singleChat,isAuth,setSingleChat,setOriginalChats} = useContext(context);
    const [type,setType]= useState("text")
    const [input,setInput] = useState("")
    const [loading,setLoading] = useState(false)
    const [response,setResponse] = useState('')
    const ref = useRef()
    useEffect(()=> {
        if(ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }

    },[singleChat,input,response])
    const submit = async()=> {

        if(!input) {
            return toast.error("please enter content")
        }
        if(!singleChat) {
            return toast.error("chat not found")

        }
        setInput("")
        setLoading(true)
        const chatClone = structuredClone(singleChat)
        chatClone.messages.push({
            content:input,
            isImage:false,
            role:"user"
        })
        setSingleChat(chatClone)

        
        try {
            if(type==="text") {
                const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/message/send-text`,{
                userId:isAuth._id,
                chatId:singleChat._id,
                prompt:input
            })
            if(data.success) {
                setResponse(data.reply)
                chatClone.messages.push(data.reply)
                setSingleChat(chatClone) 
            } else {
                toast.error(data.message)
            }
            
            }else {
                const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/message/send-image`,{
                    userId:isAuth._id,
                    chatId:singleChat._id,
                    prompt:input
                })
            if(data.success) {
                setResponse(data.reply)
                chatClone.messages.push(data.reply)
                setSingleChat(chatClone) 
            } else {
                toast.error(data.message)
            }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setOriginalChats(prev=> {
                const otherChats = prev.filter((chat)=> chat._id!==singleChat._id)
                return [...otherChats,{...chatClone,name:chatClone.messages[0].content.slice(0,20)}]    
            })
        }

    }
  return (
    <div className='w-[100%] h-[100%]  flex flex-col  gap-[20px]'>
            {!singleChat?
            <>
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
            </>:<>
        <div   className={` flex-1 overflow-auto p-[30px] w-[90%] mx-auto `}>
            {
                singleChat.messages.map((message)=> {
                    return(<>
                    <Message message={message} setLoading={setLoading} loading={loading}/>
                    
                    
                    </>)
                })
            }
            <div ref={ref}></div>
            {loading?<Leading setLoading={setLoading}/>:<></>}

        </div>
        </>}

        <div className=' flex justify-center py-[20px]'>
            <div className=' flex gap-[10px] w-[90%] lg:w-[50%] border-[2px] rounded-full overflow-hidden'>
                <select disabled={loading} onChange={(e)=> {
                    setType(e.target.value)
                }} className='h-[100%] px-[10px] capitalize outline-none border-r-[1px]'>
                    <option value="text">text</option>
                    <option value="image">image</option>
                </select>
                <input disabled={loading} type='text' onKeyDown={(e)=> {
                    if(e.key==="Enter") {
                        submit()
                    }
                }} value={input} onChange={(e)=>setInput(e.target.value)} placeholder='type your prompt' className='flex-1 p-[10px] outline-none'/>
                <div onClick={() => {
                    if(!loading){
                        submit()
                    }
                }} className='bg-blue-500 rounded-full text-xl px-[15px] flex items-center text-white cursor-pointer'>
                    <IoSend/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Content
