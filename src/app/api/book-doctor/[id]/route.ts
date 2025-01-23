import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json({message:"internal server error"},{status:200})
  } catch (error) {
    console.log(error)
    return NextResponse.json({error:"internal server error"},{status:500})
  }
}
