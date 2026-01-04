import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Validate base64 image
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const prompt = `Analyze this clothing item and provide the following information in JSON format:
{
  "category": "Top" or "Bottom" or "Shoe",
  "colors": ["array of dominant colors (choose from: Black, White, Gray, Brown, Beige, Red, Pink, Orange, Yellow, Green, Blue, Purple, Pattern, Multi)"],
  "material": "Heavy" or "Medium" or "Light"
}

Category rules:
- Top: Shirts, blouses, sweaters, jackets, coats, hoodies, tops
- Bottom: Pants, jeans, shorts, skirts
- Shoe: Sneakers, boots, sandals, heels, any footwear

Material rules:
- Heavy: Sweaters, coats, jackets, thick fabric items
- Medium: Regular shirts, pants, jeans, standard clothing
- Light: T-shirts, shorts, thin fabric items

Respond with ONLY the JSON, no additional text.`;

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Extract JSON from the response
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Try to fix common JSON issues
      const cleanedContent = jsonMatch[0]
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"');
      result = JSON.parse(cleanedContent);
    }

    // Validate the result
    const validCategories = ['Top', 'Bottom', 'Shoe'];
    const validColors = ['Black', 'White', 'Gray', 'Brown', 'Beige', 'Red', 'Pink', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pattern', 'Multi'];
    const validMaterials = ['Heavy', 'Medium', 'Light'];

    // Ensure category is valid, default to 'Top' if not
    if (!validCategories.includes(result.category)) {
      result.category = 'Top';
    }

    // Ensure colors array contains valid colors
    if (Array.isArray(result.colors)) {
      result.colors = result.colors.filter((color: string) => validColors.includes(color));
      if (result.colors.length === 0) {
        result.colors = ['Multi']; // Default if no valid colors detected
      }
    } else {
      result.colors = ['Multi'];
    }

    // Ensure material is valid
    if (!validMaterials.includes(result.material)) {
      result.material = 'Medium';
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
