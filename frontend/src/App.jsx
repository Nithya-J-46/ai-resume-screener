import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

const API_URL = 'https://ai-resume-screener-d429.onrender.com'

const LANG = {
  en: { appName:'AI Resume Screener',tagline:'Powered by NLP & Machine Learning',hero:'Match Your Resume to Any Job',heroSub:'Get Match Score, ATS Score, Salary Estimate & Interview Prep instantly!',upload:'Upload Resume (PDF)',uploadHint:'Drop resume PDF here or click to browse',jdLabel:'Job Description',jdPlaceholder:'Paste job description here...\n\nExample: We are looking for a Python developer with Django, React, MySQL, Git...',analyze:'Analyze Resume',analyzing:'Analyzing...',reset:'Analyze Another',matched:'Matched Skills',missing:'Missing Skills',allSkills:'All Skills in Resume',jobMatch:'Job Match',resumeScore:'Resume Score',atsScore:'ATS Score',salaryEst:'Salary Estimate',strengthMeter:'Resume Strength',overview:'Overview',skillsChart:'Skills Chart',resumeTips:'Resume Tips',atsScoreTab:'ATS & Score',interviewPrep:'Interview Prep',emailReport:'Email Report',resumeBuilder:'Resume Builder',exportPdf:'Export PDF',sendReport:'Send Report',detectedRole:'DETECTED JOB ROLE',loginTitle:'Welcome Back',loginSub:'Sign in to your account',email:'Email Address',password:'Password',login:'Sign In',signup:'Create Account',noAccount:"Don't have an account?",hasAccount:'Already have an account?',guestMode:'Continue as Guest',name:'Full Name',recommendations:'AI Recommendations',interviewTips:'Interview Tips',weakLabel:'Weak',fairLabel:'Fair',goodLabel:'Good',strongLabel:'Strong',excellentLabel:'Excellent',indSalary:'India (LPA)',usSalary:'USA (USD/yr)',experience:'Experience Level',junior:'Junior (0-2 yrs)',mid:'Mid (2-5 yrs)',senior:'Senior (5+ yrs)',copyClipboard:'Copied!',emailSent:'Report Ready!',builderTitle:'Resume Builder',builderSub:'Build a professional resume from your skills',clickCourse:'Click to find a free course!' },
  ta: { appName:'AI ரெஸ்யூம் ஸ்கிரீனர்',tagline:'NLP & மெஷின் லர்னிங் மூலம்',hero:'உங்கள் ரெஸ்யூமை எந்த வேலைக்கும் பொருத்துங்கள்',heroSub:'மேட்ச் ஸ்கோர், ATS ஸ்கோர் உடனடியாக பெறுங்கள்!',upload:'ரெஸ்யூம் அப்லோட் (PDF)',uploadHint:'PDF ஐ இங்கே போடுங்கள்',jdLabel:'வேலை விளக்கம்',jdPlaceholder:'வேலை விளக்கத்தை ஒட்டுங்கள்...',analyze:'பகுப்பாய்வு செய்',analyzing:'பகுப்பாய்வு நடக்கிறது...',reset:'மீண்டும் செய்',matched:'பொருந்திய திறன்கள்',missing:'இல்லாத திறன்கள்',allSkills:'அனைத்து திறன்கள்',jobMatch:'வேலை பொருத்தம்',resumeScore:'ரெஸ்யூம் மதிப்பெண்',atsScore:'ATS மதிப்பெண்',salaryEst:'சம்பள மதிப்பீடு',strengthMeter:'ரெஸ்யூம் வலிமை',overview:'மேலோட்டம்',skillsChart:'திறன் வரைபடம்',resumeTips:'ரெஸ்யூம் குறிப்புகள்',atsScoreTab:'ATS & மதிப்பெண்',interviewPrep:'நேர்காணல் தயாரிப்பு',emailReport:'மின்னஞ்சல் அறிக்கை',resumeBuilder:'ரெஸ்யூம் உருவாக்கி',exportPdf:'PDF ஏற்றுமதி',sendReport:'அறிக்கை அனுப்பு',detectedRole:'கண்டறியப்பட்ட பாத்திரம்',loginTitle:'மீண்டும் வரவேற்கிறோம்',loginSub:'உள்நுழையுங்கள்',email:'மின்னஞ்சல்',password:'கடவுச்சொல்',login:'உள்நுழை',signup:'கணக்கு உருவாக்கு',noAccount:'கணக்கு இல்லையா?',hasAccount:'கணக்கு உள்ளதா?',guestMode:'விருந்தினராக தொடர்',name:'பெயர்',recommendations:'AI பரிந்துரைகள்',interviewTips:'நேர்காணல் குறிப்புகள்',weakLabel:'பலவீனம்',fairLabel:'சரியானது',goodLabel:'நல்லது',strongLabel:'வலிமை',excellentLabel:'சிறப்பு',indSalary:'இந்தியா (LPA)',usSalary:'USA (USD)',experience:'அனுபவம்',junior:'ஜூனியர்',mid:'மிட்',senior:'சீனியர்',copyClipboard:'நகலெடுக்கப்பட்டது!',emailSent:'அறிக்கை தயார்!',builderTitle:'ரெஸ்யூம் உருவாக்கி',builderSub:'தொழில்முறை ரெஸ்யூம் உருவாக்குங்கள்',clickCourse:'இலவச பாடத்திட்டம் கண்டறிய கிளிக்!' },
  hi: { appName:'AI रिज्यूम स्क्रीनर',tagline:'NLP और मशीन लर्निंग द्वारा',hero:'अपने रिज्यूम को किसी भी नौकरी से मिलाएं',heroSub:'मैच स्कोर, ATS स्कोर तुरंत पाएं!',upload:'रिज्यूम अपलोड (PDF)',uploadHint:'PDF यहां छोड़ें',jdLabel:'नौकरी विवरण',jdPlaceholder:'नौकरी विवरण यहां पेस्ट करें...',analyze:'विश्लेषण करें',analyzing:'विश्लेषण हो रहा है...',reset:'दोबारा करें',matched:'मिले कौशल',missing:'गायब कौशल',allSkills:'सभी कौशल',jobMatch:'नौकरी मिलान',resumeScore:'रिज्यूम स्कोर',atsScore:'ATS स्कोर',salaryEst:'वेतन अनुमान',strengthMeter:'रिज्यूम शक्ति',overview:'अवलोकन',skillsChart:'कौशल चार्ट',resumeTips:'रिज्यूम सुझाव',atsScoreTab:'ATS और स्कोर',interviewPrep:'इंटरव्यू तैयारी',emailReport:'ईमेल रिपोर्ट',resumeBuilder:'रिज्यूम बिल्डर',exportPdf:'PDF निर्यात',sendReport:'रिपोर्ट भेजें',detectedRole:'पहचानी गई भूमिका',loginTitle:'वापस स्वागत है',loginSub:'साइन इन करें',email:'ईमेल',password:'पासवर्ड',login:'साइन इन',signup:'खाता बनाएं',noAccount:'खाता नहीं है?',hasAccount:'खाता है?',guestMode:'अतिथि के रूप में जारी',name:'पूरा नाम',recommendations:'AI सिफारिशें',interviewTips:'इंटरव्यू सुझाव',weakLabel:'कमजोर',fairLabel:'ठीक',goodLabel:'अच्छा',strongLabel:'मजबूत',excellentLabel:'उत्कृष्ट',indSalary:'भारत (LPA)',usSalary:'USA (USD)',experience:'अनुभव',junior:'जूनियर',mid:'मिड',senior:'सीनियर',copyClipboard:'कॉपी किया!',emailSent:'रिपोर्ट तैयार!',builderTitle:'रिज्यूम बिल्डर',builderSub:'पेशेवर रिज्यूम बनाएं',clickCourse:'मुफ्त कोर्स खोजें!' }
}

const COURSE_LINKS = { 'Machine Learning':'https://www.coursera.org/learn/machine-learning','Python':'https://www.freecodecamp.org/learn/scientific-computing-with-python/','React':'https://scrimba.com/learn/learnreact','Node.js':'https://www.theodinproject.com/paths/full-stack-javascript','SQL':'https://www.hackerrank.com/domains/sql','Docker':'https://labs.play-with-docker.com/','AWS':'https://aws.amazon.com/free/','TensorFlow':'https://www.tensorflow.org/tutorials','FastAPI':'https://fastapi.tiangolo.com/tutorial/','MongoDB':'https://university.mongodb.com/','Git':'https://learngitbranching.js.org/','TypeScript':'https://www.typescriptlang.org/docs/','Django':'https://docs.djangoproject.com/en/stable/intro/tutorial01/','NLP':'https://huggingface.co/learn/nlp-course/','Pandas':'https://pandas.pydata.org/docs/getting_started/','NumPy':'https://numpy.org/learn/','PyTorch':'https://pytorch.org/tutorials/','Scikit-learn':'https://scikit-learn.org/stable/getting_started.html' }

const SALARY_DATA = { 'Full Stack Developer':{in:[8,18,40],us:[90000,130000,180000]},'Python Developer':{in:[6,15,35],us:[85000,120000,170000]},'Data Scientist / ML Engineer':{in:[8,20,50],us:[100000,150000,220000]},'Frontend Developer':{in:[5,12,30],us:[80000,120000,160000]},'DevOps Engineer':{in:[8,18,45],us:[95000,140000,200000]},'Backend Developer':{in:[6,14,35],us:[85000,125000,175000]},'Android / Mobile Developer':{in:[6,14,32],us:[80000,120000,165000]},'Data Engineer':{in:[8,18,40],us:[95000,140000,195000]},'Software Developer':{in:[5,12,28],us:[75000,110000,160000]} }

const INTERVIEW_QUESTIONS = { 'Python':[{q:'Difference between list and tuple?',a:'Lists are mutable, tuples are immutable. Tuples are faster and used for fixed data.',level:'Easy'},{q:'Explain Python decorators.',a:'A decorator wraps another function to extend behavior. Use @decorator_name syntax.',level:'Medium'},{q:'What is the GIL?',a:'Global Interpreter Lock allows only one thread to execute Python bytecode at a time.',level:'Hard'}],'React':[{q:'Difference between state and props?',a:'Props are passed from parent (read-only). State is managed within component and can change.',level:'Easy'},{q:'Explain useEffect hook.',a:'Runs side effects after render. Replaces componentDidMount and componentDidUpdate.',level:'Medium'},{q:'How does virtual DOM work?',a:'React diffs virtual DOM with previous version and only updates changed real DOM parts.',level:'Hard'}],'Django':[{q:'What is MTV architecture?',a:'Model (database), Template (HTML), View (logic). Similar to MVC.',level:'Easy'},{q:'select_related vs prefetch_related?',a:'select_related uses SQL JOIN for ForeignKey. prefetch_related does separate queries for ManyToMany.',level:'Medium'},{q:'How does Django middleware work?',a:'Hooks into request/response. Runs before views and after views.',level:'Hard'}],'JavaScript':[{q:'Difference between == and ===?',a:'== compares with type coercion. === compares values AND types strictly.',level:'Easy'},{q:'Explain closures.',a:'Inner function remembers outer scope variables even after outer function returns.',level:'Medium'},{q:'What is the event loop?',a:'Call stack runs sync code. Microtask queue (Promises) runs before macrotask (setTimeout).',level:'Hard'}],'SQL':[{q:'INNER JOIN vs LEFT JOIN?',a:'INNER returns matching rows only. LEFT returns all left rows + matching right (NULL if no match).',level:'Easy'},{q:'What is indexing?',a:'Speeds up SELECT queries. Use on frequently queried columns. Avoid over-indexing.',level:'Medium'},{q:'Explain ACID properties.',a:'Atomicity, Consistency, Isolation, Durability — guarantees valid transactions.',level:'Hard'}],'Machine Learning':[{q:'Supervised vs unsupervised learning?',a:'Supervised trains on labeled data. Unsupervised finds patterns in unlabeled data.',level:'Easy'},{q:'Explain overfitting.',a:'Model memorizes training data but fails on new data. Fix: regularization, dropout, more data.',level:'Medium'},{q:'What is gradient descent?',a:'Minimizes loss by updating weights toward steepest descent. Variants: SGD, Adam, RMSprop.',level:'Hard'}],'Git':[{q:'git merge vs git rebase?',a:'Merge creates merge commit. Rebase moves commits on top for linear history.',level:'Easy'},{q:'What is cherry-pick?',a:'Applies a specific commit from one branch to another.',level:'Medium'},{q:'How to resolve merge conflict?',a:'Find <<<<<<< markers, edit manually, then git add and git commit.',level:'Easy'}],'default':[{q:'Tell me about yourself.',a:'Give 2-3 minute summary: education, projects, skills, and why excited about this role.',level:'Easy',skill:'General'},{q:'Describe a challenging project.',a:'Use STAR: Situation, Task, Action, Result. Emphasize your thought process.',level:'Medium',skill:'General'},{q:'Why do you want to work here?',a:'Research company. Mention specific tech or culture. Connect to your goals.',level:'Easy',skill:'General'}] }

