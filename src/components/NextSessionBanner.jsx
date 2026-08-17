import React, { useState, useEffect } from 'react';
import { Clock, Video, FileText, MessageCircle, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';

export default function NextSessionBanner({ appointments, patients, onSelectPatient, onOpenWhatsAppModal }) {
  // Find next upcoming appointment today
  const nextAppt = appointments.find(a => a.status === 'Confirmada') || appointments[0];
  const targetPatient = patients.find(p => p.id === nextAppt.patientId) || patients[0];

  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState('24 minutos');

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate live ticking
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!nextAppt) return null;

  return (
    <div 
      className="animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, #132A23 0%, #1C3C32 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderLeft: '4px solid #4B9B82'
      }}
    >
      {/* Session Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', color: '#8FA998' }}>
          <Clock size={24} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8FA998', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PRÓXIMO ATENDIMENTO DO DIA
            </span>
            <span className="badge" style={{ background: '#4B9B82', color: '#ffffff', fontSize: '0.7rem', fontWeight: 700 }}>
              Em {timeLeft}
            </span>
          </div>

          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '2px 0 0', fontWeight: 700 }}>
            {targetPatient.name} • {nextAppt.time} ({nextAppt.type})
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#A3B8AD' }}>
            Queixa/Diagnóstico: {targetPatient.diagnosis}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {nextAppt.type === 'Online' && (
          <a
            href="https://meet.google.com/new"
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ background: '#4B9B82', color: '#ffffff', padding: '0.5rem 0.875rem', fontSize: '0.825rem' }}
          >
            <Video size={15} /> Entrar na Sala Virtual
          </a>
        )}

        <button
          className="btn btn-outline btn-sm"
          style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)' }}
          onClick={() => onSelectPatient(targetPatient.id)}
        >
          <FileText size={15} /> Abrir Prontuário
        </button>

        <button
          className="btn btn-outline btn-sm"
          style={{ color: '#25D366', borderColor: '#25D366', background: 'rgba(37,211,102,0.1)' }}
          onClick={() => onOpenWhatsAppModal(targetPatient, 'reminder')}
        >
          <MessageCircle size={15} /> Avisar WhatsApp
        </button>
      </div>

    </div>
  );
}
