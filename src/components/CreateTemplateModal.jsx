import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Sparkles, CheckCircle2, Layers, Image as ImageIcon, Upload, FileImage } from 'lucide-react';

export default function CreateTemplateModal({ isOpen, onClose, onCreateTemplate }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cognitivo');
  const [description, setDescription] = useState('');
  const [activityImage, setActivityImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const fileInputRef = useRef(null);

  const [fields, setFields] = useState([
    { name: 'field_1', label: 'Qual foi o evento ou situação gatilho?', type: 'textarea' },
    { name: 'field_2', label: 'Em uma escala de 1 a 10, qual foi a intensidade da emoção?', type: 'scale' }
  ]);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setActivityImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setActivityImage(null);
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddField = () => {
    const nextId = `field_${fields.length + 1}`;
    setFields([...fields, { name: nextId, label: '', type: 'textarea' }]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, idx) => idx !== index));
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || fields.length === 0) return;

    const newTemplate = {
      id: `tpl-${Date.now()}`,
      title,
      type: title,
      category,
      description: description || 'Exercício personalizado criado pela psicóloga.',
      imageUrl: activityImage,
      fields
    };

    onCreateTemplate(newTemplate);
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
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '680px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-100)', padding: '8px', borderRadius: '10px', color: 'var(--primary-800)' }}>
              <Layers size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>Criador Personalizado de Atividades</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>Monte um novo formulário de exercício terapêutico com imagens ilustrativas</p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--neutral-500)" />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--primary-700)' }}>
            <CheckCircle2 size={54} style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.3rem' }}>Modelo Criado com Sucesso!</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
              O novo exercício já está disponível em sua biblioteca de atividades.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '4px' }}>
            
            {/* Title & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Título da Atividade *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Diário de Gratidão e Ancoragem"
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
                  <option value="Cognitivo">Cognitivo / Psicoterapia</option>
                  <option value="Comportamental">Comportamental</option>
                  <option value="Ansiedade">Ansiedade & Fobia</option>
                  <option value="Mindfulness">Mindfulness & Ancoragem</option>
                  <option value="Autoestima">Autoestima & Emoções</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Descrição / Orientação Inicial
              </label>
              <textarea
                rows={2}
                placeholder="Explicação simples sobre o objetivo deste exercício para o paciente..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
              />
            </div>

            {/* IMAGE IMPORT SECTION & THUMBNAIL PREVIEW */}
            <div style={{ background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ImageIcon size={16} color="var(--primary-700)" /> Imagem Ilustrativa / Diagrama da Atividade
              </label>

              {!activityImage ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="activity-image-input"
                  />
                  <label
                    htmlFor="activity-image-input"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.25rem',
                      border: '2px dashed var(--primary-300)',
                      borderRadius: 'var(--radius-md)',
                      background: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Upload size={24} color="var(--primary-700)" style={{ marginBottom: '6px' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                      Clique para importar uma imagem (PNG, JPG, WEBP)
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '2px' }}>
                      Adicione infográficos, esquemas de emoções ou diagramas terapêuticos
                    </span>
                  </label>
                </div>
              ) : (
                /* THUMBNAIL PREVIEW BOX */
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#ffffff',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--primary-300)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  {/* Thumbnail Image */}
                  <div style={{ position: 'relative', width: '120px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--neutral-300)' }}>
                    <img
                      src={activityImage}
                      alt="Miniatura da Atividade"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Image Metadata */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <FileImage size={15} color="var(--primary-700)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-900)', wordBreak: 'break-all' }}>
                        {imageFileName || 'Imagem Ilustrativa Importada'}
                      </span>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      Miniatura Gerada • Pronta para Envio
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#DC2626', borderColor: '#FCA5A5', background: '#FEF2F2' }}
                    title="Remover Imagem Importada"
                  >
                    <Trash2 size={14} /> Remover
                  </button>
                </div>
              )}
            </div>

            {/* Form Builder Questions */}
            <div style={{ borderTop: '1px solid var(--neutral-200)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Perguntas do Formulário ({fields.length})
                </h4>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddField}>
                  <Plus size={14} /> Adicionar Pergunta
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {fields.map((f, idx) => (
                  <div key={idx} style={{ background: 'var(--neutral-50)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)', minWidth: '20px' }}>
                      #{idx + 1}
                    </span>

                    <input
                      type="text"
                      placeholder="Pergunta ou instrução para o paciente..."
                      value={f.label}
                      onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
                      required
                    />

                    <select
                      value={f.type}
                      onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
                    >
                      <option value="textarea">Texto Livre</option>
                      <option value="scale">Escala 1 a 10</option>
                      <option value="text">Resposta Curta</option>
                    </select>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-terracotta)', padding: '4px' }}
                        title="Remover pergunta"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <Sparkles size={16} /> Salvar Modelo na Biblioteca
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
