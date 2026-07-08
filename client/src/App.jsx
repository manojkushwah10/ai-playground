import React from 'react'
import { AIChatApp } from './components/features/AIChatApp'

function App() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-violet-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full h-[100dvh] p-3 md:p-8 flex items-center justify-center overflow-hidden">
        <AIChatApp />
      </div>
    </div>
  )
}

export default App
