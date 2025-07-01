package com.example.EngLang.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class VideoLists {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NonNull
    private String link;

    private String videoname;
    @Builder.Default
    private Integer likes=0;
}
