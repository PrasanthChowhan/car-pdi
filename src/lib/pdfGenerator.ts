import { jsPDF } from 'jspdf';
import type { VehicleInfo, ChecklistItem } from './storage';
import { loadImageBlob } from './storage';
import { CATEGORIES, OVERVIEW_VIEWS } from './checklistData';

interface LoadedImage {
  element: HTMLImageElement;
  width: number;
  height: number;
  objectUrl: string;
}

// Helper to load Blob as an Image element without serializing to base64
function loadBlobAsImage(blob: Blob): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      resolve({
        element: img,
        width: img.naturalWidth || img.width || 4,
        height: img.naturalHeight || img.height || 3,
        objectUrl,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load blob as Image'));
    };
    img.src = objectUrl;
  });
}

export async function generatePDIReport(
  vehicle: VehicleInfo,
  items: Record<string, ChecklistItem>,
  overviewPhotos: Record<string, string> = {},
  metadata: Record<string, string> = {}
): Promise<Blob> {
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let currentY = 15;

  // Theme Colors
  const cInk = [38, 37, 30]; // #26251e
  const cBody = [90, 88, 82]; // #5a5852
  const cMuted = [128, 125, 114]; // #807d72
  const cHairline = [230, 229, 224]; // #e6e5e0
  const cCanvasSoft = [250, 250, 247]; // #fafaf7
  const cPrimary = [245, 78, 0]; // #f54e00
  const cSuccess = [31, 138, 101]; // #1f8a65
  const cError = [207, 45, 86]; // #cf2d56

  // Helper to check vertical space and create a new page if necessary
  const checkPageBreak = (neededHeight: number, headerText?: string) => {
    const bottomLimit = pageHeight - 15; // 15mm bottom margin
    if (currentY + neededHeight > bottomLimit) {
      doc.addPage();
      currentY = margin + 10;
      
      if (headerText) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
        doc.text(headerText, margin, currentY - 5);
        doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
        doc.line(margin, currentY - 3, pageWidth - margin, currentY - 3);
      }
      return true;
    }
    return false;
  };

  // ==========================================
  // --- PAGE 1: EXECUTIVE VERDICT & PROFILE ---
  // ==========================================

  // App Logo Tagline
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
  doc.text('PRE-DELIVERY INSPECTION (PDI) SYSTEM', margin, currentY);
  currentY += 6;

  // Document Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(cInk[0], cInk[1], cInk[2]);
  doc.text('Pre-Delivery Inspection Report', margin, currentY);
  currentY += 5;

  // Subtitle
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('Official vehicle quality certification and pre-handover evaluation log.', margin, currentY);
  currentY += 6;

  // Divider
  doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // --- VEHICLE PROFILE TABLE ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cInk[0], cInk[1], cInk[2]);
  doc.text('VEHICLE AUDIT SUMMARY', margin, currentY);
  currentY += 4;

  // Draw Grid Table (4 rows, 48mm height)
  doc.setFillColor(cCanvasSoft[0], cCanvasSoft[1], cCanvasSoft[2]);
  doc.rect(margin, currentY, contentWidth, 48, 'F');
  doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
  doc.rect(margin, currentY, contentWidth, 48, 'D');
  
  // Table Dividers
  doc.line(margin + 90, currentY, margin + 90, currentY + 48);
  doc.line(margin, currentY + 12, margin + contentWidth, currentY + 12);
  doc.line(margin, currentY + 24, margin + contentWidth, currentY + 24);
  doc.line(margin, currentY + 36, margin + contentWidth, currentY + 36);

  // Table Content
  doc.setFontSize(9.5);
  // Row 1
  doc.setFont('Helvetica', 'bold');
  doc.text('Brand / Make:', margin + 4, currentY + 7.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(vehicle.make, margin + 34, currentY + 7.5);

  doc.setFont('Helvetica', 'bold');
  doc.text('Power Unit:', margin + 94, currentY + 7.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(vehicle.isEV ? 'Electric Vehicle (EV)' : 'Gasoline/Hybrid (ICE)', margin + 124, currentY + 7.5);

  // Row 2
  doc.setFont('Helvetica', 'bold');
  doc.text('Model Name:', margin + 4, currentY + 19.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(vehicle.model, margin + 34, currentY + 19.5);

  doc.setFont('Helvetica', 'bold');
  doc.text('Audit Date:', margin + 94, currentY + 19.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(new Date().toLocaleDateString(undefined, { dateStyle: 'long' }), margin + 124, currentY + 19.5);

  // Row 3
  doc.setFont('Helvetica', 'bold');
  doc.text('VIN / Chassis:', margin + 4, currentY + 31.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(vehicle.vin || 'Not Provided', margin + 34, currentY + 31.5);

  doc.setFont('Helvetica', 'bold');
  doc.text('Dealership:', margin + 94, currentY + 31.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(metadata.dealerName || 'Not Provided', margin + 124, currentY + 31.5);

  // Row 4
  doc.setFont('Helvetica', 'bold');
  doc.text('Sales Rep:', margin + 4, currentY + 43.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(metadata.salesRep || 'Not Provided', margin + 34, currentY + 43.5);

  doc.setFont('Helvetica', 'bold');
  doc.text('Odometer:', margin + 94, currentY + 43.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(metadata.odometer ? `${metadata.odometer} km` : 'Not Provided', margin + 124, currentY + 43.5);

  currentY += 58;

  // --- STATISTICS DASHBOARD ---
  const allItems = Object.values(items);
  const total = allItems.length;
  const passed = allItems.filter(i => i.status === 'pass').length;
  const flagged = allItems.filter(i => i.status === 'flagged').length;
  const pending = allItems.filter(i => i.status === 'pending').length;
  const progressPercent = total > 0 ? Math.round(((passed + flagged) / total) * 100) : 0;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cInk[0], cInk[1], cInk[2]);
  doc.text('METRICS DASHBOARD', margin, currentY);
  currentY += 4;

  // Background Box
  doc.setFillColor(cInk[0], cInk[1], cInk[2]); // Anchored solid dark background
  doc.rect(margin, currentY, contentWidth, 22, 'F');

  // Stats Text
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`${progressPercent}%`, margin + 8, currentY + 14);
  doc.setFontSize(8.5);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  doc.text('COMPLETED', margin + 8, currentY + 7);

  // Vertical separators
  doc.setDrawColor(80, 80, 80);
  doc.line(margin + 50, currentY + 4, margin + 50, currentY + 18);
  doc.line(margin + 92, currentY + 4, margin + 92, currentY + 18);
  doc.line(margin + 134, currentY + 4, margin + 134, currentY + 18);

  // Passed Badge
  doc.setFontSize(12);
  doc.setTextColor(cSuccess[0], cSuccess[1], cSuccess[2]);
  doc.text(`${passed}`, margin + 56, currentY + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('PASSED ITEMS', margin + 56, currentY + 7);

  // Flagged Badge
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(cError[0], cError[1], cError[2]);
  doc.text(`${flagged}`, margin + 98, currentY + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('FLAGGED ISSUES', margin + 98, currentY + 7);

  // Pending Badge
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(240, 240, 240);
  doc.text(`${pending}`, margin + 140, currentY + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('PENDING VERIFY', margin + 140, currentY + 7);

  currentY += 32;

  // --- FINAL INSPECTION VERDICT ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cInk[0], cInk[1], cInk[2]);
  doc.text('OFFICIAL STATUS VERDICT', margin, currentY);
  currentY += 4;

  const isClean = flagged === 0 && pending === 0;
  const isPendingWarning = pending > 0;

  if (isClean) {
    doc.setFillColor(243, 250, 247);
    doc.setDrawColor(cSuccess[0], cSuccess[1], cSuccess[2]);
    doc.rect(margin, currentY, contentWidth, 24, 'FD');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(cSuccess[0], cSuccess[1], cSuccess[2]);
    doc.text('INSPECTION STATUS: CLEAN / HANDOVER RECOMMENDED', margin + 6, currentY + 8);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(cBody[0], cBody[1], cBody[2]);
    doc.text('All checklist parameters were successfully verified and marked as PASSED. The vehicle conforms to', margin + 6, currentY + 15);
    doc.text('manufacturer specifications. Fit for official handover.', margin + 6, currentY + 19);
  } else if (isPendingWarning) {
    doc.setFillColor(254, 248, 242);
    doc.setDrawColor(cPrimary[0], cPrimary[1], cPrimary[2]);
    doc.rect(margin, currentY, contentWidth, 24, 'FD');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
    doc.text('INSPECTION STATUS: INCOMPLETE / REVIEW REQUIRED', margin + 6, currentY + 8);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(cBody[0], cBody[1], cBody[2]);
    doc.text(`Warning: This inspection is incomplete. There are still ${pending} pending checklist items.`, margin + 6, currentY + 15);
    doc.text('Ensure all remaining mechanical and document checks are completed before delivery.', margin + 6, currentY + 19);
  } else {
    doc.setFillColor(253, 243, 245);
    doc.setDrawColor(cError[0], cError[1], cError[2]);
    doc.rect(margin, currentY, contentWidth, 24, 'FD');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(cError[0], cError[1], cError[2]);
    doc.text(`INSPECTION STATUS: ${flagged} DEVIATIONS DETECTED`, margin + 6, currentY + 8);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(cBody[0], cBody[1], cBody[2]);
    doc.text('Discrepancies or physical defects were flagged during inspection. Please refer to Section 3', margin + 6, currentY + 15);
    doc.text('of this report for detailed notes. Sign off remediation plan below.', margin + 6, currentY + 19);
  }

  currentY += 34;

  // --- REMEDIATION COMMITMENT SECTION ---
  if (metadata.remediationCommitment && metadata.remediationCommitment.trim()) {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(cInk[0], cInk[1], cInk[2]);
    doc.text('DEALERSHIP REMEDIATION COMMITMENT', margin, currentY);
    currentY += 4;

    const wrappedCommitment = doc.splitTextToSize(metadata.remediationCommitment, contentWidth - 10);
    const boxHeight = (wrappedCommitment.length * 4.5) + 6;

    doc.setFillColor(cCanvasSoft[0], cCanvasSoft[1], cCanvasSoft[2]);
    doc.setDrawColor(cPrimary[0], cPrimary[1], cPrimary[2]);
    doc.rect(margin, currentY, contentWidth, boxHeight, 'FD');

    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(cBody[0], cBody[1], cBody[2]);
    doc.text(wrappedCommitment, margin + 5, currentY + 5.5);

    currentY += boxHeight + 8;
  }

  // Force page break to start Section 2 (At a Glance Overview Photos) on Page 2
  doc.addPage();
  currentY = margin + 10;

  // ==========================================
  // --- PAGE 2: AT A GLANCE REFERENCE PHOTOS ---
  // ==========================================
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(cInk[0], cInk[1], cInk[2]);
  doc.text('Section 2: At a Glance Reference Photos', margin, currentY);
  currentY += 6;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('Reference photographs establishing a baseline record of the vehicle\'s overall condition.', margin, currentY);
  currentY += 10;

  const colWidth = 56;
  const rowHeight = 42;
  const gapX = 6;
  const gapY = 12;

  for (let idx = 0; idx < OVERVIEW_VIEWS.length; idx++) {
    const view = OVERVIEW_VIEWS[idx];
    const photoId = overviewPhotos[view.id];
    
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    
    const x = margin + col * (colWidth + gapX);
    const y = currentY + row * (rowHeight + gapY);

    // Draw card background
    doc.setFillColor(cCanvasSoft[0], cCanvasSoft[1], cCanvasSoft[2]);
    doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
    doc.rect(x, y, colWidth, rowHeight, 'FD');

    if (photoId) {
      let loadedImage: LoadedImage | null = null;
      try {
        const blob = await loadImageBlob(photoId);
        if (blob) {
          loadedImage = await loadBlobAsImage(blob);
          
          const maxW = colWidth - 2;
          const maxH = rowHeight - 8;
          
          let w = maxW;
          let h = (loadedImage.height * maxW) / loadedImage.width;
          if (h > maxH) {
            h = maxH;
            w = (loadedImage.width * maxH) / loadedImage.height;
          }
          
          const imgX = x + (colWidth - w) / 2;
          const imgY = y + 1 + (maxH - h) / 2;
          
          doc.addImage(loadedImage.element, 'JPEG', imgX, imgY, w, h);
        }
      } catch (imgError) {
        console.error(`Failed to render overview photo ${view.id} in PDF`, imgError);
        doc.setLineDashPattern([1.5, 1.5], 0);
        doc.setDrawColor(cError[0], cError[1], cError[2]);
        doc.rect(x + 1, y + 1, colWidth - 2, rowHeight - 8, 'D');
        doc.setLineDashPattern([], 0);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(cError[0], cError[1], cError[2]);
        doc.text('Render Error', x + colWidth / 2, y + (rowHeight - 8) / 2 + 2, { align: 'center' });
      } finally {
        if (loadedImage) {
          URL.revokeObjectURL(loadedImage.objectUrl);
          loadedImage.element.src = '';
          loadedImage = null;
        }
      }
    } else {
      // Draw placeholder
      doc.setLineDashPattern([1.5, 1.5], 0);
      doc.setDrawColor(cMuted[0], cMuted[1], cMuted[2]);
      doc.rect(x + 1, y + 1, colWidth - 2, rowHeight - 8, 'D');
      doc.setLineDashPattern([], 0); // reset
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
      doc.text('No Photo', x + colWidth / 2, y + (rowHeight - 8) / 2 + 2, { align: 'center' });
    }

    // Draw label
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cInk[0], cInk[1], cInk[2]);
    doc.text(view.label, x + colWidth / 2, y + rowHeight - 3, { align: 'center' });
  }

  // Force page break to start Section 3 (Checklist) on Page 3
  doc.addPage();
  currentY = margin + 10;

  // ==========================================
  // --- PAGE 3: FULL AUDIT CHECKLIST LOG ---
  // ==========================================
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(cInk[0], cInk[1], cInk[2]);
  doc.text('Section 3: Complete Checklist Log', margin, currentY);
  currentY += 6;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('Detailed check record of all vehicle parameters verified in this session.', margin, currentY);
  currentY += 6;

  // Render Legend
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  let legendX = margin;
  
  // Passed Legend
  doc.setDrawColor(cSuccess[0], cSuccess[1], cSuccess[2]);
  doc.setLineWidth(0.5);
  doc.line(legendX, currentY + 1, legendX + 1.5, currentY + 2.5);
  doc.line(legendX + 1.5, currentY + 2.5, legendX + 4, currentY + 0.5);
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('Passed', legendX + 6, currentY + 2.5);
  
  // Defect Legend
  legendX += 24;
  doc.setDrawColor(cError[0], cError[1], cError[2]);
  doc.line(legendX + 0.5, currentY + 0.5, legendX + 3.5, currentY + 3.5);
  doc.line(legendX + 3.5, currentY + 0.5, legendX + 0.5, currentY + 3.5);
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('Defect', legendX + 6, currentY + 2.5);

  // Pending Legend
  legendX += 24;
  doc.setDrawColor(cMuted[0], cMuted[1], cMuted[2]);
  doc.ellipse(legendX + 2, currentY + 2, 1.5, 1.5, 'D');
  doc.setTextColor(cBody[0], cBody[1], cBody[2]);
  doc.text('Pending', legendX + 6, currentY + 2.5);

  doc.setLineWidth(0.1); // reset
  currentY += 10;

  // Filter out ICE/EV categories depending on vehicle type
  const filteredCategories = CATEGORIES.filter(cat => {
    if (cat.id === 'ev') return vehicle.isEV;
    if (cat.id === 'engine') return !vehicle.isEV;
    return true;
  });

  const headerLabel = 'Section 3: Complete Audit Log (Continued)';

  // Helper to draw table header
  const drawTableHeader = (y: number) => {
    doc.setFillColor(230, 229, 224); // Solid cHairline color for header bg
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
    doc.rect(margin, y, contentWidth, 7, 'D');
    doc.line(margin + 22, y, margin + 22, y + 7); // Vertical divider

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(cInk[0], cInk[1], cInk[2]);
    doc.text('STATUS', margin + 4, y + 5);
    doc.text('VERIFIED PARAMETER', margin + 26, y + 5);
  };

  for (const category of filteredCategories) {
    const catItems = allItems.filter(item => item.categoryId === category.id);
    if (catItems.length === 0) continue;

    // Check if category header + table header + at least one row fits on page (~22mm)
    checkPageBreak(22, headerLabel);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
    doc.text(category.label.toUpperCase(), margin, currentY);
    currentY += 5;

    // Draw Table Header
    drawTableHeader(currentY);
    currentY += 7;

    let rowIndex = 0;
    for (const item of catItems) {
      // Wrap text to fit page
      const labelText = item.label;
      const wrappedLabel = doc.splitTextToSize(labelText, contentWidth - 28);
      
      let rowHeight = (wrappedLabel.length * 4.5) + 3;
      let wrappedNote: string[] = [];
      if (item.note && item.note.trim()) {
        wrappedNote = doc.splitTextToSize(`Comment: ${item.note}`, contentWidth - 28);
        rowHeight += (wrappedNote.length * 3.8) + 2;
      }
      rowHeight = Math.max(8, rowHeight);

      // Check page break for item. If broke, redraw table header
      const brokePage = checkPageBreak(rowHeight, headerLabel);
      if (brokePage) {
        drawTableHeader(currentY);
        currentY += 7;
      }

      // Alternating row background shading
      if (rowIndex % 2 === 1) {
        doc.setFillColor(252, 252, 250); // Very light grey background
        doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
      }

      // Draw outer box lines and dividers for row
      doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'D');
      doc.line(margin + 22, currentY, margin + 22, currentY + rowHeight); // Vertical divider

      // Render Status Marker Symbol centered in 22mm column
      const symbolX = margin + 8; // Centered X starting offset
      const symbolY = currentY + (rowHeight / 2) - 2; // Vertically centered Y (4mm height symbol)

      doc.setLineWidth(0.6);
      if (item.status === 'pass') {
        // Draw green checkmark symbol
        doc.setDrawColor(cSuccess[0], cSuccess[1], cSuccess[2]);
        doc.line(symbolX, symbolY + 2, symbolX + 2, symbolY + 4);
        doc.line(symbolX + 2, symbolY + 4, symbolX + 6, symbolY);
      } else if (item.status === 'flagged') {
        // Draw red warning cross
        doc.setDrawColor(cError[0], cError[1], cError[2]);
        doc.line(symbolX + 1, symbolY, symbolX + 5, symbolY + 4);
        doc.line(symbolX + 5, symbolY, symbolX + 1, symbolY + 4);
      } else {
        // Draw grey pending circle
        doc.setDrawColor(cMuted[0], cMuted[1], cMuted[2]);
        doc.setLineWidth(0.5);
        doc.ellipse(symbolX + 3, symbolY + 2, 1.8, 1.8, 'D');
      }
      doc.setLineWidth(0.1); // reset

      // Render Item Label Text
      let textY = currentY + 4.5;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(cBody[0], cBody[1], cBody[2]);
      doc.text(wrappedLabel, margin + 26, textY);
      
      if (item.note && item.note.trim()) {
        const noteY = textY + (wrappedLabel.length * 4.5) + 1;
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
        doc.text(wrappedNote, margin + 26, noteY);
      }
      
      currentY += rowHeight;
      rowIndex++;
    }
    currentY += 10; // Spacing after category table
  }

  // ==========================================
  // --- PAGE 3+: PHOTOGRAPHIC DEFECT EVIDENCE ---
  // ==========================================
  
  const flaggedItems = allItems.filter(i => i.status === 'flagged');

  if (flaggedItems.length > 0) {
    doc.addPage();
    currentY = margin + 10;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(cInk[0], cInk[1], cInk[2]);
    doc.text('Section 4: Flagged Defects & Photographic Evidence', margin, currentY);
    currentY += 6;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(cBody[0], cBody[1], cBody[2]);
    doc.text('Detailed logs, notes, and evidence attachments for parameters that failed audit inspection.', margin, currentY);
    currentY += 8;

    const defectHeaderLabel = 'Section 4: Flagged Defects & Evidence (Continued)';

    for (const item of flaggedItems) {
      const catLabel = CATEGORIES.find(c => c.id === item.categoryId)?.label || 'General';

      // Ensure baseline spacing for defect title and notes
      checkPageBreak(35, defectHeaderLabel);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(cError[0], cError[1], cError[2]);
      doc.text(`[${catLabel.toUpperCase()}]`, margin, currentY);
      doc.setTextColor(cInk[0], cInk[1], cInk[2]);
      currentY += 5;

      // Wrapped Label
      const wrappedLabel = doc.splitTextToSize(item.label, contentWidth);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(wrappedLabel, margin, currentY);
      currentY += (wrappedLabel.length * 4) + 3;

      // Shaded Notes block if present
      if (item.note && item.note.trim()) {
        const wrappedNote = doc.splitTextToSize(`Inspector Note: "${item.note}"`, contentWidth - 10);
        const blockHeight = (wrappedNote.length * 4) + 6;
        
        checkPageBreak(blockHeight + 5, defectHeaderLabel);

        doc.setFillColor(cCanvasSoft[0], cCanvasSoft[1], cCanvasSoft[2]);
        doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
        doc.rect(margin, currentY, contentWidth, blockHeight, 'F');
        doc.line(margin, currentY, margin, currentY + blockHeight); // Left border
        
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(cBody[0], cBody[1], cBody[2]);
        doc.text(wrappedNote, margin + 5, currentY + 5);
        currentY += blockHeight + 6;
        doc.setTextColor(cInk[0], cInk[1], cInk[2]);
      } else {
        currentY += 2;
      }

      // Photographic Attachment
      if (item.photoId) {
        let loadedImage: LoadedImage | null = null;
        try {
          const blob = await loadImageBlob(item.photoId);
          if (blob) {
            loadedImage = await loadBlobAsImage(blob);

            // Scale calculations
            const maxImgWidth = 110; 
            const maxImgHeight = 72; 
            
            let imgWidth = maxImgWidth;
            let imgHeight = (loadedImage.height * maxImgWidth) / loadedImage.width;

            if (imgHeight > maxImgHeight) {
              imgHeight = maxImgHeight;
              imgWidth = (loadedImage.width * maxImgHeight) / loadedImage.height;
            }

            // Check page break for image
            checkPageBreak(imgHeight + 12, defectHeaderLabel);

            // Draw clean border box for image
            doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
            doc.rect(margin - 0.5, currentY - 0.5, imgWidth + 1, imgHeight + 1, 'D');

            // Draw Image
            doc.addImage(loadedImage.element, 'JPEG', margin, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 8;
          }
        } catch (imgError) {
          console.error(`Failed to render image ${item.photoId} in PDF`, imgError);
          checkPageBreak(12, defectHeaderLabel);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(cError[0], cError[1], cError[2]);
          doc.text('[Error: Could not render image attachment]', margin + 5, currentY);
          currentY += 8;
          doc.setTextColor(cInk[0], cInk[1], cInk[2]);
        } finally {
          if (loadedImage) {
            URL.revokeObjectURL(loadedImage.objectUrl);
            loadedImage.element.src = '';
            loadedImage = null;
          }
        }
      }

      // Separator line between defects
      currentY += 4;
      doc.setDrawColor(cHairline[0], cHairline[1], cHairline[2]);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 8;
    }
  }

  // --- FOOTER STAMP & PAGE NUMBERING ---
  const pageCount = doc.internal.pages.length - 1; // get total pages count
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    
    // Page bottom margin
    doc.text(
      `PDI Report • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}