const ROADMAP_DATA = { 'Machine Learning':{weeks:12,phases:[{phase:'Foundation',weeks:'Week 1-2',skills:['Python','NumPy','Pandas'],color:'#6366f1'},{phase:'Core ML',weeks:'Week 3-6',skills:['Scikit-learn','Regression','Classification'],color:'#8b5cf6'},{phase:'Deep Learning',weeks:'Week 7-10',skills:['TensorFlow','Neural Networks','CNNs'],color:'#ec4899'},{phase:'Projects',weeks:'Week 11-12',skills:['Kaggle','ML project','GitHub'],color:'#10b981'}],resources:['Coursera ML by Andrew Ng','fast.ai','Kaggle Learn','3Blue1Brown YouTube']},'React':{weeks:8,phases:[{phase:'JavaScript',weeks:'Week 1-2',skills:['ES6+','Promises','Array methods'],color:'#f59e0b'},{phase:'React Basics',weeks:'Week 3-4',skills:['Components','Props','State','JSX'],color:'#6366f1'},{phase:'React Advanced',weeks:'Week 5-6',skills:['Hooks','useEffect','Context','Router'],color:'#8b5cf6'},{phase:'Projects',weeks:'Week 7-8',skills:['Todo app','Weather app','CRUD app'],color:'#10b981'}],resources:['React docs','Scrimba React','Traversy Media','Frontend Mentor']},'Docker':{weeks:4,phases:[{phase:'Basics',weeks:'Week 1',skills:['Images','Containers','Docker CLI'],color:'#06b6d4'},{phase:'Intermediate',weeks:'Week 2',skills:['Dockerfile','docker-compose','Volumes'],color:'#6366f1'},{phase:'Practice',weeks:'Week 3',skills:['Containerize app','Multi-container'],color:'#8b5cf6'},{phase:'Deploy',weeks:'Week 4',skills:['Docker Hub','Cloud deploy'],color:'#10b981'}],resources:['Docker official docs','Play with Docker','TechWorld with Nana']},'AWS':{weeks:10,phases:[{phase:'Basics',weeks:'Week 1-2',skills:['Cloud concepts','IAM','EC2'],color:'#f97316'},{phase:'Core',weeks:'Week 3-5',skills:['S3','RDS','Lambda','API Gateway'],color:'#6366f1'},{phase:'Networking',weeks:'Week 6-7',skills:['VPC','Security Groups','Load Balancer'],color:'#8b5cf6'},{phase:'Certify',weeks:'Week 8-10',skills:['Practice tests','Get certified'],color:'#10b981'}],resources:['AWS free tier','A Cloud Guru','Stephane Maarek Udemy']},'Node.js':{weeks:6,phases:[{phase:'JavaScript',weeks:'Week 1',skills:['Async/Await','Promises','ES6'],color:'#f59e0b'},{phase:'Node Basics',weeks:'Week 2-3',skills:['Express.js','REST APIs','Routing'],color:'#6366f1'},{phase:'Database',weeks:'Week 4',skills:['MongoDB','Mongoose','SQL'],color:'#8b5cf6'},{phase:'Deploy',weeks:'Week 5-6',skills:['JWT Auth','Render/Railway'],color:'#10b981'}],resources:['Node.js docs','The Odin Project','Net Ninja']},'SQL':{weeks:3,phases:[{phase:'Basics',weeks:'Week 1',skills:['SELECT','WHERE','JOINs','GROUP BY'],color:'#06b6d4'},{phase:'Intermediate',weeks:'Week 2',skills:['Subqueries','Indexes','Transactions'],color:'#6366f1'},{phase:'Practice',weeks:'Week 3',skills:['HackerRank SQL','LeetCode DB'],color:'#10b981'}],resources:['W3Schools SQL','HackerRank SQL','LeetCode Database']},'default':{weeks:8,phases:[{phase:'Learn',weeks:'Week 1-2',skills:['Official docs','Intro tutorials','Setup'],color:'#6366f1'},{phase:'Practice',weeks:'Week 3-5',skills:['Follow projects','Code daily'],color:'#8b5cf6'},{phase:'Build',weeks:'Week 6-7',skills:['Personal project','Apply skill'],color:'#f59e0b'},{phase:'Showcase',weeks:'Week 8',skills:['GitHub push','Add to resume'],color:'#10b981'}],resources:['Official docs','YouTube tutorials','freeCodeCamp','Build a project']} }

const matchColor = s => s>=80?'#10b981':s>=60?'#f59e0b':s>=40?'#f97316':'#ef4444'

function detectJobRole(jdText, skills) {
  const text = jdText.toLowerCase()
  const s = skills.map(x => x.toLowerCase())
  const roles = [
    {role:'Full Stack Developer',icon:'🌐',keywords:['react','node.js','mongodb','full stack','frontend','backend'],skills:['React','Node.js','MongoDB','JavaScript']},
    {role:'Python Developer',icon:'🐍',keywords:['python','django','flask','fastapi'],skills:['Python','Django','Flask']},
    {role:'Data Scientist / ML Engineer',icon:'🤖',keywords:['machine learning','deep learning','data science','tensorflow'],skills:['Python','Machine Learning','TensorFlow','Pandas']},
    {role:'Frontend Developer',icon:'🎨',keywords:['react','vue','angular','css','javascript','frontend'],skills:['React','JavaScript','HTML','CSS']},
    {role:'DevOps Engineer',icon:'⚙️',keywords:['docker','kubernetes','aws','devops'],skills:['Docker','AWS']},
    {role:'Backend Developer',icon:'🔧',keywords:['api','rest','backend','database'],skills:['Python','Node.js','SQL']},
    {role:'Android / Mobile Developer',icon:'📱',keywords:['android','ios','flutter','mobile'],skills:['Flutter','Android']},
    {role:'Data Engineer',icon:'📊',keywords:['spark','hadoop','etl','kafka'],skills:['Python','SQL']},
  ]
  let best = null, bestScore = 0
  for (const r of roles) {
    let score = r.keywords.filter(k => text.includes(k)).length * 2 + r.skills.filter(sk => s.includes(sk.toLowerCase())).length
    if (score > bestScore) { bestScore = score; best = r }
  }
  return best || {role:'Software Developer', icon:'💻'}
}

function calcResumeScore(resumeText, resumeSkills) {
  let score = 0; const checks = []; const text = resumeText.toLowerCase()
  const words = resumeText.split(/\s+/).length
  if (words >= 300) { score += 20; checks.push({label:`Good length (${words} words)`,pass:true}) }
  else { checks.push({label:`Too short (${words} words, aim 300+)`,pass:false}) }
  if (resumeSkills.length >= 8) { score += 20; checks.push({label:`Strong skills (${resumeSkills.length})`,pass:true}) }
  else if (resumeSkills.length >= 4) { score += 10; checks.push({label:`Average skills (${resumeSkills.length}, aim 8+)`,pass:false}) }
  else { checks.push({label:`Weak skills (${resumeSkills.length})`,pass:false}) }
  if (/@/.test(resumeText) && /\d{10}|\d{3}[-.\s]\d{3}/.test(resumeText)) { score += 15; checks.push({label:'Contact info found',pass:true}) }
  else { checks.push({label:'Missing contact info',pass:false}) }
  if (/education|university|college|degree|b\.?tech/i.test(resumeText)) { score += 15; checks.push({label:'Education section found',pass:true}) }
  else { checks.push({label:'Education section missing',pass:false}) }
  if (/experience|project|internship|developed|built/i.test(resumeText)) { score += 15; checks.push({label:'Experience/Projects found',pass:true}) }
  else { checks.push({label:'No experience/projects',pass:false}) }
  const fv = ['developed','built','designed','implemented','created','improved'].filter(v => text.includes(v))
  if (fv.length >= 3) { score += 15; checks.push({label:`Action verbs: ${fv.slice(0,3).join(', ')}`,pass:true}) }
  else { checks.push({label:'Add action verbs (developed, built...)',pass:false}) }
  return {score, checks}
}

function calcATSScore(resumeText, resumeSkills, jdSkills) {
  let score = 0; const checks = []
  const matched = resumeSkills.filter(s => jdSkills.includes(s))
  const keyPct = jdSkills.length > 0 ? (matched.length / jdSkills.length) * 100 : 0
  score += Math.round((keyPct / 100) * 30); checks.push({label:`Keyword match: ${matched.length}/${jdSkills.length}`,pass:keyPct>=50})
  score += 20; checks.push({label:'Text-based PDF (ATS readable)',pass:true})
  if (/education|experience|skills|projects/i.test(resumeText)) { score += 25; checks.push({label:'Standard sections detected',pass:true}) }
  else { checks.push({label:'Missing standard sections',pass:false}) }
  if ((resumeText.match(/[★●▪►]/g)||[]).length < 5) { score += 10; checks.push({label:'Clean formatting',pass:true}) }
  else { checks.push({label:'Too many special characters',pass:false}) }
  if (/@/.test(resumeText)) { score += 15; checks.push({label:'Email found',pass:true}) }
  else { checks.push({label:'No email found',pass:false}) }
  return {score: Math.min(score, 100), checks}
}

function generateResumeTips(resumeText, resumeSkills, missingSkills, matchScore) {
  const tips = []; const text = resumeText.toLowerCase(); const words = resumeText.split(/\s+/).length
  if (words < 300) tips.push({type:'error',tip:`Resume too short (${words} words). Aim for 300-600.`})
  else tips.push({type:'success',tip:`Good length (${words} words). Just right!`})
  if (!/@/.test(resumeText)) tips.push({type:'error',tip:'Add your email address.'})
  else tips.push({type:'success',tip:'Email found. ✓'})
  if (!/github\.com|linkedin\.com|portfolio/i.test(resumeText)) tips.push({type:'warning',tip:'Add GitHub/LinkedIn URL to stand out.'})
  else tips.push({type:'success',tip:'Online profile found. ✓'})
  if (!/education|university|degree/i.test(resumeText)) tips.push({type:'error',tip:'Add your Education section.'})
  else tips.push({type:'success',tip:'Education section found. ✓'})
  const fv = ['developed','built','designed','implemented','created'].filter(v => text.includes(v))
  if (fv.length < 3) tips.push({type:'warning',tip:`Add action verbs! Found ${fv.length}. Use: Developed, Built, Designed.`})
  else tips.push({type:'success',tip:`Action verbs found: ${fv.slice(0,3).join(', ')}. ✓`})
  if (missingSkills.length > 0) tips.push({type:'warning',tip:`Add missing skills: ${missingSkills.slice(0,4).join(', ')}.`})
  if (matchScore >= 80) tips.push({type:'success',tip:'Excellent job match! Well-tailored resume.'})
  else if (matchScore >= 60) tips.push({type:'warning',tip:'Good match! A few more skills would help.'})
  else tips.push({type:'error',tip:'Low match. Tailor resume keywords to job description.'})
  return tips
}

function generateInterviewQuestions(matchedSkills, detectedRole) {
  const questions = [], added = new Set()
  for (const skill of matchedSkills) {
    if (INTERVIEW_QUESTIONS[skill]) {
      INTERVIEW_QUESTIONS[skill].forEach(q => { if (!added.has(q.q)) { questions.push({...q, skill}); added.add(q.q) } })
    }
    if (questions.length >= 12) break
  }
  INTERVIEW_QUESTIONS['default'].forEach(q => { if (!added.has(q.q)) { questions.push({...q, skill:'General'}); added.add(q.q) } })
  return questions.slice(0, 12)
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({active}) {
  const canvasRef = useRef()
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const pieces = Array.from({length:120}, () => ({x:Math.random()*canvas.width,y:-20,w:8+Math.random()*8,h:12+Math.random()*8,color:['#6366f1','#10b981','#f59e0b','#ec4899','#8b5cf6'][Math.floor(Math.random()*5)],speed:2+Math.random()*4,angle:Math.random()*360,spin:Math.random()*4-2}))
    let frame
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); let done = true
      pieces.forEach(p => { p.y += p.speed; p.angle += p.spin; if (p.y < canvas.height+20) done = false; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle*Math.PI/180); ctx.fillStyle = p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore() })
      if (!done) frame = requestAnimationFrame(animate)
    }
    animate(); return () => cancelAnimationFrame(frame)
  }, [active])
  if (!active) return null
  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,pointerEvents:'none',zIndex:9999}}/>
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({width='100%', height=16, radius=8}) {
  return <div style={{width,height,borderRadius:radius,background:'#1e293b',overflow:'hidden',position:'relative'}}>
    <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)',animation:'shimmer 1.4s infinite'}}/>
  </div>
}

function AnalyzingSkeleton() {
  return <div style={{animation:'fadeIn 0.3s ease'}}>
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:16,padding:24,border:'1px solid rgba(255,255,255,0.07)',marginBottom:18}}>
      <div style={{display:'flex',justifyContent:'space-around',marginBottom:20,gap:20}}>
        {[0,1,2].map(i => <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}><Skeleton width={140} height={140} radius={70}/><Skeleton width={80} height={14}/></div>)}
      </div>
      <Skeleton height={10}/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18}}>
      {[0,1].map(i => <div key={i} style={{background:'rgba(255,255,255,0.03)',borderRadius:16,padding:22,border:'1px solid rgba(255,255,255,0.07)'}}>
        <Skeleton width={160} height={18}/>
        <div style={{marginTop:14,display:'flex',flexWrap:'wrap',gap:6}}>
          {[80,100,70,90,110].map((w,j) => <Skeleton key={j} width={w} height={28} radius={20}/>)}
        </div>
      </div>)}
    </div>
    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:16,padding:22,border:'1px solid rgba(255,255,255,0.07)'}}>
      <Skeleton width={200} height={18}/>
      {[0,1,2].map(i => <div key={i} style={{marginTop:10}}><Skeleton height={44} radius={10}/></div>)}
    </div>
    <div style={{textAlign:'center',marginTop:20,color:'#64748b',fontSize:14,fontWeight:600}}>🤖 AI is analyzing your resume...</div>
  </div>
}

