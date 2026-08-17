import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Video, MapPin, User, Sparkles, Repeat, CheckCircle, AlertCircle, AlertTriangle, Lock, Edit3 } from 'lucide-react';
import { calculateEndTime, checkSlotConflict } from './CreatePatientModal';

export const STATUS_OPTIONS = [
  'Confirmado',
  'Atrasou',
  'Desmarcado com antecedência',
  'Desmarcado sem antecedência',
  'Faltou',
  'Não comparecimento',
  'Outro'
];

export const isJustificationRequired = (status) =>
  status === 'Não comparecimento' || status === 'Outro';

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Confirmado':
      return { background: '#DEF7EC', color: '#03543F', border: '1px solid #84E1BC' };
    case 'Atrasou':
      return { background: '#FEF08A', color: '#713F12', border: '1px solid #FDE047' };
    case 'Desmarcado com antecedência':
      return { background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' };
    case 'Desmarcado sem antecedência':
      return { background: '#FFEDD5', color: '#9A3412', border: '1px solid #FDBA74' };
    case 'Faltou':
      return { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' };
    case 'Não comparecimento':
      return { background: '#FEE2E2', color: '#7F1D1D', border: '1px solid #F87171' };
    case 'Outro':
      return { background: '#E0E7FF', color: '#3730A3', border: '1px solid #A5B4FC' };
    default:
      return { background: '#DEF7EC', color: '#03543F', border: '1px solid #84E1BC' };
  }
};

import { getPsychologistContext } from '../services/psychologyService';

