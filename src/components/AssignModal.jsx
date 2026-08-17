import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Calendar, CheckCircle } from 'lucide-react';

export default function AssignModal({ isOpen, onClose, patients, templates, initialPatient, initialTemplate, onAssignSuccess }) {
  if (!isOpen) return null;

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [customMessage, setCustomMessage] = useState('Olá! Preparei esta atividade para trabalharmos em nossa próxima sessão. Qualquer dúvida me avise.');
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      if (initialPatient && initialPatient.id) {
        setSelectedPatientId(String(initialPatient.id));
      } else if (patients && patients.length > 0) {
        setSelectedPatientId(String(patients[0].id));
      }

      if (initialTemplate && initialTemplate.id) {
        setSelectedTemplateId(String(initialTemplate.id));
      } else if (templates && templates.length > 0) {
        setSelectedTemplateId(String(templates[0].id));
      }

      // Default due date to 7 days from today
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDueDate(nextWeek.toISOString().split('T')[0]);
    }
  }, [isOpen, initialPatient, initialTemplate, patients, templates]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const targetPatientId = selectedPatientId || (initialPatient ? String(initialPatient.id) : (patients && patients[0] ? String(patients[0].id) : ''));
    const targetTemplateId = selectedTemplateId || (initialTemplate ? String(initialTemplate.id) : (templates && templates[0] ? String(templates[0].id) : ''));

    if (!targetPatientId) {
      console.warn('Nenhum paciente selecionado para atribuição.');
      return;
    }

    const template = (templates || []).find(t => String(t.id) === String(targetTemplateId));
    
    const newActivityPayload = {
      title: template ? template.title : 'Atividade Terapêutica',
      type: template ? (template.type || 'Reflexão') : 'Reflexão',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      status: 'Pendente',
      customMessage: customMessage,
      description: template ? template.description : null,
      imageUrl: template ? template.imageUrl : null,
      fields: template ? template.fields : null,
      patientResponse: null
    };

    try {
      await onAssignSuccess(targetPatientId, newActivityPayload);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Erro ao atribuir atividade:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1250,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '540px', padding: '1.75rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-100)', padding: '8px', borderRadius: '10px', color: 'var(--primary-800)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>Atribuir Atividade ao Paciente</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                Envie um exercício terapêutico diretamente para a área do paciente.
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--neutral-500)" />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--primary-700)' }}>
            <CheckCircle size={54} style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.3rem' }}>Atividade Enviada com Sucesso!</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
              O paciente receberá a notificação para preencher no portal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Select Patient */}
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Selecione o Paciente *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem', fontWeight: 600 }}
                required
              >
                {(patients || []).map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.diagnosis || 'Ativo'})</option>
                ))}
              </select>
            </div>

            {/* Select Template */}
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Modelo de Atividade Terapêutica *
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem', fontWeight: 600 }}
                required
              >
                {(templates || []).map(t => (
                  <option key={t.id} value={t.id}>{t.title} ({t.category || 'Geral'})</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Prazo de Preenchimento *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                required
              />
            </div>

            {/* Custom Message */}
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Mensagem / Orientação para o Paciente
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={16} /> Confirmar & Enviar Atividade
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