// ── Strength Meter ─────────────────────────────────────────────────────────────
function StrengthMeter({resumeScore, atsScore, matchScore, t}) {
  const overall = Math.round((resumeScore + atsScore + matchScore) / 3)
  const segments = [{label:t.weakLabel,color:'#ef4444',range:[0,39]},{label:t.fairLabel,color:'#f97316',range:[40,59]},{label:t.goodLabel,color:'#f59e0b',range:[60,74]},{label:t.strongLabel,color:'#10b981',range:[75,89]},{label:t.excellentLabel,color:'#06b6d4',range:[90,100]}]
  const current = segments.find(s => overall >= s.range[0] && overall <= s.range[1]) || segments[0]
  return <div style={{textAlign:'center',padding:'20px 0'}}>
    <div style={{position:'relative',width:200,height:110,margin:'0 auto'}}>
      <svg width={200} height={110}>
        <path d="M 30 100 A 70 70 0 0 1 170 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={12} strokeLinecap="round"/>
        <path d="M 30 100 A 70 70 0 0 1 170 100" fill="none" stroke={current.color} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${(overall/100)*220} 220`} style={{transition:'stroke-dasharray 1.5s ease'}}/>
        <text x={100} y={80} textAnchor="middle" fill={current.color} fontSize={22} fontWeight={900}>{overall}%</text>
        <text x={100} y={98} textAnchor="middle" fill="#64748b" fontSize={11}>{t.strengthMeter}</text>
      </svg>
    </div>
    <div style={{fontSize:18,fontWeight:800,color:current.color,marginTop:4}}>{current.label}</div>
    <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:14,flexWrap:'wrap'}}>
      {[{l:t.jobMatch,v:matchScore},{l:t.resumeScore,v:resumeScore},{l:t.atsScore,v:atsScore}].map(item => (
        <div key={item.l} style={{padding:'6px 12px',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}}>
          <div style={{fontSize:16,fontWeight:800,color:matchColor(item.v)}}>{item.v}%</div>
          <div style={{fontSize:10,color:'#64748b'}}>{item.l}</div>
        </div>
      ))}
    </div>
  </div>
}

// ── Salary Estimator ───────────────────────────────────────────────────────────
function SalaryEstimator({detectedRole, matchedSkills, t}) {
  const [expLevel, setExpLevel] = useState('mid')
  const roleData = SALARY_DATA[detectedRole?.role] || SALARY_DATA['Software Developer']
  const idx = expLevel === 'junior' ? 0 : expLevel === 'mid' ? 1 : 2
  const bonus = Math.min(Math.floor(matchedSkills.length / 2) * 0.05, 0.3)
  const inAdj = Math.round(roleData.in[idx] * (1 + bonus))
  const usAdj = Math.round(roleData.us[idx] * (1 + bonus) / 1000) * 1000
  return <div>
    <div style={{display:'flex',gap:8,marginBottom:18,justifyContent:'center'}}>
      {[{k:'junior',l:t.junior},{k:'mid',l:t.mid},{k:'senior',l:t.senior}].map(e => (
        <button key={e.k} onClick={() => setExpLevel(e.k)} style={{padding:'8px 14px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit',background:expLevel===e.k?'linear-gradient(135deg,#6366f1,#8b5cf6)':'rgba(255,255,255,0.05)',color:expLevel===e.k?'white':'#64748b',transition:'all 0.2s'}}>{e.l}</button>
      ))}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      {[{label:t.indSalary,value:'₹'+inAdj+' LPA',icon:'🇮🇳',color:'#f59e0b'},{label:t.usSalary,value:'$'+usAdj.toLocaleString(),icon:'🇺🇸',color:'#6366f1'}].map(item => (
        <div key={item.label} style={{background:'rgba(255,255,255,0.03)',borderRadius:14,padding:20,border:`1px solid ${item.color}30`,textAlign:'center'}}>
          <div style={{fontSize:32,marginBottom:8}}>{item.icon}</div>
          <div style={{fontSize:26,fontWeight:900,color:item.color,marginBottom:4}}>{item.value}</div>
          <div style={{fontSize:12,color:'#64748b'}}>{item.label}</div>
        </div>
      ))}
    </div>
    <p style={{textAlign:'center',fontSize:11,color:'#475569',marginTop:12}}>* Based on {detectedRole?.role||'Software Developer'} with {matchedSkills.length} matched skills</p>
  </div>
}

// ── Match Improver ─────────────────────────────────────────────────────────────
function MatchImprover({result, detectedRole, theme}) {
  const target = Math.min(100, Math.ceil((result.match_score + 20) / 10) * 10)
  const improvements = [
    result.missing_skills.length > 0 && {priority:'High',icon:'🔑',title:'Add Missing Keywords',impact:`+${Math.min(25, result.missing_skills.length * 3)}% match`,color:'#ef4444',steps:result.missing_skills.slice(0,5).map(s => 'Add "'+s+'" to your Skills section or project descriptions.')},
    {priority:'High',icon:'✍️',title:'Tailor Your Summary',impact:'+10-15% match',color:'#f97316',steps:['Rewrite summary to include keywords from the job description.','Mention the job title: "Aspiring '+(detectedRole?.role||'Developer')+'..."','Keep it 3-4 sentences, specific to this role.']},
    {priority:'Medium',icon:'📊',title:'Quantify Achievements',impact:'+8-12% ATS score',color:'#f59e0b',steps:['Add numbers: "Improved performance by 40%" not just "Improved performance"','Mention users: "Built app used by 200+ students"','Add metrics: "Reduced load time by 2x"']},
    {priority:'Medium',icon:'🛠️',title:'Expand Skills Section',impact:'+5-10% match',color:'#6366f1',steps:['List skills exactly as they appear in the job description.','Group them: Languages, Frameworks, Databases, Tools.',result.matched_skills.length > 0 ? 'You have: '+result.matched_skills.slice(0,4).join(', ')+' — keep these prominent!' : 'Add more technical skills.']},
    {priority:'Low',icon:'🚀',title:'Improve Project Descriptions',impact:'+5-8% match',color:'#10b981',steps:['Mention tech stack using job keywords in every project.','Use action verbs: Developed, Built, Designed, Implemented.','Add GitHub link to each project.']},
  ].filter(Boolean)

  return <div>
    <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))',borderRadius:16,padding:20,marginBottom:16,border:'1px solid rgba(99,102,241,0.2)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
      <div>
        <p style={{color:'#818cf8',fontSize:11,fontWeight:700,marginBottom:4}}>CURRENT → TARGET</p>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:36,fontWeight:900,color:'#ef4444'}}>{result.match_score}%</div>
          <div style={{fontSize:24,color:'#64748b'}}>→</div>
          <div style={{fontSize:36,fontWeight:900,color:'#10b981'}}>{target}%</div>
        </div>
        <p style={{color:'#64748b',fontSize:12,marginTop:4}}>Follow these steps to reach your target!</p>
      </div>
      <div style={{textAlign:'center',padding:'14px 20px',background:'rgba(16,185,129,0.1)',borderRadius:12,border:'1px solid rgba(16,185,129,0.2)'}}>
        <div style={{fontSize:24,fontWeight:900,color:'#10b981'}}>+{target-result.match_score}%</div>
        <div style={{fontSize:11,color:'#64748b'}}>Potential Gain</div>
      </div>
    </div>
    {improvements.map((imp, i) => <ImprovementCard key={i} imp={imp} index={i} theme={theme}/>)}
    <div style={{background:'rgba(99,102,241,0.05)',borderRadius:12,padding:16,border:'1px solid rgba(99,102,241,0.15)',marginTop:8}}>
      <p style={{fontSize:13,color:'#818cf8',fontWeight:600,marginBottom:6}}>💡 Pro Tip</p>
      <p style={{fontSize:12,color:'#64748b',lineHeight:1.6}}>Customize your resume for EACH job application. A tailored resume gets 3x more callbacks than a generic one!</p>
    </div>
  </div>
}

function ImprovementCard({imp, index, theme}) {
  const [open, setOpen] = useState(index === 0)
  return <div style={{background:theme.card,borderRadius:14,border:`1px solid ${theme.border}`,marginBottom:10,overflow:'hidden'}}>
    <div onClick={() => setOpen(!open)} style={{padding:'14px 18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:36,height:36,borderRadius:10,background:imp.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{imp.icon}</div>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3,flexWrap:'wrap'}}>
            <p style={{color:theme.text,fontWeight:700,fontSize:14,margin:0}}>{imp.title}</p>
            <span style={{padding:'2px 8px',borderRadius:10,fontSize:10,fontWeight:700,background:imp.color+'20',color:imp.color}}>{imp.priority}</span>
          </div>
          <span style={{fontSize:12,fontWeight:700,color:'#10b981'}}>{imp.impact}</span>
        </div>
      </div>
      <span style={{color:'#64748b',transition:'transform 0.3s',display:'inline-block',transform:open?'rotate(180deg)':'rotate(0deg)'}}>▼</span>
    </div>
    {open && <div style={{padding:'0 18px 16px 66px'}}>
      {imp.steps.map((step, i) => (
        <div key={i} style={{display:'flex',gap:10,marginBottom:8,alignItems:'flex-start'}}>
          <div style={{width:20,height:20,borderRadius:'50%',background:imp.color+'20',border:`1px solid ${imp.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:imp.color,flexShrink:0,marginTop:1}}>{i+1}</div>
          <p style={{fontSize:13,color:'#64748b',lineHeight:1.6,margin:0}}>{step}</p>
        </div>
      ))}
    </div>}
  </div>
}

