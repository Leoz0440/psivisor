import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  Award, 
  Sparkles, 
  Activity,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function PsychologicalTestsView({ patient, onOpenApplyTestModal }) {
  // Mock historical test results applied to this patient
  const [testResults, setTestResults] = useState([
    {
      id: 't-1',
      testName: 'GAD-7 (Escala de Ansiedade Generalizada)',
      date: '2026-07-14',
      score: 16,
      severity: 'Grave',
      color: '#991B1B',
      bgColor: '#FEE2E2',
      notes: 'Paciente apresentava crises diárias de ansiedade e inquietação.'
    },
    {
      id: 't-2',
      testName: 'GAD-7 (Escala de Ansiedade Generalizada)',
      date: '2026-08-11',
      score: 7,
      severity: 'Leve',
      color: '#166534',
      bgColor: '#DCFCE7',
      notes: 'Redução significativa dos sintomas após psicoeducação e técnicas de respiração.'
    },
    {
      id: 't-3',
      testName: 'PHQ-9 (Rastreamento de Sintomas Depressivos)',
      date: '2026-08-01',
      score: 6,
      severity: 'Leve',
      color: '#1E40AF',
      bgColor: '#DBEAFE',
      notes: 'Sintomas residuais de fadiga, sem ideação autolítica.'
    }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--neutral-50))', border: '1px solid var(--primary-300)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success mb-1">
              <Sparkles size={12} /> Avaliação Psicotécnica Padronizada
            </span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>
              Testes & Inventários Psicológicos (GAD-7, PHQ-9, BDI)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginTop: '2px' }}>
              Aplique escalas com cálculo de pontuação e interpretação clínica automática.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onOpenApplyTestModal}>
            <Plus size={16} /> Aplicar Novo Teste
          </button>
        </div>
      </div>

      {/* Summary Score Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        
        <div className="card" style={{ borderLeft: '4px solid #16A34A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <TrendingDown size={20} color="#16A34A" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-600)' }}>Evolução GAD-7 (Ansiedade)</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#166534', marginTop: '2px' }}>
            16 (Grave) ➔ 7 (Leve)
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '4px', fontWeight: 600 }}>
            📉 Queda de 56% na severidade dos sintomas em 30 dias.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Activity size={20} color="#3B82F6" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-600)' }}>Último PHQ-9 (Depressão)</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#1E40AF', marginTop: '2px' }}>
            6 PONTOS (Depressão Leve)
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '4px' }}>
            Avaliação realizada em 01/08/2026.
          </p>
        </div>
      </div>

      {/* Test Results Table */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>
          Histórico de Testes Aplicados a {patient ? patient.name : 'Paciente'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {testResults.map((t) => (
            <div 
              key={t.id}
              style={{
                background: 'var(--neutral-50)',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)' }}>{t.testName}</h4>
                  <span style={{ background: t.bgColor, color: t.color, fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
                    {t.score} Pts • {t.severity}
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
                  Data de aplicação: {t.date}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--neutral-800)', marginTop: '6px', fontStyle: 'italic' }}>
                  "{t.notes}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-success">✓ Calculado Automaticamente</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
