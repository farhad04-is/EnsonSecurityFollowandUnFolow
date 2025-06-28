package com.example.EngLang.Service;

import com.example.EngLang.Entity.TxtFile;
import com.example.EngLang.Repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Veritabanından altyazı içeriğini okuma servisidir.
 */
@Service
@RequiredArgsConstructor
public class TxtSubtitleReadService {

    private final FileRepository fileRepository;

    /**
     * Verilen video URL'sine karşılık gelen altyazı içeriğini veritabanından çeker.
     *
     * @param videoUrl Altyazının ilişkili olduğu video URL'si (TxtFile entity'deki 'path' alanı).
     * @return Altyazının byte içeriği.
     * @throws RuntimeException Belirtilen URL için veritabanında altyazı bulunamazsa.
     */
    public byte[] pullFileByPath(String videoUrl) { // Parametre adını 'path' yerine 'videoUrl' olarak güncelledik
        return fileRepository.findBypath(videoUrl) // Orijinal video URL'si ile arama
                .map(TxtFile::getFileLength) // TxtFile entity'sinden byte[] içeriğini al
                .orElseThrow(() -> new RuntimeException("Altyazı içeriği veritabanından okunurken hata oluştu: " +
                        "Veri bulunamadı. Belirtilen yolda dosya mevcut değil: " + videoUrl));
    }
}