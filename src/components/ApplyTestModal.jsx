import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Activity, AlertCircle } from 'lucide-react';

export default function ApplyTestModal({ isOpen, onClose, patient, onSaveTestResult }) {
  if (!isOpen) return null;

  // GAD-7 items
  const gad7Items = [
    "1. Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)",
    "2. Não ser capaz de impedir ou controlar as preocupações",
    "3. Preocupar-se muito com diversas coisas diferentes",
    "4. Dificuldade para relaxar",
    "5. Ficar tão agitado(a) que se torna difícil ficar parado(a)",
    "6. Ficar facilmente irritado(a) ou aborrecido(a)",
    "7. Sentir medo como se algo muito ruim fosse acontecer"
  ];

  const [answers, setAnswers] = useState({
    q0: 1, q1: 1, q2: 1, q3: 1, q4: 0, q5: 1, q6: 0
  });

  const [notes, setNotes] = useState('Paciente relata melhora na frequência de sintomas ansiosos.');
  const [isSuccess, setIsSuccess] = useState(false);

  // Compute Total Score
  const totalScore = Object.values(answers).reduce((acc, curr) => acc + Number(curr), 0);

  // Determine Severity Classification
  const getSeverity = (score) => {
    if (score <= 4) return { text: 'Mínima', color: '#16A34A', bg: '#DCFCE7' };
    if (score <= 9) return { text: 'Leve', color: '#166534', bg: '#DCFCE7' };
    if (score <= 14) return { text: 'Moderada', color: '#854D0E', bg: '#FEF9C3' };
    return { text: 'Grave', color: '#991B1B', bg: '#FEE2E2' };
  };

  const severity = getSeverity(totalScore);

  const handleOptionChange = (qIndex, val) => {
    setAnswers(prev => ({ ...prev, [`q${qIndex}`]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTestObj = {
      id: `t-${Date.now()}`,
      testName: 'GAD-7 (Escala de Ansiedade Generalizada)',
      date: new Date().toISOString().split('T')[0],
      score: totalScore,
      severity: severity.text,
      color: severity.color,
      bgColor: severity.bg,
      notes
    };

    onSaveTestResult(newTestObj);
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
      zIndex: 1150,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-100)', padding: '8px', borderRadius: '10px', color: 'var(--primary-800)' }}>
              <Activity size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>Aplicação de Teste: GAD-7 (Ansiedade)</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                Paciente: {patient ? patient.name : 'Mariana Silva'} • Cálculo de Pontuação Automático
              </p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--neutral-500)" />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--primary-700)' }}>
            <CheckCircle2 size={54} style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.3rem' }}>Teste Aplicado e Salvo no Prontuário!</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
              Pontuação Final: <strong>{totalScore} Pontos ({severity.text})</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '4px' }}>
            
            {/* Live Calculated Score Counter Bar */}
            <div style={{
              background: severity.bg,
              border: `1.5px solid ${severity.color}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: severity.color, textTransform: 'uppercase' }}>
                  Resultado em Tempo Real:
                </span>
                <h3 style={{ fontSize: '1.3rem', color: severity.color, margin: 0 }}>
                  {totalScore} Pontos — Ansiedade {severity.text}
                </h3>
              </div>
              <span className="badge" style={{ background: '#ffffff', color: severity.color, fontWeight: 700, fontSize: '0.85rem' }}>
                Escala GAD-7
              </span>
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginTop: '0.5rem' }}>
              {gad7Items.map((itemLabel, idx) => (
                <div key={idx} style={{ background: 'var(--neutral-50)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neutral-800)', marginBottom: '8px' }}>
                    {itemLabel}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {[
                      { val: 0, label: 'Nenhuma vez (0)' },
                      { val: 1, label: 'Vários dias (1)' },
                      { val: 2, label: 'Mais de metade (2)' },
                      { val: 3, label: 'Quase todos (3)' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => handleOptionChange(idx, opt.val)}
                        style={{
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: answers[`q${idx}`] === opt.val ? '1.5px solid var(--primary-600)' : '1px solid var(--neutral-300)',
                          background: answers[`q${idx}`] === opt.val ? 'var(--primary-100)' : '#ffffff',
                          color: answers[`q${idx}`] === opt.val ? 'var(--primary-900)' : 'var(--neutral-700)',
                          fontWeight: answers[`q${idx}`] === opt.val ? 700 : 400,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Observation Notes */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Observação Clínica / Parecer da Psicóloga
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <CheckCircle2 size={16} /> Salvar Resultado no Prontuário
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
