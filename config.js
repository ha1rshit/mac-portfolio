// Configuration for AI Assistant
// Add your OpenAI API key here (get one from https://platform.openai.com/api-keys)
// Or use a free alternative like Hugging Face Inference API

const AI_CONFIG = {
    // Option 1: OpenAI API (requires API key)
    openai: {
        apiKey: 'YOUR_OPENAI_API_KEY', // Replace with your actual API key
        model: 'gpt-3.5-turbo',
        maxTokens: 150,
        temperature: 0.7
    },

    // Option 2: Hugging Face Inference API (free, no key needed for basic usage)
    huggingface: {
        model: 'microsoft/DialoGPT-medium',
        apiUrl: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        maxTokens: 150
    }
};

// Choose which AI service to use
const USE_AI_SERVICE = 'huggingface'; // Change to 'openai' if you have an API key
