import React from 'react';
import { Search, Plus, Bell, Shield, Sparkles, Sun, Moon, Menu } from 'lucide-react';

export default function Header({ 
  activeTab, 
  onOpenNewPatient, 
  onOpenNewActivity, 
  isDarkMode, 
  onToggleTheme, 
  onOpenSearch,
  onOpenNotifications,
  isSidebarCollapsed,
  onToggleSidebar
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard & Visão Geral';
      case 'patients': return 'Prontuários & Pacientes';
      case 'agenda': return 'Agenda de Sessões';
      case 'activities': return 'Central de Ferramentas Terapêuticas';
      case 'financial': return 'Gestão Financeira & Recibos';
      default: return 'Painel da Psicóloga';
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--neutral-300)',
                color: 'var(--primary-700)',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
              title={isSidebarCollapsed ? "Expandir Menu Lateral (Mostrar Opções)" : "Recolher Menu Lateral (Modo Foco)"}
            >
              <Menu size={20} />
            </button>
          )}

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-900)' }}>
            {getTabTitle()}
          </h2>
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> Prontuários & Psicoterapia
          </span>
        </div>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.875rem', marginTop: '2px' }}>
          Acompanhamento clínico, prontuários seguros e tarefas interativas.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Search Bar Button Trigger */}
        <div 
          onClick={onOpenSearch}
          style={{ 
            position: 'relative', 
            minWidth: '260px',
            cursor: 'pointer'
          }}
        >
          <Search size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            readOnly
            placeholder="Buscar prontuário, termo..."
            onClick={onOpenSearch}
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--neutral-300)',
              background: 'var(--card-bg)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Dark / Light Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--neutral-300)',
            background: 'var(--card-bg)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Noturno'}
        >
          {isDarkMode ? <Sun size={18} color="#EAB308" /> : <Moon size={18} color="var(--primary-700)" />}
        </button>

        {/* Quick Actions */}
        <button className="btn btn-secondary" onClick={onOpenNewPatient}>
          <Plus size={16} /> Novo Paciente
        </button>

        <button className="btn btn-primary" onClick={onOpenNewActivity}>
          <Plus size={16} /> Atribuir Atividade
        </button>

        {/* Notification Bell */}
        <button 
          onClick={onOpenNotifications}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--neutral-200)',
            background: 'var(--card-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
          title="Ver Central de Notificações e Alertas"
        >
          <Bell size={18} color="var(--primary-700)" />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-terracotta)'
          }} />
        </button>
      </div>
    </header>
  );
}
