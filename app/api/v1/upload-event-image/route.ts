import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const INTERNAL_USERNAME = process.env.INTERNAL_USERNAME || 'internal_service';
const INTERNAL_PASSWORD = process.env.INTERNAL_PASSWORD || 'internal_secret_key_2024';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const filecoinResponseStr = formData.get('filecoin_response') as string;
    const fileName = formData.get('file_name') as string;
    const fileType = formData.get('file_type') as string;
    const eventId = formData.get('event_id') as string;
    const userId = formData.get('user_id') as string;

    if (!filecoinResponseStr) {
      return NextResponse.json(
        { error: 'Filecoin upload response is required' },
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

    // Parse Filecoin response (uploaded from client)
    const filecoinResponse = JSON.parse(filecoinResponseStr);

    // Step 1: Get the database user_id from Privy ID
    // The userId from frontend is a Privy DID (did:privy:...), we need to find the database user
    // Get the Privy token from the request headers
    const authHeader = request.headers.get('authorization');
    let dbUserId: number;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        // Try to get user by Privy ID from the backend using the token
        const userLookupResponse = await fetch(`${API_BASE_URL}/api/v1/profile`, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
          },
        });
        
        if (userLookupResponse.ok) {
          const userProfile = await userLookupResponse.json();
          dbUserId = userProfile.id;
          console.log('✅ Found user ID:', dbUserId, 'for Privy ID:', userId);
        } else {
          const errorText = await userLookupResponse.text().catch(() => 'Unknown error');
          console.error('❌ Profile lookup failed:', {
            status: userLookupResponse.status,
            statusText: userLookupResponse.statusText,
            error: errorText
          });
          throw new Error(`Profile lookup failed: ${userLookupResponse.status} - ${errorText}`);
        }
      } catch (error: any) {
        console.error('❌ Failed to resolve user ID from profile:', error);
        // Fallback: try to parse as integer
        const parsedId = parseInt(userId);
        if (!isNaN(parsedId)) {
          dbUserId = parsedId;
          console.log('⚠️ Using parsed user ID as fallback:', dbUserId);
        } else {
          return NextResponse.json(
            { error: 'Failed to resolve user ID. Please ensure you are logged in.', details: error.message },
            { status: 400 }
          );
        }
      }
    } else {
      // No auth header - try to parse as integer (fallback)
      const parsedId = parseInt(userId);
      if (!isNaN(parsedId)) {
        dbUserId = parsedId;
        console.log('⚠️ No auth header, using parsed user ID:', dbUserId);
      } else {
        return NextResponse.json(
          { error: 'Authorization required. Please ensure you are logged in.' },
          { status: 401 }
        );
      }
    }

    // Step 2: Save image to database via internal API
    const imageData = {
      file_name: fileName || filecoinResponse.name,
      user_id: dbUserId,
      event_id: parseInt(eventId),
      filecoin_url: filecoinResponse.filecoin_url,
      filecoin_cid: filecoinResponse.cid,
      cid: filecoinResponse.cid,  // Alias for compatibility
      file_size: filecoinResponse.size,
      file_type: fileType || 'image/jpeg',
      is_selfie: false,
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
      const errorText = await backendResponse.text().catch(() => 'Unknown error');
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      console.error('❌ Failed to save image to database:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        error: errorData,
        imageData: {
          file_name: imageData.file_name,
          user_id: imageData.user_id,
          event_id: imageData.event_id
        }
      });
      return NextResponse.json(
        { error: 'Failed to save image to database', details: errorData },
        { status: backendResponse.status }
      );
    }

    const savedImage = await backendResponse.json().catch(() => ({}));
    console.log('✅ Image saved to database:', {
      imageId: savedImage?.id,
      fileName: imageData.file_name,
      userId: imageData.user_id,
      eventId: imageData.event_id,
      filecoinUrl: imageData.filecoin_url
    });

    return NextResponse.json({
      success: true,
      filecoin: filecoinResponse,
      image: savedImage,
    });
  } catch (error: any) {
    console.error('❌ Error uploading event image:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

