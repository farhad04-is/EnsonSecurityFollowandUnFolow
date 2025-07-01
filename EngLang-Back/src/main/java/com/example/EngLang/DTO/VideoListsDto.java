package com.example.EngLang.DTO;

import jakarta.persistence.Entity;
import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class VideoListsDto {

    @NonNull
    private String link;

    private String videoname;
    @Builder.Default
    private Integer likes=0;
}
