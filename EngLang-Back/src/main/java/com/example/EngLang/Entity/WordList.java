package com.example.EngLang.Entity;

import com.example.EngLang.Service.WordlistConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class WordList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // List<Word> tipini veritabanında TEXT olarak saklamak için Converter kullanıldı
    @Convert(converter = WordlistConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<Word> words;

    @CreationTimestamp // Kayıt zamanını otomatik olarak ayarlar
    private LocalDate date;

    // Birden fazla WordList aynı kullanıcıya ait olabilir (ManyToOne)
    @ManyToOne
    @JoinColumn(name = "user_id") // Veritabanında foreign key column'u
    private User user;
}