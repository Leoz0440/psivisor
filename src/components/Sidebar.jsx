import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  Brain, 
  Smartphone,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, patientMode, setPatientMode, psychologistProfile, isAnonMode, onToggleAnonMode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Prontuários & Pacientes', icon: Users },
    { id: 'agenda', label: 'Agenda de Sessões', icon: Calendar },
    { id: 'activities', label: 'Central de Atividades', icon: BookOpen },
    { id: 'financial', label: 'Financeiro & Recibos', icon: DollarSign },
  ];

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header with Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/psivisor_logo_concept_1.jpg"
            alt="PsiVisor Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: 'var(--shadow-glow)'
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              PsiVisor
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary-300)', display: 'block', marginTop: '-2px' }}>
              Prontuários & Gestão Clínica
            </span>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            padding: '6px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1.1rem'
          }}
          className="mobile-only-btn"
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !patientMode;
          return (
            <button
              key={item.id}
              onClick={() => {
                setPatientMode(false);
                setActiveTab(item.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--primary-700)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--neutral-400)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <Icon size={18} color={isActive ? '#ffffff' : 'var(--primary-300)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mode Switches */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        
        {/* Anonymization Mode Switch (Supervisão Clínica) */}
        <button
          onClick={onToggleAnonMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: isAnonMode ? 'rgba(217, 119, 98, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: isAnonMode ? '1px solid var(--accent-terracotta)' : '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
          title="Oculta nomes e dados pessoais para reuniões de supervisão clínica"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isAnonMode ? <EyeOff size={16} color="var(--accent-terracotta)" /> : <Eye size={16} color="var(--primary-300)" />}
            <span style={{ color: isAnonMode ? 'var(--accent-terracotta)' : '#ffffff' }}>
              {isAnonMode ? 'Modo Anônimo Ativo' : 'Modo Supervisão'}
            </span>
          </div>
          <span style={{ fontSize: '0.65rem', background: isAnonMode ? 'var(--accent-terracotta)' : 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
            LGPD
          </span>
        </button>

        {/* Patient Simulator Switch */}
        <button
          onClick={() => setPatientMode(!patientMode)}
          className={patientMode ? 'pulse-glow' : ''}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: patientMode ? 'var(--primary-500)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={16} color={patientMode ? '#ffffff' : 'var(--primary-300)'} />
            <span>{patientMode ? 'Modo Paciente Ativo' : 'Visão do Paciente'}</span>
          </div>
          <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
            Demo
          </span>
        </button>

        {/* Psychologist Profile Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-md)'
        }}>
          <img
            src={psychologistProfile.avatar}
            alt={psychologistProfile.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {psychologistProfile.name}
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary-300)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> {psychologistProfile.crp}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
