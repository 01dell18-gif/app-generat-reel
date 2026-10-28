import { NextRequest, NextResponse } from 'next/server';
import { runACGTDeterministicAnalysis } from '@/lib/critic-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assets, format, canvasWidth, canvasHeight } = body;

    if (!assets || !format) {
      return NextResponse.json(
        { error: 'Missing required parameters: assets and format' },
        { status: 400 }
      );
    }

    // Run the ACGT deterministic visual design analysis
    const report = runACGTDeterministicAnalysis(
      assets,
      format,
      canvasWidth || 800,
      canvasHeight || 800
    );

    return NextResponse.json(report, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process AI Critic analysis', details: error.message },
      { status: 500 }
    );
  }
}
