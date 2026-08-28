package com.sourav.kothika.service;

public interface AIService {
    String generatePost(String topic);
    String suggestImprovements(String content);
    String summarize(String content);
}
