import React from 'react';
import { Gift, MessageCircle } from 'lucide-react';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function BirthdayWidget({ patients, onOpenWhatsAppModal }) {
  const currentMonthIdx = new Date().getMonth();
  const currentMonthName = MONTH_NAMES[currentMonthIdx];

  // Process real patient birthdays
  const birthdayPatients = (patients || []).filter(p => {
    if (!p.birthDate) return false;
    const bDate = new Date(p.birthDate);
    return !isNaN(bDate.getTime()) && bDate.getMonth() === currentMonthIdx;
  }).map(p => {
    const bDate = new Date(p.birthDate);
    const day = bDate.getDate() + 1; // 1-indexed date adjustment
    return {
      ...p,
      formattedBirthDate: `${day} de ${currentMonthName}`,
      status: `Aniversariante do Mês`
    };
  });

  // Fallback to sample if none registered yet
  const displayList = birthdayPatients.length > 0 ? birthdayPatients : [
    {
      id: 'p1',
      name: 'Mariana Silva',
      formattedBirthDate: '15 de Agosto',
      age: 28,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      status: 'Aniversário em 4 dias'
    }
  ];

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(135deg, #FEF9C3 0%, #ffffff 100%)', border: '1px solid #FDE047' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gift size={20} color="#854D0E" />
          <h3 style={{ fontSize: '1.05rem', color: '#854D0E', fontWeight: 700 }}>
            Aniversariantes do Mês ({currentMonthName})
          </h3>
        </div>
        <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
          Retenção & Vínculo
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayList.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              border: '1px solid var(--neutral-200)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={p.avatar} alt={p.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  {p.name} ({p.age} anos)
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                  {p.formattedBirthDate || p.birthDate} • <span style={{ color: '#854D0E', fontWeight: 600 }}>{p.status}</span>
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#25D366', color: '#16A34A', fontSize: '0.75rem' }}
              onClick={() => onOpenWhatsAppModal(p, 'birthday')}
            >
              <MessageCircle size={14} /> Enviar Parabéns
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
