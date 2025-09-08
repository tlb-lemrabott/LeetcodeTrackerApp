package com.leetcodetracker.code.service;

import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.UnitValue;
import com.leetcodetracker.code.entity.Problem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PDFExportService {
    private final ProblemService problemService;

    public ByteArrayInputStream exportToPDF() {
        List<Problem> problems = problemService.getAllProblems();
        ByteArrayOutputStream out = new ByteArrayOutputStream();


        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDocument = new PdfDocument(writer);
        pdfDocument.setDefaultPageSize(PageSize.A4.rotate());
        Document document = new Document(pdfDocument);

        document.add(new Paragraph("Problem List").setBold().setFontSize(16));

        Table table = new Table(new float[]{7f, 12f, 18f, 18f, 8f, 8f, 12f, 12f});
        table.setWidth(UnitValue.createPercentValue(100));
        table.setAutoLayout();

        String[] headers = {"ID", "Name", "Comment", "Link", "Status", "Level", "Posted Time", "Done Time"};
        for (String header : headers) {
            table.addHeaderCell(new Cell().add(new Paragraph(header).setBold().setFontSize(10)));
        }

        for (Problem problem : problems) {
            table.addCell(new Cell().add(new Paragraph(problem.getProblemId().toString()).setFontSize(9)));
            table.addCell(new Cell().add(new Paragraph(problem.getProblemName()).setFontSize(9)));
            table.addCell(new Cell().add(new Paragraph(problem.getComment()).setFontSize(9)));
            table.addCell(new Cell().add(new Paragraph(problem.getLink()).setFontSize(9)));
            table.addCell(new Cell().add(new Paragraph(problem.getStatus().toString()).setFontSize(9)));
            table.addCell(new Cell().add(new Paragraph(problem.getLevel().toString()).setFontSize(9)));
            table.addCell(new Cell().add(new Paragraph(problem.getTimePosted().toString()).setFontSize(9)));
            table.addCell(new Cell().add(new Paragraph(problem.getDoneTime() != null ? problem.getDoneTime().toString() : "").setFontSize(9)));
        }

        document.add(table);
        document.close();

        return new ByteArrayInputStream(out.toByteArray());
    }
}