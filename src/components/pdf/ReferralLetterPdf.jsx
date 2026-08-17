import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: '#1E293B',
    lineHeight: 1.5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#2C5E4E',
    paddingBottom: 10,
    marginBottom: 18
  },
  psychologistName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#132A23'
  },
  psychologistCrp: {
    fontSize: 9.5,
    color: '#387A66',
    marginTop: 2
  },
  badge: {
    backgroundColor: '#E4EFEA',
    color: '#1C3C32',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 3
  },
  recipient: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#132A23',
    marginBottom: 14
  },
  body: {
    textAlign: 'justify'
  },
  paragraph: {
    marginBottom: 10,
    textIndent: 20
  },
  section: {
    marginBottom: 10
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    color: '#132A23',
    marginBottom: 3
  },
  sectionContent: {
    marginLeft: 12,
    color: '#334155'
  },
  closing: {
    marginTop: 10,
    marginBottom: 20,
    textIndent: 20
  },
  signatureContainer: {
    marginTop: 25,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopStyle: 'dashed',
    paddingTop: 14
  },
  dateText: {
    fontSize: 9.5,
    color: '#64748B',
    marginBottom: 16
  },
  line: {
    width: 180,
    height: 1,
    backgroundColor: '#334155',
    marginBottom: 4
  },
  signerName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#132A23'
  },
  signerTitle: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2
  }
});

export default function ReferralLetterPdf({
  patient,
  psychologistProfile,
  recipient,
  introductionText,
  reason,
  symptoms,
  hypothesis,
  treatmentStatus,
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
            <Text style={styles.badge}>ENCAMINHAMENTO CLÍNICO</Text>
          </View>
        </View>

        {/* Recipient */}
        <Text style={styles.recipient}>{recipient}</Text>

        {/* Body */}
        <View style={styles.body}>
          {introductionText ? (
            <Text style={styles.paragraph}>{introductionText}</Text>
          ) : null}

          <Text style={styles.paragraph}>
            Encaminho o(a) paciente {patient.name}, {patient.age} anos, para vossa avaliação clínica e conduta cabível.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Motivo do Encaminhamento:</Text>
            <Text style={styles.sectionContent}>{reason}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Sintomas e Quadro Clínico Observados:</Text>
            <Text style={styles.sectionContent}>{symptoms}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Hipótese Diagnóstica:</Text>
            <Text style={styles.sectionContent}>{hypothesis}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Conduta Psicoterapêutica em Andamento:</Text>
            <Text style={styles.sectionContent}>{treatmentStatus}</Text>
          </View>

          <Text style={styles.closing}>
            Permaneço à disposição para troca de informações e trabalho multidisciplinar conjunto em prol da evolução clínica do(a) paciente.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureContainer}>
          <Text style={styles.dateText}>São Paulo - SP, {currentDateStr}</Text>
          <View style={styles.line} />
          <Text style={styles.signerName}>{psychologistProfile.name}</Text>
          <Text style={styles.signerTitle}>Psicóloga Clínica • {psychologistProfile.crp}</Text>
        </View>
      </Page>
    </Document>
  );
}
