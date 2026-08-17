import React, { useState } from 'react';
import { X, Send, MessageCircle, Copy, CheckCircle2, Sparkles } from 'lucide-react';

export default function WhatsAppModal({ isOpen, onClose, targetData, type = 'activity' }) {
  if (!isOpen || !targetData) return null;

  // Generate WhatsApp Message based on type
  const getMessageTemplate = () => {
    if (type === 'activity') {
      return `Olá ${targetData.name}! Tudo bem?\n\nPassando para lembrar da sua atividade terapêutica "${targetData.activityTitle || 'Exercício TCC'}" com prazo para ${targetData.dueDate || 'essa semana'}.\n\nVocê pode preencher através do seu Portal do Paciente. Qualquer dúvida estou à disposição! 🌿`;
    }

    if (type === 'reminder') {
      return `Olá ${targetData.name}! Tudo bem?\n\nPassando para confirmar nossa próxima sessão de psicoterapia agendada para ${targetData.sessionDay || 'essa semana'}.\n\nCaso precise remarcar, por favor me avise com antecedência. Nos vemos em breve! 🌿`;
    }

    if (type === 'birthday') {
      return `Olá ${targetData.name}! 🎉🎂\n\nDesejo um feliz aniversário repleto de paz, saúde, equilíbrio e muitas conquistas neste novo ciclo!\n\nÉ um privilégio acompanhar sua jornada de desenvolvimento pessoal. Um grande abraço! 🌿✨`;
    }

    return `Olá ${targetData.name}! Passando para enviar as informações do seu atendimento psicoterapêutico.`;
  };

  const [message, setMessage] = useState(getMessageTemplate());
  const [copied, setCopied] = useState(false);

  const cleanPhone = (targetData.phone || '11999999999').replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMsg}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '520px', background: '#ffffff', padding: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#DCFCE7', padding: '8px', borderRadius: '10px', color: '#15803D' }}>
              <MessageCircle size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>
                {type === 'birthday' ? 'Enviar Parabéns via WhatsApp' : 'Envio Rápido via WhatsApp'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                Para: {targetData.name} ({targetData.phone})
              </p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--neutral-500)" />
          </button>
        </div>

        {/* Message Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
              Mensagem Personalizada
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--neutral-300)',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                color: 'var(--neutral-800)'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={handleCopy}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <CheckCircle2 size={16} color="#16A34A" /> : <Copy size={16} />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ background: '#25D366', color: '#ffffff', fontWeight: 600 }}
              onClick={onClose}
            >
              <Send size={16} /> Abrir WhatsApp Web/App
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
