import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const SERVER_URL = process.env.LIVEKIT_SERVER_URL;

export async function POST (req:NextRequest){
    const { userName, roomName,role } = await req.json();
    console.log(userName,roomName,role)
    if (!userName || !roomName||!role) {
      return NextResponse.json({ error: "Missing parameters" },{status:400});
    }
  try{
    //   const roomService = new RoomServiceClient(SERVER_URL!, API_KEY, API_SECRET);
    //   const rooms = await roomService.listRooms();
    //   const roomExists = rooms.some((r) => r.name === roomName);
    // console.log(rooms)
    //   if(!role){
    //    if(!roomExists){
    //      return NextResponse.json({ error:"The doctor has not yet created the room" },{status:404})
    //    }
    //   }

    const token = new AccessToken(API_KEY, API_SECRET, {
        identity: userName,
      });
    
      token.addGrant({
        roomJoin: true,
        canPublish: true, // Patient can also publish video/audio
        room: roomName,
      });
    
      return NextResponse.json({ token: await token.toJwt(), serverUrl: SERVER_URL });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(error:any){
    console.log(error)
    return NextResponse.json({ error: "Internal Server Error" },{status:500});
  }
    
  }