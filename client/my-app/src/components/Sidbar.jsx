import React, { useContext, useEffect, useState } from 'react'
import { FaBrain } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { SiPaypal } from "react-icons/si";
import { CiUser } from "react-icons/ci";
import { context } from '../pages/Provider';
import { IoIosLogOut } from "react-icons/io";
import {  MdDarkMode } from "react-icons/md";
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from "moment"
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Sidbar = () => {
    const {isAuth,setIsAuth,setSingleChat,singleChat,getChats,originalChats,input,setInput}= useContext(context)
    const [chats,setChats] = useState(originalChats)
    const [search,setSearch] = useState("")
    const createChat = async()=> {
        setChats([...chats,{
            userId:isAuth._id,
            userName:isAuth.name,
            messages:[],
            name:"New Chat",
            createdAt:Date.now()
        }])
        try {
            const {data} = await axios.post(process.env.REACT_APP_API_URL+"/chat/create",{
                userId:isAuth._id,
                userName:isAuth.name
            })
            if(data.success)
            setChats([...chats,data.chat])
        } catch (error) {
            console.log(error)
        }
        
    }

    const filterBySearch = ()=> {
        let chatsCopy = originalChats.slice();
        if(search.length>0&&chatsCopy.length) {
            chatsCopy= chatsCopy.filter((chat) => {

                if(chat.messages.length>0&&chat.messages[0].content.toLowerCase().includes(search.toLowerCase())) {
                    return true
                }
                return false
            })
        }
        setChats(chatsCopy)
    }
    useEffect(()=> {
        getChats()
    },[])
    useEffect(()=> {
        setChats(originalChats)
    },[originalChats])
    useEffect(()=> {
        filterBySearch()
    },[search])
    const logout = async()=> {
        try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes,logout!"
        })
        if(result.isConfirmed) {
            const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`);
            if(data.success) {
            await Swal.fire({
                title: "logged out!",
                text: "Your logged out successfully",
                icon: "success"
            });
            setIsAuth(false)
            setSingleChat(false)
            
            }
        }

        } catch (error) {
            
        }
    }
    const deleteChat = async(chatId)=> {
        try {
const result = await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
})
if (result.isConfirmed) {
    const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/chat/delete`,{chatId})
    if(data.success) {
    Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
    });
    if(singleChat._id===chatId) {
        setSingleChat(false)
    }
    getChats()
    }else {
Swal.fire({
  icon: "error",
  title: "Oops...",
  text: data.message,
  footer: '<a href="#">Why do I have this issue?</a>'
});
    }
}
        } catch (error) {
            
        }
    }
    const nav = useNavigate()
    
    return (
    <div className=' flex flex-col gap-[20px] capitalize h-screen overflow-auto p-[20px] border-r-[1px] border-gray-300'>
        <div className=' flex items-center gap-[10px]'>
            <span className=' block p-[10px] bg-blue-600 rounded-lg text-white text-3xl'><FaBrain/></span>
            <div>
                <h1 className=' font-bold text-2xl'>quickCPT</h1>
                <p className=' text-blue-600 font-semibold'>intelligent ai assistant</p>
            </div>
        </div>
        <button onClick={()=>createChat()} className=' capitalize py-[10px] flex justify-center items-center font-bold rounded-lg bg-blue-600  text-white'>
            + new chat
        </button>
        <div className=' flex gap-[5px] rounded-3xl items-center p-[10px] border-[1px] border-gray-400'>
            <span><FaSearch/></span>
            <input type='text' value={search} onChange={(e)=>setSearch(e.target.value)} placeholder=' search for converarions' className=' text-sm font-semibold capitalize outline-none border-none flex-1' />
        </div>
        <div className=' flex-1'>
            {chats.length?<h1 className=' capitalize font-bold text-2xl mb-[10px]'>recent chats</h1>:<></>}
            <ul className=' flex flex-col gap-[10px]'>
                {
                    chats.map((chat)=> {
                        return(<>
                        <li className='p-[10px] parent  relative border-[1px] rounded-2xl cursor-pointer' onClick={()=> {
                            setSingleChat(chat)
                            nav("/")
                        }}>
                            <p className='font-semibold'>{chat.messages.length?chat.messages[0].content:chat.name}</p>
                            <p className=' text-sm font-semibold text-gray-600'>{moment(chat.createdAt).fromNow()}</p>
                            <p onClick={()=> {
                                deleteChat(chat._id)
                            }} className=' absolute cusrsor-pointer text-xl child hidden duration-300 right-[10px] bottom-[50%] translate-y-[50%]'>
                                <MdDelete />
                            </p>
                        </li>
                    </>)
                    })              
                }
            </ul>
            
        </div>

        <div onClick={()=>nav("/credits")} className=' cursor-pointer flex items-center rounded-lg gap-[5px] border-[1px] p-[10px]  font-semibold'>
            <span className=' text-2xl'><SiPaypal /></span>
            <div>
                <h1>credit:{isAuth.cradits}</h1>
                <p className='text-sm text-gray-500'>Lorem, ipsum dolor sit amet </p>
            </div>
        </div>
        <div className=' flex items-center  rounded-lg gap-[5px] border-[1px] p-[10px]  font-semibold'>
            <span className=' text-2xl '><MdDarkMode/> </span>
            <span className=' flex-1'>dark mode</span>
            <label htmlFor='dark'  className={` relative p-[3px] duration-300 ${input?"bg-blue-600":"bg-gray-400"} flex items-center cursor-pointer  rounded-full w-[70px]`}>
                <input type='checkbox' id="dark" onChange={(e)=> setInput(e.target.checked)} hidden />
                    <span className={` duration-300 relative inline-block w-[20px] ${!input?"right-[0px] ":" left-[43px]"} h-[20px] rounded-full bg-white`}>
                    </span>
            </label>
        </div>
        <div className=' flex items-center justify-between rounded-lg gap-[5px] border-[1px] p-[10px]  font-semibold'>
            <span className='p-[5px] rounded-full bg-gray-700 text-white'><CiUser/></span>
            <p className='flex-1'>{isAuth.name}</p>
            <span className=' cursor-pointer' onClick={()=>logout()}><IoIosLogOut/></span>
        </div>
    </div>
    )
}

export default Sidbar
