import React, { useState, useRef } from 'react';
import { X, Download, FileCheck, CheckCircle2, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { downloadPsychologicalCertificatePdf } from '../lib/pdfGenerator';

export default function PsychologicalCertificateModal({ isOpen, onClose, patient, psychologistProfile }) {
  if (!isOpen || !patient) return null;

  const [certType, setCertType] = useState('comparecimento'); // 'comparecimento', 'declaracao'
  const [purpose, setPurpose] = useState('Fins Trabalhistas / Abono de Faltas');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState('14:00 às 14:50 (50 minutos)');
  const [includeCid, setIncludeCid] = useState(false);
  const [cidCode, setCidCode] = useState(patient.diagnosis || 'F41.1 (TAG)');

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
      const filename = `Declaracao_Psicologica_${patient.name.replace(/\s+/g, '_')}.pdf`;
      await downloadPsychologicalCertificatePdf({
        patient,
        psychologistProfile,
        certType,
        purpose,
        sessionDate,
        sessionTime,
        includeCid,
        cidCode,
        currentDateStr
      }, filename);
    } catch (err) {
      console.error('Erro ao gerar declaração em PDF:', err);
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
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '900px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '0', overflow: 'hidden' }}>
        
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
            <FileCheck size={22} color="#8FA998" />
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Gerador de Declarações Psicológicas Formais (CFP Resolução 06/2019)</h3>
              <p style={{ color: '#8FA998', fontSize: '0.78rem' }}>Emissão de documento oficial timbrado em PDF</p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={22} color="#ffffff" />
          </button>
        </div>

        {/* Content Body: Split into Editor & Live A4 Preview */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr', overflow: 'hidden' }}>
          
          {/* Form Editor Left Column */}
          <div style={{ padding: '1.25rem', borderRight: '1px solid var(--neutral-200)', background: 'var(--neutral-50)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', fontWeight: 700 }}>
              Configuração da Declaração
            </h4>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Tipo de Documento
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              >
                <option value="comparecimento">Declaração de Comparecimento a Consulta</option>
                <option value="declaracao">Declaração de Acompanhamento Psicológico</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Finalidade / Apresentação
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            {certType === 'comparecimento' && (
              <>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                    Data do Atendimento
                  </label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                    Horário / Duração
                  </label>
                  <input
                    type="text"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
                  />
                </div>
              </>
            )}

            <div style={{ background: 'var(--primary-100)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-200)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeCid}
                  onChange={(e) => setIncludeCid(e.target.checked)}
                />
                Incluir CID-10 / CID-11 no Documento
              </label>
              <p style={{ fontSize: '0.725rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
                Conforme Resolução CFP nº 06/2019, o CID só deve ser gravado mediante expressa solicitação e autorização do paciente.
              </p>

              {includeCid && (
                <input
                  type="text"
                  value={cidCode}
                  onChange={(e) => setCidCode(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--neutral-300)', fontSize: '0.8rem', marginTop: '6px' }}
                />
              )}
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              style={{ marginTop: '0.5rem' }}
            >
              <Download size={16} /> {isGenerating ? 'Gerando Declaração...' : 'Baixar PDF Timbrado'}
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
                {/* Brand Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #2C5E4E',
                  paddingBottom: '12px',
                  marginBottom: '20px'
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
                      DECLARAÇÃO PSICOLÓGICA
                    </span>
                  </div>
                </div>

                {/* Document Title */}
                <h2 style={{ fontSize: '15px', fontWeight: 800, textAlign: 'center', color: '#132A23', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {certType === 'comparecimento' && 'Declaração de Comparecimento a Consulta'}
                  {certType === 'declaracao' && 'Declaração de Acompanhamento Psicológico'}
                </h2>

                {/* Document Body */}
                <div style={{ fontSize: '12px', lineHeight: 1.5, color: '#1E293B', textAlign: 'justify' }}>
                  {certType === 'comparecimento' && (
                    <p style={{ textIndent: '30px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      Declaro, para os devidos fins de <strong>{purpose}</strong>, que o(a) paciente <strong>{patient.name}</strong> esteve presente nesta data, em <strong>{sessionDate}</strong>, das <strong>{sessionTime}</strong>, em atendimento psicoterapêutico sob meus cuidados profissionais.
                    </p>
                  )}

                  {certType === 'declaracao' && (
                    <p style={{ textIndent: '30px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      Declaro, para os devidos fins de <strong>{purpose}</strong>, que o(a) paciente <strong>{patient.name}</strong> realiza acompanhamento psicoterapêutico regular nesta clínica sob meus cuidados profissionais.
                    </p>
                  )}

                  {includeCid && (
                    <p style={{ textIndent: '30px', marginTop: '14px', fontWeight: 600, color: '#132A23', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      Diagnóstico Clínico (CID): {cidCode} (Autorizado expressamente pelo paciente).
                    </p>
                  )}
                </div>
              </div>

              {/* Signature Line */}
              <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '16px', borderTop: '1px dashed #CBD5E1', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: '10.5px', color: '#64748B', marginBottom: '20px' }}>
                  São Paulo - SP, {currentDateStr}
                </p>
                
                <div style={{ width: '200px', height: '1px', background: '#334155', margin: '0 auto 4px' }} />
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
