import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

const COURSE_LINKS = {
  'Machine Learning': 'https://www.coursera.org/learn/machine-learning',
  'Python': 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
  'React': 'https://scrimba.com/learn/learnreact',
  'Node.js': 'https://www.theodinproject.com/paths/full-stack-javascript',
  'SQL': 'https://www.hackerrank.com/domains/sql',
  'Docker': 'https://labs.play-with-docker.com/',
  'AWS': 'https://aws.amazon.com/free/',
  'TensorFlow': 'https://www.tensorflow.org/tutorials',
  'FastAPI': 'https://fastapi.tiangolo.com/tutorial/',
  'MongoDB': 'https://university.mongodb.com/',
  'Git': 'https://learngitbranching.js.org/',
  'TypeScript': 'https://www.typescriptlang.org/docs/',
  'Django': 'https://docs.djangoproject.com/en/stable/intro/tutorial01/',
  'NLP': 'https://huggingface.co/learn/nlp-course/',
  'Pandas': 'https://pandas.pydata.org/docs/getting_started/',
  'NumPy': 'https://numpy.org/learn/',
  'PyTorch': 'https://pytorch.org/tutorials/',
  'Scikit-learn': 'https://scikit-learn.org/stable/getting_started.html',
}

// ── Job Role Detector ─────────────────────────────────────────────────────────

// -- Interview Questions Database --
const INTERVIEW_QUESTIONS = {
  'Python': [
    { q: 'What is the difference between a list and a tuple in Python?', a: 'Lists are mutable (can be changed), tuples are immutable (cannot be changed). Tuples are faster and used for fixed data.', level: 'Easy' },
    { q: 'Explain Python decorators with an example.', a: 'A decorator wraps another function to extend its behavior. Use @decorator_name syntax above the function definition.', level: 'Medium' },
    { q: 'What is the GIL (Global Interpreter Lock) in Python?', a: 'GIL is a mutex that allows only one thread to execute Python bytecode at a time, even on multi-core. Use multiprocessing to bypass it.', level: 'Hard' },
  ],
  'React': [
    { q: 'What is the difference between state and props in React?', a: 'Props are passed from parent to child (read-only). State is managed within the component and can be changed with useState hook.', level: 'Easy' },
    { q: 'Explain the useEffect hook and when to use it.', a: 'useEffect runs side effects (API calls, subscriptions) after render. Replaces componentDidMount, componentDidUpdate, componentWillUnmount.', level: 'Medium' },
    { q: 'What is React reconciliation and how does the virtual DOM work?', a: 'React creates a virtual DOM, diffs it with the previous version, and only updates the real DOM where changes occurred — making updates efficient.', level: 'Hard' },
  ],
  'Django': [
    { q: 'What is the MTV architecture in Django?', a: 'MTV: Model (database logic), Template (HTML presentation), View (business logic). Similar to MVC but Django calls the controller a View.', level: 'Easy' },
    { q: 'Difference between select_related and prefetch_related?', a: 'select_related uses SQL JOIN for ForeignKey. prefetch_related does separate queries for ManyToMany/reverse FK. Use select_related for single object, prefetch for lists.', level: 'Medium' },
    { q: 'How does Django middleware work?', a: 'Middleware hooks into request/response processing. Each component processes requests before views and responses after views. Used for auth, CORS, logging, etc.', level: 'Hard' },
  ],
  'Machine Learning': [
    { q: 'Difference between supervised and unsupervised learning?', a: 'Supervised trains on labeled data (classification, regression). Unsupervised finds patterns in unlabeled data (clustering, dimensionality reduction).', level: 'Easy' },
    { q: 'Explain overfitting and how to prevent it.', a: 'Overfitting is when a model memorizes training data but fails on new data. Prevent with regularization, dropout, cross-validation, early stopping, more data.', level: 'Medium' },
    { q: 'What is gradient descent and its variants?', a: 'Gradient descent minimizes loss by updating weights toward the steepest descent direction. Variants: Batch GD, SGD, Mini-batch, Adam, RMSprop, Adagrad.', level: 'Hard' },
  ],
  'SQL': [
    { q: 'Difference between INNER JOIN and LEFT JOIN?', a: 'INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from left table plus matching rows from right (NULL if no match).', level: 'Easy' },
    { q: 'What is database indexing and when to use it?', a: 'An index speeds up SELECT queries by creating a fast-lookup data structure. Use on frequently queried columns. Avoid over-indexing as it slows INSERT/UPDATE.', level: 'Medium' },
    { q: 'Explain ACID properties in database transactions.', a: 'Atomicity (all or nothing), Consistency (valid state always), Isolation (transactions do not interfere), Durability (committed data persists after crash).', level: 'Hard' },
  ],
  'Node.js': [
    { q: 'What is the event loop in Node.js?', a: 'The event loop allows Node.js to handle non-blocking I/O by offloading operations to the OS and running callbacks when complete, despite being single-threaded.', level: 'Easy' },
    { q: 'Difference between require() and import in Node.js?', a: 'require() is CommonJS (synchronous, dynamic). import is ES Modules (asynchronous, static, tree-shakeable). ESM is the modern standard.', level: 'Medium' },
    { q: 'How does Node.js handle thousands of concurrent requests on a single thread?', a: 'Node uses async I/O with event loop. While waiting for I/O (DB, network), the thread handles other incoming requests without blocking.', level: 'Hard' },
  ],
  'Docker': [
    { q: 'Difference between a Docker image and a container?', a: 'An image is a read-only blueprint/template. A container is a running instance of that image with its own isolated filesystem and processes.', level: 'Easy' },
    { q: 'What is Docker Compose and when do you use it?', a: 'Docker Compose defines multi-container apps in a docker-compose.yml file. Used for dev environments needing multiple services (app + db + cache).', level: 'Medium' },
    { q: 'How do you optimize Docker image size?', a: 'Use multi-stage builds, minimal base images (alpine), combine RUN commands, use .dockerignore, remove build dependencies after use.', level: 'Hard' },
  ],
  'Git': [
    { q: 'Difference between git merge and git rebase?', a: 'Merge creates a new merge commit preserving branch history. Rebase moves commits on top of another branch creating a clean linear history.', level: 'Easy' },
    { q: 'Explain git cherry-pick and when to use it.', a: 'cherry-pick applies a specific commit from one branch onto another. Used when you need one fix from a feature branch without merging everything.', level: 'Medium' },
    { q: 'How do you resolve a merge conflict in Git?', a: 'Open conflicting files, find <<<<<<< ======= >>>>>>> markers, manually edit to keep the correct code, then git add and git commit.', level: 'Easy' },
  ],
  'JavaScript': [
    { q: 'Difference between == and === in JavaScript?', a: '== compares values with type coercion (1 == "1" is true). === compares values AND types strictly (1 === "1" is false). Always prefer ===.', level: 'Easy' },
    { q: 'Explain closures in JavaScript with an example.', a: 'A closure is when an inner function remembers variables from its outer scope even after the outer function returns. Used in callbacks and data privacy.', level: 'Medium' },
    { q: 'What is the event loop, call stack, and microtask queue?', a: 'Call stack runs sync code. Web APIs handle async. Microtask queue (Promises) runs before macrotask queue (setTimeout). Event loop coordinates all three.', level: 'Hard' },
  ],
  'Flask': [
    { q: 'What is Flask and how is it different from Django?', a: 'Flask is a lightweight micro-framework — you add only what you need. Django is full-featured with ORM, admin, auth built-in. Flask = flexibility, Django = batteries included.', level: 'Easy' },
    { q: 'How do you handle authentication in Flask?', a: 'Use Flask-Login for session-based auth or Flask-JWT-Extended for token-based auth. Always hash passwords with bcrypt, never store plain text.', level: 'Medium' },
  ],
  'MongoDB': [
    { q: 'What is the difference between SQL and NoSQL databases?', a: 'SQL uses structured tables with fixed schema and JOINs. NoSQL (like MongoDB) uses flexible documents, scales horizontally, better for unstructured/changing data.', level: 'Easy' },
    { q: 'When would you choose MongoDB over a relational database?', a: 'Choose MongoDB for rapidly changing schemas, large volumes of unstructured data, horizontal scaling, or when document-style data naturally fits your use case.', level: 'Medium' },
  ],
  'default': [
    { q: 'Tell me about yourself and your key technical skills.', a: 'Give a 2-3 minute summary: education, key projects, top technical skills, and why you are excited about this role. Practice this — it is asked in every interview!', level: 'Easy', skill: 'General' },
    { q: 'Describe a challenging project you worked on.', a: 'Use the STAR method: Situation, Task, Action, Result. Pick a real project, emphasize your thought process, challenges overcome, and what you learned.', level: 'Medium', skill: 'General' },
    { q: 'Why do you want to work at this company?', a: 'Research the company first. Mention their tech stack, products, or culture that interests you. Connect it to your skills and goals. Never just say "for the salary".', level: 'Easy', skill: 'General' },
  ]
}

