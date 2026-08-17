import React, { useState } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  User, 
  Calendar, 
  Smile, 
  Frown, 
  Meh, 
  TrendingDown, 
  ShieldCheck,
  Activity,
  Heart,
  LogOut,
  BookOpen,
  Plus,
  Eye,
  FileText,
  Wind,
  Target,
  Flame,
  CheckSquare,
  Square
} from 'lucide-react';
import { psychologistProfile } from '../data/mockData';
import PatientBreathingModal from './PatientBreathingModal';

export const MOOD_OPTIONS = [
  { id: 'calma', label: 'Calma', emoji: '😌' },
  { id: 'feliz', label: 'Feliz', emoji: '🙂' },
  { id: 'energetica', label: 'Energética', emoji: '⚡' },
  { id: 'alegre', label: 'Alegre', emoji: '😜' },
  { id: 'mudancas_humor', label: 'Mudanças de humor', emoji: '😢' },
  { id: 'irritada', label: 'Irritada', emoji: '😡' },
  { id: 'triste', label: 'Triste', emoji: '🥺' },
  { id: 'ansiosa', label: 'Ansiosa', emoji: '😰' },
  { id: 'desanimada', label: 'Desanimada', emoji: '🙁' },
  { id: 'culpada', label: 'Culpada', emoji: '😔' },
  { id: 'pensamentos_obsessivos', label: 'Pensamentos obsessivos', emoji: '🤯' },
  { id: 'pouca_energia', label: 'Pouca energia', emoji: '🔋' },
  { id: 'apatica', label: 'Apática', emoji: '😐' },
  { id: 'confusa', label: 'Confusa', emoji: '😕' },
  { id: 'muito_autocritica', label: 'Muito autocrítica', emoji: '💥' }
];

export const PHYSICAL_ACTIVITY_OPTIONS = [
  { id: 'nao_exercitei', label: 'Não me exercitei', emoji: '🚫' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'academia', label: 'Academia', emoji: '🏋️' },
  { id: 'aerobica_danca', label: 'Aeróbica e dança', emoji: '🎵' },
  { id: 'natacao', label: 'Natação', emoji: '🏊' },
  { id: 'esportes_equipe', label: 'Esportes de equipe', emoji: '🏀' },
  { id: 'corrida', label: 'Corrida', emoji: '🏃' },
  { id: 'ciclismo', label: 'Ciclismo', emoji: '🚴' },
  { id: 'caminhada', label: 'Caminhada', emoji: '👟' }
];

export const OTHER_FACTORS_OPTIONS = [
  { id: 'viagem', label: 'Viagem', emoji: '📍' },
  { id: 'estresse', label: 'Estresse', emoji: '⚡' },
  { id: 'meditacao', label: 'Meditação', emoji: '🪷' },
  { id: 'exercicios_respiracao', label: 'Exercícios de respiração', emoji: '🫁' },
  { id: 'doenca_ferimento', label: 'Doença ou ferimento', emoji: '🩹' },
  { id: 'alcool', label: 'Álcool', emoji: '🍷' },
  { id: 'provas', label: 'Provas', emoji: '📝' },
  { id: 'crise_ansiedade', label: 'Crise de ansiedade', emoji: '⚡' },
  { id: 'discussoes', label: 'Discussões', emoji: '🗣️' },
  { id: 'drogas', label: 'Drogas', emoji: '💊' },
  { id: 'gastos', label: 'Gastos', emoji: '💸' }
];

