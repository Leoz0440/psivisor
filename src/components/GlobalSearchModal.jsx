import React, { useState } from 'react';
import { Search, X, User, FileText, Lock, ClipboardList, ChevronRight, Sparkles } from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose, patients, onSelectPatientAndTab }) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  // Search filter algorithm across patients, session notes, confidential notes, and responses
  const getSearchResults = () => {
    if (!query.trim() || query.length < 2) return [];

    const lower = query.toLowerCase();
    const results = [];

    patients.forEach(patient => {
      // 1. Patient Name / Diagnosis Match
      if (patient.name.toLowerCase().includes(lower) || (patient.diagnosis && patient.diagnosis.toLowerCase().includes(lower))) {
        results.push({
          id: `p-${patient.id}`,
          type: 'patient',
          icon: <User size={16} color="var(--primary-700)" />,
          category: 'Paciente',
          title: patient.name,
          subtitle: `Diagnóstico: ${patient.diagnosis}`,
          patientId: patient.id,
          tab: 'notes'
        });
      }

      // 2. Session Clinical Notes Match
      if (patient.notes) {
        patient.notes.forEach(note => {
          if (note.summary && note.summary.toLowerCase().includes(lower)) {
            results.push({
              id: `n-${note.id}`,
              type: 'note',
              icon: <FileText size={16} color="#2563EB" />,
              category: `Sessão #${note.sessionNum} (${note.date})`,
              title: patient.name,
              subtitle: note.summary,
              patientId: patient.id,
              tab: 'notes'
            });
          }

          // 3. Confidential Notes Match
          if (note.confidentialNote && note.confidentialNote.toLowerCase().includes(lower)) {
            results.push({
              id: `c-${note.id}`,
              type: 'confidential',
              icon: <Lock size={16} color="#D97762" />,
              category: `Cofre Sigiloso - Sessão #${note.sessionNum}`,
              title: patient.name,
              subtitle: note.confidentialNote,
              patientId: patient.id,
              tab: 'confidential'
            });
          }
        });
      }

      // 4. Patient Activity Responses Match
      if (patient.activities) {
        patient.activities.forEach(act => {
          if (act.patientResponse) {
            const respStr = JSON.stringify(act.patientResponse).toLowerCase();
            if (respStr.includes(lower)) {
              results.push({
                id: `a-${act.id}`,
                type: 'activity',
                icon: <ClipboardList size={16} color="#16A34A" />,
                category: `Atividade: ${act.title}`,
                title: patient.name,
                subtitle: act.patientResponse.thought || act.patientResponse.situation || 'Resposta registrada',
                patientId: patient.id,
                tab: 'activities'
              });
            }
          }
        });
      }
    });

    return results;
  };

  const results = getSearchResults();

  const handleResultClick = (res) => {
    onSelectPatientAndTab(res.patientId, res.tab);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1400,
      paddingTop: '4rem',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '680px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '0', overflow: 'hidden' }}>
        
        {/* Search Input Bar */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--neutral-200)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={20} color="var(--primary-700)" />
          <input
            type="text"
            placeholder="Digite palavras-chave (ex: ansiedade, insônia, crise, Mariana)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: 'var(--neutral-900)',
              background: 'transparent'
            }}
          />
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--neutral-400)" />
          </button>
        </div>

        {/* Results List Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {!query.trim() ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--neutral-500)' }}>
              <Sparkles size={36} color="var(--primary-400)" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontWeight: 600, color: 'var(--neutral-700)' }}>Busca Inteligente nos Prontuários</p>
              <p style={{ fontSize: '0.825rem', marginTop: '4px' }}>
                Pesquise por termos clínicos, gatilhos ou nomes em todas as evoluções da clínica.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--neutral-500)' }}>
              <p>Nenhum registro encontrado para "<strong>{query}</strong>".</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Resultados Encontrados ({results.length})
              </div>

              {results.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleResultClick(res)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--neutral-50)',
                    border: '1px solid var(--neutral-200)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
                    <div style={{ background: '#ffffff', padding: '8px', borderRadius: '8px', border: '1px solid var(--neutral-200)' }}>
                      {res.icon}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                          {res.title}
                        </span>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {res.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--neutral-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        "{res.subtitle}"
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--neutral-400)" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
