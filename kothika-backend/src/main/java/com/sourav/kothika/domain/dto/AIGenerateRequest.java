package com.sourav.kothika.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIGenerateRequest {
    private String prompt;
    private String topic; // for generation
    private String content; // for summarization or improvements
}
