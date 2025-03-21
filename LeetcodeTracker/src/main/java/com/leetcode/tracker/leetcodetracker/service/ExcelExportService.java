package com.leetcode.tracker.leetcodetracker.service;

import com.leetcode.tracker.leetcodetracker.entity.Problem;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelExportService {
    private final ProblemService problemService;

    public ByteArrayInputStream exportToExcel() throws IOException {
        List<Problem> problems = problemService.getAllProblems();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Problems");

            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Name", "Comment", "Link", "Status", "Level", "Posted Time", "Done Time"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }

            int rowNum = 1;
            for (Problem problem : problems) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(problem.getProblemId().toString());
                row.createCell(1).setCellValue(problem.getProblemName());
                row.createCell(2).setCellValue(problem.getComment());
                row.createCell(3).setCellValue(problem.getLink());
                row.createCell(4).setCellValue(problem.getStatus().toString());
                row.createCell(5).setCellValue(problem.getLevel().toString());
                row.createCell(6).setCellValue(problem.getTimePosted().toString());
                row.createCell(7).setCellValue(problem.getDoneTime() != null ? problem.getDoneTime().toString() : "");
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
