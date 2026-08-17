import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, FileText, Sparkles } from 'lucide-react';

export default function UploadAttachmentModal({ isOpen, onClose, onUploadSuccess }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Laudo Externo');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const isPdf = file ? file.name.endsWith('.pdf') : true;
    const fileUrl = file ? URL.createObjectURL(file) : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    const newAttachment = {
      id: `att-${Date.now()}`,
      title,
      category,
      type: isPdf ? 'pdf' : 'image',
      size: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      description: description || 'Documento anexado no prontuário.',
      fileUrl
    };

    onUploadSuccess(newAttachment);
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
      zIndex: 1250,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '520px', background: '#ffffff', padding: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UploadCloud size={22} color="var(--primary-700)" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>Anexar Documento / Laudo</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--neutral-500)" />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--primary-700)' }}>
            <CheckCircle2 size={54} style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.3rem' }}>Documento Anexado com Sucesso!</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
              O arquivo foi salvo e já está disponível no prontuário.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Title & Category */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Título do Documento
              </label>
              <input
                type="text"
                placeholder="Ex: Laudo Médico Psiquiátrico"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.9rem' }}
              >
                <option value="Laudo Externo">Laudo Externo / Médico</option>
                <option value="Encaminhamento">Encaminhamento</option>
                <option value="Receita Controlada">Receita / Prescrição</option>
                <option value="Atividade/Desenho">Atividade / Desenho Escaneado</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* File Dropzone */}
            <div style={{ border: '2px dashed var(--primary-300)', background: 'var(--primary-50)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer' }}>
              <input
                type="file"
                id="file-upload"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <UploadCloud size={32} color="var(--primary-700)" style={{ margin: '0 auto 6px' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                  {file ? file.name : 'Clique para selecionar um arquivo (PDF ou Imagem)'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '2px' }}>
                  Suporta arquivos PDF, PNG ou JPG até 10MB
                </p>
              </label>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Observação / Descrição
              </label>
              <textarea
                rows={2}
                placeholder="Breve nota sobre o conteúdo do documento..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar Anexo no Prontuário
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
