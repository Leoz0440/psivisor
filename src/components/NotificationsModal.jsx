import React from 'react';
import { X, Bell, CheckCircle2, MessageCircle, Calendar, Gift, ChevronRight, CheckCheck } from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose, patients, appointments, onSelectPatientAndTab }) {
  if (!isOpen) return null;

  // Gather notifications dynamically
  const notifications = [];

  // 1. Patient responses notifications
  patients.forEach(p => {
    (p.activities || []).forEach(a => {
      if (a.status === 'Concluído') {
        notifications.push({
          id: `notif-act-${a.id}`,
          type: 'response',
          title: `Nova resposta de ${p.name}`,
          description: `Concluiu o exercício "${a.title}".`,
          time: a.patientResponse?.submittedAt || 'Hoje',
          patientId: p.id,
          icon: MessageCircle,
          iconBg: 'var(--primary-100)',
          iconColor: 'var(--primary-800)'
        });
      }
    });
  });

  // 2. Today's appointments notifications
  appointments.filter(a => a.date === 'Hoje').forEach(a => {
    const patient = patients.find(p => p.id === a.patientId);
    notifications.push({
      id: `notif-appt-${a.id}`,
      type: 'appointment',
      title: `Sessão agendada hoje às ${a.time}`,
      description: `Atendimento com ${patient ? patient.name : 'Paciente'} (${a.type}).`,
      time: a.time,
      patientId: a.patientId,
      icon: Calendar,
      iconBg: 'var(--accent-blue-light)',
      iconColor: '#1E40AF'
    });
  });

  // 3. Birthday notifications
  patients.forEach(p => {
    notifications.push({
      id: `notif-bday-${p.id}`,
      type: 'birthday',
      title: `Aniversário de ${p.name}`,
      description: `Comemora aniversário este mês! Lembre-se de enviar parabéns.`,
      time: 'Este mês',
      patientId: p.id,
      icon: Gift,
      iconBg: 'var(--accent-amber-light)',
      iconColor: '#854D0E'
    });
  });

  const handleNotificationClick = (patientId) => {
    onSelectPatientAndTab(patientId, 'notes');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      zIndex: 1250,
      padding: '5rem 2rem 1rem 1rem'
    }}>
      <div 
        className="card animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '1px solid var(--neutral-300)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--primary-100)', padding: '6px', borderRadius: '8px', color: 'var(--primary-800)' }}>
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-900)' }}>Central de Notificações</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                {notifications.length} alertas e avisos recentes
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={18} color="var(--neutral-500)" />
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--neutral-500)' }}>
              <Bell size={32} color="var(--neutral-400)" style={{ margin: '0 auto 8px' }} />
              <p>Nenhuma notificação nova no momento.</p>
            </div>
          ) : (
            notifications.map(notif => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.patientId)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--neutral-50)',
                    border: '1px solid var(--neutral-200)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ background: notif.iconBg, color: notif.iconColor, padding: '8px', borderRadius: '10px', marginTop: '2px' }}>
                    <Icon size={18} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                        {notif.title}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--neutral-400)' }}>{notif.time}</span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--neutral-600)', marginTop: '3px' }}>
                      {notif.description}
                    </p>
                  </div>

                  <ChevronRight size={16} color="var(--neutral-400)" style={{ alignSelf: 'center' }} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--neutral-200)', textAlign: 'center' }}>
          <button
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', fontSize: '0.78rem' }}
          >
            <CheckCheck size={14} /> Marcar Todas como Lidas
          </button>
        </div>

      </div>
    </div>
  );
}
