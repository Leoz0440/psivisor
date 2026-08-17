import React, { useState, useRef } from 'react';
import { X, Download, FileText, CheckCircle2, Shield, Sparkles, Send } from 'lucide-react';
import { downloadReferralLetterPdf } from '../lib/pdfGenerator';

export default function ReferralLetterModal({ isOpen, onClose, patient, psychologistProfile }) {
  if (!isOpen || !patient) return null;

  const [recipient, setRecipient] = useState('Ao(À) Prezado(a) Dr(a). Médico(a) Psiquiatra');
  const [introductionText, setIntroductionText] = useState(
    'Prezado(a) Colega, venho por meio deste documento apresentar o parecer técnico relativo ao acompanhamento clínico do(a) paciente abaixo qualificado(a).'
  );
  const [reason, setReason] = useState('Avaliação quanto à necessidade de suporte psicofarmacológico adjuvante.');
  const [symptoms, setSymptoms] = useState('Apresenta sintomas persistentes de ansiedade generalizada, hipervigilância, tensão muscular e queixa de insônia inicial.');
  const [hypothesis, setHypothesis] = useState(patient.diagnosis || 'Transtorno de Ansiedade Generalizada (TAG)');
  const [treatmentStatus, setTreatmentStatus] = useState('Em acompanhamento psicoterapêutico semanal regular.');

  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef(null);

  const currentDateStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handleDownloadPdf = async () => {
    setIsGenerating(true);

    try {
      const filename = `Encaminhamento_Medico_${patient.name.replace(/\s+/g, '_')}.pdf`;
      await downloadReferralLetterPdf({
        patient,
        psychologistProfile,
        recipient,
        introductionText,
        reason,
        symptoms,
        hypothesis,
        treatmentStatus,
        currentDateStr
      }, filename);
    } catch (err) {
      console.error('Erro ao gerar relatório de encaminhamento em PDF:', err);
    } finally {
      setIsGenerating(false);
    }
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
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '920px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '0', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--primary-900)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} color="#8FA998" />
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Gerador de Encaminhamento Médico / Psiquiátrico</h3>
              <p style={{ color: '#8FA998', fontSize: '0.78rem' }}>Emissão de parecer técnico profissional timbrado em PDF</p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={22} color="#ffffff" />
          </button>
        </div>

        {/* Content Body: Split into Form Editor & Live A4 Preview */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr', overflow: 'hidden' }}>
          
          {/* Form Editor Left Column */}
          <div style={{ padding: '1.25rem', borderRight: '1px solid var(--neutral-200)', background: 'var(--neutral-50)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', fontWeight: 700 }}>
              Dados do Encaminhamento
            </h4>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Destinatário / Especialidade
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            {/* NEW: Free Text Field Before Reason for Referral */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Texto Livre de Introdução / Apresentação
              </label>
              <textarea
                rows={3}
                placeholder="Insira o texto introdutório livre aqui..."
                value={introductionText}
                onChange={(e) => setIntroductionText(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Motivo do Encaminhamento
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Sintomas Observados
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Hipótese Diagnóstica
              </label>
              <input
                type="text"
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Acompanhamento Psicoterapêutico Atual
              </label>
              <textarea
                rows={2}
                value={treatmentStatus}
                onChange={(e) => setTreatmentStatus(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              style={{ marginTop: '0.5rem' }}
            >
              <Download size={16} /> {isGenerating ? 'Gerando Encaminhamento...' : 'Baixar PDF Timbrado'}
            </button>
          </div>

          {/* Printable A4 Preview Right Column */}
          <div style={{ padding: '1.5rem', background: '#e2e8f0', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div
              ref={printRef}
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '16mm',
                background: '#ffffff',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                color: '#1e293b',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Official Brand Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #2C5E4E',
                  paddingBottom: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                      {psychologistProfile.name}
                    </h1>
                    <p style={{ fontSize: '11px', color: '#387A66', fontWeight: 600, margin: '2px 0 0' }}>
                      {psychologistProfile.crp} • {psychologistProfile.specialty}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', background: '#E4EFEA', color: '#1C3C32', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      ENCAMINHAMENTO CLÍNICO
                    </span>
                  </div>
                </div>

                {/* Recipient */}
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#132A23', marginBottom: '14px' }}>
                  {recipient}
                </p>

                {/* Main Body Text */}
                <div style={{ fontSize: '10px', lineHeight: 1.45, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'justify' }}>
                  
                  {/* Free Text Introduction before Motivo do Encaminhamento */}
                  {introductionText && (
                    <p style={{ textIndent: '15px', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {introductionText}
                    </p>
                  )}

                  <p style={{ textIndent: '20px', margin: 0 }}>
                    Encaminho o(a) paciente <strong>{patient.name}</strong>, {patient.age} anos, para vossa avaliação clínica e conduta cabível.
                  </p>

                  <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong style={{ color: '#132A23' }}>1. Motivo do Encaminhamento:</strong>
                    <p style={{ margin: '2px 0 0 12px' }}>{reason}</p>
                  </div>

                  <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong style={{ color: '#132A23' }}>2. Sintomas e Quadro Clínico Observados:</strong>
                    <p style={{ margin: '2px 0 0 12px' }}>{symptoms}</p>
                  </div>

                  <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong style={{ color: '#132A23' }}>3. Hipótese Diagnóstica:</strong>
                    <p style={{ margin: '2px 0 0 12px' }}>{hypothesis}</p>
                  </div>

                  <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong style={{ color: '#132A23' }}>4. Conduta Psicoterapêutica em Andamento:</strong>
                    <p style={{ margin: '2px 0 0 12px' }}>{treatmentStatus}</p>
                  </div>

                  <p style={{ textIndent: '15px', marginTop: '6px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    Permaneço à disposição para troca de informações e trabalho multidisciplinar conjunto em prol da evolução clínica do(a) paciente.
                  </p>
                </div>
              </div>

              {/* Signature Line */}
              <div style={{ marginTop: '15px', textAlign: 'center', paddingTop: '16px', borderTop: '1px dashed #CBD5E1', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: '10.5px', color: '#64748B', marginBottom: '16px' }}>
                  São Paulo - SP, {currentDateStr}
                </p>
                
                <div style={{ width: '150px', height: '1px', background: '#334155', margin: '0 auto 4px' }} />
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                  {psychologistProfile.name}
                </p>
                <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0' }}>
                  Psicóloga Clínica • {psychologistProfile.crp}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
