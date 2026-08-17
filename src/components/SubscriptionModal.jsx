import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Zap, 
  Award, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Key,
  ExternalLink
} from 'lucide-react';
import { validateCRP, getPasswordStrength } from './AuthLoginScreen';

export default function SubscriptionModal({ isOpen, onClose, defaultPlan = 'monthly', onSubscriptionComplete }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Registration Form, 2: Payment Simulation, 3: Success & Released Credentials

  // Plan Choice
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan); // 'trial' | 'monthly' | 'annual'

  // Psychologist Registration Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [crpNumber, setCrpNumber] = useState('');
  const [specialty, setSpecialty] = useState('Psicologia Clínica & Atendimento Integrativo');
  const [phone, setPhone] = useState('');
  const [cityState, setCityState] = useState('São Paulo - SP');
  const [address, setAddress] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generated Credentials State
  const [generatedPsychologistId, setGeneratedPsychologistId] = useState('');

  // Validations
  const fullCRPString = `CRP ${crpNumber}`;
  const crpValidation = validateCRP(fullCRPString);
  const pwdStrength = getPasswordStrength(password);

  const handleGoToPayment = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu Nome Completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, insira um E-mail válido.');
      return;
    }
    if (!crpValidation.isValid) {
      setErrorMsg(`Registro de CRP inválido: ${crpValidation.reason}`);
      return;
    }
    if (pwdStrength.score < 2) {
      setErrorMsg('A senha escolhida é muito fraca. Ela precisa ter no mínimo 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    setStep(2); // Go to Payment Simulation Step
  };

  const handleSimulatePaymentAndActivate = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Generate Unique Psychologist ID (ex: PSI-84920)
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newPsychologistId = `PSI-${randomNum}`;
      setGeneratedPsychologistId(newPsychologistId);

      // Create new Psychologist Profile object
      const newProfile = {
        id: newPsychologistId,
        psychologistId: newPsychologistId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        crp: crpValidation.formattedCRP || fullCRPString,
        specialty: specialty || 'Psicologia Clínica',
        phone: phone || '(11) 99999-9999',
        cityState: cityState || 'São Paulo - SP',
        address: address || 'Consultório Principal',
        plan: selectedPlan,
        status: 'Ativo',
        createdAt: new Date().toISOString()
      };

      // Store in localStorage for persistent mock login
      const existingUsers = JSON.parse(localStorage.getItem('psivisor_subscribed_psychologists') || '[]');
      existingUsers.push(newProfile);
      localStorage.setItem('psivisor_subscribed_psychologists', JSON.stringify(existingUsers));
      localStorage.setItem('psivisor_active_profile', JSON.stringify(newProfile));

      // Go to Step 3: Success Screen
      setStep(3);
    } catch (err) {
      setErrorMsg('Erro ao registrar assinatura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndLogin = () => {
    if (onSubscriptionComplete) {
      onSubscriptionComplete({
        email: email.trim().toLowerCase(),
        password: password,
        name: name.trim(),
        crp: crpValidation.formattedCRP || fullCRPString,
        psychologistId: generatedPsychologistId
      });
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 26, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      <div 
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1C3C32, #0C1613)',
          color: '#ffffff',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(75, 155, 130, 0.2)', padding: '8px', borderRadius: '10px', color: '#4B9B82' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
                {step === 1 && 'Assinatura do Plano & Cadastro Profissional'}
                {step === 2 && 'Pagamento & Ativação da Conta'}
                {step === 3 && '🎉 Assinatura Concluída com Sucesso!'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#A3B8AD', margin: '2px 0 0' }}>
                {step === 1 && 'Preencha seus dados para solicitar sua chave de acesso e ID de Psicólogo.'}
                {step === 2 && 'Confirme o pagamento para liberar seu login com senha.'}
                {step === 3 && 'Seu ID de Psicólogo foi ativado. Você já pode fazer login no sistema.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '2rem' }}>
          
          {/* Error Banner */}
          {errorMsg && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}>
              {errorMsg}
            </div>
          )}

          {/* STEP 1: REGISTRATION FORM */}
          {step === 1 && (
            <form onSubmit={handleGoToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Plan Picker Header */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Plano Selecionado
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('monthly')}
                    style={{
                      padding: '0.625rem 0.5rem',
                      borderRadius: '8px',
                      border: selectedPlan === 'monthly' ? '2px solid #4B9B82' : '1px solid #CBD5E1',
                      background: selectedPlan === 'monthly' ? '#E4EFEA' : '#ffffff',
                      color: selectedPlan === 'monthly' ? '#1C3C32' : '#64748B',
                      fontWeight: selectedPlan === 'monthly' ? 800 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>Mensal</div>
                    <div style={{ fontWeight: 800 }}>R$ 69,90/mês</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('annual')}
                    style={{
                      padding: '0.625rem 0.5rem',
                      borderRadius: '8px',
                      border: selectedPlan === 'annual' ? '2px solid #4B9B82' : '1px solid #CBD5E1',
                      background: selectedPlan === 'annual' ? '#E4EFEA' : '#ffffff',
                      color: selectedPlan === 'annual' ? '#1C3C32' : '#64748B',
                      fontWeight: selectedPlan === 'annual' ? 800 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>Anual (20% OFF)</div>
                    <div style={{ fontWeight: 800 }}>R$ 54,90/mês</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('trial')}
                    style={{
                      padding: '0.625rem 0.5rem',
                      borderRadius: '8px',
                      border: selectedPlan === 'trial' ? '2px solid #4B9B82' : '1px solid #CBD5E1',
                      background: selectedPlan === 'trial' ? '#E4EFEA' : '#ffffff',
                      color: selectedPlan === 'trial' ? '#1C3C32' : '#64748B',
                      fontWeight: selectedPlan === 'trial' ? 800 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>14 Dias Grátis</div>
                    <div style={{ fontWeight: 800 }}>R$ 0,00</div>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* Nome Completo */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Nome Completo do(a) Psicólogo(a) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Dra. Patrícia Lima"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                </div>

                {/* CRP Input */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                      Registro CRP *
                    </label>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '8px',
                    border: crpValidation.isValid ? '1.5px solid #16A34A' : crpNumber ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                    overflow: 'hidden'
                  }}>
                    <div style={{ background: '#F1F5F9', color: '#334155', fontWeight: 700, fontSize: '0.8rem', padding: '0.6rem 0.75rem', borderRight: '1px solid #CBD5E1' }}>
                      CRP
                    </div>
                    <input
                      type="text"
                      placeholder="06/123456"
                      value={crpNumber}
                      onChange={(e) => setCrpNumber(e.target.value)}
                      style={{ flex: 1, padding: '0.6rem', border: 'none', outline: 'none', fontSize: '0.875rem', fontWeight: 600 }}
                      required
                    />
                  </div>
                  {crpNumber && (
                    <div style={{ fontSize: '0.725rem', marginTop: '3px', color: crpValidation.isValid ? '#16A34A' : '#EF4444', fontWeight: 600 }}>
                      {crpValidation.isValid ? `✓ ${crpValidation.regionName}` : crpValidation.reason}
                    </div>
                  )}
                </div>

                {/* Telefone / WhatsApp */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Telefone / WhatsApp *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                </div>

                {/* E-mail de Acesso */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    E-mail Principal para Login *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      placeholder="dra.patricia@psicoflow.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Senha de Acesso *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 2.25rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirmação de Senha */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Confirmar Senha *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repita sua senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                </div>

                {/* Especialidade / Abordagem */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Especialidade / Abordagem
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Psicologia Clínica & Psicanálise"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Cidade - UF */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Cidade e Estado (UF)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="São Paulo - SP"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4B9B82, #2C5E4E)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(75, 155, 130, 0.4)'
                  }}
                >
                  Prosseguir para Ativação do Plano <ArrowRight size={18} />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: PAYMENT SIMULATION */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#132A23', marginBottom: '8px' }}>
                  Resumo do Pedido & Registro de Assinatura
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                  <span>Psicólogo(a): <strong>{name}</strong></span>
                  <span>{crpValidation.formattedCRP}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569', marginBottom: '4px' }}>
                  <span>E-mail de Login:</span>
                  <strong>{email}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #CBD5E1' }}>
                  <span>Plano Escolhido:</span>
                  <strong style={{ color: '#2C5E4E' }}>
                    {selectedPlan === 'monthly' && 'Profissional Mensal (R$ 69,90/mês)'}
                    {selectedPlan === 'annual' && 'Profissional Anual (R$ 54,90/mês)'}
                    {selectedPlan === 'trial' && 'Degustação (14 Dias Grátis - R$ 0,00)'}
                  </strong>
                </div>
              </div>

              {/* Payment Info Banner (Simulated for now) */}
              <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: '10px', padding: '1rem', color: '#1E40AF', fontSize: '0.85rem', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>ℹ️ Ativação Imediata da Chave de Acesso:</strong>
                A integração do gateway de pagamento final está configurada para ser vinculada em produção. Ao clicar no botão abaixo, sua assinatura será simulada como <strong>Aprovada</strong> e seu <strong>ID de Psicólogo</strong> será gerado e ativado imediatamente.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Voltar e Editar Dados
                </button>

                <button
                  type="button"
                  onClick={handleSimulatePaymentAndActivate}
                  disabled={isSubmitting}
                  style={{
                    padding: '0.875rem 2rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16A34A, #15803D)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 18px rgba(22, 163, 74, 0.35)'
                  }}
                >
                  <CreditCard size={18} />
                  {isSubmitting ? 'Ativando Assinatura...' : 'Concluir Pagamento & Ativar ID'}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: SUCCESS & RELEASED CREDENTIALS */}
          {step === 3 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
              
              <div style={{ background: '#DCFCE7', padding: '16px', borderRadius: '50%', color: '#16A34A', display: 'inline-flex' }}>
                <CheckCircle2 size={54} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#132A23', margin: 0 }}>
                  Conta & Chave de Acesso Ativadas!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '4px' }}>
                  Sua assinatura foi processada com sucesso e seu cadastro profissional foi registrado.
                </p>
              </div>

              {/* ID Badge Display Box */}
              <div style={{
                background: '#F0FDF4',
                border: '2px solid #16A34A',
                borderRadius: '16px',
                padding: '1.5rem',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(22, 163, 74, 0.15)'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Seu ID Único de Psicólogo(a)
                </span>
                
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#15803D', letterSpacing: '2px', margin: '8px 0' }}>
                  {generatedPsychologistId}
                </div>

                <div style={{ fontSize: '0.825rem', color: '#334155', borderTop: '1px dashed #86EFAC', paddingTop: '10px', marginTop: '10px' }}>
                  <strong>Titular:</strong> {name} ({crpValidation.formattedCRP})<br />
                  <strong>E-mail de Login:</strong> {email}
                </div>
              </div>

              <p style={{ fontSize: '0.825rem', color: '#64748B', maxWidth: '480px' }}>
                Guarde seu <strong>ID</strong> e seu <strong>E-mail</strong> para realizar o login restrito no PsiVisor.
              </p>

              <button
                type="button"
                onClick={handleFinishAndLogin}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4B9B82, #2C5E4E)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(75, 155, 130, 0.4)'
                }}
              >
                🚀 Ir para a Tela de Login e Acessar
                <ArrowRight size={18} />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
