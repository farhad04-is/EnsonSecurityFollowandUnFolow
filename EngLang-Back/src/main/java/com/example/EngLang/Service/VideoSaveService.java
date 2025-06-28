package com.example.EngLang.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
// import java.text.Normalizer; // <-- ARTIQ İSTİFADƏ OLUNMURSA SİL
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.minio.errors.*;

@Service
@RequiredArgsConstructor
public class VideoSaveService {

    private final VideoUploadService videoUploadService;
    private String ytDlpPath = "C:\\Users\\Farhad\\Desktop\\yt-dlp.exe";
    private String ffmpegPath = "C:\\Users\\Farhad\\Desktop\\ffmpeg\\ffmpeg-2025-06-02-git-688f3944ce-full_build\\bin\\ffmpeg.exe";

    @Value("${video.temp-download-folder}")
    private String tempDownloadFolder;

    public String saveVideo(String videoUrl) {
        if (videoUrl == null || videoUrl.trim().isEmpty()) {
            System.err.println("Xəta: Video URL boşdur.");
            return null;
        }

        File tempFolder = new File(tempDownloadFolder);
        if (!tempFolder.exists() && !tempFolder.mkdirs()) {
            System.err.println("Xəta: Müvəqqəti yükləmə qovluğunu yaratmaq mümkün olmadı: " + tempDownloadFolder);
            return null;
        }

        String tempOutputTemplate = "%(id)s.%(ext)s"; // <-- Qalır, ən etibarlı adlandırma
        String finalDownloadedFilePath = null; // <-- Yüklənmiş faylın dəqiq yolunu saxlayacaq

        String[] command = {
                ytDlpPath,
                "-f", "bestvideo[height<=720]+bestaudio/best[height<=720]",
                "--merge-output-format", "mp4",
                "--ffmpeg-location", ffmpegPath,
                "--output", tempDownloadFolder + File.separator + tempOutputTemplate,
                // "--print", "filepath", // <-- Bunu silirik, çünki bu bəzən "NA" qaytarır.
                // Fayl yolunu Merger xəttindən alacağıq.
                "--verbose",
                "--no-part",
                videoUrl
        };

        try {
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true); // Standart xətanı standart çıxışa yönləndir
            Process process = pb.start();

            // BufferedReader-də UTF-8 kodlaşdırmasını qeyd et
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                // Merger xəttindən fayl yolunu tapmaq üçün pattern
                Pattern mergePattern = Pattern.compile("\\[Merger\\] Merging formats into \"([^\"]+)\"");
                while ((line = reader.readLine()) != null) {
                    System.out.println(line); // Konsol çıxışını çap et
                    Matcher matcher = mergePattern.matcher(line);
                    if (matcher.find()) {
                        finalDownloadedFilePath = matcher.group(1); // Fayl yolunu tut
                        // Tapaqdan sonra oxumağa davam etmək istəyə bilərik,
                        // amma bu xətt çox güman ki, son faylın yolunu göstərir.
                    }
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                System.err.println("\n--- Yükləmə zamanı xəta baş verdi, çıxış kodu: " + exitCode + " ---");
                // Əgər yt-dlp xəta veribsə, temporary faylları silməyə çalış
                if (finalDownloadedFilePath != null) {
                    Files.deleteIfExists(Paths.get(finalDownloadedFilePath));
                }
                return null;
            }

            System.out.println("\n--- Yükləmə uğurla başa çatdı ---");

            if (finalDownloadedFilePath != null) {
                File downloadedFile = new File(finalDownloadedFilePath);

                // Faylın həqiqətən mövcudluğunu yoxla
                if (!downloadedFile.exists() || !downloadedFile.isFile()) {
                    System.err.println("Xəta: Yüklənmiş fayl mövcud deyil və ya fayl deyil: " + finalDownloadedFilePath);
                    return null;
                }

                System.out.println("Video yükləndi yerli olaraq: " + downloadedFile.getAbsolutePath());

                // Yüklənmiş faylı Minio-ya yükləyin
                try {
                    Path filePath = downloadedFile.toPath();
                    String contentType = Files.probeContentType(filePath);
                    if (contentType == null) {
                        contentType = "application/octet-stream";
                    }

                    String minioUploadedFileName = videoUploadService.uploadStream(
                            Files.newInputStream(filePath),
                            downloadedFile.getName(),
                            downloadedFile.length(),
                            contentType
                    );

                    System.out.println("Video Minio-ya yükləndi: " + minioUploadedFileName);
                    return minioUploadedFileName;

                } finally {
                    // Müvəqqəti faylı silin
                    Files.deleteIfExists(downloadedFile.toPath());
                    System.out.println("Müvəqqəti fayl silindi: " + downloadedFile.getAbsolutePath());
                }

            } else {
                System.err.println("Xəta: Yüklənən faylın adı logdan çıxarıla bilmədi.");
                System.err.println("Xahiş olunur yt-dlp çıxışını diqqətlə yoxlayın.");
                return null;
            }

        } catch (IOException | InterruptedException e) {
            System.err.println("Prosesin icrası zamanı xəta: " + e.getMessage());
            e.printStackTrace();
            return null;

        } catch (ServerException | InsufficientDataException | ErrorResponseException |
                 NoSuchAlgorithmException | InvalidKeyException | InvalidResponseException |
                 XmlParserException | InternalException e) {
            System.err.println("Minio-ya yükləmə zamanı xəta: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    // sanitizeFileName metodu artıq %(id)s.%(ext)s istifadə etdiyimiz üçün lazım deyil.
    // Əgər yenidən %(title)s istifadə etmək istəsən, bu metodu geri qaytarmalısan.
}