import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { initialPatients } from '../data/mockData';
import { calculateEndTime } from '../components/CreatePatientModal';

let currentPsychologistId = 'PSI-061234'; // Default to Demo Dra. Patrícia Lima

export const setPsychologistContext = (psychologistIdOrEmail) => {
  if (!psychologistIdOrEmail) {
    currentPsychologistId = 'PSI-061234';
    return;
  }
  const clean = String(psychologistIdOrEmail).trim().toLowerCase();
  currentPsychologistId = clean;
};

export const getPsychologistContext = () => currentPsychologistId;

// Dynamic Local storage key per Psychologist ID
const getLocalStorageKey = () => {
  const cleanKey = currentPsychologistId.replace(/[^a-z0-9_-]/gi, '_');
  return `psivisor_${cleanKey}_patients_data`;
};

// Helper to generate patient PIN (4 first letters of name + 4 random/hash digits)
export const generatePatientPin = (patientOrName) => {
  let name = '';
  let pin = '';
  let id = '';

  if (typeof patientOrName === 'string') {
    name = patientOrName;
  } else if (patientOrName && typeof patientOrName === 'object') {
    if (patientOrName.pin && typeof patientOrName.pin === 'string' && patientOrName.pin.length >= 8) {
      return patientOrName.pin.toUpperCase();
    }
    name = patientOrName.name || '';
    pin = patientOrName.pin || '';
    id = patientOrName.id || '';
  }

  if (pin && typeof pin === 'string' && pin.length >= 8) {
    return pin.toUpperCase();
  }

  const cleanName = (name || 'PACIENTE')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();

  const letters = cleanName.padEnd(4, 'X').slice(0, 4);

  let digits = '1234';
  if (id) {
    let hash = 0;
    const str = String(id);
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 9000;
    }
    digits = String(hash + 1000);
  } else {
    digits = String(Math.floor(1000 + Math.random() * 9000));
  }

  return `${letters}${digits}`;
};

// Helper to normalize patient data format (handling snake_case from DB vs camelCase from JS)
const normalizePatient = (p) => {
  if (!p) return null;

  const birthDate = p.birthDate || p.birth_date || '1996-08-15';
  let computedAge = p.age || 30;
  if (birthDate) {
    const year = new Date(birthDate).getFullYear();
    if (!isNaN(year) && year > 1900) {
      computedAge = new Date().getFullYear() - year;
    }
  }

  const sessionDayOfWeek = p.sessionDayOfWeek || p.session_day_of_week || 'Quinta-feira';
  const sessionStartTime = p.sessionStartTime || p.session_start_time || p.sessionTime || '15:00';
  const sessionDuration = Number(p.sessionDuration || p.session_duration || 50);
  const sessionEndTime = p.sessionEndTime || p.session_end_time || calculateEndTime(sessionStartTime, sessionDuration);
  const sessionDay = p.sessionDay || p.session_day || `${sessionDayOfWeek} das ${sessionStartTime} às ${sessionEndTime} (${sessionDuration} min)`;

  return {
    ...p,
    id: String(p.id),
    name: p.name || 'Paciente sem nome',
    pin: p.pin || generatePatientPin(p),
    birthDate: birthDate,
    age: computedAge > 0 ? computedAge : (p.age || 28),
    phone: p.phone || '(11) 99999-8888',
    email: p.email || 'paciente@email.com',
    address: p.address || p.patient_address || 'Rua das Flores, 123 - São Paulo/SP',
    emergencyContact: p.emergencyContact || p.emergency_contact || 'Contato de Emergência Não Informado',
    packageType: p.packageType || p.package_type || 'Semanal',
    sessionsPerWeek: p.sessionsPerWeek || p.sessions_per_week || '1x por semana',
    diagnosis: p.diagnosis || 'Em avaliação',
    sessionDayOfWeek: sessionDayOfWeek,
    sessionStartTime: sessionStartTime,
    sessionDuration: sessionDuration,
    sessionEndTime: sessionEndTime,
    sessionDay: sessionDay,
    fee: p.fee || 200,
    avatar: p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    notes: (p.notes || []).map(n => ({
      id: String(n.id),
      sessionNum: n.sessionNum || n.session_num || 1,
      date: n.date || (n.created_at ? n.created_at.split('T')[0] : 'Hoje'),
      summary: n.summary || '',
      confidentialNote: n.confidentialNote || n.confidential_note || ''
    })),
    activities: (p.activities || []).map(a => ({
      id: String(a.id),
      title: a.title || 'Exercício Terapêutico',
      type: a.type || 'Reflexão',
      assignedDate: a.assignedDate || a.assigned_date || new Date().toISOString().split('T')[0],
      dueDate: a.dueDate || a.due_date || 'A combinar',
      status: a.status || 'Pendente',
      customMessage: a.customMessage || a.custom_message || null,
      description: a.description || null,
      imageUrl: a.imageUrl || a.image_url || null,
      fields: a.fields || null,
      patientResponse: a.patientResponse || a.patient_response || null
    })),
    journalEntries: (p.journalEntries || p.journal_entries || []).map(j => ({
      id: String(j.id || `j-${Date.now()}`),
      date: j.date || (j.created_at ? new Date(j.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hoje'),
      moods: j.moods || [],
      activities: j.activities || [],
      others: j.others || [],
      mood: j.mood || '',
      text: j.text || ''
    })),
    anamnesis: p.anamnesis || p.anamnesis_data || null
  };
};

// Helper to get local data for the current active psychologist
const getLocalData = () => {
  const key = getLocalStorageKey();
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map(normalizePatient);
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
    }
  }

  // If this is the Demo Account, load initial demo patients
  const isDemo = currentPsychologistId.includes('patricia') || currentPsychologistId.includes('061234') || currentPsychologistId === 'demo';
  const defaultData = isDemo ? initialPatients : [];
  
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData.map(normalizePatient);
};

