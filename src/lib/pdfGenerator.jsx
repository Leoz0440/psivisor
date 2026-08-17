import React from 'react';
import { pdf } from '@react-pdf/renderer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReferralLetterPdf from '../components/pdf/ReferralLetterPdf';
import PsychologicalCertificatePdf from '../components/pdf/PsychologicalCertificatePdf';
import TherapeuticContractPdf from '../components/pdf/TherapeuticContractPdf';

export const downloadReferralLetterPdf = async (props, filename) => {
  const blob = await pdf(<ReferralLetterPdf {...props} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadPsychologicalCertificatePdf = async (props, filename) => {
  const blob = await pdf(<PsychologicalCertificatePdf {...props} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadTherapeuticContractPdf = async (props, filename) => {
  const blob = await pdf(<TherapeuticContractPdf {...props} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportMultiPagePdf = async (element, filename) => {
  if (!element) return;

  const fullCanvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });

  const pdfDoc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdfDoc.internal.pageSize.getWidth();
  const pageHeight = pdfDoc.internal.pageSize.getHeight();

  const marginTop = 15;
  const marginBottom = 20;
  const printableHeight = pageHeight - marginTop - marginBottom;

  const pxPerMm = fullCanvas.width / pageWidth;
  const pageHeightPx = Math.round(pageHeight * pxPerMm);
  const marginTopPx = Math.round(marginTop * pxPerMm);
  const printableHeightPx = Math.round(printableHeight * pxPerMm);

  const totalPages = Math.ceil(fullCanvas.height / printableHeightPx) || 1;

  let sourceY = 0;

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    if (pageIndex > 0) {
      pdfDoc.addPage();
    }

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = fullCanvas.width;
    pageCanvas.height = pageHeightPx;

    const pageCtx = pageCanvas.getContext('2d');
    pageCtx.fillStyle = '#ffffff';
    pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

    const sliceHeight = Math.min(printableHeightPx, fullCanvas.height - sourceY);

    if (sliceHeight > 0) {
      pageCtx.drawImage(
        fullCanvas,
        0, sourceY, fullCanvas.width, sliceHeight,
        0, marginTopPx, fullCanvas.width, sliceHeight
      );
    }

    const pageImgData = pageCanvas.toDataURL('image/png');
    pdfDoc.addImage(pageImgData, 'PNG', 0, 0, pageWidth, pageHeight);

    pdfDoc.setFont('helvetica', 'normal');
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(100, 116, 139);
    pdfDoc.text(
      `Página ${pageIndex + 1} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );

    sourceY += printableHeightPx;
  }

  pdfDoc.save(filename);
};