export default function AgendaView({ patients = [], appointments = [], onSelectPatient }) {
  const activePsychologistId = getPsychologistContext();
  const cleanPsychId = activePsychologistId.replace(/[^a-z0-9_-]/gi, '_');

  const [selectedDay, setSelectedDay] = useState('2026-08-11');
  
  // Custom appointments persisted per psychologist
  const [customAppointments, setCustomAppointments] = useState(() => {
    const key = `psivisor_${cleanPsychId}_custom_appointments`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  
  // Manual Appointment State
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || '');
  const [newStartHours, setNewStartHours] = useState('15');
  const [newStartMinutes, setNewStartMinutes] = useState('00');
  const [newDuration, setNewDuration] = useState('50');
  const [newType, setNewType] = useState('Online (Google Meet)');
  const [newStatus, setNewStatus] = useState('Confirmado');
  const [newJustification, setNewJustification] = useState('');

  // Status Overrides per Appointment
  const [appointmentStatusOverrides, setAppointmentStatusOverrides] = useState(() => {
    const key = `psivisor_${cleanPsychId}_status_overrides`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return {};
  });

  // Persist custom appointments on change
  const saveCustomAppointments = (updatedApps) => {
    setCustomAppointments(updatedApps);
    const key = `psivisor_${cleanPsychId}_custom_appointments`;
    localStorage.setItem(key, JSON.stringify(updatedApps));
  };

  // Persist status overrides on change
  const saveStatusOverrides = (updatedOverrides) => {
    setAppointmentStatusOverrides(updatedOverrides);
    const key = `psivisor_${cleanPsychId}_status_overrides`;
    localStorage.setItem(key, JSON.stringify(updatedOverrides));
  };

  // Edit Status Modal State
  const [editingApp, setEditingApp] = useState(null);
  const [editStatus, setEditStatus] = useState('Confirmado');
  const [editJustification, setEditJustification] = useState('');

  // 7 Days of the week: Segunda a Domingo
  const weekDays = [
    { date: '2026-08-10', dayName: 'Segunda-feira', shortName: 'Segunda', label: 'Seg 10' },
    { date: '2026-08-11', dayName: 'Terça-feira', shortName: 'Terça', label: 'Ter 11 (Hoje)' },
    { date: '2026-08-12', dayName: 'Quarta-feira', shortName: 'Quarta', label: 'Qua 12' },
    { date: '2026-08-13', dayName: 'Quinta-feira', shortName: 'Qui 13' },
    { date: '2026-08-14', dayName: 'Sexta-feira', shortName: 'Sexta', label: 'Sex 14' },
    { date: '2026-08-15', dayName: 'Sábado', shortName: 'Sábado', label: 'Sáb 15' },
    { date: '2026-08-16', dayName: 'Domingo', shortName: 'Domingo', label: 'Dom 16' },
  ];

  // Match day names flexibly
  const isDayMatch = (patientDayOfWeek, targetDayName, targetShortName) => {
    if (!patientDayOfWeek) return false;
    const pDay = patientDayOfWeek.toLowerCase().trim();
    const tName = targetDayName.toLowerCase().trim();
    const tShort = targetShortName.toLowerCase().trim();
    return pDay.includes(tShort) || tName.includes(pDay);
  };

  // Generate complete list of appointments for selected date including automatic plan sessions
  const getAppointmentsForDate = (targetDate) => {
    const targetDayObj = weekDays.find(d => d.date === targetDate);
    if (!targetDayObj) return [];

    // 1. Manual / Existing mock appointments for this date
    const existing = [...(appointments || []), ...customAppointments].filter(a => a.date === targetDate);
    const existingPatientIds = new Set(existing.map(a => String(a.patientId)));

    // 2. Automatically generated sessions for package patients with specific time per day
    const autoSessions = [];
    (patients || []).forEach(p => {
      const hasPlan = ['Semanal', 'Quinzenal', 'Mensal'].includes(p.packageType);
      if (!hasPlan || existingPatientIds.has(String(p.id))) return;

      const slots = (p.sessionSlots && Array.isArray(p.sessionSlots) && p.sessionSlots.length > 0)
        ? p.sessionSlots
        : (p.sessionDays && Array.isArray(p.sessionDays) && p.sessionDays.length > 0)
          ? p.sessionDays.map(d => ({
              dayOfWeek: d,
              startTime: p.sessionStartTime || '14:00',
              duration: p.sessionDuration || 50
            }))
          : [{
              dayOfWeek: p.sessionDayOfWeek || 'Quinta-feira',
              startTime: p.sessionStartTime || '14:00',
              duration: p.sessionDuration || 50
            }];

      slots.forEach((slot, slotIdx) => {
        if (isDayMatch(slot.dayOfWeek, targetDayObj.dayName, targetDayObj.shortName)) {
          const sTime = slot.startTime || p.sessionStartTime || '14:00';
          const dur = Number(slot.duration || p.sessionDuration || 50);
          const eTime = slot.endTime || calculateEndTime(sTime, dur);

          autoSessions.push({
            id: `auto-${p.id}-${targetDate}-${slotIdx}`,
            patientId: p.id,
            patientName: p.name,
            startTime: sTime,
            endTime: eTime,
            duration: dur,
            time: `${sTime} - ${eTime}`,
            date: targetDate,
            type: 'Online (Google Meet)',
            status: `Agendado (Plano ${p.packageType})`,
            packageType: p.packageType,
            isAutoRecurring: true
          });
        }
      });
    });

    const combined = [...existing, ...autoSessions].map(app => {
      let sTime = app.startTime;
      let eTime = app.endTime;
      if (!sTime && app.time) {
        const parts = app.time.split('-').map(s => s.trim());
        sTime = parts[0];
        eTime = parts[1];
      }
      const dur = app.duration || 50;
      if (!eTime && sTime) {
        eTime = calculateEndTime(sTime, dur);
      }
      return {
        ...app,
        startTime: sTime || '14:00',
        endTime: eTime || '14:50',
        duration: dur,
        formattedInterval: `${sTime || '14:00'} às ${eTime || '14:50'}`
      };
    });

    // Sort by start time
    combined.sort((a, b) => a.time.localeCompare(b.time));
    return combined;
  };

  const currentAppointments = getAppointmentsForDate(selectedDay);
  const selectedDayObj = weekDays.find(d => d.date === selectedDay);
  const dayName = selectedDayObj ? selectedDayObj.dayName : '';

  // Calculate conflict for new manual session
  const cleanHours = newStartHours.replace(/\D/g, '').slice(0, 2);
  const cleanMinutes = newStartMinutes.replace(/\D/g, '').slice(0, 2);
  const formattedNewStartTime = `${cleanHours ? cleanHours.padStart(2, '0') : ''}:${cleanMinutes ? cleanMinutes.padStart(2, '0') : ''}`;
  const formattedNewEndTime = calculateEndTime(formattedNewStartTime, newDuration);
  
  const manualSlotConflict = checkSlotConflict(
    dayName,
    formattedNewStartTime,
    newDuration,
    patients,
    null,
    currentAppointments
  );

  const handleAddSession = (e) => {
    e.preventDefault();
    if (manualSlotConflict && manualSlotConflict.hasConflict) return;
    const selectedP = patients.find(p => String(p.id) === String(newPatientId || patients[0]?.id));
    if (!selectedP) return;

    const sTime = cleanHours.padStart(2, '0') + ':' + cleanMinutes.padStart(2, '0');
    const eTime = calculateEndTime(sTime, newDuration);

    const newApp = {
      id: `manual-${Date.now()}`,
      patientId: selectedP.id,
      patientName: selectedP.name,
      startTime: sTime,
      endTime: eTime,
      duration: Number(newDuration) || 50,
      time: `${sTime} - ${eTime}`,
      date: selectedDay,
      type: newType,
      status: newStatus,
      justification: isJustificationRequired(newStatus) ? newJustification : '',
      isManual: true
    };

    saveCustomAppointments([...customAppointments, newApp]);
    setShowAddModal(false);
    setNewStatus('Confirmado');
    setNewJustification('');
  };

  const handleOpenEditStatus = (app) => {
    const activeStatus = appointmentStatusOverrides[app.id]?.status || app.status || 'Confirmado';
    const activeJust = appointmentStatusOverrides[app.id]?.justification || app.justification || '';
    setEditingApp(app);
    setEditStatus(activeStatus);
    setEditJustification(activeJust);
  };

  const handleSaveStatusEdit = (e) => {
    e.preventDefault();
    if (!editingApp) return;
    const updatedOverrides = {
      ...appointmentStatusOverrides,
      [editingApp.id]: {
        status: editStatus,
        justification: isJustificationRequired(editStatus) ? editJustification : ''
      }
    };
    saveStatusOverrides(updatedOverrides);
    setEditingApp(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header & Day Selector Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary-100)', padding: '10px', borderRadius: '12px', color: 'var(--primary-800)' }}>
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>Agenda de Atendimentos</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--neutral-500)' }}>
              Semana de 10 a 16 de Agosto de 2026 (Segunda a Domingo)
            </p>
          </div>
        </div>

        {/* Days Filter Bar: Monday to Sunday */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {weekDays.map((d) => {
            const count = getAppointmentsForDate(d.date).length;
            const isSelected = selectedDay === d.date;

            return (
              <button
                key={d.date}
                onClick={() => setSelectedDay(d.date)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{ position: 'relative', padding: '0.4rem 0.75rem' }}
              >
                {d.label}
                {count > 0 && (
                  <span style={{
                    marginLeft: '6px',
                    background: isSelected ? '#ffffff' : 'var(--primary-700)',
                    color: isSelected ? 'var(--primary-900)' : '#ffffff',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Agendar Nova Sessão
        </button>
      </div>

      {/* Reservation Guarantee Banner */}
      <div style={{
        background: 'var(--primary-50)',
        border: '1px solid var(--primary-200)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.825rem',
        color: 'var(--primary-900)'
      }}>
        <Lock size={18} color="var(--primary-700)" />
        <span>
          <strong>Reserva de Horários sem Sobreposição:</strong> Quando um atendimento é agendado, o intervalo completo de <strong>início até o término previsto</strong> é reservado na agenda, bloqueando qualquer outro agendamento no mesmo período.
        </span>
      </div>

      {/* Occupied Timeline Summary / Reserved Slots Bar */}
      {currentAppointments.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={16} color="var(--primary-700)" />
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              Horários Reservados em {selectedDayObj ? selectedDayObj.dayName : 'Data Selecionada'} ({currentAppointments.length} consulta{currentAppointments.length > 1 ? 's' : ''})
            </h4>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {currentAppointments.map((app) => (
              <div 
                key={app.id} 
                style={{ 
                  background: 'var(--primary-50)', 
                  border: '1px solid var(--primary-300)', 
                  padding: '6px 10px', 
                  borderRadius: '6px', 
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={13} color="var(--primary-700)" />
                <span style={{ fontWeight: 700, color: 'var(--primary-900)' }}>{app.formattedInterval}</span>
                <span style={{ color: 'var(--neutral-600)' }}>({app.duration} min)</span>
                <span style={{ fontWeight: 600, color: 'var(--primary-800)' }}>• {app.patientName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointments List for Selected Day */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentAppointments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--neutral-500)' }}>
            <Clock size={40} color="var(--neutral-400)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--neutral-700)', marginBottom: '4px' }}>Nenhum atendimento agendado</h4>
            <p style={{ fontSize: '0.875rem' }}>Não há consultas marcadas para este dia da semana.</p>
            <button className="btn btn-outline btn-sm" onClick={() => setShowAddModal(true)} style={{ marginTop: '1rem' }}>
              <Plus size={14} /> Agendar Sessão Manual
            </button>
          </div>
        ) : (
          currentAppointments.map((app) => {
            const currentStatus = appointmentStatusOverrides[app.id]?.status || app.status || 'Confirmado';
            const currentJustification = appointmentStatusOverrides[app.id]?.justification || app.justification || '';

            return (
              <div 
                key={app.id}
                className="card animate-fade-in"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: app.isAutoRecurring ? '4px solid var(--primary-700)' : '4px solid var(--accent-blue)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'center', background: 'var(--neutral-100)', padding: '0.75rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)' }}>
                    <Clock size={16} color="var(--primary-700)" style={{ margin: '0 auto 2px' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-900)', display: 'block' }}>
                      {app.startTime} às {app.endTime}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', fontWeight: 600 }}>
                      {app.duration} min
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--neutral-900)', fontWeight: 700 }}>{app.patientName}</h4>
                      
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} /> Horário Reservado
                      </span>

                      {app.isAutoRecurring && (
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Repeat size={12} /> Plano {app.packageType}
                        </span>
                      )}

                      <span 
                        style={{ 
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          ...getStatusBadgeStyle(currentStatus)
                        }}
                        onClick={() => handleOpenEditStatus(app)}
                        title="Clique para alterar status"
                      >
                        <Edit3 size={11} /> {currentStatus}
                      </span>
                    </div>

                    {currentJustification && (
                      <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#7F1D1D', background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '4px 8px', borderRadius: '4px', fontStyle: 'italic' }}>
                        <strong>Justificativa:</strong> {currentJustification}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', fontSize: '0.825rem', color: 'var(--neutral-600)', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {app.type.includes('Online') ? <Video size={14} color="var(--accent-blue)" /> : <MapPin size={14} color="var(--accent-terracotta)" />}
                        {app.type}
                      </span>
                      {app.activityPending && (
                        <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>
                          • {app.activityPending}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => handleOpenEditStatus(app)}>
                    <Edit3 size={14} /> Alterar Status
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => onSelectPatient(app.patientId)}>
                    <User size={14} /> Abrir Prontuário
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Quick Add Session */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1250,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '1.5rem', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
              Agendar Atendimento Manual ({selectedDayObj ? selectedDayObj.label : selectedDay})
            </h3>

            <form onSubmit={handleAddSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Paciente *
                </label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Start Time (HH:MM) & Duration Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                    Horário de Início (HH : MM) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="15"
                      value={newStartHours}
                      onChange={(e) => setNewStartHours(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      onBlur={() => {
                        let h = newStartHours ? newStartHours.padStart(2, '0') : '15';
                        if (Number(h) > 23) h = '23';
                        setNewStartHours(h);
                      }}
                      style={{ width: '100%', padding: '0.5rem 0.25rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 700 }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--neutral-500)' }}>:</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="00"
                      value={newStartMinutes}
                      onChange={(e) => setNewStartMinutes(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      onBlur={() => {
                        let m = newStartMinutes ? newStartMinutes.padStart(2, '0') : '00';
                        if (Number(m) > 59) m = '59';
                        setNewStartMinutes(m);
                      }}
                      style={{ width: '100%', padding: '0.5rem 0.25rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                    Duração (Minutos) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    placeholder="50"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 700 }}
                    required
                  />
                </div>
              </div>

              {/* Calculated End Time Summary Box */}
              <div style={{ background: 'var(--neutral-100)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--neutral-200)', fontSize: '0.825rem', color: 'var(--primary-900)' }}>
                <span>Intervalo Reservado: <strong>{formattedNewStartTime} às {formattedNewEndTime}</strong> ({newDuration} minutos)</span>
              </div>

              {/* Conflict Alert Banner */}
              {manualSlotConflict && manualSlotConflict.hasConflict && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>
                    Conflito de Horário! O intervalo das {manualSlotConflict.conflictingTime} já está reservado para <strong>{manualSlotConflict.conflictingPatientName}</strong>.
                  </span>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Modalidade
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem' }}
                >
                  <option value="Online (Google Meet)">Online (Google Meet)</option>
                  <option value="Presencial - Consultório">Presencial - Consultório</option>
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Status do Agendamento *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => {
                    setNewStatus(e.target.value);
                    if (!isJustificationRequired(e.target.value)) {
                      setNewJustification('');
                    }
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Justification Textarea when "Não comparecimento" or "Outro" selected */}
              {isJustificationRequired(newStatus) && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#991B1B', display: 'block', marginBottom: '4px' }}>
                    Justificativa *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva a justificativa para o status selecionado..."
                    value={newJustification}
                    onChange={(e) => setNewJustification(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #FCA5A5',
                      fontSize: '0.85rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    required
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={manualSlotConflict && manualSlotConflict.hasConflict}>
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Status Modal */}
      {editingApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '1.5rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', margin: 0 }}>
                  Atualizar Status da Consulta
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--neutral-600)', margin: '2px 0 0' }}>
                  {editingApp.patientName} • {editingApp.startTime} às {editingApp.endTime}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStatusEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Status da Consulta *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => {
                    setEditStatus(e.target.value);
                    if (!isJustificationRequired(e.target.value)) {
                      setEditJustification('');
                    }
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Justification Textarea for "Não comparecimento" or "Outro" */}
              {isJustificationRequired(editStatus) && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#991B1B', display: 'block', marginBottom: '4px' }}>
                    Justificativa *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva a justificativa para o status..."
                    value={editJustification}
                    onChange={(e) => setEditJustification(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #FCA5A5',
                      fontSize: '0.85rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    required
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditingApp(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
