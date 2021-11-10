package com.example.demoupload.controllers;

import com.example.demoupload.models.FileData;
import com.example.demoupload.services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("files")
public class FilesController {

    @Autowired
    private FileService fileService;

    // import files
    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            fileService.save(file);
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Uploaded the file successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .body("Could not upload the file");
        }
    }

    // get ra list file đã import
    @GetMapping
    public ResponseEntity<List<FileData>> getListFiles() {
        List<FileData> fileInfos = fileService.loadAll()
                .stream()
                .map(this::pathToFileData)
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK)
                .body(fileInfos);
    }

    // truyền vào file name ví dụ "http://localhost:8080/files/CV-Nguyen-Cong-Phuong-Java-Eng.pdf" chọn save and download
    @GetMapping("{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = fileService.load(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    private FileData pathToFileData(Path path) {
        FileData fileData = new FileData();
        String filename = path.getFileName()
                .toString();
        fileData.setFilename(filename);
        fileData.setUrl(MvcUriComponentsBuilder.fromMethodName(FilesController.class, "getFile", filename)
                .build()
                .toString());
        try {
            fileData.setSize(Files.size(path));
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error: " + e.getMessage());
        }

        return fileData;
    }

}