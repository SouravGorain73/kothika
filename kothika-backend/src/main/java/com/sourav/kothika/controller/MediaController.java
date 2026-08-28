package com.sourav.kothika.controller;

import com.sourav.kothika.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/kothika/media")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class MediaController {

    private final MediaService mediaService;

    @Value("${media.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadMedia(@RequestParam("file") MultipartFile file) {
        try {
            String url = mediaService.uploadFile(file);
            return new ResponseEntity<>(url, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload the file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path file = Paths.get(uploadDir).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
