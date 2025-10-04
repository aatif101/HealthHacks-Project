# 🏥 AI Doctor Consultation Platform

An AI-powered platform where patients can upload cancer diagnoses and preview how oncologists from different regions and communication styles might respond.

## 🚀 Features

- **30+ Doctor Personas** across 5 cancer types and 6 global regions
- **Smart Diagnosis Processing** with text extraction from PDFs and images
- **Global Doctor Network Visualization** showing worldwide oncologist distribution
- **Communication Style Filtering** (empathetic, data-driven, cost-sensitive, etc.)
- **Real-time Consultation Previews** powered by AI

## 🧬 Cancer Types Covered

- Breast Cancer
- Lung Cancer  
- Colorectal Cancer
- Pediatric Leukemia
- Prostate Cancer

## 🌍 Global Regions

- **USA** - Boston, Houston, Los Angeles
- **UK/Europe** - London, Edinburgh, Manchester  
- **India** - Mumbai, Delhi, Ahmedabad
- **East Asia** - Tokyo, Osaka, Shanghai
- **Africa** - Lagos, Cape Town
- **Latin America** - São Paulo, Mexico City

## 🏗️ Project Structure

```
doctor-personas-app/
├── backend/                 # Node.js Express API
│   ├── app.js              # Main server file
│   ├── personas.json       # 30 doctor personas dataset
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── PersonaCard.js  # Doctor persona display
│   │   │   └── Globe.js        # World map visualization
│   │   ├── App.js          # Main React app
│   │   ├── index.js        # React entry point
│   │   └── personas.json   # Optional: client-side data
│   └── package.json        # Frontend dependencies
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3001
```

### Frontend Setup  
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

## 📡 API Endpoints

### Get All Personas
```
GET /api/personas?cancer_type=breast&region=USA&style=empathetic&limit=10
```

### Get Persona by ID
```
GET /api/personas/:id
```

### Get Personas by Cancer Type
```
GET /api/cancer/:type
```

### Submit Diagnosis for Analysis
```
POST /api/diagnoses
{
  "diagnosis_text": "Patient diagnosed with stage II breast cancer...",
  "preferred_regions": ["USA", "UK"],
  "preferred_styles": ["empathetic", "data-driven"]
}
```

## 🎯 Usage Flow

1. **Upload Diagnosis** - Patients upload medical reports (PDF, image, or text)
2. **Smart Matching** - System identifies cancer type and matches relevant doctors
3. **Filter Preferences** - Choose regions and communication styles
4. **Preview Consultations** - See how different doctors would approach the case
5. **Compare Responses** - Side-by-side comparison of medical opinions

## 🧠 Doctor Persona Categories

### Communication Styles
- **Empathetic** 💙 - Warm, supportive, family-focused
- **Data-driven** 📊 - Evidence-based, statistical approach  
- **Blunt** ⚡ - Direct, no-nonsense communication
- **Holistic** 🌿 - Integrative, lifestyle-focused care
- **Cost-sensitive** 💰 - Practical, budget-conscious options
- **Trial-focused** 🧪 - Research-oriented, cutting-edge treatments

### Regional Specialties
- **USA** - Advanced technology, clinical trials access
- **UK** - NHS protocols, evidence-based guidelines
- **India** - Cost-effective care, family-centered approach
- **East Asia** - Precision medicine, conservative treatment
- **Africa** - Resource optimization, community health
- **Latin America** - Integrative medicine, cultural sensitivity

## 🔧 Technology Stack

### Backend
- **Node.js** + Express.js
- **OpenAI GPT-4** for AI responses
- **PDF parsing** and **OCR** for document processing
- **RESTful API** design

### Frontend  
- **React** 18 with hooks
- **Canvas API** for world map visualization
- **CSS Grid** and **Flexbox** for responsive design
- **Axios** for API communication

## 🎨 Design Features

- **Modern UI** with gradient backgrounds and smooth animations
- **Mobile-responsive** design for all device sizes
- **Interactive world map** showing doctor locations
- **Color-coded regions** for easy identification
- **Accessibility** considerations throughout

## ⚠️ Important Disclaimers

- **Educational Purpose Only** - This is a demo platform for hackathon/educational use
- **Not Medical Advice** - Always consult qualified medical professionals
- **Privacy Notice** - Do not upload real patient data containing PHI
- **AI Limitations** - Responses are generated and may not reflect real medical opinions

## 🚀 Deployment

### Backend Deployment (Railway/Render)
```bash
# Build and deploy backend
cd backend
npm install --production
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build and deploy frontend
cd frontend
npm run build
# Deploy build/ folder
```

## 🧪 Future Enhancements

- **Real-time Chat** with AI doctors
- **Multi-language Support** for global accessibility  
- **Advanced File Processing** for DICOM images
- **Doctor Availability** scheduling integration
- **Secure Patient Portal** with encryption
- **Mobile App** development
- **Integration** with EHR systems

## 👥 Team & Credits

Built for HealthHacks hackathon by passionate developers committed to improving global healthcare accessibility through AI innovation.

## 📄 License

MIT License - Feel free to use for educational and hackathon purposes.

---

**🏥 Making world-class cancer consultation accessible to everyone, everywhere.**
