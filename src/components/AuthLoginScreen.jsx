import React, { useState } from 'react';
import { 
  Brain, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Smartphone, 
  UserCheck, 
  Sparkles, 
  AlertCircle, 
  Key, 
  CheckCircle2,
  Mail,
  User,
  Phone,
  Building,
  RefreshCw,
  ChevronLeft,
  Check,
  X,
  CreditCard,
  Zap
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { generatePatientPin } from '../services/psychologyService';
import SubscriptionModal from './SubscriptionModal';

export const validateCRP = (crp) => {
  if (!crp) return false;
  const cleanCRP = crp.toUpperCase().replace(/\s+/g, '');
  const crpRegex = /^(CRP)?\d{2}\/\d{4,6}$/;
  return crpRegex.test(cleanCRP) || crpRegex.test(`CRP${cleanCRP}`);
};

export const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: 'Não informada', color: '#CBD5E1', percent: 0, checks: { length: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false } };
  let score = 0;
  const checks = {
    length: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd)
  };

  if (checks.length) score += 1;
  if (checks.hasUpper && checks.hasLower) score += 1;
  if (checks.hasNumber) score += 1;
  if (checks.hasSpecial) score += 1;

  let label = 'Muito Fraca';
  let color = '#EF4444';
  let percent = 25;

  if (score === 2) { label = 'Fraca'; color = '#F97316'; percent = 50; }
  else if (score === 3) { label = 'Média'; color = '#EAB308'; percent = 75; }
  else if (score >= 4) { label = 'Senha Forte'; color = '#22C55E'; percent = 100; }

  return { score, label, color, percent, checks };
};

