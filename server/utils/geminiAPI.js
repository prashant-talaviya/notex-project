const axios = require('axios');

// Cache for available models (to avoid calling ListModels every time)
let availableModelsCache = null;

// List available models from Gemini API
async function listAvailableModels() {
  if (availableModelsCache) {
    return availableModelsCache;
  }

  try {
    // Try v1beta first (usually has more models)
    const apiVersions = ['v1beta', 'v1'];
    
    for (const apiVersion of apiVersions) {
      try {
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/json" },
          timeout: 10000
        });

        if (response.data && response.data.models) {
          const models = response.data.models
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name.replace('models/', ''));
          
          availableModelsCache = models;
          console.log(`✅ Found ${models.length} available Gemini models: ${models.join(', ')}`);
          return models;
        }
      } catch (error) {
        // Try next API version
        continue;
      }
    }
  } catch (error) {
    console.error('⚠️  Could not list available models:', error.message);
  }

  // Fallback to default models if listing fails
  return ['gemini-pro', 'gemini-1.0-pro'];
}

// Helper function to make Gemini API call with fallback models
async function callGeminiAPI(prompt, model = null) {
  // Check if API key is set
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables. Please add it to server/.env');
  }

  // Get available models (with fallback)
  let models;
  if (model) {
    models = [model];
  } else {
    try {
      models = await listAvailableModels();
      // Add fallback models in case listing failed
      if (!models || models.length === 0) {
        models = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
      }
    } catch (error) {
      // Use fallback models
      models = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    }
  }

  // Try v1beta API first (usually has more models), then v1
  const apiVersions = ['v1beta', 'v1'];
  
  const errors = []; // Collect errors for debugging

  for (const apiVersion of apiVersions) {
    for (const modelName of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const response = await axios.post(
          url,
          {
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          },
          {
            headers: {
              "Content-Type": "application/json"
            },
            timeout: 30000 // 30 second timeout
          }
        );

        if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
          console.log(`✅ Successfully using Gemini model: ${modelName} (${apiVersion})`);
          return response.data.candidates[0].content.parts[0].text;
        }
      } catch (error) {
        const errorInfo = {
          model: modelName,
          version: apiVersion,
          status: error.response?.status,
          message: error.response?.data?.error?.message || error.message,
          code: error.response?.data?.error?.code
        };
        errors.push(errorInfo);
        
        // If it's a 404 (model not found), try next model
        if (error.response?.status === 404) {
          continue;
        }
        
        // If it's a 400 or 403, log it but continue trying
        if (error.response?.status === 400 || error.response?.status === 403) {
          console.error(`⚠️  Error with ${modelName} (${apiVersion}): ${errorInfo.message}`);
          continue;
        }
        
        // For network errors or other issues, continue to next model
        continue;
      }
    }
  }

  // If we get here, all models failed - show detailed error info
  console.error('❌ All Gemini API models failed. Errors encountered:');
  errors.slice(0, 5).forEach((err) => {
    console.error(`   ${err.model} (${err.version}): ${err.message || 'Unknown error'}`);
  });
  
  console.error('\n📋 Troubleshooting steps:');
  console.error('   1. Verify GEMINI_API_KEY is set in server/.env');
  console.error('   2. Check if your API key is valid at https://makersuite.google.com/app/apikey');
  console.error('   3. Ensure your API key has access to Gemini models');
  console.error('   4. Check API quotas and billing at https://console.cloud.google.com/');
  console.error('   5. Your API key might be restricted - check API key restrictions in Google Cloud Console');
  
  throw new Error(`All Gemini API models failed. Last error: ${errors[errors.length - 1]?.message || 'Unknown error'}`);
}

// Export for testing
exports.callGeminiAPI = callGeminiAPI;

exports.askGemini = async (query, noteText) => {
  try {
    const prompt = `Based on the following note content, answer the question clearly and concisely:

Note Content:
${noteText}

Question: ${query}

Please provide a clear and helpful answer:`;

    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error('Failed to get response from Gemini API: ' + error.message);
  }
};

exports.generateDailyTip = async () => {
  try {
    const prompt = `Generate a motivational study tip for today. Keep it short (one sentence) and inspiring.`;
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Gemini API Error (daily tip):', error.message);
    return "Stay focused and take breaks to maintain productivity!";
  }
};

exports.generateAIAction = async (action, noteText) => {
  try {
    let prompt = '';
    
    switch(action) {
      case 'summarize':
        prompt = `Summarize the following note content in a clear and concise way:\n\n${noteText}`;
        break;
      case 'quiz':
        prompt = `Create 5 quiz questions based on the following note content:\n\n${noteText}`;
        break;
      case 'explain':
        prompt = `Explain the key concepts in the following note content in simple terms:\n\n${noteText}`;
        break;
      case 'flashcards':
        prompt = `Create 5 flashcard pairs (question and answer) based on the following note content:\n\n${noteText}`;
        break;
      default:
        prompt = `Process the following note content:\n\n${noteText}`;
    }

    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error('Failed to get response from Gemini API: ' + error.message);
  }
};

