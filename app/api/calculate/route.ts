import { NextRequest, NextResponse } from 'next/server';

interface CalculateRequest {
  area: number;
  crop_type: string;
}

interface CalculateResponse {
  credits: number;
  area: number;
  crop_type: string;
  factor: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculateRequest = await request.json();
    
    // Validate required fields
    if (!body.area || !body.crop_type) {
      return NextResponse.json(
        { error: 'Missing required fields: area and crop_type' },
        { status: 400 }
      );
    }

    // Validate area is a positive number
    if (typeof body.area !== 'number' || body.area <= 0) {
      return NextResponse.json(
        { error: 'Area must be a positive number' },
        { status: 400 }
      );
    }

    // Validate crop_type is a string
    if (typeof body.crop_type !== 'string') {
      return NextResponse.json(
        { error: 'Crop type must be a string' },
        { status: 400 }
      );
    }

    // Determine factor based on crop type
    let factor: number;
    const cropTypeLower = body.crop_type.toLowerCase().trim();
    
    if (cropTypeLower === 'rice') {
      factor = 1.5;
    } else {
      factor = 2.0;
    }

    // Calculate credits
    const credits = body.area * factor;

    // Prepare response
    const response: CalculateResponse = {
      credits: Math.round(credits * 100) / 100, // Round to 2 decimal places
      area: body.area,
      crop_type: body.crop_type,
      factor: factor
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error in calculate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to calculate credits.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to calculate credits.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to calculate credits.' },
    { status: 405 }
  );
}
