import React, { useState } from 'react';
import { X, Lock, ShieldCheck, CheckCircle2, Save } from 'lucide-react';

export default function AddConfidentialNoteModal({ isOpen, onClose, patient, onAddConfidentialNote }) {
  if (!isOpen || !patient) return null;

  const [confidentialNote, setConfidentialNote] = useState('');
  const [sessionNum, setSessionNum] = useState((patient.notes ? patient.notes.length : 0) + 1);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confidentialNote.trim()) return;

    onAddConfidentialNote(patient.id, {
      summary: `[Registro Sigiloso de Observação Clínica - Sessão #${sessionNum}]`,
      confidentialNote,
      sessionNum
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setConfidentialNote('');
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1250,
      padding: '1rem'
    }}>
      <div 
        className="card animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'var(--primary-900)',
          color: '#ffffff',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '8px', borderRadius: '10px' }}>
              <Lock size={22} color="#8FA998" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Registrar Impressão Sigilosa</h3>
              <p style={{ fontSize: '0.78rem', color: '#8FA998' }}>
                Anotação restrita à psicóloga ({patient.name}) • Protegida por Criptografia (LGPD/CFP)
              </p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8FA998' }}>
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#8FA998' }}>
            <CheckCircle2 size={54} color="#4B9B82" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.3rem', color: '#ffffff' }}>Anotação Salva no Cofre Sigiloso!</h4>
            <p style={{ fontSize: '0.875rem', color: '#8FA998', marginTop: '4px' }}>
              O registro foi criptografado e está acessível apenas a você.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8FA998', display: 'block', marginBottom: '4px' }}>
                Número da Sessão Relacionada
              </label>
              <input
                type="number"
                value={sessionNum}
                onChange={(e) => setSessionNum(Number(e.target.value))}
                style={{ width: '100px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E4EFEA', display: 'block', marginBottom: '4px' }}>
                Conteúdo da Anotação Sigilosa / Hipóteses Terapêuticas
              </label>
              <textarea
                rows={5}
                placeholder="Descreva hipóteses diagnósticas, impressões pessoais, transferência ou observações sigilosas para uso exclusivo na psicoterapia..."
                value={confidentialNote}
                onChange={(e) => setConfidentialNote(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '0.875rem', lineHeight: 1.5 }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ background: '#4B9B82', border: 'none' }}>
                <Lock size={16} /> Salvar no Cofre Sigiloso
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
