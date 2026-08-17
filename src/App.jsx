import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PatientsView from './components/PatientsView';
import AgendaView from './components/AgendaView';
import ActivitiesHub from './components/ActivitiesHub';
import PatientPortal from './components/PatientPortal';
import AssignModal from './components/AssignModal';
import ExportPdfModal from './components/ExportPdfModal';
import WhatsAppModal from './components/WhatsAppModal';
import FinancialView from './components/FinancialView';
import ReceiptModal from './components/ReceiptModal';
import CreateTemplateModal from './components/CreateTemplateModal';
import UploadAttachmentModal from './components/UploadAttachmentModal';
import ReferralLetterModal from './components/ReferralLetterModal';
import GlobalSearchModal from './components/GlobalSearchModal';
import PsychologicalCertificateModal from './components/PsychologicalCertificateModal';
import TherapeuticContractModal from './components/TherapeuticContractModal';
import EmailNotificationModal from './components/EmailNotificationModal';
import AuthLoginScreen from './components/AuthLoginScreen';
import CreatePatientModal from './components/CreatePatientModal';
import EditPatientModal from './components/EditPatientModal';
import AddConfidentialNoteModal from './components/AddConfidentialNoteModal';
import NotificationsModal from './components/NotificationsModal';
import AnamnesisModal from './components/AnamnesisModal';
import LandingPage from './components/LandingPage';
import SubscriptionModal from './components/SubscriptionModal';

