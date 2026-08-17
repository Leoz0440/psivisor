import React, { useState, useEffect } from 'react';
import { X, Edit3, User, Phone, Mail, DollarSign, Activity, CheckCircle2, Save, Calendar, MapPin, ShieldAlert, Package, Clock, Timer, AlertCircle, AlertTriangle } from 'lucide-react';
import { calculateEndTime, checkSlotConflict } from './CreatePatientModal';

export default function EditPatientModal({ isOpen, onClose, patient, onUpdatePatient, patients = [] }) {
  if (!isOpen || !patient) return null;

  const [name, setName] = useState(patient.name || '');
  const [birthDate, setBirthDate] = useState(patient.birthDate || '1996-08-15');
  const [phone, setPhone] = useState(patient.phone || '');
  const [email, setEmail] = useState(patient.email || '');
  const [address, setAddress] = useState(patient.address || '');
  const [emergencyContact, setEmergencyContact] = useState(patient.emergencyContact || '');
  const [packageType, setPackageType] = useState(patient.packageType || 'Semanal');
  const [sessionsPerWeek, setSessionsPerWeek] = useState(patient.sessionsPerWeek || '1x por semana');
  
  // Independent Session Slots per Day
  const [sessionSlots, setSessionSlots] = useState([
    { dayOfWeek: 'Terça-feira', startTime: '14:00', duration: '50' },
    { dayOfWeek: 'Quinta-feira', startTime: '16:00', duration: '50' },
    { dayOfWeek: 'Sexta-feira', startTime: '10:00', duration: '50' },
    { dayOfWeek: 'Segunda-feira', startTime: '09:00', duration: '50' },
  ]);

  const [diagnosis, setDiagnosis] = useState(patient.diagnosis || 'Transtorno de Ansiedade Generalizada (TAG)');
  const [fee, setFee] = useState(patient.fee ? String(patient.fee) : '200,00');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (patient) {
      setName(patient.name || '');
      setBirthDate(patient.birthDate || '1996-08-15');
      setPhone(patient.phone || '');
      setEmail(patient.email || '');
      setAddress(patient.address || '');
      setEmergencyContact(patient.emergencyContact || '');
      setPackageType(patient.packageType || 'Semanal');
      setSessionsPerWeek(patient.sessionsPerWeek || '1x por semana');
      
      if (patient.sessionSlots && Array.isArray(patient.sessionSlots) && patient.sessionSlots.length > 0) {
        setSessionSlots(patient.sessionSlots.map(s => ({
          dayOfWeek: s.dayOfWeek || 'Quinta-feira',
          startTime: s.startTime || '15:00',
          duration: String(s.duration || 50)
        })));
      } else if (patient.sessionDays && Array.isArray(patient.sessionDays) && patient.sessionDays.length > 0) {
        setSessionSlots(patient.sessionDays.map(d => ({
          dayOfWeek: d,
          startTime: patient.sessionStartTime || '15:00',
          duration: String(patient.sessionDuration || 50)
        })));
      } else {
        setSessionSlots([
          { dayOfWeek: patient.sessionDayOfWeek || 'Quinta-feira', startTime: patient.sessionStartTime || '15:00', duration: String(patient.sessionDuration || 50) }
        ]);
      }

      setDiagnosis(patient.diagnosis || 'Transtorno de Ansiedade Generalizada (TAG)');
      setFee(patient.fee ? String(patient.fee) : '200,00');
    }
  }, [patient]);

  const calculatedAge = birthDate ? new Date().getFullYear() - new Date(birthDate).getFullYear() : (patient.age || 28);
  
  // Calculate session count based on sessionsPerWeek
  const sessionCount = (() => {
    if (sessionsPerWeek.startsWith('2x')) return 2;
    if (sessionsPerWeek.startsWith('3x')) return 3;
    if (sessionsPerWeek.startsWith('4x')) return 4;
    return 1;
  })();

  const activeSlots = sessionSlots.slice(0, sessionCount).map(slot => ({
    ...slot,
    endTime: calculateEndTime(slot.startTime, slot.duration)
  }));

  // Check conflicts for each active slot against other patients
  const slotConflicts = activeSlots.map(slot => 
    checkSlotConflict(slot.dayOfWeek, slot.startTime, slot.duration, patients, patient.id)
  );

  const hasAnyConflict = slotConflicts.some(c => c && c.hasConflict);

  const handleSlotChange = (index, field, value) => {
    setSessionSlots(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleHoursChange = (index, value) => {
    let clean = value.replace(/\D/g, '').slice(0, 2);
    if (clean !== '' && Number(clean) > 23) clean = '23';
    
    setSessionSlots(prev => {
      const copy = [...prev];
      const currentMins = (copy[index]?.startTime || '14:00').split(':')[1] ?? '00';
      copy[index] = { ...copy[index], startTime: `${clean}:${currentMins}` };
      return copy;
    });
  };

  const handleHoursBlur = (index) => {
    setSessionSlots(prev => {
      const copy = [...prev];
      const [h, m] = (copy[index]?.startTime || '14:00').split(':');
      let cleanH = h ? h.padStart(2, '0') : '08';
      if (Number(cleanH) > 23) cleanH = '23';
      copy[index] = { ...copy[index], startTime: `${cleanH}:${m ?? '00'}` };
      return copy;
    });
  };

  const handleMinutesChange = (index, value) => {
    let clean = value.replace(/\D/g, '').slice(0, 2);
    if (clean !== '' && Number(clean) > 59) clean = '59';
    
    setSessionSlots(prev => {
      const copy = [...prev];
      const currentHours = (copy[index]?.startTime || '14:00').split(':')[0] ?? '14';
      copy[index] = { ...copy[index], startTime: `${currentHours}:${clean}` };
      return copy;
    });
  };

  const handleMinutesBlur = (index) => {
    setSessionSlots(prev => {
      const copy = [...prev];
      const [h, m] = (copy[index]?.startTime || '14:00').split(':');
      let cleanH = h ? h.padStart(2, '0') : '14';
      let cleanM = m ? m.padStart(2, '0') : '00';
      if (Number(cleanM) > 59) cleanM = '59';
      copy[index] = { ...copy[index], startTime: `${cleanH}:${cleanM}` };
      return copy;
    });
  };

  const formattedSessionSummary = activeSlots
    .map((s, idx) => `${sessionCount > 1 ? `Sessão ${idx + 1}: ` : ''}${s.dayOfWeek} (${s.startTime} às ${s.endTime})`)
    .join(' • ');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || hasAnyConflict) return;

    const updatedFields = {
      name,
      birthDate,
      age: calculatedAge > 0 ? calculatedAge : 28,
      phone,
      email,
      address,
      emergencyContact,
      packageType,
      sessionsPerWeek,
      sessionSlots: activeSlots,
      sessionDays: activeSlots.map(s => s.dayOfWeek),
      sessionDayOfWeek: activeSlots.map(s => s.dayOfWeek).join(', '),
      sessionStartTime: activeSlots[0].startTime,
      sessionDuration: Number(activeSlots[0].duration) || 50,
      sessionEndTime: activeSlots[0].endTime,
      sessionDay: formattedSessionSummary,
      diagnosis,
      fee: Number(String(fee).replace(',', '.')) || 200
    };

    onUpdatePatient(patient.id, updatedFields);
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
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1250,
      padding: '1rem'
    }}>
      <div 
        className="card animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '720px',
          background: '#ffffff',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-100)', padding: '8px', borderRadius: '10px', color: 'var(--primary-800)' }}>
              <Edit3 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>Editar Dados do Paciente</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                Atualize as informações cadastrais e horários de atendimento sem conflito.
              </p>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--neutral-500)" />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--primary-700)' }}>
            <CheckCircle2 size={54} style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.3rem' }}>Cadastro Atualizado com Sucesso!</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
              As alterações foram salvas no prontuário eletrônico.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Name */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Nome Completo do Paciente *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            {/* Birth Date & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Data de Nascimento * (Para Aniversário)
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                    required
                  />
                </div>
                {birthDate && (
                  <span style={{ fontSize: '0.725rem', color: 'var(--primary-700)', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                    Idade calculada: {calculatedAge} anos
                  </span>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Telefone / WhatsApp *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address & Emergency Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Endereço do Paciente
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Responsável / Contato de Segurança
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldAlert size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                E-mail do Paciente
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {/* Package, Sessions Per Week & Fee Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Pacote / Plano
                </label>
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <option value="Semanal">Semanal (Recorrente)</option>
                  <option value="Quinzenal">Quinzenal (A cada 15d)</option>
                  <option value="Mensal">Mensal (Manutenção)</option>
                  <option value="Avulso">Avulso</option>
                </select>
              </div>

              {/* Sessions per week selector */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Sessões por Semana *
                </label>
                <select
                  value={sessionsPerWeek}
                  onChange={(e) => setSessionsPerWeek(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <option value="1x por semana">1x por semana (1 sessão)</option>
                  <option value="2x por semana">2x por semana (2 sessões)</option>
                  <option value="3x por semana">3x por semana (3 sessões)</option>
                  <option value="4x por semana">4x por semana (4 sessões)</option>
                  <option value="A cada 15 dias (Quinzenal)">A cada 15 dias (Quinzenal)</option>
                  <option value="1x por mês (Mensal)">1x por mês (Mensal)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Honorário (R$)
                </label>
                <input
                  type="text"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {/* Clinical Diagnosis */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Hipótese Diagnóstica / Demanda Principal
              </label>
              <textarea
                rows={2}
                placeholder="Digite a hipótese diagnóstica ou demanda principal do paciente..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* DYNAMIC INDEPENDENT SESSION DAY & TIME CONFIGURATION FOR EACH SESSION */}
            <div style={{ background: 'var(--primary-50)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="var(--primary-700)" /> Configuração de Dia & Horário das Sessões
                </label>
                <span className="badge badge-success" style={{ fontSize: '0.725rem' }}>
                  {sessionCount > 1 ? `${sessionCount} Sessões Semanais` : '1 Sessão Semanal'}
                </span>
              </div>

              {/* Render dynamic card box for each session slot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Array.from({ length: sessionCount }).map((_, index) => {
                  const slot = sessionSlots[index] || { dayOfWeek: 'Terça-feira', startTime: '14:00', duration: '50' };
                  const conflict = slotConflicts[index];

                  return (
                    <div 
                      key={index} 
                      style={{ 
                        background: '#ffffff', 
                        padding: '0.875rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: conflict ? '1.5px solid #EF4444' : '1px solid var(--neutral-200)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                          {sessionCount > 1 ? `📌 Sessão ${index + 1}` : '📌 Sessão Principal'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--neutral-600)' }}>
                          Término previsto: <strong>{calculateEndTime(slot.startTime, slot.duration)}</strong>
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '2px' }}>
                            Dia da Semana
                          </label>
                          <select
                            value={slot.dayOfWeek}
                            onChange={(e) => handleSlotChange(index, 'dayOfWeek', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 600 }}
                          >
                            <option value="Segunda-feira">Segunda-feira</option>
                            <option value="Terça-feira">Terça-feira</option>
                            <option value="Quarta-feira">Quarta-feira</option>
                            <option value="Quinta-feira">Quinta-feira</option>
                            <option value="Sexta-feira">Sexta-feira</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '2px' }}>
                            Horário de Início (HH : MM)
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={2}
                              placeholder="14"
                              value={(slot.startTime || '').split(':')[0] ?? ''}
                              onChange={(e) => handleHoursChange(index, e.target.value)}
                              onBlur={() => handleHoursBlur(index)}
                              style={{ width: '100%', padding: '0.5rem 0.25rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 700 }}
                              title="Horas (00 a 23)"
                            />
                            <span style={{ fontWeight: 700, color: 'var(--neutral-500)', fontSize: '0.9rem' }}>:</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={2}
                              placeholder="00"
                              value={(slot.startTime || '').split(':')[1] ?? ''}
                              onChange={(e) => handleMinutesChange(index, e.target.value)}
                              onBlur={() => handleMinutesBlur(index)}
                              style={{ width: '100%', padding: '0.5rem 0.25rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 700 }}
                              title="Minutos (00 a 59)"
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '2px' }}>
                            Duração (Minutos)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="300"
                            placeholder="50"
                            value={slot.duration}
                            onChange={(e) => handleSlotChange(index, 'duration', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.85rem', fontWeight: 700 }}
                            required
                          />
                        </div>
                      </div>

                      {/* CONFLICT DETECTED BANNER FOR THIS SLOT */}
                      {conflict && conflict.hasConflict && (
                        <div style={{
                          background: '#FEF2F2',
                          border: '1px solid #FCA5A5',
                          color: '#991B1B',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '8px'
                        }}>
                          <AlertCircle size={15} color="#DC2626" />
                          <span>Conflito: {conflict.conflictingPatientName} já tem sessão neste dia às {conflict.conflictingTime}!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary Banner */}
              <div style={{ marginTop: '12px', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--primary-200)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--primary-900)' }}>
                <Timer size={16} color="var(--primary-700)" />
                <span>Resumo da Agenda: <strong>{formattedSessionSummary}</strong></span>
              </div>
            </div>

            {/* General Conflict Warning */}
            {hasAnyConflict && (
              <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', color: '#92400E', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.825rem' }}>
                <AlertTriangle size={18} color="#D97706" />
                <span>
                  <strong>Atenção:</strong> Há um conflito de horário com outro paciente. Altere o dia ou horário destacado antes de prosseguir.
                </span>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={hasAnyConflict}>
                <Save size={16} /> Salvar Alterações
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
