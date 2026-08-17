import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Lock, 
  FileText, 
  ClipboardList, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert,
  Send,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Download,
  MessageCircle,
  BarChart2,
  Activity,
  Paperclip,
  Target,
  FileCheck,
  Key,
  Copy,
  Edit3,
  MapPin,
  Package,
  Clock,
  BookOpen
} from 'lucide-react';
import PatientAnalyticsView from './PatientAnalyticsView';
import PatientAttachmentsView from './PatientAttachmentsView';
import PatientGoalsView from './PatientGoalsView';
import { MOOD_OPTIONS, PHYSICAL_ACTIVITY_OPTIONS, OTHER_FACTORS_OPTIONS } from './PatientPortal';
import { generatePatientPin } from '../services/psychologyService';

const ANAMNESIS_FIELD_LABELS = {
  fullName: 'Nome Completo',
  age: 'Idade',
  birthDate: 'Data de Nascimento',
  sex: 'Sexo',
  schooling: 'Escolaridade',
  schoolName: 'Nome da Escola',
  gradeYear: 'Série / Ano Escolar',
  maritalStatus: 'Estado Civil',
  profession: 'Profissão',
  consultationReason: 'Motivo da Consulta',
  durationNotice: 'Tempo do Problema / Dificuldade',
  impactLife: 'Impactos na Vida Pessoal e Profissional',
  familyRelationChildhood: 'Relação Familiar na Infância',
  familyRelationCurrent: 'Relação Familiar Atual',
  familyPsychHistory: 'Histórico Familiar de Doenças Psíquicas',
  severeIllnesses: 'Doenças Graves e Cirurgias',
  currentMedications: 'Medicamentos em Uso',
  previousTherapyOrPsychiatry: 'Acompanhamento Psicológico / Psiquiátrico Anterior',
  dailyMoodDescription: 'Descrição do Humor Diário',
  anxietySadnessIrritabilityEpisodes: 'Episódios de Ansiedade, Tristeza ou Irritabilidade',
  selfHarmOrCrises: 'Histórico de Crises ou Ideação Autodestrutiva',
  dailyRoutine: 'Rotina Diária',
  sleepQuality: 'Qualidade do Sono',
  physicalActivity: 'Atividades Físicas',
  diet: 'Alimentação',
  friendsWorkRelations: 'Relações com Amigos e Trabalho',
  workOrSocialDifficulties: 'Dificuldades no Trabalho ou Vida Social',
  groupOrLeisureActivities: 'Atividades de Lazer e Grupos',
  therapeuticProcessExpectations: 'Expectativas do Processo Terapêutico',

  // Criança / Responsável
  schoolAndGrade: 'Escola e Escolaridade',
  guardianNameAndAge: 'Dados do Responsável (Nome e Idade)',
  whenNoticed: 'Quando Notou a Dificuldade',
  problemMoments: 'Momentos / Situações em que o Problema Ocorre',
  pregnancyGestation: 'Gestação e Parto',
  motorAndSpeechDev: 'Desenvolvimento Motor e da Fala',
  significantIllnesses: 'Doenças Significativas na Infância',
  householdMembers: 'Membros da Casa',
  familyRelationship: 'Dinâmica das Relações Familiares',
  sleepAndDiet: 'Hábitos de Sono e Alimentação',
  screenTime: 'Uso de Telas e Eletrônicos',
  schoolComplaints: 'Queixas da Escola',
  schoolPerformance: 'Desempenho Escolar',
  friendsAndGroups: 'Socialização e Amigos',
  previousTherapy: 'Tratamentos e Intervenções Anteriores',
  psychologicalCareExpectations: 'Expectativas dos Pais para o Atendimento',

  // Adolescente
  whatBroughtYou: 'Motivo da Consulta (Visão do Adolescente)',
  whenNoticedDifficulty: 'Quando Percebeu a Dificuldade',
  lifeImpact: 'Impactos na Vida Escolar, Familiar e Social',
  whoLivesWithYou: 'Com Quem Mora',
  familyRelationDescription: 'Descrição da Relação com a Família',
  familyConflictsAndResolution: 'Conflitos Familiares e Resolução',
  likeSchoolReason: 'Opinião sobre a Escola',
  peersAndTeachersRelations: 'Relação com Colegas e Professores',
  subjectDifficulties: 'Dificuldades em Matérias Escolares',
  dailyFeelings: 'Sentimentos Predominantes no Dia a Dia',
  happyOrSadTriggers: 'Gatilhos de Alegria ou Tristeza',
  negativeSelfThoughts: 'Pensamentos Negativos sobre Si Mesmo',
  physicalActivities: 'Prática de Atividades Físicas',
  sleepAndNightmares: 'Qualidade do Sono e Pesadelos',
  consultationExpectations: 'Expectativas do Adolescente para a Consulta'
};

