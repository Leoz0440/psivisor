import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  DollarSign 
} from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, setPatientMode }) {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'activities', label: 'Tarefas', icon: BookOpen },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
  ];

  return (
    <div 
      className="mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(11, 23, 19, 0.94)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.5rem 0.75rem calc(0.5rem + env(safe-area-inset-bottom))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.3)'
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              setPatientMode(false);
              setActiveTab(item.id);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '0.35rem 0.5rem',
              borderRadius: '8px',
              color: isActive ? '#4B9B82' : '#94A3B8',
              cursor: 'pointer',
              flex: 1,
              transition: 'all 0.2s ease'
            }}
          >
            <Icon size={20} color={isActive ? '#4B9B82' : '#94A3B8'} />
            <span style={{ 
              fontSize: '0.68rem', 
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#ffffff' : '#94A3B8'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
