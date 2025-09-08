package com.leetcodetracker.code.controller;
import com.leetcodetracker.code.entity.Problem;
import com.leetcodetracker.code.service.ExcelExportService;
import com.leetcodetracker.code.service.PDFExportService;
import com.leetcodetracker.code.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/problems")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProblemController {
    private final ProblemService service;
    private final ExcelExportService excelExportService;
    private final PDFExportService pdfExportService;
    @PostMapping
    public Problem createTask(@RequestBody Problem problem) {
        return service.createProblem(problem);
    }

    @PostMapping("/upload-list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Problem>> createProblemsBulk(@RequestBody List<Problem> problems) {
        List<Problem> createdProblems = service.createProblemsBulk(problems);
        return ResponseEntity.ok(createdProblems);
    }

    @PostMapping("/import-json")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Problem>> importProblemsFromJson(@RequestParam("file") MultipartFile file) {
        try {
            List<Problem> createdProblems = service.importProblemsFromJsonFile(file);
            return ResponseEntity.ok(createdProblems);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @PutMapping("/{problemId}")
    public ResponseEntity<Problem> updateProblem(@PathVariable UUID problemId, @RequestBody Problem problem) {
        return ResponseEntity.ok(service.updateProblem(problemId, problem));
    }
    @GetMapping("/{problemId}")
    public ResponseEntity<Problem> getTaskById(@PathVariable UUID problemId) {
        Optional<Problem> problem = service.getProblemById(problemId);
        return problem.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping
    public List<Problem> getAllProblems() {
        return service.getAllProblems();
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportToExcel() throws IOException {
        ByteArrayInputStream in = excelExportService.exportToExcel();
        byte[] data = in.readAllBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=problems.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportToPDF() {
        ByteArrayInputStream in = pdfExportService.exportToPDF();
        byte[] data = in.readAllBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=problems.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }


    @DeleteMapping("/{problemId}")
    public ResponseEntity<Void> deleteProblem(@PathVariable UUID problemId) {
        service.deleteProblem(problemId);
        return ResponseEntity.noContent().build();
    }

}
