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

  const [jobUrl, setJobUrl] = useState("");

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
      // Only send education entries where institution is actually filled
      const educationPayload = educationList
        .filter((e) => e.institution?.trim())
        .map((e) => ({
          degree: e.degree,
          institution: e.institution.trim(),
          ...(e.board?.trim() && { board: e.board.trim() }),
          ...(e.gpa?.trim() && { gpa: e.gpa.trim() }),
          ...(e.cgpa?.trim() && { cgpa: e.cgpa.trim() }),
          ...(e.department?.trim() && { department: e.department.trim() }),
          ...(e.duration?.trim() && { duration: e.duration.trim() }),
          ...(e.year?.trim() && { year: e.year.trim() }),
        }));

      const res = await instance.post("/cv/generate", {
        personalInfo,
        jobUrl: jobUrl.trim() || null,
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
  const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-400 focus:bg-purple-50 transition-all";
  const labelCls = "text-xs text-gray-500 mb-1.5 block tracking-wide font-medium";
  const cardCls = "bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-4 hover:border-purple-300 hover:shadow-sm transition-all duration-300 shadow-sm";
  const sectionTitle = "text-[10.5px] font-semibold tracking-[0.9px] uppercase text-gray-400 mb-4 flex items-center gap-1.5";

  return (
    <>
      <style>{`
        @media print {
          @page {
            margin: 0.5cm;
            size: A4;
          }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          .print-area {
            background: #fff !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 24px !important;
          }
          /* Hide browser default header/footer */
          html { margin: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] rounded-full bg-purple-400/[0.05] blur-[90px]" />

        <div className="relative max-w-[760px] mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* Header */}
          <div className="mb-8 no-print">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
              <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-purple-500">AI Powered</p>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-semibold text-gray-900 tracking-[-0.7px]" style={{ fontFamily: "'Syne', sans-serif" }}>
              ATS-Friendly{" "}
              <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">CV Builder</span>
            </h1>
            <p className="text-[13px] text-gray-400 mt-2 leading-relaxed">
              Build a CV that gets past ATS systems and lands interviews
            </p>
          </div>

          {/* ATS Note */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-600 mb-8 no-print">
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
                        ? "bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                        : i === currentStep
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                    onClick={() => i < currentStep && setCurrentStep(i)}
                  >
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 whitespace-nowrap transition-colors ${i === currentStep ? "text-gray-500" : "text-gray-300"}`}>
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-[0.5px] mb-4 mx-1 transition-colors duration-500 ${i < currentStep ? "bg-purple-400" : "bg-gray-200"}`} />
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
              {/* Optional Job URL */}
              <div className="bg-purple-50 border border-dashed border-purple-300 rounded-2xl p-5 sm:p-6 mb-4 hover:border-purple-400 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10.5px] font-semibold tracking-[0.9px] uppercase text-gray-500 flex items-center gap-2">
                    🎯 Target Job URL
                  </p>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 border border-purple-200">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  Paste a job posting URL — AI will tailor your CV to match that role's keywords and requirements automatically.
                </p>
                <input
                  type="url"
                  className={inputCls}
                  placeholder="https://linkedin.com/jobs/view/..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
                {jobUrl.trim() && (
                  <p className="text-xs text-purple-600 mt-2 flex items-center gap-1.5">
                    <span>✓</span> CV will be tailored for this specific job
                  </p>
                )}
              </div>

              <button onClick={() => setCurrentStep(1)} className="relative overflow-hidden w-full py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all shadow-md shadow-purple-200 group">
                <span className="relative z-10">Next: Work Experience →</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          )}

          {/* ══ STEP 2: Work Experience ══ */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-5 mb-4 hover:border-purple-300 transition-colors duration-300 shadow-sm">
                <div>
                  <p className="text-sm text-gray-700 font-medium">No work experience yet?</p>
                  <p className="text-xs text-gray-400 mt-1">Fresh graduate or student? You can skip this step</p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-500 border border-gray-200 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all flex-shrink-0"
                >
                  Skip →
                </button>
              </div>

              {experiences.map((exp, i) => (
                <div key={i} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>💼 Experience {i + 1}</p>
                    {experiences.length > 1 && (
                      <button onClick={() => removeItem(setExperiences, i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all mb-4">
                + Add Another Experience
              </button>
              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(0)} className="flex-1 py-3.5 rounded-xl text-sm text-gray-500 border border-gray-200 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all">← Back</button>
                <button onClick={() => setCurrentStep(2)} className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all shadow-md shadow-purple-200 group">
                  <span className="relative z-10">Next: Education →</span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                      <button onClick={() => removeEducation(edu.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">
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
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-2xl bg-purple-50 border border-dashed border-purple-300 text-sm text-gray-500 hover:text-purple-600 hover:border-purple-400 hover:bg-purple-100 transition-all mb-4"
              >
                + Add Another Degree &nbsp;<span className="text-gray-300 text-xs">(MSc, PhD, Diploma…)</span>
              </button>

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(1)} className="flex-1 py-3.5 rounded-xl text-sm text-gray-500 border border-gray-200 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all">← Back</button>
                <button onClick={() => setCurrentStep(3)} className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all shadow-md shadow-purple-200 group">
                  <span className="relative z-10">Next: Skills →</span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 4: Skills & Languages ══ */}
          {currentStep === 3 && (
            <div>
              <div className={cardCls}>
                <p className={sectionTitle}>⚡ Technical Skills</p>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[48px] mb-2 focus-within:border-purple-400 transition-colors">
                  {skills.technical.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full hover:border-purple-300 transition-colors">
                      {tag}
                      <button onClick={() => removeTag("technical", i)} className="text-gray-400 hover:text-red-500 transition-colors">×</button>
                    </span>
                  ))}
                  <input className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-300 min-w-[100px]"
                    placeholder="Type a skill, press Enter"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag("technical", techInput)} />
                </div>
              </div>

              <div className={cardCls}>
                <p className={sectionTitle}>🤝 Soft Skills</p>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[48px] mb-2 focus-within:border-purple-400 transition-colors">
                  {skills.soft.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full hover:border-purple-300 transition-colors">
                      {tag}
                      <button onClick={() => removeTag("soft", i)} className="text-gray-400 hover:text-red-500 transition-colors">×</button>
                    </span>
                  ))}
                  <input className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-300 min-w-[100px]"
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all">
                  + Add Certificate
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(2)} className="flex-1 py-3.5 rounded-xl text-sm text-gray-500 border border-gray-200 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all">← Back</button>
                <button onClick={() => setCurrentStep(4)} className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all shadow-md shadow-purple-200 group">
                  <span className="relative z-10">Next: Projects →</span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                      <button onClick={() => removeItem(setProjects, i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all mb-4">
                + Add Project
              </button>

              {volunteer.map((vol, i) => (
                <div key={i} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>🤲 Volunteer Experience {i + 1}</p>
                    {volunteer.length > 1 && (
                      <button onClick={() => removeItem(setVolunteer, i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all mb-4">
                + Add Volunteer Experience
              </button>

              {awards.map((award, i) => (
                <div key={i} className={cardCls}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={sectionTitle}>🏅 Award / Achievement {i + 1}</p>
                    {awards.length > 1 && (
                      <button onClick={() => removeItem(setAwards, i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all mb-4">
                + Add Award
              </button>

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(3)} className="flex-1 py-3.5 rounded-xl text-sm text-gray-500 border border-gray-200 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all">← Back</button>
                <button onClick={() => setCurrentStep(5)} className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all shadow-md shadow-purple-200 group">
                  <span className="relative z-10">Next: References →</span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                      <button onClick={() => removeItem(setReferences, i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all mb-4">
                + Add Reference
              </button>
              {generateError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-500 mb-3 flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span>
                  <span>{generateError}</span>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(4)} className="flex-1 py-3.5 rounded-xl text-sm text-gray-500 border border-gray-200 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all">← Back</button>
                <button onClick={generateCV} disabled={loading}
                  className="relative overflow-hidden flex-[2] py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all disabled:opacity-40 shadow-md shadow-purple-200 group">
                  <span className="relative z-10">{loading ? "✨ AI Generating..." : "✨ Generate My CV →"}</span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 7: Preview & Download ══ */}
          {currentStep === 6 && generatedCV && (
            <div>
              {/* ATS Score Card with visual ring */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-4 no-print shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="relative w-[72px] h-[72px] flex-shrink-0">
                    <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
                      <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
                      <circle
                        cx="36" cy="36" r="30" fill="none"
                        stroke={generatedCV.atsScore >= 80 ? "#16a34a" : generatedCV.atsScore >= 60 ? "#ca8a04" : "#dc2626"}
                        strokeWidth="6"
                        strokeDasharray={`${generatedCV.atsScore * 1.884} 188.4`}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 6px ${generatedCV.atsScore >= 80 ? "#16a34a44" : generatedCV.atsScore >= 60 ? "#ca8a0444" : "#dc262644"})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-base font-semibold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {generatedCV.atsScore}%
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 mb-1">ATS Compatibility Score</p>
                    <p className="text-xs text-gray-400 mb-2">
                      {generatedCV.atsScore >= 80
                        ? "🟢 Excellent — your CV will pass most ATS filters"
                        : generatedCV.atsScore >= 60
                        ? "🟡 Good — a few improvements will help"
                        : "🔴 Needs improvement — follow the tips below"}
                    </p>
                    <div className="flex flex-col gap-1">
                      {generatedCV.atsTips?.map((tip, i) => (
                        <p key={i} className="text-xs text-yellow-600 flex items-start gap-1.5">
                          <span className="flex-shrink-0 mt-0.5">💡</span>{tip}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Preview */}
              <div id="cv-print-area" className="bg-white text-black rounded-2xl p-8 mb-4 print-area border border-gray-200 shadow-sm">
                <h1 className="text-[23px] font-bold text-black tracking-tight" style={{letterSpacing: "-0.5px"}}>
                  {generatedCV.personalInfo?.name}
                </h1>
                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
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
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-2 pb-1 border-b border-gray-100">Professional Summary</p>
                    <p className="text-[11.5px] text-gray-800 leading-relaxed">{generatedCV.summary}</p>
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.experience?.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-3 pb-1 border-b border-gray-100">Work Experience</p>
                    {generatedCV.experience.map((exp, i) => (
                      <div key={i} className="mb-4">
                        <div className="flex justify-between items-baseline">
                          <p className="text-[13px] font-bold text-black">{exp.role}</p>
                          <p className="text-[11px] text-gray-500 font-medium">{exp.duration}</p>
                        </div>
                        <p className="text-[11.5px] text-gray-700 font-medium mb-1">{exp.company}</p>
                        {exp.bullets?.map((b, j) => (
                          <p key={j} className="text-[11.5px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-500 mt-1 leading-relaxed">{b}</p>
                        ))}
                      </div>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.education?.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-3 pb-1 border-b border-gray-100">Education</p>
                    {generatedCV.education.map((edu, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between">
                          <p className="text-[13px] font-bold text-black">
                            {edu.degree}{edu.department ? ` in ${edu.department}` : ""}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium">{edu.year}</p>
                        </div>
                        <p className="text-[11.5px] text-gray-700 font-medium">
                          {edu.institution}
                          {edu.result ? ` · ${edu.result}` : ""}
                          {edu.board ? ` · ${edu.board} Board` : ""}
                        </p>
                      </div>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {(() => {
                  // Deduplicate: use user-entered skills as source of truth
                  // Always use user-entered skills — AI may truncate them
                  const userTech = skills.technical.length > 0
                    ? skills.technical
                    : (generatedCV.skills?.technical || []);
                  const userSoft = skills.soft.length > 0
                    ? skills.soft
                    : (generatedCV.skills?.soft?.length > 0
                        ? generatedCV.skills.soft
                        : ["Problem Solving", "Team Collaboration", "Communication", "Time Management", "Adaptability"]);
                  if (!userTech.length && !userSoft.length) return null;
                  return (
                    <>
                      {userTech.length > 0 && (
                        <>
                          <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-2 pb-1 border-b border-gray-100">Technical Skills</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {userTech.map((s, i) => (
                              <span key={i} className="text-[11px] text-gray-800 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded font-medium">{s}</span>
                            ))}
                          </div>
                        </>
                      )}
                      {userSoft.length > 0 && (
                        <>
                          <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-2 pb-1 border-b border-gray-100">Soft Skills</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {userSoft.map((s, i) => (
                              <span key={i} className="text-[11px] text-gray-800 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded font-medium">{s}</span>
                            ))}
                          </div>
                        </>
                      )}
                      <hr className="border-gray-200 my-4" />
                    </>
                  );
                })()}

                {generatedCV.projects?.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-3 pb-1 border-b border-gray-100">Projects</p>
                    {generatedCV.projects.map((proj, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between">
                          <p className="text-[13px] font-bold text-black">{proj.name}</p>
                          {proj.link && <p className="text-[10.5px] text-blue-600 font-medium">{proj.link}</p>}
                        </div>
                        <p className="text-[11.5px] text-gray-700 mt-1 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proj.techStack?.map((t, j) => (
                            <span key={j} className="text-[10px] text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded font-medium">{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.certificates?.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-2 pb-1 border-b border-gray-100">Certificates</p>
                    {generatedCV.certificates.map((cert, i) => (
                      <p key={i} className="text-[11.5px] text-gray-700 mb-1">
                        <span className="font-semibold text-gray-900">{cert.name}</span>
                        {cert.platform ? ` · ${cert.platform}` : ""}
                        {cert.year ? ` · ${cert.year}` : ""}
                      </p>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.languages?.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-2 pb-1 border-b border-gray-100">Languages</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {generatedCV.languages.map((lang, i) => (
                        <span key={i} className="text-[11px] text-gray-800 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded font-semibold">
                          {lang.language}{lang.level ? ` — ${lang.level}` : ""}
                        </span>
                      ))}
                    </div>
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.volunteer?.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-3 pb-1 border-b border-gray-100">Volunteer Experience</p>
                    {generatedCV.volunteer.map((vol, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between">
                          <p className="text-[13px] font-bold text-black">{vol.role}</p>
                          <p className="text-xs text-gray-400">{vol.duration}</p>
                        </div>
                        <p className="text-[11.5px] text-gray-700 font-medium">{vol.organization}</p>
                        {vol.description && <p className="text-[11.5px] text-gray-700 mt-1 leading-relaxed">{vol.description}</p>}
                      </div>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.awards?.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-2 pb-1 border-b border-gray-100">Awards & Achievements</p>
                    {generatedCV.awards.map((award, i) => (
                      <p key={i} className="text-[11.5px] text-gray-700 mb-1">
                        <span className="font-semibold text-gray-900">{award.title}</span>
                        {award.issuer ? ` · ${award.issuer}` : ""}
                        {award.year ? ` · ${award.year}` : ""}
                      </p>
                    ))}
                    <hr className="border-gray-200 my-4" />
                  </>
                )}

                {generatedCV.references?.length > 0 && (
                  <>
                    <p className="text-[9.5px] font-bold tracking-[1.8px] uppercase text-gray-500 mb-3 pb-1 border-b border-gray-100">References</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {generatedCV.references.map((ref, i) => (
                        <div key={i}>
                          <p className="text-[13px] font-bold text-black">{ref.name}</p>
                          <p className="text-[11.5px] text-gray-700 font-medium">{ref.designation}{ref.organization ? `, ${ref.organization}` : ""}</p>
                          {ref.email && <p className="text-[11px] text-gray-600">{ref.email}</p>}
                          {ref.phone && <p className="text-[11px] text-gray-600">{ref.phone}</p>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  // Open a clean print window with only the CV content
                  const cvHtml = document.getElementById("cv-print-area")?.innerHTML;
                  if (!cvHtml) return;
                  const win = window.open("", "_blank");
                  win.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8"/>
                        <title>CV - ${generatedCV.personalInfo?.name || "My CV"}</title>
                        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          @page { size: A4; margin: 1.2cm 1.5cm; }
                          body { font-family: 'DM Sans', Arial, sans-serif; font-size: 12px; color: #1a1a1a; background: #fff; -webkit-font-smoothing: antialiased; }
                          h1 { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 4px; }
                          hr { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
                          .section-label { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
                          .contact { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
                          .summary { font-size: 11px; color: #4b5563; line-height: 1.6; }
                          .edu-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
                          .edu-title { font-size: 12px; font-weight: 600; color: #111; }
                          .edu-year { font-size: 10px; color: #9ca3af; }
                          .edu-sub { font-size: 11px; color: #6b7280; margin-bottom: 8px; }
                          .tag { display: inline-block; font-size: 10px; color: #374151; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px; padding: 2px 8px; margin: 3px 4px 3px 0; white-space: nowrap; }
                          .proj-title { font-size: 12px; font-weight: 600; color: #111; }
                          .proj-link { font-size: 10px; color: #3b82f6; }
                          .proj-desc { font-size: 11px; color: #4b5563; margin: 3px 0; line-height: 1.5; }
                          .cert-line { font-size: 11px; color: #4b5563; margin-bottom: 3px; }
                          .bullet { font-size: 11px; color: #4b5563; padding-left: 12px; position: relative; margin-top: 3px; line-height: 1.5; }
                          .bullet::before { content: "•"; position: absolute; left: 0; color: #9ca3af; }
                          .exp-role { font-size: 12px; font-weight: 600; color: #111; }
                          .exp-dur { font-size: 10px; color: #9ca3af; }
                          .exp-company { font-size: 11px; color: #6b7280; margin-bottom: 3px; }
                          .ref-name { font-size: 12px; font-weight: 600; color: #111; }
                          .ref-sub { font-size: 11px; color: #6b7280; }
                          .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                          .proj-header { display: flex; justify-content: space-between; align-items: baseline; }
                          /* Fix Tailwind classes in print */
                          .flex { display: flex; }
                          .flex-wrap { flex-wrap: wrap; }
                          .gap-1 > * { margin: 2px; }
                          .gap-2 > * { margin: 3px; }
                          .rounded { border-radius: 4px; }
                          .font-medium { font-weight: 500; }
                          .font-semibold { font-weight: 600; }
                          .font-bold { font-weight: 700; }
                          .text-gray-950, .text-black { color: #030712; }
                          .text-gray-900 { color: #111827; }
                          .text-gray-700 { color: #374151; }
                          .text-gray-600 { color: #4b5563; }
                          .text-gray-500 { color: #6b7280; }
                          .text-gray-400 { color: #9ca3af; }
                          .text-blue-500 { color: #3b82f6; }
                          .bg-gray-50 { background: #f9fafb; }
                          .bg-gray-100 { background: #f3f4f6; }
                          .border { border-width: 1px; border-style: solid; }
                          .border-gray-100 { border-color: #f3f4f6; }
                          .border-gray-200 { border-color: #e5e7eb; }
                          .border-gray-300 { border-color: #d1d5db; }
                          .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
                          .pb-1 { padding-bottom: 4px; }
                          .mb-1 { margin-bottom: 4px; }
                          .mb-2 { margin-bottom: 8px; }
                          .mb-3 { margin-bottom: 12px; }
                          .mb-4 { margin-bottom: 16px; }
                          .mt-1 { margin-top: 4px; }
                          .my-4 { margin-top: 16px; margin-bottom: 16px; }
                          .px-2 { padding-left: 8px; padding-right: 8px; }
                          .py-0\.5 { padding-top: 2px; padding-bottom: 2px; }
                          .pl-3 { padding-left: 12px; }
                          .p-8 { padding: 0; }
                          .grid { display: grid; }
                          .grid-cols-2 { grid-template-columns: 1fr 1fr; }
                          .gap-3 { gap: 12px; }
                          .text-xs { font-size: 11px; }
                          .text-sm { font-size: 12px; }
                          .text-2xl { font-size: 22px; }
                          .\[22px\] { font-size: 22px; }
                          .tracking-tight { letter-spacing: -0.025em; }
                          .tracking-\[1\.5px\], .tracking-\[1\.8px\] { letter-spacing: 1.5px; }
                          .uppercase { text-transform: uppercase; }
                          .leading-relaxed { line-height: 1.6; }
                          .justify-between { justify-content: space-between; }
                          .items-baseline { align-items: baseline; }
                          .relative { position: relative; }
                          .absolute { position: absolute; }
                          .left-0 { left: 0; }
                          .before\:content-\[\'•\'\]::before { content: "•"; position: absolute; left: 0; color: #9ca3af; }
                          hr { border: none; border-top: 1px solid #e5e7eb; margin: 12px 0; }
                          .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
                        </style>
                      </head>
                      <body>${cvHtml}</body>
                      <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
                    </html>
                  `);
                  win.document.close();
                }}
                className="relative overflow-hidden w-full py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all mb-3 no-print shadow-md shadow-purple-200"
              >
                <span className="relative z-10">⬇ Save as PDF</span>
              </button>

              <div className="flex gap-3 no-print">
                <button onClick={() => setCurrentStep(5)} className="flex-1 py-3 rounded-xl text-sm text-gray-500 border border-gray-200 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all">← Edit</button>
                <button onClick={() => { setCurrentStep(0); setGeneratedCV(null); }}
                  className="relative overflow-hidden flex-1 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-all shadow-md shadow-purple-200 group">
                  <span className="relative z-10">Build Another →</span>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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