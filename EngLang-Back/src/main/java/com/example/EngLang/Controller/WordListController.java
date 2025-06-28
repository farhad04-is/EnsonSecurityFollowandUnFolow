package com.example.EngLang.Controller;

import com.example.EngLang.Entity.Word;
import com.example.EngLang.Entity.WordListDto; // Dto import edildi
import com.example.EngLang.Exception.UserValidationException;
import com.example.EngLang.Service.WordListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wordlists") // Temel yol
@CrossOrigin(origins = "http://localhost:5173") // Frontend'inizin çalıştığı adres
public class WordListController {

    private final WordListService wordListService;


    @PostMapping("/user/{userGmail}")
    public ResponseEntity<String> saveWordList(@PathVariable String userGmail, @RequestBody List<Word> words) {
        try {
            wordListService.saveWordList(userGmail, words);
            return ResponseEntity.status(HttpStatus.CREATED).body("Kelime listesi başarıyla kaydedildi.");
        } catch (UserValidationException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Kelime listesi kaydedilirken bir hata oluştu: " + e.getMessage());
        }
    }

    // Belirli bir Gmail'e sahip kullanıcıya ait tüm kelime listelerini getir
    // GET: /wordlists/user/{userGmail}
    // Path Variable: userGmail (örneğin test@example.com)
    @GetMapping("/user/{userGmail}")
    public ResponseEntity<?> getWordListsByUserGmail(@PathVariable String userGmail) {
        try {
            List<WordListDto> wordLists = wordListService.getWordListsByUserGmail(userGmail); // DTO listesi bekleniyor
            return ResponseEntity.ok(wordLists);
        } catch (UserValidationException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Kelime listeleri getirilirken bir hata oluştu: " + e.getMessage());
        }
    }

    // Bir kelime listesini ID'sine göre silme
    // DELETE: /wordlists/{wordListId}
    // Path Variable: wordListId (örneğin 1)
    @DeleteMapping("/{wordListId}")
    public ResponseEntity<String> deleteWordList(@PathVariable Long wordListId) {
        try {
            wordListService.deleteWordList(wordListId);
            return ResponseEntity.ok("Kelime listesi başarıyla silindi.");
        } catch (UserValidationException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Kelime listesi silinirken bir hata oluştu: " + e.getMessage());
        }
    }
}