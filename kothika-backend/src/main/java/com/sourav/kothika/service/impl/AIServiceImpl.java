package com.sourav.kothika.service.impl;

import com.sourav.kothika.service.AIService;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.JsonParseException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIServiceImpl implements AIService {

    @Value("${ai.gemini.api-key:dummy-key}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String callGeminiAPI(String promptText) {
        if ("dummy-key".equals(apiKey)) {
            return "AI feature requires a valid Gemini API Key configured in application.properties.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> part = new HashMap<>();
            part.put("text", promptText);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("contents", List.of(content));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBodyMap, headers);

            String responseUrl = GEMINI_API_URL + apiKey;
            String response = restTemplate.postForObject(responseUrl, request, String.class);

            if (response == null || response.trim().isEmpty()) {
                return "Error: Received empty response from Gemini API.";
            }

            JsonNode rootNode = objectMapper.readTree(response);
            
            JsonNode candidatesNode = rootNode.path("candidates");
            if (candidatesNode.isMissingNode() || candidatesNode.isEmpty()) {
                return "Error: No candidates found in the response.";
            }
            
            JsonNode contentNode = candidatesNode.get(0).path("content");
            if (contentNode.isMissingNode()) {
                return "Error: Content node missing in the response.";
            }

            JsonNode partsNode = contentNode.path("parts");
            if (partsNode.isMissingNode() || partsNode.isEmpty()) {
                return "Error: Parts expected in the response but not found.";
            }

            JsonNode textNode = partsNode.get(0).path("text");
            if (textNode.isMissingNode()) {
                return "Error: Text node missing in the response.";
            }

            return textNode.asString().trim();

        } catch (org.springframework.web.client.HttpClientErrorException | org.springframework.web.client.HttpServerErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            System.err.println("Gemini API Error: " + errorBody);
            return "Error: API request failed with status: " + e.getStatusCode() + ". Details: " + errorBody;
        } catch (org.springframework.web.client.RestClientException e) {
            return "Error: Failed to connect to AI service. " + e.getMessage();
        } catch (JsonParseException e) {
            return "Error: Invalid JSON response format from AI service.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating response from AI.";
        }
    }

    @Override
    public String generatePost(String topic) {
        String prompt = "You are an expert blog post writer. Generate a well-structured, engaging blog post about the following topic. Return ONLY the blog post content, no conversational text. Topic: "
                + topic;
        return callGeminiAPI(prompt);
    }

    @Override
    public String suggestImprovements(String content) {
        String prompt = "Review the following blog post content and suggest improvements for readability, grammar, and engagement. Return the improved version directly without any extra conversation. Content:\n\n"
                + content;
        return callGeminiAPI(prompt);
    }

    @Override
    public String summarize(String content) {
        String prompt = "Create a concise and engaging summary of the following blog post in 2-3 sentences. Return only the summary. Content:\n\n"
                + content;
        return callGeminiAPI(prompt);
    }
}
