import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import type {
  TextAnalysisResponse,
  QRInspectionResponse,
} from "./types/index.ts";

export default function App() {
  const [activeTab, setActiveTab] = useState<"text" | "qr">("text");
  const [textInput, setTextInput] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [textResult, setTextResult] = useState<TextAnalysisResponse | null>(null);
  const [qrResult, setQrResult] = useState<QRInspectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    if (activeTab === "qr" && isScanning) {
      // Tiny delay ensures the <div> is fully painted before the camera boots up
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
          (error) => {
            // Ignore continuous background scanning errors
          }
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
      const response = await fetch("http://127.0.0.1:8000/api/analyze-text", {
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
    console.log("1. Button Clicked! URL:", qrInput);

    if (!qrInput.trim()) {
      alert("Please paste a URL into the box first!");
      return;
    }
    
    setIsLoading(true);
    console.log("2. Sending request to backend...");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/inspect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: qrInput }),
      });

      console.log("3. Backend responded with status:", response.status);

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const data = await response.json();
      console.log("4. Data received:", data);
      
      setQrResult(data);
    } catch (error) {
      console.error("5. Backend connection failed:", error);
      alert("Failed to connect to the backend! Is FastAPI running?");
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
            QR/URL
          </button>
        </div>

        {activeTab === "text" ? (
          <div className="space-y-4">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-32 bg-slate-800 rounded-xl p-4 border border-slate-700"
              placeholder="Paste shady text here..."
            />
            <button
              onClick={handleTextScan}
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 py-3 rounded-xl font-bold transition-colors"
            >
              {isLoading ? "Analyzing via MiniLM..." : "Analyze Text Payload"}
            </button>
            
            {textResult && (
              <div className={`mt-4 p-4 rounded-xl border ${textResult.verdict === 'SAFE' ? 'bg-slate-800 border-teal-500/30' : 'bg-red-950/30 border-red-500/50'}`}>
                <div className="flex justify-between font-bold mb-2">
                  <span className={textResult.verdict !== 'SAFE' ? 'text-red-400' : 'text-teal-400'}>Verdict: {textResult.verdict}</span>
                  <span className={textResult.threat_score >= 60 ? 'text-red-400' : ''}>Score: {textResult.threat_score}/100</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  AI Label: {textResult.nlp_label} (Confidence: {Math.round(textResult.nlp_confidence * 100)}%)
                </p>
                {textResult.findings.map((f, i) => (
                  <p key={i} className="text-xs text-slate-300">
                    • {f}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {isScanning ? (
              // THE FIX: Added white background and min-height so the buttons are visible
              <div id="reader" className="w-full min-h-[300px] bg-white text-black rounded-xl overflow-hidden p-4" />
            ) : (
              <button
                onClick={() => setIsScanning(true)}
                className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-teal-500 rounded-xl text-teal-400 transition-colors"
              >
                📷 Open Camera
              </button>
            )}
            <input
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="w-full bg-slate-800 rounded-xl p-4 border border-slate-700"
              placeholder="Paste URL manually..."
            />
            <button
              onClick={handleQRScan}
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 py-3 rounded-xl font-bold transition-colors"
            >
              {isLoading ? "Inspecting Target..." : "Inspect QR Target"}
            </button>
            
            {qrResult && (
              <div className={`mt-4 p-4 rounded-xl border ${qrResult.verdict === 'SAFE' ? 'bg-slate-800 border-teal-500/30' : 'bg-red-950/30 border-red-500/50'}`}>
                <div className="flex justify-between font-bold mb-2">
                  <span className={qrResult.verdict !== 'SAFE' ? 'text-red-400' : 'text-teal-400'}>Verdict: {qrResult.verdict}</span>
                  <span className={qrResult.threat_score >= 50 ? 'text-red-400' : ''}>Score: {qrResult.threat_score}/100</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Type: {qrResult.content_type}
                </p>
                {qrResult.findings.map((f, i) => (
                  <p key={i} className="text-xs text-slate-300">
                    • {f}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}