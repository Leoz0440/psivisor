import React, { useState } from 'react';
import { 
  Paperclip, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Eye, 
  Download, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  File,
  X
} from 'lucide-react';

export default function PatientAttachmentsView({ patient, onOpenUploadModal }) {
  // Sample initial attachments for this patient
  const [attachments, setAttachments] = useState([
    {
      id: 'att-1',
      title: 'Laudo de Avaliação Neuropsicológica',
      category: 'Laudo Externo',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '2026-07-20',
      description: 'Avaliação realizada pelo Dr. Rodrigo Mendes (CRM 12458) indicando traços de TDAH.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      id: 'att-2',
      title: 'Relatório de Encaminhamento Psiquiátrico',
      category: 'Encaminhamento',
      type: 'pdf',
      size: '1.1 MB',
      uploadDate: '2026-08-02',
      description: 'Prescrição e receita controlada enviada pelo psiquiatra assistente.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      id: 'att-3',
      title: 'Desenho de Ancoragem e Genograma Familiar',
      category: 'Atividade Física/Desenho',
      type: 'image',
      size: '3.8 MB',
      uploadDate: '2026-08-09',
      description: 'Fotografia da atividade de mapa conceitual familiar realizada em sessão presencial.',
      fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800'
    }
  ]);

  // Preview Modal state
  const [previewFile, setPreviewFile] = useState(null);

  const handleDeleteAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--neutral-50))', border: '1px solid var(--primary-300)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success mb-1">
              <Sparkles size={12} /> Documentos Multimídia & Exames
            </span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>
              Anexos, Laudos e Documentos Externos
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginTop: '2px' }}>
              Armazene laudos médicos, receitas, encaminhamentos e atividades fotografadas no prontuário.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onOpenUploadModal}>
            <Plus size={16} /> Anexar Novo Documento
          </button>
        </div>
      </div>

      {/* Attachments List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {attachments.map((att) => (
          <div key={att.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-info">{att.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{att.size}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ background: att.type === 'pdf' ? '#FEE2E2' : '#DBEAFE', padding: '10px', borderRadius: '10px', color: att.type === 'pdf' ? '#991B1B' : '#1E40AF' }}>
                  {att.type === 'pdf' ? <FileText size={22} /> : <ImageIcon size={22} />}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', fontWeight: 700 }}>{att.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '2px' }}>
                    Enviado em {att.uploadDate}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--neutral-700)', marginTop: '10px', lineHeight: 1.4 }}>
                "{att.description}"
              </p>
            </div>

            {/* Card Actions */}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '0.5rem', borderTop: '1px solid var(--neutral-200)' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ flex: 1 }}
                onClick={() => setPreviewFile(att)}
              >
                <Eye size={14} /> Visualizar
              </button>
              <a 
                href={att.fileUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-outline btn-sm"
                title="Download do arquivo original"
              >
                <Download size={14} />
              </a>
              <button 
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--accent-terracotta)', borderColor: 'var(--accent-terracotta-light)' }}
                onClick={() => handleDeleteAttachment(att.id)}
                title="Remover anexo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Preview Modal */}
      {previewFile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
          padding: '1.5rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '840px', maxHeight: '90vh', background: '#ffffff', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
            
            {/* Lightbox Header */}
            <div style={{ padding: '1rem 1.5rem', background: 'var(--primary-900)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#ffffff', fontSize: '1.1rem' }}>{previewFile.title}</h3>
                <span style={{ color: '#8FA998', fontSize: '0.78rem' }}>Categoria: {previewFile.category}</span>
              </div>
              <button onClick={() => setPreviewFile(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={22} color="#ffffff" />
              </button>
            </div>

            {/* Lightbox Content Viewer */}
            <div style={{ flex: 1, padding: '1rem', background: '#0F172A', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              {previewFile.type === 'image' ? (
                <img 
                  src={previewFile.fileUrl} 
                  alt={previewFile.title} 
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} 
                />
              ) : (
                <iframe 
                  src={previewFile.fileUrl} 
                  title={previewFile.title} 
                  style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '8px', background: '#ffffff' }} 
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
