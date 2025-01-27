import React from 'react'
import { useAppSelector } from '../redux/hooks'

function Dashboard() {
  const userInfo=useAppSelector((state)=>state.auth.userInfo);
  console.log(userInfo);
  return (
     <>
      <h1>Hello from the Dashboard Page</h1>
     </>
  )
}

export default Dashboard