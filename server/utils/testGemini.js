// Test script to verify Gemini API connection
require('dotenv').config();
const path = require('path');

// Load .env from server directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { callGeminiAPI } = require('./geminiAPI');

async function testGemini() {
  console.log('🧪 Testing Gemini API connection...\n');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in server/.env');
    console.error('   Please add: GEMINI_API_KEY=your_api_key_here');
    process.exit(1);
  }
  
  console.log('✅ API Key found:', `${process.env.GEMINI_API_KEY.substring(0, 10)}...${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)}`);
  console.log('   Testing with simple prompt...\n');
  
  try {
    const result = await callGeminiAPI('Say hello in exactly one word');
    console.log('\n✅ Success! Gemini API is working!');
    console.log('   Response:', result);
    console.log('\n🎉 Your API key is valid and working!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n💡 Next steps:');
    console.error('   1. Verify your API key at: https://makersuite.google.com/app/apikey');
    console.error('   2. Check if your API key has quotas remaining');
    console.error('   3. Ensure billing is enabled in Google Cloud Console');
    console.error('   4. Check the error messages above for specific issues');
    process.exit(1);
  }
}

testGemini();

