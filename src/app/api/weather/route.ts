import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const unit = searchParams.get('unit') || 'F';

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Using Open-Meteo API (free, no API key required)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=${unit}`;

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error('Weather service unavailable');
    }

    const data = await response.json();

    if (!data.current) {
      throw new Error('Invalid weather data');
    }

    const temperature = data.current.temperature_2m;
    const weatherCode = data.current.weather_code;

    // Weather code to condition mapping (WMO codes)
    const weatherConditions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    const condition = weatherConditions[weatherCode] || 'Unknown';

    // Try to get location name using reverse geocoding (optional)
    let location = 'Your location';
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`;
      const geoResponse = await fetch(geoUrl, {
        headers: {
          'User-Agent': 'DigitalClosetApp',
        },
      });

      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        if (geoData.address) {
          const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county;
          const country = geoData.address.country;
          if (city && country) {
            location = `${city}, ${country}`;
          } else if (city) {
            location = city;
          } else if (country) {
            location = country;
          }
        }
      }
    } catch (error) {
      // Ignore geocoding errors
    }

    return NextResponse.json({
      temperature,
      condition,
      location,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
