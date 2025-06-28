package com.example.EngLang.Service;

import com.example.EngLang.Entity.User;
import com.example.EngLang.Entity.Word;
import com.example.EngLang.Entity.WordList;
import com.example.EngLang.Entity.WordListDto;
import com.example.EngLang.Exception.UserValidationException;
import com.example.EngLang.Repository.UserRepository;
import com.example.EngLang.Repository.WordListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WordListService {

    private final WordListRepository wordListRepository;
    private final UserRepository userRepository;

    // Kelime listesini kaydetme (POST isteği için kullanılacak)
    // DTO yerine doğrudan gerekli parametreleri alıyoruz
    public WordListDto saveWordList(String userGmail, List<Word> words) {
        User user = userRepository.findByGmail(userGmail)
                .orElseThrow(() -> new UserValidationException("Kullanıcı bulunamadı. Kelime listesi kaydedilemedi."));

        WordList wordList = WordList.builder()
                .user(user)
                .words(words)
                .date(LocalDate.now()) // Tarihi otomatik set ediyoruz
                .build();

        WordList savedWordList = wordListRepository.save(wordList);
        return convertToDto(savedWordList); // Kaydedilen Entity'yi DTO'ya dönüştürüp döndür
    }

    // Belirli bir Gmail'e sahip kullanıcıya ait tüm kelime listelerini DTO olarak getir
    public List<WordListDto> getWordListsByUserGmail(String userGmail) {
        User user = userRepository.findByGmail(userGmail)
                .orElseThrow(() -> new UserValidationException("Kullanıcı bulunamadı."));

        // Repository'den doğrudan User nesnesi ile kelime listelerini al
        List<WordList> wordLists = wordListRepository.findByUser_Id(user.getId());

        // Entity listesini DTO listesine dönüştür
        return wordLists.stream()
                .map(this::convertToDto) // Her WordList'i WordListDto'ya dönüştür
                .collect(Collectors.toList());
    }

    // Bir kelime listesini ID'sine göre silme
    public void deleteWordList(Long wordListId) {
        if (!wordListRepository.existsById(wordListId)) {
            throw new UserValidationException("Silinecek kelime listesi bulunamadı.");
        }
        wordListRepository.deleteById(wordListId);
    }

    // Helper metot: WordList Entity'sinden WordListDto'ya dönüşüm
    // Bu metot döngüsel referansı kırmak için kritik!
    private WordListDto convertToDto(WordList wordList) {
        return WordListDto.builder()
                .id(wordList.getId())
                .words(wordList.getWords())
                .date(wordList.getDate())
                // User objesinin tamamını DTO'ya koymuyoruz, sadece gerekli bilgileri (ID, Gmail)
                .userId(wordList.getUser() != null ? wordList.getUser().getId() : null)
                .userGmail(wordList.getUser() != null ? wordList.getUser().getGmail() : null)
                .build();
    }
}