// ── Skill Roadmap ──────────────────────────────────────────────────────────────
function SkillRoadmap({missingSkills, theme}) {
  const [selected, setSelected] = useState(missingSkills[0] || '')
  const roadmap = ROADMAP_DATA[selected] || ROADMAP_DATA['default']
  return <div>
    <p style={{color:'#64748b',fontSize:12,marginBottom:10,fontWeight:600}}>SELECT A SKILL TO LEARN:</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:20}}>
      {missingSkills.slice(0,10).map(skill => (
        <button key={skill} onClick={() => setSelected(skill)} style={{padding:'7px 14px',borderRadius:20,border:'none',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit',background:selected===skill?'linear-gradient(135deg,#6366f1,#8b5cf6)':'rgba(99,102,241,0.1)',color:selected===skill?'white':'#818cf8',transition:'all 0.2s'}}>{skill}</button>
      ))}
      {missingSkills.length === 0 && <p style={{color:'#64748b',fontSize:13}}>🎉 No missing skills! Fully matched!</p>}
    </div>
    {selected && <>
      <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))',borderRadius:14,padding:18,marginBottom:18,border:'1px solid rgba(99,102,241,0.2)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div>
          <h3 style={{color:'#e2e8f0',fontWeight:800,fontSize:18,marginBottom:4}}>⭐ {selected} Roadmap</h3>
          <p style={{color:'#64748b',fontSize:12}}>Estimated: {roadmap.weeks} weeks • Step-by-step plan</p>
        </div>
        <div style={{padding:'10px 18px',background:'rgba(99,102,241,0.15)',borderRadius:10,border:'1px solid rgba(99,102,241,0.3)',textAlign:'center'}}>
          <div style={{fontSize:22,fontWeight:900,color:'#818cf8'}}>{roadmap.weeks}w</div>
          <div style={{fontSize:10,color:'#64748b'}}>to learn</div>
        </div>
      </div>
      <div style={{position:'relative',paddingLeft:24}}>
        <div style={{position:'absolute',left:10,top:0,bottom:0,width:2,background:'linear-gradient(180deg,#6366f1,#10b981)',borderRadius:2}}/>
        {roadmap.phases.map((phase, i) => (
          <div key={i} style={{position:'relative',marginBottom:16}}>
            <div style={{position:'absolute',left:-20,top:14,width:14,height:14,borderRadius:'50%',background:phase.color,border:'3px solid #0f0f1a',boxShadow:`0 0 10px ${phase.color}66`}}/>
            <div style={{background:theme.card,borderRadius:14,padding:16,border:`1px solid ${phase.color}30`,marginLeft:8}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10,flexWrap:'wrap',gap:6}}>
                <h4 style={{color:phase.color,fontWeight:700,fontSize:14,margin:0}}>Phase {i+1}: {phase.phase}</h4>
                <span style={{fontSize:11,color:'#64748b',background:phase.color+'15',padding:'3px 10px',borderRadius:10,border:`1px solid ${phase.color}30`}}>{phase.weeks}</span>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {phase.skills.map(skill => <span key={skill} style={{padding:'3px 10px',borderRadius:10,fontSize:11,fontWeight:600,background:phase.color+'15',color:phase.color,border:`1px solid ${phase.color}25`}}>{skill}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:theme.card,borderRadius:14,padding:18,border:`1px solid ${theme.border}`,marginTop:8}}>
        <h4 style={{color:'#f59e0b',fontWeight:700,fontSize:14,marginBottom:12}}>📚 Best Resources for {selected}</h4>
        {roadmap.resources.map((r, i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<roadmap.resources.length-1?`1px solid ${theme.border}`:'none'}}>
            <span style={{width:24,height:24,borderRadius:'50%',background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#f59e0b',fontWeight:700,flexShrink:0}}>{i+1}</span>
            <span style={{fontSize:13,color:'#94a3b8'}}>{r}</span>
          </div>
        ))}
      </div>
      <div style={{background:'rgba(16,185,129,0.05)',borderRadius:12,padding:14,border:'1px solid rgba(16,185,129,0.15)',marginTop:12}}>
        <p style={{fontSize:12,color:'#10b981',fontWeight:600,marginBottom:4}}>💡 Study Tip</p>
        <p style={{fontSize:12,color:'#64748b',lineHeight:1.6}}>Code for at least 30 minutes daily. Build a small project using {selected} and push it to GitHub!</p>
      </div>
    </>}
  </div>
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({theme, isDark, onClose}) {
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('ars_history')||'[]') } catch { return [] } })
  const clearHistory = () => { localStorage.removeItem('ars_history'); setHistory([]) }
  if (history.length === 0) return (
    <div style={{minHeight:'100vh',background:theme.bg,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'14px 32px',background:theme.header,borderBottom:`1px solid ${theme.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h2 style={{color:theme.text,fontWeight:800,fontSize:18}}>📊 Analysis Dashboard</h2>
        <button onClick={onClose} style={{padding:'8px 18px',borderRadius:20,border:'1px solid #6366f1',cursor:'pointer',background:'transparent',color:'#818cf8',fontSize:13,fontWeight:700,fontFamily:'inherit'}}>← Back</button>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14}}>
        <div style={{fontSize:60}}>📊</div>
        <h3 style={{color:theme.text,fontWeight:700,fontSize:18}}>No History Yet</h3>
        <p style={{color:'#64748b',fontSize:14}}>Analyze a resume to see history here!</p>
        <button onClick={onClose} style={{padding:'12px 28px',borderRadius:30,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:14,fontWeight:700,fontFamily:'inherit'}}>🚀 Analyze Now</button>
      </div>
    </div>
  )
  const avgMatch = Math.round(history.reduce((s,h) => s+h.match_score, 0) / history.length)
  const best = history.reduce((b,h) => h.match_score > b.match_score ? h : b, history[0])
  const maxBar = Math.max(...history.map(h => h.match_score))
  return (
    <div style={{minHeight:'100vh',background:theme.bg}}>
      <div style={{padding:'14px 32px',background:theme.header,backdropFilter:'blur(10px)',borderBottom:`1px solid ${theme.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>📊</div>
          <div><h2 style={{color:theme.text,fontWeight:800,fontSize:16}}>Analysis Dashboard</h2><p style={{fontSize:10,color:'#64748b'}}>{history.length} analyses tracked</p></div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={clearHistory} style={{padding:'7px 14px',borderRadius:20,border:'1px solid rgba(239,68,68,0.3)',cursor:'pointer',background:'rgba(239,68,68,0.08)',color:'#ef4444',fontSize:12,fontWeight:600,fontFamily:'inherit'}}>🗑 Clear</button>
          <button onClick={onClose} style={{padding:'7px 14px',borderRadius:20,border:'1px solid #6366f1',cursor:'pointer',background:'transparent',color:'#818cf8',fontSize:12,fontWeight:700,fontFamily:'inherit'}}>← Back</button>
        </div>
      </div>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'28px 18px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22}}>
          {[{label:'Analyses Done',value:history.length,icon:'🔍',color:'#6366f1'},{label:'Avg Match',value:avgMatch+'%',icon:'🎯',color:matchColor(avgMatch)},{label:'Best Score',value:best.match_score+'%',icon:'🏆',color:'#f59e0b'},{label:'Latest',value:history[history.length-1].match_score+'%',icon:'📄',color:matchColor(history[history.length-1].match_score)}].map(stat => (
            <div key={stat.label} style={{background:theme.card,borderRadius:14,padding:16,border:`1px solid ${stat.color}25`,textAlign:'center'}}>
              <div style={{fontSize:26,marginBottom:6}}>{stat.icon}</div>
              <div style={{fontSize:24,fontWeight:900,color:stat.color}}>{stat.value}</div>
              <div style={{fontSize:11,color:'#64748b',marginTop:2}}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{background:theme.card,borderRadius:16,padding:22,border:`1px solid ${theme.border}`,marginBottom:18}}>
          <h4 style={{color:theme.text,fontWeight:700,marginBottom:18,fontSize:14}}>📈 Match Score History</h4>
          <div style={{display:'flex',alignItems:'flex-end',gap:10,height:120,overflowX:'auto',paddingBottom:8}}>
            {history.map((h, i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,minWidth:50,flexShrink:0}}>
                <span style={{fontSize:10,color:matchColor(h.match_score),fontWeight:700}}>{h.match_score}%</span>
                <div style={{width:36,borderRadius:'6px 6px 0 0',background:`linear-gradient(180deg,${matchColor(h.match_score)},${matchColor(h.match_score)}88)`,height:`${(h.match_score/maxBar)*90}px`,minHeight:4,transition:'height 0.8s ease'}}/>
                <span style={{fontSize:9,color:'#475569',textAlign:'center',maxWidth:50,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{h.resume_name||'Resume'}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:theme.card,borderRadius:16,padding:22,border:`1px solid ${theme.border}`}}>
          <h4 style={{color:theme.text,fontWeight:700,marginBottom:14,fontSize:14}}>📋 All Analyses</h4>
          {[...history].reverse().map((h, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:i<history.length-1?`1px solid ${theme.border}`:'none',flexWrap:'wrap'}}>
              <div style={{width:40,height:40,borderRadius:10,background:matchColor(h.match_score)+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:matchColor(h.match_score),flexShrink:0}}>{h.match_score}%</div>
              <div style={{flex:1,minWidth:120}}>
                <p style={{color:theme.text,fontWeight:600,fontSize:13,marginBottom:2}}>{h.resume_name||'Resume'}</p>
                <p style={{color:'#64748b',fontSize:11}}>{h.role} • {h.date}</p>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {[{l:'Match',v:h.match_score+'%',c:matchColor(h.match_score)},{l:'Resume',v:(h.resume_score||0)+'/100',c:'#f59e0b'},{l:'ATS',v:(h.ats_score||0)+'/100',c:'#8b5cf6'}].map(s => (
                  <div key={s.l} style={{textAlign:'center',padding:'4px 10px',background:s.c+'12',borderRadius:8,border:`1px solid ${s.c}25`}}>
                    <div style={{fontSize:12,fontWeight:800,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:9,color:'#64748b'}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Resume Builder ─────────────────────────────────────────────────────────────
function ResumeBuilder({resumeSkills, missingSkills, detectedRole, t}) {
  const [form, setForm] = useState({name:'',email:'',phone:'',linkedin:'',summary:'',skills:resumeSkills.join(', '),experience:'',education:'',projects:''})
  const [generated, setGenerated] = useState(false)
  const update = k => e => setForm({...form, [k]: e.target.value})
  const inp = {width:'100%',padding:'10px 14px',borderRadius:10,border:'2px solid #1e293b',background:'rgba(255,255,255,0.02)',color:'#e2e8f0',fontSize:13,fontFamily:'inherit',outline:'none',transition:'border-color 0.2s',marginBottom:10,boxSizing:'border-box'}
  const lbl = {fontSize:11,color:'#64748b',fontWeight:700,marginBottom:4,display:'block',letterSpacing:'0.5px'}
  const downloadResume = () => {
    const skillsList = (form.skills||'').split(',').map(s => s.trim()).filter(Boolean)
    const expLines = (form.experience||'').split('\n').filter(Boolean)
    const projLines = (form.projects||'').split('\n').filter(Boolean)
    const eduLines = (form.education||'').split('\n').filter(Boolean)
    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+(form.name||'Resume')+'</title><style>@import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap);*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,Arial,sans-serif;background:#f8fafc}.page{background:white;max-width:800px;margin:0 auto;min-height:100vh;display:flex}.sidebar{width:250px;background:linear-gradient(180deg,#4f46e5,#7c3aed);padding:30px 22px;flex-shrink:0}.main{flex:1;padding:34px 30px}.avatar{width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:white;margin:0 auto 14px;border:3px solid rgba(255,255,255,0.4)}.s-name{font-size:17px;font-weight:800;color:white;text-align:center;margin-bottom:2px}.s-role{font-size:10px;color:rgba(255,255,255,0.65);text-align:center;margin-bottom:22px}.s-sec{margin-bottom:20px}.s-title{font-size:9px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,0.12)}.s-item{display:flex;align-items:flex-start;gap:7px;margin-bottom:6px}.s-icon{font-size:10px;margin-top:1px}.s-text{font-size:10px;color:rgba(255,255,255,0.82);word-break:break-all;line-height:1.4}.skill-badge{display:inline-block;background:rgba(255,255,255,0.15);color:white;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:600;margin:2px;border:1px solid rgba(255,255,255,0.22)}.m-name{font-size:28px;font-weight:800;color:#4f46e5;margin-bottom:2px}.m-role{font-size:13px;color:#64748b;margin-bottom:18px}.m-sec{margin-bottom:20px}.m-title{font-size:10px;font-weight:700;color:#4f46e5;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #ede9fe}.m-text{font-size:12px;color:#475569;line-height:1.7}.entry{margin-bottom:10px;padding-left:10px;border-left:2px solid #ede9fe}.entry-title{font-size:12px;font-weight:700;color:#1e293b;margin-bottom:1px}.entry-sub{font-size:10px;color:#64748b;margin-bottom:3px}.entry-text{font-size:11px;color:#475569;line-height:1.6}.footer{margin-top:20px;padding-top:12px;border-top:1px solid #f1f5f9;text-align:center;font-size:8px;color:#94a3b8}@media print{body{background:white}}</style></head><body><div class="page"><div class="sidebar"><div class="avatar">'+(form.name?form.name[0].toUpperCase():'N')+'</div><div class="s-name">'+(form.name||'Your Name')+'</div><div class="s-role">'+(detectedRole?.role||'Software Developer')+'</div>'+(form.email||form.phone||form.linkedin?'<div class="s-sec"><div class="s-title">Contact</div>'+(form.email?'<div class="s-item"><span class="s-icon">✉</span><span class="s-text">'+form.email+'</span></div>':'')+(form.phone?'<div class="s-item"><span class="s-icon">📞</span><span class="s-text">'+form.phone+'</span></div>':'')+(form.linkedin?'<div class="s-item"><span class="s-icon">🔗</span><span class="s-text">'+form.linkedin+'</span></div>':'')+'</div>':'')+'<div class="s-sec"><div class="s-title">Skills</div>'+skillsList.map(s=>'<span class="skill-badge">'+s+'</span>').join('')+'</div></div><div class="main"><div class="m-name">'+(form.name||'Your Name')+'</div><div class="m-role">'+(detectedRole?.role||'Software Developer')+'</div>'+(form.summary?'<div class="m-sec"><div class="m-title">Summary</div><p class="m-text">'+form.summary+'</p></div>':'')+(form.experience?'<div class="m-sec"><div class="m-title">Experience</div>'+expLines.map((line,i)=>i===0?'<div class="entry"><div class="entry-title">'+line+'</div>':line.startsWith('•')||line.startsWith('-')?'<div class="entry-text">'+line+'</div>':'<div class="entry-sub">'+line+'</div>').join('')+'</div></div>':'')+(form.projects?'<div class="m-sec"><div class="m-title">Projects</div>'+projLines.map((line,i)=>i===0?'<div class="entry"><div class="entry-title">'+line+'</div>':line.startsWith('•')||line.startsWith('-')?'<div class="entry-text">'+line+'</div>':'<div class="entry-sub">'+line+'</div>').join('')+'</div></div>':'')+(form.education?'<div class="m-sec"><div class="m-title">Education</div>'+eduLines.map((line,i)=>i===0?'<div class="entry"><div class="entry-title">'+line+'</div>':'<div class="entry-sub">'+line+'</div>').join('')+'</div></div>':'')+'<div class="footer">Generated by AI Resume Screener • '+new Date().toLocaleDateString()+'</div></div></div></body></html>'
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500) }
    setGenerated(true)
  }
  return <div>
    <p style={{color:'#64748b',fontSize:13,marginBottom:16}}>{t.builderSub}</p>
    {missingSkills.length > 0 && <div style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:10,padding:12,marginBottom:16}}>
      <p style={{fontSize:12,color:'#f59e0b',fontWeight:600,marginBottom:4}}>💡 Add these missing skills:</p>
      <p style={{fontSize:12,color:'#64748b'}}>{missingSkills.slice(0,6).join(' • ')}</p>
    </div>}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
      <div><label style={lbl}>Full Name</label><input style={inp} value={form.name} onChange={update('name')} placeholder="Nithya J" onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/></div>
      <div><label style={lbl}>Email</label><input style={inp} value={form.email} onChange={update('email')} placeholder="nithya@email.com" onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/></div>
      <div><label style={lbl}>Phone</label><input style={inp} value={form.phone} onChange={update('phone')} placeholder="+91 9876543210" onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/></div>
      <div><label style={lbl}>LinkedIn / GitHub</label><input style={inp} value={form.linkedin} onChange={update('linkedin')} placeholder="linkedin.com/in/nithya" onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/></div>
    </div>
    <label style={lbl}>Professional Summary</label>
    <textarea style={{...inp,height:80,resize:'none'}} value={form.summary} onChange={update('summary')} placeholder={'Passionate '+(detectedRole?.role||'developer')+'...'} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/>
    <label style={lbl}>Skills (comma separated)</label>
    <input style={inp} value={form.skills} onChange={update('skills')} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/>
    <label style={lbl}>Work Experience</label>
    <textarea style={{...inp,height:90,resize:'none'}} value={form.experience} onChange={update('experience')} placeholder={'Vdart Trichy | Intern | 1 month\n• Developed...'} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/>
    <label style={lbl}>Projects</label>
    <textarea style={{...inp,height:90,resize:'none'}} value={form.projects} onChange={update('projects')} placeholder={'Student Placement Portal | Django, MySQL\n• Built...'} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/>
    <label style={lbl}>Education</label>
    <textarea style={{...inp,height:60,resize:'none'}} value={form.education} onChange={update('education')} placeholder="BE CSE | College Name | 2024" onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#1e293b'}/>
    <button onClick={downloadResume} style={{width:'100%',padding:14,borderRadius:12,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:15,fontWeight:700,fontFamily:'inherit',boxShadow:'0 0 30px rgba(99,102,241,0.4)'}}>📥 Download Professional Resume PDF</button>
    {generated && <p style={{textAlign:'center',color:'#10b981',fontSize:13,marginTop:10,fontWeight:600}}>✅ Resume generated! Check the print dialog.</p>}
  </div>
}

// ── Login Page ─────────────────────────────────────────────────────────────────
function LoginPage({onLogin, t}) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({name:'',email:'',password:''})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const update = k => e => setForm({...form, [k]: e.target.value})
  const handleSubmit = () => {
    if (!form.email.includes('@')) { setError('Please enter a valid email.'); return }
    if (form.password.length < 4) { setError('Password must be at least 4 characters.'); return }
    setLoading(true); setError('')
    setTimeout(() => {
      const user = {name: form.name || form.email.split('@')[0], email: form.email}
      localStorage.setItem('ars_user', JSON.stringify(user))
      setLoading(false); onLogin(user)
    }, 1200)
  }
  const inp = {width:'100%',padding:'13px 16px',borderRadius:12,border:'2px solid rgba(99,102,241,0.2)',background:'rgba(99,102,241,0.06)',color:'#e2e8f0',fontSize:14,fontFamily:'inherit',outline:'none',transition:'all 0.2s',marginBottom:12,boxSizing:'border-box'}
  return <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a1a,#1a1a3e,#0a0a1a)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
    <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:0.8}}@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>
    {Array.from({length:16}).map((_, i) => <div key={i} style={{position:'absolute',left:Math.random()*100+'%',top:Math.random()*100+'%',width:3+Math.random()*4,height:3+Math.random()*4,borderRadius:'50%',background:'rgba(99,102,241,0.6)',animation:`pulse ${2+Math.random()*3}s ${Math.random()*3}s infinite`}}/>)}
    <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)',top:'-100px',right:'-100px',animation:'float 6s ease-in-out infinite'}}/>
    <div style={{background:'rgba(255,255,255,0.04)',backdropFilter:'blur(20px)',borderRadius:24,padding:'40px 36px',width:'100%',maxWidth:420,border:'1px solid rgba(99,102,241,0.2)',boxShadow:'0 25px 60px rgba(0,0,0,0.5)',animation:'slideUp 0.5s ease',position:'relative',zIndex:1}}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,margin:'0 auto 14px'}}>🤖</div>
        <h1 style={{fontSize:24,fontWeight:800,color:'#e2e8f0',marginBottom:4}}>{mode==='login'?t.loginTitle:t.signup}</h1>
        <p style={{color:'#64748b',fontSize:13}}>{mode==='login'?t.loginSub:'Create your free account'}</p>
      </div>
      {mode==='signup' && <>
        <label style={{fontSize:11,color:'#64748b',fontWeight:700,marginBottom:4,display:'block',letterSpacing:'0.5px'}}>{t.name.toUpperCase()}</label>
        <input style={inp} value={form.name} onChange={update('name')} placeholder="Nithya J" onFocus={e=>{e.target.style.borderColor='#6366f1';e.target.style.background='rgba(99,102,241,0.1)'}} onBlur={e=>{e.target.style.borderColor='rgba(99,102,241,0.2)';e.target.style.background='rgba(99,102,241,0.06)'}}/>
      </>}
      <label style={{fontSize:11,color:'#64748b',fontWeight:700,marginBottom:4,display:'block',letterSpacing:'0.5px'}}>{t.email.toUpperCase()}</label>
      <input style={inp} type="email" value={form.email} onChange={update('email')} placeholder="you@email.com" onFocus={e=>{e.target.style.borderColor='#6366f1';e.target.style.background='rgba(99,102,241,0.1)'}} onBlur={e=>{e.target.style.borderColor='rgba(99,102,241,0.2)';e.target.style.background='rgba(99,102,241,0.06)'}}/>
      <label style={{fontSize:11,color:'#64748b',fontWeight:700,marginBottom:4,display:'block',letterSpacing:'0.5px'}}>{t.password.toUpperCase()}</label>
      <input style={inp} type="password" value={form.password} onChange={update('password')} placeholder="••••••••" onFocus={e=>{e.target.style.borderColor='#6366f1';e.target.style.background='rgba(99,102,241,0.1)'}} onBlur={e=>{e.target.style.borderColor='rgba(99,102,241,0.2)';e.target.style.background='rgba(99,102,241,0.06)'}}/>
      {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'8px 12px',color:'#fca5a5',fontSize:12,marginBottom:12}}>⚠️ {error}</div>}
      <button onClick={handleSubmit} disabled={loading} style={{width:'100%',padding:14,borderRadius:12,border:'none',cursor:loading?'not-allowed':'pointer',background:loading?'#334155':'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:15,fontWeight:700,fontFamily:'inherit',boxShadow:loading?'none':'0 0 30px rgba(99,102,241,0.4)',transition:'all 0.3s',marginBottom:12}}>
        {loading ? '⏳ Please wait...' : mode==='login' ? t.login : t.signup}
      </button>
      <div style={{textAlign:'center',marginBottom:10}}>
        <span style={{color:'#475569',fontSize:13}}>{mode==='login'?t.noAccount:t.hasAccount} </span>
        <button onClick={() => {setMode(mode==='login'?'signup':'login');setError('')}} style={{background:'none',border:'none',color:'#818cf8',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>{mode==='login'?t.signup:t.login}</button>
      </div>
      <div style={{textAlign:'center',borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:14}}>
        <button onClick={() => onLogin({name:'Guest',email:'guest@demo.com',isGuest:true})} style={{background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#64748b',fontSize:12,cursor:'pointer',padding:'8px 20px',fontFamily:'inherit'}}>👤 {t.guestMode}</button>
      </div>
    </div>
  </div>
}

// ── Small Components ───────────────────────────────────────────────────────────
function ScoreCircle({score, label, size=80}) {
  const stroke=10, nr=size-stroke*2, circ=nr*2*Math.PI, offset=circ-(score/100)*circ, color=matchColor(score)
  return <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
    <svg height={size*2} width={size*2}>
      <circle stroke="#1e1e3a" fill="transparent" strokeWidth={stroke} r={nr} cx={size} cy={size}/>
      <circle stroke={color} fill="transparent" strokeWidth={stroke} strokeDasharray={`${circ} ${circ}`} style={{strokeDashoffset:offset,transition:'stroke-dashoffset 1.2s ease',transform:'rotate(-90deg)',transformOrigin:'50% 50%'}} r={nr} cx={size} cy={size}/>
      <text x="50%" y="46%" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize={size*0.28} fontWeight="800">{score}%</text>
    </svg>
    <p style={{color,fontWeight:700,fontSize:13}}>{label}</p>
  </div>
}

function ProgressBar({score, dark}) {
  const color = matchColor(score)
  return <div style={{width:'100%',marginTop:10}}>
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
      <span style={{color:'#64748b',fontSize:11}}>0%</span>
      <span style={{color,fontSize:12,fontWeight:700}}>{score}%</span>
      <span style={{color:'#64748b',fontSize:11}}>100%</span>
    </div>
    <div style={{background:dark?'#e2e8f0':'#1e1e3a',borderRadius:10,height:9,overflow:'hidden'}}>
      <div style={{width:`${score}%`,height:'100%',borderRadius:10,background:`linear-gradient(90deg,${color},${color}99)`,transition:'width 1.2s ease'}}/>
    </div>
  </div>
}

function CheckList({checks, dark}) {
  return <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:10}}>
    {checks.map((c, i) => <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:8,background:c.pass?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)',border:`1px solid ${c.pass?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}`}}>
      <span>{c.pass?'✅':'❌'}</span>
      <span style={{fontSize:12,color:dark?'#334155':'#94a3b8'}}>{c.label}</span>
    </div>)}
  </div>
}

function SkillBadge({skill, type, dark}) {
  const colors = {matched:{bg:'rgba(16,185,129,0.15)',border:'#10b981',text:'#10b981'},missing:{bg:'rgba(239,68,68,0.15)',border:'#ef4444',text:'#ef4444'},neutral:{bg:'rgba(99,102,241,0.15)',border:'#6366f1',text:dark?'#4f46e5':'#818cf8'}}
  const c = colors[type] || colors.neutral
  const link = type === 'missing' && COURSE_LINKS[skill]
  const style = {padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:600,backgroundColor:c.bg,border:`1px solid ${c.border}`,color:c.text,display:'inline-block',margin:3}
  return link ? <a href={link} target="_blank" rel="noreferrer" style={{textDecoration:'none'}}><span style={{...style,cursor:'pointer'}}>✗ {skill} 🔗</span></a> : <span style={style}>{type==='matched'?'✓ ':type==='missing'?'✗ ':''}{skill}</span>
}

function UploadZone({onFileAccepted, file, dark, t}) {
  const onDrop = useCallback(a => { if (a[0]) onFileAccepted(a[0]) }, [onFileAccepted])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept:{'application/pdf':['.pdf']}, maxFiles:1})
  return <div {...getRootProps()} style={{border:`2px dashed ${isDragActive?'#6366f1':file?'#10b981':dark?'#cbd5e1':'#334155'}`,borderRadius:12,padding:26,textAlign:'center',cursor:'pointer',background:file?'rgba(16,185,129,0.05)':'rgba(255,255,255,0.02)',transition:'all 0.3s'}}>
    <input {...getInputProps()}/>
    <div style={{fontSize:32,marginBottom:8}}>{file?'✅':'📄'}</div>
    {file ? <div><p style={{color:'#10b981',fontWeight:600,fontSize:13}}>{file.name}</p><p style={{color:'#64748b',fontSize:11}}>Click to replace</p></div>
      : <div><p style={{color:dark?'#475569':'#94a3b8',fontWeight:500,fontSize:13}}>{t.uploadHint}</p></div>}
  </div>
}

function InterviewCard({question, index, theme}) {
  const [show, setShow] = useState(false)
  const levelColors = {Easy:'#10b981',Medium:'#f59e0b',Hard:'#ef4444'}
  const color = levelColors[question.level] || '#6366f1'
  return <div style={{background:theme.card,borderRadius:14,border:`1px solid ${theme.border}`,overflow:'hidden',marginBottom:10}}>
    <div style={{padding:'16px 20px'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12,flex:1}}>
          <div style={{width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:11,fontWeight:800,flexShrink:0}}>{index+1}</div>
          <div style={{flex:1}}>
            <div style={{display:'flex',gap:6,marginBottom:6,flexWrap:'wrap'}}>
              <span style={{padding:'2px 10px',borderRadius:12,fontSize:10,fontWeight:700,background:color+'20',color,border:'1px solid '+color+'40'}}>{question.level}</span>
              {question.skill && <span style={{padding:'2px 10px',borderRadius:12,fontSize:10,fontWeight:600,background:'rgba(99,102,241,0.1)',color:'#818cf8',border:'1px solid rgba(99,102,241,0.2)'}}>{question.skill}</span>}
            </div>
            <p style={{color:theme.text,fontSize:14,fontWeight:600,lineHeight:1.5,margin:0}}>{question.q}</p>
          </div>
        </div>
        <button onClick={() => setShow(!show)} style={{padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',background:show?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.1)',color:show?'#ef4444':'#10b981',fontSize:11,fontWeight:700,fontFamily:'inherit',flexShrink:0}}>{show?'Hide':'Answer'}</button>
      </div>
      {show && <div style={{marginTop:12,marginLeft:38,padding:'12px 14px',borderRadius:10,background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.15)'}}>
        <p style={{fontSize:10,color:'#10b981',fontWeight:700,marginBottom:5}}>SUGGESTED ANSWER</p>
        <p style={{fontSize:13,color:theme.subtext,lineHeight:1.7,margin:0}}>{question.a}</p>
      </div>}
    </div>
  </div>
}

// ── Main App ───────────────────────────────────────────────────────────────────

// ── Browser Notification Helper ───────────────────────────────────────────────
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}
function sendNotification(title, body, score) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const icon = score >= 80 ? '🎉' : score >= 60 ? '👍' : '📄'
    new Notification(icon + ' ' + title, { body, icon: '/favicon.ico', badge: '/favicon.ico' })
  }
}