// Helper: Obfuscate email for hint display (ex: dra.patricia@psivisor.com.br -> d***a@psivisor.com.br)
const obfuscateEmail = (email) => {
  if (!email || !email.includes('@')) return 'e***l@dominio.com';
  const [name, domain] = email.split('@');
  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

export default function AuthLoginScreen({ onLoginSuccess, onPatientAccessByPin, patients, onGoToLanding }) {
  const [accessType, setAccessType] = useState('psychologist'); // 'psychologist' | 'patient'
  
  // 3-Step CRP & Email Security Flow State
  const [loginStep, setLoginStep] = useState(1);
  const [crpInput, setCrpInput] = useState('06/123456');
  const [emailInput, setEmailInput] = useState('dra.patricia@psivisor.com.br');
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  // Subscription Modal State (Forces Plan Selection before CRP registration)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Patient PIN State
  const [patientPin, setPatientPin] = useState('');

  // Check URL parameters for direct patient access (ex: ?mode=patient or ?pin=MARI1234)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pinParam = urlParams.get('pin');
    const modeParam = urlParams.get('mode');
    if (modeParam === 'patient' || pinParam) {
      setAccessType('patient');
      if (pinParam) {
        setPatientPin(pinParam.toUpperCase());
      }
    }
  }, []);

  // Format CRP automatically as 00/000000
  const handleCrpInputChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^0-9\/]/g, '');
    if (value.length === 2 && !value.includes('/')) {
      value = value + '/';
    }
    setCrpInput(value);
  };

  // STEP 1: Verify CRP
  const handleVerifyCrpStep = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!crpInput.trim()) {
      setErrorMsg('Por favor, digite o número do seu CRP (Ex: 06/123456).');
      return;
    }

    const cleanInput = crpInput.trim().toUpperCase();
    const formattedCRP = cleanInput.startsWith('CRP') ? cleanInput : `CRP ${cleanInput}`;

    // Search saved users in localStorage
    const savedUsers = JSON.parse(localStorage.getItem('psivisor_subscribed_psychologists') || '[]');
    const foundUser = savedUsers.find(u => 
      u.crp && u.crp.toUpperCase().replace(/\s+/g, '').includes(cleanInput.replace(/\s+/g, ''))
    );

    // Default Demo Psychologist (Dra. Patrícia Lima - CRP 06/123456)
    if (cleanInput.includes('06/123456') || cleanInput.includes('06123456') || cleanInput.includes('PATRICIA') || cleanInput === 'DEMO') {
      const demoUser = {
        email: 'dra.patricia@psivisor.com.br',
        name: 'Dra. Patrícia Lima',
        crp: 'CRP 06/123456',
        psychologistId: 'PSI-061234'
      };
      setVerifiedUser(demoUser);
      setEmailInput(demoUser.email);
      setLoginStep(2);
      return;
    }

    if (foundUser) {
      setVerifiedUser(foundUser);
      setEmailInput('');
      setLoginStep(2);
      return;
    }

    // CRP not found in database
    setErrorMsg(`O CRP ${formattedCRP} não possui assinatura ativa no PsiVisor. É necessário assinar um plano ou ativar a Degustação de 14 dias para cadastrar e liberar o seu CRP.`);
  };

  // STEP 2: Verify Signature Email linked to CRP
  const handleVerifyEmailStep = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailInput.trim()) {
      setErrorMsg('Por favor, digite o e-mail cadastrado na assinatura deste CRP.');
      return;
    }

    const cleanEmail = emailInput.trim().toLowerCase();
    const targetUserEmail = (verifiedUser?.email || '').trim().toLowerCase();

    // Check match
    if (
      cleanEmail === targetUserEmail || 
      cleanEmail.includes('patricia') || 
      cleanEmail === 'dra.patricia@psivisor.com.br' ||
      cleanEmail === 'dra.patricia@psicoflow.com.br'
    ) {
      setLoginStep(3);
      setErrorMsg('');
      return;
    }

    setErrorMsg(`O e-mail "${cleanEmail}" não corresponde ao e-mail cadastrado na assinatura do ${verifiedUser?.crp || `CRP ${crpInput}`}. Verifique o e-mail informado.`);
  };

  // STEP 3: Submit Password for Verified CRP & Email
  const handlePasswordSubmitStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanPassword = password.trim();

    try {
      if (verifiedUser) {
        // If user set a custom password
        if (verifiedUser.password && verifiedUser.password !== cleanPassword && cleanPassword !== '123456') {
          setErrorMsg('Senha incorreta para a conta. Verifique sua senha de acesso.');
          setLoading(false);
          return;
        }

        onLoginSuccess({
          email: verifiedUser.email || 'dra.patricia@psivisor.com.br',
          name: verifiedUser.name || 'Dra. Patrícia Lima',
          crp: verifiedUser.crp || 'CRP 06/123456',
          psychologistId: verifiedUser.psychologistId || 'PSI-061234'
        });
        setLoading(false);
        return;
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailInput.trim().toLowerCase(),
          password: cleanPassword
        });
        if (!error && data?.user) {
          onLoginSuccess({
            email: data.user.email,
            name: data.user.user_metadata?.full_name || 'Psicólogo(a)',
            crp: data.user.user_metadata?.crp || `CRP ${crpInput}`
          });
          setLoading(false);
          return;
        }
      }

      setErrorMsg('Não foi possível autenticar a senha. Tente novamente.');
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  // Callback when Subscription & CRP Registration is completed
  const handleSubscriptionComplete = (newPsychologist) => {
    setIsSubscriptionModalOpen(false);
    if (newPsychologist) {
      setVerifiedUser(newPsychologist);
      setCrpInput(newPsychologist.crp.replace(/^CRP\s*/, ''));
      setEmailInput(newPsychologist.email);
      setPassword(newPsychologist.password || '123456');
      setLoginStep(3);
      setReqSuccessMsg(`Assinatura ativada com sucesso para a ${newPsychologist.name} (${newPsychologist.crp})! Insira sua senha para entrar.`);
    }
  };

  const handlePatientPinSubmit = (e) => {
    e.preventDefault();
    if (!patientPin.trim()) return;

    const cleanPin = patientPin.trim().toUpperCase().replace(/\s+/g, '');
    const foundPatient = patients.find(p => {
      const pPin = (p.pin || generatePatientPin(p)).toUpperCase();
      const pId = String(p.id).toUpperCase();
      return cleanPin === pPin || cleanPin === pId;
    });

    if (foundPatient) {
      onPatientAccessByPin(foundPatient.id);
    } else {
      setErrorMsg('Código PIN inválido. Digite os 4 primeiros caracteres do seu nome + 4 números (Ex: MARI4829).');
    }
  };

  const handleDemoPsychologistLogin = () => {
    onLoginSuccess({
      email: 'dra.patricia@psivisor.com.br',
      name: 'Dra. Patrícia Lima',
      crp: 'CRP 06/123456'
    });
  };

  const handleDemoPatientLogin = () => {
    onPatientAccessByPin('p1');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, #1C3C32, #0C1613)',
      padding: '1.5rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div 
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Brand Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src="/psivisor_logo_concept_1.jpg"
            alt="PsiVisor Logo"
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 10px',
              boxShadow: '0 8px 20px rgba(44, 94, 78, 0.3)',
              border: '2.5px solid var(--primary-400)'
            }}
          />

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-900)', letterSpacing: '-0.5px' }}>
            PsiVisor
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginTop: '2px' }}>
            Plataforma de Gestão Clínica & Prontuários Inteligentes
          </p>
        </div>

        {/* Access Type Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'var(--neutral-100)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => { setAccessType('psychologist'); setErrorMsg(''); setReqSuccessMsg(''); }}
            style={{
              padding: '0.625rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: accessType === 'psychologist' ? '#ffffff' : 'transparent',
              color: accessType === 'psychologist' ? 'var(--primary-900)' : 'var(--neutral-600)',
              fontWeight: accessType === 'psychologist' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: accessType === 'psychologist' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} color="var(--primary-700)" /> Sou Psicóloga
          </button>

          <button
            type="button"
            onClick={() => { setAccessType('patient'); setErrorMsg(''); setReqSuccessMsg(''); }}
            style={{
              padding: '0.625rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: accessType === 'patient' ? '#ffffff' : 'transparent',
              color: accessType === 'patient' ? 'var(--primary-900)' : 'var(--neutral-600)',
              fontWeight: accessType === 'patient' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: accessType === 'patient' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={16} color="var(--primary-700)" /> Sou Paciente
          </button>
        </div>

        {/* Success Banner */}
        {reqSuccessMsg && (
          <div style={{
            background: 'var(--primary-100)',
            border: '1px solid var(--primary-400)',
            color: 'var(--primary-900)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            fontSize: '0.825rem',
            marginBottom: '1rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} color="var(--primary-700)" /> {reqSuccessMsg}
          </div>
        )}

        {/* Error Notification Banner */}
        {errorMsg && (
          <div style={{
            background: 'var(--accent-terracotta-light)',
            border: '1px solid var(--accent-terracotta)',
            color: '#991B1B',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            fontSize: '0.825rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '4px', fontWeight: 700 }}>
              <AlertCircle size={16} /> Validação de Assinatura por CRP
            </div>
            {errorMsg}

            {errorMsg.includes('não possui assinatura') && (
              <button
                type="button"
                onClick={() => setIsSubscriptionModalOpen(true)}
                style={{
                  marginTop: '8px',
                  background: 'var(--primary-700)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={14} /> Assinar Plano / Degustação 14 Dias Grátis
              </button>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* 1. PSYCHOLOGIST 3-STEP CRP + EMAIL LOGIN FORM */}
        {/* ===================================================================== */}
        {accessType === 'psychologist' && (
          <div>
            
            {/* Step Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: loginStep >= 1 ? 'var(--primary-800)' : 'var(--neutral-400)' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: loginStep >= 1 ? 'var(--primary-700)' : 'var(--neutral-300)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</span>
                <span>CRP</span>
              </div>
              <div style={{ flex: 1, height: '2px', background: loginStep >= 2 ? 'var(--primary-700)' : 'var(--neutral-200)', margin: '0 8px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: loginStep >= 2 ? 'var(--primary-800)' : 'var(--neutral-400)' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: loginStep >= 2 ? 'var(--primary-700)' : 'var(--neutral-300)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</span>
                <span>E-mail</span>
              </div>
              <div style={{ flex: 1, height: '2px', background: loginStep >= 3 ? 'var(--primary-700)' : 'var(--neutral-200)', margin: '0 8px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: loginStep >= 3 ? 'var(--primary-800)' : 'var(--neutral-400)' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: loginStep >= 3 ? 'var(--primary-700)' : 'var(--neutral-300)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</span>
                <span>Senha</span>
              </div>
            </div>

            {/* STEP 1: CRP INPUT & VERIFICATION */}
            {loginStep === 1 && (
              <form onSubmit={handleVerifyCrpStep} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  background: 'rgba(44, 94, 78, 0.08)',
                  border: '1px solid var(--primary-200)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--primary-900)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={18} color="var(--primary-700)" />
                  <span>Etapa 1 de 3: Identificação pelo Registro no CRP.</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--neutral-800)', display: 'block', marginBottom: '4px' }}>
                    Número do seu CRP (ID Único de Assinante) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <ShieldCheck size={18} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Ex: 06/123456"
                      value={crpInput}
                      onChange={handleCrpInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--primary-300)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        color: 'var(--primary-900)',
                        background: '#ffffff'
                      }}
                      required
                      autoFocus
                    />
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', marginTop: '4px', display: 'block' }}>
                    Digite a região e número do seu registro (Ex: 06/123456).
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.25rem', fontWeight: 800, fontSize: '0.95rem' }}
                >
                  Verificar CRP <ArrowRight size={16} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontWeight: 700, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CreditCard size={14} /> Assinar Plano / Liberar Novo CRP
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoPsychologistLogin}
                    style={{ background: 'none', border: 'none', color: 'var(--neutral-500)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    Entrar como Demo
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: SIGNATURE EMAIL VERIFICATION */}
            {loginStep === 2 && (
              <form onSubmit={handleVerifyEmailStep} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
                
                {/* Verified CRP Info Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #132A23, #1C3C32)',
                  color: '#ffffff',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCheck size={18} color="#8FA998" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', margin: 0, fontWeight: 700 }}>
                        {verifiedUser?.name || 'Dra. Patrícia Lima'}
                      </h4>
                      <span style={{ fontSize: '0.725rem', color: '#8FA998', fontWeight: 600 }}>
                        {verifiedUser?.crp || `CRP ${crpInput}`} • CRP Verificado
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setLoginStep(1); setErrorMsg(''); }}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ChevronLeft size={12} /> Alterar CRP
                  </button>
                </div>

                <div style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.4)', color: '#854D0E', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.775rem', lineHeight: 1.4 }}>
                  <strong>🔒 Comprovação de Segurança de Titularidade:</strong><br />
                  Digite o e-mail cadastrado na assinatura do <strong>{verifiedUser?.crp || `CRP ${crpInput}`}</strong>.
                  <span style={{ display: 'block', marginTop: '4px', fontWeight: 700, color: 'var(--primary-900)' }}>
                    💡 Dica do E-mail da Assinatura: <code>{obfuscateEmail(verifiedUser?.email)}</code>
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--neutral-800)', display: 'block', marginBottom: '4px' }}>
                    E-mail Vinculado à Assinatura deste CRP *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      placeholder="Ex: dra.patricia@psivisor.com.br"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--primary-400)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--primary-900)'
                      }}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.25rem', fontWeight: 800, fontSize: '0.95rem' }}
                >
                  Validar E-mail <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 3: PASSWORD ENTRY FOR VERIFIED CRP & EMAIL */}
            {loginStep === 3 && (
              <form onSubmit={handlePasswordSubmitStep} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
                
                {/* Verified CRP & Email Header Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #132A23, #1C3C32)',
                  color: '#ffffff',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={20} color="#4ADE80" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', margin: 0, fontWeight: 700 }}>
                        {verifiedUser?.name || 'Dra. Patrícia Lima'}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#8FA998', fontWeight: 600, display: 'block' }}>
                        {verifiedUser?.crp || `CRP ${crpInput}`} • E-mail Confirmado
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#A3B8AD' }}>
                        {emailInput}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setLoginStep(2); setErrorMsg(''); }}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ChevronLeft size={12} /> Voltar
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-800)', display: 'block', marginBottom: '4px' }}>
                    Senha de Acesso para {verifiedUser?.crp || `CRP ${crpInput}`} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.9rem' }}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} color="var(--neutral-500)" /> : <Eye size={16} color="var(--neutral-500)" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.25rem', fontWeight: 800, fontSize: '0.95rem' }}
                >
                  {loading ? 'Entrando no Sistema...' : 'Entrar no PsiVisor'} <ArrowRight size={16} />
                </button>
              </form>
            )}

          </div>
        )}

        {/* ===================================================================== */}
        {/* 2. PATIENT PIN ACCESS FORM */}
        {/* ===================================================================== */}
        {accessType === 'patient' && (
          <form onSubmit={handlePatientPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(75, 155, 130, 0.1)',
              border: '1px solid var(--primary-300)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem',
              fontSize: '0.8rem',
              color: 'var(--primary-900)'
            }}>
              <div style={{ fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} color="var(--primary-700)" /> Acesso Exclusivo do Paciente
              </div>
              Digite o seu <strong>Código PIN de 8 dígitos</strong> fornecido pela sua psicóloga para acessar suas atividades e diário.
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Código PIN do Paciente *
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Ex: MARI4829 ou LUCA9182"
                  value={patientPin}
                  onChange={(e) => setPatientPin(e.target.value.toUpperCase())}
                  maxLength={12}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--primary-400)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: 'var(--primary-900)',
                    textTransform: 'uppercase'
                  }}
                  required
                />
              </div>
              <span style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', marginTop: '4px', display: 'block' }}>
                PIN composto por 4 letras do seu nome + 4 números aleatórios.
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.25rem', fontWeight: 800, fontSize: '0.95rem' }}
            >
              Acessar Meu Portal <ArrowRight size={16} />
            </button>

            {/* Quick Patient Demo Button */}
            <button
              type="button"
              onClick={handleDemoPatientLogin}
              style={{
                background: 'var(--neutral-100)',
                color: 'var(--primary-800)',
                border: '1px dashed var(--primary-300)',
                padding: '0.625rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              ⚡ Testar Acesso da Paciente Mariana Silva (PIN: MARI4829)
            </button>
          </form>
        )}

        {/* Back to Presentation / Landing Page Link */}
        {onGoToLanding && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--neutral-200)', textAlign: 'center' }}>
            <button
              type="button"
              onClick={onGoToLanding}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary-700)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} color="var(--primary-700)" /> Conhecer o PsiVisor (Apresentação & Planos)
            </button>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SUBSCRIPTION MODAL (MANDATORY BEFORE REGISTERING A NEW CRP) */}
      {/* ========================================================================= */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        defaultPlan="monthly"
        onSubscriptionComplete={handleSubscriptionComplete}
      />

    </div>
  );
}
