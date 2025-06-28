package com.example.EngLang.Controller;


import com.example.EngLang.Entity.Word;
import com.example.EngLang.Service.YeniTelegram.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search")
    public List<Word> searchWordsByEmail(@RequestParam String email) {
        return searchService.getWordsByEmail(email);
    }
}