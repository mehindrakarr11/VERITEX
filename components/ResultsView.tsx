import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { SessionData } from '../types';
import { GlassPanel, Button } from './ui/Glass';
import { Download, AlertCircle } from 'lucide-react';

interface ResultsViewProps {
  data: SessionData;
  onRestart: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data, onRestart }) => {
  // Aggregate Metrics
  const avgConfidence = Math.round(data.responses.reduce((acc, r) => acc + r.metrics.confidence, 0) / data.responses.length) || 0;
  
  // Data for Confidence Gauge
  const confidenceData = [
    { name: 'Confidence', value: avgConfidence },
    { name: 'Gap', value: 100 - avgConfidence }
  ];
  
  // Data for Stress Timeline
  const timelineData = data.responses.map((r, i) => ({
    name: `Q${i+1}`,
    stress: r.metrics.stress,
    hesitation: r.metrics.hesitation
  }));

  const getStatusColor = (score: number) => {
    if (score > 75) return '#06b6d4'; // Cyan
    if (score > 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const downloadReport = () => {
    const report = JSON.stringify(data, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veritex_report_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-light tracking-tight text-white font-display">Analysis Complete</h2>
        <p className="text-slate-400">Behavioral indicators processed successfully.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score */}
        <GlassPanel className="p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Overall Confidence</h3>
          <div className="relative w-48 h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={getStatusColor(avgConfidence)} />
                  <Cell fill="rgba(255,255,255,0.05)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-4xl font-bold text-white font-display">{avgConfidence}%</span>
              <span className="text-xs text-slate-500 mt-1">Weighted Score</span>
            </div>
          </div>
          <div className="mt-2 text-center">
             <p className="text-sm text-slate-300">
               {avgConfidence > 80 ? "Strong Leadership Presence" : avgConfidence > 50 ? "Moderate Hesitation Detected" : "High Uncertainty Indicators"}
             </p>
          </div>
        </GlassPanel>

        {/* Stress & Hesitation Chart */}
        <GlassPanel className="p-6 md:col-span-2">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">Emotional Volatility Timeline</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="stress" name="Stress Level" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="hesitation" name="Hesitation" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      {/* Detailed Question Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-display font-medium text-white px-1">Response Analysis</h3>
        {data.responses.map((resp, idx) => (
          <GlassPanel key={idx} intensity="low" className="p-5 flex flex-col md:flex-row gap-6 items-start hover:border-cyan-500/30 transition-colors">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-400 font-mono">Q{idx + 1}</span>
                <p className="text-slate-300 font-medium line-clamp-1">{resp.transcript || "No audible response recorded."}</p>
              </div>
              <p className="text-sm text-slate-400 italic">"{resp.metrics.summary}"</p>
              
              {/* Strengths & Improvements Badges */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                {resp.metrics.strengths.length > 0 && (
                  <div className="text-[10px] text-green-400/80">
                    <span className="uppercase font-bold text-green-500/50 mr-1">Strengths:</span> 
                    {resp.metrics.strengths.slice(0, 3).join(" • ")}
                  </div>
                )}
                {resp.metrics.improvements.length > 0 && (
                  <div className="text-[10px] text-amber-400/80">
                    <span className="uppercase font-bold text-amber-500/50 mr-1">Tips:</span> 
                    {resp.metrics.improvements.slice(0, 2).join(" • ")}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4 shrink-0">
               <div className="text-center">
                 <div className="text-xs text-slate-500 uppercase">Clarity</div>
                 <div className="text-lg font-bold font-display text-cyan-200">
                   {resp.metrics.clarity}/100
                 </div>
               </div>
               <div className="text-center">
                 <div className="text-xs text-slate-500 uppercase">Stress</div>
                 <div className={`text-lg font-bold font-display ${resp.metrics.stress > 60 ? 'text-red-400' : 'text-slate-200'}`}>
                   {resp.metrics.stress}/100
                 </div>
               </div>
               <div className="text-center">
                 <div className="text-xs text-slate-500 uppercase">Hesitation</div>
                 <div className={`text-lg font-bold font-display ${resp.metrics.hesitation > 60 ? 'text-amber-400' : 'text-slate-200'}`}>
                   {resp.metrics.hesitation}/100
                 </div>
               </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-8">
        <Button variant="secondary" onClick={downloadReport}>
          <Download className="w-4 h-4" /> Export Data
        </Button>
        <Button onClick={onRestart}>
          Start New Session
        </Button>
      </div>

      <div className="mt-12 p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 max-w-3xl mx-auto">
        <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase">System Disclaimer</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            VERITEX analysis is generated by AI based on input patterns and does not constitute psychological or legal evidence. 
            High stress scores may result from environmental factors, anxiety, or technical latency, not necessarily deception.
          </p>
        </div>
      </div>
    </div>
  );
};