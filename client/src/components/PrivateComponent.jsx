import React from 'react'
import useAuthStatus from '../hooks/useAuthStatus'
import { Loader } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const PrivateComponent = () => {
  const { userExist , checkingUser} = useAuthStatus()
  const location = useLocation()

  if(checkingUser){
    return (
        <Loader/>
    )
  }

  return userExist ? <Outlet/> : <Navigate to="/login" state={{ from: location }} replace />
}

export default PrivateComponent
