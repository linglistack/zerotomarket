# ZeroToMarket AgentKit Backend

A sophisticated multi-agent marketing system powered by AgentKit, Clarifai, and Apify.

## 🤖 Architecture

This backend implements a **true multi-agent system** using AgentKit where specialized AI agents collaborate:

- **🧠 StrategistAgent**: Analyzes products and creates marketing strategies (Clarifai)
- **🔍 ResearcherAgent**: Scrapes competitor data and market insights (Apify)  
- **✍️ CreatorAgent**: Generates platform-specific content (Clarifai)
- **📋 CoordinatorAgent**: Optimizes and finalizes campaigns (Clarifai)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file:

```bash
# Clarifai API
CLARIFAI_PAT=your_clarifai_pat_token_here

# Apify API  
APIFY_API_TOKEN=your_apify_api_token_here

# Server Configuration
PORT=8000
AGENTKIT_PORT=3010
NODE_ENV=development

# Inngest (for local dev server integration)
INNGEST_EVENT_KEY=dummy_key_for_local_dev
INNGEST_SIGNING_KEY=dummy_signing_key_for_local_dev
```

### 3. Start Development Servers

**Terminal 1 - AgentKit Backend:**
```bash
npm run dev
```

**Terminal 2 - Inngest Dev Server (optional for debugging):**
```bash
npx inngest-cli@latest dev -u http://localhost:3010
```

The backend will start:
- 🚀 **API Server**: `http://localhost:8000`
- 🤖 **AgentKit Server**: `http://localhost:3010`  
- 📊 **Inngest Dev UI**: `http://localhost:8288` (if running)

## 📡 API Endpoints

### Start Campaign
```http
POST /start-campaign
Content-Type: application/json

{
  "name": "MeetingMind",
  "description": "AI meeting assistant that generates summaries and action items",
  "target_audience": "Remote team leaders",
  "industry": "SaaS"
}
```

### Get Campaign Status
```http
GET /campaign/{campaign_id}
```

### Health Check
```http
GET /health
```

## 🔄 Agent Workflow

1. **Parallel Execution**: StrategistAgent + ResearcherAgent run simultaneously
2. **Sequential Phases**: CreatorAgent waits for both, then CoordinatorAgent finalizes
3. **Real-time Updates**: Agent status tracked throughout workflow
4. **State Management**: AgentKit manages inter-agent communication

## 🛠 Technology Stack

- **🤖 AgentKit**: Multi-agent orchestration and routing
- **⚡ Fastify**: High-performance web server
- **🧠 Clarifai**: AI strategy, content generation, and optimization
- **🕷️ Apify**: Competitive intelligence and web scraping
- **🔧 TypeScript**: Type-safe development
- **📊 Inngest**: Local development debugging (optional)

## 🏗 Project Structure

```
backend/
├── src/
│   ├── agents/          # AgentKit agent implementations
│   │   ├── strategist.ts    # Marketing strategy analysis
│   │   ├── researcher.ts    # Competitive research  
│   │   ├── creator.ts       # Content generation
│   │   ├── coordinator.ts   # Campaign optimization
│   │   └── network.ts       # Agent network orchestration
│   ├── tools/           # Shared AgentKit tools
│   │   └── index.ts         # Status tracking, data management
│   ├── types/           # TypeScript definitions
│   │   └── index.ts         # Campaign, agent, and result types
│   └── server.ts        # Main Fastify server
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## 📋 Development Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript  
npm start            # Start production server
npm run agent-dev    # Start AgentKit agents directly
```

## 🎯 Prize Track Compliance

- ✅ **AgentKit**: Multi-agent network with deterministic routing
- ✅ **Clarifai**: Strategy analysis, content generation, optimization  
- ✅ **Apify**: Competitive intelligence and market research
- ✅ **Top Overall**: Complete autonomous marketing system

## 🔍 Debugging with Inngest Dev Server

For advanced debugging, the AgentKit server integrates with Inngest Dev Server:

1. Start the dev server: `npx inngest-cli@latest dev -u http://localhost:3010`
2. Open: `http://localhost:8288`
3. See real-time agent execution, token usage, and step-by-step traces

## 🚨 Important Notes

- **Local Development**: AgentKit runs completely locally without needing Inngest cloud
- **API Costs**: Only pay for LLM calls (Clarifai) and scraping (Apify)
- **Demo Mode**: Includes mock responses for rapid testing
- **Production Ready**: Structured for easy deployment and scaling

## 🤝 Integration with Frontend

The React frontend connects to:
- **API**: `http://localhost:8000` for campaign management
- **Real-time Polling**: `/campaign/:id` for agent status updates
- **Compatible**: Maintains same API as original Python implementation 