// ── Job Market Trends ─────────────────────────────────────────────────────────
const MARKET_TRENDS = {
  'Full Stack Developer':    { hot:['React','Next.js','TypeScript','Node.js','AWS'], rising:['Remix','Bun','Hono','tRPC'], declining:['jQuery','AngularJS'], avgSalary:'₹18 LPA', demand:'Very High', growth:'+24% YoY' },
  'Python Developer':        { hot:['FastAPI','Django','PostgreSQL','Docker','Redis'], rising:['Rust','Go','uv','Ruff'], declining:['Python 2','Flask (solo)'], avgSalary:'₹15 LPA', demand:'High', growth:'+18% YoY' },
  'Data Scientist / ML Engineer': { hot:['PyTorch','LangChain','RAG','Vector DBs','MLOps'], rising:['LLM Fine-tuning','Agents','Multimodal AI'], declining:['Basic sklearn pipelines'], avgSalary:'₹22 LPA', demand:'Very High', growth:'+35% YoY' },
  'Frontend Developer':      { hot:['React','TypeScript','Tailwind CSS','Next.js','Figma'], rising:['Astro','Svelte','React Server Components'], declining:['CSS-in-JS','Create React App'], avgSalary:'₹12 LPA', demand:'High', growth:'+15% YoY' },
  'DevOps Engineer':         { hot:['Kubernetes','Terraform','GitHub Actions','AWS','Prometheus'], rising:['Platform Engineering','eBPF','WASM'], declining:['Jenkins (traditional)','Bash-only automation'], avgSalary:'₹20 LPA', demand:'Very High', growth:'+28% YoY' },
  'Backend Developer':       { hot:['Go','Rust','PostgreSQL','gRPC','Kafka'], rising:['Edge Computing','HTMX','Bun'], declining:['Monolith REST APIs'], avgSalary:'₹16 LPA', demand:'High', growth:'+20% YoY' },
  'default':                 { hot:['Python','SQL','Git','Docker','Cloud'], rising:['AI/ML','TypeScript','Rust'], declining:['Legacy systems'], avgSalary:'₹12 LPA', demand:'Moderate', growth:'+12% YoY' },
}

function JobMarketTrends({ detectedRole, matchedSkills, missingSkills, theme, isDark }) {
  const trends = MARKET_TRENDS[detectedRole?.role] || MARKET_TRENDS['default']
  const yourHotSkills = matchedSkills.filter(s => trends.hot.includes(s))
  const missingHotSkills = trends.hot.filter(s => missingSkills.includes(s) || !matchedSkills.includes(s))
  const demandColor = trends.demand === 'Very High' ? '#10b981' : trends.demand === 'High' ? '#f59e0b' : '#6366f1'

  return (
    <div>
      {/* Market Overview */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:18}}>
        {[
          {icon:'📈',label:'Market Demand',value:trends.demand,color:demandColor},
          {icon:'💰',label:'Avg Salary (India)',value:trends.avgSalary,color:'#f59e0b'},
          {icon:'🚀',label:'Job Growth',value:trends.growth,color:'#10b981'},
        ].map(stat => (
          <div key={stat.label} style={{background:theme.card,borderRadius:14,padding:'16px',border:`1px solid ${stat.color}25`,textAlign:'center'}}>
            <div style={{fontSize:24,marginBottom:6}}>{stat.icon}</div>
            <div style={{fontSize:17,fontWeight:900,color:stat.color,marginBottom:2}}>{stat.value}</div>
            <div style={{fontSize:10,color:'#64748b'}}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Hot Skills in Market */}
      <div style={{background:theme.card,borderRadius:14,padding:18,border:'1px solid rgba(16,185,129,0.2)',marginBottom:14}}>
        <h4 style={{color:'#10b981',fontWeight:700,fontSize:13,marginBottom:10}}>🔥 Most In-Demand Skills for {detectedRole?.role||'Your Role'} Right Now</h4>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:12}}>
          {trends.hot.map(skill => {
            const have = matchedSkills.includes(skill)
            return (
              <span key={skill} style={{padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:have?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.1)',color:have?'#10b981':'#ef4444',border:`1px solid ${have?'#10b981':'#ef4444'}30`}}>
                {have ? '✅' : '❌'} {skill}
              </span>
            )
          })}
        </div>
        {yourHotSkills.length > 0 && <p style={{fontSize:12,color:'#64748b'}}>🎯 You have {yourHotSkills.length}/{trends.hot.length} hot skills: <span style={{color:'#10b981',fontWeight:600}}>{yourHotSkills.join(', ')}</span></p>}
      </div>

      {/* Rising Skills */}
      <div style={{background:theme.card,borderRadius:14,padding:18,border:'1px solid rgba(245,158,11,0.2)',marginBottom:14}}>
        <h4 style={{color:'#f59e0b',fontWeight:700,fontSize:13,marginBottom:10}}>⬆️ Rising Skills to Learn Next (2025-2026)</h4>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {trends.rising.map(skill => (
            <span key={skill} style={{padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:'rgba(245,158,11,0.1)',color:'#f59e0b',border:'1px solid rgba(245,158,11,0.3)'}}> 📈 {skill}</span>
          ))}
        </div>
        <p style={{fontSize:11,color:'#64748b',marginTop:10}}>💡 Learning these now puts you ahead of 80% of candidates in 2026!</p>
      </div>

      {/* Declining */}
      <div style={{background:theme.card,borderRadius:14,padding:18,border:'1px solid rgba(100,116,139,0.2)',marginBottom:14}}>
        <h4 style={{color:'#64748b',fontWeight:700,fontSize:13,marginBottom:10}}>⬇️ Skills Losing Demand</h4>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {trends.declining.map(skill => (
            <span key={skill} style={{padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:600,background:'rgba(100,116,139,0.1)',color:'#64748b',border:'1px solid rgba(100,116,139,0.2)',textDecoration:'line-through'}}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Action Card */}
      {missingHotSkills.length > 0 && (
        <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))',borderRadius:14,padding:18,border:'1px solid rgba(99,102,241,0.2)'}}>
          <h4 style={{color:'#818cf8',fontWeight:700,fontSize:13,marginBottom:8}}>🎯 Your Action Plan</h4>
          <p style={{fontSize:12,color:'#64748b',lineHeight:1.6}}>Add these hot market skills to boost hirability: <span style={{color:'#818cf8',fontWeight:700}}>{missingHotSkills.slice(0,4).join(', ')}</span>. These appear in 70%+ of job postings for your role!</p>
        </div>
      )}
    </div>
  )
}

