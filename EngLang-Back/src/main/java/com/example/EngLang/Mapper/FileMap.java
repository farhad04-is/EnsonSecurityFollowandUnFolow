package com.example.EngLang.Mapper;

import com.example.EngLang.Entity.TxtFile;
import com.example.EngLang.Repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@RequiredArgsConstructor
@Component
public class FileMap {

    private  final FileRepository fileRepository;

    public void toDto_File(byte[] fileContent,String path) {
        TxtFile txtFile = TxtFile.builder()
                .time(LocalDateTime.now())
                .fileLength(fileContent)
                .path(path)
                .build();

        fileRepository.save(txtFile);
    }


}
