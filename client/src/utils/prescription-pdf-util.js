import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePrescriptionPDF = (prescription) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // -- Header --
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SMART HEALTHCARE", 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Digital Prescription", 20, 32);
  
  doc.setFontSize(14);
  doc.text(`Dr. ${prescription.doctorName}`, pageWidth - 20, 25, { align: "right" });
  doc.setFontSize(10);
  doc.text("Certified Medical Specialist", pageWidth - 20, 32, { align: "right" });
  
  // -- Patient Section --
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT INFORMATION", 20, 55);
  doc.setLineWidth(0.5);
  doc.line(20, 58, 80, 58);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Name:", 20, 68);
  doc.setFont("helvetica", "normal");
  doc.text(prescription.patientName, 45, 68);
  
  doc.setFont("helvetica", "bold");
  doc.text("Age / Gender:", 20, 75);
  doc.setFont("helvetica", "normal");
  doc.text(`${prescription.patientAge || 'N/A'} Yrs / ${prescription.patientGender || 'N/A'}`, 45, 75);
  
  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth - 70, 68);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(prescription.createdAt).toLocaleDateString(), pageWidth - 45, 68);
  
  doc.setFont("helvetica", "bold");
  doc.text("Ref ID:", pageWidth - 70, 75);
  doc.setFont("helvetica", "normal");
  doc.text(prescription.id.slice(0, 8).toUpperCase(), pageWidth - 45, 75);
  
  // -- Clinical Section --
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CLINICAL DETAILS", 20, 95);
  doc.line(20, 98, 70, 98);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Diagnosis:", 20, 108);
  doc.setFont("helvetica", "normal");
  doc.text(prescription.diagnosis || "No diagnosis provided", 45, 108, { maxWidth: 140 });
  
  doc.setFont("helvetica", "bold");
  doc.text("Symptoms:", 20, 118);
  doc.setFont("helvetica", "normal");
  doc.text(prescription.symptoms || "N/A", 45, 118, { maxWidth: 140 });
  
  // -- Medications Table --
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Rx - MEDICATIONS", 20, 140);
  
  const medRows = prescription.medications.map((m, i) => [
    i + 1,
    `${m.name}\n(${m.type})`,
    `${m.dosage}\n${m.timing}`,
    m.frequency,
    `${m.duration} Days`,
    m.instructions || "-"
  ]);
  
  autoTable(doc, {
    startY: 145,
    head: [['#', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Notes']],
    body: medRows,
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 20, right: 20 },
    theme: 'grid',
    styles: { fontSize: 9 }
  });
  
  const finalY = doc.lastAutoTable.finalY + 15;
  
  // -- Instructions & Follow-up --
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Additional Instructions:", 20, finalY);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(prescription.instructions || "None", 20, finalY + 7, { maxWidth: 170 });
  
  if (prescription.labTests) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Lab Tests:", 20, finalY + 25);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(prescription.labTests, 20, finalY + 32, { maxWidth: 170 });
  }
  
  // -- Footer Signature --
  const footerY = 270;
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 80, footerY, pageWidth - 20, footerY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Dr. ${prescription.doctorName}`, pageWidth - 50, footerY + 7, { align: "center" });
  doc.setFontSize(8);
  doc.text("Digitally Signed", pageWidth - 50, footerY + 12, { align: "center" });
  
  // Save the PDF
  doc.save(`Prescription_${prescription.patientName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};
