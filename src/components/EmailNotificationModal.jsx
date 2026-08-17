import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, Sparkles, Calendar, Clock, CreditCard } from 'lucide-react';

export default function EmailNotificationModal({ isOpen, onClose, patient, psychologistProfile }) {
  if (!isOpen || !patient) return null;

  const [templateType, setTemplateType] = useState('reminder'); // 'reminder', 'confirmation', 'activity', 'payment'
  const [subject, setSubject] = useState(`Lembrete de Consulta Psicológica - ${patient.name}`);
  const [isSuccess, setIsSuccess] = useState(false);

  const getEmailBody = (type) => {
    switch (type) {
      case 'reminder':
        return `Olá, ${patient.name}!\n\nPassando para lembrar do seu atendimento psicoterapêutico agendado para amanhã às 14:00 com a Dra. ${psychologistProfile.name}.\n\nCaso necessite reagendar, solicitamos que entre em contato com antecedência.\n\nAtenciosamente,\n${psychologistProfile.name}\n${psychologistProfile.crp}`;
      case 'confirmation':
        return `Olá, ${patient.name}!\n\nSua consulta de psicoterapia foi confirmada com sucesso para o dia 18/08 às 14:00.\n\nLink da sala virtual: https://meet.google.com/new\n\nAbraços,\nDra. ${psychologistProfile.name}`;
      case 'activity':
        return `Olá, ${patient.name}!\n\nUma nova atividade terapêutica (TCC) foi atribuída ao seu prontuário no Portal do Paciente.\n\nAcesse seu portal para preencher seus registros de pensamentos antes da nossa próxima sessão.\n\nAtenciosamente,\n${psychologistProfile.name}`;
      case 'payment':
        return `Olá, ${patient.name}!\n\nSegue o resumo financeiro das sessões realizadas neste mês.\n\nValor total: R$ 200,00\nChave Pix para pagamento: dra.patricia@psicoflow.com.br\n\nQualquer dúvida estou à disposição!`;
      default:
        return '';
    }
  };

  const [body, setBody] = useState(getEmailBody('reminder'));

  const handleTemplateChange = (type) => {
    setTemplateType(type);
    if (type === 'reminder') {
      setSubject(`Lembrete de Consulta Psicológica - ${patient.name}`);
    } else if (type === 'confirmation') {
      setSubject(`Consulta Confirmada - ${patient.name}`);
    } else if (type === 'activity') {
      setSubject(`Nova Atividade Terapêutica Disponível - ${patient.name}`);
    } else if (type === 'payment') {
      setSubject(`Resumo Financeiro & Lembrete de Pagamento - ${patient.name}`);
    }
    setBody(getEmailBody(type));
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
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
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1250,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '620px', background: '#ffffff', padding: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#DBEAFE', padding: '8px', borderRadius: '10px', color: '#1E40AF' }}>
              <Mail size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>Enviar Notificação por E-mail</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                Para: {patient.name} ({patient.email || 'paciente@email.com'})
              </p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--neutral-500)" />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--primary-700)' }}>
            <CheckCircle2 size={54} style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.3rem' }}>E-mail Enviado com Sucesso!</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
              O e-mail foi entregue na caixa de entrada do paciente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Model Selector Buttons */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '6px' }}>
                Selecionar Modelo Próprio
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'reminder', label: 'Lembrete 24h', icon: Clock },
                  { id: 'confirmation', label: 'Confirmação', icon: Calendar },
                  { id: 'activity', label: 'Atividade', icon: Sparkles },
                  { id: 'payment', label: 'Cobrança', icon: CreditCard }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = templateType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTemplateChange(item.id)}
                      style={{
                        padding: '6px 4px',
                        borderRadius: '6px',
                        border: isSelected ? '1.5px solid var(--primary-600)' : '1px solid var(--neutral-300)',
                        background: isSelected ? 'var(--primary-100)' : '#ffffff',
                        color: isSelected ? 'var(--primary-900)' : 'var(--neutral-700)',
                        fontWeight: isSelected ? 700 : 400,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Assunto do E-mail
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                required
              />
            </div>

            {/* Body TextArea */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Conteúdo do E-mail
              </label>
              <textarea
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem', lineHeight: 1.5 }}
                required
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={16} /> Disparar E-mail
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
