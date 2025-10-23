# Live Chat Setup Instructions

## Quick Setup

1. **Create a `.env` file** in your project root with your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Get your Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **The chat is already integrated** into your main layout and will appear as a floating button in the bottom-right corner.

## Features

✅ **AI-Powered Responses** - Uses Gemini 2.5 Flash model  
✅ **Volunteer-Specific Context** - Trained for volunteer platform queries  
✅ **Real-time Chat** - Instant responses with loading indicators  
✅ **Responsive Design** - Works on all device sizes  
✅ **Chat History** - Maintains conversation context  
✅ **Error Handling** - Graceful error handling  

## Usage

The live chat will appear as a floating button in the bottom-right corner of your application. Users can:

- Click the button to open the chat
- Ask questions about volunteer opportunities
- Get help with platform navigation
- Receive guidance on registration processes
- Get general support

## Components Available

- `SimpleChat` - Main chat component (already integrated)
- `VolunteerChatBot` - Advanced chat with quick actions
- `LiveChat` - Basic chat implementation
- `useChat` - Custom hook for chat functionality
- `chatService` - Service for AI API calls

## Troubleshooting

If you encounter any issues:

1. **Check your API key** - Ensure it's correctly set in `.env`
2. **Restart your dev server** - After adding the `.env` file
3. **Check browser console** - For any error messages
4. **Verify network connection** - Ensure Gemini API is accessible

## Customization

You can customize the chat by modifying:
- `src/features/chat/chatService.js` - AI responses and context
- `src/features/chat/SimpleChat.jsx` - UI and styling
- `src/features/chat/useChat.js` - Chat logic and state management

The chat is now ready to use! 🚀
