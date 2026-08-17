import React, { useState, useRef } from 'react';
import { X, Download, FileText, CheckCircle2, Shield } from 'lucide-react';
import { exportMultiPagePdf } from '../lib/pdfGenerator';

export default function ExportPdfModal({ isOpen, onClose, patient, psychologistProfile }) {
  if (!isOpen || !patient) return null;

  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      const filename = `Prontuario_${patient.name.replace(/\s+/g, '_')}.pdf`;
      await exportMultiPagePdf(printRef.current, filename);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDateStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

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
      zIndex: 1100,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '840px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '0', overflow: 'hidden' }}>
        
        {/* Modal Top Bar */}
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
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Gerar Relatório de Prontuário (PDF)</h3>
              <p style={{ color: '#8FA998', fontSize: '0.78rem' }}>Exportação timbrada oficial com histórico de evolução e CRP</p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={22} color="#ffffff" />
          </button>
        </div>

        {/* Document Action Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'var(--neutral-50)',
          borderBottom: '1px solid var(--neutral-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
              Relatório Completo de Prontuário
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={14} color="#16A34A" /> Anotações sigilosas são mantidas sob sigilo e omitidas do PDF.
            </span>
          </div>

          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleDownloadPdf}
            disabled={isGenerating}
          >
            <Download size={14} /> {isGenerating ? 'Gerando PDF...' : 'Baixar Prontuário PDF'}
          </button>
        </div>

        {/* Printable PDF Canvas Preview */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: '#e2e8f0', display: 'flex', justifyContent: 'center' }}>
          
          <div
            ref={printRef}
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
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
              {/* Official Document Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #2C5E4E',
                paddingBottom: '16px',
                marginBottom: '24px'
              }}>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                    {psychologistProfile.name}
                  </h1>
                  <p style={{ fontSize: '12px', color: '#387A66', fontWeight: 600, margin: '2px 0 0' }}>
                    {psychologistProfile.crp} • {psychologistProfile.specialty}
                  </p>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>
                    Contato: {psychologistProfile.email}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', background: '#E4EFEA', color: '#1C3C32', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                    PRONTUÁRIO CLÍNICO OFICIAL
                  </span>
                </div>
              </div>

              {/* DOCUMENT CONTENT: PRONTUÁRIO */}
              <div>
                <h2 style={{ fontSize: '16px', textAlign: 'center', color: '#132A23', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.5px' }}>
                  Relatório de Prontuário & Evolução Clínica
                </h2>

                {/* Patient Info Box */}
                <div style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <p><strong>Paciente:</strong> {patient.name}</p>
                    <p><strong>Idade:</strong> {patient.age} anos</p>
                    <p><strong>Telefone:</strong> {patient.phone}</p>
                    <p><strong>Hipótese Diagnóstica:</strong> {patient.diagnosis}</p>
                    <p><strong>Dia/Horário da Sessão:</strong> {patient.sessionDay}</p>
                    <p><strong>Data de Emissão:</strong> {currentDateStr}</p>
                  </div>
                </div>

                {/* Clinical Evolution History */}
                <h3 style={{ fontSize: '14px', color: '#2C5E4E', borderBottom: '1px solid #CBD5E1', paddingBottom: '4px', marginBottom: '12px' }}>
                  Histórico de Evolução de Sessões
                </h3>

                {(patient.notes || []).map((note) => (
                  <div key={note.id} style={{ marginBottom: '16px', background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#387A66', marginBottom: '4px' }}>
                      <span>Sessão #{note.sessionNum}</span>
                      <span>Data: {note.date}</span>
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#334155', margin: 0 }}>
                      {note.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Signature Box */}
            <div style={{ marginTop: '40px', textAlign: 'center', paddingTop: '20px', borderTop: '1px dashed #CBD5E1' }}>
              <div style={{ width: '220px', height: '1px', background: '#334155', margin: '0 auto 8px' }} />
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                {psychologistProfile.name}
              </p>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>
                Psicóloga Clínica • {psychologistProfile.crp}
              </p>
              <p style={{ fontSize: '10px', color: '#94A3B8', marginTop: '12px' }}>
                Documento gerado em {currentDateStr} via Plataforma PsiVisor.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
