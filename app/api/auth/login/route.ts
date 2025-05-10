import { NextResponse } from 'next/server'  
import { createSession, setCookie } from '@/lib/core/auth'  
import { fetchUserData, getLoginUrl } from '@/components/features/auth/functions';
  
const LOGIN_URL = getLoginUrl();

export async function POST(request: Request) {  
  try {  
    const { email, password } = await request.json()
    
    console.log(email, password)
      
    // Call your existing login API  
    const response = await fetch(LOGIN_URL, {  
      method: 'POST',  
      headers: { 
        "Accept": "application/json",
        "Content-Language": "es",
        "Content-Type": "application/json;charset=UTF-8",
       },  
      body: JSON.stringify({ email, password }),  
    })  
      
    if (!response.ok) {  
      const error = await response.json()  
      return NextResponse.json(  
        { message: error.message || 'Authentication failed' },  
        { status: 401 }  
      )  
    }  
    // Get user login response - Access token
    const userLoginResponse = await response.json()  

    // Get user response - User data
    const { data: userResponse } = await fetchUserData(userLoginResponse.data.id);

    // Create session with user data + token
    const { user, session } = await createSession(  
      userLoginResponse.accessToken,  
      userResponse.result[0]
    )  
      
    await setCookie(session)  
      
    return NextResponse.json({ user })  
  } catch (error) {  
    console.error('Login error:', error)  
    return NextResponse.json(  
      { message: 'Internal server error' },  
      { status: 500 }  
    )  
  }  
}  