import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Clock, Plus, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

export default function PatientGoalsView({ patient }) {
  const [goals, setGoals] = useState([
    {
      id: 'g-1',
      title: 'Identificar e reestruturar 3 pensamentos automáticos de catastrofização por semana',
      category: 'Cognitiva',
      status: 'Concluído',
      targetDate: '2026-08-01',
      strategy: 'Utilização diária do Registro de Pensamentos Disfuncionais (RPD).'
    },
    {
      id: 'g-2',
      title: 'Estabelecer rotina de higiene do sono (dormir antes das 23h50 em 5 dias da semana)',
      category: 'Rotina/Sono',
      status: 'Em Andamento',
      targetDate: '2026-08-20',
      strategy: 'Desligar telas às 22h30 e praticar respiração diafragmática.'
    },
    {
      id: 'g-3',
      title: 'Praticar exposição gradual a reuniões de trabalho presenciais sem evitar o ambiente',
      category: 'Comportamental',
      status: 'Em Andamento',
      targetDate: '2026-09-10',
      strategy: 'Hierarquia de exposição com auxílio do termômetro de ansiedade.'
    }
  ]);

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Cognitiva');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [newStrategy, setNewStrategy] = useState('');

  // Compute overall progress percentage
  const completedCount = goals.filter(g => g.status === 'Concluído').length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const handleToggleStatus = (id) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        return {
          ...g,
          status: g.status === 'Concluído' ? 'Em Andamento' : 'Concluído'
        };
      }
      return g;
    }));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoalObj = {
      id: `g-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      status: 'Em Andamento',
      targetDate: newTargetDate || '2026-09-30',
      strategy: newStrategy || 'Combinação em sessão psicoterapêutica.'
    };

    setGoals(prev => [...prev, newGoalObj]);
    setNewTitle('');
    setNewStrategy('');
    setIsAddingGoal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Progress Header Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--neutral-50), var(--primary-50))', border: '1px solid var(--primary-200)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={22} color="var(--primary-700)" />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>
                Plano Terapêutico & Objetivos Clínicos
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
              Metas pactuadas com o paciente no processo psicoterapêutico.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setIsAddingGoal(true)}>
            <Plus size={16} /> Nova Meta Terapêutica
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              Progresso Geral das Metas
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              {progressPercent}% Alcançado ({completedCount}/{goals.length} Metas)
            </span>
          </div>

          <div style={{ height: '10px', background: 'var(--neutral-200)', borderRadius: '99px', overflow: 'hidden' }}>
            <div 
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, var(--primary-600), #4B9B82)',
                borderRadius: '99px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Add Goal Form Drawer */}
      {isAddingGoal && (
        <form onSubmit={handleAddGoal} className="card" style={{ background: 'var(--neutral-50)', border: '1px solid var(--primary-300)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', fontWeight: 700 }}>
            Cadastrar Nova Meta Terapêutica
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Descrição da Meta
              </label>
              <input
                type="text"
                placeholder="Ex: Praticar técnica de relaxamento ao sentir sinais de ansiedade"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Categoria
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
              >
                <option value="Cognitiva">Cognitiva</option>
                <option value="Comportamental">Comportamental</option>
                <option value="Emocional">Emocional</option>
                <option value="Rotina/Sono">Rotina / Sono</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
                Data Prevista
              </label>
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--neutral-700)', display: 'block', marginBottom: '4px' }}>
              Estratégia TCC Combinada
            </label>
            <input
              type="text"
              placeholder="Ex: Utilizar cartão de enfrentamento e técnica ACREDITE..."
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAddingGoal(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Salvar Meta no Plano
            </button>
          </div>
        </form>
      )}

      {/* Goals Checklist List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {goals.map((g) => {
          const isDone = g.status === 'Concluído';
          return (
            <div 
              key={g.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderLeft: isDone ? '4px solid #16A34A' : '4px solid var(--primary-600)',
                background: isDone ? 'rgba(220, 252, 231, 0.2)' : 'var(--card-bg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                <button 
                  onClick={() => handleToggleStatus(g.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginTop: '2px' }}
                >
                  {isDone ? (
                    <CheckCircle2 size={24} color="#16A34A" />
                  ) : (
                    <Circle size={24} color="var(--neutral-400)" />
                  )}
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: 700, 
                      color: isDone ? 'var(--neutral-500)' : 'var(--primary-900)',
                      textDecoration: isDone ? 'line-through' : 'none'
                    }}>
                      {g.title}
                    </h4>
                    <span className="badge badge-info">{g.category}</span>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
                    <strong>Estratégia:</strong> {g.strategy}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> Previsão de Alcance: {g.targetDate}
                  </div>
                </div>
              </div>

              <span className={`badge ${isDone ? 'badge-success' : 'badge-warning'}`}>
                {g.status}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
