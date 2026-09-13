import { jsPDF } from 'jspdf';
import { StencilCalculationResult } from '../types';

export function generateStencilPdf(
  calc: StencilCalculationResult,
  customTitle = 'Poli International Tattoo Stencil Specification',
  filename = 'Stencil_Report.pdf'
) {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('POLI INTERNATIONAL', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(customTitle, 14, 19);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 14, 19, { align: 'right' });

  // Section 1: Dimensions & Curvature
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Stencil Dimensions & Curvature Compensation', 14, 38);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 42, pageWidth - 28, 42, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Target Body Location: ${calc.bodyPartName}`, 20, 50);
  doc.text(`Orientation Alignment: ${calc.orientation.toUpperCase()}`, 20, 56);
  doc.text(`Flat Design Size: ${calc.originalWidth} × ${calc.originalHeight} ${calc.unit}`, 20, 62);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(`Adjusted Print Stencil Size: ${calc.adjustedWidth} × ${calc.adjustedHeight} ${calc.unit} (${calc.printerScalePercent}%)`, 20, 69);
  
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(`Curvature Multiplier: ${calc.curvatureFactor}x  |  Surface Area: ${calc.surfaceAreaCm2} cm² (${calc.surfaceAreaIn2} in²)`, 20, 76);

  // Section 2: Thermal Paper & Equipment
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Thermal Paper & Supply Setup', 14, 94);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 98, pageWidth - 28, 38, 2, 2, 'FD');

  let paperMatch = 'Single Standard Sheet (A4 or US Letter)';
  if (calc.paperType === 'spirit_14') paperMatch = 'Spirit 14" Long Thermal Paper Required';
  if (calc.paperType === 'grid_tiling') paperMatch = `Multi-Sheet Tiling: ${calc.totalSheets} Sheets (${calc.gridCols}x${calc.gridRows} Grid)`;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Thermal Paper Match: ${paperMatch}`, 20, 106);
  doc.text(`Recommended Outlining Needle: ${calc.liningNeedles}`, 20, 114);
  doc.text(`Recommended Shading Needle: ${calc.shadingNeedles}`, 20, 122);
  doc.text(`Ink Cups & Prep: ${calc.inkCapsPrep}`, 20, 130);

  // Section 3: Clinical Application Steps
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Clinical Stencil Application Protocol', 14, 146);

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, 150, pageWidth - 28, 48, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.text('Step 1: Medical Skin Prep & Degreasing', 20, 158);
  doc.setFont('helvetica', 'normal');
  doc.text('Shave wide perimeter, wipe twice with 70% isopropyl alcohol or green soap.', 20, 163);

  doc.setFont('helvetica', 'bold');
  doc.text('Step 2: Transfer Solution Dosing', 20, 171);
  doc.setFont('helvetica', 'normal');
  doc.text('Massage thin coat of gel until tacky (never wet or pooling).', 20, 176);

  doc.setFont('helvetica', 'bold');
  doc.text('Step 3: Posture & Calibrated Drying', 20, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('Client stands in natural resting posture. Allow stencil to cure 10-15 min before tattooing.', 20, 189);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Poli International • Professional Tattoo Tools • https://poliinternational.com', pageWidth / 2, 285, { align: 'center' });

  doc.save(filename);
}
