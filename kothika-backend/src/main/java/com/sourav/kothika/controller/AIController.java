package com.sourav.kothika.controller;

import com.sourav.kothika.domain.dto.AIGenerateRequest;
import com.sourav.kothika.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/kothika/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AIController {

    private final AIService aiService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, String>> generatePost(@RequestBody AIGenerateRequest request) {
        String result = aiService.generatePost(request.getTopic());
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/improve")
    public ResponseEntity<Map<String, String>> suggestImprovements(@RequestBody AIGenerateRequest request) {
        String result = aiService.suggestImprovements(request.getContent());
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarize(@RequestBody AIGenerateRequest request) {
        String result = aiService.summarize(request.getContent());
        Map<String, String> response = new HashMap<>();
        response.put("result", result);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
