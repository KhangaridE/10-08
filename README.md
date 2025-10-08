# AI Knowledge Bot - 知恵の輪

A Next.js application that provides internal business support using OpenAI's GPT-4o and file search capabilities. This is a web version of the original Streamlit application with the same AI logic.

## Features

- **AI-powered Support**: Uses GPT-4o with file search to answer business questions
- **Slack Integration**: Searches through historical Slack conversations for relevant context
- **Japanese Language Support**: Designed for Japanese internal business communication
- **Real-time Chat**: Interactive chat interface with conversation history

## Setup for Vercel Deployment

### Prerequisites

1. OpenAI API key with GPT-4o access
2. Vector store ID containing your Slack conversation data
3. Vercel account

### Environment Variables

Set these in your Vercel project settings or `.env.local` for local development:

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_VECTOR_STORE_ID` - Vector store ID (defaults to `vs_68dc94afddec8191a2ecd1af0a1d0b09`)
- `OPENAI_MODEL` - Model to use (defaults to `gpt-4o`)
3. `npm i`
4. `npm run dev` → http://localhost:3000
5. **Deploy to Vercel**:
- Create a new Vercel project from this repo
- Set the same env vars in Project Settings → Environment Variables
- Deploy


### Notes
- This uses the **OpenAI Responses API** with the **file_search** tool, just like your Streamlit app. If the vector store lives in your OpenAI account, the ID will work as-is.
- The long **SYSTEM_PROMPT** from your `app.py` should be pasted into `app/api/chat/route.ts` (replace the placeholder).
- For streaming responses, we could switch to Server-Sent Events (SSE) later. For now, this uses a simple JSON response for reliability.