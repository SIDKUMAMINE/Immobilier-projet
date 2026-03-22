import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const city = searchParams.get('city');
    const type = searchParams.get('type');

    console.log('📥 Frontend API - Fetching properties from backend');
    console.log(`  Limit: ${limit}, City: ${city}, Type: ${type}`);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });

    if (city) queryParams.append('city', city);
    if (type) queryParams.append('type', type);

    const apiUrl = `${backendUrl}/api/v1/properties?${queryParams}`;
    console.log(`🔗 Calling backend: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`❌ Backend Error: ${response.status}`);
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: response.status }
      );
    }

    let data = await response.json();
    console.log(`✅ Backend returned ${Array.isArray(data) ? data.length : 0} properties`);
    
    // 🔥 AJOUTER DES IMAGES PAR DÉFAUT SI MANQUANTES
    const defaultImages = [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1570177494994-66b4709ba25d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    ];

    if (Array.isArray(data)) {
      data = data.map((prop: any, idx: number) => ({
        ...prop,
        image_url: prop.image_url && prop.image_url.trim() 
          ? prop.image_url 
          : defaultImages[idx % defaultImages.length]
      }));

      data.forEach((prop: any, idx: number) => {
        console.log(`  [${idx}] ${prop.title} - Image: ${prop.image_url ? '✅' : '❌'}`);
      });
    }

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('❌ Frontend API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