import { psychologistProfile, initialAppointments, activityTemplates } from './data/mockData';
import { psychologyService, setPsychologistContext } from './services/psychologyService';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { Database, ShieldCheck, Info, EyeOff, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patientMode, setPatientMode] = useState(false);
  const [isAnonMode, setIsAnonMode] = useState(false);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState(psychologistProfile);

  // Dark Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('psicoflow_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('psicoflow_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('psicoflow_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleToggleAnonMode = () => {
    setIsAnonMode(prev => !prev);
  };

  // Dynamic State
  const [rawPatients, setRawPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [templates, setTemplates] = useState(activityTemplates);
  const [selectedPatientId, setSelectedPatientId] = useState('p1');

  // Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalInitialPatient, setModalInitialPatient] = useState(null);
  const [modalInitialTemplate, setModalInitialTemplate] = useState(null);
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  // PDF Export Modal State
  const [isExportPdfOpen, setIsExportPdfOpen] = useState(false);
  const [exportPatientTarget, setExportPatientTarget] = useState(null);

  // WhatsApp Modal State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppTargetData, setWhatsAppTargetData] = useState(null);
  const [whatsAppType, setWhatsAppType] = useState('activity');

  // Receipt Modal State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptRecordTarget, setReceiptRecordTarget] = useState(null);

  // Create Template Modal State
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);

  // Apply Test Modal State
  const [isApplyTestOpen, setIsApplyTestOpen] = useState(false);
  const [applyTestPatientTarget, setApplyTestPatientTarget] = useState(null);

  // Upload Attachment Modal State
  const [isUploadAttachmentOpen, setIsUploadAttachmentOpen] = useState(false);

  // Referral Letter Modal State
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [referralPatientTarget, setReferralPatientTarget] = useState(null);

  // Global Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Psychological Certificate Modal State
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certificatePatientTarget, setCertificatePatientTarget] = useState(null);

  // Therapeutic Contract Modal State
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [contractPatientTarget, setContractPatientTarget] = useState(null);

  // Email Notification Modal State
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailPatientTarget, setEmailPatientTarget] = useState(null);

  // Create Patient Modal State
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);

  // Edit Patient Modal State
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [editPatientTarget, setEditPatientTarget] = useState(null);

  // Confidential Note Modal State
  const [isConfidentialModalOpen, setIsConfidentialModalOpen] = useState(false);
  const [confidentialPatientTarget, setConfidentialPatientTarget] = useState(null);

  // Notifications Modal State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Anamnesis Modal State
  const [isAnamnesisOpen, setIsAnamnesisOpen] = useState(false);
  const [anamnesisPatientTarget, setAnamnesisPatientTarget] = useState(null);
  const [anamnesisInitialModel, setAnamnesisInitialModel] = useState('adult');

  // Load Patients from Service on Mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await psychologyService.fetchPatients();
      setRawPatients(data);
      if (data.length > 0 && !selectedPatientId) {
        setSelectedPatientId(data[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Map Anonymized Patients if isAnonMode is true
  const patients = rawPatients.map((p, idx) => {
    if (!isAnonMode) return p;
    return {
      ...p,
      name: `Paciente #${p.id.toUpperCase()}`,
      phone: '(11) 9****-****',
      email: `paciente${idx + 1}@anonimo.com`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
    };
  });

  // Handlers
  const handleCreatePatientSuccess = async (newPatientObj) => {
    const updated = await psychologyService.createPatient(newPatientObj);
    setRawPatients([...updated]);
    setSelectedPatientId(String(newPatientObj.id));
    setActiveTab('patients');
  };

  const handleUpdatePatientSuccess = async (patientId, updatedFields) => {
    const updated = await psychologyService.updatePatient(patientId, updatedFields);
    setRawPatients([...updated]);
  };

  const handlePsychologistLoginSuccess = async (userObj) => {
    const psychId = userObj.psychologistId || userObj.email || 'PSI-061234';
    setPsychologistContext(psychId);
    setAuthenticatedUser(userObj);
    setIsAuthenticated(true);
    setPatientMode(false);
    
    // Dynamically fetch patients scoped exclusively to this logged in psychologist
    setLoading(true);
    const data = await psychologyService.fetchPatients();
    setRawPatients(data);
    if (data.length > 0) {
      setSelectedPatientId(data[0].id);
    } else {
      setSelectedPatientId(null);
    }
    setLoading(false);
  };

  const handlePatientAccessByPin = (patientId) => {
    setSelectedPatientId(patientId);
    setIsAuthenticated(true);
    setPatientMode(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPatientMode(false);
    setPsychologistContext('PSI-061234');
  };

  const handleOpenAssignModal = (patient = null, template = null) => {
    setModalInitialPatient(patient);
    setModalInitialTemplate(template);
    setIsAssignModalOpen(true);
  };

  const handleOpenExportPdf = (patient) => {
    setExportPatientTarget(patient);
    setIsExportPdfOpen(true);
  };

  const handleOpenWhatsApp = (data, type = 'activity') => {
    setWhatsAppTargetData(data);
    setWhatsAppType(type);
    setIsWhatsAppOpen(true);
  };

  const handleOpenReceipt = (record) => {
    setReceiptRecordTarget(record);
    setIsReceiptOpen(true);
  };

  const handleOpenApplyTest = (patient) => {
    setApplyTestPatientTarget(patient);
    setIsApplyTestOpen(true);
  };

  const handleOpenUploadAttachment = () => {
    setIsUploadAttachmentOpen(true);
  };

  const handleOpenReferral = (patient) => {
    setReferralPatientTarget(patient);
    setIsReferralOpen(true);
  };

  const handleOpenCertificate = (patient) => {
    setCertificatePatientTarget(patient);
    setIsCertificateOpen(true);
  };

  const handleOpenContract = (patient) => {
    setContractPatientTarget(patient);
    setIsContractOpen(true);
  };

  const handleOpenEmail = (patient) => {
    setEmailPatientTarget(patient);
    setIsEmailOpen(true);
  };

  const handleOpenEditPatient = (patient) => {
    setEditPatientTarget(patient);
    setIsEditPatientOpen(true);
  };

  const handleOpenConfidentialModal = (patient) => {
    setConfidentialPatientTarget(patient);
    setIsConfidentialModalOpen(true);
  };

  const handleSelectPatientAndTab = (patientId, subTab = 'notes') => {
    setSelectedPatientId(patientId);
    setActiveTab('patients');
  };

  const handleCreateTemplate = (newTemplate) => {
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const handleSaveTestResult = (testResultObj) => {
    console.log('Teste salvo com sucesso:', testResultObj);
  };

  const handleUploadAttachmentSuccess = (newAttachment) => {
    console.log('Anexo salvo no prontuário:', newAttachment);
  };

  const handleAddNote = async (patientId, noteData) => {
    const updated = await psychologyService.addNote(patientId, noteData);
    setRawPatients([...updated]);
  };

  const handleAssignActivity = async (patientId, newActivityPayload) => {
    const updated = await psychologyService.assignActivity(patientId, newActivityPayload);
    setRawPatients(updated);
  };

  const handlePatientSubmitResponse = async (patientId, activityId, responsePayload) => {
    const updated = await psychologyService.submitActivityResponse(patientId, activityId, responsePayload);
    setRawPatients(updated);
  };

  const handleSaveJournalEntry = async (patientId, journalEntryObj) => {
    const updated = await psychologyService.addJournalEntry(patientId, journalEntryObj);
    setRawPatients(updated);
  };

  const handleOpenAnamnesis = (patient = null, modelType = 'adult') => {
    setAnamnesisPatientTarget(patient || patients[0]);
    setAnamnesisInitialModel(modelType);
    setIsAnamnesisOpen(true);
  };

  const handleSaveAnamnesis = async (patientId, anamnesisPayload) => {
    const updated = await psychologyService.saveAnamnesis(patientId, anamnesisPayload);
    setRawPatients(updated);
  };

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscriptionPlanChoice, setSubscriptionPlanChoice] = useState('monthly');

  const handleOpenSubscription = (plan = 'monthly') => {
    setSubscriptionPlanChoice(plan);
    setIsSubscriptionModalOpen(true);
  };

  const handleSubscriptionComplete = (newCredentials) => {
    setAuthView('login');
  };

  const [authView, setAuthView] = useState(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('patient') || window.location.search.includes('pin') || window.location.search.includes('login'))) {
      return 'login';
    }
    return 'landing'; // 'landing' | 'login'
  });

  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <>
          <LandingPage
            onGoToLogin={() => setAuthView('login')}
            onOpenSubscription={handleOpenSubscription}
            onGoToDemo={() => {
              handlePsychologistLoginSuccess({
                email: 'dra.patricia@psivisor.com.br',
                name: 'Dra. Patrícia Lima',
                crp: 'CRP 06/123456'
              });
            }}
          />
          <SubscriptionModal
            isOpen={isSubscriptionModalOpen}
            onClose={() => setIsSubscriptionModalOpen(false)}
            defaultPlan={subscriptionPlanChoice}
            onSubscriptionComplete={handleSubscriptionComplete}
          />
        </>
      );
    }

    return (
      <>
        <AuthLoginScreen
          onLoginSuccess={handlePsychologistLoginSuccess}
          onPatientAccessByPin={handlePatientAccessByPin}
          patients={patients}
          onGoToLanding={() => setAuthView('landing')}
        />
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          defaultPlan={subscriptionPlanChoice}
          onSubscriptionComplete={handleSubscriptionComplete}
        />
      </>
    );
  }

  // IF PATIENT MODE IS ACTIVE: Render STRICTLY the isolated PatientPortal
  if (patientMode) {
    return (
      <PatientPortal
        patients={patients}
        onPatientSubmitResponse={handlePatientSubmitResponse}
        onSaveJournalEntry={handleSaveJournalEntry}
        activePatientId={selectedPatientId}
        onLogoutPatient={handleLogout}
      />
    );
  }

  // PSYCHOLOGIST FULL DASHBOARD VIEW
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patientMode={patientMode}
        setPatientMode={setPatientMode}
        psychologistProfile={authenticatedUser}
        isAnonMode={isAnonMode}
        onToggleAnonMode={handleToggleAnonMode}
      />

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Anonymization Banner */}
        {isAnonMode && (
          <div style={{
            background: 'var(--accent-terracotta)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EyeOff size={18} />
              <span>Modo de Anonimização (Supervisão Clínica) Ativo — Identidade dos pacientes ocultada conforme LGPD</span>
            </div>

            <button 
              onClick={handleToggleAnonMode} 
              style={{ background: '#ffffff', color: 'var(--accent-terracotta)', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}
            >
              Desativar Modo Anônimo
            </button>
          </div>
        )}

        {/* Supabase Status Banner & Logout */}
        <div style={{
          background: isSupabaseConfigured ? 'rgba(44, 94, 78, 0.08)' : 'rgba(234, 179, 8, 0.12)',
          border: isSupabaseConfigured ? '1px solid var(--primary-300)' : '1px solid var(--accent-amber)',
          borderRadius: 'var(--radius-md)',
          padding: '0.625rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.825rem',
          color: isSupabaseConfigured ? 'var(--primary-900)' : '#854D0E'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} color={isSupabaseConfigured ? 'var(--primary-700)' : '#854D0E'} />
            <span>
              {isSupabaseConfigured ? (
                <strong>🟢 Supabase PostgreSQL Conectado (Dados Sincronizados em Nuvem)</strong>
              ) : (
                <strong>🟡 Modo Híbrido/Local Ativo (Persistência no Navegador + Pronto para Supabase)</strong>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setShowConfigHelp(!showConfigHelp)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Info size={14} /> {showConfigHelp ? 'Fechar Instruções' : 'Ver Como Conectar ao Supabase'}
            </button>

            <button
              onClick={handleLogout}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-terracotta)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
              title="Sair da Conta"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>

        {/* Configuration Instructions Drawer */}
        {showConfigHelp && (
          <div className="card animate-fade-in mb-4" style={{ background: '#ffffff', border: '1px solid var(--primary-300)', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '6px' }}>
              🛠️ Como Conectar seu Próprio Banco Supabase em 2 Minutos:
            </h4>
            <ol style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--neutral-700)', lineHeight: 1.6 }}>
              <li>Crie um projeto gratuito em <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-700)', fontWeight: 600 }}>supabase.com</a>.</li>
              <li>No painel do Supabase, vá em <strong>SQL Editor</strong> e rode o script contido no arquivo <code>d:\psic\supabase_schema.sql</code>.</li>
              <li>Copie a <strong>Project URL</strong> e a <strong>anon key</strong> em <i>Project Settings API</i>.</li>
              <li>Crie um arquivo <code>.env</code> na raiz da pasta <code>d:\psic</code> com as chaves:</li>
            </ol>
            <pre style={{ background: 'var(--neutral-900)', color: '#4B9B82', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', marginTop: '8px' }}>
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui`}
            </pre>
          </div>
        )}

        {/* PAINEL DA PSICÓLOGA */}
        <Header
          activeTab={activeTab}
          onOpenNewPatient={() => setIsCreatePatientOpen(true)}
          onOpenNewActivity={() => handleOpenAssignModal()}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--primary-700)' }}>
            <p>Carregando dados dos prontuários...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                patients={patients}
                appointments={appointments}
                onSelectPatient={(id) => {
                  setSelectedPatientId(id);
                  setActiveTab('patients');
                }}
                onSelectTab={setActiveTab}
                onOpenNewActivity={() => handleOpenAssignModal()}
                onOpenWhatsAppModal={handleOpenWhatsApp}
              />
            )}

            {activeTab === 'patients' && (
              <PatientsView
                patients={patients}
                selectedPatientId={selectedPatientId}
                onSelectPatient={setSelectedPatientId}
                onOpenAssignModal={(patient) => handleOpenAssignModal(patient)}
                onAddNote={handleAddNote}
                onOpenExportPdfModal={handleOpenExportPdf}
                onOpenWhatsAppModal={handleOpenWhatsApp}
                onOpenApplyTestModal={handleOpenApplyTest}
                onOpenUploadModal={handleOpenUploadAttachment}
                onOpenReferralModal={handleOpenReferral}
                onOpenCertificateModal={handleOpenCertificate}
                onOpenContractModal={handleOpenContract}
                onOpenEmailModal={handleOpenEmail}
                onOpenEditPatientModal={handleOpenEditPatient}
                onOpenAnamnesisModal={handleOpenAnamnesis}
              />
            )}

            {activeTab === 'agenda' && (
              <AgendaView
                patients={patients}
                appointments={appointments}
                onSelectPatient={(id) => {
                  setSelectedPatientId(id);
                  setActiveTab('patients');
                }}
              />
            )}

            {activeTab === 'activities' && (
              <ActivitiesHub
                activityTemplates={templates}
                patients={patients}
                onOpenAssignModal={(patient, template) => handleOpenAssignModal(patient, template)}
                onOpenCreateTemplateModal={() => setIsCreateTemplateOpen(true)}
              />
            )}

            {activeTab === 'financial' && (
              <FinancialView
                patients={patients}
                onOpenReceiptModal={handleOpenReceipt}
              />
            )}
          </>
        )}
      </main>

      {/* Modal: Central de Notificações */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        patients={patients}
        appointments={appointments}
        onSelectPatientAndTab={handleSelectPatientAndTab}
      />

      {/* Modal: Cadastrar Novo Paciente */}
      <CreatePatientModal
        isOpen={isCreatePatientOpen}
        onClose={() => setIsCreatePatientOpen(false)}
        onCreatePatient={handleCreatePatientSuccess}
        patients={patients}
      />

      {/* Modal: Editar Cadastro do Paciente */}
      <EditPatientModal
        isOpen={isEditPatientOpen}
        onClose={() => setIsEditPatientOpen(false)}
        patient={editPatientTarget}
        onUpdatePatient={handleUpdatePatientSuccess}
        patients={patients}
      />

      {/* Modal: Registrar Anotação Sigilosa */}
      <AddConfidentialNoteModal
        isOpen={isConfidentialModalOpen}
        onClose={() => setIsConfidentialModalOpen(false)}
        patient={confidentialPatientTarget}
        onAddConfidentialNote={handleAddNote}
      />

      {/* Modal: Atribuir Atividade */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        patients={patients}
        templates={templates}
        initialPatient={modalInitialPatient}
        initialTemplate={modalInitialTemplate}
        onAssignSuccess={handleAssignActivity}
      />

      {/* Modal: Exportação em PDF */}
      <ExportPdfModal
        isOpen={isExportPdfOpen}
        onClose={() => setIsExportPdfOpen(false)}
        patient={exportPatientTarget}
        psychologistProfile={authenticatedUser}
      />

      {/* Modal: WhatsApp */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        targetData={whatsAppTargetData}
        type={whatsAppType}
      />

      {/* Modal: Recibo em PDF */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        record={receiptRecordTarget}
        psychologistProfile={authenticatedUser}
      />

      {/* Modal: Criar Novo Modelo de Atividade */}
      <CreateTemplateModal
        isOpen={isCreateTemplateOpen}
        onClose={() => setIsCreateTemplateOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />

      {/* Modal: Upload de Anexos & Laudos */}
      <UploadAttachmentModal
        isOpen={isUploadAttachmentOpen}
        onClose={() => setIsUploadAttachmentOpen(false)}
        onUploadSuccess={handleUploadAttachmentSuccess}
      />

      {/* Modal: Encaminhamento Médico / Psiquiátrico */}
      <ReferralLetterModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        patient={referralPatientTarget}
        psychologistProfile={authenticatedUser}
      />

      {/* Modal: Busca Global Instantânea */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        patients={patients}
        onSelectPatientAndTab={handleSelectPatientAndTab}
      />

      {/* Modal: Atestado Psicológico Formal */}
      <PsychologicalCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        patient={certificatePatientTarget}
        psychologistProfile={authenticatedUser}
      />

      {/* Modal: Contrato Terapêutico */}
      <TherapeuticContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
        patient={contractPatientTarget}
        psychologistProfile={authenticatedUser}
        onOpenWhatsAppModal={handleOpenWhatsApp}
      />

      {/* Modal: Notificações por E-mail */}
      <EmailNotificationModal
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
        patient={emailPatientTarget}
        psychologistProfile={authenticatedUser}
      />

      {/* Modal: Anamnese Psicológica */}
      <AnamnesisModal
        isOpen={isAnamnesisOpen}
        onClose={() => setIsAnamnesisOpen(false)}
        patient={anamnesisPatientTarget}
        onSaveAnamnesis={handleSaveAnamnesis}
        initialModelType={anamnesisInitialModel}
      />
    </div>
  );
}