function generateInterviewQuestions(matchedSkills, detectedRole) {
  const questions = []
  const added = new Set()
  const roleQuestions = {
    'Full Stack Developer': [
      { q: 'How do you decide when to put logic in frontend vs backend?', a: 'Security and business logic go backend. UI interactions go frontend. Validate on both sides — frontend for UX, backend for security. Never trust client-side validation alone.', level: 'Medium', skill: 'System Design' },
      { q: 'How do you optimize a slow web application?', a: 'Profile first (Chrome DevTools, backend profilers). Frontend: lazy loading, code splitting. Backend: DB query optimization, indexes, caching with Redis, CDN for static assets.', level: 'Hard', skill: 'Performance' },
    ],
    'Python Developer': [
      { q: 'How do you structure a large Python project?', a: 'Use packages with __init__.py, separate concerns (models, views, utils, tests), virtual environments, follow PEP 8, write unit tests, use type hints for clarity.', level: 'Medium', skill: 'Python' },
    ],
    'Data Scientist / ML Engineer': [
      { q: 'How do you handle imbalanced datasets in classification?', a: 'Use oversampling (SMOTE), undersampling, class_weight parameter, different metrics (F1, AUC-ROC instead of accuracy), or ensemble methods like balanced random forest.', level: 'Hard', skill: 'Machine Learning' },
      { q: 'How do you deploy a machine learning model to production?', a: 'Save model (joblib/pickle), wrap in REST API (FastAPI/Flask), containerize with Docker, deploy on cloud, monitor for data drift and performance degradation over time.', level: 'Hard', skill: 'MLOps' },
    ],
  }
  const roleQ = roleQuestions[detectedRole?.role] || []
  roleQ.forEach(q => { if (!added.has(q.q)) { questions.push(q); added.add(q.q) } })
  for (const skill of matchedSkills) {
    if (INTERVIEW_QUESTIONS[skill]) {
      INTERVIEW_QUESTIONS[skill].forEach(q => { if (!added.has(q.q)) { questions.push({ ...q, skill }); added.add(q.q) } })
    }
    if (questions.length >= 15) break
  }
  INTERVIEW_QUESTIONS['default'].forEach(q => { if (!added.has(q.q)) { questions.push({ ...q, skill: 'General' }); added.add(q.q) } })
  return questions.slice(0, 15)
}


