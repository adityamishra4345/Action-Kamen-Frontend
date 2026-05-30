import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { mockTextDatabase, mockQRDatabase } from "./utils/mockData.ts";
import type {
  TextAnalysisResponse,
  QRInspectionResponse,
} from "./types/index.ts";

export default function App() {
  const [activeTab, setActiveTab] = useState<"text" | "qr">("text");
  const [textInput, setTextInput] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [textResult, setTextResult] = useState<TextAnalysisResponse | null>(
    null,
  );
  const [qrResult, setQrResult] = useState<QRInspectionResponse | null>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (activeTab === "qr" && isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false,
      );
      scanner.render(
        (data) => {
          setQrInput(data);
          setIsScanning(false);
          scanner?.clear();
        },
        () => {},
      );
    }
    return () => {
      scanner?.clear().catch(console.error);
    };
  }, [activeTab, isScanning]);

  const handleTextScan = () => {
    const entries = Object.entries(mockTextDatabase).map(([key, val]) => ({
      text: key,
      response: val,
    }));
    const match = entries.find((item) =>
      textInput.toLowerCase().includes(item.text.toLowerCase()),
    );
    setTextResult(
      match
        ? match.response
        : {
            verdict: "SAFE",
            threat_score: 5,
            triggered_keywords: [],
            nlp_label: "Clean Text",
            nlp_confidence: 0.98,
            findings: ["No suspicious links or phishing patterns found."],
          },
    );
  };

  const handleQRScan = () => {
    const entries = Object.entries(mockQRDatabase).map(([key, val]) => ({
      content: key,
      response: val,
    }));
    const match = entries.find((item) =>
      qrInput.toLowerCase().includes(item.content.toLowerCase()),
    );
    setQrResult(
      match
        ? match.response
        : {
            verdict: "SAFE",
            threat_score: 12,
            content_type: "URL",
            redirect_chain: [qrInput],
            typosquat_match: false,
            tld_risk: false,
            apk_detected: false,
            findings: ["The scanned destination URL is clean and verified."],
          },
    );
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
              className="w-full bg-teal-500 py-3 rounded-xl font-bold"
            >
              Analyze Text Payload
            </button>
            {textResult && (
              <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-teal-500/30">
                <div className="flex justify-between font-bold mb-2">
                  <span>Verdict: {textResult.verdict}</span>
                  <span>Score: {textResult.threat_score}/100</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Confidence: {Math.round(textResult.nlp_confidence * 100)}%
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
              <div id="reader" />
            ) : (
              <button
                onClick={() => setIsScanning(true)}
                className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-teal-400"
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
              className="w-full bg-teal-500 py-3 rounded-xl font-bold"
            >
              Inspect QR Target
            </button>
            {qrResult && (
              <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-teal-500/30">
                <div className="flex justify-between font-bold mb-2">
                  <span>Verdict: {qrResult.verdict}</span>
                  <span>Score: {qrResult.threat_score}/100</span>
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
