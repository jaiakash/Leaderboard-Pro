import { createContext,useState,useEffect } from "react";
import jwt_decode from  "jwt-decode"
import {useHistory} from "react-router-dom"



const AuthContext=createContext()
export default AuthContext;

export const AuthProvider=({children})=>{
    let [authTokens,setAuthTokens]=useState(localStorage.getItem('authTokens')?JSON.parse(localStorage.getItem('authTokens')):null)
    let [user,setUser]=useState(authTokens?jwt_decode(authTokens.access):null)
    const history=useHistory()
    let loginUser=async (e)=>
    {
        e.preventDefault();
        let response=await fetch('http://localhost:8000/api/token/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'username':e.target.UserName.value,'password':e.target.password.value
            })
        })
        let data = await response.json()
        if(response.status===200)
        {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens',JSON.stringify(data))
            history.push('/')
        }else{
            alert('ERROR!!!!')
        }
    }

    let logoutUser=()=>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history.push('/login')
    }
    let contextData={
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser
    }
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}