export default function PatientPortal({ patients, onPatientSubmitResponse, onSaveJournalEntry, activePatientId, onLogoutPatient }) {
  // Find current logged in patient (default to Mariana Silva p1)
  const currentPatient = patients.find(p => p.id === (activePatientId || 'p1')) || patients[0];

  const [activeTab, setActiveTab] = useState('activities'); // 'activities', 'journal', 'goals'
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);

  // Patient Goals State
  const [patientGoals, setPatientGoals] = useState([
    { id: 'g1', title: 'Praticar técnica de respiração 4-7-8 antes de dormir', completed: true, streakDays: 4 },
    { id: 'g2', title: 'Caminhada ao ar livre de 20 minutos', completed: true, streakDays: 3 },
    { id: 'g3', title: 'Anotar 1 pensamento automático no Diário quando sentir ansiedade', completed: false, streakDays: 2 },
    { id: 'g4', title: 'Higiene do sono: Desligar telas às 22:30', completed: false, streakDays: 5 }
  ]);

  // Patient Journal Entries (Synced with Patient Model Data)
  const journalEntries = currentPatient ? (currentPatient.journalEntries || []) : [];

  const [isAddingJournal, setIsAddingJournal] = useState(false);
  const [newJournalText, setNewJournalText] = useState('');
  const [selectedMoods, setSelectedMoods] = useState(['Calma']);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedOthers, setSelectedOthers] = useState([]);

  const toggleMood = (label) => {
    setSelectedMoods(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const toggleActivity = (label) => {
    setSelectedActivities(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const toggleOther = (label) => {
    setSelectedOthers(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  // Filter ONLY activities belonging to THIS active patient
  const patientActivities = currentPatient ? (currentPatient.activities || []) : [];

  const handleOpenActivity = (act) => {
    setSelectedActivity(act);
    setFormValues({});
    setSubmittedSuccess(false);
  };

  const handleToggleGoal = (goalId) => {
    setPatientGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const nextState = !g.completed;
        return {
          ...g,
          completed: nextState,
          streakDays: nextState ? g.streakDays + 1 : Math.max(0, g.streakDays - 1)
        };
      }
      return g;
    }));
  };

  const handleInputChange = (fieldKey, val) => {
    setFormValues(prev => ({ ...prev, [fieldKey]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedActivity) return;

    onPatientSubmitResponse(currentPatient.id, selectedActivity.id, {
      ...formValues,
      submittedAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setSelectedActivity(null);
    }, 1500);
  };

  const handleSaveJournal = (e) => {
    e.preventDefault();
    if (!newJournalText.trim() && selectedMoods.length === 0 && selectedActivities.length === 0 && selectedOthers.length === 0) return;

    const newEntry = {
      id: `j-${Date.now()}`,
      date: 'Hoje, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      moods: [...selectedMoods],
      activities: [...selectedActivities],
      others: [...selectedOthers],
      mood: selectedMoods.length > 0 
        ? selectedMoods.map(m => {
            const found = MOOD_OPTIONS.find(opt => opt.label === m);
            return `${found ? found.emoji : '😊'} ${m}`;
          }).join(', ') 
        : 'Não informado',
      text: newJournalText
    };

    // Save directly to patient data store & service
    if (onSaveJournalEntry) {
      onSaveJournalEntry(currentPatient.id, newEntry);
    }

    // Push summary directly to psychologist's records stream
    const summaryParts = [];
    if (selectedMoods.length > 0) summaryParts.push(`Humor: [${selectedMoods.join(', ')}]`);
    if (selectedActivities.length > 0) summaryParts.push(`Atividade Física: [${selectedActivities.join(', ')}]`);
    if (selectedOthers.length > 0) summaryParts.push(`Outros: [${selectedOthers.join(', ')}]`);

    if (onPatientSubmitResponse) {
      onPatientSubmitResponse(currentPatient.id, 'act-journal-daily', {
        situation: `Diário: ${summaryParts.join(' • ') || 'Anotação'}`,
        thought: newJournalText || 'Sem anotação de texto',
        submittedAt: 'Hoje no Diário'
      });
    }

    setNewJournalText('');
    setSelectedMoods(['Calma']);
    setSelectedActivities([]);
    setSelectedOthers([]);
    setIsAddingJournal(false);
  };

  // Calculate goal stats
  const completedGoalsCount = patientGoals.filter(g => g.completed).length;
  const goalProgressPercentage = Math.round((completedGoalsCount / patientGoals.length) * 100);

  return (
    <div style={{
      maxWidth: '540px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Patient Header: Strict Privacy Guarantee */}
      <header style={{
        background: 'linear-gradient(135deg, #132A23, #1C3C32)',
        color: '#ffffff',
        padding: '1.25rem 1.5rem',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem'
      }}>
        {/* Top Bar with Psychologist Info & SOS Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/psivisor_logo_concept_1.jpg"
              alt="PsiVisor"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8FA998', textTransform: 'uppercase', fontWeight: 700 }}>
                Portal do Paciente • PsiVisor
              </span>
              <h2 style={{ fontSize: '1rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                {psychologistProfile.name}
              </h2>
              <span style={{ fontSize: '0.725rem', color: '#A3B8AD', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={12} /> {psychologistProfile.crp}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsBreathingModalOpen(true)}
              style={{
                background: '#4B9B82',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(75, 155, 130, 0.4)'
              }}
            >
              <Wind size={14} /> SOS Calma
            </button>

            {onLogoutPatient && (
              <button
                onClick={onLogoutPatient}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <LogOut size={14} /> Sair
              </button>
            )}
          </div>
        </div>

        {/* Patient Profile Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: '0.875rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={currentPatient.avatar}
              alt={currentPatient.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #ffffff', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 700 }}>
                {currentPatient.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#8FA998' }}>
                Próxima sessão: <strong>{currentPatient.sessionDay} às 14:00</strong>
              </p>
            </div>
          </div>

          <span className="badge" style={{ background: '#4B9B82', color: '#ffffff', fontSize: '0.7rem' }}>
            Área do Paciente
          </span>
        </div>

        {/* Patient Tabs Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => { setActiveTab('activities'); setSelectedActivity(null); }}
            style={{
              padding: '6px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'activities' ? '#ffffff' : 'transparent',
              color: activeTab === 'activities' ? 'var(--primary-900)' : '#A3B8AD',
              fontWeight: activeTab === 'activities' ? 700 : 500,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            📋 Atividades Terapêuticas
          </button>

          <button
            onClick={() => { setActiveTab('journal'); setSelectedActivity(null); }}
            style={{
              padding: '6px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'journal' ? '#ffffff' : 'transparent',
              color: activeTab === 'journal' ? 'var(--primary-900)' : '#A3B8AD',
              fontWeight: activeTab === 'journal' ? 700 : 500,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            📝 Diário
          </button>

          <button
            onClick={() => { setActiveTab('goals'); setSelectedActivity(null); }}
            style={{
              padding: '6px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'goals' ? '#ffffff' : 'transparent',
              color: activeTab === 'goals' ? 'var(--primary-900)' : '#A3B8AD',
              fontWeight: activeTab === 'goals' ? 700 : 500,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            🎯 Minhas Metas
          </button>
        </div>
      </header>

      {/* Main Patient Content Area */}
      <main style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* TAB 1: ACTIVITIES */}
        {activeTab === 'activities' && (
          <>
            {selectedActivity ? (
              <div className="card animate-fade-in" style={{ background: '#ffffff', padding: '1.5rem', border: '1.5px solid var(--primary-300)' }}>
                <button
                  onClick={() => setSelectedActivity(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary-700)', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  ← Voltar para Minhas Atividades
                </button>

                <div style={{ marginBottom: '1.25rem' }}>
                  <span className="badge badge-info mb-1">{selectedActivity.type || 'Exercício Terapêutico'}</span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>{selectedActivity.title}</h3>
                  
                  {selectedActivity.imageUrl && (
                    <div style={{ height: '160px', width: '100%', borderRadius: '8px', overflow: 'hidden', margin: '10px 0', border: '1px solid var(--neutral-200)' }}>
                      <img src={selectedActivity.imageUrl} alt={selectedActivity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  {selectedActivity.customMessage && (
                    <div style={{ background: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-700)', margin: '8px 0', fontSize: '0.85rem', color: 'var(--primary-900)' }}>
                      <strong>Orientação da sua Psicóloga:</strong> {selectedActivity.customMessage}
                    </div>
                  )}

                  <p style={{ fontSize: '0.825rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
                    {selectedActivity.description || selectedActivity.instructions || 'Preencha os campos abaixo conforme orientado pela sua psicóloga.'}
                  </p>
                </div>

                {submittedSuccess ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--primary-700)' }}>
                    <CheckCircle2 size={48} style={{ margin: '0 auto 10px' }} />
                    <h4 style={{ fontSize: '1.2rem' }}>Exercício Enviado com Sucesso!</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
                      Sua psicóloga {psychologistProfile.name} receberá sua resposta no prontuário.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {selectedActivity.fields && Array.isArray(selectedActivity.fields) && selectedActivity.fields.length > 0 ? (
                      selectedActivity.fields.map((f, idx) => (
                        <div key={idx}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)', display: 'block', marginBottom: '4px' }}>
                            {idx + 1}. {f.label || `Pergunta ${idx + 1}`}
                          </label>
                          {f.type === 'scale' ? (
                            <select
                              value={formValues[f.name || `field_${idx+1}`] || '7'}
                              onChange={(e) => handleInputChange(f.name || `field_${idx+1}`, e.target.value)}
                              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                            >
                              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <option key={n} value={n}>{n}/10</option>
                              ))}
                            </select>
                          ) : f.type === 'text' ? (
                            <input
                              type="text"
                              placeholder="Sua resposta..."
                              value={formValues[f.name || `field_${idx+1}`] || ''}
                              onChange={(e) => handleInputChange(f.name || `field_${idx+1}`, e.target.value)}
                              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                              required
                            />
                          ) : (
                            <textarea
                              rows={3}
                              placeholder="Descreva aqui sua resposta..."
                              value={formValues[f.name || `field_${idx+1}`] || ''}
                              onChange={(e) => handleInputChange(f.name || `field_${idx+1}`, e.target.value)}
                              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                              required
                            />
                          )}
                        </div>
                      ))
                    ) : selectedActivity.type === 'Reflexão' || selectedActivity.type === 'RPD' || !selectedActivity.type ? (
                      <>
                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)', display: 'block', marginBottom: '4px' }}>
                            1. Qual foi a situação ou gatilho?
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Ex: Tive uma apresentação no trabalho..."
                            value={formValues.situation || ''}
                            onChange={(e) => handleInputChange('situation', e.target.value)}
                            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                            required
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)', display: 'block', marginBottom: '4px' }}>
                            2. Qual pensamento veio à sua mente?
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Ex: Vão achar que não sei nada..."
                            value={formValues.thought || ''}
                            onChange={(e) => handleInputChange('thought', e.target.value)}
                            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                            required
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)', display: 'block', marginBottom: '4px' }}>
                            3. Qual emoção você sentiu e qual a intensidade (1 a 10)?
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                            <input
                              type="text"
                              placeholder="Ex: Ansiedade, Medo"
                              value={formValues.emotion || ''}
                              onChange={(e) => handleInputChange('emotion', e.target.value)}
                              style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                            />
                            <select
                              value={formValues.intensity || '7'}
                              onChange={(e) => handleInputChange('intensity', e.target.value)}
                              style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                            >
                              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <option key={n} value={n}>{n}/10</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-900)', display: 'block', marginBottom: '4px' }}>
                            4. Perspectiva Reflexiva / Alternativa
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Ex: Eu me preparei bem e erros fazem parte do aprendizado..."
                            value={formValues.rationalResponse || ''}
                            onChange={(e) => handleInputChange('rationalResponse', e.target.value)}
                            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-300)', background: 'var(--primary-50)', fontSize: '0.875rem' }}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)', display: 'block', marginBottom: '4px' }}>
                          Sua Resposta do Exercício
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Descreva aqui o resultado do exercício..."
                          value={formValues.generalAnswer || ''}
                          onChange={(e) => handleInputChange('generalAnswer', e.target.value)}
                          style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                          required
                        />
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}>
                      <Send size={16} /> Enviar Resposta para Dra. {psychologistProfile.name}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={18} color="var(--primary-700)" />
                  Suas Atividades Terapêuticas Passadas
                </h3>

                {patientActivities.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--neutral-500)' }}>
                    <Smile size={36} color="var(--primary-400)" style={{ margin: '0 auto 8px' }} />
                    <p>Você não possui nenhuma atividade pendente no momento!</p>
                  </div>
                ) : (
                  patientActivities.map((act) => {
                    const isDone = act.status === 'Concluído';
                    return (
                      <div 
                        key={act.id} 
                        className="card"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                          borderLeft: isDone ? '4px solid #16A34A' : '4px solid var(--accent-amber)',
                          background: '#ffffff'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>{act.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                              Prazo: {act.dueDate}
                            </span>
                          </div>

                          <span className={`badge ${isDone ? 'badge-success' : 'badge-warning'}`}>
                            {isDone ? 'Concluído' : 'Pendente'}
                          </span>
                        </div>

                        {!isDone ? (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ alignSelf: 'flex-end', marginTop: '4px' }}
                            onClick={() => handleOpenActivity(act)}
                          >
                            Preencher Exercício Agora
                          </button>
                        ) : (
                          <div style={{ background: 'var(--neutral-50)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-200)', fontSize: '0.8rem', color: 'var(--neutral-700)' }}>
                            <strong>Sua resposta enviada:</strong> "{act.patientResponse?.rationalResponse || act.patientResponse?.thought || 'Resposta enviada'}"
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}

        {/* TAB 2: DAILY JOURNAL */}
        {activeTab === 'journal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', fontWeight: 700 }}>
                  Seu Diário Emocional
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                  Anotações compartilhadas diretamente com sua psicóloga.
                </p>
              </div>

              {!isAddingJournal && (
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddingJournal(true)}>
                  <Plus size={14} /> Nova Anotação
                </button>
              )}
            </div>

            {/* New Entry Form Drawer */}
            {isAddingJournal && (
              <form onSubmit={handleSaveJournal} className="card animate-fade-in" style={{ background: '#ffffff', border: '1.5px solid var(--primary-300)', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', fontWeight: 700 }}>
                  Como foi seu dia? Registre seus momentos
                </h4>

                {/* SECTION 1: HUMOR */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                      Humor
                    </label>
                    <span style={{ fontSize: '0.725rem', color: 'var(--neutral-500)' }}>Selecione um ou mais</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {MOOD_OPTIONS.map((opt) => {
                      const isSelected = selectedMoods.includes(opt.label);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleMood(opt.label)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: isSelected ? '1.5px solid var(--primary-700)' : '1px solid #FED7AA',
                            background: isSelected ? '#FFEDD5' : '#FFF7ED',
                            color: '#7C2D12',
                            fontSize: '0.825rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            boxShadow: isSelected ? '0 2px 6px rgba(124, 45, 18, 0.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{
                            background: '#FFEDD5',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.95rem'
                          }}>
                            {opt.emoji}
                          </span>
                          <span>{opt.label}</span>
                          {isSelected && <span style={{ marginLeft: '2px', fontWeight: 800 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 2: ATIVIDADE FÍSICA */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                      Atividade física
                    </label>
                    <span style={{ fontSize: '0.725rem', color: 'var(--neutral-500)' }}>Selecione uma ou mais</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {PHYSICAL_ACTIVITY_OPTIONS.map((opt) => {
                      const isSelected = selectedActivities.includes(opt.label);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleActivity(opt.label)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: isSelected ? '1.5px solid var(--primary-700)' : '1px solid #A7F3D0',
                            background: isSelected ? '#D1FAE5' : '#ECFDF5',
                            color: '#065F46',
                            fontSize: '0.825rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            boxShadow: isSelected ? '0 2px 6px rgba(6, 95, 70, 0.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{
                            background: '#D1FAE5',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.95rem'
                          }}>
                            {opt.emoji}
                          </span>
                          <span>{opt.label}</span>
                          {isSelected && <span style={{ marginLeft: '2px', fontWeight: 800 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 3: OUTROS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                      Outros
                    </label>
                    <span style={{ fontSize: '0.725rem', color: 'var(--neutral-500)' }}>Selecione um ou mais</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {OTHER_FACTORS_OPTIONS.map((opt) => {
                      const isSelected = selectedOthers.includes(opt.label);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleOther(opt.label)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: isSelected ? '1.5px solid var(--primary-700)' : '1px solid #FED7AA',
                            background: isSelected ? '#FFEDD5' : '#FFF7ED',
                            color: '#7C2D12',
                            fontSize: '0.825rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            boxShadow: isSelected ? '0 2px 6px rgba(124, 45, 18, 0.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{
                            background: '#FFEDD5',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.95rem'
                          }}>
                            {opt.emoji}
                          </span>
                          <span>{opt.label}</span>
                          {isSelected && <span style={{ marginLeft: '2px', fontWeight: 800 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 4: FREE TEXT NOTE */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-900)', display: 'block', marginBottom: '4px' }}>
                    Sua Anotação Livre (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Escreva detalhes sobre o seu dia, sentimentos, reflexões ou pensamentos..."
                    value={newJournalText}
                    onChange={(e) => setNewJournalText(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ background: 'var(--primary-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-200)', color: 'var(--primary-900)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} color="var(--primary-700)" />
                  <span>
                    Todas as anotações salvas são acompanhadas diretamente pela Dra. <strong>{psychologistProfile.name}</strong> para orientar as sessões.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAddingJournal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Salvar no Diário
                  </button>
                </div>
              </form>
            )}

            {/* Entries List Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {journalEntries.map((entry) => (
                <div key={entry.id} className="card" style={{ background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-900)' }}>{entry.date}</span>
                    <span className="badge badge-success" title="Visível para sua psicóloga" style={{ fontSize: '0.65rem' }}>
                      <Eye size={10} /> Visível p/ Psicóloga
                    </span>
                  </div>

                  {/* Render Moods Chips */}
                  {entry.moods && entry.moods.length > 0 && (
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--neutral-600)', display: 'block', marginBottom: '4px' }}>HUMOR:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {entry.moods.map((m, idx) => {
                          const opt = MOOD_OPTIONS.find(o => o.label === m);
                          return (
                            <span key={idx} style={{ background: '#FFF5EB', border: '1px solid #FED7AA', color: '#7C2D12', padding: '3px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span>{opt ? opt.emoji : '😊'}</span>
                              <span>{m}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Fallback for single mood string */}
                  {(!entry.moods || entry.moods.length === 0) && entry.mood && (
                    <span className="badge badge-info" style={{ alignSelf: 'flex-start' }}>{entry.mood}</span>
                  )}

                  {/* Render Physical Activities Chips */}
                  {entry.activities && entry.activities.length > 0 && (
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--neutral-600)', display: 'block', marginBottom: '4px' }}>ATIVIDADE FÍSICA:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {entry.activities.map((a, idx) => {
                          const opt = PHYSICAL_ACTIVITY_OPTIONS.find(o => o.label === a);
                          return (
                            <span key={idx} style={{ background: '#E8F8F2', border: '1px solid #A7F3D0', color: '#065F46', padding: '3px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span>{opt ? opt.emoji : '🏃'}</span>
                              <span>{a}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Render Others Chips */}
                  {entry.others && entry.others.length > 0 && (
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--neutral-600)', display: 'block', marginBottom: '4px' }}>OUTROS:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {entry.others.map((o, idx) => {
                          const opt = OTHER_FACTORS_OPTIONS.find(item => item.label === o);
                          return (
                            <span key={idx} style={{ background: '#FFF5EB', border: '1px solid #FED7AA', color: '#7C2D12', padding: '3px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span>{opt ? opt.emoji : '📍'}</span>
                              <span>{o}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {entry.text && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--neutral-800)', lineHeight: 1.5, marginTop: '2px' }}>
                      "{entry.text}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PATIENT GOALS CHECKLIST */}
        {activeTab === 'goals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
            <div style={{ background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))', color: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={20} color="#8FA998" /> Minhas Metas Terapêuticas
                </h3>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                  {completedGoalsCount} de {patientGoals.length} Concluídas
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ background: 'rgba(255,255,255,0.2)', height: '10px', borderRadius: '5px', overflow: 'hidden', margin: '10px 0 6px' }}>
                <div style={{ width: `${goalProgressPercentage}%`, background: '#22C55E', height: '100%', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#8FA998' }}>
                Progresso: <strong>{goalProgressPercentage}% concluído esta semana</strong>
              </span>
            </div>

            {/* Goals Checklist Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {patientGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: goal.completed ? 'var(--primary-50)' : '#ffffff',
                    border: goal.completed ? '1.5px solid var(--primary-500)' : '1px solid var(--neutral-300)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    {goal.completed ? (
                      <CheckSquare size={22} color="var(--primary-700)" />
                    ) : (
                      <Square size={22} color="var(--neutral-400)" />
                    )}
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: goal.completed ? 700 : 500,
                      color: goal.completed ? 'var(--primary-900)' : 'var(--neutral-800)',
                      textDecoration: goal.completed ? 'line-through' : 'none'
                    }}>
                      {goal.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--neutral-100)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>
                    <Flame size={14} color="#D97706" /> {goal.streakDays}d
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Breathing & Grounding SOS Modal */}
      <PatientBreathingModal
        isOpen={isBreathingModalOpen}
        onClose={() => setIsBreathingModalOpen(false)}
      />
    </div>
  );
}
