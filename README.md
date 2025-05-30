# 🚀 ZeroToMarket - Multi-Agent Marketing Intelligence System

**Complete integration from React TypeScript frontend to AgentKit-powered backend with AI agents**

## 🤖 What This Does

An autonomous multi-agent system where specialized AI agents collaborate to create complete marketing campaigns:

- **🧠 StrategistAgent**: Analyzes your product and creates marketing strategy using Clarifai
- **🔍 ResearcherAgent**: Scrapes competitive data and market insights using Apify  
- **✍️ CreatorAgent**: Generates platform-specific content (Twitter, LinkedIn, Blog, Email)
- **📋 CoordinatorAgent**: Optimizes and finalizes the complete campaign

**Real-time workflow:** Strategy + Research → Content Creation → Campaign Optimization

## 🚀 Quick Start

### 1. Backend Setup (AgentKit + FastAPI + AI Agents)
```bash
cd BACKEND
npm install
```

### 2. Add API Keys to `.env`
```env
# Primary AI model (cheap and fast!)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Enhanced content generation  
CLARIFAI_PAT=your_clarifai_pat_token_here

# Optional: Real competitive intelligence
APIFY_API_TOKEN=your_apify_api_token_here
```

### 3. Start Backend
```bash
npm run dev
```

### 4. Frontend Setup (React + TypeScript + Material-UI)
```bash
cd ..  # Back to root
npm install
npm start
```

## 💡 System Architecture

### **Frontend (React + TypeScript)**
- **Dashboard**: Campaign management and system overview
- **New Product**: 3-step product input with industry selection  
- **AgentWorkflow**: Real-time agent monitoring with progress bars
- **ProductChat**: Conversational interface with campaign creation
- **Results Display**: Professional campaign output with platform-specific content

### **Backend (AgentKit + FastAPI + AI)**
- **Multi-Agent Network**: 4 specialized AI agents working in coordination
- **Real-time Polling**: Live status updates and result streaming
- **Professional Results**: Campaign readiness scores, optimization recommendations
- **AI Integration**: OpenAI GPT-4o-mini (cost-effective), Clarifai (content), Apify (research)

### **Core Workflow**
1. **Product Input** → Strategy analysis + Market research (parallel)
2. **Content Creation** → Platform-specific posts using strategy + research  
3. **Campaign Coordination** → Optimization and publishing timeline
4. **Results Display** → Complete campaign with readiness assessment

## 🎯 What You Get

**Input:** Product name, description, target audience
**Output:** Complete marketing campaign including:

- Strategic positioning and value proposition
- Competitive intelligence and market trends  
- Platform-optimized content (Twitter, LinkedIn, Blog, Email)
- Publishing timeline and success metrics
- Campaign readiness score with optimization recommendations

## 🔧 Technical Features

- ✅ **Real Agent Coordination**: Actual AgentKit multi-agent workflow
- ✅ **Cost-Effective AI**: Uses OpenAI GPT-4o-mini (~10x cheaper than GPT-4)
- ✅ **Live Monitoring**: Real-time agent status and progress tracking
- ✅ **Professional Results**: Campaign-ready content with optimization
- ✅ **Modern UI**: Material-UI components with responsive design
- ✅ **TypeScript**: Full type safety across frontend and backend

## 🌟 Key Improvements (Latest)

**Backend:**
- **Switched to OpenAI GPT-4o-mini** - Much cheaper and more accessible than Anthropic
- Fixed AgentKit configuration and tool integration
- Enhanced Clarifai tool with realistic content generation  
- Enhanced Apify tool with competitive intelligence
- Proper error handling and status management

**Frontend:**  
- Complete campaign flow with persistent storage
- Real-time agent workflow visualization
- Professional campaign display with organized sections
- Enhanced chat interface with campaign tracking
- Dashboard with campaign management and system status

## 🚀 Demo Ready

The system generates **actual usable marketing content** instead of placeholders. Perfect for:
- **Founders** who need marketing content quickly
- **Marketing teams** wanting AI-assisted campaign creation  
- **Agencies** offering automated marketing intelligence
- **Anyone** building multi-agent AI applications

**Just add your OpenAI API key to get started!** 🔑

## 🎯 Key Features

### 🤖 Real-Time Agent Workflow
- Live progress tracking for each agent
- Visual workflow stepper showing agent coordination
- Real-time status updates and error handling

### 📊 Campaign Management
- Create marketing campaigns with product details
- Monitor agent execution in real-time
- View generated content and optimization results

### 🔧 Backend Integration
- RESTful API with TypeScript types
- Automatic polling for campaign updates
- Error handling and connection status

### 🎨 Modern UI/UX
- Material-UI design system
- Responsive layout for all devices
- Professional gradient themes and animations

## 📡 API Endpoints

### Campaign Management
- `POST /start-campaign` - Start new agent workflow
- `GET /campaign/:id` - Get campaign status and results
- `GET /health` - Backend and agent status

### Agent Workflow
- Real-time agent status tracking
- Inter-agent communication and data passing
- Results storage and retrieval

## 🛠️ Development

### Frontend Structure
```
src/
├── components/
│   ├── AgentWorkflow.tsx    # Real-time agent monitoring
│   └── ...
├── pages/
│   ├── Dashboard.tsx        # Main dashboard with backend status
│   ├── NewProduct.tsx       # Campaign creation with API integration
│   └── ...
├── services/
│   └── api.ts              # Backend API client
└── types/
    └── api.ts              # TypeScript interfaces
```

### Backend Structure
```
BACKEND/src/
├── agents/
│   ├── strategist.ts       # Clarifai-powered strategy agent
│   ├── researcher.ts       # Apify-powered research agent
│   ├── creator.ts          # Clarifai-powered content agent
│   └── coordinator.ts      # Clarifai-powered optimization agent
├── tools/
│   └── index.ts           # AgentKit tools and integrations
└── server.ts              # FastAPI server with CORS
```

## 🏆 Hackathon Integration

### Prize Track Compliance
- ✅ **Best Use of AgentKit**: Multi-agent orchestration with real coordination
- ✅ **Best Use of Clarifai**: Strategy, content generation, and optimization
- ✅ **Best Use of Apify**: Competitive intelligence and market research
- ✅ **Top Overall**: Complete autonomous marketing intelligence system

### Demo Flow
1. **Product Input**: Enter product details in the frontend form
2. **Agent Workflow**: Watch real-time agent execution with progress bars
3. **Results Display**: View generated strategy, research, content, and optimization
4. **Campaign Ready**: Complete marketing campaign with publishing timeline

## 🔧 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 8000
- Check CORS configuration for localhost:3000
- Verify environment variables are set

### Agent Execution Issues  
- Check Clarifai PAT token validity
- Verify Apify API token permissions
- Monitor agent logs in backend console

### Frontend Issues
- Clear browser cache and restart
- Check console for API connection errors
- Verify axios requests are reaching backend

## 📈 Next Steps

### Production Deployment
- Add environment-specific configurations
- Implement proper error boundaries
- Add authentication and user management

### Enhanced Features
- Campaign result persistence
- Multi-user support
- Advanced agent customization
- n8n publishing integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the AgentKit + Clarifai + Apify Hackathon**
