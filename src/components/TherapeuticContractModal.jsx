import React, { useState, useRef } from 'react';
import { X, Download, FileText, CheckCircle2, Shield, Sparkles, MessageCircle } from 'lucide-react';
import { downloadTherapeuticContractPdf } from '../lib/pdfGenerator';

export default function TherapeuticContractModal({ isOpen, onClose, patient, psychologistProfile, onOpenWhatsAppModal }) {
  if (!isOpen || !patient) return null;

  const [sessionFee, setSessionFee] = useState('R$ 200,00 (duzentos reais)');
  const [sessionFrequency, setSessionFrequency] = useState('Semanal, com duração de 50 minutos');
  const [cancellationNotice, setCancellationNotice] = useState('24 (vinte e quatro) horas');
  const [paymentTerms, setPaymentTerms] = useState('Mensal, até o dia 10 de cada mês via Pix ou transferência');
  const [emergencyContact, setEmergencyContact] = useState('CVV (188) ou Serviço de Atendimento Móvel de Urgência SAMU (192)');

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
      const filename = `Contrato_Terapeutico_${patient.name.replace(/\s+/g, '_')}.pdf`;
      await downloadTherapeuticContractPdf({
        patient,
        psychologistProfile,
        sessionFee,
        sessionFrequency,
        cancellationNotice,
        paymentTerms,
        emergencyContact,
        currentDateStr
      }, filename);
    } catch (err) {
      console.error('Erro ao gerar contrato em PDF:', err);
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
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Contrato de Prestação de Serviços Psicológicos</h3>
              <p style={{ color: '#8FA998', fontSize: '0.78rem' }}>Termo de Consentimento e Acordo de Atendimento Clínico conforme o Código de Ética do CFP</p>
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
              Ajuste das Cláusulas
            </h4>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Valor da Sessão (Honorários)
              </label>
              <input
                type="text"
                value={sessionFee}
                onChange={(e) => setSessionFee(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Frequência e Duração
              </label>
              <input
                type="text"
                value={sessionFrequency}
                onChange={(e) => setSessionFrequency(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Aviso Prévio de Desmarcação
              </label>
              <input
                type="text"
                value={cancellationNotice}
                onChange={(e) => setCancellationNotice(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Forma de Pagamento
              </label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleDownloadPdf}
                disabled={isGenerating}
              >
                <Download size={16} /> {isGenerating ? 'Gerando Contrato...' : 'Baixar Contrato em PDF'}
              </button>

              <button 
                className="btn btn-outline" 
                style={{ borderColor: '#25D366', color: '#16A34A' }}
                onClick={() => {
                  onOpenWhatsAppModal(patient, 'reminder');
                  onClose();
                }}
              >
                <MessageCircle size={16} /> Enviar Contrato via WhatsApp
              </button>
            </div>
          </div>

          {/* Printable A4 Preview Right Column */}
          <div style={{ padding: '1.5rem', background: '#e2e8f0', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div
              ref={printRef}
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '14mm',
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
                  paddingBottom: '10px',
                  marginBottom: '14px'
                }}>
                  <div>
                    <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                      {psychologistProfile.name}
                    </h1>
                    <p style={{ fontSize: '10.5px', color: '#387A66', fontWeight: 600, margin: '2px 0 0' }}>
                      {psychologistProfile.crp} • {psychologistProfile.specialty}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '9.5px', background: '#E4EFEA', color: '#1C3C32', padding: '3px 7px', borderRadius: '4px', fontWeight: 700 }}>
                      CONTRATO TERAPÊUTICO
                    </span>
                  </div>
                </div>

                {/* Contract Title */}
                <h2 style={{ fontSize: '13.5px', fontWeight: 800, textAlign: 'center', color: '#132A23', marginBottom: '14px', textTransform: 'uppercase' }}>
                  Contrato de Prestação de Serviços de Psicoterapia
                </h2>

                {/* Contract Content */}
                <div style={{ fontSize: '10px', lineHeight: 1.4, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'justify' }}>
                  <p style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    Pelo presente instrumento, de um lado <strong>{psychologistProfile.name}</strong> ({psychologistProfile.crp}), doravante denominada PSICÓLOGA, e de outro lado <strong>{patient.name}</strong>, doravante denominado(a) PACIENTE, ajustam as seguintes cláusulas:
                  </p>

                  <p style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong>1. OBJETO E ABORDAGEM:</strong> O presente contrato tem por objetivo a prestação de serviços psicoterapêuticos em nível ambulatorial, visando a promoção da saúde mental e acompanhamento das demandas clínicas do paciente.
                  </p>

                  <p style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong>2. FREQUÊNCIA E DURAÇÃO:</strong> As sessões serão realizadas de forma {sessionFrequency}. O atraso por parte do paciente não prorrogará o tempo de término da sessão.
                  </p>

                  <p style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong>3. HONORÁRIOS E PAGAMENTO:</strong> O valor acordado por sessão é de <strong>{sessionFee}</strong>. O pagamento deverá ser efetuado {paymentTerms}.
                  </p>

                  <p style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong>4. CANCELAMENTOS E FALTAS:</strong> O cancelamento ou remarcação de sessões deve ser comunicado com antecedência mínima de <strong>{cancellationNotice}</strong>. Faltas sem aviso prévio na janela estipulada serão cobradas integralmente.
                  </p>

                  <p style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong>5. SIGILO PROFISSIONAL:</strong> Toda e qualquer informação compartilhada nas sessões é protegida por sigilo ético absoluto (Código de Ética Profissional do Psicólogo), salvo em situações excepcionais de risco iminente à vida ou integridade física do paciente ou de terceiros.
                  </p>

                  <p style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <strong>6. SITUAÇÕES DE EMERGÊNCIA:</strong> A psicoterapia não constitui serviço de plantão de emergência 24h. Em situações de crise grave fora do horário de consulta, o paciente deve contatar {emergencyContact}.
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div style={{ marginTop: '16px', borderTop: '1px dashed #CBD5E1', paddingTop: '10px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: '10px', color: '#64748B', textAlign: 'center', marginBottom: '14px' }}>
                  São Paulo - SP, {currentDateStr}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center' }}>
                  <div>
                    <div style={{ width: '160px', height: '1px', background: '#334155', margin: '0 auto 4px' }} />
                    <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                      {psychologistProfile.name}
                    </p>
                    <p style={{ fontSize: '9.5px', color: '#64748B', margin: '1px 0 0' }}>
                      Psicóloga ({psychologistProfile.crp})
                    </p>
                  </div>

                  <div>
                    <div style={{ width: '160px', height: '1px', background: '#334155', margin: '0 auto 4px' }} />
                    <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#132A23', margin: 0 }}>
                      {patient.name}
                    </p>
                    <p style={{ fontSize: '9.5px', color: '#64748B', margin: '1px 0 0' }}>
                      Paciente / Responsável Legal
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
