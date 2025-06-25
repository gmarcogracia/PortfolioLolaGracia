import { NextRequest, NextResponse } from 'next/server'


// Type for your user data from backend
type UserData = {
  userId: string
  username: string
  roleId: number
}

// Type for error responses
type ErrorResponse = {
  error: string
  status?: number
}

export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}auth/getUserByCookie`
    console.log("BackendUrl")
    console.log(backendUrl);
    
    // Forward the entire cookie header
    const cookieHeader = request.headers.get('Cookie') || ''

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!backendResponse.ok) {
      const errorData: ErrorResponse = await backendResponse.json()
      return NextResponse.json(
        { error: errorData.error || 'Authentication failed' },
        { status: backendResponse.status }
      )
    }

    const userData: UserData = await backendResponse.json()
    return NextResponse.json(userData)

  } catch (error) {
    console.error('[AUTH VALIDATE ERROR]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}