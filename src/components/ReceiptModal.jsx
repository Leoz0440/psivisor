import React, { useState, useRef } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { exportMultiPagePdf } from '../lib/pdfGenerator';

export default function ReceiptModal({ isOpen, onClose, record, psychologistProfile }) {
  if (!isOpen || !record) return null;

  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      const filename = `Recibo_Psicoterapia_${record.patientName.replace(/\s+/g, '_')}_${record.date}.pdf`;
      await exportMultiPagePdf(printRef.current, filename);
    } catch (err) {
      console.error('Erro ao gerar recibo PDF:', err);
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
      zIndex: 1200,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '0', overflow: 'hidden' }}>
        
        {/* Top Header */}
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
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Recibo de Atendimento Psicológico</h3>
              <p style={{ color: '#8FA998', fontSize: '0.78rem' }}>Documento aceito para reembolso em planos de saúde (Convenio/IRPF)</p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={22} color="#ffffff" />
          </button>
        </div>

        {/* Action Controls */}
        <div style={{
          padding: '0.875rem 1.5rem',
          background: 'var(--neutral-50)',
          borderBottom: '1px solid var(--neutral-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
            Paciente: <strong>{record.patientName}</strong> • Valor: <strong>R$ {record.amount.toFixed(2)}</strong>
          </span>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
          >
            <Download size={14} /> {isGenerating ? 'Gerando Recibo...' : 'Baixar Recibo em PDF'}
          </button>
        </div>

        {/* Printable Receipt Canvas Preview */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: '#e2e8f0', display: 'flex', justifyContent: 'center' }}>
          
          <div
            ref={printRef}
            style={{
              width: '210mm',
              minHeight: '148mm', // Half A4 size for receipt format
              padding: '16mm 20mm',
              background: '#ffffff',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              color: '#1e293b',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '2px solid #2C5E4E'
            }}
          >
            <div>
              {/* Receipt Top Brand Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1.5px solid #2C5E4E',
                paddingBottom: '12px',
                marginBottom: '20px'
              }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                    {psychologistProfile.name}
                  </h2>
                  <p style={{ fontSize: '11px', color: '#387A66', fontWeight: 600, margin: '2px 0 0' }}>
                    {psychologistProfile.crp} • {psychologistProfile.specialty}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#132A23', letterSpacing: '1px', margin: 0 }}>
                    RECIBO Nº {record.id.toUpperCase()}
                  </h3>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#2C5E4E' }}>
                    VALOR: R$ {record.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Receipt Legal Text Body */}
              <div style={{ padding: '10px 0' }}>
                <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#1E293B', textIndent: '20px', textAlign: 'justify' }}>
                  Recebi de <strong>{record.patientName}</strong> a quantia de <strong>R$ {record.amount.toFixed(2)}</strong> (método de pagamento: {record.method}), referente ao pagamento de 01 (uma) sessão de <strong>Psicoterapia Individual</strong> realizada no dia <strong>{record.date}</strong>.
                </p>

                <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#475569', marginTop: '14px', fontStyle: 'italic' }}>
                  Este recibo serve para fins de comprovação de despesas de saúde perante o Imposto de Renda (IRPF) e solicitação de reembolso junto ao plano de saúde.
                </p>
              </div>
            </div>

            {/* Receipt Footer & Signature Line */}
            <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '16px', borderTop: '1px dashed #CBD5E1' }}>
              <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '24px' }}>
                São Paulo - SP, {currentDateStr}
              </p>
              
              <div style={{ width: '220px', height: '1px', background: '#334155', margin: '0 auto 6px' }} />
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                {psychologistProfile.name}
              </p>
              <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0' }}>
                Psicóloga Clínica • {psychologistProfile.crp}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
