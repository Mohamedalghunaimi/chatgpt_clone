import React, { useContext } from 'react'
import Sidbar from '../components/Sidbar'
import { dummyPlans } from '../assets/assets'
import axios from 'axios'
import { context } from './Provider'

const Credits = () => {
    const {isAuth} = useContext(context)
    const buyNow = async(planId)=> {
        try {
            const {data} = await axios.post(process.env.REACT_APP_API_URL+"/purchase/purchase-plan",{
                planId,
                userId:isAuth._id
            })
            if(data.success) {
                window.location.assign(data.url)
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <>
        <div  className=' flex'>
        <div className='w-[300px] hidden md:block'>
            <Sidbar />
        </div>
        <div className=' p-[20px] flex-1 capitalize max-h-screen flex justify-center items-center '>
            <div>
                <h1 className=' text-3xl text-slate-800 font-bold text-center mb-[10px]'>
                    credits plan
                </h1>
                <div className=' flex justify-center gap-[20px] flex-wrap  '>
                    {
                        dummyPlans.map((plan)=>(
                            <div className=' shadow-md border p-[25px] flex flex-col gap-[10px]'>
                                <h1 className='font-bold text-xl'>{plan.name}</h1>
                                <p><b className=' text-xl'>${plan.price}</b>/{plan.credits} credits</p>
                                <ul className=' list-inside list-disc flex-1'>
                                    {
                                        plan.features.map((feature)=>(
                                            <li>{feature}</li>
                                        ))
                                    }
                                </ul>
                                <button onClick={()=>buyNow(plan._id)} className='w-[100%] font-bold text-lg py-[10px] text-white capitalize rounded-xl bg-blue-500 duration-300 hover:bg-blue-700 '>
                                    buy now
                                </button>
                            </div>
                        ))
                    }

                </div>

            </div>
        </div>
    </div>
    </>

  )
}

export default Credits
