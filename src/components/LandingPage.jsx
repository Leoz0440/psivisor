import React, { useState } from 'react';
import { 
  Brain, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Key, 
  Smartphone, 
  Eye, 
  DollarSign, 
  Lock, 
  Heart, 
  Star, 
  ChevronRight,
  Download,
  Calendar,
  Check,
  Shield,
  Zap,
  Award
} from 'lucide-react';

export default function LandingPage({ onGoToLogin, onGoToDemo, onSelectPlan, onOpenSubscription }) {
  const [selectedBilling, setSelectedBilling] = useState('monthly'); // 'monthly' | 'annual'

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F1A17',
      color: '#F1F5F9',
      fontFamily: 'Inter, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR */}
      {/* ========================================================================= */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(15, 26, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/psivisor_logo_concept_1.jpg"
              alt="PsiVisor Logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--primary-400)',
                boxShadow: '0 0 15px rgba(75, 155, 130, 0.4)'
              }}
            />
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', display: 'block', lineHeight: 1 }}>
                PsiVisor
              </span>
              <span style={{ fontSize: '0.68rem', color: '#8FA998', fontWeight: 600 }}>
                Gestão Clínica & Prontuários
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }} className="desktop-only">
            <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>Recursos</button>
            <button onClick={() => scrollToSection('anamnesis')} style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>Anamnese</button>
            <button onClick={() => scrollToSection('patient-portal')} style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>Portal do Paciente</button>
            <button onClick={() => scrollToSection('pricing')} style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>Planos & Valores</button>
            <button onClick={() => scrollToSection('security')} style={{ background: 'none', border: 'none', color: '#CBD5E1', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>Segurança & LGPD</button>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={onGoToLogin}
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Fazer Login
            </button>

            <button
              onClick={onOpenSubscription ? () => onOpenSubscription('trial') : onGoToLogin}
              style={{
                background: 'linear-gradient(135deg, #4B9B82, #2C5E4E)',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(75, 155, 130, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={16} /> Testar 14 Dias Grátis
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section style={{
        padding: '5rem 1.5rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(75, 155, 130, 0.2) 0%, rgba(15, 26, 23, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(75, 155, 130, 0.15)',
            border: '1px solid rgba(75, 155, 130, 0.3)',
            color: '#A3B8AD',
            padding: '6px 16px',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} color="#4B9B82" />
            A Plataforma Definitiva para Psicólogas no Brasil
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            maxWidth: '900px',
            margin: '0 auto 1.25rem',
            background: 'linear-gradient(135deg, #ffffff 40%, #A3B8AD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Prontuários Inteligentes, Anamneses Estruturadas e Diário do Paciente em Tempo Real.
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#94A3B8',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            O <strong>PsiVisor</strong> combina o sigilo ético exigido pelo CFP e pela LGPD com ferramentas interativas que aproximam o paciente do tratamento e economizam até 70% do seu tempo de gestão.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <button
              onClick={onGoToLogin}
              style={{
                background: 'linear-gradient(135deg, #4B9B82, #2C5E4E)',
                color: '#ffffff',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(75, 155, 130, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s ease'
              }}
            >
              🚀 Começar Teste Grátis de 14 Dias
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onGoToDemo}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem 1.75rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Eye size={18} color="#8FA998" />
              Ver Demonstração ao Vivo
            </button>
          </div>

          {/* Hero Feature Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            maxWidth: '1050px',
            margin: '0 auto'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '12px', textAlign: 'left' }}>
              <ShieldCheck size={28} color="#4B9B82" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>100% Conforme LGPD & CFP</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>Separação estrita entre evolução de prontuário e anotações confidenciais.</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '12px', textAlign: 'left' }}>
              <FileText size={28} color="#4B9B82" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>3 Modelos de Anamnese</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>Questionários clínicos estruturados para Adultos, Crianças (Pais) e Adolescentes.</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '12px', textAlign: 'left' }}>
              <BookOpen size={28} color="#4B9B82" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Diário Emocional em Tempo Real</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>Acompanhe o humor, atividades e gatilhos do paciente dia após dia.</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '12px', textAlign: 'left' }}>
              <Eye size={28} color="#4B9B82" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Modo Supervisão (Anônimo)</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>Oculte dados sensíveis instantaneamente para reuniões de discussão de casos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DETAILED FEATURES SECTION */}
      {/* ========================================================================= */}
      <section id="features" style={{
        padding: '5rem 1.5rem',
        background: '#0C1613',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B9B82', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Funcionalidades Exclusivas
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
              Tudo o que seu consultório precisa em um só lugar
            </h2>
            <p style={{ fontSize: '1rem', color: '#94A3B8', maxWidth: '600px', margin: '8px auto 0' }}>
              Desenvolvido com foco total na rotina clínica da psicóloga e na adesão do paciente.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            
            {/* Feature 1 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75, 155, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Lock size={24} color="#4B9B82" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Prontuário com Dupla Proteção</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Separe claramente a <strong>evolução clínica da sessão</strong> (que pode ser compartilhada ou exportada) das <strong>anotações confidenciais da psicóloga</strong> (protegidas por sigilo absoluto).
              </p>
            </div>

            {/* Feature 2 (Anamnese) */}
            <div id="anamnesis" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(75, 155, 130, 0.3)', borderRadius: '16px', padding: '2rem', boxShadow: '0 0 20px rgba(75, 155, 130, 0.1)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75, 155, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <FileText size={24} color="#4B9B82" />
              </div>
              <div style={{ display: 'inline-block', background: 'var(--primary-700)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '6px' }}>
                Destaque PsiVisor
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>3 Modelos Oficiais de Anamnese</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Fichas completas para <strong>Adultos</strong>, <strong>Crianças (Entrevista com Pais)</strong> e <strong>Adolescentes</strong>. Com seletores rápidos de sexo, estado civil e cálculo automático de idade.
              </p>
            </div>

            {/* Feature 3 (Patient Portal) */}
            <div id="patient-portal" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75, 155, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Smartphone size={24} color="#4B9B82" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Portal do Paciente por PIN</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Acesso extremamente fácil sem necessidade de instalar aplicativos. O paciente acessa com um PIN de 8 caracteres (ex: <code>MARI4829</code>) e responde ao diário emocional pelo celular.
              </p>
            </div>

            {/* Feature 4 (Activities) */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75, 155, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Brain size={24} color="#4B9B82" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Ferramentas & Atividades Terapêuticas</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Envie tarefas clínicas, diários de acompanhamento e rotinas terapêuticas diretamente para o celular do paciente com 1 clique.
              </p>
            </div>

            {/* Feature 5 (Financial) */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75, 155, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <DollarSign size={24} color="#4B9B82" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Financeiro & Recibos Automáticos</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Controle o pagamento de pacotes de sessões, acompanhe honorários pendentes e emita recibos de atendimento com layout profissional para imposto de renda.
              </p>
            </div>

            {/* Feature 6 (PDF Export) */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75, 155, 130, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Download size={24} color="#4B9B82" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Exportação de Documentos PDF</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Gere atestados psicológicos, declarações de comparecimento, contratos terapêuticos e prontuários oficiais formatados com cabeçalho do seu CRP.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SUBSCRIPTION PRICING SECTION */}
      {/* ========================================================================= */}
      <section id="pricing" style={{
        padding: '5rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            color: '#EAB308',
            padding: '4px 14px',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            <Award size={14} /> Investimento Transparente para Seu Consultório
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>
            Planos Simples e Sem Pegadinhas
          </h2>
          <p style={{ fontSize: '1rem', color: '#94A3B8', maxWidth: '540px', margin: '8px auto 1.5rem' }}>
            Experimente gratuitamente por 14 dias. Não pedimos cartão de crédito no cadastro.
          </p>

          {/* Monthly / Annual Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => setSelectedBilling('monthly')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                border: 'none',
                background: selectedBilling === 'monthly' ? '#4B9B82' : 'transparent',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Cobrança Mensal
            </button>
            <button
              onClick={() => setSelectedBilling('annual')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                border: 'none',
                background: selectedBilling === 'annual' ? '#4B9B82' : 'transparent',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Cobrança Anual <span style={{ background: '#EAB308', color: '#000000', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>20% OFF</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch',
          maxWidth: '1050px',
          margin: '0 auto'
        }}>
          
          {/* Plan 1: Teste Grátis */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8FA998', textTransform: 'uppercase' }}>Degustação</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>Teste 14 Dias Grátis</h3>
              <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginTop: '4px' }}>Experimente todos os recursos sem compromisso.</p>

              <div style={{ margin: '1.5rem 0', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff' }}>R$ 0</span>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}> por 14 dias</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Acesso total a todas as funções</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> 3 Modelos de Anamnese Clínica</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Diário Emocional do Paciente</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Modo Supervisão (Anônimo)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Sem necessidade de cartão</li>
              </ul>
            </div>

            <button
              onClick={onOpenSubscription ? () => onOpenSubscription('trial') : onGoToLogin}
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '2rem'
              }}
            >
              Criar Conta Grátis
            </button>
          </div>

          {/* Plan 2: Profissional Mensal (Featured) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(75, 155, 130, 0.15), rgba(44, 94, 78, 0.25))',
            border: '2px solid #4B9B82',
            borderRadius: '20px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(75, 155, 130, 0.2)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '24px',
              background: '#4B9B82',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Mais Escolhido
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B9B82', textTransform: 'uppercase' }}>Plano Recomendado</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>Profissional PsiVisor</h3>
              <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginTop: '4px' }}>Para psicólogas que buscam eficiência clínica total.</p>

              <div style={{ margin: '1.5rem 0', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
                {selectedBilling === 'monthly' ? (
                  <>
                    <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#ffffff' }}>R$ 69,90</span>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}> / mês</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#ffffff' }}>R$ 54,90</span>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}> / mês (faturado R$ 658,80/ano)</span>
                  </>
                )}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#ffffff' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Pacientes e Prontuários Ilimitados</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> 3 Modelos de Anamnese Estruturada</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Diário Emocional em Tempo Real</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Lembretes e Links via WhatsApp</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Exportação de PDF com Timbrado do CRP</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Gestão Financeira & Recibos Automáticos</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#4B9B82" /> Modo Supervisão Anônima (LGPD)</li>
              </ul>
            </div>

            <button
              onClick={onOpenSubscription ? () => onOpenSubscription(selectedBilling) : onGoToLogin}
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '8px',
                border: 'none',
                background: '#4B9B82',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                marginTop: '2rem',
                boxShadow: '0 4px 15px rgba(75, 155, 130, 0.4)'
              }}
            >
              Assinar Plano Profissional
            </button>
          </div>

          {/* Plan 3: Equipes / Consultório Expandido */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EAB308', textTransform: 'uppercase' }}>Clínicas & Grupos</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>Plano Clínica Ouro</h3>
              <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginTop: '4px' }}>Para equipes de psicólogas e clínicas compartilhadas.</p>

              <div style={{ margin: '1.5rem 0', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff' }}>Sob Consulta</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#EAB308" /> Múltiplas psicólogas na mesma conta</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#EAB308" /> Agenda compartilhada de salas</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#EAB308" /> Relatórios consolidados por profissional</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#EAB308" /> Suporte VIP dedicado via WhatsApp</li>
              </ul>
            </div>

            <button
              onClick={() => window.open('https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Plano%20Clínica%20do%20PsiVisor.', '_blank')}
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'transparent',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '2rem'
              }}
            >
              Falar com Consultor
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECURITY & CFP COMPLIANCE */}
      {/* ========================================================================= */}
      <section id="security" style={{
        padding: '4rem 1.5rem',
        background: '#0C1613',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Shield size={48} color="#4B9B82" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            Compromisso Ético & Segurança da Informação
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: 1.6, marginTop: '8px' }}>
            O <strong>PsiVisor</strong> foi desenhado rigorosamente de acordo com o Código de Ética Profissional do Psicólogo, as Resoluções do CFP nº 01/2009 e 04/2020 e a Lei Geral de Proteção de Dados (LGPD). Todos os prontuários utilizam criptografia de ponta a ponta.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOOTER */}
      {/* ========================================================================= */}
      <footer style={{
        padding: '3rem 1.5rem 2rem',
        background: '#080E0C',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.85rem',
        color: '#64748B'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/psivisor_logo_concept_1.jpg" alt="PsiVisor" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>PsiVisor</span>
          </div>

          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} PsiVisor. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
