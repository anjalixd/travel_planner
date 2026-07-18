import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const preferences = await request.json();
    
    // Fallback safely if keys are missing
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'Missing API Authorization footprint. Set your keys in Vercel settings.' 
      }, { status: 401 });
    }

    // Direct structural execution request over standard web streams
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        messages: [
          { 
            role: 'system', 
            content: 'You are a highly structured travel engine. Return data ONLY as a JSON object matching these exact properties: itinerary (array of days containing dayNumber, theme, activities array with timeOfDay, title, description, estimatedDuration), budgetBreakdown (transportation, accommodation, food, localTransport, attractions, totalEstimatedCost), packingChecklist (array of items with item, category, packed), and travelTips (localCustoms array, currency, emergencyNumbers).' 
          },
          { 
            role: 'user', 
            content: `Create a fully operational travel itinerary starting from ${preferences.startingLocation} going to ${preferences.destination || 'a highly recommended alternative'}. The budget tier is ${preferences.budgetTier}. Make it exactly 3 days long.` 
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      throw new Error('Upstream LLM server dropped connectivity metrics.');
    }

    const data = await aiResponse.json();
    const parsedBlueprint = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(parsedBlueprint);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'AI application execution dropped runtime.' }, { status: 500 });
  }
}
