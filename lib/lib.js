import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.TOKEN_JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
const COOKIE_KEY = process.env.COOKIE_KEY
const secondsToExpire = 60 * 3

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    // .setExpirationTime(`${secondsToExpire} sec from now`)
    .setExpirationTime(Date.now() + secondsToExpire * 1000)
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function login(formData) {
  const LOGIN_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_LOGIN_ROUTE}`

  // Verify credentials && get the user
  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  // Query the Login API
  const response = await fetch(LOGIN_URL, {
    "method": "POST",
    "body": JSON.stringify(user),
    "headers": {
      "accept": "application/json, text/plain, */*",
      "content-language": "es",
      "content-type": "application/json;charset=UTF-8",
    },
  })
  const { data, status } = await response.json()

  if (data && status === 200) {
    // Add 'accessToken' to the user object
    user.accessToken = data.access_token
    user.password = null
  
    // Query the Login API
    const ADMIN_ID_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_IDENTITY}`
    const response = await fetch(`${ADMIN_ID_URL}?admin_id=${data.id}&limit=0&offset=0`, {
      "method": "GET",
      "headers": {
        "accept": "application/json, text/plain, */*",
        "content-language": "es",
        "content-type": "application/json;charset=UTF-8",
      },
    })
    const { data: data_user, status: status_user } = await response.json()

    user.full_name = data_user.result[0].fullName

    // Create the session
    const expires = new Date(Date.now() + secondsToExpire * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set(COOKIE_KEY, session, { expires, httpOnly: true });
  }
}

export async function logout() {
  // Destroy the session
  cookies().set(COOKIE_KEY, "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get(COOKIE_KEY)?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request) { // NextRequest
  const session = request.cookies.get(COOKIE_KEY)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + secondsToExpire * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: COOKIE_KEY,
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}