import axios from 'axios'
import React, { use, useContext, useEffect } from 'react'
import { context } from './Provider'
import { useNavigate, useSearchParams } from 'react-router-dom'

const SuccessPage = () => {
    const {isAuth} = useContext(context)
    const [searchParams] = useSearchParams()
    const nav = useNavigate()
    const successOperation = async() => {
        try {
            const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/purchase/success-pay`,{
                transactionId:searchParams.get('id'),
                userId:isAuth._id
            })
            console.log(data)    
               
            if(data.success) {
                nav("/") 
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=> {
        successOperation()


    },[])
  return (
    <div>
      loading
    </div>
  )
}

export default SuccessPage