// ── Animated Score Card ───────────────────────────────────────────────────────
function AnimatedScoreCard({ matchScore, resumeScore, atsScore, t, isDark }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setTimeout(() => setAnimated(true), 100) }, [])

  const overall = Math.round((matchScore + resumeScore + atsScore) / 3)
  const grade = overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B+' : overall >= 60 ? 'B' : overall >= 50 ? 'C' : 'D'
  const gradeColor = overall >= 80 ? '#10b981' : overall >= 60 ? '#f59e0b' : '#ef4444'
  const gradeMsg = overall >= 80 ? 'Excellent! Ready to apply!' : overall >= 60 ? 'Good! A few improvements needed.' : 'Needs Work. Follow the Improver tab!'

  const metrics = [
    { label: t.jobMatch, value: matchScore, icon: '🎯', desc: 'Keyword match vs JD' },
    { label: t.resumeScore, value: resumeScore, icon: '📄', desc: 'Resume quality & structure' },
    { label: t.atsScore, value: atsScore, icon: '🤖', desc: 'ATS system compatibility' },
  ]

  return (
    <div>
      {/* Grade Card */}
      <div style={{background:`linear-gradient(135deg, ${gradeColor}18, ${gradeColor}08)`,borderRadius:20,padding:28,border:`2px solid ${gradeColor}30`,marginBottom:20,textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:'50%',background:`${gradeColor}10`}}/>
        <div style={{fontSize:72,fontWeight:900,color:gradeColor,lineHeight:1,marginBottom:8,fontFamily:'Georgia,serif'}}>{grade}</div>
        <div style={{fontSize:14,fontWeight:700,color:gradeColor,marginBottom:4}}>{gradeMsg}</div>
        <div style={{fontSize:12,color:'#64748b'}}>Overall Score: {overall}% • Based on 3 factors</div>
      </div>

      {/* Animated Metric Bars */}
      {metrics.map((m, i) => (
        <div key={m.label} style={{background:isDark?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.8)',borderRadius:16,padding:20,marginBottom:12,border:`1px solid ${matchColor(m.value)}20`,boxShadow:isDark?'none':'0 2px 10px rgba(0,0,0,0.04)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${matchColor(m.value)}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{m.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:isDark?'#e2e8f0':'#1e293b'}}>{m.label}</div>
                <div style={{fontSize:11,color:'#64748b'}}>{m.desc}</div>
              </div>
            </div>
            <div style={{fontSize:28,fontWeight:900,color:matchColor(m.value)}}>{m.value}%</div>
          </div>
          {/* Animated bar */}
          <div style={{background:isDark?'#1e293b':'#f1f5f9',borderRadius:99,height:12,overflow:'hidden',position:'relative'}}>
            <div style={{height:'100%',borderRadius:99,background:`linear-gradient(90deg,${matchColor(m.value)},${matchColor(m.value)}bb)`,width:animated?`${m.value}%`:'0%',transition:`width ${0.8 + i * 0.2}s cubic-bezier(0.34,1.56,0.64,1)`,position:'relative'}}>
              <div style={{position:'absolute',right:0,top:0,height:'100%',width:4,background:'white',borderRadius:99,opacity:0.7}}/>
            </div>
          </div>
          {/* Threshold markers */}
          <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
            {[{v:40,l:'Fair'},{v:60,l:'Good'},{v:80,l:'Strong'}].map(mark => (
              <div key={mark.v} style={{textAlign:'center',width:0,marginLeft:`${mark.v}%`}}>
                <div style={{width:1,height:6,background:isDark?'rgba(255,255,255,0.1)':'#e2e8f0',margin:'0 auto'}}/>
                <span style={{fontSize:9,color:'#475569',whiteSpace:'nowrap'}}>{mark.l}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── AI Chat Assistant ─────────────────────────────────────────────────────────
function AIChatAssistant({ result, detectedRole, resumeScore, atsScore, theme, isDark }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! 👋 I've analyzed your resume. You scored **${result.match_score}%** match for **${detectedRole?.role||'Software Developer'}**. Ask me anything about your resume! Try: "Why is my score low?" or "What should I add?"` }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages])

  const quickQuestions = [
    'Why is my score low?',
    'What skills should I add?',
    'How to improve ATS score?',
    'Am I ready to apply?',
    'What salary can I expect?',
  ]

  const generateResponse = (question) => {
    const q = question.toLowerCase()
    const ms = result.match_score, rs = resumeScore?.score||0, as = atsScore?.score||0
    const matched = result.matched_skills, missing = result.missing_skills

    if (q.includes('score low') || q.includes('why') && q.includes('score')) {
      if (ms >= 80) return `Your score is actually great at ${ms}%! 🎉 The main areas to push even higher: add ${missing.slice(0,2).join(' and ')} to your skills section.`
      return `Your ${ms}% score is ${ms>=60?'decent but could be better':'below average'}. Main reasons: ${missing.length > 0 ? 'Missing '+missing.slice(0,3).join(', ')+' from the job requirements.' : ''} ${rs < 60 ? 'Your resume structure needs work — add more detail to experience section.' : ''} ${as < 70 ? 'ATS compatibility is low — use standard section headings.' : ''} Follow the 🎯 Improver tab for step-by-step fixes!`
    }
    if (q.includes('add') || q.includes('skills') || q.includes('missing')) {
      if (missing.length === 0) return `Amazing! 🌟 You have ALL the required skills. To stand out even more, consider learning: ${MARKET_TRENDS[detectedRole?.role]?.rising?.slice(0,3).join(', ') || 'TypeScript, Docker, Cloud'} — these are trending in your field right now!`
      return `Add these ${missing.length} missing skills to your resume: **${missing.slice(0,5).join(', ')}**. Focus on the top 3 first. You can add them to your Skills section and mention them in project descriptions. Check the ⭐ Roadmap tab for learning plans!`
    }
    if (q.includes('ats')) {
      if (as >= 80) return `Your ATS score of ${as}/100 is strong! ✅ To keep it high: avoid tables and columns, use standard headings like "Experience", "Skills", "Education", and make sure your email is in plain text format.`
      return `Your ATS score is ${as}/100. To improve: 1) Use standard section headings (Experience, Skills, Education), 2) Avoid special characters and tables, 3) Add more keywords that match the job description exactly. Missing keywords: ${missing.slice(0,4).join(', ')}.`
    }
    if (q.includes('ready') || q.includes('apply')) {
      if (ms >= 80) return `Yes! 🎉 At ${ms}% match, you are a strong candidate. Apply immediately! Include a tailored cover letter mentioning your top skills: ${matched.slice(0,4).join(', ')}.`
      if (ms >= 60) return `Almost ready! 📋 At ${ms}%, you are a good candidate but not top-tier yet. I'd suggest: 1) Add ${missing.slice(0,2).join(' and ')}, 2) Tailor your summary to mention the exact job title, then apply!`
      return `Not quite yet. At ${ms}%, you may get filtered out. Spend 1-2 weeks: 1) Add missing skills to projects, 2) Rewrite your summary with job keywords, 3) Aim for 70%+ before applying.`
    }
    if (q.includes('salary') || q.includes('pay') || q.includes('earn')) {
      const sal = MARKET_TRENDS[detectedRole?.role] || MARKET_TRENDS['default']
      return `For ${detectedRole?.role||'your role'} in India, average salary is **${sal.avgSalary}**. With your ${matched.length} matched skills, you can expect: Junior: ₹6-10 LPA, Mid: ₹12-20 LPA, Senior: ₹25-50 LPA. Market demand is **${sal.demand}** with ${sal.growth} growth!`
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Hello! 😊 I'm your AI resume assistant. I can help you understand your scores, what to improve, and how to get more job offers. What would you like to know?`
    }
    if (q.includes('strength') || q.includes('good') || q.includes('best')) {
      return `Your strongest points: ✅ You matched ${matched.length} out of ${result.jd_skills.length} required skills including **${matched.slice(0,4).join(', ')}**. ${ms >= 80 ? 'Your overall match is excellent!' : 'Focus on adding '+ missing.slice(0,2).join(' and ')+' to get to the next level.'}`
    }
    if (q.includes('interview')) {
      return `For a ${detectedRole?.role||'developer'} interview, expect questions on: ${matched.slice(0,4).join(', ')}. Check the 🎤 Interview tab — I've prepared ${Math.min(12, matched.length * 2 + 3)} personalized questions based on YOUR skills! Key tip: use STAR method for behavioral questions.`
    }
    if (q.includes('cover letter')) {
      return `Great idea! A cover letter should: 1) Open with the exact job title, 2) Mention your top 3 matched skills (${matched.slice(0,3).join(', ')}), 3) Give one specific example/project, 4) Close with enthusiasm. Keep it under 250 words!`
    }
    // Default
    return `Good question! Based on your analysis: you matched ${matched.length}/${result.jd_skills.length} skills with a ${ms}% score. ${ms >= 80 ? '🎉 You are a strong candidate!' : ms >= 60 ? '📈 You are close — a few improvements will make a big difference.' : '📚 Focus on adding missing skills: '+ missing.slice(0,3).join(', ')} Want more specific advice? Try asking "What skills should I add?" or "How to improve ATS score?"`
  }

  const sendMessage = (text) => {
    const question = text || input.trim()
    if (!question) return
    setMessages(prev => [...prev, {role:'user', text:question}])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const response = generateResponse(question)
      setMessages(prev => [...prev, {role:'ai', text:response}])
      setTyping(false)
    }, 800 + Math.random() * 600)
  }

  const formatText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:480}}>
      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:12,padding:'4px 0',marginBottom:12}}>
        {messages.map((msg, i) => (
          <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',flexDirection:msg.role==='user'?'row-reverse':'row'}}>
            <div style={{width:30,height:30,borderRadius:'50%',background:msg.role==='ai'?'linear-gradient(135deg,#6366f1,#8b5cf6)':'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>
              {msg.role==='ai'?'🤖':'👤'}
            </div>
            <div style={{maxWidth:'78%',padding:'10px 14px',borderRadius:msg.role==='ai'?'4px 14px 14px 14px':'14px 4px 14px 14px',background:msg.role==='ai'?isDark?'rgba(99,102,241,0.1)':'rgba(99,102,241,0.06)':isDark?'rgba(16,185,129,0.1)':'rgba(16,185,129,0.08)',border:`1px solid ${msg.role==='ai'?'rgba(99,102,241,0.2)':'rgba(16,185,129,0.2)'}`,fontSize:13,color:isDark?'#e2e8f0':'#1e293b',lineHeight:1.6}} dangerouslySetInnerHTML={{__html:formatText(msg.text)}}/>
          </div>
        ))}
        {typing && (
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>🤖</div>
            <div style={{padding:'10px 16px',borderRadius:'4px 14px 14px 14px',background:isDark?'rgba(99,102,241,0.1)':'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.2)'}}>
              <div style={{display:'flex',gap:4,alignItems:'center'}}>
                {[0,1,2].map(i => <div key={i} style={{width:6,height:6,borderRadius:'50%',background:'#6366f1',animation:'bounce 1s infinite',animationDelay:`${i*0.15}s`}}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Quick Questions */}
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
        {quickQuestions.map(q => (
          <button key={q} onClick={() => sendMessage(q)} style={{padding:'4px 10px',borderRadius:20,border:'1px solid rgba(99,102,241,0.3)',cursor:'pointer',background:'rgba(99,102,241,0.06)',color:'#818cf8',fontSize:11,fontWeight:600,fontFamily:'inherit',transition:'all 0.2s'}} onMouseOver={e=>{e.target.style.background='rgba(99,102,241,0.15)'}} onMouseOut={e=>{e.target.style.background='rgba(99,102,241,0.06)'}}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{display:'flex',gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Ask anything about your resume..." style={{flex:1,padding:'10px 14px',borderRadius:12,border:`2px solid ${isDark?'#1e293b':'#c7d2fe'}`,background:isDark?'rgba(255,255,255,0.03)':'rgba(99,102,241,0.05)',color:isDark?'#e2e8f0':'#1e293b',fontSize:13,fontFamily:'inherit',outline:'none',transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor=isDark?'#1e293b':'#c7d2fe'}/>
        <button onClick={()=>sendMessage()} style={{padding:'10px 18px',borderRadius:12,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:16,fontFamily:'inherit'}}>➤</button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState('en')
  const t = LANG[lang]
  const [darkMode, setDarkMode] = useState(true)
  const [user, setUser] = useState(() => { try { const u = localStorage.getItem('ars_user'); return u ? JSON.parse(u) : null } catch { return null } })
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState('single')
  const [activeResultTab, setActiveResultTab] = useState('overview')
  const [files, setFiles] = useState([null,null,null])
  const [compareResults, setCompareResults] = useState([])
  const [compareLoading, setCompareLoading] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [toast, setToast] = useState('')
  const [showDashboard, setShowDashboard] = useState(false)
  const isDark = darkMode
  useEffect(() => { requestNotificationPermission() }, [])

  const theme = {
    bg: isDark?'linear-gradient(135deg,#0f0f1a,#1a1a2e,#0f0f1a)':'linear-gradient(135deg,#f0f4ff,#e8eeff,#f0f4ff)',
    card: isDark?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.9)',
    border: isDark?'rgba(255,255,255,0.07)':'rgba(99,102,241,0.15)',
    text: isDark?'#e2e8f0':'#1e293b',
    subtext: '#64748b',
    header: isDark?'rgba(15,15,26,0.9)':'rgba(255,255,255,0.95)',
    input: isDark?'rgba(255,255,255,0.02)':'rgba(99,102,241,0.05)',
    inputBorder: isDark?'#1e293b':'#c7d2fe',
  }
  const card = (extra={}) => ({background:theme.card,borderRadius:16,padding:22,border:`1px solid ${theme.border}`,marginBottom:18,boxShadow:isDark?'none':'0 4px 20px rgba(99,102,241,0.08)',...extra})

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) { setError('Please upload a resume PDF and enter a job description.'); return }
    setError(''); setLoading(true)
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('job_description', jd)
      const res = await axios.post(`${API_URL}/analyze`, fd)
      setResult(res.data); setActiveResultTab('overview')
      if (res.data.match_score >= 80) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000) }
      sendNotification('Analysis Complete!', 'Your resume scored ' + res.data.match_score + '% match. Tap to see details!', res.data.match_score)
      try {
        const rs2 = calcResumeScore(res.data.resume_text_preview||'', res.data.resume_skills)
        const ats2 = calcATSScore(res.data.resume_text_preview||'', res.data.resume_skills, res.data.jd_skills)
        const role2 = detectJobRole(jd, res.data.jd_skills)
        const entry = {resume_name:file.name,match_score:res.data.match_score,resume_score:rs2.score,ats_score:ats2.score,role:role2?.role||'Software Developer',date:new Date().toLocaleDateString()}
        const hist = JSON.parse(localStorage.getItem('ars_history')||'[]')
        hist.push(entry)
        localStorage.setItem('ars_history', JSON.stringify(hist.slice(-20)))
      } catch(e) {}
    } catch { setError('Failed to connect to backend. Make sure server is running on port 8000.') }
    setLoading(false)
  }

  const handleCompare = async () => {
    const vf = files.filter(f => f !== null)
    if (vf.length < 2 || !jd.trim()) { setError('Please upload at least 2 resumes and a job description.'); return }
    setError(''); setCompareLoading(true); setCompareResults([])
    try {
      const results = await Promise.all(vf.map(async f => { const fd = new FormData(); fd.append('file', f); fd.append('job_description', jd); const r = await axios.post(`${API_URL}/analyze`, fd); return {name:f.name,...r.data} }))
      setCompareResults(results.sort((a,b) => b.match_score - a.match_score))
    } catch { setError('Failed to analyze.') }
    setCompareLoading(false)
  }

  const handleReset = () => { setFile(null); setJd(''); setResult(null); setError(''); setShowPreview(false); setCompareResults([]); setFiles([null,null,null]); setEmailSent(false); setEmailInput('') }
  const handleLogout = () => { localStorage.removeItem('ars_user'); setUser(null); handleReset() }

  const handleSendEmail = () => {
    if (!emailInput.includes('@')) { alert('Please enter a valid email.'); return }
    const r = result
    const rs = calcResumeScore(r.resume_text_preview||'', r.resume_skills)
    const ats = calcATSScore(r.resume_text_preview||'', r.resume_skills, r.jd_skills)
    const nl = '\n'
    const report = '==================================' + nl + '   AI RESUME SCREENER REPORT' + nl + '==================================' + nl + nl +
      'Resume: ' + (file?.name||'Resume') + nl + 'Date: ' + new Date().toLocaleDateString() + nl + nl +
      '--- SCORES ---' + nl + 'Job Match: ' + r.match_score + '%' + nl + 'Resume: ' + rs.score + '/100' + nl + 'ATS: ' + ats.score + '/100' + nl + nl +
      '--- MATCHED SKILLS ---' + nl + (r.matched_skills.join(', ')||'None') + nl + nl +
      '--- MISSING SKILLS ---' + nl + (r.missing_skills.join(', ')||'None') + nl + nl +
      '=================================='
    // Copy to clipboard first
    navigator.clipboard.writeText(report).catch(() => {})
    // Build mailto link - use location.href to avoid popup blocker
    const subject = encodeURIComponent('Resume Analysis Report - ' + (file?.name||'Resume'))
    const body = encodeURIComponent(report)
    const mailtoLink = 'mailto:' + emailInput + '?subject=' + subject + '&body=' + body
    // Create invisible link and click it - most reliable way
    const a = document.createElement('a')
    a.href = mailtoLink
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => document.body.removeChild(a), 1000)
    setEmailSent(true)
    showToast('✅ Email app opened! Report also copied to clipboard.')
  }

  const handleExportPDF = () => {
    const r = result
    const rs = calcResumeScore(r.resume_text_preview||'', r.resume_skills)
    const ats = calcATSScore(r.resume_text_preview||'', r.resume_skills, r.jd_skills)
    const role = detectJobRole(jd, r.jd_skills)
    const tips = generateResumeTips(r.resume_text_preview||'', r.resume_skills, r.missing_skills, r.match_score)
    const userName = user?.name || 'User'
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume Report</title><style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;color:#1e293b}
      .page{max-width:820px;margin:0 auto;background:white;padding:48px;min-height:100vh}
      .header{border-bottom:3px solid #6366f1;padding-bottom:20px;margin-bottom:28px}
      .header h1{font-size:26px;font-weight:800;color:#6366f1;margin-bottom:4px}
      .header p{font-size:13px;color:#64748b}
      .scores{display:flex;gap:16px;margin-bottom:28px}
      .sbox{flex:1;text-align:center;padding:16px;border-radius:12px;border:2px solid #e2e8f0}
      .snum{font-size:32px;font-weight:900;margin-bottom:4px}
      .slabel{font-size:12px;color:#64748b;font-weight:600}
      .section{margin-bottom:24px}
      .section h2{font-size:14px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #e2e8f0}
      .badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
      .badge{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600}
      .matched{background:#d1fae5;color:#065f46;border:1px solid #a7f3d0}
      .missing{background:#fee2e2;color:#991b1b;border:1px solid #fca5a5}
      .tip{padding:10px 14px;border-radius:8px;margin-bottom:6px;font-size:12px;line-height:1.5}
      .tip.ok{background:#f0fdf4;color:#166534;border-left:3px solid #10b981}
      .tip.warn{background:#fffbeb;color:#92400e;border-left:3px solid #f59e0b}
      .tip.err{background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444}
      .footer{margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:10px;color:#94a3b8}
    </style></head><body><div class="page">
      <div class="header">
        <h1>AI Resume Analysis Report</h1>
        <p>${role.icon} ${role.role} &nbsp;|&nbsp; 👤 ${userName} &nbsp;|&nbsp; 📅 ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="scores">
        <div class="sbox"><div class="snum" style="color:${matchColor(r.match_score)}">${r.match_score}%</div><div class="slabel">Job Match</div></div>
        <div class="sbox"><div class="snum" style="color:${matchColor(rs.score)}">${rs.score}/100</div><div class="slabel">Resume Score</div></div>
        <div class="sbox"><div class="snum" style="color:${matchColor(ats.score)}">${ats.score}/100</div><div class="slabel">ATS Score</div></div>
      </div>
      <div class="section"><h2>✅ Matched Skills (${r.matched_skills.length})</h2><div class="badges">${r.matched_skills.map(s=>'<span class="badge matched">'+s+'</span>').join('')}</div></div>
      <div class="section"><h2>❌ Missing Skills (${r.missing_skills.length})</h2><div class="badges">${r.missing_skills.map(s=>'<span class="badge missing">'+s+'</span>').join('')||'<span style="color:#64748b;font-size:13px">🎉 No missing skills!</span>'}</div></div>
      <div class="section"><h2>📝 Resume Tips</h2>${tips.map(t=>'<div class="tip '+(t.type==='success'?'ok':t.type==='warning'?'warn':'err')+'">'+t.tip+'</div>').join('')}</div>
      <div class="section"><h2>💡 AI Recommendations</h2>${r.suggestions.map(s=>'<div class="tip warn">'+s+'</div>').join('')}</div>
      <div class="footer">Generated by AI Resume Screener &nbsp;•&nbsp; ${new Date().toLocaleString()}</div>
    </div></body></html>`

    // Download as HTML file directly to Downloads (no print dialog, no closing app)
    const blob = new Blob([html], {type: 'text/html;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Resume-Report-' + (userName.replace(/\s+/g,'-')) + '-' + new Date().toLocaleDateString('en-GB').replace(/\//g,'-') + '.html'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 1000)
    showToast('📥 Report downloaded to your Downloads folder!')
  }

  const resumeScore = result ? calcResumeScore(result.resume_text_preview||'', result.resume_skills) : null
  const atsScore = result ? calcATSScore(result.resume_text_preview||'', result.resume_skills, result.jd_skills) : null
  const detectedRole = result ? detectJobRole(jd, result.jd_skills) : null
  const interviewQuestions = result ? generateInterviewQuestions(result.matched_skills, detectedRole) : []
  const resumeTips = result ? generateResumeTips(result.resume_text_preview||'', result.resume_skills, result.missing_skills, result.match_score) : []
  const resultTabs = ['overview','scorecard','market','chat','improver','roadmap','resume tips','ats & score','strength','salary','interview','resume builder','email report']

  if (!user) return <LoginPage onLogin={u => setUser(u)} t={t}/>
  if (showDashboard) return <Dashboard theme={theme} isDark={isDark} onClose={() => setShowDashboard(false)}/>

  return <div style={{minHeight:'100vh',background:theme.bg,transition:'all 0.3s'}}>
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    <Confetti active={showConfetti}/>
    {toast && <div style={{position:'fixed',top:20,right:20,zIndex:9999,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',padding:'12px 20px',borderRadius:12,fontWeight:600,fontSize:13,boxShadow:'0 8px 30px rgba(99,102,241,0.4)'}}>{toast}</div>}

    <header style={{padding:'14px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${theme.border}`,position:'sticky',top:0,zIndex:100,background:theme.header,backdropFilter:'blur(10px)'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>🤖</div>
        <div><h1 style={{fontSize:16,fontWeight:800,color:theme.text}}>{t.appName}</h1><p style={{fontSize:10,color:theme.subtext}}>{t.tagline}</p></div>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
        {!result && compareResults.length === 0 && <div style={{display:'flex',background:isDark?'rgba(255,255,255,0.05)':'rgba(99,102,241,0.08)',borderRadius:10,padding:3}}>
          {['single','compare'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} style={{padding:'5px 12px',borderRadius:8,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:'inherit',background:activeTab===tab?'linear-gradient(135deg,#6366f1,#8b5cf6)':'transparent',color:activeTab===tab?'white':theme.subtext,transition:'all 0.2s'}}>{tab==='single'?'📄 Single':'📊 Compare'}</button>)}
        </div>}
        <select value={lang} onChange={e => setLang(e.target.value)} style={{padding:'5px 10px',borderRadius:8,border:`1px solid ${theme.border}`,background:isDark?'rgba(255,255,255,0.05)':'white',color:theme.text,fontSize:11,fontFamily:'inherit',cursor:'pointer',outline:'none'}}>
          <option value="en">🇬🇧 English</option>
          <option value="ta">🇮🇳 தமிழ்</option>
          <option value="hi">🇮🇳 हिंदी</option>
        </select>
        <button onClick={() => setDarkMode(!darkMode)} style={{width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',background:isDark?'#6366f1':'#e2e8f0',position:'relative',transition:'all 0.3s'}}>
          <div style={{width:18,height:18,borderRadius:'50%',background:'white',position:'absolute',top:3,left:isDark?23:3,transition:'left 0.3s',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10}}>{isDark?'🌙':'☀️'}</div>
        </button>
        <button onClick={() => setShowDashboard(true)} style={{padding:'6px 14px',borderRadius:20,border:'1px solid rgba(99,102,241,0.3)',cursor:'pointer',background:'rgba(99,102,241,0.08)',color:'#818cf8',fontSize:12,fontWeight:700,fontFamily:'inherit'}}>📊 Dashboard</button>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:20,background:isDark?'rgba(255,255,255,0.05)':'rgba(99,102,241,0.08)',border:`1px solid ${theme.border}`}}>
          <div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'white',fontWeight:700}}>{user.name[0].toUpperCase()}</div>
          <span style={{fontSize:12,color:theme.text,fontWeight:600}}>{user.name}</span>
          <button onClick={handleLogout} style={{background:'none',border:'none',cursor:'pointer',color:'#64748b',fontSize:11,padding:0,fontFamily:'inherit'}}>Logout</button>
        </div>
        <div style={{padding:'5px 12px',borderRadius:20,fontSize:11,fontWeight:600,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',color:'#10b981'}}>● Live</div>
      </div>
    </header>

    <main style={{maxWidth:1100,margin:'0 auto',padding:'30px 18px'}}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <h2 style={{fontSize:34,fontWeight:800,marginBottom:10,background:'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{t.hero}</h2>
        <p style={{color:theme.subtext,fontSize:14,maxWidth:500,margin:'0 auto'}}>{t.heroSub}</p>
      </div>

      {result===null && compareResults.length===0 && activeTab==='single' && !loading && <>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
          <div style={card()}><h3 style={{color:theme.text,fontWeight:700,marginBottom:12,fontSize:14}}>📎 {t.upload}</h3><UploadZone onFileAccepted={setFile} file={file} dark={!isDark} t={t}/></div>
          <div style={card()}>
            <h3 style={{color:theme.text,fontWeight:700,marginBottom:12,fontSize:14}}>📋 {t.jdLabel}</h3>
            <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder={t.jdPlaceholder} style={{width:'100%',height:170,background:theme.input,border:`2px solid ${theme.inputBorder}`,borderRadius:12,color:theme.text,padding:12,fontSize:13,resize:'none',outline:'none',fontFamily:'inherit',lineHeight:1.6,transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor=theme.inputBorder}/>
          </div>
        </div>
        {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:12,padding:12,marginBottom:16,color:'#fca5a5',textAlign:'center',fontSize:13}}>⚠️ {error}</div>}
        <div style={{textAlign:'center'}}>
          <button onClick={handleAnalyze} style={{padding:'14px 46px',borderRadius:50,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:15,fontWeight:700,fontFamily:'inherit',boxShadow:'0 0 34px rgba(99,102,241,0.4)'}}>🚀 {t.analyze}</button>
        </div>
      </>}

      {loading && <AnalyzingSkeleton/>}

      {result===null && compareResults.length===0 && activeTab==='compare' && !loading && <>
        <div style={card()}><h3 style={{color:theme.text,fontWeight:700,marginBottom:12,fontSize:14}}>📋 {t.jdLabel}</h3>
          <textarea value={jd} onChange={e=>setJd(e.target.value)} placeholder={t.jdPlaceholder} style={{width:'100%',height:100,background:theme.input,border:`2px solid ${theme.inputBorder}`,borderRadius:12,color:theme.text,padding:12,fontSize:13,resize:'none',outline:'none',fontFamily:'inherit',transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor=theme.inputBorder}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:16}}>
          {[0,1,2].map(i => <div key={i} style={card()}><h4 style={{color:theme.subtext,fontWeight:600,marginBottom:10,fontSize:13}}>Resume {i+1} {i===0?'(Required)':'(Optional)'}</h4><UploadZone onFileAccepted={f=>{const nf=[...files];nf[i]=f;setFiles(nf)}} file={files[i]} dark={!isDark} t={t}/></div>)}
        </div>
        {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:12,padding:12,marginBottom:16,color:'#fca5a5',textAlign:'center'}}>⚠️ {error}</div>}
        <div style={{textAlign:'center'}}><button onClick={handleCompare} disabled={compareLoading} style={{padding:'14px 46px',borderRadius:50,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:15,fontWeight:700,fontFamily:'inherit',boxShadow:'0 0 34px rgba(99,102,241,0.4)'}}>{compareLoading?'🔄 Comparing...':'📊 Compare Resumes'}</button></div>
      </>}

      {compareResults.length > 0 && <div>
        <h3 style={{color:theme.text,fontWeight:700,fontSize:18,marginBottom:16,textAlign:'center'}}>📊 Resume Ranking</h3>
        {compareResults.map((r, i) => <div key={i} style={card({border:i===0?'1px solid rgba(99,102,241,0.4)':`1px solid ${theme.border}`})}>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <div style={{fontSize:26}}>{i===0?'🥇':i===1?'🥈':'🥉'}</div>
            <div style={{flex:1}}><p style={{color:theme.text,fontWeight:700,marginBottom:4,fontSize:14}}>{r.name}</p><ProgressBar score={r.match_score} dark={!isDark}/></div>
            <div style={{textAlign:'center'}}><div style={{fontSize:26,fontWeight:900,color:matchColor(r.match_score)}}>{r.match_score}%</div><div style={{fontSize:11,color:theme.subtext}}>{r.matched_skills.length}/{r.jd_skills.length} skills</div></div>
          </div>
        </div>)}
        <div style={{textAlign:'center'}}><button onClick={handleReset} style={{padding:'11px 30px',borderRadius:50,border:'2px solid #6366f1',cursor:'pointer',background:'transparent',color:'#818cf8',fontSize:13,fontWeight:700,fontFamily:'inherit'}}>🔄 Start Over</button></div>
      </div>}

      {result !== null && <div>
        {detectedRole && <div style={{...card({border:'1px solid rgba(99,102,241,0.3)'}),display:'flex',alignItems:'center',gap:14}}>
          <div style={{fontSize:36}}>{detectedRole.icon}</div>
          <div>
            <p style={{color:theme.subtext,fontSize:10,marginBottom:2,letterSpacing:'0.5px'}}>🎯 {t.detectedRole}</p>
            <h3 style={{color:theme.text,fontWeight:800,fontSize:20,marginBottom:2}}>{detectedRole.role}</h3>
            <p style={{color:'#6366f1',fontSize:12,fontWeight:600,margin:0}}>👤 {user?.name||'User'}</p>
          </div>
        </div>}

        <div style={card()}>
          <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:16,marginBottom:16}}>
            <ScoreCircle score={result.match_score} label={t.jobMatch} size={72}/>
            <ScoreCircle score={resumeScore.score} label={t.resumeScore} size={72}/>
            <ScoreCircle score={atsScore.score} label={t.atsScore} size={72}/>
          </div>
          <ProgressBar score={result.match_score} dark={!isDark}/>
          <div style={{display:'flex',gap:10,marginTop:14,flexWrap:'wrap'}}>
            {[{label:'In Resume',value:result.resume_skills.length,color:'#6366f1'},{label:'Required',value:result.jd_skills.length,color:'#8b5cf6'},{label:'Matched',value:result.matched_skills.length,color:'#10b981'}].map(s => (
              <div key={s.label} style={{textAlign:'center',padding:'10px 14px',background:isDark?'rgba(255,255,255,0.03)':'rgba(99,102,241,0.05)',borderRadius:10,border:`1px solid ${s.color}30`}}>
                <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.value}</div>
                <div style={{fontSize:10,color:theme.subtext}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
          {resultTabs.map(tab => <button key={tab} onClick={() => setActiveResultTab(tab)} style={{padding:'7px 13px',borderRadius:20,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,fontFamily:'inherit',background:activeResultTab===tab?'linear-gradient(135deg,#6366f1,#8b5cf6)':isDark?'rgba(255,255,255,0.05)':'rgba(99,102,241,0.08)',color:activeResultTab===tab?'white':theme.subtext,transition:'all 0.2s'}}>
            {tab==='overview'?'📊 Overview':tab==='scorecard'?'🏆 Scorecard':tab==='market'?'📈 Market':tab==='chat'?'💬 AI Chat':tab==='improver'?'🎯 Improver':tab==='roadmap'?'⭐ Roadmap':tab==='resume tips'?'📝 Tips':tab==='ats & score'?'🔍 ATS':tab==='strength'?'⚡ Strength':tab==='salary'?'💰 Salary':tab==='interview'?'🎤 Interview':tab==='resume builder'?'📋 Builder':'📧 Email'}
          </button>)}
        </div>

        {activeResultTab==='overview' && <>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div style={card({border:'1px solid rgba(16,185,129,0.2)'})}>
              <h4 style={{color:'#10b981',fontWeight:700,marginBottom:10,fontSize:14}}>✅ {t.matched} ({result.matched_skills.length})</h4>
              {result.matched_skills.length > 0 ? result.matched_skills.map(s => <SkillBadge key={s} skill={s} type="matched" dark={!isDark}/>) : <p style={{color:theme.subtext,fontSize:13}}>No matching skills.</p>}
            </div>
            <div style={card({border:'1px solid rgba(239,68,68,0.2)'})}>
              <h4 style={{color:'#ef4444',fontWeight:700,marginBottom:4,fontSize:14}}>✗ {t.missing} ({result.missing_skills.length})</h4>
              <p style={{color:theme.subtext,fontSize:11,marginBottom:8}}>🔗 {t.clickCourse}</p>
              {result.missing_skills.length > 0 ? result.missing_skills.map(s => <SkillBadge key={s} skill={s} type="missing" dark={!isDark}/>) : <p style={{color:theme.subtext,fontSize:13}}>🎉 You have all skills!</p>}
            </div>
          </div>
          <div style={card({border:'1px solid rgba(99,102,241,0.2)'})}>
            <h4 style={{color:'#818cf8',fontWeight:700,marginBottom:12,fontSize:14}}>💡 {t.recommendations}</h4>
            {result.suggestions.map((s, i) => <div key={i} style={{background:'rgba(99,102,241,0.05)',borderRadius:10,padding:'10px 14px',border:'1px solid rgba(99,102,241,0.15)',color:theme.subtext,fontSize:13,lineHeight:1.5,marginBottom:7}}>{s}</div>)}
          </div>
          <div style={card()}><h4 style={{color:theme.text,fontWeight:700,marginBottom:12,fontSize:14}}>📄 {t.allSkills}</h4>{result.resume_skills.map(s => <SkillBadge key={s} skill={s} type="neutral" dark={!isDark}/>)}</div>
        </>}

        {activeResultTab==='improver' && <div style={card({border:'1px solid rgba(99,102,241,0.3)'})}>
          <h4 style={{color:'#818cf8',fontWeight:700,marginBottom:4,fontSize:15}}>🎯 Job Match Improver</h4>
          <p style={{color:theme.subtext,fontSize:12,marginBottom:14}}>Follow these steps to increase your score!</p>
          <MatchImprover result={result} detectedRole={detectedRole} theme={theme}/>
        </div>}

        {activeResultTab==='roadmap' && <div style={card({border:'1px solid rgba(139,92,246,0.3)'})}>
          <h4 style={{color:'#8b5cf6',fontWeight:700,marginBottom:4,fontSize:15}}>⭐ Skill Learning Roadmap</h4>
          <p style={{color:theme.subtext,fontSize:12,marginBottom:14}}>Step-by-step plan for missing skills!</p>
          <SkillRoadmap missingSkills={result.missing_skills} theme={theme}/>
        </div>}

        {activeResultTab==='scorecard' && <div style={card({border:'1px solid rgba(99,102,241,0.3)'})}>
          <h4 style={{color:'#818cf8',fontWeight:700,marginBottom:4,fontSize:15}}>🏆 Animated Score Card</h4>
          <p style={{color:theme.subtext,fontSize:12,marginBottom:16}}>Glassdoor-style breakdown of your resume performance</p>
          <AnimatedScoreCard matchScore={result.match_score} resumeScore={resumeScore.score} atsScore={atsScore.score} t={t} isDark={isDark}/>
        </div>}

        {activeResultTab==='market' && <div style={card({border:'1px solid rgba(16,185,129,0.3)'})}>
          <h4 style={{color:'#10b981',fontWeight:700,marginBottom:4,fontSize:15}}>📈 Real-Time Job Market Trends</h4>
          <p style={{color:theme.subtext,fontSize:12,marginBottom:16}}>Market demand, trending skills & salary data for your role</p>
          <JobMarketTrends detectedRole={detectedRole} matchedSkills={result.matched_skills} missingSkills={result.missing_skills} theme={theme} isDark={isDark}/>
        </div>}

        {activeResultTab==='chat' && <div style={card({border:'1px solid rgba(99,102,241,0.3)'})}>
          <h4 style={{color:'#818cf8',fontWeight:700,marginBottom:4,fontSize:15}}>💬 AI Resume Chat Assistant</h4>
          <p style={{color:theme.subtext,fontSize:12,marginBottom:16}}>Ask me anything about your resume, scores, and how to improve!</p>
          <AIChatAssistant result={result} detectedRole={detectedRole} resumeScore={resumeScore} atsScore={atsScore} theme={theme} isDark={isDark}/>
        </div>}

        {activeResultTab==='skills chart' && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div style={card()}>
            <h4 style={{color:theme.text,fontWeight:700,marginBottom:14,fontSize:14}}>🍩 Skills Overview</h4>
            <div style={{display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap',alignItems:'center'}}>
              <svg width={140} height={140} style={{transform:'rotate(-90deg)'}}>
                <circle cx={70} cy={70} r={55} fill="none" stroke="#1e1e3a" strokeWidth={20}/>
                <circle cx={70} cy={70} r={55} fill="none" stroke="#10b981" strokeWidth={20} strokeDasharray={`${(result.matched_skills.length/(result.jd_skills.length||1))*345} 345`} style={{transition:'stroke-dasharray 1s ease'}}/>
                <circle cx={70} cy={70} r={55} fill="none" stroke="#ef4444" strokeWidth={20} strokeDasharray={`${(result.missing_skills.length/(result.jd_skills.length||1))*345} 345`} strokeDashoffset={-(result.matched_skills.length/(result.jd_skills.length||1))*345}/>
              </svg>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {[{l:'Matched',c:'#10b981',v:result.matched_skills.length},{l:'Missing',c:'#ef4444',v:result.missing_skills.length},{l:'Extra',c:'#6366f1',v:Math.max(0,result.resume_skills.length-result.matched_skills.length)}].map(item => (
                  <div key={item.l} style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:12,height:12,borderRadius:'50%',background:item.c}}/><span style={{fontSize:12,color:theme.subtext}}>{item.l}:</span><span style={{fontSize:13,fontWeight:700,color:item.c}}>{item.v}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div style={card()}>
            <h4 style={{color:theme.text,fontWeight:700,marginBottom:12,fontSize:14}}>📊 Score Summary</h4>
            {[{l:t.jobMatch,v:result.match_score},{l:t.resumeScore,v:resumeScore.score},{l:t.atsScore,v:atsScore.score}].map(item => (
              <div key={item.l} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:12,color:theme.subtext}}>{item.l}</span><span style={{fontSize:12,fontWeight:700,color:matchColor(item.v)}}>{item.v}%</span></div>
                <div style={{background:isDark?'#1e1e3a':'#e2e8f0',borderRadius:6,height:8,overflow:'hidden'}}><div style={{width:`${item.v}%`,height:'100%',background:matchColor(item.v),borderRadius:6,transition:'width 1s ease'}}/></div>
              </div>
            ))}
          </div>
        </div>}

        {activeResultTab==='resume tips' && <div style={card()}>
          <h4 style={{color:theme.text,fontWeight:700,marginBottom:14,fontSize:15}}>📝 {t.resumeTips}</h4>
          {resumeTips.map((tip, i) => <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'11px 14px',borderRadius:10,background:tip.type==='success'?'rgba(16,185,129,0.08)':tip.type==='warning'?'rgba(245,158,11,0.08)':'rgba(239,68,68,0.08)',border:`1px solid ${tip.type==='success'?'rgba(16,185,129,0.2)':tip.type==='warning'?'rgba(245,158,11,0.2)':'rgba(239,68,68,0.2)'}`,marginBottom:8}}>
            <span style={{fontSize:16,flexShrink:0}}>{tip.type==='success'?'✅':tip.type==='warning'?'⚠️':'❌'}</span>
            <p style={{fontSize:13,color:tip.type==='success'?'#10b981':tip.type==='warning'?'#f59e0b':'#ef4444',lineHeight:1.6,margin:0}}>{tip.tip}</p>
          </div>)}
        </div>}

        {activeResultTab==='ats & score' && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div style={card({border:'1px solid rgba(245,158,11,0.3)'})}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <h4 style={{color:'#f59e0b',fontWeight:700,fontSize:14}}>📈 {t.resumeScore}</h4>
              <span style={{fontSize:22,fontWeight:900,color:matchColor(resumeScore.score)}}>{resumeScore.score}/100</span>
            </div>
            <ProgressBar score={resumeScore.score} dark={!isDark}/><CheckList checks={resumeScore.checks} dark={!isDark}/>
          </div>
          <div style={card({border:'1px solid rgba(139,92,246,0.3)'})}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <h4 style={{color:'#8b5cf6',fontWeight:700,fontSize:14}}>🔍 {t.atsScore}</h4>
              <span style={{fontSize:22,fontWeight:900,color:matchColor(atsScore.score)}}>{atsScore.score}/100</span>
            </div>
            <ProgressBar score={atsScore.score} dark={!isDark}/><CheckList checks={atsScore.checks} dark={!isDark}/>
          </div>
        </div>}

        {activeResultTab==='strength' && <div style={card({border:'1px solid rgba(6,182,212,0.3)'})}>
          <h4 style={{color:'#06b6d4',fontWeight:700,marginBottom:16,fontSize:15,textAlign:'center'}}>⚡ {t.strengthMeter}</h4>
          <StrengthMeter resumeScore={resumeScore.score} atsScore={atsScore.score} matchScore={result.match_score} t={t}/>
        </div>}

        {activeResultTab==='salary' && <div style={card({border:'1px solid rgba(245,158,11,0.3)'})}>
          <h4 style={{color:'#f59e0b',fontWeight:700,marginBottom:4,fontSize:15}}>💰 {t.salaryEst}</h4>
          <p style={{color:theme.subtext,fontSize:12,marginBottom:16}}>Based on {detectedRole?.role} with {result.matched_skills.length} matched skills</p>
          <SalaryEstimator detectedRole={detectedRole} matchedSkills={result.matched_skills} t={t}/>
        </div>}

        {activeResultTab==='interview' && <div>
          <div style={{...card({border:'1px solid rgba(99,102,241,0.3)'}),marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{fontSize:38}}>{detectedRole?.icon||'🎤'}</div>
              <div><p style={{color:theme.subtext,fontSize:11,marginBottom:3}}>INTERVIEW PREP FOR</p><h3 style={{color:theme.text,fontWeight:800,fontSize:18}}>{detectedRole?.role||'Software Developer'}</h3></div>
            </div>
          </div>
          {interviewQuestions.map((q, i) => <InterviewCard key={i} question={q} index={i} theme={theme}/>)}
          <div style={card({border:'1px solid rgba(245,158,11,0.2)',marginTop:14})}>
            <h4 style={{color:'#f59e0b',fontWeight:700,marginBottom:10,fontSize:14}}>💡 {t.interviewTips}</h4>
            {['Research the company before the interview.','Use STAR method: Situation, Task, Action, Result.','Prepare 2-3 questions to ask the interviewer.','Practice coding on paper, not just on computer.','Be honest about what you do not know.'].map((tip, i) => (
              <div key={i} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:i<4?`1px solid ${theme.border}`:'none'}}>
                <span style={{color:'#f59e0b',fontWeight:700,flexShrink:0}}>{i+1}.</span>
                <p style={{fontSize:13,color:theme.subtext,margin:0,lineHeight:1.5}}>{tip}</p>
              </div>
            ))}
          </div>
        </div>}

        {activeResultTab==='resume builder' && <div style={card({border:'1px solid rgba(16,185,129,0.3)'})}>
          <h4 style={{color:'#10b981',fontWeight:700,marginBottom:4,fontSize:15}}>📋 {t.builderTitle}</h4>
          <ResumeBuilder resumeSkills={result.resume_skills} missingSkills={result.missing_skills} detectedRole={detectedRole} t={t}/>
        </div>}

        {activeResultTab==='email report' && <div style={card({border:'1px solid rgba(99,102,241,0.3)'})}>
          <h4 style={{color:theme.text,fontWeight:700,marginBottom:6,fontSize:15}}>📧 {t.emailReport}</h4>
          <p style={{color:theme.subtext,fontSize:13,marginBottom:16}}>Get your full analysis delivered to your inbox!</p>
          {!emailSent ? <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <input type="email" value={emailInput} onChange={e=>setEmailInput(e.target.value)} placeholder="Enter your email..." style={{flex:1,minWidth:240,padding:'12px 16px',borderRadius:10,border:`2px solid ${theme.inputBorder}`,background:theme.input,color:theme.text,fontSize:14,outline:'none',fontFamily:'inherit',transition:'border-color 0.2s'}} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor=theme.inputBorder}/>
            <button onClick={handleSendEmail} style={{padding:'12px 22px',borderRadius:10,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:14,fontWeight:700,fontFamily:'inherit'}}>📧 {t.sendReport}</button>
          </div> : <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:12,padding:16,textAlign:'center'}}>
            <div style={{fontSize:30,marginBottom:8}}>✅</div>
            <p style={{color:'#10b981',fontWeight:700,fontSize:14}}>{t.emailSent}</p>
            <p style={{color:theme.subtext,fontSize:12,marginTop:4}}>Email app opened + report copied to clipboard!</p>
            <button onClick={() => setEmailSent(false)} style={{marginTop:10,padding:'7px 18px',borderRadius:20,border:'1px solid #10b981',cursor:'pointer',background:'transparent',color:'#10b981',fontSize:12,fontFamily:'inherit'}}>Send to Another</button>
          </div>}
        </div>}

        <div style={{textAlign:'center',display:'flex',gap:10,justifyContent:'center',marginTop:4}}>
          <button onClick={handleReset} style={{padding:'11px 28px',borderRadius:50,border:'2px solid #6366f1',cursor:'pointer',background:'transparent',color:'#818cf8',fontSize:13,fontWeight:700,fontFamily:'inherit'}} onMouseOver={e=>{e.target.style.background='#6366f1';e.target.style.color='white'}} onMouseOut={e=>{e.target.style.background='transparent';e.target.style.color='#818cf8'}}>🔄 {t.reset}</button>
          <button onClick={handleExportPDF} style={{padding:'11px 28px',borderRadius:50,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#10b981,#059669)',color:'white',fontSize:13,fontWeight:700,fontFamily:'inherit'}}>📥 {t.exportPdf}</button>
        </div>
      </div>}
    </main>
    <footer style={{textAlign:'center',padding:'24px 20px',color:theme.subtext,fontSize:12}}>Built with ❤️ using React + FastAPI + NLP | {t.appName}</footer>
  </div>
}
