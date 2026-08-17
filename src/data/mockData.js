export const psychologistProfile = {
  name: "Dra. Camila Andrade",
  crp: "CRP 06/142982",
  specialty: "Psicoterapia Clínica & Atendimento Integrativo",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
  email: "camila.andrade@psivisor.com.br"
};

export const initialPatients = [
  {
    id: "p1",
    name: "Mariana Silva",
    age: 32,
    birthDate: "1994-08-15",
    phone: "(11) 98765-4321",
    email: "mariana.silva@email.com",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo/SP",
    emergencyContact: "Carlos Silva (Irmão) - (11) 97777-1111",
    packageType: "Semanal",
    diagnosis: "Ansiedade Generalizada (TAG)",
    status: "Ativo",
    sessionDayOfWeek: "Terça-feira",
    sessionStartTime: "14:00",
    sessionDuration: 50,
    sessionEndTime: "14:50",
    sessionDay: "Terça-feira das 14:00 às 14:50 (50 min)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    notes: [
      {
        id: "n1",
        date: "2026-08-04",
        sessionNum: 12,
        summary: "Trabalhamos reflexão e ressignificação sobre medo de avaliação negativa no trabalho.",
        confidentialNote: "Paciente relatou alta cobrança da mãe durante a infância. Explorar pontos centrais na próxima sessão."
      },
      {
        id: "n2",
        date: "2026-07-28",
        sessionNum: 11,
        summary: "Treino de respiração diafragmática para crises de ansiedade noturna.",
        confidentialNote: "Apresentou melhora no sono após início da técnica de higiene do sono."
      }
    ],
    journalEntries: [
      {
        id: "j-1",
        date: "Hoje, 14:30",
        moods: ["Ansiosa", "Pouca energia"],
        activities: ["Caminhada"],
        others: ["Estresse", "Exercícios de respiração"],
        mood: "😰 Ansiosa, 🔋 Pouca energia",
        text: "Senti tensão muscular antes da reunião com o cliente, mas apliquei a técnica de respiração por 5 minutos e me acalmei."
      },
      {
        id: "j-2",
        date: "Ontem, 20:15",
        moods: ["Calma", "Feliz"],
        activities: ["Yoga"],
        others: ["Meditação"],
        mood: "😌 Calma, 🙂 Feliz",
        text: "Consegui ter uma boa noite de sono e fiz 20 minutos de yoga."
      }
    ],
    activities: [
      {
        id: "act-m1",
        title: "Registro de Pensamentos e Sentimentos",
        type: "Reflexão",
        assignedDate: "2026-08-05",
        dueDate: "2026-08-11",
        status: "Concluído",
        patientResponse: {
          submittedAt: "10/08/2026 19:40",
          situation: "Reunião de alinhamento com a diretoria da empresa",
          thought: "Tenho certeza que vão criticar meu relatório e perceber que não fiz o suficiente.",
          emotion: "Ansiedade e Medo",
          intensity: 8,
          rationalResponse: "Revisamos os dados três vezes e meu gestor elogiou o rascunho ontem. É uma preocupação antecipada.",
          outcomeIntensity: 4
        }
      },
      {
        id: "act-m2",
        title: "Diário de Ancoragem e Respiração",
        type: "Diário",
        assignedDate: "2026-08-11",
        dueDate: "2026-08-18",
        status: "Pendente",
        patientResponse: null
      }
    ]
  },
  {
    id: "p2",
    name: "Lucas Mendes",
    age: 28,
    birthDate: "1998-03-22",
    phone: "(11) 91234-5678",
    email: "lucas.mendes@email.com",
    address: "Rua Vergueiro, 500 - Vila Mariana, São Paulo/SP",
    emergencyContact: "Ana Mendes (Esposa) - (11) 98888-2222",
    packageType: "Semanal",
    diagnosis: "Depressão Leve / Burnout",
    status: "Ativo",
    sessionDayOfWeek: "Quarta-feira",
    sessionStartTime: "16:00",
    sessionDuration: 50,
    sessionEndTime: "16:50",
    sessionDay: "Quarta-feira das 16:00 às 16:50 (50 min)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    notes: [
      {
        id: "n3",
        date: "2026-08-05",
        sessionNum: 8,
        summary: "Planejamento de rotina e autocuidado. Definição de micro-metas de caminhada.",
        confidentialNote: "Queixa frequente sobre falta de propósito na empresa atual. Avaliar apoio em transição."
      }
    ],
    activities: [
      {
        id: "act-l1",
        title: "Monitoramento Semanal de Atividades e Humor",
        type: "Humor",
        assignedDate: "2026-08-06",
        dueDate: "2026-08-12",
        status: "Concluído",
        patientResponse: {
          submittedAt: "11/08/2026 10:15",
          daysLogged: [
            { day: "Segunda", rating: 4, note: "Dificuldade para levantar da cama." },
            { day: "Terça", rating: 6, note: "Caminhei 20 min pela manhã, me senti mais disposto." },
            { day: "Quarta", rating: 7, note: "Consegui concluir 2 tarefas pendentes." }
          ],
          avgMood: 5.6
        }
      }
    ]
  },
  {
    id: "p3",
    name: "Beatriz Costa",
    age: 41,
    birthDate: "1985-11-10",
    phone: "(11) 97777-8888",
    email: "beatriz.costa@email.com",
    address: "Rua Augusta, 1200 - Consolação, São Paulo/SP",
    emergencyContact: "Roberto Costa (Marido) - (11) 99999-3333",
    packageType: "Quinzenal",
    diagnosis: "Transições de Carreira & Autoestima",
    status: "Ativo",
    sessionDayOfWeek: "Quinta-feira",
    sessionStartTime: "10:00",
    sessionDuration: 50,
    sessionEndTime: "10:50",
    sessionDay: "Quinta-feira das 10:00 às 10:50 (50 min)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    notes: [],
    activities: []
  }
];

