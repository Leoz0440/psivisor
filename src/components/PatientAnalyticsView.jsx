import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar 
} from 'recharts';
import { TrendingDown, Smile, AlertCircle, Sparkles, CheckCircle2, Activity } from 'lucide-react';

export default function PatientAnalyticsView({ patient }) {
  // Generate sample trend data based on patient's activities or defaults
  const anxietyTrendData = [
    { session: 'Sessão 8', antes: 9, depois: 5 },
    { session: 'Sessão 9', antes: 8, depois: 4 },
    { session: 'Sessão 10', antes: 8, depois: 4 },
    { session: 'Sessão 11', antes: 7, depois: 3 },
    { session: 'Sessão 12 (Hoje)', antes: 8, depois: 4 }
  ];

  const moodWeeklyData = [
    { day: 'Seg', humor: 4, energia: 5 },
    { day: 'Ter', humor: 6, energia: 6 },
    { day: 'Qua', humor: 7, energia: 7 },
    { day: 'Qui', humor: 5, energia: 6 },
    { day: 'Sex', humor: 8, energia: 8 },
    { day: 'Sáb', humor: 8, energia: 9 },
    { day: 'Dom', humor: 7, energia: 8 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Top Clinical Insights Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        <div className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <TrendingDown size={20} color="var(--primary-700)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-600)' }}>Redução Média de Ansiedade</span>
          </div>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-900)' }}>- 48%</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--primary-600)', marginTop: '2px' }}>
            Efeito significativo após reestruturação cognitiva (RPD).
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Smile size={20} color="#3B82F6" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-600)' }}>Média de Humor Semanal</span>
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#1E40AF' }}>6.5 / 10</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '2px' }}>
            Tendência de alta estabilidade nos fins de semana.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #EAB308' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <CheckCircle2 size={20} color="#854D0E" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-600)' }}>Engajamento com Atividades</span>
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#854D0E' }}>100%</h3>
          <p style={{ fontSize: '0.75rem', color: '#854D0E', marginTop: '2px' }}>
            Todas as tarefas da semana respondidas dentro do prazo.
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Chart 1: Ansiedade RPD (Antes vs Depois) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span className="badge badge-success mb-1">Evolução Cognitiva (TCC)</span>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>
              Intensidade da Ansiedade (Antes vs. Depois da Reestruturação)
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', marginTop: '2px' }}>
              Comparativo da intensidade das emoções registradas nos exercícios RPD.
            </p>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={anxietyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="session" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="antes" name="Antes do Exercício (Gatilho)" stroke="#D97762" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="depois" name="Depois do Exercício (Racional)" stroke="#2C5E4E" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Rastreador Diário de Humor */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span className="badge badge-info mb-1">Rastreio Comportamental</span>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>
              Oscilação do Humor & Energia na Semana
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', marginTop: '2px' }}>
              Pontuação diária (1 a 10) preenchida no diário do paciente.
            </p>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={moodWeeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHumor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <Area type="monotone" dataKey="humor" name="Nível de Humor (1-10)" stroke="#3B82F6" fillOpacity={1} fill="url(#colorHumor)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
