package com.sourav.kothika.domain.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaAttachmentDto {
    private UUID id;
    private String url;
    private String type;
}
