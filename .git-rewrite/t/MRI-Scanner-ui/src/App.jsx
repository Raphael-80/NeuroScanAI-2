import { useState, useRef, useCallback } from "react";

const STAGES = ["Non-Demented", "Very Mild Dementia", "Mild Dementia", "Moderate Dementia"];

const STAGE_META = {
  "Non-Demented":      { color: "#2DB37A", bg: "#F0FBF6", label: "No Dementia Detected" },
  "Very Mild Dementia":{ color: "#F5A623", bg: "#FFFBF0", label: "Very Mild Stage" },
  "Mild Dementia":     { color: "#E07A3B", bg: "#FFF7F0", label: "Mild Stage" },
  "Moderate Dementia": { color: "#D94F4F", bg: "#FFF0F0", label: "Moderate Stage" },
};

function GoogleFont() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body, #root { font-family: 'DM Sans', sans-serif; background: #F4F6FA; color: #1C2333; min-height: 100vh; }
      .serif { font-family: 'DM Serif Display', serif; }
      .drop-zone { border: 2px dashed #C5CCDB; border-radius: 16px; transition: border-color .2s, background .2s; }
      .drop-zone.active { border-color: #3A7BD5; background: #EFF4FD; }
      @keyframes barGrow { from { width: 0 } to { width: var(--w) } }
      .bar-fill { animation: barGrow 0.8s cubic-bezier(.4,0,.2,1) forwards; }
      @keyframes scanPulse { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.08)} }
      .scan-line { animation: scanPulse 1.4s ease-in-out infinite; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      .fade-up { animation: fadeUp .5s ease forwards; }
      .nav-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; cursor:pointer; font-size:14px; font-weight:500; color:#5A6380; transition:all .15s; }
      .nav-item:hover, .nav-item.active { background:#EFF4FD; color:#3A7BD5; }
      .nav-item.active { font-weight:600; }
      .btn-primary { background:#3A7BD5; color:#fff; border:none; border-radius:10px; padding:11px 22px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:background .15s,transform .1s; display:inline-flex; align-items:center; gap:8px; }
      .btn-primary:hover { background:#2F65B8; }
      .btn-primary:active { transform:scale(.97); }
      .btn-primary:disabled { background:#A0B4D6; cursor:not-allowed; }
      .btn-ghost { background:transparent; color:#5A6380; border:1.5px solid #D1D8E8; border-radius:10px; padding:10px 20px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all .15s; display:inline-flex; align-items:center; gap:8px; }
      .btn-ghost:hover { border-color:#3A7BD5; color:#3A7BD5; }
      .card { background:#fff; border-radius:16px; border:1px solid #E5EAF4; }
      .login-input { width:100%; border:1.5px solid #D1D8E8; border-radius:10px; padding:12px 16px; font-family:'DM Sans',sans-serif; font-size:15px; outline:none; transition:border-color .15s; }
      .login-input:focus { border-color:#3A7BD5; }
      .badge { display:inline-flex; align-items:center; gap:6px; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:600; letter-spacing:.04em; }
      .settings-input { width:100%; border:1.5px solid #D1D8E8; border-radius:10px; padding:12px 16px; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border-color .15s; }
      .settings-input:focus { border-color:#3A7BD5; }
      .history-row { display:flex; align-items:center; gap:16px; padding:16px; border-radius:12px; border:1px solid #E5EAF4; background:#fff; margin-bottom:12px; transition:box-shadow .15s; }
      .history-row:hover { box-shadow:0 2px 12px rgba(0,0,0,.06); }
      @media print {
        .no-print { display:none !important; }
        body { background:#fff; }
      }
    `}</style>
  );
}

function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr]   = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === "doctor" && pass === "1234") { onLogin(); }
    else { setErr("Invalid credentials. Try doctor / 1234"); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F4F6FA" }}>
      <div style={{ width:420 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="#3A7BD5"/>
              <path d="M12 20h4l3-8 4 16 3-8h4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="serif" style={{ fontSize:22, color:"#1C2333" }}>NeuroScan AI</span>
          </div>
          <p style={{ fontSize:14, color:"#7A8299" }}>Automated Alzheimer's Stage Classification</p>
        </div>

        <div className="card" style={{ padding:36 }}>
          <h2 className="serif" style={{ fontSize:22, marginBottom:6 }}>Medical Personnel Login</h2>
          <p style={{ fontSize:13, color:"#7A8299", marginBottom:28 }}>Access restricted to authorised clinical staff.</p>

          <form onSubmit={handleSubmit}>
            <label style={{ fontSize:13, fontWeight:600, color:"#3A4260", display:"block", marginBottom:6 }}>Username</label>
            <input className="login-input" placeholder="e.g. doctor" value={user} onChange={e=>setUser(e.target.value)} style={{ marginBottom:18 }}/>
            <label style={{ fontSize:13, fontWeight:600, color:"#3A4260", display:"block", marginBottom:6 }}>Password</label>
            <input className="login-input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} style={{ marginBottom:8 }}/>
            {err && <p style={{ fontSize:13, color:"#D94F4F", marginBottom:16 }}>{err}</p>}
            {!err && <div style={{ marginBottom:24 }}/>}
            <button type="submit" className="btn-primary" style={{ width:"100%", justifyContent:"center" }}>
              Sign In to Dashboard
            </button>
          </form>

          <p style={{ textAlign:"center", fontSize:12, color:"#A0A8BE", marginTop:20 }}>
            Demo: <strong>doctor</strong> / <strong>1234</strong>
          </p>
        </div>

        <p style={{ textAlign:"center", fontSize:12, color:"#A0A8BE", marginTop:24 }}>
          B.Sc. Thesis · Computer Science · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handle = (file) => {
    if (!file) return;
    if (!["image/jpeg","image/png","image/jpg"].includes(file.type)) {
      alert("Please upload a .jpg or .png MRI image."); return;
    }
    onFile(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handle(e.dataTransfer.files[0]);
  }, []);

  return (
    <div
      className={`drop-zone ${dragging ? "active" : ""}`}
      style={{ padding:48, textAlign:"center", cursor:"pointer" }}
      onDragOver={e=>{ e.preventDefault(); setDragging(true); }}
      onDragLeave={()=>setDragging(false)}
      onDrop={onDrop}
      onClick={()=>inputRef.current.click()}
    >
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" style={{ display:"none" }}
        onChange={e=>handle(e.target.files[0])}/>
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ margin:"0 auto 18px" }}>
        <rect width="52" height="52" rx="14" fill="#EFF4FD"/>
        <path d="M26 34V22M26 22l-5 5M26 22l5 5" stroke="#3A7BD5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="14" y="36" width="24" height="2.5" rx="1.25" fill="#3A7BD5" opacity=".35"/>
      </svg>
      <p style={{ fontSize:16, fontWeight:600, color:"#1C2333", marginBottom:6 }}>
        {dragging ? "Drop MRI scan here" : "Drag & Drop MRI Scan"}
      </p>
      <p style={{ fontSize:13, color:"#7A8299", marginBottom:18 }}>
        Accepts .JPG or .PNG format · 2D axial brain slices recommended
      </p>
      <button className="btn-primary" onClick={e=>{ e.stopPropagation(); inputRef.current.click(); }}>
        Browse Files
      </button>
    </div>
  );
}

function ScannerOverlay({ preview }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ position:"relative", display:"inline-block", borderRadius:14, overflow:"hidden", marginBottom:28 }}>
        <img src={preview} alt="MRI scan" style={{ width:260, height:260, objectFit:"cover", display:"block", filter:"brightness(.85) contrast(1.1)" }}/>
        <div className="scan-line" style={{
          position:"absolute", left:0, right:0, top:"40%", height:3,
          background:"linear-gradient(90deg,transparent,#3A7BD5,transparent)",
          boxShadow:"0 0 12px #3A7BD5"
        }}/>
        <div style={{ position:"absolute", inset:0, background:"rgba(58,123,213,.06)" }}/>
      </div>
      <p className="serif" style={{ fontSize:20, marginBottom:8, color:"#1C2333" }}>Analysing MRI Scan...</p>
      <p style={{ fontSize:13, color:"#7A8299", maxWidth:320, margin:"0 auto 24px" }}>
        The VGG-16 model is classifying the Alzheimer's stage. This typically takes 2-5 seconds.
      </p>
      <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            width:9, height:9, borderRadius:"50%", background:"#3A7BD5",
            animation:`scanPulse 1.2s ${i*0.2}s ease-in-out infinite`
          }}/>
        ))}
      </div>
    </div>
  );
}

function ProbBar({ label, value, highlight }) {
  const meta = STAGE_META[label];
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:13, fontWeight: highlight ? 600 : 400, color: highlight ? meta.color : "#5A6380" }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:600, color: highlight ? meta.color : "#7A8299" }}>{value.toFixed(1)}%</span>
      </div>
      <div style={{ height:8, background:"#EEF0F6", borderRadius:99, overflow:"hidden" }}>
        <div className="bar-fill" style={{ "--w":`${value}%`, height:"100%", borderRadius:99, background: highlight ? meta.color : "#C5CCDB" }}/>
      </div>
    </div>
  );
}

function ResultsPanel({ result, preview, onReset }) {
  const meta = STAGE_META[result.prediction] || STAGE_META["Non-Demented"];
  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:".1em", color:"#A0A8BE", textTransform:"uppercase", marginBottom:4 }}>Diagnostic Result</p>
          <h2 className="serif" style={{ fontSize:26, color:"#1C2333" }}>AI Classification Complete</h2>
        </div>
        <div style={{ display:"flex", gap:10 }} className="no-print">
          <button className="btn-ghost" onClick={()=>window.print()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Download Report
          </button>
          <button className="btn-primary" onClick={onReset}>New Scan</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div>
          <div className="card" style={{ overflow:"hidden", marginBottom:20 }}>
            <img src={preview} alt="Uploaded MRI" style={{ width:"100%", height:220, objectFit:"cover", display:"block", filter:"brightness(.88) contrast(1.12)" }}/>
            <div style={{ padding:"14px 18px", borderTop:"1px solid #E5EAF4" }}>
              <p style={{ fontSize:12, color:"#A0A8BE", fontWeight:600, textTransform:"uppercase", letterSpacing:".08em" }}>Submitted MRI Slice</p>
            </div>
          </div>
          <div className="card" style={{ padding:24, background: meta.bg, borderColor: meta.color+"44" }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color: meta.color, textTransform:"uppercase", marginBottom:8 }}>Predicted Stage</p>
            <p className="serif" style={{ fontSize:28, color:"#1C2333", marginBottom:4 }}>{result.prediction}</p>
            <p style={{ fontSize:13, color:"#5A6380", marginBottom:20 }}>{meta.label}</p>
            <div style={{ display:"flex", gap:14 }}>
              <div style={{ flex:1, background:"#fff", borderRadius:10, padding:"12px 16px", border:`1px solid ${meta.color}33` }}>
                <p style={{ fontSize:11, fontWeight:700, color:meta.color, letterSpacing:".08em", textTransform:"uppercase", marginBottom:4 }}>Confidence</p>
                <p className="serif" style={{ fontSize:28, color:"#1C2333" }}>{result.confidence.toFixed(1)}<span style={{ fontSize:16 }}>%</span></p>
              </div>
              <div style={{ flex:1, background:"#fff", borderRadius:10, padding:"12px 16px", border:"1px solid #E5EAF4" }}>
                <p style={{ fontSize:11, fontWeight:700, color:"#A0A8BE", letterSpacing:".08em", textTransform:"uppercase", marginBottom:4 }}>Model</p>
                <p style={{ fontSize:15, fontWeight:600, color:"#1C2333" }}>VGG-16</p>
                <p style={{ fontSize:12, color:"#A0A8BE" }}>Transfer Learning</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{ padding:28, marginBottom:20 }}>
            <p style={{ fontSize:13, fontWeight:700, color:"#1C2333", marginBottom:20 }}>Class Probability Distribution</p>
            {STAGES.map(stage => (
              <ProbBar key={stage} label={stage} value={result.probabilities[stage] || 0} highlight={stage === result.prediction}/>
            ))}
          </div>
          <div className="card" style={{ padding:20, background:"#FFFBF0", borderColor:"#F5A62355" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p style={{ fontSize:12, color:"#7A6030", lineHeight:1.65 }}>
                <strong>Clinical Disclaimer:</strong> This AI output is intended as a diagnostic aid only and does not replace professional medical judgement. All results must be reviewed by a qualified neurologist before clinical action is taken.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -- History Page
function HistoryPage({ history }) {
  if (history.length === 0) {
    return (
      <div className="fade-up">
        <p style={{ fontSize:12, fontWeight:600, letterSpacing:".1em", color:"#A0A8BE", textTransform:"uppercase", marginBottom:4 }}>Scan History</p>
        <h1 className="serif" style={{ fontSize:30, color:"#1C2333", marginBottom:32 }}>Previous Scans</h1>
        <div className="card" style={{ padding:60, textAlign:"center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C5CCDB" strokeWidth="1.5" style={{ margin:"0 auto 16px", display:"block" }}>
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p style={{ fontSize:15, fontWeight:600, color:"#5A6380", marginBottom:6 }}>No scans yet</p>
          <p style={{ fontSize:13, color:"#A0A8BE" }}>Scans you run will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <p style={{ fontSize:12, fontWeight:600, letterSpacing:".1em", color:"#A0A8BE", textTransform:"uppercase", marginBottom:4 }}>Scan History</p>
      <h1 className="serif" style={{ fontSize:30, color:"#1C2333", marginBottom:32 }}>Previous Scans</h1>

      {/* Table header */}
      <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 1fr 1fr 1fr", gap:12, padding:"0 16px 10px", fontSize:11, fontWeight:700, color:"#A0A8BE", textTransform:"uppercase", letterSpacing:".08em" }}>
        <span>Image</span>
        <span>Filename</span>
        <span>Prediction</span>
        <span>Confidence</span>
        <span>Time</span>
      </div>

      {history.map((item, i) => {
        const meta = STAGE_META[item.prediction] || STAGE_META["Non-Demented"];
        return (
          <div key={i} className="history-row" style={{ display:"grid", gridTemplateColumns:"60px 1fr 1fr 1fr 1fr", gap:12, alignItems:"center" }}>
            <img src={item.preview} alt="MRI" style={{ width:52, height:52, borderRadius:8, objectFit:"cover", filter:"brightness(.88) contrast(1.1)" }}/>
            <p style={{ fontSize:13, color:"#1C2333", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.filename}</p>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:meta.color }}/>
              <span style={{ fontSize:13, fontWeight:600, color:meta.color }}>{item.prediction}</span>
            </div>
            <span style={{ fontSize:13, fontWeight:600, color:"#1C2333" }}>{item.confidence.toFixed(1)}%</span>
            <span style={{ fontSize:12, color:"#A0A8BE" }}>{item.time}</span>
          </div>
        );
      })}
    </div>
  );
}

// -- Reports Page
function ReportsPage({ history }) {
  const total = history.length;

  const stageCounts = STAGES.reduce((acc, s) => {
    acc[s] = history.filter(h => h.prediction === s).length;
    return acc;
  }, {});

  const avgConfidence = total > 0
    ? (history.reduce((sum, h) => sum + h.confidence, 0) / total).toFixed(1)
    : 0;

  const mostCommon = total > 0
    ? STAGES.reduce((a, b) => stageCounts[a] >= stageCounts[b] ? a : b)
    : "N/A";

  return (
    <div className="fade-up">
      <p style={{ fontSize:12, fontWeight:600, letterSpacing:".1em", color:"#A0A8BE", textTransform:"uppercase", marginBottom:4 }}>Analytics</p>
      <h1 className="serif" style={{ fontSize:30, color:"#1C2333", marginBottom:32 }}>Session Reports</h1>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20, marginBottom:28 }}>
        {[
          { label:"Total Scans", value: total, sub:"This session" },
          { label:"Avg Confidence", value: total > 0 ? `${avgConfidence}%` : "—", sub:"Across all scans" },
          { label:"Most Common", value: total > 0 ? mostCommon : "—", sub:"Predicted stage", small: true },
        ].map(({ label, value, sub, small }) => (
          <div key={label} className="card" style={{ padding:24 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#A0A8BE", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>{label}</p>
            <p className="serif" style={{ fontSize: small ? 20 : 32, color:"#1C2333", marginBottom:4 }}>{value}</p>
            <p style={{ fontSize:12, color:"#A0A8BE" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Stage breakdown */}
      <div className="card" style={{ padding:28 }}>
        <p style={{ fontSize:13, fontWeight:700, color:"#1C2333", marginBottom:20 }}>Prediction Breakdown by Stage</p>
        {total === 0 ? (
          <p style={{ fontSize:13, color:"#A0A8BE", textAlign:"center", padding:"20px 0" }}>No data yet. Run some scans first.</p>
        ) : (
          STAGES.map(stage => {
            const meta  = STAGE_META[stage];
            const count = stageCounts[stage];
            const pct   = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={stage} style={{ marginBottom:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:9, height:9, borderRadius:"50%", background:meta.color }}/>
                    <span style={{ fontSize:13, fontWeight:500, color:"#1C2333" }}>{stage}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:meta.color }}>{count} scan{count !== 1 ? "s" : ""} ({pct.toFixed(0)}%)</span>
                </div>
                <div style={{ height:10, background:"#EEF0F6", borderRadius:99, overflow:"hidden" }}>
                  <div className="bar-fill" style={{ "--w":`${pct}%`, height:"100%", borderRadius:99, background:meta.color }}/>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// -- Settings Page
function SettingsPage({ settings, onSave }) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="fade-up">
      <p style={{ fontSize:12, fontWeight:600, letterSpacing:".1em", color:"#A0A8BE", textTransform:"uppercase", marginBottom:4 }}>Preferences</p>
      <h1 className="serif" style={{ fontSize:30, color:"#1C2333", marginBottom:32 }}>Settings</h1>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        {/* Profile */}
        <div className="card" style={{ padding:28 }}>
          <p style={{ fontSize:14, fontWeight:700, color:"#1C2333", marginBottom:20 }}>Profile Information</p>

          {[
            { label:"Doctor Name", key:"doctorName", placeholder:"e.g. Dr. John Smith" },
            { label:"Hospital / Institution", key:"hospital", placeholder:"e.g. Lagos University Hospital" },
            { label:"Department", key:"department", placeholder:"e.g. Neurology" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} style={{ marginBottom:18 }}>
              <label style={{ fontSize:13, fontWeight:600, color:"#3A4260", display:"block", marginBottom:6 }}>{label}</label>
              <input
                className="settings-input"
                placeholder={placeholder}
                value={form[key] || ""}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* App settings */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div className="card" style={{ padding:28 }}>
            <p style={{ fontSize:14, fontWeight:700, color:"#1C2333", marginBottom:20 }}>Application Settings</p>

            {[
              { label:"Model Version", value:"VGG-16 Transfer Learning" },
              { label:"Accuracy", value:"83.53%" },
              { label:"Input Size", value:"224 × 224 px" },
              { label:"Classes", value:"4 Alzheimer's Stages" },
              { label:"Framework", value:"TensorFlow Lite" },
            ].map(([k, v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:12, paddingBottom:12, borderBottom:"1px solid #F0F2F8" }}>
                <span style={{ color:"#7A8299" }}>{k}</span>
                <span style={{ fontWeight:600, color:"#1C2333" }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding:28 }}>
            <p style={{ fontSize:14, fontWeight:700, color:"#1C2333", marginBottom:6 }}>About</p>
            <p style={{ fontSize:13, color:"#7A8299", lineHeight:1.7 }}>
              NeuroScan AI is a B.Sc. final year project developed at Redeemer's University. It uses deep learning to classify Alzheimer's disease stages from 2D MRI brain scans.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop:24, display:"flex", alignItems:"center", gap:14 }}>
        <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        {saved && <p style={{ fontSize:13, color:"#2DB37A", fontWeight:600 }}>Changes saved!</p>}
      </div>
    </div>
  );
}

function Sidebar({ activePage, onNavigate, onLogout, doctorName }) {
  const nav = [
    { icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", label:"Dashboard" },
    { icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label:"History" },
    { icon:"M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z", label:"Reports" },
    { icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", label:"Settings" },
  ];

  return (
    <div style={{ width:220, background:"#fff", borderRight:"1px solid #E5EAF4", minHeight:"100vh", display:"flex", flexDirection:"column", padding:"24px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"4px 6px", marginBottom:36 }}>
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#3A7BD5"/>
          <path d="M12 20h4l3-8 4 16 3-8h4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="serif" style={{ fontSize:17, color:"#1C2333" }}>NeuroScan AI</span>
      </div>

      <nav style={{ flex:1 }}>
        {nav.map(item=>(
          <div key={item.label} className={`nav-item ${activePage===item.label?"active":""}`} onClick={()=>onNavigate(item.label)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={item.icon}/></svg>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ borderTop:"1px solid #E5EAF4", paddingTop:16, marginTop:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 6px", marginBottom:4 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:"#EFF4FD", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A7BD5" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:"#1C2333" }}>{doctorName || "Dr. User"}</p>
            <p style={{ fontSize:11, color:"#A0A8BE" }}>Neurologist</p>
          </div>
        </div>
        <button className="nav-item" style={{ width:"100%", border:"none", background:"none", fontFamily:"inherit" }} onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [status,    setStatus]    = useState("idle");
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState(null);
  const [history,   setHistory]   = useState([]);
  const [settings,  setSettings]  = useState({ doctorName:"Dr. User", hospital:"", department:"" });

  const handleFile = (f) => {
    setFile(f); setPreview(URL.createObjectURL(f));
    setStatus("idle"); setResult(null); setError(null);
  };

  const handleAnalyse = async () => {
    if (!file) return;
    setStatus("scanning"); setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("http://localhost:5000/api/predict", { method:"POST", body:fd });
      const data = await res.json();
      setResult(data);
      setStatus("done");

      // Save to history
      setHistory(prev => [{
        preview,
        filename: file.name,
        prediction: data.prediction,
        confidence: data.confidence,
        time: new Date().toLocaleTimeString(),
      }, ...prev]);

    } catch(e) {
      setError("Could not connect to backend. Make sure Flask is running.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null); setPreview(null); setStatus("idle"); setResult(null); setError(null);
  };

  const statusLabel = {
    done: "Analysis Complete", scanning: "Scanning...", error: "Error", idle: "Awaiting Scan"
  };
  const statusColor = {
    done: { bg:"#F0FBF6", color:"#2DB37A" },
    scanning: { bg:"#EFF4FD", color:"#3A7BD5" },
    error: { bg:"#FFF0F0", color:"#D94F4F" },
    idle: { bg:"#F4F6FA", color:"#7A8299" },
  };

  if (!loggedIn) return <><GoogleFont/><LoginScreen onLogin={()=>setLoggedIn(true)}/></>;

  return (
    <>
      <GoogleFont/>
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={()=>setLoggedIn(false)}
          doctorName={settings.doctorName}
        />

        <main style={{ flex:1, padding:"36px 40px", overflowY:"auto" }}>

          {/* History Page */}
          {activePage === "History" && <HistoryPage history={history}/>}

          {/* Reports Page */}
          {activePage === "Reports" && <ReportsPage history={history}/>}

          {/* Settings Page */}
          {activePage === "Settings" && <SettingsPage settings={settings} onSave={setSettings}/>}

          {/* Dashboard */}
          {activePage === "Dashboard" && (
            <>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:600, letterSpacing:".1em", color:"#A0A8BE", textTransform:"uppercase", marginBottom:4 }}>Diagnostic Workspace</p>
                  <h1 className="serif" style={{ fontSize:30, color:"#1C2333" }}>MRI Analysis Dashboard</h1>
                </div>
                <div className="badge" style={{ background: statusColor[status].bg, color: statusColor[status].color }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:"currentColor" }}/>
                  {statusLabel[status]}
                </div>
              </div>

              {status === "error" && error && (
                <div style={{ marginBottom:24, padding:"14px 20px", background:"#FFF0F0", border:"1px solid #D94F4F44", borderRadius:12 }}>
                  <p style={{ fontSize:13, color:"#D94F4F" }}>{error}</p>
                  <button className="btn-ghost" style={{ marginTop:10 }} onClick={handleReset}>Try Again</button>
                </div>
              )}

              {status === "done" && result ? (
                <ResultsPanel result={result} preview={preview} onReset={handleReset}/>
              ) : status === "scanning" ? (
                <div className="card" style={{ padding:56, textAlign:"center" }}>
                  <ScannerOverlay preview={preview}/>
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:24, alignItems:"start" }}>
                  <div className="card" style={{ padding:28 }}>
                    <p style={{ fontSize:15, fontWeight:700, color:"#1C2333", marginBottom:4 }}>Upload MRI Scan</p>
                    <p style={{ fontSize:13, color:"#7A8299", marginBottom:22 }}>
                      Submit a 2D axial brain MRI slice for automated Alzheimer's stage classification.
                    </p>
                    {!file ? (
                      <UploadZone onFile={handleFile}/>
                    ) : (
                      <div style={{ textAlign:"center" }}>
                        <img src={preview} alt="Preview" style={{ width:"100%", maxHeight:240, objectFit:"cover", borderRadius:12, marginBottom:18, filter:"brightness(.88) contrast(1.1)" }}/>
                        <p style={{ fontSize:13, color:"#5A6380", marginBottom:20 }}>
                          <strong>{file.name}</strong> · {(file.size/1024).toFixed(1)} KB
                        </p>
                        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                          <button className="btn-ghost" onClick={handleReset}>Remove</button>
                          <button className="btn-primary" onClick={handleAnalyse}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            Run AI Analysis
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    <div className="card" style={{ padding:24 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:"#1C2333", marginBottom:16 }}>Classification Stages</p>
                      {STAGES.map(s => {
                        const m = STAGE_META[s];
                        return (
                          <div key={s} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                            <div style={{ width:10, height:10, borderRadius:"50%", background:m.color, flexShrink:0 }}/>
                            <div>
                              <p style={{ fontSize:13, fontWeight:600, color:"#1C2333" }}>{s}</p>
                              <p style={{ fontSize:11, color:"#A0A8BE" }}>{m.label}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="card" style={{ padding:24 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:"#1C2333", marginBottom:14 }}>Model Details</p>
                      {[
                        ["Architecture", "VGG-16 (Transfer Learning)"],
                        ["Input", "2D MRI Slices (256 × 256)"],
                        ["Classes", "4 Alzheimer's Stages"],
                        ["Accuracy", "90.12%"],
                        ["Backend", "Python Flask REST API"],
                      ].map(([k,v])=>(
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:10 }}>
                          <span style={{ color:"#7A8299" }}>{k}</span>
                          <span style={{ fontWeight:600, color:"#1C2333" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}