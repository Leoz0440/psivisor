import React from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  TrendingUp, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';
import NextSessionBanner from './NextSessionBanner';
import BirthdayWidget from './BirthdayWidget';

export default function Dashboard({ 
  patients, 
  appointments, 
  onSelectPatient, 
  onSelectTab, 
  onOpenNewActivity,
  onOpenWhatsAppModal 
}) {
  const pendingResponsesCount = patients.reduce((acc, p) => {
    const pending = (p.activities || []).filter(a => a.status === 'Concluído').length;
    return acc + pending;
  }, 0);

  const todayAppointments = appointments.filter(a => a.date === 'Hoje');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Central de Lembretes & Alerta de Próxima Consulta Banner */}
      <NextSessionBanner
        appointments={appointments}
        patients={patients}
        onSelectPatient={onSelectPatient}
        onOpenWhatsAppModal={onOpenWhatsAppModal}
      />

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-100)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--primary-800)' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--neutral-500)', fontWeight: 500 }}>Pacientes Ativos</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-900)' }}>{patients.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--accent-blue-light)', padding: '12px', borderRadius: 'var(--radius-md)', color: '#1E40AF' }}>
            <CalendarIcon size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--neutral-500)', fontWeight: 500 }}>Sessões Hoje</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-900)' }}>{todayAppointments.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--accent-amber-light)', padding: '12px', borderRadius: 'var(--radius-md)', color: '#854D0E' }}>
            <MessageCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--neutral-500)', fontWeight: 500 }}>Tarefas Respondidas</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-900)' }}>{pendingResponsesCount}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--accent-terracotta-light)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--accent-terracotta)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.825rem', color: 'var(--neutral-500)', fontWeight: 500 }}>Evolução Clínica Média</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-900)' }}>-42% Ansiedade</h3>
          </div>
        </div>

      </div>

      {/* Main Grid: Agenda do Dia + Birthday Widget & Respostas dos Pacientes */}
      <div className="grid-responsive-1" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
        
        {/* Today's Appointments Table */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Sessões de Hoje</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>Horários agendados e status de confirmação</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => onSelectTab('agenda')}>
              Ver Agenda Completa <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayAppointments.map((appt) => {
              const patient = patients.find(p => p.id === appt.patientId);
              return (
                <div 
                  key={appt.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    background: 'var(--neutral-50)',
                    border: '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'center', minWidth: '55px', padding: '4px 8px', background: 'var(--primary-100)', borderRadius: 'var(--radius-sm)', color: 'var(--primary-900)', fontWeight: 700, fontSize: '0.85rem' }}>
                      {appt.time}
                    </div>
                    <div>
                      <h4 
                        style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-900)', cursor: 'pointer' }}
                        onClick={() => onSelectPatient(appt.patientId)}
                      >
                        {patient ? patient.name : 'Paciente'}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                        {appt.type} • {patient ? patient.diagnosis : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge ${appt.status === 'Confirmada' ? 'badge-success' : 'badge-warning'}`}>
                      {appt.status}
                    </span>

                    <button
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 8px', borderColor: '#25D366', color: '#16A34A' }}
                      onClick={() => onOpenWhatsAppModal(patient, 'reminder')}
                      title="Enviar Lembrete via WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </button>

                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectPatient(appt.patientId)}
                    >
                      Prontuário
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Birthday Widget + Recent Patient Activity Responses Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Birthday Widget */}
          <BirthdayWidget
            patients={patients}
            onOpenWhatsAppModal={onOpenWhatsAppModal}
          />

          {/* Activity Responses Feed */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Respostas de Atividades</h3>
              <span className="badge badge-info">Em tempo real</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {patients.map(p => {
                const completedActs = (p.activities || []).filter(a => a.status === 'Concluído');
                if (completedActs.length === 0) return null;

                return completedActs.map(act => (
                  <div 
                    key={act.id} 
                    style={{
                      background: 'var(--neutral-50)',
                      padding: '0.875rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--primary-100)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                        {p.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                        {act.patientResponse?.submittedAt || 'Hoje'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-700)' }}>
                      {act.title}
                    </p>

                    <p style={{ fontSize: '0.8rem', color: 'var(--neutral-700)', fontStyle: 'italic', marginTop: '4px' }}>
                      "{act.patientResponse?.thought || act.patientResponse?.situation || 'Resposta registrada no portal'}"
                    </p>

                    <button
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '8px', width: '100%', fontSize: '0.75rem' }}
                      onClick={() => onSelectPatient(p.id)}
                    >
                      Ver no Prontuário
                    </button>
                  </div>
                ));
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