// Helper to save local data for the current active psychologist
const saveLocalData = (data) => {
  const key = getLocalStorageKey();
  localStorage.setItem(key, JSON.stringify(data));
};

export const psychologyService = {
  // Fetch Patients with Notes and Activities
  async fetchPatients() {
    if (!isSupabaseConfigured) {
      console.log('🔄 Modo Demo/Local Ativo. Conecte ao Supabase via .env para sincronizar online.');
      return getLocalData();
    }

    try {
      const { data: patients, error: pError } = await supabase
        .from('patients')
        .select(`
          *,
          notes:clinical_notes(*),
          activities:assigned_activities(*)
        `)
        .order('name');

      if (pError) throw pError;
      return (patients || []).map(normalizePatient);
    } catch (err) {
      console.warn('Erro ao buscar dados do Supabase. Usando fallback local:', err);
      return getLocalData();
    }
  },

  // Create New Patient
  async createPatient(patientObj) {
    const normalizedNewPatient = normalizePatient(patientObj);

    if (!isSupabaseConfigured) {
      const local = getLocalData();
      const updated = [normalizedNewPatient, ...local];
      saveLocalData(updated);
      return updated;
    }

    try {
      const { error } = await supabase
        .from('patients')
        .insert({
          id: patientObj.id,
          name: patientObj.name,
          age: normalizedNewPatient.age,
          phone: patientObj.phone,
          email: patientObj.email,
          diagnosis: patientObj.diagnosis,
          session_day: normalizedNewPatient.sessionDay,
          fee: patientObj.fee,
          avatar: patientObj.avatar
        });

      if (error) throw error;
      return await this.fetchPatients();
    } catch (err) {
      console.warn('Erro no Supabase. Salvando localmente:', err);
      const local = getLocalData();
      const updated = [normalizedNewPatient, ...local];
      saveLocalData(updated);
      return updated;
    }
  },

  // Update Patient Info
  async updatePatient(patientId, updatedFields) {
    const pid = String(patientId);
    if (!isSupabaseConfigured) {
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          return normalizePatient({ ...p, ...updatedFields });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }

    try {
      const { error } = await supabase
        .from('patients')
        .update({
          name: updatedFields.name,
          age: updatedFields.age,
          phone: updatedFields.phone,
          email: updatedFields.email,
          diagnosis: updatedFields.diagnosis,
          session_day: updatedFields.sessionDay,
          fee: updatedFields.fee
        })
        .eq('id', pid);

      if (error) throw error;
      return await this.fetchPatients();
    } catch (err) {
      console.warn('Erro no Supabase ao atualizar paciente. Atualizando localmente:', err);
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          return normalizePatient({ ...p, ...updatedFields });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }
  },

  // Save new session note / confidential note
  async addNote(patientId, noteData) {
    const pid = String(patientId);
    const confidential = noteData.confidentialNote || '';
    const summary = noteData.summary || (confidential ? '[Registro Sigiloso de Observação Clínica]' : 'Sessão de Psicoterapia');

    if (!isSupabaseConfigured) {
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          const nextNum = noteData.sessionNum || ((p.notes ? p.notes.length : 0) + 1);
          const newNoteObj = {
            id: `n-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            sessionNum: nextNum,
            summary: summary,
            confidentialNote: confidential
          };
          return normalizePatient({
            ...p,
            notes: [newNoteObj, ...(p.notes || [])]
          });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }

    try {
      const { error } = await supabase
        .from('clinical_notes')
        .insert({
          patient_id: pid,
          summary: summary,
          confidential_note: confidential,
          session_num: noteData.sessionNum || 1
        });

      if (error) throw error;
      return await this.fetchPatients();
    } catch (err) {
      console.warn('Erro no Supabase ao salvar nota. Salvando localmente:', err);
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          const nextNum = noteData.sessionNum || ((p.notes ? p.notes.length : 0) + 1);
          const newNoteObj = {
            id: `n-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            sessionNum: nextNum,
            summary: summary,
            confidentialNote: confidential
          };
          return normalizePatient({
            ...p,
            notes: [newNoteObj, ...(p.notes || [])]
          });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }
  },

  // Assign activity to patient
  async assignActivity(patientId, activityData) {
    const pid = String(patientId);
    if (!isSupabaseConfigured) {
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          const newActObj = {
            id: `act-${Date.now()}`,
            ...activityData
          };
          return normalizePatient({ ...p, activities: [newActObj, ...(p.activities || [])] });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }

    try {
      const { error } = await supabase
        .from('assigned_activities')
        .insert({
          patient_id: pid,
          title: activityData.title,
          type: activityData.type,
          due_date: activityData.dueDate,
          status: 'Pendente'
        });

      if (error) throw error;
      return await this.fetchPatients();
    } catch (err) {
      console.warn('Erro ao atribuir atividade no Supabase. Salvando localmente:', err);
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          const newActObj = {
            id: `act-${Date.now()}`,
            ...activityData
          };
          return normalizePatient({ ...p, activities: [newActObj, ...(p.activities || [])] });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }
  },

  // Save patient journal entry
  async addJournalEntry(patientId, journalEntryObj) {
    const pid = String(patientId);
    if (!isSupabaseConfigured) {
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          const currentJournal = p.journalEntries || [];
          return normalizePatient({
            ...p,
            journalEntries: [journalEntryObj, ...currentJournal]
          });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }

    try {
      const { error } = await supabase
        .from('patient_journals')
        .insert({
          patient_id: pid,
          date: journalEntryObj.date,
          moods: journalEntryObj.moods,
          activities: journalEntryObj.activities,
          others: journalEntryObj.others,
          mood: journalEntryObj.mood,
          text: journalEntryObj.text
        });

      if (error) throw error;
      return await this.fetchPatients();
    } catch (err) {
      console.warn('Erro ao salvar diário no Supabase. Salvando localmente:', err);
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          const currentJournal = p.journalEntries || [];
          return normalizePatient({
            ...p,
            journalEntries: [journalEntryObj, ...currentJournal]
          });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }
  },

  // Submit patient activity response
  async submitActivityResponse(patientId, activityId, responsePayload) {
    const pid = String(patientId);
    if (!isSupabaseConfigured) {
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          let updatedActs = [...(p.activities || [])];
          const foundIdx = updatedActs.findIndex(act => String(act.id) === String(activityId));
          if (foundIdx >= 0) {
            updatedActs[foundIdx] = {
              ...updatedActs[foundIdx],
              status: 'Concluído',
              patientResponse: responsePayload
            };
          } else {
            updatedActs.unshift({
              id: `act-j-${Date.now()}`,
              title: '📝 Registro no Diário Emocional',
              type: 'Diário',
              assignedDate: new Date().toISOString().split('T')[0],
              dueDate: 'Concluído',
              status: 'Concluído',
              patientResponse: responsePayload
            });
          }
          return normalizePatient({ ...p, activities: updatedActs });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }

    try {
      const { error } = await supabase
        .from('assigned_activities')
        .update({
          status: 'Concluído',
          patient_response: responsePayload,
          submitted_at: new Date().toISOString()
        })
        .eq('id', activityId);

      if (error) throw error;
      return await this.fetchPatients();
    } catch (err) {
      console.warn('Erro ao enviar resposta no Supabase. Atualizando localmente:', err);
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          let updatedActs = [...(p.activities || [])];
          const foundIdx = updatedActs.findIndex(act => String(act.id) === String(activityId));
          if (foundIdx >= 0) {
            updatedActs[foundIdx] = {
              ...updatedActs[foundIdx],
              status: 'Concluído',
              patientResponse: responsePayload
            };
          } else {
            updatedActs.unshift({
              id: `act-j-${Date.now()}`,
              title: '📝 Registro no Diário Emocional',
              type: 'Diário',
              assignedDate: new Date().toISOString().split('T')[0],
              dueDate: 'Concluído',
              status: 'Concluído',
              patientResponse: responsePayload
            });
          }
          return normalizePatient({ ...p, activities: updatedActs });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }
  },

  // Save patient anamnesis
  async saveAnamnesis(patientId, anamnesisPayload) {
    const pid = String(patientId);
    if (!isSupabaseConfigured) {
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          return normalizePatient({
            ...p,
            anamnesis: anamnesisPayload
          });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }

    try {
      const { error } = await supabase
        .from('patients')
        .update({
          anamnesis_data: anamnesisPayload
        })
        .eq('id', pid);

      if (error) throw error;
      return await this.fetchPatients();
    } catch (err) {
      console.warn('Erro ao salvar anamnese no Supabase. Salvando localmente:', err);
      const local = getLocalData();
      const updated = local.map(p => {
        if (String(p.id) === pid) {
          return normalizePatient({
            ...p,
            anamnesis: anamnesisPayload
          });
        }
        return p;
      });
      saveLocalData(updated);
      return updated;
    }
  }
};
