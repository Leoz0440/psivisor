import React, { useState, useEffect } from 'react';
import { X, Wind, Eye, Hand, Volume2, Heart, Sparkles, CheckCircle2, Play, Pause, RefreshCw, Square, Sun, BookOpen, Feather, ShieldCheck } from 'lucide-react';

export default function PatientBreathingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('breathing'); // 'breathing', 'grounding', 'meditation'
  
  // Respiração Quadrada 5-5-5-5 State
  const [phase, setPhase] = useState('ready'); 
  const [seconds, setSeconds] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Grounding Step State (5 to 1)
  const [groundingStep, setGroundingStep] = useState(5);

  // Meditation Category State
  const [meditationCategory, setMeditationCategory] = useState('visualization'); // 'visualization', 'mantras', 'prayer', 'bodyscan'

  // Breathing Timer Logic for 5-5-5-5 Square Breathing
  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (phase === 'inhale') {
            if (prev >= 5) {
              setPhase('holdIn');
              return 1;
            }
            return prev + 1;
          } else if (phase === 'holdIn') {
            if (prev >= 5) {
              setPhase('exhale');
              return 1;
            }
            return prev + 1;
          } else if (phase === 'exhale') {
            if (prev >= 5) {
              setPhase('holdOut');
              return 1;
            }
            return prev + 1;
          } else if (phase === 'holdOut') {
            if (prev >= 5) {
              setCompletedCycles((c) => c + 1);
              setPhase('inhale');
              return 1;
            }
            return prev + 1;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, phase]);

  const handleStartBreathing = () => {
    setPhase('inhale');
    setSeconds(1);
    setIsRunning(true);
  };

  const handlePauseBreathing = () => {
    setIsRunning(false);
  };

  const handleResetBreathing = () => {
    setIsRunning(false);
    setPhase('ready');
    setSeconds(0);
    setCompletedCycles(0);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1300,
      padding: '1rem'
    }}>
      <div 
        className="card animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'linear-gradient(180deg, #132A23 0%, #0F1C18 100%)',
          color: '#ffffff',
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(75, 155, 130, 0.2)', padding: '8px', borderRadius: '12px' }}>
              <Wind size={24} color="#4B9B82" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>
                SOS Calma & Desaceleração
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#8FA998' }}>
                Práticas de respiração, ancoragem e meditação para momentos de ansiedade
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8FA998' }}>
            <X size={22} />
          </button>
        </div>

        {/* Tab Selector - 3 Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', padding: '4px', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <button
            onClick={() => { setActiveTab('breathing'); handleResetBreathing(); }}
            style={{
              padding: '8px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'breathing' ? '#4B9B82' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Square size={13} /> Respiração 5-5-5-5
          </button>

          <button
            onClick={() => { setActiveTab('grounding'); setGroundingStep(5); }}
            style={{
              padding: '8px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'grounding' ? '#4B9B82' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            ⚓ Ancoragem
          </button>

          <button
            onClick={() => setActiveTab('meditation')}
            style={{
              padding: '8px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'meditation' ? '#4B9B82' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            🧘 Meditação & Mantras
          </button>
        </div>

        {/* 1. RESPIRAÇÃO QUADRADA 5-5-5-5 TAB */}
        {activeTab === 'breathing' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            
            {/* Visual Indicator of 4 equal phases (5s cada) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', width: '100%' }}>
              <div style={{ padding: '6px', borderRadius: '6px', background: phase === 'inhale' ? '#4B9B82' : 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.725rem', fontWeight: 700, border: phase === 'inhale' ? '1px solid #A3B8AD' : 'none' }}>
                1. INSPIRE (5s)
              </div>
              <div style={{ padding: '6px', borderRadius: '6px', background: phase === 'holdIn' ? '#CA8A04' : 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.725rem', fontWeight: 700, border: phase === 'holdIn' ? '1px solid #FEF08A' : 'none' }}>
                2. SEGURE (5s)
              </div>
              <div style={{ padding: '6px', borderRadius: '6px', background: phase === 'exhale' ? '#2563EB' : 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.725rem', fontWeight: 700, border: phase === 'exhale' ? '1px solid #BFDBFE' : 'none' }}>
                3. EXPIRE (5s)
              </div>
              <div style={{ padding: '6px', borderRadius: '6px', background: phase === 'holdOut' ? '#9333EA' : 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.725rem', fontWeight: 700, border: phase === 'holdOut' ? '1px solid #E9D5FF' : 'none' }}>
                4. PAUSA (5s)
              </div>
            </div>

            {/* Animated Pulsing Breathing Box / Circle */}
            <div style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Outer pulsing ring */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '24px',
                background: phase === 'inhale' ? 'rgba(75, 155, 130, 0.3)' : phase === 'holdIn' ? 'rgba(202, 138, 4, 0.3)' : phase === 'exhale' ? 'rgba(37, 99, 235, 0.3)' : phase === 'holdOut' ? 'rgba(147, 51, 234, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                transform: (phase === 'inhale' || phase === 'holdIn') ? 'scale(1.15)' : (phase === 'exhale' || phase === 'holdOut') ? 'scale(0.88)' : 'scale(1)',
                transition: 'all 1s ease-in-out'
              }} />

              {/* Inner Box */}
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '20px',
                background: phase === 'inhale' ? 'linear-gradient(135deg, #4B9B82, #2C5E4E)' : phase === 'holdIn' ? 'linear-gradient(135deg, #CA8A04, #854D0E)' : phase === 'exhale' ? 'linear-gradient(135deg, #2563EB, #1E40AF)' : phase === 'holdOut' ? 'linear-gradient(135deg, #9333EA, #6B21A8)' : 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transition: 'all 1s ease-in-out'
              }}>
                {phase === 'ready' && (
                  <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>Pronto</span>
                )}
                {phase === 'inhale' && (
                  <>
                    <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 800 }}>INSPIRE</span>
                    <span style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 900 }}>{seconds}s</span>
                    <span style={{ fontSize: '0.7rem', color: '#A3B8AD' }}>Pelo nariz (5s)</span>
                  </>
                )}
                {phase === 'holdIn' && (
                  <>
                    <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 800 }}>SEGURE</span>
                    <span style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 900 }}>{seconds}s</span>
                    <span style={{ fontSize: '0.7rem', color: '#FEF08A' }}>Com ar nos pulmões (5s)</span>
                  </>
                )}
                {phase === 'exhale' && (
                  <>
                    <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 800 }}>EXPIRE</span>
                    <span style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 900 }}>{seconds}s</span>
                    <span style={{ fontSize: '0.7rem', color: '#BFDBFE' }}>Pela boca (5s)</span>
                  </>
                )}
                {phase === 'holdOut' && (
                  <>
                    <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 800 }}>PAUSA</span>
                    <span style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 900 }}>{seconds}s</span>
                    <span style={{ fontSize: '0.7rem', color: '#E9D5FF' }}>Pulmões vazios (5s)</span>
                  </>
                )}
              </div>
            </div>

            {/* Cycle Count */}
            <div style={{ fontSize: '0.85rem', color: '#8FA998' }}>
              Ciclos Quadrados Concluídos: <strong>{completedCycles}</strong> (Recomendado: 4 ciclos)
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {!isRunning ? (
                <button
                  onClick={handleStartBreathing}
                  style={{
                    background: '#4B9B82',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Play size={16} /> {phase === 'ready' ? 'Iniciar Respiração Quadrada' : 'Continuar'}
                </button>
              ) : (
                <button
                  onClick={handlePauseBreathing}
                  style={{
                    background: '#EAB308',
                    color: '#000000',
                    border: 'none',
                    padding: '0.75rem 1.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Pause size={16} /> Pausar
                </button>
              )}

              <button
                onClick={handleResetBreathing}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
                title="Reiniciar"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        )}

        {/* 2. GROUNDING 5-4-3-2-1 TAB */}
        {activeTab === 'grounding' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span className="badge" style={{ background: '#4B9B82', color: '#ffffff', marginBottom: '6px' }}>
                Técnica de Ancoragem TCC
              </span>
              <p style={{ fontSize: '0.85rem', color: '#E4EFEA', marginTop: '4px', lineHeight: 1.5 }}>
                Observe o ambiente ao seu redor para trazer a sua mente de volta ao momento presente.
              </p>
            </div>

            {/* Step Card */}
            <div style={{
              background: 'rgba(75, 155, 130, 0.15)',
              border: '1px solid #4B9B82',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {groundingStep === 5 && (
                <>
                  <div style={{ background: '#4B9B82', padding: '12px', borderRadius: '50%' }}>
                    <Eye size={32} color="#ffffff" />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>5 Coisas que você consegue VER</h4>
                  <p style={{ fontSize: '0.85rem', color: '#A3B8AD' }}>
                    Olhe em volta. Identifique 5 objetos físicos (ex: a mesa, a janela, uma lâmpada, uma planta...).
                  </p>
                </>
              )}

              {groundingStep === 4 && (
                <>
                  <div style={{ background: '#3B82F6', padding: '12px', borderRadius: '50%' }}>
                    <Hand size={32} color="#ffffff" />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>4 Coisas que você consegue TOCAR</h4>
                  <p style={{ fontSize: '0.85rem', color: '#BFDBFE' }}>
                    Sinta as texturas. Toque em 4 superfícies (ex: sua roupa, a textura da mesa, a sola dos sapatos no chão...).
                  </p>
                </>
              )}

              {groundingStep === 3 && (
                <>
                  <div style={{ background: '#EAB308', padding: '12px', borderRadius: '50%' }}>
                    <Volume2 size={32} color="#000000" />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>3 Sons que você consegue OUVRIR</h4>
                  <p style={{ fontSize: '0.85rem', color: '#FEF08A' }}>
                    Preste atenção. Ouça 3 sons ao fundo (ex: o barulho do vento, um carro passando, sua própria respiração...).
                  </p>
                </>
              )}

              {groundingStep === 2 && (
                <>
                  <div style={{ background: '#EC4899', padding: '12px', borderRadius: '50%' }}>
                    <Sparkles size={32} color="#ffffff" />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>2 Cheiros que você consegue SENTIR</h4>
                  <p style={{ fontSize: '0.85rem', color: '#FBCFE8' }}>
                    Respire fundo. Note 2 aromas ao seu redor (ex: o cheiro do café, do sabonete, do ar limpo...).
                  </p>
                </>
              )}

              {groundingStep === 1 && (
                <>
                  <div style={{ background: '#22C55E', padding: '12px', borderRadius: '50%' }}>
                    <Heart size={32} color="#ffffff" />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>1 Sabor que você consegue SENTIR</h4>
                  <p style={{ fontSize: '0.85rem', color: '#BBF7D0' }}>
                    Perceba a sua boca. Note 1 sabor (ex: o gosto da água, menta, ou apenas sinta os lábios).
                  </p>
                </>
              )}

              {/* Progress Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                {groundingStep > 1 ? (
                  <button
                    onClick={() => setGroundingStep((s) => s - 1)}
                    style={{
                      background: '#4B9B82',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.625rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Próximo Passo ({groundingStep - 1}) →
                  </button>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#4B9B82', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                      ✨ Parabéns! Você concluiu o exercício de ancoragem.
                    </span>
                    <button
                      onClick={onClose}
                      style={{
                        background: '#22C55E',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.625rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Concluir & Voltar
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 3. MEDITATION & MANTRAS TAB */}
        {activeTab === 'meditation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            
            {/* Top Intro */}
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.875rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span className="badge" style={{ background: '#4B9B82', color: '#ffffff', marginBottom: '4px' }}>
                🧘 Meditação & Conexão Interior
              </span>
              <p style={{ fontSize: '0.825rem', color: '#E4EFEA', marginTop: '2px', lineHeight: 1.4 }}>
                Escolha uma prática abaixo para guiar seus pensamentos rumo à paz e serenidade.
              </p>
            </div>

            {/* Sub-Category Pill Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => setMeditationCategory('visualization')}
                style={{
                  padding: '6px 2px',
                  borderRadius: '6px',
                  border: 'none',
                  background: meditationCategory === 'visualization' ? '#4B9B82' : 'transparent',
                  color: '#ffffff',
                  fontSize: '0.725rem',
                  fontWeight: meditationCategory === 'visualization' ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                🌄 Visualização
              </button>

              <button
                onClick={() => setMeditationCategory('mantras')}
                style={{
                  padding: '6px 2px',
                  borderRadius: '6px',
                  border: 'none',
                  background: meditationCategory === 'mantras' ? '#4B9B82' : 'transparent',
                  color: '#ffffff',
                  fontSize: '0.725rem',
                  fontWeight: meditationCategory === 'mantras' ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                💬 Mantras
              </button>

              <button
                onClick={() => setMeditationCategory('prayer')}
                style={{
                  padding: '6px 2px',
                  borderRadius: '6px',
                  border: 'none',
                  background: meditationCategory === 'prayer' ? '#4B9B82' : 'transparent',
                  color: '#ffffff',
                  fontSize: '0.725rem',
                  fontWeight: meditationCategory === 'prayer' ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                🙏 Oração
              </button>

              <button
                onClick={() => setMeditationCategory('bodyscan')}
                style={{
                  padding: '6px 2px',
                  borderRadius: '6px',
                  border: 'none',
                  background: meditationCategory === 'bodyscan' ? '#4B9B82' : 'transparent',
                  color: '#ffffff',
                  fontSize: '0.725rem',
                  fontWeight: meditationCategory === 'bodyscan' ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                🌿 Corpo & Presença
              </button>
            </div>

            {/* MEDITATION CONTENT CARDS */}

            {/* 1. VISUALIZAÇÃO MENTAL */}
            {meditationCategory === 'visualization' && (
              <div style={{ background: 'rgba(75, 155, 130, 0.12)', border: '1px solid rgba(75, 155, 130, 0.4)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#4B9B82', padding: '8px', borderRadius: '10px' }}>
                    <Eye size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>Visualização Mental do Lugar Seguro</h4>
                    <span style={{ fontSize: '0.75rem', color: '#8FA998' }}>Técnica de Refúgio Interno TCC</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#E4EFEA', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p>
                    1. <strong>Feche os olhos suavemente</strong> e traga à mente a imagem do seu <strong>Lugar Seguro</strong> — pode ser um refúgio na natureza, uma praia ensolarada, uma floresta serena ou um quarto acolhedor.
                  </p>
                  <p>
                    2. <strong>Observe os detalhes visuais:</strong> sinta as cores vivas, a iluminação suave, a brisa leve tocando o seu rosto e a temperatura agradável na pele.
                  </p>
                  <p>
                    3. <strong>Sinta a proteção:</strong> Neste espaço imaginário, nenhum perigo ou preocupação do mundo exterior pode te atingir. Você está completamente seguro e acolhido.
                  </p>
                  <p style={{ background: 'rgba(255,255,255,0.08)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #4B9B82', fontStyle: 'italic' }}>
                    "Permaneça neste refúgio interno respirando devagar. Lembre-se de que este santuário de paz sempre vive dentro de você."
                  </p>
                </div>
              </div>
            )}

            {/* 2. MANTRAS DE PAZ */}
            {meditationCategory === 'mantras' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.78rem', color: '#8FA998', textAlign: 'center' }}>
                  Repita mentalmente ou em voz baixa cada frase com a respiração calma:
                </p>

                {[
                  { text: 'Este momento vai passar. Eu estou em segurança e acolhido no presente.', icon: '🌸' },
                  { text: 'Solto o controle do que não posso mudar e confio no ritmo suave da vida.', icon: '🌿' },
                  { text: 'Inspiro paz e clareza. Expiro toda a tensão acumulada no meu corpo.', icon: '🌊' },
                  { text: 'Meu corpo relaxa, minha mente desacelera e meu coração encontra a calma.', icon: '✨' }
                ].map((m, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                    <p style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, lineHeight: 1.4 }}>
                      "{m.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. ORAÇÃO & CONEXÃO ESPIRITUAL */}
            {meditationCategory === 'prayer' && (
              <div style={{ background: 'rgba(202, 138, 4, 0.12)', border: '1px solid rgba(202, 138, 4, 0.3)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#CA8A04', padding: '8px', borderRadius: '10px' }}>
                    <Sun size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>Oração da Serenidade & Conexão Interior</h4>
                    <span style={{ fontSize: '0.75rem', color: '#FEF08A' }}>Entrega & Confiança</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.15rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: '#FEF08A', lineHeight: 1.6, fontStyle: 'italic', borderLeft: '4px solid #CA8A04' }}>
                  "Concedei-me a serenidade para aceitar as coisas que não posso mudar, a coragem para mudar as coisas que posso, e a sabedoria para distinguir uma da outra.<br/><br/>
                  Entrego minhas preocupações, solto a ansiedade e recebo no meu peito a quietude, o amor e a proteção divina."
                </div>
              </div>
            )}

            {/* 4. ESCANEAMENTO CORPORAL / BODY SCAN */}
            {meditationCategory === 'bodyscan' && (
              <div style={{ background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#2563EB', padding: '8px', borderRadius: '10px' }}>
                    <Feather size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>Escaneamento Corporal & Presença</h4>
                    <span style={{ fontSize: '0.75rem', color: '#BFDBFE' }}>Desconexão de Tensões Físicas</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.825rem', color: '#E4EFEA' }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '6px' }}>
                    1. <strong>Rosto & Mandíbula:</strong> Solte o aperto dos dentes e suavemente relaxe a testa e os olhos.
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '6px' }}>
                    2. <strong>Ombros & Mãos:</strong> Baixe os ombros longe das orelhas e abra suavemente os dedos das mãos.
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '6px' }}>
                    3. <strong>Peito & Respiração:</strong> Deixe a respiração fluir naturalmente sem forçar nem apressar.
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '6px' }}>
                    4. <strong>Pés no Chão:</strong> Sinta o peso firme do seu corpo repousando com segurança e presença.
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button
                onClick={onClose}
                style={{
                  background: '#4B9B82',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.625rem 1.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Concluir Meditação
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
