package com.example.EngLang.Repository;

import com.example.EngLang.Entity.TxtFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface FileRepository extends JpaRepository<TxtFile,Long> {
   Optional<TxtFile> findBypath(String path);
}
