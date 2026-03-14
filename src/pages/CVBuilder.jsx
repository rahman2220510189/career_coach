import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axios";

const STEPS = [
  "Personal Info",
  "Work Experience",
  "Education",
  "Skills & Languages",
  "Projects & Awards",
  "References",
  "Preview & Download",
];

const DEGREE_OPTIONS = [
  "SSC", "HSC", "Diploma", "BSc", "BBA", "BA", "BEng",
  "MSc", "MBA", "MA", "MEng", "MPhil", "PhD", "Other",
];

const CVBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [generatedCV, setGeneratedCV] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: "", email: "", phone: "", location: "",
    linkedin: "", github: "",
  });

  const [experiences, setExperiences] = useState([
    { company: "", role: "", startDate: "", endDate: "", description: "" },
  ]);

  // Fully dynamic education list
  const [educationList, setEducationList] = useState([
    { id: 1, degree: "SSC", institution: "", board: "", gpa: "", cgpa: "", department: "", duration: "", year: "" },
    { id: 2, degree: "HSC", institution: "", board: "", gpa: "", cgpa: "", department: "", duration: "", year: "" },
    { id: 3, degree: "BSc", institution: "", board: "", gpa: "", cgpa: "", department: "", duration: "", year: "" },
  ]);

  const [skills, setSkills] = useState({
    technical: [], soft: [],
    languages: [{ language: "", level: "" }],
    certificates: [{ name: "", platform: "", year: "" }],
  });

  const [projects, setProjects] = useState([
    { name: "", description: "", techStack: "", link: "" },
  ]);

  const [volunteer, setVolunteer] = useState([
    { organization: "", role: "", duration: "", description: "" },
  ]);

  const [awards, setAwards] = useState([
    { title: "", issuer: "", year: "" },
  ]);

  const [references, setReferences] = useState([
    { name: "", designation: "", organization: "", email: "", phone: "" },
  ]);

  const [techInput, setTechInput] = useState("");
  const [softInput, setSoftInput] = useState("");

  // ── Helpers ───────────────────────────────────────────
  const addItem = (setter, template) =>
    setter((prev) => [...prev, { ...template }]);

  const removeItem = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (setter, index, field, value) =>
    setter((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

  const addTag = (type, value) => {
    if (!value.trim()) return;
    setSkills((prev) => ({ ...prev, [type]: [...prev[type], value.trim()] }));
    type === "technical" ? setTechInput("") : setSoftInput("");
  };

  const removeTag = (type, index) =>
    setSkills((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));

  // Education helpers
  const addEducation = () =>
    setEducationList((prev) => [
      ...prev,
      { id: Date.now(), degree: "MSc", institution: "", board: "", gpa: "", cgpa: "", department: "", duration: "", year: "" },
    ]);

  const removeEducation = (id) =>
    setEducationList((prev) => prev.filter((e) => e.id !== id));

  const updateEducation = (id, field, value) =>
    setEducationList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );

  const isHigherDegree = (deg) =>
    ["BSc","BBA","BA","BEng","MSc","MBA","MA","MEng","MPhil","PhD","Diploma","Other"].includes(deg);
  const isSecondaryDegree = (deg) => ["SSC","HSC"].includes(deg);

  // ── Generate CV ───────────────────────────────────────
  const generateCV = async () => {
    setLoading(true);
    setGenerateError("");
    try {
      const educationPayload = educationList
        .filter((e) => e.institution?.trim() || e.degree?.trim())
        .map((e) => ({
          degree: e.degree,
          institution: e.institution,
          ...(e.board && { board: e.board }),
          ...(e.gpa && { gpa: e.gpa }),
          ...(e.cgpa && { cgpa: e.cgpa }),
          ...(e.department && { department: e.department }),
          ...(e.duration && { duration: e.duration }),
          year: e.year,
        }));

      const res = await instance.post("/cv/generate", {
        personalInfo,
        experience: experiences,
        education: educationPayload,
        skills: {
          technical: skills.technical,
          soft: skills.soft,
          languages: skills.languages,
          certificates: skills.certificates,
        },
        projects,
        volunteer,
        awards,
        references,
      });
      setGeneratedCV(res.data.data);
      setCurrentStep(6);
    } catch (err) {
      console.error("Generate Error full:", err.response?.data ?? err.message);
      setGenerateError(err.response?.data?.message || err.response?.data?.error || "Something went wrong. Check console for details.");
    }
    setLoading(false);
  };

  // ── Styles ────────────────────────────────────────────
  const inputCls = "w-full bg-[#06060d] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 focus:bg-purple-500/[0.03] transition-all";
  const labelCls = "text-xs text-white/30 mb-1.5 block tracking-wide";
  const cardCls = "bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 mb-4 hover:border-white/[0.11] transition-colors duration-300";
  const sectionTitle = "text-[10.5px] font-semibold tracking-[0.9px] uppercase text-white/25 mb-4 flex items-center gap-1.5";

  return (
    <>
      <style>{`
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-area { background: #fff !important; border-radius: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#06060d]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] rounded-full bg-purple-600/[0.07] blur-[90px]" />

        <div className="relative max-w-[760px] mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* Header */}
          <div className="mb-8 no-print">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
              <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-white/30">AI Powered</p>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-semibold text-white tracking-[-0.7px]" style={{ fontFamily: "'Syne', sans-serif" }}>
              ATS-Friendly{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">CV Builder</span>
            </h1>
            <p className="text-[13px] text-white/25 mt-2 leading-relaxed">
              Build a CV that gets past ATS systems and lands interviews
            </p>
          </div>

          {/* ATS Note */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-500/[0.05] border border-yellow-500/15 text-xs text-yellow-500/50 mb-8 no-print">
            ⚠️ ATS-friendly CVs do not include photos — top companies' ATS systems reject CVs with photos
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-2 no-print">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all cursor-pointer
                      ${i < currentStep
                        ? "bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                        : i === currentStep
                        ? "bg-white/10 text-white border border-white/25"
                        : "bg-white/[0.04] text-white/20 border border-white/[0.08]"
                      }`}
                    onClick={() => i < currentStep && setCurrentStep(i)}
                  >
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 whitespace-nowrap transition-colors ${i === currentStep ? "text-white/40" : "text-white/15"}`}>
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-[0.5px] mb-4 mx-1 transition-colors duration-500 ${i < currentStep ? "bg-purple-500/40" : "bg-white/[0.07]"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ══ STEP 1: Personal Info ══ */}
          {currentStep === 0 && (
            <div>
              <div className={cardCls}>
                <p className={sectionTitle}>👤 Personal Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Full Name *", key: "name", placeholder: "Enter your full name" },
                    { label: "Email *", key: "email", placeholder: "Enter your email" },
                    { label: "Phone", key: "phone", placeholder: "Enter phone number" },
                    { label: "Location", key: "location", placeholder: "City, Country" },
                    { label: "LinkedIn", key: "linkedin", placeholder: "LinkedIn profile URL" },
                    { label: "GitHub / Portfolio", key: "github", placeholder: "GitHub or portfolio URL" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className={labelCls}>{field.label}</label>
                      <input
                        className={inputCls}
                        placeholder={field.placeholder}
                        value={personalInfo[field.key]}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, [field.key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setCurrentStep(1)} className="relative overflow-hidden w-full py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all group">
                <span className="relative z-10">Next: Work Experience →</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          )}

          {/* ══ STEP 2: Work Experience ══ */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-4 hover:border-white/[0.11] transition-colors duration-300">
                <div>
                  <p className="text-sm text-white/60 font-medium">No work experience yet?</p>
                  <p className="text-xs text-white/25 mt-1">Fresh graduate or student? You can skip this step</p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl text-xs text-white/30 border border-white/[0.08] hover:text-white/60 hover:border-purple-500/30 transition-all flex-shrink-0"
                >
                  Skip →
                </button>
              </div>

              {experiences.map((exp, i) => (
                <div key={i} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>💼 Experience {i + 1}</p>
                    {experiences.length > 1 && (
                      <button onClick={() => removeItem(setExperiences, i)} className="text-xs text-red-400/40 hover:text-red-400 transition-colors">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Company", key: "company", placeholder: "Company name" },
                      { label: "Job Title", key: "role", placeholder: "Your job title" },
                      { label: "Start Date", key: "startDate", placeholder: "e.g. Jan 2023" },
                      { label: "End Date", key: "endDate", placeholder: "e.g. Present" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className={labelCls}>{field.label}</label>
                        <input className={inputCls} placeholder={field.placeholder} value={exp[field.key]}
                          onChange={(e) => updateItem(setExperiences, i, field.key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className={labelCls}>Key Responsibilities & Achievements</label>
                    <textarea className={`${inputCls} resize-none`} rows={3}
                      placeholder="Describe your responsibilities and key achievements..."
                      value={exp.description}
                      onChange={(e) => updateItem(setExperiences, i, "description", e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => addItem(setExperiences, { company: "", role: "", startDate: "", endDate: "", description: "" })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/30 hover:text-white/60 hover:border-white/15 transition-all mb-4">
                + Add Another Experience
              </button>
              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(0)} className="flex-1 py-3.5 rounded-xl text-sm text-white/30 border border-white/[0.08] hover:text-white/50 hover:border-white/15 transition-all">← Back</button>
                <button onClick={() => setCurrentStep(2)} className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all group">
                  <span className="relative z-10">Next: Education →</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 3: Education (fully dynamic) ══ */}
          {currentStep === 2 && (
            <div>
              {educationList.map((edu, idx) => (
                <div key={edu.id} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>
                      🎓 {edu.degree || "Education"}{educationList.length > 1 ? ` #${idx + 1}` : ""}
                    </p>
                    {educationList.length > 1 && (
                      <button onClick={() => removeEducation(edu.id)} className="text-xs text-red-400/40 hover:text-red-400 transition-colors">
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Degree selector */}
                  <div className="mb-3">
                    <label className={labelCls}>Degree / Level</label>
                    <select
                      className={inputCls}
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    >
                      {DEGREE_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Institution Name</label>
                      <input className={inputCls} placeholder="School / College / University"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} />
                    </div>

                    {isSecondaryDegree(edu.degree) && (
                      <div>
                        <label className={labelCls}>Board</label>
                        <input className={inputCls} placeholder="Board name"
                          value={edu.board}
                          onChange={(e) => updateEducation(edu.id, "board", e.target.value)} />
                      </div>
                    )}

                    {isHigherDegree(edu.degree) && (
                      <div>
                        <label className={labelCls}>Department / Subject</label>
                        <input className={inputCls} placeholder="e.g. Computer Science"
                          value={edu.department}
                          onChange={(e) => updateEducation(edu.id, "department", e.target.value)} />
                      </div>
                    )}

                    {isHigherDegree(edu.degree) && (
                      <div>
                        <label className={labelCls}>Duration</label>
                        <input className={inputCls} placeholder="e.g. 2 Years"
                          value={edu.duration}
                          onChange={(e) => updateEducation(edu.id, "duration", e.target.value)} />
                      </div>
                    )}

                    <div>
                      <label className={labelCls}>{isSecondaryDegree(edu.degree) ? "GPA" : "CGPA / Grade"}</label>
                      <input className={inputCls}
                        placeholder={isSecondaryDegree(edu.degree) ? "e.g. 5.00" : "e.g. 3.75 / 4.00"}
                        value={isSecondaryDegree(edu.degree) ? edu.gpa : edu.cgpa}
                        onChange={(e) => updateEducation(edu.id, isSecondaryDegree(edu.degree) ? "gpa" : "cgpa", e.target.value)} />
                    </div>

                    <div>
                      <label className={labelCls}>Passing Year</label>
                      <input className={inputCls} placeholder="Year of passing"
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, "year", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add degree button */}
              <button
                onClick={addEducation}
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.09] text-sm text-white/30 hover:text-white/60 hover:border-purple-500/30 hover:bg-purple-500/[0.03] transition-all mb-4"
              >
                + Add Another Degree &nbsp;<span className="text-white/15 text-xs">(MSc, PhD, Diploma…)</span>
              </button>

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(1)} className="flex-1 py-3.5 rounded-xl text-sm text-white/30 border border-white/[0.08] hover:text-white/50 hover:border-white/15 transition-all">← Back</button>
                <button onClick={() => setCurrentStep(3)} className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all group">
                  <span className="relative z-10">Next: Skills →</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 4: Skills & Languages ══ */}
          {currentStep === 3 && (
            <div>
              <div className={cardCls}>
                <p className={sectionTitle}>⚡ Technical Skills</p>
                <div className="flex flex-wrap gap-2 p-3 bg-[#06060d] border border-white/[0.08] rounded-xl min-h-[48px] mb-2 focus-within:border-purple-500/40 transition-colors">
                  {skills.technical.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs text-white/50 bg-white/[0.06] border border-white/[0.09] px-3 py-1 rounded-full hover:border-purple-500/20 transition-colors">
                      {tag}
                      <button onClick={() => removeTag("technical", i)} className="text-white/20 hover:text-white/60 transition-colors">×</button>
                    </span>
                  ))}
                  <input className="bg-transparent outline-none text-sm text-white/80 placeholder:text-white/15 min-w-[100px]"
                    placeholder="Type a skill, press Enter"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag("technical", techInput)} />
                </div>
              </div>

              <div className={cardCls}>
                <p className={sectionTitle}>🤝 Soft Skills</p>
                <div className="flex flex-wrap gap-2 p-3 bg-[#06060d] border border-white/[0.08] rounded-xl min-h-[48px] mb-2 focus-within:border-purple-500/40 transition-colors">
                  {skills.soft.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs text-white/50 bg-white/[0.06] border border-white/[0.09] px-3 py-1 rounded-full hover:border-purple-500/20 transition-colors">
                      {tag}
                      <button onClick={() => removeTag("soft", i)} className="text-white/20 hover:text-white/60 transition-colors">×</button>
                    </span>
                  ))}
                  <input className="bg-transparent outline-none text-sm text-white/80 placeholder:text-white/15 min-w-[100px]"
                    placeholder="Type a skill, press Enter"
                    value={softInput}
                    onChange={(e) => setSoftInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag("soft", softInput)} />
                </div>
              </div>

              <div className={cardCls}>
                <p className={sectionTitle}>🌐 Language Skills</p>
                {skills.languages.map((lang, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelCls}>Language</label>
                      <input className={inputCls} placeholder="e.g. English"
                        value={lang.language}
                        onChange={(e) => {
                          const updated = [...skills.languages];
                          updated[i].language = e.target.value;
                          setSkills({ ...skills, languages: updated });
                        }} />
                    </div>
                    <div>
                      <label className={labelCls}>Level</label>
                      <select className={inputCls}
                        value={lang.level}
                        onChange={(e) => {
                          const updated = [...skills.languages];
                          updated[i].level = e.target.value;
                          setSkills({ ...skills, languages: updated });
                        }}>
                        <option value="">Select level</option>
                        <option>Native</option>
                        <option>Fluent</option>
                        <option>Advanced</option>
                        <option>Intermediate</option>
                        <option>Basic</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button onClick={() => setSkills({ ...skills, languages: [...skills.languages, { language: "", level: "" }] })}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/30 hover:text-white/60 hover:border-white/15 transition-all">
                  + Add Language
                </button>
              </div>

              <div className={cardCls}>
                <p className={sectionTitle}>🏆 Certificates & Courses</p>
                {skills.certificates.map((cert, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="sm:col-span-1">
                      <label className={labelCls}>Certificate Name</label>
                      <input className={inputCls} placeholder="Certificate title"
                        value={cert.name}
                        onChange={(e) => {
                          const updated = [...skills.certificates];
                          updated[i].name = e.target.value;
                          setSkills({ ...skills, certificates: updated });
                        }} />
                    </div>
                    <div>
                      <label className={labelCls}>Platform</label>
                      <input className={inputCls} placeholder="e.g. Coursera"
                        value={cert.platform}
                        onChange={(e) => {
                          const updated = [...skills.certificates];
                          updated[i].platform = e.target.value;
                          setSkills({ ...skills, certificates: updated });
                        }} />
                    </div>
                    <div>
                      <label className={labelCls}>Year</label>
                      <input className={inputCls} placeholder="Year"
                        value={cert.year}
                        onChange={(e) => {
                          const updated = [...skills.certificates];
                          updated[i].year = e.target.value;
                          setSkills({ ...skills, certificates: updated });
                        }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setSkills({ ...skills, certificates: [...skills.certificates, { name: "", platform: "", year: "" }] })}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/30 hover:text-white/60 hover:border-white/15 transition-all">
                  + Add Certificate
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(2)} className="flex-1 py-3.5 rounded-xl text-sm text-white/30 border border-white/[0.08] hover:text-white/50 hover:border-white/15 transition-all">← Back</button>
                <button onClick={() => setCurrentStep(4)} className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all group">
                  <span className="relative z-10">Next: Projects →</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 5: Projects, Volunteer, Awards ══ */}
          {currentStep === 4 && (
            <div>
              {projects.map((proj, i) => (
                <div key={i} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>🚀 Project {i + 1}</p>
                    {projects.length > 1 && (
                      <button onClick={() => removeItem(setProjects, i)} className="text-xs text-red-400/40 hover:text-red-400 transition-colors">Remove</button>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className={labelCls}>Project Name</label>
                      <input className={inputCls} placeholder="Your project name" value={proj.name}
                        onChange={(e) => updateItem(setProjects, i, "name", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea className={`${inputCls} resize-none`} rows={2} placeholder="What did you build and what was the impact?"
                        value={proj.description}
                        onChange={(e) => updateItem(setProjects, i, "description", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Tech Stack</label>
                        <input className={inputCls} placeholder="e.g. React, Node.js" value={proj.techStack}
                          onChange={(e) => updateItem(setProjects, i, "techStack", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Live Link (optional)</label>
                        <input className={inputCls} placeholder="Project URL" value={proj.link}
                          onChange={(e) => updateItem(setProjects, i, "link", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => addItem(setProjects, { name: "", description: "", techStack: "", link: "" })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/30 hover:text-white/60 hover:border-white/15 transition-all mb-4">
                + Add Project
              </button>

              {volunteer.map((vol, i) => (
                <div key={i} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>🤲 Volunteer Experience {i + 1}</p>
                    {volunteer.length > 1 && (
                      <button onClick={() => removeItem(setVolunteer, i)} className="text-xs text-red-400/40 hover:text-red-400 transition-colors">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Organization", key: "organization", placeholder: "Organization name" },
                      { label: "Role", key: "role", placeholder: "Your role" },
                      { label: "Duration", key: "duration", placeholder: "e.g. 2022 – 2023" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className={labelCls}>{field.label}</label>
                        <input className={inputCls} placeholder={field.placeholder} value={vol[field.key]}
                          onChange={(e) => updateItem(setVolunteer, i, field.key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className={labelCls}>Description</label>
                    <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Briefly describe your contribution..."
                      value={vol.description}
                      onChange={(e) => updateItem(setVolunteer, i, "description", e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => addItem(setVolunteer, { organization: "", role: "", duration: "", description: "" })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/30 hover:text-white/60 hover:border-white/15 transition-all mb-4">
                + Add Volunteer Experience
              </button>

              {awards.map((award, i) => (
                <div key={i} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>🏅 Award / Achievement {i + 1}</p>
                    {awards.length > 1 && (
                      <button onClick={() => removeItem(setAwards, i)} className="text-xs text-red-400/40 hover:text-red-400 transition-colors">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Title", key: "title", placeholder: "Award title" },
                      { label: "Issuer", key: "issuer", placeholder: "Issuing organization" },
                      { label: "Year", key: "year", placeholder: "Year" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className={labelCls}>{field.label}</label>
                        <input className={inputCls} placeholder={field.placeholder} value={award[field.key]}
                          onChange={(e) => updateItem(setAwards, i, field.key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => addItem(setAwards, { title: "", issuer: "", year: "" })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/30 hover:text-white/60 hover:border-white/15 transition-all mb-4">
                + Add Award
              </button>

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(3)} className="flex-1 py-3.5 rounded-xl text-sm text-white/30 border border-white/[0.08] hover:text-white/50 hover:border-white/15 transition-all">← Back</button>
                <button onClick={() => setCurrentStep(5)} className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all group">
                  <span className="relative z-10">Next: References →</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 6: References ══ */}
          {currentStep === 5 && (
            <div>
              {references.map((ref, i) => (
                <div key={i} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>👔 Reference {i + 1}</p>
                    {references.length > 1 && (
                      <button onClick={() => removeItem(setReferences, i)} className="text-xs text-red-400/40 hover:text-red-400 transition-colors">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Full Name", key: "name", placeholder: "Referee's full name" },
                      { label: "Designation", key: "designation", placeholder: "e.g. Professor, Manager" },
                      { label: "Organization", key: "organization", placeholder: "Organization name" },
                      { label: "Email", key: "email", placeholder: "Referee's email" },
                      { label: "Phone", key: "phone", placeholder: "Referee's phone" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className={labelCls}>{field.label}</label>
                        <input className={inputCls} placeholder={field.placeholder} value={ref[field.key]}
                          onChange={(e) => updateItem(setReferences, i, field.key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => addItem(setReferences, { name: "", designation: "", organization: "", email: "", phone: "" })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/30 hover:text-white/60 hover:border-white/15 transition-all mb-4">
                + Add Reference
              </button>
              {generateError && (
                <div className="bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 mb-3 flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span>
                  <span>{generateError}</span>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(4)} className="flex-1 py-3.5 rounded-xl text-sm text-white/30 border border-white/[0.08] hover:text-white/50 hover:border-white/15 transition-all">← Back</button>
                <button onClick={generateCV} disabled={loading}
                  className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all disabled:opacity-40 group">
                  <span className="relative z-10">{loading ? "✨ AI Generating..." : "✨ Generate My CV →"}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 7: Preview & Download ══ */}
          {currentStep === 6 && generatedCV && (
            <div>
              {/* ATS Score Card with visual ring */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 mb-4 no-print">
                <div className="flex items-center gap-5">
                  <div className="relative w-[72px] h-[72px] flex-shrink-0">
                    <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
                      <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                      <circle
                        cx="36" cy="36" r="30" fill="none"
                        stroke={generatedCV.atsScore >= 80 ? "#4ade80" : generatedCV.atsScore >= 60 ? "#facc15" : "#f87171"}
                        strokeWidth="6"
                        strokeDasharray={`${generatedCV.atsScore * 1.884} 188.4`}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 6px ${generatedCV.atsScore >= 80 ? "#4ade8066" : generatedCV.atsScore >= 60 ? "#facc1566" : "#f8717166"})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-base font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {generatedCV.atsScore}%
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/70 mb-1">ATS Compatibility Score</p>
                    <p className="text-xs text-white/25 mb-2">
                      {generatedCV.atsScore >= 80
                        ? "🟢 Excellent — your CV will pass most ATS filters"
                        : generatedCV.atsScore >= 60
                        ? "🟡 Good — a few improvements will help"
                        : "🔴 Needs improvement — follow the tips below"}
                    </p>
                    <div className="flex flex-col gap-1">
                      {generatedCV.atsTips?.map((tip, i) => (
                        <p key={i} className="text-xs text-yellow-500/50 flex items-start gap-1.5">
                          <span className="flex-shrink-0 mt-0.5">💡</span>{tip}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Preview */}
              <div className="bg-white text-black rounded-2xl p-8 mb-4 print-area">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  {generatedCV.personalInfo?.name}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  {[
                    generatedCV.personalInfo?.email,
                    generatedCV.personalInfo?.phone,
                    generatedCV.personalInfo?.location,
                    generatedCV.personalInfo?.linkedin,
                    personalInfo.github,
                  ].filter(Boolean).join(" · ")}
                </p>
                <hr className="border-gray-200 my-4" />

                {generatedCV.summary && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-2">Professional Summary</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{generatedCV.summary}</p>
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.experience?.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-3">Work Experience</p>
                    {generatedCV.experience.map((exp, i) => (
                      <div key={i} className="mb-4">
                        <div className="flex justify-between items-baseline">
                          <p className="text-sm font-semibold text-gray-900">{exp.role}</p>
                          <p className="text-xs text-gray-400">{exp.duration}</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{exp.company}</p>
                        {exp.bullets?.map((b, j) => (
                          <p key={j} className="text-xs text-gray-600 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400 mt-1 leading-relaxed">{b}</p>
                        ))}
                      </div>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.education?.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-3">Education</p>
                    {generatedCV.education.map((edu, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            {edu.degree}{edu.department ? ` in ${edu.department}` : ""}
                          </p>
                          <p className="text-xs text-gray-400">{edu.year}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {edu.institution}
                          {edu.result ? ` · ${edu.result}` : ""}
                          {edu.board ? ` · ${edu.board} Board` : ""}
                        </p>
                      </div>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {(generatedCV.skills?.technical?.length > 0 || generatedCV.skills?.soft?.length > 0) && (
                  <>
                    {generatedCV.skills?.technical?.length > 0 && (
                      <>
                        <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-2">Technical Skills</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {generatedCV.skills.technical.map((s, i) => (
                            <span key={i} className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </>
                    )}
                    {generatedCV.skills?.soft?.length > 0 && (
                      <>
                        <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-2">Soft Skills</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {generatedCV.skills.soft.map((s, i) => (
                            <span key={i} className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </>
                    )}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.projects?.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-3">Projects</p>
                    {generatedCV.projects.map((proj, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between">
                          <p className="text-sm font-semibold text-gray-900">{proj.name}</p>
                          {proj.link && <p className="text-xs text-blue-500">{proj.link}</p>}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proj.techStack?.map((t, j) => (
                            <span key={j} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.certificates?.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-2">Certificates</p>
                    {generatedCV.certificates.map((cert, i) => (
                      <p key={i} className="text-xs text-gray-600 mb-1">
                        <span className="font-medium text-gray-800">{cert.name}</span>
                        {cert.platform ? ` · ${cert.platform}` : ""}
                        {cert.year ? ` · ${cert.year}` : ""}
                      </p>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.languages?.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {generatedCV.languages.map((lang, i) => (
                        <span key={i} className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                          {lang.language}{lang.level ? ` — ${lang.level}` : ""}
                        </span>
                      ))}
                    </div>
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.volunteer?.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-3">Volunteer Experience</p>
                    {generatedCV.volunteer.map((vol, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between">
                          <p className="text-sm font-semibold text-gray-900">{vol.role}</p>
                          <p className="text-xs text-gray-400">{vol.duration}</p>
                        </div>
                        <p className="text-xs text-gray-500">{vol.organization}</p>
                        {vol.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{vol.description}</p>}
                      </div>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.awards?.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-2">Awards & Achievements</p>
                    {generatedCV.awards.map((award, i) => (
                      <p key={i} className="text-xs text-gray-600 mb-1">
                        <span className="font-medium text-gray-800">{award.title}</span>
                        {award.issuer ? ` · ${award.issuer}` : ""}
                        {award.year ? ` · ${award.year}` : ""}
                      </p>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.references?.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-gray-400 mb-3">References</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {generatedCV.references.map((ref, i) => (
                        <div key={i}>
                          <p className="text-sm font-semibold text-gray-900">{ref.name}</p>
                          <p className="text-xs text-gray-500">{ref.designation}{ref.organization ? `, ${ref.organization}` : ""}</p>
                          {ref.email && <p className="text-xs text-gray-500">{ref.email}</p>}
                          {ref.phone && <p className="text-xs text-gray-500">{ref.phone}</p>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => window.print()}
                className="relative overflow-hidden w-full py-3.5 rounded-xl text-sm font-medium text-white bg-white/[0.05] border border-white/[0.09] hover:border-purple-500/30 hover:bg-purple-500/[0.05] transition-all mb-3 no-print"
              >
                <span className="relative z-10">⬇ Download PDF (Ctrl+P → Save as PDF)</span>
              </button>

              <div className="flex gap-3 no-print">
                <button onClick={() => setCurrentStep(5)} className="flex-1 py-3 rounded-xl text-sm text-white/30 border border-white/[0.08] hover:text-white/50 hover:border-white/15 transition-all">← Edit</button>
                <button onClick={() => { setCurrentStep(0); setGeneratedCV(null); }}
                  className="relative overflow-hidden flex-1 py-3 rounded-xl text-sm font-medium text-black bg-white hover:bg-white/90 transition-all group">
                  <span className="relative z-10">Build Another →</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CVBuilder;