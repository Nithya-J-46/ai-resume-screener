import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function ScoreCircle({ score }) {
  const radius = 70
  const stroke = 10
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = () => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  const getLabel = () => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Moderate'
    return 'Low'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle stroke="#1e1e3a" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={getColor()} fill="transparent" strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          r={normalizedRadius} cx={radius} cy={radius}
        />
        <text x="50%" y="46%" dominantBaseline="middle" textAnchor="middle" fill={getColor()} fontSize="22" fontWeight="800">{score}%</text>
        <text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle" fill="#94a3b8" fontSize="11">{getLabel()}</text>
      </svg>
      <p style={{ color: getColor(), fontWeight: 700, fontSize: '16px' }}>Match Score</p>
    </div>
  )
}

function SkillBadge({ skill, type }) {
  const colors = {
    matched: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', text: '#10b981' },
    missing: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#ef4444' },
    neutral: { bg: 'rgba(99,102,241,0.15)', border: '#6366f1', text: '#818cf8' },
  }
  const c = colors[type] || colors.neutral
  return (
    <span style={{
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
      backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text,
      display: 'inline-block', margin: '3px'
    }}>
      {type === 'matched' ? '✓ ' : type === 'missing' ? '✗ ' : ''}{skill}
    </span>
  )
}

function UploadZone({ onFileAccepted, file }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]) onFileAccepted(acceptedFiles[0])
  }, [onFileAccepted])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1
  })

  return (
    <div {...getRootProps()} style={{
      border: `2px dashed ${isDragActive ? '#6366f1' : file ? '#10b981' : '#334155'}`,
      borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer',
      background: isDragActive ? 'rgba(99,102,241,0.08)' : file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
      transition: 'all 0.3s'
    }}>
      <input {...getInputProps()} />
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>{file ? '✅' : '📄'}</div>
      {file ? (
        <div>
          <p style={{ color: '#10b981', fontWeight: 600 }}>{file.name}</p>
          <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Click to replace</p>
        </div>
      ) : (
        <div>
          <p style={{ color: '#94a3b8', fontWeight: 500 }}>Drop your resume PDF here</p>
          <p style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>or click to browse</p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) {
      setError('Please upload a resume PDF and enter a job description.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('job_description', jd)
      const res = await axios.post(`${API_URL}/analyze`, formData)
      setResult(res.data)
    } catch (e) {
      setError('Failed to connect to backend. Make sure the server is running on port 8000.')
    }
    setLoading(false)
  }

  const handleReset = () => {
    setFile(null)
    setJd('')
    setResult(null)
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)' }}>
      <header style={{
        padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,26,0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
          }}>🤖</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>AI Resume Screener</h1>
            <p style={{ fontSize: '11px', color: '#64748b' }}>Powered by NLP & Machine Learning</p>
          </div>
        </div>
        <div style={{
          padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981'
        }}>● Live</div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '42px', fontWeight: 800, marginBottom: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Match Your Resume to Any Job</h2>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Upload your resume and paste a job description — our AI will analyze the match, identify skill gaps, and suggest improvements.
          </p>
        </div>

        {/* INPUT FORM — shown only when result is null */}
        {result === null && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '16px' }}>📎 Upload Resume (PDF)</h3>
                <UploadZone onFileAccepted={setFile} file={file} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '16px' }}>📋 Job Description</h3>
                <textarea
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Python developer with experience in Machine Learning, FastAPI, Docker, and AWS..."
                  style={{
                    width: '100%', height: '180px', background: 'rgba(255,255,255,0.02)',
                    border: '2px solid #1e293b', borderRadius: '12px', color: '#e2e8f0',
                    padding: '16px', fontSize: '13px', resize: 'none', outline: 'none',
                    fontFamily: 'Inter, sans-serif', lineHeight: '1.6', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#1e293b'}
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#fca5a5', textAlign: 'center'
              }}>⚠️ {error}</div>
            )}

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  padding: '16px 48px', borderRadius: '50px', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#334155' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', fontSize: '16px', fontWeight: 700, fontFamily: 'Inter, sans-serif',
                  boxShadow: loading ? 'none' : '0 0 40px rgba(99,102,241,0.4)', transition: 'all 0.3s'
                }}
              >
                {loading ? '🔄 Analyzing...' : '🚀 Analyze Resume'}
              </button>
            </div>
          </>
        )}

        {/* RESULTS — shown only after analysis */}
        {result !== null && (
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '32px',
              border: '1px solid rgba(255,255,255,0.07)', marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap'
            }}>
              <ScoreCircle score={result.match_score} />
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '20px', marginBottom: '16px' }}>Analysis Complete!</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'Skills in Resume', value: result.resume_skills.length, icon: '📄', color: '#6366f1' },
                    { label: 'Skills Required', value: result.jd_skills.length, icon: '💼', color: '#8b5cf6' },
                    { label: 'Skills Matched', value: result.matched_skills.length, icon: '✅', color: '#10b981' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', textAlign: 'center',
                      border: `1px solid ${stat.color}30`
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
                      <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <h4 style={{ color: '#10b981', fontWeight: 700, marginBottom: '16px' }}>✅ Matched Skills ({result.matched_skills.length})</h4>
                {result.matched_skills.length > 0
                  ? result.matched_skills.map(s => <SkillBadge key={s} skill={s} type="matched" />)
                  : <p style={{ color: '#475569', fontSize: '13px' }}>No matching skills found.</p>}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 style={{ color: '#ef4444', fontWeight: 700, marginBottom: '16px' }}>✗ Missing Skills ({result.missing_skills.length})</h4>
                {result.missing_skills.length > 0
                  ? result.missing_skills.map(s => <SkillBadge key={s} skill={s} type="missing" />)
                  : <p style={{ color: '#475569', fontSize: '13px' }}>🎉 You have all required skills!</p>}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '20px' }}>
              <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '16px' }}>💡 AI Recommendations</h4>
              {result.suggestions.map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(99,102,241,0.05)', borderRadius: '10px', padding: '12px 16px',
                  border: '1px solid rgba(99,102,241,0.15)', color: '#94a3b8', fontSize: '13px',
                  lineHeight: '1.5', marginBottom: '8px'
                }}>{s}</div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '24px' }}>
              <h4 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '16px' }}>📄 All Skills Detected in Resume</h4>
              {result.resume_skills.length > 0
                ? result.resume_skills.map(s => <SkillBadge key={s} skill={s} type="neutral" />)
                : <p style={{ color: '#475569', fontSize: '13px' }}>No skills detected. Make sure your PDF has selectable text.</p>}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '14px 40px', borderRadius: '50px', border: '2px solid #6366f1',
                  cursor: 'pointer', background: 'transparent', color: '#818cf8',
                  fontSize: '15px', fontWeight: 700, fontFamily: 'Inter, sans-serif', transition: 'all 0.3s'
                }}
                onMouseOver={e => { e.target.style.background = '#6366f1'; e.target.style.color = 'white' }}
                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#818cf8' }}
              >
                🔄 Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '40px 20px', color: '#334155', fontSize: '13px' }}>
        Built with ❤️ using React + FastAPI + NLP
      </footer>
    </div>
  )
}
