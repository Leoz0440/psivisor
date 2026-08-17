import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 35,
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: '#1E293B',
    lineHeight: 1.45
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#2C5E4E',
    paddingBottom: 8,
    marginBottom: 14
  },
  psychologistName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#132A23'
  },
  psychologistCrp: {
    fontSize: 9,
    color: '#387A66',
    marginTop: 2
  },
  badge: {
    backgroundColor: '#E4EFEA',
    color: '#1C3C32',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3
  },
  title: {
    fontSize: 12.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: '#132A23',
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  body: {
    textAlign: 'justify'
  },
  clause: {
    marginBottom: 7
  },
  clauseTitle: {
    fontFamily: 'Helvetica-Bold',
    color: '#132A23'
  },
  signaturesContainer: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopStyle: 'dashed',
    paddingTop: 10
  },
  dateText: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14
  },
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  signerBox: {
    alignItems: 'center',
    width: '45%'
  },
  line: {
    width: 150,
    height: 1,
    backgroundColor: '#334155',
    marginBottom: 4
  },
  signerName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#132A23'
  },
  signerRole: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 1
  }
});

export default function TherapeuticContractPdf({
  patient,
  psychologistProfile,
  sessionFee,
  sessionFrequency,
  cancellationNotice,
  paymentTerms,
  emergencyContact,
  currentDateStr
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.psychologistName}>{psychologistProfile.name}</Text>
            <Text style={styles.psychologistCrp}>
              {psychologistProfile.crp} • {psychologistProfile.specialty}
            </Text>
          </View>
          <View>
            <Text style={styles.badge}>CONTRATO TERAPÊUTICO</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Contrato de Prestação de Serviços de Psicoterapia
        </Text>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.clause}>
            Pelo presente instrumento, de um lado {psychologistProfile.name} ({psychologistProfile.crp}), doravante denominada PSICÓLOGA, e de outro lado {patient.name}, doravante denominado(a) PACIENTE, ajustam as seguintes cláusulas:
          </Text>

          <Text style={styles.clause}>
            <Text style={styles.clauseTitle}>1. OBJETO E ABORDAGEM: </Text>
            O presente contrato tem por objetivo a prestação de serviços psicoterapêuticos em nível ambulatorial, visando a promoção da saúde mental e acompanhamento das demandas clínicas do paciente.
          </Text>

          <Text style={styles.clause}>
            <Text style={styles.clauseTitle}>2. FREQUÊNCIA E DURAÇÃO: </Text>
            As sessões serão realizadas de forma {sessionFrequency}. O atraso por parte do paciente não prorrogará o tempo de término da sessão.
          </Text>

          <Text style={styles.clause}>
            <Text style={styles.clauseTitle}>3. HONORÁRIOS E PAGAMENTO: </Text>
            O valor acordado por sessão é de {sessionFee}. O pagamento deverá ser efetuado {paymentTerms}.
          </Text>

          <Text style={styles.clause}>
            <Text style={styles.clauseTitle}>4. CANCELAMENTOS E FALTAS: </Text>
            O cancelamento ou remarcação de sessões deve ser comunicado com antecedência mínima de {cancellationNotice}. Faltas sem aviso prévio na janela estipulada serão cobradas integralmente.
          </Text>

          <Text style={styles.clause}>
            <Text style={styles.clauseTitle}>5. SIGILO PROFISSIONAL: </Text>
            Toda e qualquer informação compartilhada nas sessões é protegida por sigilo ético absoluto (Código de Ética Profissional do Psicólogo), salvo em situações excepcionais de risco iminente à vida ou integridade física do paciente ou de terceiros.
          </Text>

          <Text style={styles.clause}>
            <Text style={styles.clauseTitle}>6. SITUAÇÕES DE EMERGÊNCIA: </Text>
            A psicoterapia não constitui serviço de plantão de emergência 24h. Em situações de crise grave fora do horário de consulta, o paciente deve contatar {emergencyContact}.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signaturesContainer}>
          <Text style={styles.dateText}>São Paulo - SP, {currentDateStr}</Text>

          <View style={styles.signaturesRow}>
            <View style={styles.signerBox}>
              <View style={styles.line} />
              <Text style={styles.signerName}>{psychologistProfile.name}</Text>
              <Text style={styles.signerRole}>Psicóloga ({psychologistProfile.crp})</Text>
            </View>

            <View style={styles.signerBox}>
              <View style={styles.line} />
              <Text style={styles.signerName}>{patient.name}</Text>
              <Text style={styles.signerRole}>Paciente / Responsável Legal</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
