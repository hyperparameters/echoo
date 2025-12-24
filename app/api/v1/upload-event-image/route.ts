import { NextRequest, NextResponse } from 'next/server';
import { UploadService } from '@/services/upload';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const INTERNAL_USERNAME = process.env.INTERNAL_USERNAME || 'internal_service';
const INTERNAL_PASSWORD = process.env.INTERNAL_PASSWORD || 'internal_secret_key_2024';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const eventId = formData.get('event_id') as string;
    const userId = formData.get('user_id') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Step 1: Upload to Filecoin
    const filecoinResponse = await UploadService.uploadFile(
      file,
      userId,
      undefined, // No progress callback for API route
      'event-image'
    );

    // Step 2: Save image to database via internal API
    // Using fields that match what the backend code expects (name, cid, filecoin_url, etc.)
    const imageData = {
      name: file.name,
      user_id: parseInt(userId),
      event_id: parseInt(eventId),
      filecoin_url: filecoinResponse.filecoin_url,
      cid: filecoinResponse.cid,
      size: filecoinResponse.size,
      is_selfie: false,
      // Include schema fields as well for compatibility
      file_name: file.name,
      file_size: filecoinResponse.size,
      file_type: file.type,
      filecoin_cid: filecoinResponse.cid,
      is_processed: false,
      is_public: false,
    };

    // Create Basic Auth header
    const authString = Buffer.from(`${INTERNAL_USERNAME}:${INTERNAL_PASSWORD}`).toString('base64');

    const backendResponse = await fetch(`${API_BASE_URL}/api/v1/internal/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(imageData),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error('Failed to save image to database:', errorData);
      return NextResponse.json(
        { error: 'Failed to save image to database', details: errorData },
        { status: backendResponse.status }
      );
    }

    const savedImage = await backendResponse.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      filecoin: filecoinResponse,
      image: savedImage,
    });
  } catch (error: any) {
    console.error('Error uploading event image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}

