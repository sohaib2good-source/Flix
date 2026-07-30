import { useState } from "react";
import { Film, BrainCircuit, Upload, Loader2, Sparkles, Send } from "lucide-react";

export default function AiTools() {
  const [activeTab, setActiveTab] = useState<"video" | "consultant">("video");

  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-luxury-gold)]/10 text-[var(--color-luxury-gold)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Next-Gen AI Capabilities
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-[#081C3A] mb-4">
            AI <span className="font-bold">Innovations</span>
          </h1>
          <p className="text-gray-500">Experience our latest AI-powered maritime tools.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex gap-1">
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === "video" ? "bg-[#081C3A] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <Film className="w-4 h-4" />
              Animate Photo
            </button>
            <button
              onClick={() => setActiveTab("consultant")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === "consultant" ? "bg-[#081C3A] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <BrainCircuit className="w-4 h-4" />
              AI Consultant
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 md:p-12">
          {activeTab === "video" ? <VideoGenerator /> : <AiConsultant />}
        </div>

      </div>
    </div>
  );
}

function VideoGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    setIsGenerating(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.videoUrl || "Video generation initiated. (Demo mode)");
      } else {
        setResult("Error: " + data.error);
      }
    } catch (error) {
      setResult("Failed to generate video.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-[#081C3A] mb-2">Animate Image to Video</h2>
        <p className="text-gray-500">Upload a photo and let Veo AI transform it into a stunning cinematic video (16:9).</p>
      </div>

      {!file ? (
        <label className="border-2 border-dashed border-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-luxury-gold)] hover:bg-gray-50 transition-colors">
          <Upload className="w-10 h-10 text-gray-300 mb-4" />
          <span className="text-gray-500 font-medium">Click or drag image to upload</span>
          <span className="text-xs text-gray-400 mt-2">JPEG, PNG up to 10MB</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
            {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
            {isGenerating && (
              <div className="absolute inset-0 bg-[#081C3A]/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[var(--color-luxury-gold)]" />
                <p className="font-bold tracking-widest uppercase text-xs">Generating Masterpiece...</p>
              </div>
            )}
            {result && !isGenerating && (
              <div className="absolute inset-0 bg-[#081C3A]/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 p-8 text-center">
                <Sparkles className="w-12 h-12 text-[var(--color-luxury-gold)] mb-4" />
                <p className="font-medium text-lg text-white/90 mb-4">{result}</p>
                <button 
                  onClick={() => { setFile(null); setPreviewUrl(null); setResult(null); }}
                  className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-sm"
                >
                  Generate Another
                </button>
              </div>
            )}
          </div>
          
          {!result && (
            <div className="flex gap-4">
              <button 
                onClick={() => { setFile(null); setPreviewUrl(null); }}
                className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-[2] bg-[#081C3A] text-white py-4 font-bold rounded-xl hover:bg-[#0E4B82] transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Film className="w-5 h-5" />}
                Generate Video
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AiConsultant() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsThinking(true);
    setResponse(null);

    try {
      const res = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.response || "No response received.");
    } catch (error) {
      setResponse("An error occurred while consulting AI.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[600px] flex flex-col">
      <div className="text-center mb-8 shrink-0">
        <h2 className="text-2xl font-bold text-[#081C3A] mb-2">High-Thinking AI Consultant</h2>
        <p className="text-gray-500">Ask complex maritime, legal, or registration questions.</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col">
        {response ? (
          <div className="prose prose-sm max-w-none text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, "<br/>") }} />
          </div>
        ) : isThinking ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-[#081C3A]/5 rounded-full flex items-center justify-center mb-4">
              <BrainCircuit className="w-8 h-8 text-[#081C3A] animate-pulse" />
            </div>
            <p className="text-sm font-bold tracking-widest uppercase">Analyzing Complex Query...</p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
            <BrainCircuit className="w-16 h-16 mb-4" />
            <p>Our AI is ready to assist you.</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative shrink-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a complex question..."
          className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20 transition-shadow"
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={isThinking || !query.trim()}
          className="absolute right-2 top-2 bottom-2 w-12 bg-[#081C3A] text-white rounded-lg flex items-center justify-center hover:bg-[#0E4B82] transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
