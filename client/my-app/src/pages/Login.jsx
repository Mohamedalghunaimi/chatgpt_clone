import React, { useContext, useState } from 'react'
import { context } from './Provider'
import axios from "axios"
import { toast } from 'react-toastify'
import { data } from 'react-router-dom'
const Login = () => {
  const {setIsAuth} = useContext(context)
  const [state,setState] = useState("login")
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const loginOrRegister = async()=> {
    try {
      if(state==="login") {
        if(!email||!password) {
          return toast.error("missing details !")
        }
        axios.defaults.withCredentials = true
        const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`,{
          email,password
        })
        console.log(data)
        if(data.success) {
          toast.success("done !")
          setIsAuth(data.user)
        }else {
          toast.error(data.message)
        }
      } else {
        if(!email||!password||!name) {
          return toast.error("missing details !")
        }  
        axios.defaults.withCredentials = true
        const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`,{
          email,password,name
        })      
        if(data.success) {
          toast.success("done !")
          setIsAuth(data.user)
        }else {
          toast.error(data.message)
        }
      }
      
    } catch (error) {
      console.log(data)
    }

  }
  return (
    <div className=' h-screen w-full bg-gradient-to-b from-blue-50 to-blue-200 flex justify-center items-center'>
      <div className=' capitalize border-2 border-blue-200 p-[30px] flex  shadow-lg flex-col gap-[10px] rounded-xl w-[30%] min-w-[500px] bg-white'>
        <h1 className=' text-center font-bold text-2xl'><span className=' text-blue-600'>user </span>{state}</h1>
        {state!=="login"&&<>
        <label htmlFor='name' className='font-semibold text-gray-600'>name</label>
        <input  value={name} onChange={(e)=>setName(e.target.value)} type='text' id='name' placeholder='enter your name' className=' p-[10px] border-[1px] border-gray-300 rounded-lg' />
        </>
        }
        <label htmlFor='email'  className='font-semibold text-gray-600'>email</label>
        <input  value={email} onChange={(e)=>setEmail(e.target.value)} id='email' type='email' placeholder='enter your email' className=' p-[10px] border-[1px] border-gray-300 rounded-lg' />
        <label htmlFor='password'   className='font-semibold text-gray-600'>password</label>
        <input   value={password} onChange={(e)=>setPassword(e.target.value)}  id='password' type='password' placeholder='enter your password'  className=' p-[10px] border-[1px] border-gray-300 rounded-lg'  />
        {state==="login"?<div className=' flex items-center gap-[5px]'>
        <p  className=' font-semibold text-gray-700 text-sm'>i don't hava an account? </p>
        <span className=' duration-300 hover:underline text-blue-700 text-sm cursor-pointer' onClick={()=> {
          setState("sign up")
        }}>click here</span>
        </div>:<div className=' flex items-center gap-[5px]'>
        <p className=' font-semibold text-gray-700 text-sm'>i already hava an account? </p>
        <span className=' duration-300 hover:underline text-blue-700 text-sm cursor-pointer'  onClick={()=> {
          setState("login")
        }}>click here</span>  
        </div>}
        <button onClick={()=>loginOrRegister()}  className='duration-300 hover:bg-blue-700 py-[10px] rounded-lg text-xl bg-blue-600 capitalize font-semibold text-white'>
          {state}
        </button>
      </div>
      
    </div>
  )
}

export default Login
