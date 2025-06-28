package com.example.EngLang.Entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WordListDto {
    private Long id;
    private List<Word> words;
    private LocalDate date;
    private Long userId;        // User objesi yerine sadece ID
    private String userGmail;   // User objesi yerine sadece Gmail
}