import {  getAuth } from "@clerk/nextjs/server";
import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const SERVER_URL = process.env.LIVEKIT_SERVER_URL;

export async function POST (req:NextRequest){
    const { userName, roomName } = await req.json();
     const { userId } =await getAuth(req)

     if (!userId) {
        return new Response(JSON.stringify({ error: "UnAuthenticated" }), { status: 401 });
      }
  
    if (!userName || !roomName) {
      return NextResponse.json({ error: "Missing parameters" },{status:400});
    }
  try{
    const token = new AccessToken(API_KEY, API_SECRET, {
        identity: userName,
      });
    
      token.addGrant({
        roomCreate: true,
        roomJoin: true,
        canPublish: true, // Doctor can publish video/audio
        room: roomName,
      });
    
      return NextResponse.json({ token: await token.toJwt(), serverUrl: SERVER_URL, roomName });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(error:any){
    console.log(error)
    return NextResponse.json({ error: "Internal Server Error" },{status:500}); 
  }
    
  }