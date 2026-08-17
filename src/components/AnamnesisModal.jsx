import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle, 
  Save, 
  User, 
  Heart, 
  Activity, 
  BookOpen, 
  Users, 
  Smile, 
  Sparkles,
  Shield,
  Printer
} from 'lucide-react';

export default function AnamnesisModal({ 
  isOpen, 
  onClose, 
  patient, 
  onSaveAnamnesis,
  initialModelType = 'adult'
}) {
  const [modelType, setModelType] = useState(initialModelType); // 'adult' | 'child' | 'adolescent'
  const [formValues, setFormValues] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize or populate form values from existing patient anamnesis
  useEffect(() => {
    if (patient && patient.anamnesis) {
      setModelType(patient.anamnesis.modelType || initialModelType);
      setFormValues(patient.anamnesis.data || {});
    } else if (patient) {
      setModelType(initialModelType);
      // Auto-prefill initial demographic data
      setFormValues({
        fullName: patient.name || '',
        age: patient.age ? `${patient.age} anos` : '',
        birthDate: patient.birthDate || '',
        sex: 'Não informado',
        schooling: 'Não informado',
        schoolName: '',
        gradeYear: '',
        maritalStatus: 'Solteiro(a)',
        profession: 'Não informada'
      });
    }
  }, [patient, initialModelType, isOpen]);

  if (!isOpen || !patient) return null;

  const handleChange = (fieldKey, val) => {
    setFormValues(prev => ({ ...prev, [fieldKey]: val }));
  };

  const handleBirthDateChange = (dateVal) => {
    setFormValues(prev => {
      const updated = { ...prev, birthDate: dateVal };
      if (dateVal) {
        const birth = new Date(dateVal);
        const now = new Date();
        let calculatedAge = now.getFullYear() - birth.getFullYear();
        const monthDiff = now.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
          calculatedAge--;
        }
        if (!isNaN(calculatedAge) && calculatedAge >= 0) {
          updated.age = `${calculatedAge} anos`;
        }
      }
      return updated;
    });
  };

  const handleAgeNumberChange = (numVal) => {
    handleChange('age', numVal ? `${numVal} anos` : '');
  };

  const handleSave = (status = 'Concluído') => {
    const payload = {
      modelType,
      status,
      updatedAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: formValues
    };

    onSaveAnamnesis(patient.id, payload);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(12, 22, 19, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} className="animate-fade-in">
      <div 
        className="card"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          padding: 0
        }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-900), var(--primary-700))',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Ficha de Anamnese Psicológica
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#8FA998', marginTop: '2px' }}>
                Paciente: <strong>{patient.name}</strong> • Formulário de Avaliação Clínica
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Model Type Selector Bar */}
        <div style={{
          background: 'var(--neutral-50)',
          borderBottom: '1px solid var(--neutral-200)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-700)' }}>
              Modelo de Anamnese:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className={`btn btn-sm ${modelType === 'adult' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setModelType('adult')}
                style={{ fontSize: '0.78rem' }}
              >
                🧑 Adultos
              </button>
              <button
                type="button"
                className={`btn btn-sm ${modelType === 'child' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setModelType('child')}
                style={{ fontSize: '0.78rem' }}
              >
                🧸 Crianças (Pais/Responsáveis)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${modelType === 'adolescent' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setModelType('adolescent')}
                style={{ fontSize: '0.78rem' }}
              >
                🧑‍🎓 Adolescentes
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handlePrint}
            style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Printer size={14} /> Imprimir / PDF
          </button>
        </div>

        {/* Saved Success Notification */}
        {savedSuccess && (
          <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, borderBottom: '1px solid #86EFAC' }}>
            <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px' }} /> Anamnese salva com sucesso no prontuário!
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ========================================================================= */}
          {/* 1. MODELO ADULTOS */}
          {/* ========================================================================= */}
          {modelType === 'adult' && (
            <>
              {/* Section 1: Dados Pessoais */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="var(--primary-700)" /> 1. Dados Pessoais
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Nome Completo</label>
                    <input type="text" value={formValues.fullName || ''} onChange={e => handleChange('fullName', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Data de Nascimento (Inserção Rápida)</label>
                    <input type="date" value={formValues.birthDate || ''} onChange={e => handleBirthDateChange(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Idade</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--neutral-300)', borderRadius: '6px', overflow: 'hidden' }}>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        placeholder="0"
                        value={(formValues.age || '').toString().replace(/\D/g, '')}
                        onChange={e => handleAgeNumberChange(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', border: 'none', outline: 'none', fontSize: '0.85rem' }}
                      />
                      <span style={{ padding: '0.5rem 0.75rem', background: 'var(--neutral-100)', color: 'var(--neutral-600)', fontSize: '0.8rem', fontWeight: 600, borderLeft: '1px solid var(--neutral-300)' }}>
                        anos
                      </span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Sexo</label>
                    <select
                      value={formValues.sex || 'Feminino'}
                      onChange={e => handleChange('sex', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', background: '#ffffff' }}
                    >
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro / Prefiro não informar</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Estado Civil</label>
                    <select
                      value={formValues.maritalStatus || 'Solteiro(a)'}
                      onChange={e => handleChange('maritalStatus', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', background: '#ffffff' }}
                    >
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="União Estável">União Estável</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Profissão</label>
                    <input type="text" placeholder="Ex: Engenheira de Software" value={formValues.profession || ''} onChange={e => handleChange('profession', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 2: Queixa Principal */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="var(--primary-700)" /> 2. Queixa Principal
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Qual o motivo da consulta?</label>
                    <textarea rows={3} placeholder="Relato inicial do paciente..." value={formValues.consultationReason || ''} onChange={e => handleChange('consultationReason', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Há quanto tempo percebe o problema?</label>
                    <input type="text" placeholder="Ex: Há 6 meses, após mudança de emprego..." value={formValues.durationNotice || ''} onChange={e => handleChange('durationNotice', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como isso tem afetado sua vida pessoal e profissional?</label>
                    <textarea rows={3} placeholder="Impactos no sono, relacionamentos, trabalho..." value={formValues.impactLife || ''} onChange={e => handleChange('impactLife', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 3: Histórico Familiar */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary-700)" /> 3. Histórico Familiar
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como era sua relação com sua família na infância?</label>
                    <textarea rows={2} placeholder="Dinâmica familiar, afeto, cobranças..." value={formValues.familyRelationChildhood || ''} onChange={e => handleChange('familyRelationChildhood', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como é atualmente?</label>
                    <textarea rows={2} placeholder="Convivência e proximidade atual..." value={formValues.familyRelationCurrent || ''} onChange={e => handleChange('familyRelationCurrent', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Há histórico de doenças psicológicas ou psiquiátricas na família?</label>
                    <input type="text" placeholder="Ex: Mãe com histórico de depressão..." value={formValues.familyPsychHistory || ''} onChange={e => handleChange('familyPsychHistory', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 4: Histórico de Saúde */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--primary-700)" /> 4. Histórico de Saúde
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Possui ou já teve doenças graves?</label>
                    <input type="text" placeholder="Cirurgias, condições crônicas..." value={formValues.severeIllnesses || ''} onChange={e => handleChange('severeIllnesses', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Faz uso de medicamentos?</label>
                    <input type="text" placeholder="Nome dos medicamentos e dosagem..." value={formValues.currentMedications || ''} onChange={e => handleChange('currentMedications', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Já realizou acompanhamento psicológico ou psiquiátrico antes?</label>
                    <textarea rows={2} placeholder="Período, abordagens prévias, resultados..." value={formValues.previousTherapyOrPsychiatry || ''} onChange={e => handleChange('previousTherapyOrPsychiatry', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 5: Aspectos Emocionais */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smile size={18} color="var(--primary-700)" /> 5. Aspectos Emocionais
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como você descreveria seu humor no dia a dia?</label>
                    <input type="text" placeholder="Instável, ansioso, calmo, desanimado..." value={formValues.dailyMoodDescription || ''} onChange={e => handleChange('dailyMoodDescription', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Tem episódios de ansiedade, tristeza intensa ou irritabilidade?</label>
                    <textarea rows={2} placeholder="Frequência e gatilhos principais..." value={formValues.anxietySadnessIrritabilityEpisodes || ''} onChange={e => handleChange('anxietySadnessIrritabilityEpisodes', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Já teve pensamentos autodestrutivos ou crises emocionais?</label>
                    <textarea rows={2} placeholder="Histórico de ideação, crises de pânico..." value={formValues.selfHarmOrCrises || ''} onChange={e => handleChange('selfHarmOrCrises', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 6: Rotina e Hábitos */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--primary-700)" /> 6. Rotina e Hábitos
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como é sua rotina diária?</label>
                    <textarea rows={2} placeholder="Horários de trabalho, lazer, descanso..." value={formValues.dailyRoutine || ''} onChange={e => handleChange('dailyRoutine', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Dorme bem? Tem insônia ou acorda cansado?</label>
                    <textarea rows={2} placeholder="Qualidade do sono, horários..." value={formValues.sleepQuality || ''} onChange={e => handleChange('sleepQuality', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Pratica atividades físicas?</label>
                    <input type="text" placeholder="Frequência e modalidade..." value={formValues.physicalActivity || ''} onChange={e => handleChange('physicalActivity', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como é sua alimentação?</label>
                    <input type="text" placeholder="Regular, ansiosa, apetite..." value={formValues.diet || ''} onChange={e => handleChange('diet', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 7: Vida Social e Profissional */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary-700)" /> 7. Vida Social e Profissional
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como é sua relação com amigos e colegas de trabalho?</label>
                    <textarea rows={2} placeholder="Convivência social, ambiente de trabalho..." value={formValues.friendsWorkRelations || ''} onChange={e => handleChange('friendsWorkRelations', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Enfrenta dificuldades no trabalho ou na vida social?</label>
                    <input type="text" placeholder="Conflitos, timidez, estresse excessivo..." value={formValues.workOrSocialDifficulties || ''} onChange={e => handleChange('workOrSocialDifficulties', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Participa de atividades em grupo ou lazer?</label>
                    <input type="text" placeholder="Grupos de interesse, passeios..." value={formValues.groupOrLeisureActivities || ''} onChange={e => handleChange('groupOrLeisureActivities', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 8: Expectativas */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--primary-700)" /> 8. Expectativas
                </h4>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>O que espera do processo terapêutico?</label>
                  <textarea rows={3} placeholder="Objetivos e metas desejadas pelo paciente..." value={formValues.therapeuticProcessExpectations || ''} onChange={e => handleChange('therapeuticProcessExpectations', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 2. MODELO CRIANÇAS (PAIS / RESPONSÁVEIS) */}
          {/* ========================================================================= */}
          {modelType === 'child' && (
            <>
              {/* Section 1: Dados da Criança e Responsável */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="var(--primary-700)" /> 1. Dados da Criança e do Responsável
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Nome Completo da Criança</label>
                    <input type="text" value={formValues.fullName || ''} onChange={e => handleChange('fullName', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Data de Nascimento (Inserção Rápida)</label>
                    <input type="date" value={formValues.birthDate || ''} onChange={e => handleBirthDateChange(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Idade</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--neutral-300)', borderRadius: '6px', overflow: 'hidden' }}>
                      <input
                        type="number"
                        min="0"
                        max="18"
                        placeholder="0"
                        value={(formValues.age || '').toString().replace(/\D/g, '')}
                        onChange={e => handleAgeNumberChange(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', border: 'none', outline: 'none', fontSize: '0.85rem' }}
                      />
                      <span style={{ padding: '0.5rem 0.75rem', background: 'var(--neutral-100)', color: 'var(--neutral-600)', fontSize: '0.8rem', fontWeight: 600, borderLeft: '1px solid var(--neutral-300)' }}>
                        anos
                      </span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Sexo da Criança</label>
                    <select
                      value={formValues.sex || 'Feminino'}
                      onChange={e => handleChange('sex', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', background: '#ffffff' }}
                    >
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro / Prefiro não informar</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Escolaridade e Nome da Escola</label>
                    <input type="text" placeholder="Ex: 3º ano - Colégio Dom Bosco" value={formValues.schoolAndGrade || ''} onChange={e => handleChange('schoolAndGrade', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Nome Completo e Idade do Responsável</label>
                    <input type="text" placeholder="Ex: Maria Silva (Mãe, 38 anos)" value={formValues.guardianNameAndAge || ''} onChange={e => handleChange('guardianNameAndAge', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 2: Queixa Principal */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="var(--primary-700)" /> 2. Queixa Principal (Relato dos Pais)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Qual o motivo da consulta?</label>
                    <textarea rows={3} placeholder="Comportamento, dificuldades emocionais relatadas pelos pais..." value={formValues.consultationReason || ''} onChange={e => handleChange('consultationReason', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Quando começou a notar essa dificuldade/comportamento?</label>
                    <input type="text" placeholder="Ex: Após o nascimento do irmão..." value={formValues.whenNoticed || ''} onChange={e => handleChange('whenNoticed', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Em que momentos ou situações o problema ocorre?</label>
                    <textarea rows={2} placeholder="Em casa, na escola, hora de dormir..." value={formValues.problemMoments || ''} onChange={e => handleChange('problemMoments', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 3: Histórico de Desenvolvimento */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--primary-700)" /> 3. Histórico de Desenvolvimento
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como foi a gestação? Houve complicações?</label>
                    <textarea rows={2} placeholder="Planejamento, intercorrências no parto..." value={formValues.pregnancyGestation || ''} onChange={e => handleChange('pregnancyGestation', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como foi o desenvolvimento motor e da fala?</label>
                    <textarea rows={2} placeholder="Idade que andou, falou as primeiras palavras, desfralde..." value={formValues.motorAndSpeechDev || ''} onChange={e => handleChange('motorAndSpeechDev', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>A criança/adolescente teve doenças significativas?</label>
                    <input type="text" placeholder="Internações, alergias, convulsões..." value={formValues.significantIllnesses || ''} onChange={e => handleChange('significantIllnesses', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 4: Histórico Familiar */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary-700)" /> 4. Histórico Familiar
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Quem mora na mesma casa que a criança/adolescente?</label>
                    <input type="text" placeholder="Pai, mãe, irmãos, avós..." value={formValues.householdMembers || ''} onChange={e => handleChange('householdMembers', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como descreve a relação entre os membros da família?</label>
                    <textarea rows={2} placeholder="Harmoniosa, conflituosa, regras da casa..." value={formValues.familyRelationship || ''} onChange={e => handleChange('familyRelationship', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Há histórico de doenças psicológicas ou psiquiátricas na família?</label>
                    <input type="text" placeholder="Histórico nos pais ou parentes próximos..." value={formValues.familyPsychHistory || ''} onChange={e => handleChange('familyPsychHistory', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 5: Rotina e Hábitos */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--primary-700)" /> 5. Rotina e Hábitos
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como é a rotina da criança/adolescente (escola, lazer, atividades extras)?</label>
                    <textarea rows={2} placeholder="Natação, inglês, horários..." value={formValues.dailyRoutine || ''} onChange={e => handleChange('dailyRoutine', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como são os hábitos de sono e alimentação?</label>
                    <input type="text" placeholder="Dorme sozinho, pesadelos, aceitação dos alimentos..." value={formValues.sleepAndDiet || ''} onChange={e => handleChange('sleepAndDiet', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>A criança/adolescente utiliza dispositivos eletrônicos? Por quanto tempo?</label>
                    <input type="text" placeholder="Celular, videogame, tablet (ex: 2h/dia)..." value={formValues.screenTime || ''} onChange={e => handleChange('screenTime', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 6: Histórico Escolar e Social */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="var(--primary-700)" /> 6. Histórico Escolar e Social
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Há queixas da escola?</label>
                    <input type="text" placeholder="Falta de atenção, agitação..." value={formValues.schoolComplaints || ''} onChange={e => handleChange('schoolComplaints', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como é o desempenho escolar?</label>
                    <input type="text" placeholder="Notas, alfabetização..." value={formValues.schoolPerformance || ''} onChange={e => handleChange('schoolPerformance', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Tem amigos? Participa de atividades em grupo?</label>
                    <input type="text" placeholder="Socialização, isolamento, brincadeiras..." value={formValues.friendsAndGroups || ''} onChange={e => handleChange('friendsAndGroups', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 7: Intervenções Anteriores & Expectativas */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--primary-700)" /> 7. Intervenções Anteriores & Expectativas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Já realizou alguma terapia ou atendimento psicológico? Fez uso de medicamentos?</label>
                    <textarea rows={2} placeholder="Fonoaudiologia, psicopedagogia, medicação..." value={formValues.previousTherapy || ''} onChange={e => handleChange('previousTherapy', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>O que espera do atendimento psicológico?</label>
                    <textarea rows={2} placeholder="Expectativa dos pais em relação à evolução..." value={formValues.psychologicalCareExpectations || ''} onChange={e => handleChange('psychologicalCareExpectations', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* 3. MODELO ADOLESCENTES */}
          {/* ========================================================================= */}
          {modelType === 'adolescent' && (
            <>
              {/* Section 1: Dados Pessoais */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="var(--primary-700)" /> 1. Dados Pessoais (Adolescente)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Nome Completo</label>
                    <input type="text" value={formValues.fullName || ''} onChange={e => handleChange('fullName', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Data de Nascimento (Inserção Rápida)</label>
                    <input type="date" value={formValues.birthDate || ''} onChange={e => handleBirthDateChange(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Idade</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--neutral-300)', borderRadius: '6px', overflow: 'hidden' }}>
                      <input
                        type="number"
                        min="0"
                        max="21"
                        placeholder="0"
                        value={(formValues.age || '').toString().replace(/\D/g, '')}
                        onChange={e => handleAgeNumberChange(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', border: 'none', outline: 'none', fontSize: '0.85rem' }}
                      />
                      <span style={{ padding: '0.5rem 0.75rem', background: 'var(--neutral-100)', color: 'var(--neutral-600)', fontSize: '0.8rem', fontWeight: 600, borderLeft: '1px solid var(--neutral-300)' }}>
                        anos
                      </span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Sexo</label>
                    <select
                      value={formValues.sex || 'Feminino'}
                      onChange={e => handleChange('sex', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', background: '#ffffff' }}
                    >
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro / Prefiro não informar</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Escolaridade / Série</label>
                    <input type="text" placeholder="Ex: 1º Ano do Ensino Médio" value={formValues.gradeYear || ''} onChange={e => handleChange('gradeYear', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Nome da Escola</label>
                    <input type="text" placeholder="Nome da instituição..." value={formValues.schoolName || ''} onChange={e => handleChange('schoolName', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 2: Queixa Principal */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="var(--primary-700)" /> 2. Queixa Principal
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>O que te trouxe para a consulta?</label>
                    <textarea rows={2} placeholder="Motivo relatado pelo próprio adolescente..." value={formValues.whatBroughtYou || ''} onChange={e => handleChange('whatBroughtYou', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Quando começou a perceber essa dificuldade?</label>
                    <input type="text" placeholder="Ex: No início deste ano escolar..." value={formValues.whenNoticedDifficulty || ''} onChange={e => handleChange('whenNoticedDifficulty', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como isso tem impactado sua vida (escola, amizades, família)?</label>
                    <textarea rows={2} placeholder="Impactos na rotina, notas, conversas com amigos..." value={formValues.lifeImpact || ''} onChange={e => handleChange('lifeImpact', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 3: Histórico Familiar */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary-700)" /> 3. Histórico Familiar
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Quem mora com você atualmente?</label>
                    <input type="text" placeholder="Ex: Pai, mãe e irmão mais novo..." value={formValues.whoLivesWithYou || ''} onChange={e => handleChange('whoLivesWithYou', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como você descreve sua relação com sua família?</label>
                    <textarea rows={2} placeholder="Boa, distante, cheia de regras..." value={formValues.familyRelationDescription || ''} onChange={e => handleChange('familyRelationDescription', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Há conflitos familiares? Se sim, como são resolvidos?</label>
                    <textarea rows={2} placeholder="Discussões, diálogo, silêncio..." value={formValues.familyConflictsAndResolution || ''} onChange={e => handleChange('familyConflictsAndResolution', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 4: Histórico Escolar e Social */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="var(--primary-700)" /> 4. Histórico Escolar e Social
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Você gosta de ir à escola? Por quê?</label>
                    <textarea rows={2} placeholder="Gosto por causa dos amigos / não gosto das aulas..." value={formValues.likeSchoolReason || ''} onChange={e => handleChange('likeSchoolReason', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como você se relaciona com colegas e professores?</label>
                    <textarea rows={2} placeholder="Respeito, timidez, amizades próximas..." value={formValues.peersAndTeachersRelations || ''} onChange={e => handleChange('peersAndTeachersRelations', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Tem dificuldades em alguma matéria?</label>
                    <input type="text" placeholder="Ex: Matemática, física..." value={formValues.subjectDifficulties || ''} onChange={e => handleChange('subjectDifficulties', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 5: Aspectos Emocionais e Comportamentais */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smile size={18} color="var(--primary-700)" /> 5. Aspectos Emocionais e Comportamentais
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Como você se sente no dia a dia?</label>
                    <input type="text" placeholder="Tranquilo, ansioso, cansado..." value={formValues.dailyFeelings || ''} onChange={e => handleChange('dailyFeelings', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Tem algo que te deixa muito feliz ou muito triste?</label>
                    <textarea rows={2} placeholder="Gatilhos emocionais do adolescente..." value={formValues.happyOrSadTriggers || ''} onChange={e => handleChange('happyOrSadTriggers', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Você já teve pensamentos negativos sobre si mesmo ou sua vida?</label>
                    <textarea rows={2} placeholder="Cobrança pessoal, autocrítica, desesperança..." value={formValues.negativeSelfThoughts || ''} onChange={e => handleChange('negativeSelfThoughts', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>

              {/* Section 6: Saúde, Hábitos e Expectativas */}
              <div className="card" style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--primary-700)" /> 6. Saúde, Hábitos & Expectativas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Pratica atividades físicas? Quais?</label>
                    <input type="text" placeholder="Futebol, academia, dança..." value={formValues.physicalActivities || ''} onChange={e => handleChange('physicalActivities', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>Dorme bem? Tem dificuldades para dormir ou pesadelos?</label>
                    <input type="text" placeholder="Horários de dormir, insônia..." value={formValues.sleepAndNightmares || ''} onChange={e => handleChange('sleepAndNightmares', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>O que você espera dessa consulta?</label>
                    <textarea rows={2} placeholder="Objetivos do adolescente..." value={formValues.consultationExpectations || ''} onChange={e => handleChange('consultationExpectations', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          background: 'var(--neutral-50)',
          borderTop: '1px solid var(--neutral-200)',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="var(--primary-700)" />
            <span>Formulário seguro do prontuário restrito da psicóloga.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => handleSave('Em Andamento')}
              style={{ fontSize: '0.85rem' }}
            >
              Salvar Rascunho
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSave('Concluído')}
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={16} /> Finalizar e Salvar Anamnese
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
