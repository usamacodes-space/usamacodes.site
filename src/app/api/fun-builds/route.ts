import { NextResponse } from 'next/server';
import { getFunBuilds } from '@/lib/funBuildsStore';

export async function GET() {
  const builds = await getFunBuilds();
  return NextResponse.json({ builds });
}

