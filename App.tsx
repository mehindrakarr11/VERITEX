import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  AppMode, 
  SessionData, 
  WebRTCState, 
  Question,
  AnalysisMetric
} from './types';
import { QUESTIONS, DISCLAIMER_TEXT } from './constants';
import { analyzeResponse } from './services/geminiService';

// UI Components
import { GlassPanel, Button } from './components/ui/Glass';
import { Loader } from './components/ui/Loader';
import { CameraView } from './components/CameraView';
import { Visualizer } from './components/Visualizer';
import { ResultsView } from './components/ResultsView';
import { Mic, Video, BrainCircuit, ShieldCheck, Play, Square, Loader2, Volume2 } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [mode, setMode] = useState<AppMode>(AppMode.BOOT);
  const [mediaState, setMediaState] = useState<WebRTCState>({
    hasPermissions: false,
    videoStream: null,
    audioStream: null,
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sessionData, setSessionData] = useState<SessionData>({
    responses: [],
    baseline: { wpm: 0, avgPause: 0 }
  });
  
  // Refs for Speech Recognition
  const recognitionRef = useRef<any>(null); // Using 'any' for window.SpeechRecognition types
  const startTimeRef = useRef<number>(0);

  // --- Helpers ---

  // Boot Sequence Logic
  useEffect(() => {
    if (mode === AppMode.BOOT) {
      const timer = setTimeout(() => {
        setMode(AppMode.LANDING);
      }, 3800); // 3.8s boot time
      return () => clearTimeout(timer);
    }
  }, [mode]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      
      setMediaState({
        hasPermissions: true,
        videoStream: new MediaStream([videoTrack]),
        audioStream: new MediaStream([audioTrack]),
      });
      
      setMode(AppMode.CALIBRATION);
    } catch (err) {
      console.error("Failed to get media permissions", err);
      alert("Camera and Microphone access is required for Veritex to function.");
    }
  };

  const initSpeechRecognition = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + " " + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    initSpeechRecognition();
    return () => {
      if (mediaState.videoStream) {
        mediaState.videoStream.getTracks().forEach(track => track.stop());
      }
      if (mediaState.audioStream) {
        mediaState.audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initSpeechRecognition]);

  // --- Actions ---

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript('');
    startTimeRef.current = Date.now();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition already started");
      }
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();

    const duration = (Date.now() - startTimeRef.current) / 1000;
    const currentQ = QUESTIONS[currentQuestionIndex];
    
    // Show Loading/Processing State
    setMode(AppMode.ANALYZING);

    const metrics = await analyzeResponse(currentQ.text, transcript || "[No Audio Detected]", currentQ.type);
    
    setSessionData(prev => ({
      ...prev,
      responses: [
        ...prev.responses,
        {
          questionId: currentQ.id,
          transcript: transcript || "[No Audio Detected]",
          duration,
          metrics
        }
      ]
    }));

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setMode(AppMode.INTERVIEW);
    } else {
      setMode(AppMode.RESULTS);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSessionData({ responses: [], baseline: { wpm: 0, avgPause: 0 } });
    setMode(AppMode.INTERVIEW); // Skip permission/calibration on restart
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-2xl mx-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full animate-pulse" />
        <BrainCircuit className="w-24 h-24 text-cyan-400 relative z-10" strokeWidth={1} />
      </motion.div>
      
      <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent font-display">
        VERITEX
      </h1>
      
      <p className="text-xl text-slate-400 mb-8 leading-relaxed font-light">
        Advanced behavioral intelligence platform. <br/>
        Analyze confidence, stress, and hesitation in real-time.
      </p>

      <GlassPanel className="p-6 mb-8 text-left text-sm text-slate-400 max-w-lg mx-auto border-l-4 border-l-cyan-500/50">
        <p className="mb-2 font-semibold text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-500" /> Ethical AI Disclosure
        </p>
        {DISCLAIMER_TEXT}
      </GlassPanel>

      <Button onClick={() => setMode(AppMode.PERMISSIONS)} className="group">
        Initialize System <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );

  const renderPermissions = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <GlassPanel className="p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center gap-4 text-slate-400">
          <div className="p-4 rounded-full bg-slate-800/50"><Video className="w-8 h-8" /></div>
          <div className="p-4 rounded-full bg-slate-800/50"><Mic className="w-8 h-8" /></div>
        </div>
        <h2 className="text-2xl font-display font-medium">Sensor Access Required</h2>
        <p className="text-slate-400 text-sm">
          Veritex requires camera and microphone access to perform biometric and vocal analysis. Data is processed locally where possible and sent to secure AI endpoints for textual analysis.
        </p>
        <Button onClick={startCamera} className="w-full">
          Grant Access & Begin
        </Button>
        <p className="text-xs text-slate-600 pt-4">
          By continuing, you agree to the responsible use policy.
        </p>
      </GlassPanel>
    </div>
  );

  const renderInterview = () => {
    const question = QUESTIONS[currentQuestionIndex];
    const isAnalyzing = mode === AppMode.ANALYZING;

    return (
      <div className="flex flex-col h-screen overflow-hidden relative">
        {/* Top Bar */}
        <header className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-cyan-500" />
            <span className="font-display font-bold tracking-wider text-sm text-slate-300">VERITEX // SESSION_ACTIVE</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-mono text-slate-500">Q-{currentQuestionIndex + 1}/{QUESTIONS.length}</span>
             <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-cyan-500 transition-all duration-500" 
                 style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }} 
               />
             </div>
          </div>
        </header>

        {/* Main Content Split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left: Camera Feed */}
          <div className="relative h-[50vh] lg:h-auto bg-black border-r border-slate-800">
            <CameraView 
              stream={mediaState.videoStream} 
              isActive={true} 
              isAnalyzing={isRecording || isAnalyzing} 
            />
            {/* Audio Viz Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none p-6">
              <div className="flex items-end gap-2 h-full">
                <Volume2 className="w-5 h-5 text-slate-500 mb-2" />
                <div className="flex-1 h-full">
                  <Visualizer stream={mediaState.audioStream} isActive={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interaction Area */}
          <div className="relative flex flex-col justify-center items-center p-8 lg:p-16 bg-slate-950/50 backdrop-blur-sm">
             <AnimatePresence mode="wait">
               {isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                    <h2 className="text-xl font-display font-light">Processing Behavioral Metrics...</h2>
                    <p className="text-sm text-slate-500">Analyzing vocal pitch, hesitation, and content confidence.</p>
                  </motion.div>
               ) : (
                 <motion.div 
                   key={question.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.5 }}
                   className="w-full max-w-lg space-y-8"
                 >
                   <div className="space-y-4">
                     <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-400">
                       {question.type} PHASE
                     </span>
                     <h2 className="text-3xl md:text-4xl font-light leading-tight font-display text-white">
                       {question.text}
                     </h2>
                     <p className="text-slate-500">{question.description}</p>
                   </div>

                   {isRecording && (
                      <GlassPanel className="p-4 border-l-2 border-l-cyan-500">
                        <p className="text-sm text-slate-300 font-mono opacity-80 h-24 overflow-y-auto">
                          {transcript || "Listening..."}
                        </p>
                      </GlassPanel>
                   )}

                   <div className="flex justify-start pt-4">
                     {!isRecording ? (
                       <Button onClick={handleStartRecording} className="w-full md:w-auto">
                         <Mic className="w-4 h-4 mr-2" /> Begin Answer
                       </Button>
                     ) : (
                       <Button onClick={handleStopRecording} variant="danger" className="w-full md:w-auto">
                         <Square className="w-4 h-4 mr-2 fill-current" /> Complete Response
                       </Button>
                     )}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const renderCalibration = () => (
     <div className="flex flex-col items-center justify-center min-h-screen p-6">
       <div className="max-w-2xl w-full">
         <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden mb-6 relative border border-slate-800">
            <CameraView 
              stream={mediaState.videoStream} 
              isActive={true} 
              isAnalyzing={true} 
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border border-cyan-500/30 rounded-full animate-pulse" />
            </div>
         </div>
         <GlassPanel className="p-6 text-center">
            <h2 className="text-xl font-display mb-2">Calibration Check</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Ensure you are centered in the frame with good lighting. 
              The system is establishing a baseline for your blinking rate and head movement.
            </p>
            <Button onClick={() => setMode(AppMode.INTERVIEW)}>
              Start Analysis Session
            </Button>
         </GlassPanel>
       </div>
     </div>
  );

  const showFooter = [AppMode.LANDING, AppMode.PERMISSIONS, AppMode.CALIBRATION, AppMode.RESULTS].includes(mode);

  return (
    <div className="min-h-screen text-slate-200">
      <AnimatePresence mode="wait">
        {mode === AppMode.BOOT && (
          <motion.div key="boot" exit={{ opacity: 0, transition: { duration: 0.8 } }} className="fixed inset-0 z-50">
            <Loader />
          </motion.div>
        )}
        {mode === AppMode.LANDING && (
          <motion.div key="landing" exit={{ opacity: 0 }}>{renderLanding()}</motion.div>
        )}
        {mode === AppMode.PERMISSIONS && (
          <motion.div key="permissions" exit={{ opacity: 0 }}>{renderPermissions()}</motion.div>
        )}
        {mode === AppMode.CALIBRATION && (
          <motion.div key="calibration" exit={{ opacity: 0 }}>{renderCalibration()}</motion.div>
        )}
        {(mode === AppMode.INTERVIEW || mode === AppMode.ANALYZING) && (
          <motion.div key="interview" className="h-full">{renderInterview()}</motion.div>
        )}
        {mode === AppMode.RESULTS && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen py-20 px-6">
            <ResultsView data={sessionData} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFooter && (
          <motion.footer 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none"
          >
            <div className="px-5 py-2 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/5 text-[10px] text-slate-500 font-mono tracking-wider uppercase shadow-2xl flex items-center gap-3">
              <span>Architected by <span className="text-slate-300 font-semibold">Rohan Mehindrakar</span></span>
              <span className="w-px h-3 bg-white/10" />
              <span>Designed with <span className="text-cyan-500/90 font-semibold">Google AI Studio</span></span>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;