import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import BottomNav from '../../components/common/BottomNav';
import AccountMenu from '../../components/common/AccountMenu';
import api from '../../services/api';
import './Account.css';

const COUNTRIES = [
  'Nigeria','United States','United Kingdom','Canada','Australia','Germany',
  'France','Ghana','Kenya','South Africa','UAE','Singapore','India','Brazil',
  'Poland','Italy','Spain','Netherlands','Sweden','Norway','Other',
];

const ID_TYPES = [
  { value:'passport',       label:'International Passport'   },
  { value:'national_id',    label:'National ID Card'         },
  { value:'drivers_license',label:"Driver's License"         },
  { value:'voters_card',    label:'Voter\'s Card'            },
  { value:'residence_permit',label:'Residence Permit'        },
];

const StatusBadge = ({ status }) => {
  const map = {
    not_submitted: { label:'Not Submitted', color:'var(--grey-dark)',  bg:'rgba(255,255,255,0.05)' },
    pending:       { label:'Pending Review', color:'var(--gold)',       bg:'rgba(255,184,0,0.1)'   },
    approved:      { label:'Verified',       color:'var(--green)',      bg:'rgba(0,230,118,0.1)'   },
    rejected:      { label:'Rejected',       color:'var(--red)',        bg:'rgba(255,61,87,0.1)'   },
  };
  const s = map[status] || map.not_submitted;
  return (
    <span style={{
      padding:'4px 12px', borderRadius:20,
      fontSize:'0.75rem', fontWeight:700,
      color: s.color, background: s.bg,
      display:'inline-flex', alignItems:'center', gap:6,
    }}>
      <span style={{width:7,height:7,borderRadius:'50%',background:s.color,display:'inline-block'}}/>
      {s.label}
    </span>
  );
};

export default function KYCPage() {
  const [form, setForm] = useState({
    first_name:'', last_name:'', date_of_birth:'', nationality:'',
    country_of_residence:'', address:'', city:'', postal_code:'',
    id_type:'passport', id_number:'',
  });
  const [file,       setFile]       = useState(null);
  const [kycStatus,  setKycStatus]  = useState('not_submitted');
  const [msg,        setMsg]        = useState({ text:'', type:'' });
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    api.get('/account/kyc').then(({ data }) => {
      if (data) {
        setKycStatus(data.status || 'not_submitted');
        if (data.form_data) setForm(JSON.parse(data.form_data));
      }
    }).catch(() => {});
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 200 * 1024) {
      setMsg({ text:'File must be under 200KB. Please compress your image.', type:'error' });
      e.target.value = '';
      return;
    }
    setMsg({ text:'', type:'' });
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && kycStatus === 'not_submitted')
      return setMsg({ text:'Please upload a government ID document.', type:'error' });
    setSubmitting(true);
    setMsg({ text:'', type:'' });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (file) fd.append('id_document', file);
      await api.post('/account/kyc', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMsg({ text:'KYC submitted successfully. We\'ll review within 24–48 hours.', type:'success' });
      setKycStatus('pending');
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Submission failed. Please try again.', type:'error' });
    } finally { setSubmitting(false); }
  };

  const fc = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const isLocked = kycStatus === 'approved' || kycStatus === 'pending';

  return (
    <div className="app-layout">
      <Sidebar />
      <AccountMenu />
      <main className="app-main acct-main">
        <div className="acct-page-header">
          <Link to="/dashboard" className="acct-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <div>
              <h1>KYC Verification</h1>
              <p>Verify your identity to unlock full account features</p>
            </div>
            <StatusBadge status={kycStatus} />
          </div>
        </div>

        {/* Info banner */}
        <div className="kyc-info-banner">
          <div className="kyc-banner-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div className="kyc-banner-title">Why we need this</div>
            <div className="kyc-banner-text">
              KYC verification is required by financial regulations to prevent fraud and protect your account.
              Your data is encrypted and stored securely. Government ID must be under 200KB.
            </div>
          </div>
        </div>

        {msg.text && <div className={`acct-alert ${msg.type}`} style={{marginBottom:24}}>{msg.text}</div>}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="acct-section">
            <h3 className="acct-section-title">Personal Information</h3>
            <div className="acct-form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" value={form.first_name} onChange={fc('first_name')} disabled={isLocked} required placeholder="As on ID"/>
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" value={form.last_name} onChange={fc('last_name')} disabled={isLocked} required placeholder="As on ID"/>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={form.date_of_birth} onChange={fc('date_of_birth')} disabled={isLocked} required/>
              </div>
              <div className="form-group">
                <label>Nationality</label>
                <select value={form.nationality} onChange={fc('nationality')} disabled={isLocked} required>
                  <option value="">Select nationality</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="acct-section">
            <h3 className="acct-section-title">Residential Address</h3>
            <div className="acct-form-grid">
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Street Address</label>
                <input type="text" value={form.address} onChange={fc('address')} disabled={isLocked} required placeholder="123 Main Street"/>
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={form.city} onChange={fc('city')} disabled={isLocked} required placeholder="City"/>
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" value={form.postal_code} onChange={fc('postal_code')} disabled={isLocked} placeholder="Postal / ZIP code"/>
              </div>
              <div className="form-group">
                <label>Country of Residence</label>
                <select value={form.country_of_residence} onChange={fc('country_of_residence')} disabled={isLocked} required>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ID Document */}
          <div className="acct-section">
            <h3 className="acct-section-title">Identity Document</h3>
            <div className="acct-form-grid">
              <div className="form-group">
                <label>ID Type</label>
                <select value={form.id_type} onChange={fc('id_type')} disabled={isLocked} required>
                  {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>ID Number</label>
                <input type="text" value={form.id_number} onChange={fc('id_number')} disabled={isLocked} required placeholder="Document number"/>
              </div>
              {/* File upload */}
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Upload ID Document</label>
                <div
                  className={`kyc-upload-area ${isLocked ? 'locked' : ''} ${file ? 'has-file' : ''}`}
                  onClick={() => !isLocked && fileRef.current?.click()}
                >
                  {file ? (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      <div className="kyc-upload-text">
                        <span className="kyc-upload-name">{file.name}</span>
                        <span className="kyc-upload-size">{(file.size/1024).toFixed(1)} KB</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <div className="kyc-upload-text">
                        <span className="kyc-upload-label">Click to upload document</span>
                        <span className="kyc-upload-hint">JPG, PNG, or PDF — max 200KB</span>
                      </div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*,.pdf" style={{display:'none'}} onChange={handleFile}/>
                <span className="field-hint" style={{marginTop:6,display:'block'}}>
                  Make sure the document is clear, unobstructed, and all text is readable.
                </span>
              </div>
            </div>
          </div>

          {!isLocked && (
            <div style={{display:'flex',justifyContent:'flex-end',paddingBottom:8}}>
              <button type="submit" className="btn-primary acct-save-btn" disabled={submitting}>
                {submitting
                  ? <><span className="spinner-ring" style={{width:16,height:16}}/> Submitting…</>
                  : 'Submit KYC Application'
                }
              </button>
            </div>
          )}

          {kycStatus === 'pending' && (
            <div className="kyc-pending-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              Your KYC is under review. We'll notify you within 24–48 hours.
            </div>
          )}
        </form>
      </main>
      <BottomNav />
    </div>
  );
}