function detectJobRole(jdText, skills) {
  const text = jdText.toLowerCase()
  const s = skills.map(x => x.toLowerCase())
  const roles = [
    { role: 'Full Stack Developer', icon: '🌐', keywords: ['react', 'node.js', 'mongodb', 'express', 'full stack', 'frontend', 'backend'], skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML', 'CSS'] },
    { role: 'Python Developer', icon: '🐍', keywords: ['python', 'django', 'flask', 'fastapi', 'backend'], skills: ['Python', 'Django', 'Flask', 'FastAPI', 'SQL'] },
    { role: 'Data Scientist / ML Engineer', icon: '🤖', keywords: ['machine learning', 'deep learning', 'data science', 'model', 'tensorflow', 'pytorch', 'nlp'], skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy'] },
    { role: 'Frontend Developer', icon: '🎨', keywords: ['react', 'vue', 'angular', 'ui', 'ux', 'css', 'javascript', 'frontend', 'html'], skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'] },
    { role: 'DevOps Engineer', icon: '⚙️', keywords: ['docker', 'kubernetes', 'ci/cd', 'aws', 'jenkins', 'devops', 'terraform'], skills: ['Docker', 'Kubernetes', 'AWS', 'Git', 'Linux'] },
    { role: 'Backend Developer', icon: '🔧', keywords: ['api', 'rest', 'backend', 'server', 'database', 'microservices'], skills: ['Python', 'Node.js', 'SQL', 'MongoDB', 'Docker'] },
    { role: 'Android / Mobile Developer', icon: '📱', keywords: ['android', 'ios', 'flutter', 'react native', 'mobile', 'kotlin', 'swift'], skills: ['Flutter', 'React Native', 'Android', 'Kotlin'] },
    { role: 'Data Engineer', icon: '📊', keywords: ['spark', 'hadoop', 'etl', 'pipeline', 'data engineer', 'kafka', 'airflow'], skills: ['Python', 'Spark', 'SQL', 'Kafka', 'Airflow'] },
  ]
  let best = null, bestScore = 0
  for (const r of roles) {
    let score = r.keywords.filter(k => text.includes(k)).length * 2
    score += r.skills.filter(sk => s.includes(sk.toLowerCase())).length
    if (score > bestScore) { bestScore = score; best = r }
  }
  return best || { role: 'Software Developer', icon: '💻', keywords: [], skills: [] }
}

// ── Resume Tips ───────────────────────────────────────────────────────────────
function generateResumeTips(resumeText, resumeSkills, missingSkills, matchScore) {
  const tips = []
  const text = resumeText.toLowerCase()
  const words = resumeText.split(/\s+/).length

  if (words < 300) tips.push({ type: 'error', tip: `Your resume is too short (${words} words). Aim for 300–600 words. Add more project descriptions and achievements.` })
  else if (words > 700) tips.push({ type: 'warning', tip: `Resume is quite long (${words} words). Keep it under 700 words for better readability.` })
  else tips.push({ type: 'success', tip: `Good resume length (${words} words). Just right!` })

  if (!/@/.test(resumeText)) tips.push({ type: 'error', tip: 'Add your email address — recruiters need this to contact you.' })
  else tips.push({ type: 'success', tip: 'Email address found. ✓' })

  if (!/github\.com|linkedin\.com|portfolio/i.test(resumeText)) tips.push({ type: 'warning', tip: 'Add your GitHub / LinkedIn / Portfolio URL to stand out from other candidates.' })
  else tips.push({ type: 'success', tip: 'Online profile link found (GitHub/LinkedIn). ✓' })

  if (!/education|university|college|degree|b\.?tech|m\.?tech|bsc/i.test(resumeText)) tips.push({ type: 'error', tip: 'Education section is missing. Add your degree, college name, and graduation year.' })
  else tips.push({ type: 'success', tip: 'Education section found. ✓' })

  const actionVerbs = ['developed', 'built', 'designed', 'implemented', 'created', 'managed', 'improved', 'optimized', 'deployed', 'led']
  const found = actionVerbs.filter(v => text.includes(v))
  if (found.length < 3) tips.push({ type: 'warning', tip: `Use strong action verbs! Found only ${found.length}. Add: "Developed", "Built", "Designed", "Implemented", "Optimized" in your experience section.` })
  else tips.push({ type: 'success', tip: `Strong action verbs found: ${found.slice(0, 3).join(', ')}. ✓` })

  if (!/\d+%|\d+ users|\d+ projects|\d+ months|\d+x/i.test(resumeText)) tips.push({ type: 'warning', tip: 'Add quantifiable achievements! Example: "Improved performance by 40%", "Built app for 500+ users".' })
  else tips.push({ type: 'success', tip: 'Quantifiable achievements found. ✓' })

  if (missingSkills.length > 0) tips.push({ type: 'warning', tip: `Add these missing skills to increase your match: ${missingSkills.slice(0, 4).join(', ')}.` })

  if (matchScore >= 80) tips.push({ type: 'success', tip: '🎉 Excellent job match! Your resume is well-tailored for this role.' })
  else if (matchScore >= 60) tips.push({ type: 'warning', tip: '👍 Good match! A few more relevant skills could make you a top candidate.' })
  else tips.push({ type: 'error', tip: '📚 Low match. Tailor your resume keywords to match the job description more closely.' })

  return tips
}

// ── Skill Donut Chart ─────────────────────────────────────────────────────────
function DonutChart({ matched, missing, total }) {
  const size = 140, stroke = 22, r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const matchedPct = total > 0 ? matched / total : 0
  const missingPct = total > 0 ? missing / total : 0
  const unmatchedPct = total > 0 ? Math.max(0, 1 - matchedPct - missingPct) : 1
  const matchedLen = matchedPct * circ
  const missingLen = missingPct * circ
  const unmatchedLen = unmatchedPct * circ
  const gap = 2
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e3a" strokeWidth={stroke} />
      {/* Matched */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#10b981" strokeWidth={stroke}
        strokeDasharray={`${Math.max(0, matchedLen - gap)} ${circ - Math.max(0, matchedLen - gap)}`}
        strokeDashoffset={0} style={{ transition: 'stroke-dasharray 1s ease' }} />
      {/* Missing */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ef4444" strokeWidth={stroke}
        strokeDasharray={`${Math.max(0, missingLen - gap)} ${circ - Math.max(0, missingLen - gap)}`}
        strokeDashoffset={-(matchedLen)} style={{ transition: 'stroke-dasharray 1s ease' }} />
    </svg>
  )
}

function SkillBarChart({ skills, type, dark }) {
  const color = type === 'matched' ? '#10b981' : '#ef4444'
  const max = skills.length
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {skills.slice(0, 6).map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: dark ? '#334155' : '#94a3b8', width: '90px', textAlign: 'right', flexShrink: 0 }}>{s}</span>
          <div style={{ flex: 1, background: dark ? '#e2e8f0' : '#1e1e3a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${((max - i) / max) * 100}%`, height: '100%', background: color, borderRadius: '4px', transition: `width ${0.5 + i * 0.1}s ease` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const matchColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : '#ef4444'
const matchLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Moderate' : 'Low'

function calcResumeScore(resumeText, resumeSkills) {
  let score = 0; const checks = []
  const text = resumeText.toLowerCase()
  const words = resumeText.split(/\s+/).length
  if (words >= 300) { score += 20; checks.push({ label: `Good length (${words} words)`, pass: true }) }
  else { checks.push({ label: `Too short (${words} words, aim for 300+)`, pass: false }) }
  if (resumeSkills.length >= 8) { score += 20; checks.push({ label: `Strong skills (${resumeSkills.length} found)`, pass: true }) }
  else if (resumeSkills.length >= 4) { score += 10; checks.push({ label: `Average skills (${resumeSkills.length}, aim for 8+)`, pass: false }) }
  else { checks.push({ label: `Weak skills (${resumeSkills.length} found)`, pass: false }) }
  const hasEmail = /@/.test(resumeText); const hasPhone = /\d{10}|\d{3}[-.\s]\d{3}/.test(resumeText)
  if (hasEmail && hasPhone) { score += 15; checks.push({ label: 'Contact info (email + phone)', pass: true }) }
  else { checks.push({ label: 'Missing contact info', pass: false }) }
  if (/education|university|college|degree|b\.?tech/i.test(resumeText)) { score += 15; checks.push({ label: 'Education section found', pass: true }) }
  else { checks.push({ label: 'Education section missing', pass: false }) }
  if (/experience|project|internship|worked|developed|built/i.test(resumeText)) { score += 15; checks.push({ label: 'Experience/Projects found', pass: true }) }
  else { checks.push({ label: 'No experience/projects found', pass: false }) }
  const av = ['developed','built','designed','implemented','created','managed','improved','optimized']
  const fv = av.filter(v => text.includes(v))
  if (fv.length >= 3) { score += 15; checks.push({ label: `Strong action verbs (${fv.slice(0,2).join(', ')}...)`, pass: true }) }
  else { checks.push({ label: `Add action verbs (developed, built, etc.)`, pass: false }) }
  return { score, checks }
}

function calcATSScore(resumeText, resumeSkills, jdSkills) {
  let score = 0; const checks = []
  const matched = resumeSkills.filter(s => jdSkills.includes(s))
  const keyPct = jdSkills.length > 0 ? (matched.length / jdSkills.length) * 100 : 0
  score += Math.round((keyPct / 100) * 30)
  checks.push({ label: `Keyword match: ${matched.length}/${jdSkills.length} JD skills`, pass: keyPct >= 50 })
  score += 20; checks.push({ label: 'Text-based PDF (ATS readable)', pass: true })
  if (/education|experience|skills|projects|summary/i.test(resumeText)) { score += 25; checks.push({ label: 'Standard sections detected', pass: true }) }
  else { checks.push({ label: 'Missing standard sections', pass: false }) }
  if ((resumeText.match(/[★●▪►]/g) || []).length < 5) { score += 10; checks.push({ label: 'Clean formatting', pass: true }) }
  else { checks.push({ label: 'Too many special characters', pass: false }) }
  if (/@/.test(resumeText)) { score += 15; checks.push({ label: 'Email address found', pass: true }) }
  else { checks.push({ label: 'No email found', pass: false }) }
  return { score: Math.min(score, 100), checks }
}

function ScoreCircle({ score, label, size = 80 }) {
  const stroke = 10, nr = size - stroke * 2, circ = nr * 2 * Math.PI
  const offset = circ - (score / 100) * circ
  const color = matchColor(score)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg height={size * 2} width={size * 2}>
        <circle stroke="#1e1e3a" fill="transparent" strokeWidth={stroke} r={nr} cx={size} cy={size} />
        <circle stroke={color} fill="transparent" strokeWidth={stroke}
          strokeDasharray={`${circ} ${circ}`}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1.2s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          r={nr} cx={size} cy={size} />
        <text x="50%" y="46%" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize={size * 0.28} fontWeight="800">{score}%</text>
        <text x="50%" y="66%" dominantBaseline="middle" textAnchor="middle" fill="#94a3b8" fontSize={size * 0.14}>{matchLabel(score)}</text>
      </svg>
      <p style={{ color, fontWeight: 700, fontSize: '13px' }}>{label}</p>
    </div>
  )
}

function ProgressBar({ score, dark }) {
  const color = matchColor(score)
  return (
    <div style={{ width: '100%', marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ color: '#64748b', fontSize: '11px' }}>0%</span>
        <span style={{ color, fontSize: '12px', fontWeight: 700 }}>{score}%</span>
        <span style={{ color: '#64748b', fontSize: '11px' }}>100%</span>
      </div>
      <div style={{ background: dark ? '#e2e8f0' : '#1e1e3a', borderRadius: '10px', height: '9px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: '10px', background: `linear-gradient(90deg, ${color}, ${color}99)`, transition: 'width 1.2s ease' }} />
      </div>
    </div>
  )
}

function CheckList({ checks, dark }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
      {checks.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '8px', background: c.pass ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${c.pass ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
          <span>{c.pass ? '✅' : '❌'}</span>
          <span style={{ fontSize: '12px', color: dark ? '#334155' : '#94a3b8' }}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}

function SkillBadge({ skill, type, dark }) {
  const colors = { matched: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', text: '#10b981' }, missing: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#ef4444' }, neutral: { bg: 'rgba(99,102,241,0.15)', border: '#6366f1', text: dark ? '#4f46e5' : '#818cf8' } }
  const c = colors[type] || colors.neutral
  const link = type === 'missing' && COURSE_LINKS[skill]
  const style = { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text, display: 'inline-block', margin: '3px' }
  return link ? <a href={link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}><span style={{ ...style, cursor: 'pointer' }}>✗ {skill} 🔗</span></a> : <span style={style}>{type === 'matched' ? '✓ ' : type === 'missing' ? '✗ ' : ''}{skill}</span>
}


// -- Interview Card Component --
function InterviewCard({ question, index, dark, theme }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const levelColors = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' }
  const color = levelColors[question.level] || '#6366f1'
  return (
    <div style={{ background: theme.card, borderRadius: '14px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>{index + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, background: color + '20', color, border: '1px solid ' + color + '40' }}>{question.level}</span>
                {question.skill && <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>{question.skill}</span>}
              </div>
              <p style={{ color: theme.text, fontSize: '14px', fontWeight: 600, lineHeight: '1.5', margin: 0 }}>{question.q}</p>
            </div>
          </div>
          <button onClick={() => setShowAnswer(!showAnswer)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: showAnswer ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: showAnswer ? '#ef4444' : '#10b981', fontSize: '12px', fontWeight: 700, fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
            {showAnswer ? 'Hide' : 'Show Answer'}
          </button>
        </div>
        {showAnswer && (
          <div style={{ marginTop: '12px', marginLeft: '40px', padding: '14px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, marginBottom: '6px' }}>SUGGESTED ANSWER</p>
            <p style={{ fontSize: '13px', color: theme.subtext, lineHeight: '1.7', margin: 0 }}>{question.a}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function UploadZone({ onFileAccepted, file, dark }) {
  const onDrop = useCallback(a => { if (a[0]) onFileAccepted(a[0]) }, [onFileAccepted])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 })
  return (
    <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? '#6366f1' : file ? '#10b981' : dark ? '#cbd5e1' : '#334155'}`, borderRadius: '12px', padding: '26px', textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}>
      <input {...getInputProps()} />
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{file ? '✅' : '📄'}</div>
      {file ? <div><p style={{ color: '#10b981', fontWeight: 600, fontSize: '13px' }}>{file.name}</p><p style={{ color: '#64748b', fontSize: '11px' }}>Click to replace</p></div>
        : <div><p style={{ color: dark ? '#475569' : '#94a3b8', fontWeight: 500, fontSize: '13px' }}>Drop resume PDF here</p><p style={{ color: '#64748b', fontSize: '11px' }}>or click to browse</p></div>}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState('single')
  const [activeResultTab, setActiveResultTab] = useState('overview')
  const [files, setFiles] = useState([null, null, null])
  const [compareResults, setCompareResults] = useState([])
  const [compareLoading, setCompareLoading] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const printRef = useRef()

  const isDark = darkMode
  const theme = {
    bg: isDark ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)' : 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f0f4ff 100%)',
    card: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
    border: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.15)',
    text: isDark ? '#e2e8f0' : '#1e293b',
    subtext: '#64748b',
    header: isDark ? 'rgba(15,15,26,0.9)' : 'rgba(255,255,255,0.95)',
    input: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.05)',
    inputBorder: isDark ? '#1e293b' : '#c7d2fe',
  }
  const card = (extra = {}) => ({ background: theme.card, borderRadius: '16px', padding: '22px', border: `1px solid ${theme.border}`, marginBottom: '18px', boxShadow: isDark ? 'none' : '0 4px 20px rgba(99,102,241,0.08)', ...extra })

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) { setError('Please upload a resume PDF and enter a job description.'); return }
    setError(''); setLoading(true)
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('job_description', jd)
      const res = await axios.post(`${API_URL}/analyze`, fd)
      setResult(res.data); setActiveResultTab('overview')
    } catch { setError('Failed to connect to backend. Make sure server is running on port 8000.') }
    setLoading(false)
  }

  const handleCompare = async () => {
    const vf = files.filter(f => f !== null)
    if (vf.length < 2 || !jd.trim()) { setError('Please upload at least 2 resumes and enter a job description.'); return }
    setError(''); setCompareLoading(true); setCompareResults([])
    try {
      const results = await Promise.all(vf.map(async f => { const fd = new FormData(); fd.append('file', f); fd.append('job_description', jd); const r = await axios.post(`${API_URL}/analyze`, fd); return { name: f.name, ...r.data } }))
      setCompareResults(results.sort((a, b) => b.match_score - a.match_score))
    } catch { setError('Failed to analyze.') }
    setCompareLoading(false)
  }

  const handleReset = () => { setFile(null); setJd(''); setResult(null); setError(''); setShowPreview(false); setCompareResults([]); setFiles([null, null, null]); setEmailSent(false); setEmailInput('') }

  const handleSendEmail = () => {
    if (!emailInput.includes('@')) { alert('Please enter a valid email address.'); return }
    const r = result
    const rs = calcResumeScore(r.resume_text_preview || '', r.resume_skills)
    const ats = calcATSScore(r.resume_text_preview || '', r.resume_skills, r.jd_skills)
    const nl = '\n'
    const report = '====================================' + nl +
      '   AI RESUME SCREENER REPORT' + nl +
      '====================================' + nl + nl +
      'Resume: ' + (file?.name || 'Resume') + nl +
      'Date: ' + new Date().toLocaleDateString() + nl +
      'Detected Role: ' + (detectedRole?.role || 'Software Developer') + nl + nl +
      '--- SCORES ---' + nl +
      'Job Match Score : ' + r.match_score + '%' + nl +
      'Resume Score    : ' + rs.score + '/100' + nl +
      'ATS Score       : ' + ats.score + '/100' + nl + nl +
      '--- MATCHED SKILLS ---' + nl +
      (r.matched_skills.join(', ') || 'None') + nl + nl +
      '--- MISSING SKILLS ---' + nl +
      (r.missing_skills.join(', ') || 'None') + nl + nl +
      '--- AI RECOMMENDATIONS ---' + nl +
      r.suggestions.map((s, i) => (i+1) + '. ' + s).join(nl) + nl + nl +
      '====================================' + nl +
      'Generated by AI Resume Screener' + nl +
      '===================================='
    navigator.clipboard.writeText(report).catch(() => {})
    const subject = encodeURIComponent('Resume Analysis Report - ' + (file?.name || 'Resume'))
    const body = encodeURIComponent(report)
    window.open('mailto:' + emailInput + '?subject=' + subject + '&body=' + body, '_blank')
    setEmailSent(true)
  }

  const handleExportPDF = () => {
    const r = result
    const rs = calcResumeScore(r.resume_text_preview || '', r.resume_skills)
    const ats = calcATSScore(r.resume_text_preview || '', r.resume_skills, r.jd_skills)
    const role = detectJobRole(jd, r.jd_skills)
    const tips = generateResumeTips(r.resume_text_preview || '', r.resume_skills, r.missing_skills, r.match_score)
    const w = window.open('', '_blank')
    w.document.write(`<html><head><title>Resume Report</title><style>body{font-family:Arial;padding:28px;color:#1a1a2e}h1{color:#6366f1}h2{color:#334155;border-bottom:2px solid #e2e8f0;padding-bottom:6px}.badge{display:inline-block;padding:3px 10px;border-radius:16px;margin:2px;font-size:11px;font-weight:600}.matched{background:#d1fae5;color:#065f46}.missing{background:#fee2e2;color:#991b1b}.tip{padding:8px 12px;border-radius:6px;margin:4px 0;font-size:12px}.tip-ok{background:#d1fae5;color:#065f46}.tip-warn{background:#fef3c7;color:#92400e}.tip-err{background:#fee2e2;color:#991b1b}.check{padding:6px 10px;border-radius:6px;margin:3px 0;font-size:12px}.pass{background:#d1fae5;color:#065f46}.fail{background:#fee2e2;color:#991b1b}.scores{display:flex;gap:14px;margin:14px 0}.score-box{text-align:center;padding:12px;background:#f8fafc;border-radius:10px;flex:1}.snum{font-size:26px;font-weight:900}</style></head><body>
    <h1>🤖 AI Resume Analysis Report</h1><p style="color:#64748b">Generated on ${new Date().toLocaleDateString()}</p>
    <p><strong>Detected Role:</strong> ${role.icon} ${role.role}</p>
    <div class="scores">
      <div class="score-box"><div class="snum" style="color:${matchColor(r.match_score)}">${r.match_score}%</div><div>Job Match</div></div>
      <div class="score-box"><div class="snum" style="color:${matchColor(rs.score)}">${rs.score}/100</div><div>Resume Score</div></div>
      <div class="score-box"><div class="snum" style="color:${matchColor(ats.score)}">${ats.score}/100</div><div>ATS Score</div></div>
      <div class="score-box"><div class="snum" style="color:#6366f1">${r.matched_skills.length}/${r.jd_skills.length}</div><div>Skills Matched</div></div>
    </div>
    <h2>✅ Matched Skills</h2><div>${r.matched_skills.map(s => `<span class="badge matched">✓ ${s}</span>`).join('')}</div>
    <h2>❌ Missing Skills</h2><div>${r.missing_skills.map(s => `<span class="badge missing">✗ ${s}</span>`).join('')}</div>
    <h2>📝 Resume Tips</h2>${tips.map(t => `<div class="tip ${t.type === 'success' ? 'tip-ok' : t.type === 'warning' ? 'tip-warn' : 'tip-err'}">${t.tip}</div>`).join('')}
    <h2>📈 Resume Score</h2>${rs.checks.map(c => `<div class="check ${c.pass ? 'pass' : 'fail'}">${c.pass ? '✅' : '❌'} ${c.label}</div>`).join('')}
    <h2>🔍 ATS Score</h2>${ats.checks.map(c => `<div class="check ${c.pass ? 'pass' : 'fail'}">${c.pass ? '✅' : '❌'} ${c.label}</div>`).join('')}
    <h2>💡 Recommendations</h2>${r.suggestions.map(s => `<div class="tip tip-warn">${s}</div>`).join('')}
    </body></html>`)
    w.document.close(); w.print()
  }

  const resumeScore = result ? calcResumeScore(result.resume_text_preview || '', result.resume_skills) : null
  const atsScore = result ? calcATSScore(result.resume_text_preview || '', result.resume_skills, result.jd_skills) : null
  const detectedRole = result ? detectJobRole(jd, result.jd_skills) : null
  const interviewQuestions = result ? generateInterviewQuestions(result.matched_skills, detectedRole) : []
  const resumeTips = result ? generateResumeTips(result.resume_text_preview || '', result.resume_skills, result.missing_skills, result.match_score) : []

  const resultTabs = ['overview', 'skills chart', 'resume tips', 'ats & score', 'interview', 'email report']

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'all 0.3s' }}>
      {/* Header */}
      <header style={{ padding: '15px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 100, background: theme.header, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px' }}>🤖</div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: theme.text }}>AI Resume Screener</h1>
            <p style={{ fontSize: '10px', color: theme.subtext }}>Powered by NLP & Machine Learning</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!result && compareResults.length === 0 && (
            <div style={{ display: 'flex', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.08)', borderRadius: '10px', padding: '3px' }}>
              {['single', 'compare'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '5px 13px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif', background: activeTab === tab ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent', color: activeTab === tab ? 'white' : theme.subtext, transition: 'all 0.2s' }}>
                  {tab === 'single' ? '📄 Single' : '📊 Compare'}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setDarkMode(!darkMode)} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: isDark ? '#6366f1' : '#e2e8f0', position: 'relative', transition: 'all 0.3s' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: isDark ? '23px' : '3px', transition: 'left 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{isDark ? '🌙' : '☀️'}</div>
          </button>
          <div style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>● Live</div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 18px' }} ref={printRef}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Match Your Resume to Any Job</h2>
          <p style={{ color: theme.subtext, fontSize: '14px', maxWidth: '460px', margin: '0 auto' }}>Get Match Score, Resume Score, ATS Score, Job Role Detection & Tips instantly!</p>
        </div>

        {/* ── SINGLE INPUT ── */}
        {result === null && compareResults.length === 0 && activeTab === 'single' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={card()}><h3 style={{ color: theme.text, fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>📎 Upload Resume (PDF)</h3><UploadZone onFileAccepted={setFile} file={file} dark={!isDark} /></div>
              <div style={card()}>
                <h3 style={{ color: theme.text, fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>📋 Job Description</h3>
                <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste job description here...&#10;&#10;We are looking for a Python developer with Django, React, MySQL, Git..."
                  style={{ width: '100%', height: '170px', background: theme.input, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, padding: '12px', fontSize: '13px', resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', lineHeight: '1.6', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = theme.inputBorder} />
              </div>
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '16px', color: '#fca5a5', textAlign: 'center', fontSize: '13px' }}>⚠️ {error}</div>}
            <div style={{ textAlign: 'center' }}>
              <button onClick={handleAnalyze} disabled={loading} style={{ padding: '14px 46px', borderRadius: '50px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#334155' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontSize: '15px', fontWeight: 700, fontFamily: 'Inter, sans-serif', boxShadow: loading ? 'none' : '0 0 34px rgba(99,102,241,0.4)', transition: 'all 0.3s' }}>
                {loading ? '🔄 Analyzing...' : '🚀 Analyze Resume'}
              </button>
            </div>
          </>
        )}

        {/* ── COMPARE INPUT ── */}
        {result === null && compareResults.length === 0 && activeTab === 'compare' && (
          <>
            <div style={card()}><h3 style={{ color: theme.text, fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>📋 Job Description</h3>
              <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste job description here..."
                style={{ width: '100%', height: '100px', background: theme.input, border: `2px solid ${theme.inputBorder}`, borderRadius: '12px', color: theme.text, padding: '12px', fontSize: '13px', resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = theme.inputBorder} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={card()}><h4 style={{ color: theme.subtext, fontWeight: 600, marginBottom: '10px', fontSize: '13px' }}>Resume {i + 1} {i === 0 ? '(Required)' : '(Optional)'}</h4>
                  <UploadZone onFileAccepted={f => { const nf = [...files]; nf[i] = f; setFiles(nf) }} file={files[i]} dark={!isDark} /></div>
              ))}
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '16px', color: '#fca5a5', textAlign: 'center' }}>⚠️ {error}</div>}
            <div style={{ textAlign: 'center' }}>
              <button onClick={handleCompare} disabled={compareLoading} style={{ padding: '14px 46px', borderRadius: '50px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontSize: '15px', fontWeight: 700, fontFamily: 'Inter, sans-serif', boxShadow: '0 0 34px rgba(99,102,241,0.4)' }}>
                {compareLoading ? '🔄 Comparing...' : '📊 Compare Resumes'}
              </button>
            </div>
          </>
        )}

        {/* ── COMPARE RESULTS ── */}
        {compareResults.length > 0 && (
          <div>
            <h3 style={{ color: theme.text, fontWeight: 700, fontSize: '18px', marginBottom: '16px', textAlign: 'center' }}>📊 Resume Ranking</h3>
            {compareResults.map((r, i) => (
              <div key={i} style={card({ border: i === 0 ? '1px solid rgba(99,102,241,0.4)' : `1px solid ${theme.border}` })}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '26px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                  <div style={{ flex: 1 }}><p style={{ color: theme.text, fontWeight: 700, marginBottom: '4px', fontSize: '14px' }}>{r.name}</p><ProgressBar score={r.match_score} dark={!isDark} /></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: '26px', fontWeight: 900, color: matchColor(r.match_score) }}>{r.match_score}%</div><div style={{ fontSize: '11px', color: theme.subtext }}>{r.matched_skills.length}/{r.jd_skills.length} skills</div></div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center' }}><button onClick={handleReset} style={{ padding: '11px 30px', borderRadius: '50px', border: '2px solid #6366f1', cursor: 'pointer', background: 'transparent', color: '#818cf8', fontSize: '13px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>🔄 Start Over</button></div>
          </div>
        )}

        {/* ── SINGLE RESULT ── */}
        {result !== null && (
          <div>
            {/* Job Role Banner */}
            {detectedRole && (
              <div style={{ ...card({ border: '1px solid rgba(99,102,241,0.3)' }), display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontSize: '36px' }}>{detectedRole.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px' }}>📄</span>
                      <p style={{ color: '#6366f1', fontSize: '13px', fontWeight: 700, margin: 0 }}>{file?.name || 'Resume'}</p>
                    </div>
                    <p style={{ color: theme.subtext, fontSize: '11px', marginBottom: '2px' }}>🎯 DETECTED JOB ROLE</p>
                    <h3 style={{ color: theme.text, fontWeight: 800, fontSize: '20px' }}>{detectedRole.role}</h3>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleExportPDF} style={{ padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: '12px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>📥 Export PDF</button>
                  <button onClick={handleReset} style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid #6366f1', cursor: 'pointer', background: 'transparent', color: '#818cf8', fontSize: '12px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>🔄 New Analysis</button>
                </div>
              </div>
            )}

            {/* 3 Score Circles */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <ScoreCircle score={result.match_score} label="Job Match" size={72} />
                <ScoreCircle score={resumeScore.score} label="Resume Score" size={72} />
                <ScoreCircle score={atsScore.score} label="ATS Score" size={72} />
              </div>
              <ProgressBar score={result.match_score} dark={!isDark} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                {[{ label: 'In Resume', value: result.resume_skills.length, color: '#6366f1' }, { label: 'Required', value: result.jd_skills.length, color: '#8b5cf6' }, { label: 'Matched', value: result.matched_skills.length, color: '#10b981' }].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '10px 14px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.05)', borderRadius: '10px', border: `1px solid ${s.color}30` }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '10px', color: theme.subtext }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Result Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {resultTabs.map(tab => (
                <button key={tab} onClick={() => setActiveResultTab(tab)} style={{ padding: '8px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif', background: activeResultTab === tab ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.08)', color: activeResultTab === tab ? 'white' : theme.subtext, transition: 'all 0.2s' }}>
                  {tab === 'overview' ? '📊 Overview' : tab === 'skills chart' ? '📈 Skills Chart' : tab === 'resume tips' ? '📝 Resume Tips' : tab === 'ats & score' ? '🔍 ATS & Score' : tab === 'interview' ? '🎤 Interview Prep' : '📧 Email Report'}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeResultTab === 'overview' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={card({ border: '1px solid rgba(16,185,129,0.2)' })}>
                    <h4 style={{ color: '#10b981', fontWeight: 700, marginBottom: '10px', fontSize: '14px' }}>✅ Matched Skills ({result.matched_skills.length})</h4>
                    {result.matched_skills.length > 0 ? result.matched_skills.map(s => <SkillBadge key={s} skill={s} type="matched" dark={!isDark} />) : <p style={{ color: theme.subtext, fontSize: '13px' }}>No matching skills found.</p>}
                  </div>
                  <div style={card({ border: '1px solid rgba(239,68,68,0.2)' })}>
                    <h4 style={{ color: '#ef4444', fontWeight: 700, marginBottom: '4px', fontSize: '14px' }}>✗ Missing Skills ({result.missing_skills.length})</h4>
                    <p style={{ color: theme.subtext, fontSize: '11px', marginBottom: '8px' }}>🔗 Click to find a free course!</p>
                    {result.missing_skills.length > 0 ? result.missing_skills.map(s => <SkillBadge key={s} skill={s} type="missing" dark={!isDark} />) : <p style={{ color: theme.subtext, fontSize: '13px' }}>🎉 You have all required skills!</p>}
                  </div>
                </div>
                <div style={card({ border: '1px solid rgba(99,102,241,0.2)' })}>
                  <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>💡 AI Recommendations</h4>
                  {result.suggestions.map((s, i) => <div key={i} style={{ background: isDark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.05)', borderRadius: '10px', padding: '10px 14px', border: '1px solid rgba(99,102,241,0.15)', color: theme.subtext, fontSize: '13px', lineHeight: '1.5', marginBottom: '7px' }}>{s}</div>)}
                </div>
                <div style={card()}>
                  <h4 style={{ color: theme.text, fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>📄 All Skills in Resume</h4>
                  {result.resume_skills.map(s => <SkillBadge key={s} skill={s} type="neutral" dark={!isDark} />)}
                </div>
              </>
            )}

            {/* ── SKILLS CHART TAB ── */}
            {activeResultTab === 'skills chart' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={card()}>
                  <h4 style={{ color: theme.text, fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>🍩 Skills Overview</h4>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <DonutChart matched={result.matched_skills.length} missing={result.missing_skills.length} total={result.jd_skills.length || 1} />
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: matchColor(result.match_score) }}>{result.match_score}%</div>
                        <div style={{ fontSize: '9px', color: '#94a3b8' }}>match</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[{ label: 'Matched', count: result.matched_skills.length, color: '#10b981' }, { label: 'Missing', count: result.missing_skills.length, color: '#ef4444' }, { label: 'Extra', count: Math.max(0, result.resume_skills.length - result.matched_skills.length), color: '#6366f1' }].map(item => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }} />
                          <span style={{ fontSize: '13px', color: theme.subtext }}>{item.label}:</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={card()}>
                  <h4 style={{ color: '#10b981', fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>✅ Top Matched Skills</h4>
                  <SkillBarChart skills={result.matched_skills} type="matched" dark={!isDark} />
                </div>
                <div style={card()}>
                  <h4 style={{ color: '#ef4444', fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>❌ Top Missing Skills</h4>
                  <SkillBarChart skills={result.missing_skills} type="missing" dark={!isDark} />
                </div>
                <div style={card()}>
                  <h4 style={{ color: theme.text, fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>📊 Score Summary</h4>
                  {[{ label: 'Job Match', score: result.match_score }, { label: 'Resume Score', score: resumeScore.score }, { label: 'ATS Score', score: atsScore.score }].map(item => (
                    <div key={item.label} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: theme.subtext }}>{item.label}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: matchColor(item.score) }}>{item.score}%</span>
                      </div>
                      <div style={{ background: isDark ? '#1e1e3a' : '#e2e8f0', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.score}%`, height: '100%', background: matchColor(item.score), borderRadius: '6px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── RESUME TIPS TAB ── */}
            {activeResultTab === 'resume tips' && (
              <div style={card()}>
                <h4 style={{ color: theme.text, fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>📝 Personalized Resume Improvement Tips</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {resumeTips.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', borderRadius: '10px', background: t.type === 'success' ? 'rgba(16,185,129,0.08)' : t.type === 'warning' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.2)' : t.type === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{t.type === 'success' ? '✅' : t.type === 'warning' ? '⚠️' : '❌'}</span>
                      <p style={{ fontSize: '13px', color: t.type === 'success' ? '#10b981' : t.type === 'warning' ? '#f59e0b' : '#ef4444', lineHeight: '1.6', margin: 0 }}>{t.tip}</p>
                    </div>
                  ))}
                </div>
                {result.resume_text_preview && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h5 style={{ color: theme.subtext, fontWeight: 600, fontSize: '13px' }}>👁️ Resume Preview</h5>
                      <button onClick={() => setShowPreview(!showPreview)} style={{ padding: '4px 10px', borderRadius: '16px', border: `1px solid ${theme.border}`, cursor: 'pointer', background: 'transparent', color: theme.subtext, fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>{showPreview ? 'Hide ▲' : 'Show ▼'}</button>
                    </div>
                    {showPreview && <div style={{ background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)', borderRadius: '10px', padding: '12px', color: theme.subtext, fontSize: '12px', lineHeight: '1.7', maxHeight: '130px', overflow: 'auto', border: `1px solid ${theme.border}` }}>{result.resume_text_preview}...</div>}
                  </div>
                )}
              </div>
            )}

            {/* ── ATS & SCORE TAB ── */}
            {activeResultTab === 'ats & score' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={card({ border: '1px solid rgba(245,158,11,0.3)' })}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ color: '#f59e0b', fontWeight: 700, fontSize: '14px' }}>📈 Resume Score</h4>
                    <span style={{ fontSize: '22px', fontWeight: 900, color: matchColor(resumeScore.score) }}>{resumeScore.score}/100</span>
                  </div>
                  <ProgressBar score={resumeScore.score} dark={!isDark} />
                  <CheckList checks={resumeScore.checks} dark={!isDark} />
                </div>
                <div style={card({ border: '1px solid rgba(139,92,246,0.3)' })}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '14px' }}>🔍 ATS Score</h4>
                    <span style={{ fontSize: '22px', fontWeight: 900, color: matchColor(atsScore.score) }}>{atsScore.score}/100</span>
                  </div>
                  <ProgressBar score={atsScore.score} dark={!isDark} />
                  <CheckList checks={atsScore.checks} dark={!isDark} />
                </div>
              </div>
            )}


            {/* -- INTERVIEW PREP TAB -- */}
            {activeResultTab === 'interview' && (
              <div>
                <div style={{ ...card({ border: '1px solid rgba(99,102,241,0.3)' }), marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '40px' }}>{detectedRole?.icon || '🎤'}</div>
                    <div>
                      <p style={{ color: theme.subtext, fontSize: '11px', marginBottom: '3px' }}>INTERVIEW PREP FOR</p>
                      <h3 style={{ color: theme.text, fontWeight: 800, fontSize: '20px' }}>{detectedRole?.role || 'Software Developer'}</h3>
                      <p style={{ color: theme.subtext, fontSize: '12px', marginTop: '3px' }}>{interviewQuestions.length} questions based on your matched skills</p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {interviewQuestions.map((q, i) => (
                    <InterviewCard key={i} question={q} index={i} dark={!isDark} theme={theme} />
                  ))}
                </div>
                <div style={{ ...card({ border: '1px solid rgba(245,158,11,0.2)', marginTop: '16px' }) }}>
                  <h4 style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '10px', fontSize: '14px' }}>💡 Interview Tips</h4>
                  {['Research the company before the interview — check their website, tech blog, and recent news.',
                    'Use the STAR method for behavioral questions: Situation, Task, Action, Result.',
                    'Prepare 2-3 questions to ask the interviewer — it shows genuine interest.',
                    'Practice coding on paper or whiteboard, not just on a computer.',
                    'Be honest about what you do not know — explain how you would find the answer.'].map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: i < 4 ? `1px solid ${theme.border}` : 'none' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                      <p style={{ fontSize: '13px', color: theme.subtext, margin: 0, lineHeight: '1.5' }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── EMAIL REPORT TAB ── */}
            {activeResultTab === 'email report' && (
              <div style={card({ border: '1px solid rgba(99,102,241,0.3)' })}>
                <h4 style={{ color: theme.text, fontWeight: 700, marginBottom: '6px', fontSize: '15px' }}>📧 Send Report to Your Email</h4>
                <p style={{ color: theme.subtext, fontSize: '13px', marginBottom: '18px' }}>Get your full analysis report delivered to your inbox!</p>
                {!emailSent ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                      placeholder="Enter your email address..."
                      style={{ flex: 1, minWidth: '240px', padding: '12px 16px', borderRadius: '10px', border: `2px solid ${theme.inputBorder}`, background: theme.input, color: theme.text, fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = theme.inputBorder} />
                    <button onClick={handleSendEmail} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontSize: '14px', fontWeight: 700, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                      📧 Send Report
                    </button>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                    <p style={{ color: '#10b981', fontWeight: 700, fontSize: '15px' }}>✅ Report Ready!</p>
                    <p style={{ color: theme.subtext, fontSize: '13px', marginTop: '4px' }}>Your email app should open with the report. The report is also <strong>copied to clipboard</strong> — you can paste it anywhere!</p>
                    <p style={{ color: '#6366f1', fontSize: '12px', marginTop: '6px' }}>💡 If email did not open, just paste (Ctrl+V) the report into Gmail, Outlook, or WhatsApp!</p>
                    <button onClick={() => setEmailSent(false)} style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '20px', border: '1px solid #10b981', cursor: 'pointer', background: 'transparent', color: '#10b981', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>Send to Another Email</button>
                  </div>
                )}
                <div style={{ marginTop: '20px', padding: '16px', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.04)', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                  <h5 style={{ color: theme.subtext, fontWeight: 600, marginBottom: '10px', fontSize: '13px' }}>📋 Report Preview</h5>
                  {[{ label: 'Job Match', value: `${result.match_score}%`, color: matchColor(result.match_score) }, { label: 'Resume Score', value: `${resumeScore.score}/100`, color: matchColor(resumeScore.score) }, { label: 'ATS Score', value: `${atsScore.score}/100`, color: matchColor(atsScore.score) }, { label: 'Matched Skills', value: result.matched_skills.length, color: '#10b981' }, { label: 'Missing Skills', value: result.missing_skills.length, color: '#ef4444' }].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ fontSize: '13px', color: theme.subtext }}>{item.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '4px' }}>
              <button onClick={handleReset} style={{ padding: '11px 28px', borderRadius: '50px', border: '2px solid #6366f1', cursor: 'pointer', background: 'transparent', color: '#818cf8', fontSize: '13px', fontWeight: 700, fontFamily: 'Inter, sans-serif', transition: 'all 0.3s' }}
                onMouseOver={e => { e.target.style.background = '#6366f1'; e.target.style.color = 'white' }}
                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#818cf8' }}>
                🔄 Analyze Another
              </button>
              <button onClick={handleExportPDF} style={{ padding: '11px 28px', borderRadius: '50px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                📥 Download PDF Report
              </button>
            </div>
          </div>
        )}
      </main>
      <footer style={{ textAlign: 'center', padding: '24px 20px', color: theme.subtext, fontSize: '12px' }}>Built with ❤️ using React + FastAPI + NLP</footer>
    </div>
  )
}