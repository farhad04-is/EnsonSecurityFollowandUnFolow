package com.example.EngLang.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Bu bir JPA Entity'si değildir, sadece WordList içinde kullanılacak bir POJO
// @Embeddable olabilirdi ancak WordlistConverter kullanıldığı için gerek yok
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Word {
    private String word;
    private String translation;
    private String englishLevel;
}