export default function PatientsView({ 
  patients, 
  selectedPatientId, 
  onSelectPatient, 
  onOpenAssignModal, 
  onAddNote, 
  onOpenExportPdfModal, 
  onOpenWhatsAppModal, 
  onOpenApplyTestModal,
  onOpenUploadModal,
  onOpenReferralModal,
  onOpenCertificateModal,
  onOpenContractModal,
  onOpenEmailModal,
  onOpenEditPatientModal,
  onOpenAnamnesisModal
}) {
  const activePatient = patients.find(p => String(p.id) === String(selectedPatientId)) || patients[0];
  const [activeSubTab, setActiveSubTab] = useState('notes'); // 'notes', 'goals', 'analytics', 'attachments', 'activities'
  const [copiedPin, setCopiedPin] = useState(false);

  // State for new session note
  const [newNoteSummary, setNewNoteSummary] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleCopyPatientLink = () => {
    const accessLink = `${window.location.origin}/?mode=patient`;
    navigator.clipboard.writeText(accessLink);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!newNoteSummary.trim()) return;

    onAddNote(activePatient.id, {
      summary: newNoteSummary,
      confidentialNote: ''
    });

    setNewNoteSummary('');
    setIsAddingNote(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', minHeight: '750px' }}>
      
      {/* Left Column: Patient Selector List */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--neutral-200)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Pacientes ({patients.length})</h3>
          <span className="badge badge-success">Todos Ativos</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          {patients.map((p) => {
            const isSelected = String(p.id) === String(activePatient.id);

            return (
              <div
                key={p.id}
                onClick={() => onSelectPatient(p.id)}
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--primary-100)' : 'var(--neutral-50)',
                  border: isSelected ? '1.5px solid var(--primary-300)' : '1px solid var(--neutral-200)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <img
                  src={p.avatar}
                  alt={p.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--neutral-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--neutral-600)', marginTop: '2px' }}>
                    {p.sessionDay}
                  </p>
                </div>
                {isSelected && <ChevronRight size={18} color="var(--primary-800)" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Patient Details & Records */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
        
        {/* Patient Profile Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, var(--neutral-50), var(--primary-50))',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--primary-100)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <img src={activePatient.avatar} alt={activePatient.name} style={{ width: '68px', height: '68px', borderRadius: '50%', border: '3px solid #ffffff', boxShadow: 'var(--shadow-sm)', marginTop: '4px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-900)' }}>{activePatient.name}</h2>
                <span className="badge badge-info">{activePatient.diagnosis}</span>
                <span className="badge badge-success" style={{ background: 'var(--primary-100)', color: 'var(--primary-900)', border: '1px solid var(--primary-300)' }}>
                  <Package size={12} style={{ marginRight: '3px' }} /> Pacote {activePatient.packageType || 'Semanal'} • {activePatient.sessionsPerWeek || '1x por semana'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.875rem', marginTop: '8px', fontSize: '0.825rem', color: 'var(--neutral-600)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} color="var(--primary-700)" /> Nasc: {activePatient.birthDate || 'Não informada'} ({activePatient.age} anos)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> {activePatient.phone}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color="var(--primary-700)" /> Sessão: <strong>{activePatient.sessionDay}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Key size={14} color="var(--primary-700)" /> PIN: <strong>{activePatient.pin || generatePatientPin(activePatient)}</strong>
                </span>
              </div>

              {/* Extended Info: Address & Emergency Contact */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', fontSize: '0.78rem', color: 'var(--neutral-600)', flexWrap: 'wrap' }}>
                {activePatient.address && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="var(--neutral-500)" /> {activePatient.address}
                  </span>
                )}
                {activePatient.emergencyContact && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#991B1B', fontWeight: 600 }}>
                    <ShieldAlert size={13} color="#EF4444" /> Segurança/Responsável: {activePatient.emergencyContact}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '380px', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-outline"
              onClick={() => onOpenEditPatientModal(activePatient)}
              title="Editar dados cadastrais deste paciente"
            >
              <Edit3 size={16} /> Editar Cadastro
            </button>

            <button
              className="btn btn-outline"
              onClick={handleCopyPatientLink}
              title="Copiar link direto de acesso ao portal do paciente"
            >
              {copiedPin ? <CheckCircle size={16} color="#16A34A" /> : <Copy size={16} />}
              {copiedPin ? 'Link Copiado!' : 'Copiar Acesso Paciente'}
            </button>
            <button
              className="btn btn-outline"
              style={{ borderColor: '#25D366', color: '#16A34A' }}
              onClick={() => onOpenWhatsAppModal(activePatient, 'reminder')}
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
            <button className="btn btn-outline" onClick={() => onOpenEmailModal(activePatient)}>
              <Mail size={16} /> E-mail
            </button>
            <button className="btn btn-outline" onClick={() => onOpenContractModal(activePatient)}>
              <FileText size={16} /> Contrato Terapêutico
            </button>
            <button className="btn btn-outline" onClick={() => onOpenCertificateModal(activePatient)}>
              <FileCheck size={16} /> Declarações
            </button>
            <button className="btn btn-outline" onClick={() => onOpenReferralModal(activePatient)}>
              <FileText size={16} /> Encaminhamento
            </button>
            <button className="btn btn-outline" onClick={() => onOpenExportPdfModal(activePatient)}>
              <Download size={16} /> Prontuário PDF
            </button>
            <button className="btn btn-primary" onClick={() => onOpenAssignModal(activePatient)}>
              <Plus size={16} /> Atribuir Atividade
            </button>
          </div>
        </div>

        {/* Subtabs Navigation */}
        <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeSubTab === 'notes' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('notes')}
          >
            <FileText size={15} /> Anotações de Sessão ({activePatient.notes ? activePatient.notes.length : 0})
          </button>

          <button
            className={`btn btn-sm ${activeSubTab === 'goals' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('goals')}
          >
            <Target size={15} /> Plano & Metas
          </button>

          <button
            className={`btn btn-sm ${activeSubTab === 'analytics' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('analytics')}
          >
            <BarChart2 size={15} /> Evolução & Analytics
          </button>

          <button
            className={`btn btn-sm ${activeSubTab === 'attachments' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('attachments')}
          >
            <Paperclip size={15} /> Anexos & Laudos
          </button>

          <button
            className={`btn btn-sm ${activeSubTab === 'activities' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('activities')}
          >
            <ClipboardList size={15} /> Atividades Enviadas ({activePatient.activities ? activePatient.activities.length : 0})
          </button>

          <button
            className={`btn btn-sm ${activeSubTab === 'journal' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('journal')}
          >
            <BookOpen size={15} /> Diário do Paciente ({activePatient.journalEntries ? activePatient.journalEntries.length : 0})
          </button>

          <button
            className={`btn btn-sm ${activeSubTab === 'anamnesis' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSubTab('anamnesis')}
          >
            <FileText size={15} /> Anamnese Clínica {activePatient.anamnesis ? '✓' : ''}
          </button>
        </div>

        {/* TAB: PLANO & METAS TERAPÊUTICAS */}
        {activeSubTab === 'goals' && (
          <PatientGoalsView patient={activePatient} />
        )}

        {/* TAB: ANALYTICS & EVOLUÇÃO VISUAL */}
        {activeSubTab === 'analytics' && (
          <PatientAnalyticsView patient={activePatient} />
        )}

        {/* TAB: ANEXOS & LAUDOS EXTERNOS */}
        {activeSubTab === 'attachments' && (
          <PatientAttachmentsView
            patient={activePatient}
            onOpenUploadModal={() => onOpenUploadModal(activePatient)}
          />
        )}

        {/* TAB: DIÁRIO EMOCIONAL DO PACIENTE */}
        {activeSubTab === 'journal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
            <div style={{ background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  📝 Registros do Diário de {activePatient.name}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--neutral-600)', marginTop: '2px' }}>
                  Acompanhamento diário de humores, atividades físicas, fatores diários e anotações enviadas pelo paciente.
                </p>
              </div>
              <span className="badge badge-info" style={{ fontWeight: 700 }}>
                {activePatient.journalEntries ? activePatient.journalEntries.length : 0} Registros
              </span>
            </div>

            {(!activePatient.journalEntries || activePatient.journalEntries.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--neutral-500)', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--neutral-300)' }}>
                <BookOpen size={40} color="var(--neutral-400)" style={{ margin: '0 auto 8px' }} />
                <p>Nenhuma anotação registrada no diário por este paciente ainda.</p>
              </div>
            ) : (
              activePatient.journalEntries.map((entry) => (
                <div key={entry.id} className="card" style={{ background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--neutral-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                      📅 {entry.date}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      Enviado pelo Paciente
                    </span>
                  </div>

                  {/* Render Moods Chips */}
                  {entry.moods && entry.moods.length > 0 && (
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--neutral-600)', display: 'block', marginBottom: '4px' }}>HUMOR REGISTRADO:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {entry.moods.map((m, idx) => {
                          const opt = MOOD_OPTIONS.find(o => o.label === m);
                          return (
                            <span key={idx} style={{ background: '#FFF5EB', border: '1px solid #FED7AA', color: '#7C2D12', padding: '3px 10px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span>{opt ? opt.emoji : '😊'}</span>
                              <span>{m}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Fallback for single mood */}
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
                            <span key={idx} style={{ background: '#E8F8F2', border: '1px solid #A7F3D0', color: '#065F46', padding: '3px 10px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
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
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--neutral-600)', display: 'block', marginBottom: '4px' }}>OUTROS FATORES:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {entry.others.map((o, idx) => {
                          const opt = OTHER_FACTORS_OPTIONS.find(item => item.label === o);
                          return (
                            <span key={idx} style={{ background: '#FFF5EB', border: '1px solid #FED7AA', color: '#7C2D12', padding: '3px 10px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span>{opt ? opt.emoji : '📍'}</span>
                              <span>{o}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {entry.text && (
                    <div style={{ background: 'var(--neutral-50)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--primary-600)', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--neutral-500)', display: 'block', marginBottom: '2px' }}>ANOTAÇÃO LIVRE DO PACIENTE:</span>
                      <p style={{ fontSize: '0.875rem', color: 'var(--neutral-800)', lineHeight: 1.5 }}>
                        "{entry.text}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: ANAMNESE CLÍNICA */}
        {activeSubTab === 'anamnesis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
            {activePatient.anamnesis ? (
              <>
                {/* Header Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary-800), var(--primary-900))',
                  color: '#ffffff',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '6px' }}>
                      Status: {activePatient.anamnesis.status || 'Concluído'} • Modelo: {activePatient.anamnesis.modelType === 'child' ? '🧸 Crianças (Pais)' : activePatient.anamnesis.modelType === 'adolescent' ? '🧑‍🎓 Adolescentes' : '🧑 Adultos'}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                      Ficha de Anamnese de {activePatient.name}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#8FA998', marginTop: '2px' }}>
                      Última atualização: {activePatient.anamnesis.updatedAt || 'Recentemente'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-outline"
                      style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}
                      onClick={() => onOpenAnamnesisModal(activePatient, activePatient.anamnesis.modelType)}
                    >
                      <Edit3 size={15} /> Editar Anamnese
                    </button>
                  </div>
                </div>

                {/* Structured Fields Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {Object.entries(activePatient.anamnesis.data || {}).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} style={{ background: '#ffffff', padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
                        <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                          {ANAMNESIS_FIELD_LABELS[key] || key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <p style={{ fontSize: '0.875rem', color: 'var(--neutral-800)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                          {value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Onboarding Empty State */
              <div className="card" style={{ background: '#ffffff', textAlign: 'center', padding: '3rem 2rem', border: '1.5px dashed var(--primary-300)' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'var(--primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <FileText size={32} color="var(--primary-700)" />
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', fontWeight: 800 }}>
                  Nenhuma Anamnese Preenchida Ainda
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', maxWidth: '460px', margin: '6px auto 1.5rem', lineHeight: 1.5 }}>
                  Inicie a avaliação clínica estruturada de <strong>{activePatient.name}</strong> selecionando um dos 3 modelos oficiais abaixo:
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => onOpenAnamnesisModal(activePatient, 'adult')}
                    style={{ padding: '0.875rem 1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)' }}>🧑 Anamnese Adulto</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Queixa, histórico de saúde, família e rotina</span>
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => onOpenAnamnesisModal(activePatient, 'child')}
                    style={{ padding: '0.875rem 1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)' }}>🧸 Anamnese Criança</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Entrevista com pais/responsáveis & desenvolvimento</span>
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => onOpenAnamnesisModal(activePatient, 'adolescent')}
                    style={{ padding: '0.875rem 1.25rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)' }}>🧑‍🎓 Anamnese Adolescente</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Escola, aspectos emocionais e convivência</span>
                  </button>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => onOpenAnamnesisModal(activePatient, 'adult')}
                  style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}
                >
                  <Plus size={16} /> Preencher Anamnese Agora
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: PRONTUÁRIO & ANOTAÇÕES DE SESSÃO (VISÍVEL APENAS PARA O PSICÓLOGO) */}
        {activeSubTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* PRIVACY WARNING BANNER FOR PSYCHOLOGIST */}
            <div style={{
              background: 'var(--primary-50)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-200)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.825rem',
              color: 'var(--primary-900)'
            }}>
              <Lock size={16} color="var(--primary-700)" />
              <span>
                <strong>Prontuário Exclusivo do Psicólogo:</strong> As anotações de sessão registradas abaixo são de acesso restrito ao profissional. <u>O paciente não possui permissão de acesso para visualizar estas anotações</u> no portal.
              </span>
            </div>

            {/* Add Session Note Button / Form */}
            {!isAddingNote ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsAddingNote(true)}
                >
                  <Plus size={16} /> Nova Anotação de Sessão
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNote} style={{ background: 'var(--neutral-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} /> Registrar Evolução / Anotação da Sessão
                </h4>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                    Anotação da Sessão / Evolução Clínica (Privado da Psicóloga) *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Descreva o andamento da sessão, evolução clínica, técnicas aplicadas e hipóteses de trabalho..."
                    value={newNoteSummary}
                    onChange={(e) => setNewNoteSummary(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAddingNote(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <FileText size={14} /> Salvar Anotação da Sessão
                  </button>
                </div>
              </form>
            )}

            {/* Session Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              {(activePatient.notes || []).map((note) => (
                <div key={note.id} style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-800)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={15} color="var(--primary-700)" /> Sessão #{note.sessionNum}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                      Data: {note.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--neutral-800)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {note.summary}
                  </p>

                  {note.confidentialNote && (
                    <div style={{ background: 'var(--primary-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary-700)', marginTop: '8px', fontSize: '0.85rem', color: 'var(--primary-900)' }}>
                      <strong>Impressão Clínica Adicional:</strong> "{note.confidentialNote}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATIVIDADES ATRIBUÍDAS & RESPOSTAS */}
        {activeSubTab === 'activities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(!activePatient.activities || activePatient.activities.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--neutral-500)' }}>
                <ClipboardList size={40} color="var(--neutral-400)" style={{ margin: '0 auto 8px' }} />
                <p>Nenhuma atividade enviada para este paciente ainda.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={() => onOpenAssignModal(activePatient)}>
                  Enviar Primeira Atividade
                </button>
              </div>
            ) : (
              activePatient.activities.map((act) => (
                <div key={act.id} style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-900)' }}>{act.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                        Enviado em: {act.assignedDate} • Prazo: {act.dueDate}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: '#25D366', color: '#16A34A' }}
                        onClick={() => onOpenWhatsAppModal({ ...activePatient, activityTitle: act.title, dueDate: act.dueDate }, 'activity')}
                        title="Reenviar link da atividade via WhatsApp"
                      >
                        <MessageCircle size={14} /> Reenviar WhatsApp
                      </button>
                      
                      <span className={`badge ${act.status === 'Concluído' ? 'badge-success' : 'badge-warning'}`}>
                        {act.status}
                      </span>
                    </div>
                  </div>

                  {act.patientResponse ? (
                    <div style={{ background: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-100)', boxShadow: 'var(--shadow-sm)' }}>
                      <p style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={15} color="var(--primary-600)" />
                        Resposta do Paciente ({act.patientResponse.submittedAt || 'Enviado'}):
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                        {act.patientResponse.situation && (
                          <p style={{ color: 'var(--neutral-800)' }}>
                            <strong>Gatilho / Situação:</strong> {act.patientResponse.situation}
                          </p>
                        )}
                        {act.patientResponse.thought && (
                          <p style={{ color: 'var(--neutral-800)' }}>
                            <strong>Pensamento Automático:</strong> "{act.patientResponse.thought}"
                          </p>
                        )}
                        {act.patientResponse.emotion && (
                          <p style={{ color: 'var(--neutral-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong>Emoção & Intensidade:</strong> {act.patientResponse.emotion}
                            {act.patientResponse.intensity && (
                              <span className="badge badge-warning">{act.patientResponse.intensity}/10</span>
                            )}
                          </p>
                        )}
                        {act.patientResponse.rationalResponse && (
                          <div style={{ background: 'var(--primary-50)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3.5px solid var(--primary-600)', color: 'var(--primary-900)', marginTop: '4px' }}>
                            <strong>Resposta Racional Reestruturada:</strong>
                            <p style={{ marginTop: '3px', fontSize: '0.9rem' }}>"{act.patientResponse.rationalResponse}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.825rem', color: 'var(--neutral-500)', italic: 'true' }}>
                      Aguardando o paciente preencher esta atividade no portal...
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
