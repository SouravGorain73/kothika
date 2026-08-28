package com.sourav.kothika.service.impl;

import com.sourav.kothika.service.MediaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class MediaServiceImpl implements MediaService {

    @Value("${media.upload.dir:uploads}")
    private String uploadDir;
    
    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            extension = originalFilename.substring(i);
        }
        
        String newFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(newFilename);
        
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return "/kothika/media/uploads/" + newFilename;
    }
}
