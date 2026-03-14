
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../utils/axios";

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNum, setQuestionNum] = useState(0);
  const [answer, setAnswer] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [scores, setScores] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Redirect if no analysis
  useEffect(() => {
    if (!analysis) navigate("/dashboard");
  }, [analysis, navigate]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await instance.post("/interview/start", {
        jobTitle: analysis.jobTitle,
        candidateName: analysis.candidateName,
        interviewTopics: analysis.interviewTopics,
      });
      setSessionId(res.data.sessionId);
      setCurrentQuestion(res.data.data.question);
      setQuestionNum(1);
      setStarted(true);
      setMessages([
        {
          type: "bot",
          text: res.data.data.question,
          questionNum: 1,
        },
      ]);
    } catch (err) {
      console.error("Start Error:", err.message);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    const userAnswer = answer;
    setAnswer("");
    setMessages((prev) => [...prev, { type: "user", text: userAnswer }]);
    setLoading(true);

    try {
      const res = await instance.post("/interview/answer", {
        sessionId,
        question: currentQuestion,
        answer: userAnswer,
        context: `Job: ${analysis.jobTitle}, Topics: ${analysis.interviewTopics?.join(", ")}`,
      });

      const data = res.data.data;
      setScores((prev) => [...prev, data.score]);

      // Add feedback message
      setMessages((prev) => [
        ...prev,
        { type: "feedback", score: data.score, good: data.good, improve: data.improve, tip: data.tip },
      ]);

      // Check if interview finished
      if (questionNum >= 8) {
        finishInterview();
        return;
      }

      // Next question
      setTimeout(() => {
        setCurrentQuestion(data.nextQuestion);
        setQuestionNum((prev) => prev + 1);
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: data.nextQuestion, questionNum: questionNum + 1 },
        ]);
      }, 500);

    } catch (err) {
      console.error("Answer Error:", err.message);
    }
    setLoading(false);
  };

  const finishInterview = async () => {
    try {
      const res = await instance.post("/interview/finish", { sessionId });
      setFinalResult(res.data.data);
      setFinished(true);
    } catch (err) {
      console.error("Finish Error:", err.message);
    }
  };

  const avgScore = scores.length
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10)
    : 0;

  // No analysis — redirect
  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8">

        {/* NOT STARTED */}
        {!started && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0f0f0f] border border-white/[0.07] flex items-center justify-center text-3xl">
              🎤
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white tracking-[-0.5px]">
                Mock Interview
              </h1>
              <p className="text-sm text-white/25 mt-2">
                {analysis.jobTitle}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {[
                { label: "Questions", value: "8" },
                { label: "Topics", value: analysis.interviewTopics?.length },
                { label: "Match", value: `${analysis.matchScore}%` },
              ].map((item, i) => (
                <div key={i} className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl p-4 text-center">
                  <p className="text-lg font-medium text-white">{item.value}</p>
                  <p className="text-xs text-white/25 mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {analysis.interviewTopics?.map((topic, i) => (
                <span key={i} className="text-xs text-white/30 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                  {topic}
                </span>
              ))}
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all disabled:opacity-40"
            >
              {loading ? "Starting..." : "Start Interview →"}
            </button>
          </div>
        )}

        {/* INTERVIEW CHAT */}
        {started && !finished && (
          <div className="flex flex-col gap-4">

            {/* Progress */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/25">Question {questionNum}/8</span>
              <div className="flex-1 h-[2px] bg-white/[0.06] rounded-full">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${(questionNum / 8) * 100}%` }}
                />
              </div>
              {scores.length > 0 && (
                <span className="text-xs text-white/25">Avg {avgScore}%</span>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex flex-col gap-3 min-h-[400px] max-h-[500px] overflow-y-auto py-2">
              {messages.map((msg, i) => (
                <div key={i}>

                  {/* Bot Message */}
                  {msg.type === "bot" && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0f0f0f] border border-white/[0.07] flex items-center justify-center text-sm flex-shrink-0">
                        🎤
                      </div>
                      <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                        <p className="text-[10px] text-white/20 mb-1.5">Q{msg.questionNum}</p>
                        <p className="text-sm text-white/70 leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )}

                  {/* User Message */}
                  {msg.type === "user" && (
                    <div className="flex justify-end">
                      <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                        <p className="text-sm text-white/60 leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {msg.type === "feedback" && (
                    <div className="ml-11 bg-[#0f0f0f] border border-white/[0.07] rounded-xl p-4">
                      {/* Score Bar */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-sm font-medium ${msg.score >= 7 ? "text-green-400" : msg.score >= 4 ? "text-yellow-400" : "text-red-400"}`}>
                          {msg.score}/10
                        </span>
                        <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full">
                          <div
                            className={`h-full rounded-full transition-all ${msg.score >= 7 ? "bg-green-400" : msg.score >= 4 ? "bg-yellow-400" : "bg-red-400"}`}
                            style={{ width: `${msg.score * 10}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-green-400/70 mb-1">✅ {msg.good}</p>
                      <p className="text-xs text-red-400/70 mb-1">📌 {msg.improve}</p>
                      <p className="text-xs text-yellow-400/70">💡 {msg.tip}</p>
                    </div>
                  )}

                </div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0f0f0f] border border-white/[0.07] flex items-center justify-center text-sm">
                    🎤
                  </div>
                  <div className="flex gap-1.5 px-4 py-3 bg-[#0f0f0f] border border-white/[0.07] rounded-2xl rounded-tl-none">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3 mt-2">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
                placeholder="Type your answer... (Enter to send)"
                disabled={loading}
                rows={3}
                className="flex-1 bg-[#0f0f0f] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-all resize-none disabled:opacity-40"
              />
              <button
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
                className="px-5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed self-end py-3"
              >
                Send →
              </button>
            </div>

          </div>
        )}

        {/* FINISHED */}
        {finished && finalResult && (
          <div className="flex flex-col items-center gap-6 py-12 text-center">
            <div className="text-4xl">🎉</div>
            <div>
              <h1 className="text-2xl font-medium text-white tracking-[-0.5px]">
                Interview Complete!
              </h1>
              <p className="text-sm text-white/25 mt-2">
                Here's how you performed
              </p>
            </div>

            {/* Final Score */}
            <div className="relative w-28 h-28">
              <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
                <circle cx="56" cy="56" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="56" cy="56" r="46"
                  fill="none"
                  stroke={finalResult.finalScore >= 70 ? "#4ade80" : finalResult.finalScore >= 40 ? "#facc15" : "#f87171"}
                  strokeWidth="8"
                  strokeDasharray={`${finalResult.finalScore * 2.89} 289`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-medium text-white">{finalResult.finalScore}%</span>
                <span className="text-[10px] text-white/25">Final Score</span>
              </div>
            </div>

            {/* Per Question Scores */}
            <div className="flex flex-wrap gap-2 justify-center">
              {scores.map((s, i) => (
                <span
                  key={i}
                  className={`text-xs px-3 py-1.5 rounded-full border ${s >= 7 ? "bg-green-500/10 text-green-400 border-green-500/20" : s >= 4 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                >
                  Q{i + 1}: {s}/10
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 rounded-xl text-sm text-white/30 border border-white/[0.08] hover:text-white/60 hover:border-white/15 transition-all"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all"
              >
                Try Again →
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Interview;