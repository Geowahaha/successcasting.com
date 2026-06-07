import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      success: true, 
      received: body,
      message: 'POST works!'
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) });
  }
}