export const initialAppointments = [
  {
    id: "ap1",
    patientId: "p1",
    patientName: "Mariana Silva",
    time: "14:00 - 14:50",
    date: "2026-08-11",
    type: "Online (Google Meet)",
    status: "Confirmado",
    activityPending: "Mariana respondeu ao exercício de reflexão ontem!"
  },
  {
    id: "ap2",
    patientId: "p2",
    patientName: "Lucas Mendes",
    time: "16:00 - 16:50",
    date: "2026-08-11",
    type: "Presencial - Consultório 02",
    status: "Confirmado",
    activityPending: "Lucas enviou o Diário de Humor hoje cedo"
  },
  {
    id: "ap3",
    patientId: "p3",
    patientName: "Beatriz Costa",
    time: "10:00 - 10:50",
    date: "2026-08-13",
    type: "Online",
    status: "Agendado",
    activityPending: null
  }
];

export const activityTemplates = [
  {
    id: "tpl-rpd",
    title: "Registro de Pensamentos e Sentimentos",
    type: "Reflexão",
    category: "Reflexão Clínica",
    description: "Ajuda o paciente a identificar a situação gatilho, os pensamentos automáticos, as emoções sentidas e a construir um olhar reflexivo e equilibrado.",
    fields: [
      { name: "situation", label: "Qual foi a situação ou acontecimento gatilho?", type: "textarea" },
      { name: "thought", label: "Qual pensamento passou pela sua cabeça?", type: "textarea" },
      { name: "emotion", label: "Qual emoção sentiu?", type: "text" },
      { name: "intensity", label: "Intensidade da Emoção (1 a 10)", type: "scale" },
      { name: "rationalResponse", label: "Qual uma perspectiva alternativa ou mais equilibrada?", type: "textarea" }
    ]
  },
  {
    id: "tpl-humor",
    title: "Rastreador Diário de Humor e Atividades",
    type: "Humor",
    category: "Rotina & Atividades",
    description: "O paciente pontua o nível de bem-estar e humor diariamente, acompanhado de breves notas de eventos.",
    fields: [
      { name: "moodScore", label: "Como avalia seu humor hoje? (1 a 10)", type: "scale" },
      { name: "activitiesDone", label: "Quais atividades prazerosas ou de autocuidado realizou?", type: "textarea" }
    ]
  },
  {
    id: "tpl-ansiedade",
    title: "Escala de Monitoramento de Sintomas de Ansiedade",
    type: "Ansiedade",
    category: "Ansiedade",
    description: "Avaliação diária dos sintomas físicos e emocionais de ansiedade.",
    fields: [
      { name: "physicalSymptoms", label: "Sentiu taquicardia, tensão muscular ou desconforto?", type: "textarea" },
      { name: "copingUsed", label: "Usou a técnica de respiração ou ancoragem praticada?", type: "text" }
    ]
  }
];
