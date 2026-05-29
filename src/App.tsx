import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<"qr" | "text">("qr");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center p-6">
      {/* App Header */}
      <header className="w-full max-w-4xl flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-wider uppercase text-emerald-400">
            QR Shield
          </h1>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-slate-900 border border-emerald-500/30 text-emerald-400 rounded-full">
          Privacy-First / Local-Only
        </span>
      </header>

      {/* Tab Switcher Layout */}
      <main className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <div className="flex bg-slate-950 p-1.5 rounded-lg border border-slate-800 max-w-md mx-auto mb-8">
          <button
            onClick={() => setActiveTab("qr")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "qr"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            QR Code Scanner
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "text"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            SMS Text Analyzer
          </button>
        </div>

        {/* Dynamic Workspace Container */}
        <div className="min-h-[300px] flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg bg-slate-950/50 p-6">
          {activeTab === "qr" ? (
            <div className="text-center space-y-2">
              <p className="text-emerald-400 font-mono text-lg">
                [ QR Scanner Interface Placeholder ]
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Camera engine will initialize here to intercept malicious URL
                redirect links.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-emerald-400 font-mono text-lg">
                [ Text Phishing Workspace Placeholder ]
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Local MiniLM NLP pipeline hookups will process pasted message
                markers here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
