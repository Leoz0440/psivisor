import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
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
    marginBottom: 24
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
  title: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: '#132A23',
    marginBottom: 28,
    textTransform: 'uppercase'
  },
  body: {
    textAlign: 'justify'
  },
  paragraph: {
    marginBottom: 14,
    textIndent: 30
  },
  cidText: {
    marginTop: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#132A23',
    textIndent: 30
  },
  signatureContainer: {
    marginTop: 35,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopStyle: 'dashed',
    paddingTop: 16
  },
  dateText: {
    fontSize: 9.5,
    color: '#64748B',
    marginBottom: 18
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

export default function PsychologicalCertificatePdf({
  patient,
  psychologistProfile,
  certType,
  purpose,
  sessionDate,
  sessionTime,
  includeCid,
  cidCode,
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
            <Text style={styles.badge}>DECLARAÇÃO PSICOLÓGICA</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {certType === 'comparecimento'
            ? 'Declaração de Comparecimento a Consulta'
            : 'Declaração de Acompanhamento Psicológico'}
        </Text>

        {/* Body */}
        <View style={styles.body}>
          {certType === 'comparecimento' && (
            <Text style={styles.paragraph}>
              Declaro, para os devidos fins de {purpose}, que o(a) paciente {patient.name} esteve presente nesta data, em {sessionDate}, das {sessionTime}, em atendimento psicoterapêutico sob meus cuidados profissionais.
            </Text>
          )}

          {certType === 'declaracao' && (
            <Text style={styles.paragraph}>
              Declaro, para os devidos fins de {purpose}, que o(a) paciente {patient.name} realiza acompanhamento psicoterapêutico regular nesta clínica sob meus cuidados profissionais.
            </Text>
          )}

          {includeCid && (
            <Text style={styles.cidText}>
              Diagnóstico Clínico (CID): {cidCode} (Autorizado expressamente pelo paciente).
            </Text>
          )}
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
