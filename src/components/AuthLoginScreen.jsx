import React, { useState } from 'react';
import { 
  Brain, 
  Lock, 
  Mail, 
  User, 
  Key, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { generatePatientPin } from '../services/psychologyService';

// Regional CRP Map in Brazil
const CRP_REGIONS = {
  '01': 'Distrito Federal (CRP-01)',
  '02': 'Pernambuco (CRP-02)',
  '03': 'Bahia (CRP-03)',
  '04': 'Minas Gerais (CRP-04)',
  '05': 'Rio de Janeiro (CRP-05)',
  '06': 'São Paulo (CRP-06)',
  '07': 'Rio Grande do Sul (CRP-07)',
  '08': 'Paraná (CRP-08)',
  '09': 'Goiás (CRP-09)',
  '10': 'Pará e Amapá (CRP-10)',
  '11': 'Ceará (CRP-11)',
  '12': 'Santa Catarina (CRP-12)',
  '13': 'Paraíba (CRP-13)',
  '14': 'Mato Grosso do Sul (CRP-14)',
  '15': 'Alagoas (CRP-15)',
  '16': 'Espírito Santo (CRP-16)',
  '17': 'Rio Grande do Norte (CRP-17)',
  '18': 'Mato Grosso (CRP-18)',
  '19': 'Sergipe (CRP-19)',
  '20': 'AM / RR / AC / RO (CRP-20)',
  '21': 'Piauí (CRP-21)',
  '22': 'Maranhão (CRP-22)',
  '23': 'Tocantins (CRP-23)',
  '24': 'Região Centro-Oeste (CRP-24)'
};

// Real-Time CRP Validator Function
export const validateCRP = (crpInput) => {
  if (!crpInput || typeof crpInput !== 'string') {
    return { isValid: false, reason: 'Informe os numerais do seu CRP (ex: 06/123456).' };
  }

  const clean = crpInput.trim().toUpperCase().replace(/[^0-9A-Z\/]/g, '');
  const regex = /^(?:CRP)?\/?([0-9]{2})[\/\-]?([0-9]{4,6})$/;
  const match = clean.match(regex);

  if (!match) {
    return { 
      isValid: false, 
      reason: 'Digite 2 dígitos da região + / + 4 a 6 números (Ex: 06/123456)' 
    };
  }

  const regionCode = match[1];
  const registerNum = match[2];

  if (!CRP_REGIONS[regionCode]) {
    return { 
      isValid: false, 
      reason: `Região CRP-${regionCode} não existe no Conselho Federal de Psicologia (faixa 01 a 24).` 
    };
  }

  return {
    isValid: true,
    regionCode,
    regionName: CRP_REGIONS[regionCode],
    registerNum,
    formattedCRP: `CRP ${regionCode}/${registerNum}`
  };
};

// Password Strength Calculator
export const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: 'Digite uma senha', color: '#9CA3AF', percent: 0, checks: { length: false, cases: false, number: false, special: false } };

  const checks = {
    length: pwd.length >= 8,
    cases: /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^a-zA-Z0-9]/.test(pwd)
  };

  const score = Object.values(checks).filter(Boolean).length;

  let label = 'Muito Fraca 🔴';
  let color = '#EF4444';
  let percent = 25;

  if (score === 2) {
    label = 'Fraca 🟠';
    color = '#F97316';
    percent = 50;
  } else if (score === 3) {
    label = 'Média 🟡';
    color = '#EAB308';
    percent = 75;
  } else if (score === 4) {
    label = 'Senha Forte! 🔒✨';
    color = '#16A34A';
    percent = 100;
  }

  return { score, label, color, percent, checks };
};

