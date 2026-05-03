import axios from 'axios'
import React, { createContext,  useEffect, useState } from 'react'
export const context = createContext()
const Provider = ({children}) => {
    const [isAuth,setIsAuth] = useState(false)
    const [singleChat,setSingleChat] = useState(false)
    const [originalChats,setOriginalChats] = useState([])
    const getChats = async()=> {
            try {
                const {data} = await axios.post(process.env.REACT_APP_API_URL+"/chat/chats",{
                    userId:isAuth._id
                })
                if(data.success) {
                    setOriginalChats(data.chats)
                }
            } catch (error) {
                
            }
    }
    const [input,setInput] = useState(false)
    const value = {
        isAuth,setIsAuth,setSingleChat,
        singleChat,getChats,originalChats,setOriginalChats,
        input,setInput
    }
    const verify = async()=> {
        try {
            axios.defaults.withCredentials = true;
            const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/auth/isAuth`)
            if(data.success) {
                setIsAuth(data.user)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=> {

        verify()
    },[])
  return (
    <context.Provider value={value}>
        {children}
    </context.Provider>

  )
}

export default Provider
