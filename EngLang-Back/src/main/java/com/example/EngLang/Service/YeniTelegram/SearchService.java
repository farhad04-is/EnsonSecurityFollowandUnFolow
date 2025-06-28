package com.example.EngLang.Service.YeniTelegram;

import com.example.EngLang.Entity.User;
import com.example.EngLang.Entity.Word;
import com.example.EngLang.Entity.WordList;
import com.example.EngLang.Repository.UserRepository;
import com.example.EngLang.Repository.WordListRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final UserRepository userRepository;
    private final WordListRepository wordListRepository;

    public List<Word> getWordsByEmail(String email) {
        // E-posta adresine göre kullanıcıyı bul
        Optional<User> userOptional = userRepository.findByGmail(email.toLowerCase());

        if (userOptional.isEmpty()) {
            return Collections.emptyList(); // Kullanıcı bulunamazsa boş liste dön
        }

        User user = userOptional.get();

        // Kullanıcıya ait tüm kelime listelerini getir
        List<WordList> wordLists = wordListRepository.findByUser_Id(user.getId());

        // Her bir WordList'teki kelimeleri WordData objelerine dönüştürüp tek bir liste halinde topla
        return wordLists.stream()
                .flatMap(wordList -> wordList.getWords().stream()) // Tüm kelimeleri tek bir akışa indirge
                .map(this::convertToWordData) // Her Word'ü WordData'ya dönüştür
                .collect(Collectors.toList());
    }

    // Helper metot: Word entity'sinden WordData modeline dönüşüm
    private Word convertToWordData(Word word) {
        return new Word(word.getWord(), word.getTranslation(), word.getEnglishLevel());
    }
}