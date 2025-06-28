package com.example.EngLang.Service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile; // istifadə olunmur, silinə bilər

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

// ... digər import-lar ...
import io.minio.GetPresignedObjectUrlArgs; // <-- Bu import-u əlavə et
import io.minio.http.Method; // <-- Bu import-u əlavə et
import java.util.concurrent.TimeUnit; // <-- Bu import-u əlavə et

@Service
public class VideoUploadService {

    private final MinioClient minioClient;
    private final String bucketName;

    public VideoUploadService(MinioClient minioClient, @Value("${minio.bucket-name}") String bucketName) {
        this.minioClient = minioClient;
        this.bucketName = bucketName;
    }

    public String uploadStream(InputStream stream, String originalFileName, long fileSize, String contentType)
            throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        // ... (mövcud yükləmə kodun) ...
        String fileName = System.currentTimeMillis() + "_" + originalFileName;

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .stream(stream, fileSize, -1)
                        .contentType(contentType)
                        .build()
        );
        return fileName;
    }

    // YENİ METOD: MinIO obyektinin pre-signed URL-ini əldə etmək üçün
    public String getPresignedUrl(String objectName, int expiryInMinutes)
            throws ServerException, InsufficientDataException, ErrorResponseException, IOException,
            NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET) // GET metodu ilə daxil olmağa icazə
                        .bucket(bucketName)
                        .object(objectName)
                        .expiry(expiryInMinutes, TimeUnit.MINUTES) // URL-in etibarlılıq müddəti
                        .build()
        );
    }
}