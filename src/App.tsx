import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import type {
  TextAnalysisResponse,
  QRInspectionResponse,
} from "./types/index.ts";

const IS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_BASE_URL = IS_LOCAL ? "http://127.0.0.1:8000" : "https://qr-shield-p5wm.onrender.com";

export default function App() {
  const [activeTab, setActiveTab] = useState<"text" | "qr" | "url">("text");
  const [textInput, setTextInput] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [textResult, setTextResult] = useState<TextAnalysisResponse | null>(null);
  const [qrResult, setQrResult] = useState<QRInspectionResponse | null>(null);
  const [urlResult, setUrlResult] = useState<QRInspectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    if (activeTab === "qr" && isScanning) {
      setTimeout(() => {
        scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scanner.render(
          (data) => {
            setQrInput(data);
            setIsScanning(false);
            scanner?.clear();
          },
          () => {}
        );
      }, 100);
    }
    
    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [activeTab, isScanning]);

  const handleTextScan = async () => {
    if (!textInput.trim()) {
      alert("Please paste some text into the box first!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setTextResult(data);
    } catch (error) {
      console.error("Backend connection failed:", error);
      alert("Failed to connect to the backend. Is FastAPI running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = async () => {
    if (!qrInput.trim()) {
      alert("Please paste a URL into the box first!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/inspect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: qrInput }),
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const data = await response.json();
      
      setQrResult(data);
    } catch (error) {
      console.error("Backend connection failed:", error);
      alert("Failed to connect to the backend! Is FastAPI running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleURLScan = async () => {
    if (!urlInput.trim()) return;
    setIsLoading(true);
    try {
      const r = await fetch(`${API_BASE_URL}/api/analyze-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: urlInput }),
      });
      const d = await r.json();
      setUrlResult(d);
    } catch (e) {
      alert("Failed to connect to backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          QR SHIELD
        </h1>
      </header>

      <main className="max-w-xl mx-auto bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab("text");
              setTextResult(null);
            }}
            className={`flex-1 py-2 rounded-lg font-medium ${activeTab === "text" ? "bg-teal-600" : "bg-slate-800"}`}
          >
            Text Scan
          </button>
          <button
            onClick={() => {
              setActiveTab("qr");
              setQrResult(null);
            }}
            className={`flex-1 py-2 rounded-lg font-medium ${activeTab === "qr" ? "bg-teal-600" : "bg-slate-800"}`}
          >
            QR Scan
          </button>
          <button
            onClick={() => {
              setActiveTab("url");
              setUrlResult(null);
            }}
            className={`flex-1 py-2 rounded-lg font-medium ${activeTab === "url" ? "bg-teal-600" : "bg-slate-800"}`}
          >
            URL
          </button>
        </div>

       {activeTab === "text" && (
          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full bg-slate-800 rounded-xl p-4 border border-slate-700 min-h-[150px]"
              placeholder="Paste text or content here to inspect..."
            />
            <button
              onClick={async () => {
                if (!textInput.trim()) return;
                setIsLoading(true);
                try {
                  const r = await fetch(`${API_BASE_URL}/api/analyze-text`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: textInput }),
                  });
                  const d = await r.json();
                  setTextResult(d);
                } catch (e) {
                  alert("Failed to connect to backend");
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 py-3 rounded-xl font-bold transition-colors"
            >
              {isLoading ? "Analyzing Text..." : "Analyze Text Content"}
            </button>
          </div>
        )}

        {activeTab === "qr" && (
          <div className="space-y-4">
            {!isScanning && !qrInput && (
              <button
                onClick={() => setIsScanning(true)}
                className="w-full bg-teal-500 hover:bg-teal-400 py-8 rounded-xl font-bold border-2 border-dashed border-teal-400/30 bg-teal-500/5 transition-all text-center block"
              >
                Launch Live Camera Scanner
              </button>
            )}
            {isScanning && (
              <div id="reader" className="overflow-hidden rounded-xl border border-slate-700 bg-black"></div>
            )}
            {qrInput && (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs font-bold text-slate-400 block mb-1">DECODED TARGET CONTENT</span>
                  <p className="font-mono break-all text-sm text-teal-400">{qrInput}</p>
                </div>
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const r = await fetch(`${API_BASE_URL}/api/inspect`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content: qrInput }),
                      });
                      const d = await r.json();
                      setQrResult(d);
                    } catch (e) {
                      alert("Backend processing failed");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 py-3 rounded-xl font-bold transition-colors"
                >
                  {isLoading ? "Inspecting..." : "Verify Decoded Payload"}
                </button>
                <button
                  onClick={() => {
                    setQrInput("");
                    setQrResult(null);
                    setIsScanning(true);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-sm transition-colors"
                >
                  Scan Another Target
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "url" && (
          <div className="space-y-4">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-slate-800 rounded-xl p-4 border border-slate-700"
              placeholder="Enter complete URL (e.g., https://example.com)..."
            />
            <button
              onClick={handleURLScan}
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 py-3 rounded-xl font-bold transition-colors"
            >
              {isLoading ? "Running Deep Audit..." : "Analyze"}
            </button>
          </div>
        )}
        {activeTab === "text" && textResult && (
          <div className={`mt-6 p-4 rounded-xl border ${textResult.verdict === 'SAFE' ? 'bg-slate-800 border-teal-500/30' : 'bg-red-950/30 border-red-500/50'}`}>
            <div className="flex justify-between font-bold mb-2">
              <span className={textResult.verdict !== 'SAFE' ? 'text-red-400' : 'text-teal-400'}>Verdict: {textResult.verdict}</span>
              <span className={textResult.threat_score >= 60 ? 'text-red-400' : ''}>Score: {textResult.threat_score}/100</span>
            </div>
            <p className="text-sm text-slate-400 mb-2">{textResult.nlp_label}</p>
            {textResult.findings.map((f, i) => <p key={i} className="text-xs text-slate-300">• {f}</p>)}
          </div>
        )}

        {activeTab === "qr" && qrResult && (
          <div className={`mt-6 p-4 rounded-xl border ${qrResult.verdict === 'SAFE' ? 'bg-slate-800 border-teal-500/30' : 'bg-red-950/30 border-red-500/50'}`}>
            <div className="flex justify-between font-bold mb-2">
              <span className={qrResult.verdict !== 'SAFE' ? 'text-red-400' : 'text-teal-400'}>Verdict: {qrResult.verdict}</span>
              <span className={qrResult.threat_score >= 50 ? 'text-red-400' : ''}>Score: {qrResult.threat_score}/100</span>
            </div>
            <p className="text-sm text-slate-400 mb-2">Content: {qrResult.content_type}</p>
            {qrResult.findings.map((f, i) => <p key={i} className="text-xs text-slate-300">• {f}</p>)}
          </div>
        )}

        {activeTab === "url" && urlResult && (
          <div className={`mt-6 p-4 rounded-xl border ${urlResult.verdict === 'SAFE' ? 'bg-slate-800 border-teal-500/30' : 'bg-red-950/30 border-red-500/50'}`}>
            <div className="flex justify-between font-bold mb-2">
              <span className={urlResult.verdict !== 'SAFE' ? 'text-red-400' : 'text-teal-400'}>Final Verdict: {urlResult.verdict}</span>
              <span className={urlResult.threat_score >= 50 ? 'text-red-400' : ''}>Threat Level: {urlResult.threat_score}/100</span>
            </div>
            {urlResult.redirect_chain && urlResult.redirect_chain.length > 0 && (
              <div className="mb-3 p-2 bg-slate-900 rounded border border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">Redirect Trace:</span>
                {urlResult.redirect_chain.map((url, i) => (
                  <div key={i} className="text-xs text-slate-300 break-all">↳ {url}</div>
                ))}
              </div>
            )}
            {urlResult.typosquat_match && (
              <div className="mb-3 text-xs text-red-400 bg-red-950/50 p-2 rounded">
                ⚠️ Typosquatting Match Detected
              </div>
            )}
            {urlResult.findings.map((f, i) => <p key={i} className="text-xs text-slate-300">• {f}</p>)}
          </div>
        )}
      </main>
    </div>
  );
}