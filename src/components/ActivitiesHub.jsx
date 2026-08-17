import React, { useState } from 'react';
import { ClipboardList, Plus, Send, FileText, CheckCircle2, Sparkles, Sliders, Layers } from 'lucide-react';

export default function ActivitiesHub({ activityTemplates, patients, onOpenAssignModal, onOpenCreateTemplateModal }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--neutral-50))', border: '1px solid var(--primary-300)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '6px' }}>
              <Sparkles size={12} /> Ferramentas Terapêuticas
            </span>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)' }}>
              Biblioteca de Atividades & Tarefas Terapêuticas
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '2px' }}>
              Selecione um modelo testado clinicamente para enviar ao paciente ou crie modelos personalizados para sua abordagem.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={onOpenCreateTemplateModal}>
              <Plus size={16} /> Criar Novo Modelo
            </button>
            <button className="btn btn-primary" onClick={() => onOpenAssignModal(null)}>
              <Send size={16} /> Atribuir Atividade a Paciente
            </button>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {activityTemplates.map((tpl) => (
          <div key={tpl.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              {tpl.imageUrl && (
                <div style={{ height: '130px', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '12px', border: '1px solid var(--neutral-200)' }}>
                  <img src={tpl.imageUrl} alt={tpl.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-info">{tpl.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{tpl.fields.length} Perguntas</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>{tpl.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginTop: '6px', lineHeight: 1.4 }}>
                {tpl.description}
              </p>
            </div>

            {/* Questions preview */}
            <div style={{ background: 'var(--neutral-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-200)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-700)', marginBottom: '4px' }}>
                Campos do Formulário:
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--neutral-600)' }}>
                {tpl.fields.map((f, idx) => (
                  <li key={idx}>{f.label || 'Pergunta sem título'}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ flex: 1 }}
                onClick={() => onOpenAssignModal(null, tpl)}
              >
                <Send size={14} /> Atribuir Esta Atividade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
