import { NextRequest, NextResponse } from 'next/server';
import { getTranscript } from '@/lib/soroban';

export async function POST(request: NextRequest) {
  try {
    const { studentAddress } = await request.json();

    if (!studentAddress) {
      return NextResponse.json(
        { error: 'Student address is required' },
        { status: 400 }
      );
    }

    const transcript = await getTranscript(studentAddress);

    return NextResponse.json({
      student: studentAddress,
      credentials: transcript || [],
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify credentials' },
      { status: 500 }
    );
  }
}
