import { OpenAI } from 'openai';

/**
 * API Route Handler for OpenAI betting analysis
 * This route accepts sport event details and returns AI-generated betting insights
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate the request data
    if (!body.sport || !body.league || !body.teams) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get API key from environment variable
    // In a real implementation, you would store this in .env.local
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Construct the prompt based on event details
    const prompt = constructPrompt(body);
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert sports betting analyst with deep knowledge of statistics, team dynamics, and betting strategies. Provide detailed, data-driven betting insights." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2, // Lower temperature for more focused, analytical responses
      max_tokens: 2000,
      response_format: { type: "json_object" } // Request JSON response
    });
    
    // Extract and process the response
    const analysisText = completion.choices[0].message.content;
    let analysisData;
    
    try {
      analysisData = JSON.parse(analysisText);
    } catch (error) {
      // If parsing fails, return the raw text
      analysisData = { rawAnalysis: analysisText };
    }
    
    // Return the analysis
    return new Response(
      JSON.stringify({
        event: {
          sport: body.sport,
          league: body.league,
          teams: body.teams,
          date: body.eventDate,
        },
        betType: body.betType,
        insights: analysisData
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error processing OpenAI analysis:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate analysis' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Constructs a detailed prompt for OpenAI based on event details
 */
function constructPrompt(data) {
  return `
    I need a detailed betting analysis for the following event:
    
    Sport: ${data.sport}
    League: ${data.league}
    Teams/Participants: ${data.teams}
    Event Date: ${data.eventDate || 'Upcoming'}
    Bet Type to Analyze: ${data.betType || 'All available options'}
    ${data.customQuestion ? `Additional Question: ${data.customQuestion}` : ''}
    
    Please provide a comprehensive betting analysis with the following structure in JSON format:
    
    {
      "summary": "A detailed overview of your betting recommendation and rationale",
      "keyFactors": ["List key statistical factors that influence your recommendation"],
      "recommendation": "Your specific betting recommendation (team, spread, over/under, etc.)",
      "confidence": "A decimal between 0 and 1 indicating confidence level",
      "alternativeBets": [{"bet": "Alternative bet 1", "confidence": 0.7}, {"bet": "Alternative bet 2", "confidence": 0.6}],
      "risksToConsider": ["Risk factor 1", "Risk factor 2"],
      "additionalInsights": "Any other relevant information for betting decisions"
    }
    
    Base your analysis on team statistics, recent performance, head-to-head history, injuries, venue factors, weather (if relevant), and betting trends.
  `;
}
