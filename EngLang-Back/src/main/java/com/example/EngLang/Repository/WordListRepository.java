package com.example.EngLang.Repository;

import com.example.EngLang.Entity.WordList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WordListRepository extends JpaRepository<WordList, Long> {
    // Belirli bir kullanıcıya ait tüm kelime listelerini bulma (User ID üzerinden)
    List<WordList> findByUser_Id(Long userId);
}