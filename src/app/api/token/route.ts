import { NextRequest, NextResponse } from 'next/server';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');
  const username = req.nextUrl.searchParams.get('username');
  const role = req.nextUrl.searchParams.get('role');
  const { userId } =await getAuth(req)
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "UnAutheticated" }), { status: 401 });
  }


  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  } else if (!username) {
    return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

try {
  const roomService = new RoomServiceClient(wsUrl, apiKey, apiSecret);
  const rooms = await roomService.listRooms();
  const roomExists = rooms.some((r) => r.name === room);

  if(!role){
   if(!roomExists){
     return NextResponse.json({ error:"The doctor has not yet created the room" },{status:404})
   }
  }

 const at = new AccessToken(apiKey, apiSecret, { identity: username });

 at.addGrant({ room, roomJoin: true, canPublish: role === "doctor", canSubscribe: true });

 return NextResponse.json({ token: await at.toJwt() });
} catch (error) {
  console.log(error)
  return NextResponse.json({ error:"Internal Server error" },{status:500})
}

 
}