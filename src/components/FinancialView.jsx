import React, { useState } from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  Plus, 
  ArrowUpRight, 
  Download,
  Calendar,
  Filter,
  Check
} from 'lucide-react';

import { getPsychologistContext } from '../services/psychologyService';

const initialDemoFinancialRecords = [
  {
    id: 'fin-1',
    patientId: 'p1',
    patientName: 'Mariana Silva',
    date: '2026-08-11',
    amount: 180.00,
    method: 'Pix',
    status: 'Pago',
    receiptIssued: true
  },
  {
    id: 'fin-2',
    patientId: 'p2',
    patientName: 'Lucas Mendes',
    date: '2026-08-11',
    amount: 200.00,
    method: 'Pix',
    status: 'Pendente',
    receiptIssued: false
  },
  {
    id: 'fin-3',
    patientId: 'p1',
    patientName: 'Mariana Silva',
    date: '2026-08-04',
    amount: 180.00,
    method: 'Transferência',
    status: 'Pago',
    receiptIssued: true
  },
  {
    id: 'fin-4',
    patientId: 'p3',
    patientName: 'Beatriz Costa',
    date: '2026-08-06',
    amount: 220.00,
    method: 'Cartão de Crédito',
    status: 'Pago',
    receiptIssued: false
  }
];

export default function FinancialView({ patients, onOpenReceiptModal }) {
  const activePsychologistId = getPsychologistContext();
  const cleanPsychId = activePsychologistId.replace(/[^a-z0-9_-]/gi, '_');

  const [records, setRecords] = useState(() => {
    const key = `psivisor_${cleanPsychId}_financial_records`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    const isDemo = activePsychologistId.includes('patricia') || activePsychologistId.includes('061234') || activePsychologistId === 'demo';
    const defaultRecs = isDemo ? initialDemoFinancialRecords : [];
    localStorage.setItem(key, JSON.stringify(defaultRecs));
    return defaultRecs;
  });

  const saveRecords = (newRecords) => {
    setRecords(newRecords);
    const key = `psivisor_${cleanPsychId}_financial_records`;
    localStorage.setItem(key, JSON.stringify(newRecords));
  };

  const [filterStatus, setFilterStatus] = useState('Todos');

  // Compute metrics
  const totalReceived = records
    .filter(r => r.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = records
    .filter(r => r.status === 'Pendente')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleToggleStatus = (recordId) => {
    const updated = records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: r.status === 'Pago' ? 'Pendente' : 'Pago'
        };
      }
      return r;
    });
    saveRecords(updated);
  };

  const filteredRecords = records.filter(r => {
    if (filterStatus === 'Todos') return true;
    return r.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        
        {/* Metric 1: Received */}
        <div className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 500 }}>Faturamento Recebido (Mês)</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-900)', marginTop: '4px' }}>
                R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div style={{ background: 'var(--primary-100)', padding: '12px', borderRadius: '12px', color: 'var(--primary-800)' }}>
              <TrendingUp size={24} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600, display: 'block', marginTop: '6px' }}>
            + 15% em relação ao mês anterior
          </span>
        </div>

        {/* Metric 2: Pending */}
        <div className="card" style={{ borderLeft: '4px solid #EAB308' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 500 }}>Valores a Receber (Pendente)</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#854D0E', marginTop: '4px' }}>
                R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div style={{ background: '#FEF9C3', padding: '12px', borderRadius: '12px', color: '#854D0E' }}>
              <Clock size={24} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#854D0E', display: 'block', marginTop: '6px' }}>
            1 sessão aguardando confirmação Pix
          </span>
        </div>

        {/* Metric 3: Session Average */}
        <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 500 }}>Ticket Médio por Sessão</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1E40AF', marginTop: '4px' }}>
                R$ 195,00
              </h3>
            </div>
            <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '12px', color: '#1E40AF' }}>
              <DollarSign size={24} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', display: 'block', marginTop: '6px' }}>
            Base de 3 pacientes ativos
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
        
        {/* Table Header & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>Lançamentos & Honorários</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--neutral-500)' }}>
              Controle financeiro individual e emissão de recibos para reembolso do plano de saúde.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--neutral-600)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> Status:
            </span>
            {['Todos', 'Pago', 'Pendente'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Table */}
        <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--neutral-100)', color: 'var(--neutral-700)', borderBottom: '1px solid var(--neutral-300)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Paciente</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Data da Sessão</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Valor</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Método</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Ações / Recibo</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                    {r.patientName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--neutral-600)' }}>
                    {r.date}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                    R$ {r.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--neutral-600)' }}>
                    {r.method}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <button
                      onClick={() => handleToggleStatus(r.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <span className={`badge ${r.status === 'Pago' ? 'badge-success' : 'badge-warning'}`}>
                        {r.status === 'Pago' ? '✓ Pago' : '⏳ Pendente'}
                      </span>
                    </button>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenReceiptModal(r)}
                    >
                      <FileText size={14} /> Gerar Recibo PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
