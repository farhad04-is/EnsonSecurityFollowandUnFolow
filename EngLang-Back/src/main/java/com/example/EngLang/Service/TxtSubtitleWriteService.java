package com.example.EngLang.Service;

import com.example.EngLang.Mapper.FileMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Comparator; // java.util.Comparator eklendi

@Service
@RequiredArgsConstructor
public class TxtSubtitleWriteService {

    private final FileMap fileMap;

    /**
     * Verilen video URL'si için İngilizce altyazıları indirir, veritabanına kaydeder ve geçici dosyaları temizler.
     *
     * @param videoUrl Orijinal video URL'si (örn. YouTube URL'si).
     * @return Altyazının veritabanına kaydedildiği orijinal video URL'si.
     * @throws IOException          Dosya işlemleri veya süreç çalıştırma sırasında bir hata oluşursa.
     * @throws InterruptedException Süreç beklenirken kesintiye uğrarsa.
     */
    public String convertSubtitle(String videoUrl) throws IOException, InterruptedException {
        // Benzersiz bir geçici dizin oluştur. Bu, dosya adlarının çakışmasını önler ve temizliği kolaylaştırır.
        Path tempDir = Files.createTempDirectory("yt-dlp-subs-"); // Daha açıklayıcı isim

        // yt-dlp'nin altyazıyı buraya kaydetmesini sağlayacak çıktı şablonu.
        // %(id)s: video ID'si, %(ext)s: dosya uzantısı (vtt)
        String outputTemplate = tempDir.resolve("%(id)s.%(ext)s").toString();

        String[] command = {
                "C:\\Users\\Farhad\\Desktop\\yt-dlp.exe", // yt-dlp yolunu kontrol edin
                "--write-subs",        // İnsan tarafından oluşturulmuş altyazıları tercih et
                "--sub-lang", "en",    // İngilizce altyazıları indir
                "--sub-format", "vtt", // VTT formatında indir
                "--skip-download",     // Videoyu indirme, sadece altyazıyı indir
                "-o", outputTemplate,  // Altyazı çıktısını belirli bir dizine ve isimle kaydet
                videoUrl               // İşlenecek video URL'si
        };

        ProcessBuilder pb = new ProcessBuilder(command);
        // Hata akışını ayrı olarak okuyacağız, bu nedenle redirectErrorStream(true) kaldırıldı.
        // pb.redirectErrorStream(true);

        Process process = pb.start();

        // yt-dlp çıktılarını ve hata çıktılarını ayrı ayrı okuyun (daha iyi hata ayıklama için)
        try (BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
             BufferedReader stderrReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {

            String line;
            System.out.println("yt-dlp Standard Output:");
            while ((line = stdoutReader.readLine()) != null) {
                System.out.println(line);
            }

            System.err.println("yt-dlp Standard Error:");
            StringBuilder errorOutput = new StringBuilder(); // Hataları toplamak için
            while ((line = stderrReader.readLine()) != null) {
                System.err.println(line);
                errorOutput.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            System.out.println("Altyazı indirme tamamlandı. yt-dlp Çıkış Kodu: " + exitCode);

            if (exitCode != 0) {
                // Eğer yt-dlp hata ile biterse, detaylı bir mesajla IOException fırlat
                throw new IOException("yt-dlp altyazıyı indirirken hata oluştu (Çıkış Kodu: " + exitCode + "). " +
                        "Hata detayları: " + errorOutput.toString());
            }

        } finally {
            // Sürecin kaynaklarını temizle
            if (process != null) {
                process.destroy(); // Süreci sonlandır
            }
        }


        // Geçici klasördeki .en.vtt dosyalarını bul
        // ListFiles kullanırken null kontrolü önemlidir.
        File[] vttFiles = tempDir.toFile().listFiles((dir, name) -> name.endsWith(".en.vtt"));

        try { // try-finally bloğu içine alarak kaynak temizliğini garantiliyoruz
            if (vttFiles != null && vttFiles.length > 0) {
                // En son değiştirilen veya en büyük dosyayı seçmek daha güvenlidir.
                // Burada en son değiştirilen dosyayı alıyoruz.
                File vttFile = Arrays.stream(vttFiles)
                        .max(Comparator.comparingLong(File::lastModified))
                        .orElseThrow(() -> new IOException("İndirilen .vtt dosyası bulunamadı."));

                System.out.println("Bulunan VTT dosyası: " + vttFile.getName() + " Yolu: " + vttFile.getAbsolutePath());

                byte[] content = Files.readAllBytes(vttFile.toPath());

                // **KRİTİK DÜZELTME**: 'path' olarak her zaman orijinal 'videoUrl'i kullan.
                // MinIO'dan gelen bir URL veya başka bir türetilmiş URL değil.
                saveFile(content, videoUrl);
                System.out.println("Altyazı veritabanına yazıldı. Yol: " + videoUrl);

                return videoUrl; // Başarıyla kaydedilen altyazının orijinal URL'sini döndür
            } else {
                System.out.println("Video için İngilizce VTT altyazı dosyası bulunamadı. " +
                        "Bu video için insan tarafından oluşturulmuş altyazı olmayabilir.");
                // Altyazı bulunamazsa, yine de orijinal URL'yi döndürerek kontrolörün buna göre hareket etmesini sağlarız.
                // Kontrolörde `subtitleContent` boş veya hata mesajıyla gönderilir.
                return videoUrl;
            }
        } finally {
            // Geçici dizindeki tüm dosyaları ve dizini temizle
            // Bu, hata durumlarında bile çalışmalıdır.
            Files.walk(tempDir)
                    .sorted(Comparator.reverseOrder()) // Önce dosyaları, sonra dizinleri silmek için tersten sırala
                    .map(Path::toFile)
                    .forEach(File::delete);
            System.out.println("Geçici dizin ve dosyalar temizlendi: " + tempDir);
        }
    }

    /**
     * Altyazı içeriğini ve ilişkili video URL'sini veritabanına kaydeder.
     *
     * @param txtFile Altyazının byte içeriği.
     * @param path    Altyazının ilişkili olduğu video URL'si (TxtFile entity'deki 'path' alanı).
     */
    public void saveFile(byte[] txtFile, String path) {
        // fileMap.toDto_File metodunuzun byte[] ve String path alıp
        // TxtFile entity'sine dönüştürüp kaydettiğini varsayıyorum.
        fileMap.toDto_File(txtFile, path);
    }
}