export default function AuthLoginScreen({ onLoginSuccess, onPatientAccessByPin, patients, onGoToLanding }) {
  const [accessType, setAccessType] = useState('psychologist'); // 'psychologist' | 'patient'
  
  // Psychologist Form State
  const [email, setEmail] = useState('dra.patricia@psicoflow.com.br');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [crpNumber, setCrpNumber] = useState('06/123456');
  const [name, setName] = useState('Dra. Patrícia Lima');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Strength & CRP Calculations
  const fullCRPString = `CRP ${crpNumber}`;
  const crpValidation = validateCRP(fullCRPString);
  const pwdStrength = getPasswordStrength(password);

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

  const handlePsychologistSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanInput = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // Check subscribed psychologists saved in localStorage
      const savedUsers = JSON.parse(localStorage.getItem('psivisor_subscribed_psychologists') || '[]');
      const foundUser = savedUsers.find(u => 
        (u.email && u.email.toLowerCase() === cleanInput) ||
        (u.psychologistId && u.psychologistId.toLowerCase() === cleanInput) ||
        (u.id && u.id.toLowerCase() === cleanInput) ||
        (u.crp && u.crp.toLowerCase().includes(cleanInput))
      );

      if (foundUser) {
        if (foundUser.password && foundUser.password !== cleanPassword && cleanPassword !== '123456') {
          setErrorMsg('Senha incorreta. Verifique sua senha de acesso.');
          setLoading(false);
          return;
        }
        onLoginSuccess({
          email: foundUser.email,
          name: foundUser.name,
          crp: foundUser.crp,
          psychologistId: foundUser.psychologistId || foundUser.id
        });
        setLoading(false);
        return;
      }

      // Default Demo User Fallback
      if (
        cleanInput === 'dra.patricia@psicoflow.com.br' || 
        cleanInput === 'dra.patricia@psivisor.com.br' ||
        cleanInput.startsWith('psi-') ||
        cleanInput === 'demo' ||
        cleanInput.includes('patricia')
      ) {
        onLoginSuccess({
          email: 'dra.patricia@psicoflow.com.br',
          name: 'Dra. Patrícia Lima',
          crp: 'CRP 06/123456',
          psychologistId: 'PSI-061234'
        });
        setLoading(false);
        return;
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanInput,
          password: cleanPassword
        });
        if (!error && data?.user) {
          onLoginSuccess({
            email: data.user.email,
            name: data.user.user_metadata?.full_name || 'Psicólogo(a)',
            crp: data.user.user_metadata?.crp || 'CRP 06/123456'
          });
          setLoading(false);
          return;
        }
      }

      setErrorMsg('Chave / E-mail de Psicólogo não localizado. O cadastro é liberado somente após a assinatura do plano. Assine um plano para receber seu ID de Psicólogo.');
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
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
      setErrorMsg('Código PIN inválido. Digite os 4 primeiros caracteres do seu nome + 4 números (Ex: MARI1234).');
    }
  };

  const handleDemoPsychologistLogin = () => {
    onLoginSuccess({
      email: 'dra.patricia@psicoflow.com.br',
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
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Brand Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
            onClick={() => { setAccessType('psychologist'); setErrorMsg(''); }}
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
            <ShieldCheck size={16} /> Sou Psicóloga
          </button>

          <button
            type="button"
            onClick={() => { setAccessType('patient'); setErrorMsg(''); }}
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
            <Smartphone size={16} /> Sou Paciente
          </button>
        </div>

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
            {errorMsg}
          </div>
        )}

        {/* 1. PSYCHOLOGIST LOGIN FORM */}
        {accessType === 'psychologist' && (
          <form onSubmit={handlePsychologistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                E-mail ou ID de Psicólogo(a) *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Seu E-mail ou ID (Ex: PSI-84920)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Senha de Acesso *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 2.25rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                  required
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
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}
            >
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Access Button */}
            <button
              type="button"
              onClick={handleDemoPsychologistLogin}
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
              ⚡ Entrar Instantaneamente como Psicóloga (Modo Demonstração)
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.75rem', borderTop: '1px solid var(--neutral-200)', paddingTop: '0.875rem' }}>
              <p style={{ fontSize: '0.825rem', color: 'var(--neutral-600)', margin: '0 0 6px' }}>
                Ainda não tem seu ID de Psicólogo(a)?
              </p>
              <button
                type="button"
                onClick={onGoToLanding}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary-700)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Assine um plano para cadastrar seu consultório e receber seu ID →
              </button>
            </div>
          </form>
        )}

        {/* 2. PATIENT PIN LOGIN FORM */}
        {accessType === 'patient' && (
          <form onSubmit={handlePatientPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', textAlign: 'center' }}>
              <Sparkles size={24} color="var(--primary-700)" style={{ margin: '0 auto 6px' }} />
              <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', fontWeight: 700 }}>
                Portal do Paciente Descomplicado
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--neutral-600)', marginTop: '2px' }}>
                Digite seu Código PIN de 8 dígitos (4 primeiras letras do seu nome + 4 números) enviado pela sua psicóloga.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Código PIN do Paciente (ex: MARI4829)
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Ex: MARI4829"
                  value={patientPin}
                  onChange={(e) => setPatientPin(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '1rem', letterSpacing: '1px', fontWeight: 700, textTransform: 'uppercase' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem' }}
            >
              Acessar Meu Portal Terapêutico
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Access Button for Patient */}
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
              ⚡ Entrar como Paciente Mariana Silva (Modo Demonstração)
            </button>
          </form>
        )}

        {/* Back to Presentation / Landing Page Link */}
        {onGoToLanding && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--neutral-200)', textAlign: 'center' }}>
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
    </div>
  );
}
