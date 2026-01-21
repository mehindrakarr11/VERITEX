# VERITEX | Behavioral Intelligence Platform

![Veritex Banner](https://img.shields.io/badge/VERITEX-AI%20Behavioral%20Analysis-cyan?style=for-the-badge&logo=google-gemini&logoColor=white)

> **"Beyond Imagination"**

Veritex is a state-of-the-art, privacy-first web application designed to perform AI-assisted behavioral and confidence analysis. Using live camera and microphone inputs, it analyzes biometric signals, vocal patterns, and linguistic structure to provide real-time feedback on confidence, stress levels, and hesitation.

Built with a **macOS 26 / Neo-Noir** aesthetic, it features a cinematic glassmorphic UI, high-fidelity animations, and responsible AI logic.

---

## ⚡ Features

*   **Cinematic Boot Sequence**: A "Beyond Imagination" 4-second initialization with holographic iris assembly and cryptographic text decoding.
*   **Real-Time Biometrics**: Integration with WebRTC for live video feedback and HTML5 Canvas for audio waveform visualization.
*   **AI Analysis**: Powered by **Google Gemini** (via Google AI Studio) to analyze speech transcripts for psychological markers.
*   **Responsible AI**: Explicitly designed as a behavioral tool, not a "lie detector," with built-in ethical disclaimers.
*   **Interactive Session**:
    *   **Calibration**: Establishes baseline behavioral metrics.
    *   **Logical & Emotional Phases**: Structured interview questions to test different cognitive loads.
    *   **Live Transcription**: Browser-native Speech-to-Text conversion.
*   **Deep Analytics**: Post-session dashboard featuring:
    *   Confidence Pie Charts.
    *   Stress & Hesitation Timelines.
    *   Detailed transcript breakdowns with reasoning.

---

## 🛠️ Tech Stack

### Frontend & UI
*   **React 19**: Modern component-based architecture.
*   **Tailwind CSS**: Utility-first styling for the dark, glassmorphic design system.
*   **Framer Motion**: Advanced physics-based animations (boot loader, page transitions, micro-interactions).
*   **Lucide React**: Vector iconography.
*   **Recharts**: Data visualization for results.

### AI & Media
*   **Google AI Studio (Gemini 1.5/2.5 Flash)**: The core intelligence engine processing textual data to extract behavioral metrics.
*   **WebRTC**: Native browser API for secure, local camera and microphone stream handling.
*   **Web Speech API**: Native `SpeechRecognition` for real-time transcription.
*   **HTML5 Canvas**: Custom-built audio frequency visualizer.

---

## 📂 Project Structure

```bash
VERITEX/
├── index.html              # Entry point with import maps & global styles
├── index.tsx               # React Root
├── App.tsx                 # Main State Machine (Boot -> Permissions -> Interview -> Results)
├── types.ts                # TypeScript Interfaces (SessionData, AnalysisMetric)
├── constants.ts            # Configuration (Questions, Disclaimers)
├── services/
│   └── geminiService.ts    # Google GenAI SDK implementation
└── components/
    ├── CameraView.tsx      # Video stream handling with simulated AR overlay
    ├── Visualizer.tsx      # Audio frequency canvas visualizer
    ├── ResultsView.tsx     # Analytics dashboard with charts
    └── ui/
        ├── Glass.tsx       # Reusable Glassmorphism panels & buttons
        └── Loader.tsx      # The "Beyond Imagination" cinematic boot screen
```

---

## 🚀 Key Modules Explained

### 1. The Neural Loader (`components/ui/Loader.tsx`)
A bespoke animation component representing the system "waking up." It uses complex coordinate mathematics to render a rotating holographic eye and decrypts text character-by-character to simulate a secure connection establishment.

### 2. Gemini Integration (`services/geminiService.ts`)
Connects to **Google AI Studio** using the `@google/genai` SDK. It sends the interview transcript along with a system prompt that instructs the model to act as a behavioral analyst, returning a strict JSON schema containing scores (0-100) for Confidence, Stress, and Hesitation.

### 3. Glassmorphism System (`index.html` & `Glass.tsx`)
Uses a combination of backdrop filters (`blur(24px)`), semi-transparent gradients, and subtle borders to create a depth-rich, futuristic user interface that feels native to next-gen operating systems.

---

## 👨‍💻 Developer Details

**Architect & Lead Developer**: Rohan Mehindrakar  
**Platform**: Google AI Studio

*   **LinkedIn**: [linkedin.com/in/rohan-mehindrakar/](https://www.linkedin.com/in/rohan-mehindrakar/)
*   **Email**: [rohan.mehindrakar@gmail.com](mailto:rohan.mehindrakar@gmail.com)

This project demonstrates the potential of combining high-end frontend engineering with powerful Large Language Models (LLMs) to create tools that enhance human self-awareness and communication skills.

---

## ⚠️ Ethical Disclaimer

*Veritex is designed for behavioral and confidence analysis only. It does not determine truth or lies. Results are probabilistic estimates based on vocal patterns and linguistic structure. This tool should not be used for legal, hiring, or critical relationship decisions.*

---

*Powered by Google Gemini*