import { useState } from "react";
import { mockTextDatabase, mockQRDatabase } from "./utils/mockData.ts";
import type {
  TextAnalysisResponse,
  QRInspectionResponse,
} from "./types/index.ts";

export default function App() {
  const [activeTab, setActiveTab] = useState<"text" | "qr">("text");
  const [textInput, setTextInput] = useState("");
  const [qrInput, setQrInput] = useState("");

  const [textResult, setTextResult] = useState<TextAnalysisResponse | null>(
    null,
  );
  const [qrResult, setQrResult] = useState<QRInspectionResponse | null>(null);

  const handleTextScan = () => {
    const inputLower = textInput.toLowerCase();
    if (
      inputLower.includes("urgent") ||
      inputLower.includes("suspension") ||
      inputLower.includes("otp")
    ) {
      setTextResult(mockTextDatabase.urgent);
    } else if (
      inputLower.includes("lottery") ||
      inputLower.includes("winner") ||
      inputLower.includes("prize")
    ) {
      setTextResult(mockTextDatabase.winner);
    } else {
      setTextResult(mockTextDatabase.default);
    }
  };

  const handleQRScan = () => {
    const inputLower = qrInput.toLowerCase();
    if (
      inputLower.includes("paypal") ||
      inputLower.includes("bit.ly") ||
      inputLower.includes("secure")
    ) {
      setQrResult(mockQRDatabase.paypal);
    } else {
      setQrResult(mockQRDatabase.default);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 selection:bg-teal-500 selection:text-slate-950">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          QR SHIELD
        </h1>
        <p className="text-slate-400 text-sm mt-2 tracking-wide">
          REAL-TIME TEXT ANALYSIS & QR DETECTOR FRONTEND MODULE
        </p>
      </header>

      <main className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
        <div className="flex border-b border-slate-800 pb-4 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
              activeTab === "text"
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            SMS / Text Scanner
          </button>
          <button
            onClick={() => setActiveTab("qr")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
              activeTab === "qr"
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            QR & URL Inspector
          </button>
        </div>

        {activeTab === "text" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Paste Shady Text Content
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Example: Your account is suspended! Verify your identity at link..."
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors resize-none text-sm"
              />
            </div>
            <button
              onClick={handleTextScan}
              className="w-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-bold py-3 px-4 rounded-xl transition-colors shadow-md tracking-wide"
            >
              Analyze Text Payload
            </button>

            {textResult && (
              <div className="mt-6 p-5 rounded-xl border bg-slate-950/40 transition-all border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                      Scan Verdict
                    </span>
                    <span
                      className={`text-lg font-black tracking-wide ${
                        textResult.verdict === "PHISHING"
                          ? "text-rose-500"
                          : textResult.verdict === "SUSPICIOUS"
                            ? "text-amber-500"
                            : "text-emerald-500"
                      }`}
                    >
                      {textResult.verdict}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                      Threat Score
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-200">
                      {textResult.threat_score}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-900/30 p-3 rounded-lg border border-slate-900">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">
                      NLP Categorization
                    </span>
                    <span className="text-sm font-medium text-slate-300 font-mono">
                      {textResult.nlp_label}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">
                      AI Confidence Mapping
                    </span>
                    <span className="text-sm font-medium text-slate-300 font-mono">
                      {(textResult.nlp_confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {textResult.triggered_keywords.length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs text-slate-500 font-bold block mb-1.5">
                      Flagged Language Patterns
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {textResult.triggered_keywords.map((word, i) => (
                        <span
                          key={i}
                          className="text-xs font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs text-slate-500 font-bold block mb-1">
                    Detailed Heuristic Logs
                  </span>
                  <ul className="space-y-1">
                    {textResult.findings.map((finding, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-400 font-mono bg-slate-900/40 p-2 rounded border border-slate-900"
                      >
                        → {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target QR Payload / Extracted Link
              </label>
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="Example: http://bit.ly/fake-pay"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors text-sm"
              />
            </div>
            <button
              onClick={handleQRScan}
              className="w-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-bold py-3 px-4 rounded-xl transition-colors shadow-md tracking-wide"
            >
              Inspect Direct Payload
            </button>

            {qrResult && (
              <div className="mt-6 p-5 rounded-xl border bg-slate-950/40 border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                      Inspect Verdict
                    </span>
                    <span
                      className={`text-lg font-black tracking-wide ${
                        qrResult.verdict === "DANGEROUS"
                          ? "text-rose-500"
                          : qrResult.verdict === "SUSPICIOUS"
                            ? "text-amber-500"
                            : "text-emerald-500"
                      }`}
                    >
                      {qrResult.verdict}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                      Network Risk Rating
                    </span>
                    <span className="text-lg font-mono font-bold text-slate-200">
                      {qrResult.threat_score}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-900/30 p-3 rounded-lg border border-slate-900 text-center">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">
                      Type
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {qrResult.content_type}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">
                      TLD Risk Flag
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${qrResult.tld_risk ? "text-rose-400" : "text-emerald-400"}`}
                    >
                      {qrResult.tld_risk ? "CRITICAL" : "CLEAN"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">
                      Malicious APK
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${qrResult.apk_detected ? "text-rose-400" : "text-emerald-400"}`}
                    >
                      {qrResult.apk_detected ? "DETECTED" : "NONE"}
                    </span>
                  </div>
                </div>

                {qrResult.redirect_chain.length > 0 && (
                  <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-900">
                    <span className="text-xs text-slate-500 font-bold block mb-1.5">
                      Network Hop Redirect Chain
                    </span>
                    <div className="space-y-1">
                      {qrResult.redirect_chain.map((link, i) => (
                        <div
                          key={i}
                          className="text-xs font-mono text-slate-400 break-all bg-slate-900/60 p-1.5 rounded border border-slate-900"
                        >
                          <span className="text-teal-500 mr-1 font-bold">
                            [{i + 1}]
                          </span>{" "}
                          {link}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs text-slate-500 font-bold block mb-1">
                    Analysis Engineering Notes
                  </span>
                  <ul className="space-y-1">
                    {qrResult.findings.map((finding, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-400 font-mono bg-slate-900/40 p-2 rounded border border-slate-900"
                      >
                        → {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
