# 🩺 Doctor Personas AI Platform - Backend

An AI-powered platform that simulates cancer consultation styles from 30+ oncologist personas worldwide, helping patients preview different doctor approaches for second opinions.

## 🚀 Features

- **30+ Doctor Personas**: Real oncologists with different specialties, locations, and communication styles
- **AI Consultation Generation**: Powered by Google Gemini API
- **Global Coverage**: USA, UK, India, China, Africa, Latin America, Asia
- **5 Cancer Specialties**: Lung, Breast, Colorectal, Gynecologic, Hematologic
- **Multiple Communication Styles**: Empathetic, Data-driven, Trial-focused, Holistic, etc.

## 📁 Project Structure

```
doctor-personas-app/
├── backend/
│   ├── app.js              # Express server
│   ├── personas.json       # 30+ doctor personas dataset
│   ├── package.json        # Dependencies
│   └── .env               # API keys (not in git)
├── frontend/              # React + Three.js (handled by teammate)
└── README.md             # This file
```

## 🛠️ Backend Setup

### Prerequisites
- Node.js 16+
- Google Gemini API Key (free)

### Installation

1. **Clone and navigate:**
```bash
git clone <repository-url>
cd doctor-personas-app/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create `.env` file in `backend/` folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

4. **Get Gemini API Key (FREE):**
   - Go to: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Create API key
   - Add to `.env` file

5. **Start the server:**
```bash
npm start
```

Server runs on: `http://localhost:5000`

## 📡 API Endpoints

### 1. Get All Personas
```http
GET /api/personas
```
**Response:**
```json
{
  "success": true,
  "count": 30,
  "data": [...]
}
```

### 2. Get Specific Persona
```http
GET /api/personas/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "persona_1",
    "name": "Neal Ready",
    "specialty": "Lung Cancer",
    "location": "Durham, USA",
    "style": {...}
  }
}
```

### 3. Generate AI Consultation
```http
POST /api/consult
Content-Type: application/json

{
  "personaId": "persona_1",
  "patientSummary": "45-year-old male with Stage IIIA lung cancer..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "persona": {...},
    "patientSummary": "...",
    "consultation": "Good afternoon. I'm Dr. Neal Ready...",
    "generatedAt": "2024-10-04T20:58:55.690Z"
  }
}
```

## 🧪 Testing

### Quick Test
```bash
# Test server
curl http://localhost:5000

# Test personas
curl http://localhost:5000/api/personas

# Test consultation
curl -X POST http://localhost:5000/api/consult \
  -H "Content-Type: application/json" \
  -d '{"personaId":"persona_1","patientSummary":"Stage II breast cancer patient seeking second opinion"}'
```

## 📊 Doctor Persona Data Structure

Each persona includes:
- **Basic Info**: Name, hospital, location, experience
- **Specialty**: Cancer type focus
- **Communication Style**: Tone, decision-making approach
- **Sample Quotes**: How they speak to patients
- **Background**: Publications, focus areas

## 🌍 Global Coverage

**Regions:** USA, UK/Europe, India, China, Africa, Latin America, Asia
**Specialties:** Lung, Breast, Colorectal, Gynecologic, Hematologic
**Styles:** Empathetic, Data-driven, Trial-focused, Holistic, Cost-sensitive

## 🔧 Development

### Dependencies
- **Express.js**: Web framework
- **@google/generative-ai**: Gemini API client
- **CORS**: Cross-origin requests
- **dotenv**: Environment variables

### Environment Variables
```env
GEMINI_API_KEY=          # Required: Google Gemini API key
PORT=5000                # Optional: Server port (default: 5000)
NODE_ENV=development     # Optional: Environment
```

## 🚨 Security Notes

- `.env` file is git-ignored (contains API keys)
- Never commit API keys to repository
- API keys are loaded at runtime only
- Rate limiting handled by Gemini API

## 🏆 Hackathon Demo Ready

✅ 30+ realistic doctor personas loaded  
✅ AI consultation generation working  
✅ All API endpoints functional  
✅ CORS enabled for frontend integration  
✅ Error handling implemented  

## 👥 Team Integration

**Frontend Team:**
- Use `GET /api/personas` to populate 3D globe
- Use `POST /api/consult` for AI consultations
- All responses include `success` field for error handling

## 📝 License

MIT License - Hackathon Project