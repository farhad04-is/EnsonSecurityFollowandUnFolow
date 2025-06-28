package com.example.EngLang.Controller;

import com.example.EngLang.Repository.FileRepository;
import com.example.EngLang.Service.TxtSubtitleReadService;
import com.example.EngLang.Service.TxtSubtitleWriteService;
import com.example.EngLang.Service.VideoSaveService;
import com.example.EngLang.Service.VideoUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("v1/EngLang")

@RequiredArgsConstructor
public class File_Api {

    private final TxtSubtitleWriteService txtSubtitleWriteService;
    private final TxtSubtitleReadService txtSubtitleReadService;
    private final VideoSaveService videoSaveService;
    private final VideoUploadService videoUploadService;
    private final FileRepository fileRepository; // Altyazıyı silmek için enjekte edildi


    @GetMapping(value = "/vidodowland", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> uploadAndGetVideoData(@RequestParam String url) throws IOException, InterruptedException {
        if (url == null || url.isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "URL boşdur. Xahiş olunur düzgün URL təmin edin.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        Map<String, String> response = new HashMap<>();
        String savedSubtitleKey = url; // Altyazıyı kaydettiğimiz anahtar orijinal URL'dir.

        try {
            // 1. Altyazıyı indir ve veritabanına kaydet.
            // Bu metod zaten orijinal URL'yi geri döndürüyor, bu bizim 'anahtarımız'.
            txtSubtitleWriteService.convertSubtitle(url); // Artık dönüş değerini atamıyoruz, çünkü zaten aynı URL.

            // 2. Videoyu kaydet ve MinIO URL'sini al
            String minioFileName = videoSaveService.saveVideo(url);

            // 3. MinIO URL'sini yanıta ekle
            if (minioFileName != null) {
                String videoUrl = videoUploadService.getPresignedUrl(minioFileName, 60);
                response.put("minioFileName", minioFileName);
                response.put("videoUrl", videoUrl);

                // 4. Kaydedilen altyazı içeriğini veritabanından oku ve yanıta ekle
                try {
                    // Altyazıyı, kaydettiğimiz orijinal URL anahtarıyla çekiyoruz.
                    byte[] subtitleContentBytes = txtSubtitleReadService.pullFileByPath(savedSubtitleKey);
                    String subtitleContent = new String(subtitleContentBytes, StandardCharsets.UTF_8);
                    response.put("subtitleContent", subtitleContent);
                } catch (RuntimeException e) {
                    // Altyazı bulunamadığında veya okunurken hata oluştuğunda
                    System.err.println("Altyazı içeriği veritabanından okunurken hata oluştu: " + e.getMessage());
                    response.put("subtitleContent", ""); // Boş altyazı içeriği gönder
                    response.put("subtitleError", "Video üçün altyazı tapılmadı və ya oxunmadı.");
                }

                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Video yükləmə zamanı xəta baş verdi.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("Video/Altyazı işleme sırasında genel hata: " + e.getMessage());
            response.put("error", "Server tərəfində video və ya altyazı işlənməsi zamanı xəta: " + e.getMessage());
            // Özellikle yt-dlp'den gelen hatalar için 500 dönmek uygun.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) { // Beklenmeyen diğer hatalar
            System.err.println("Beklenmeyen bir hata oluştu: " + e.getMessage());
            response.put("error", "Beklenmeyen xəta: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Verilen video URL'sine karşılık gelen altyazı kaydını veritabanından siler.
     *
     * @param url Silinecek altyazıya karşılık gelen video URL'si.
     * @return Başarı veya hata mesajı.
     */

    @PostMapping("/api/translate")
    public ResponseEntity<String> translate(@RequestBody Map<String, Object> body) {
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        String result = rest.postForObject("http://localhost:5000/translate", entity, String.class);

        return ResponseEntity.ok(result);
    }
}