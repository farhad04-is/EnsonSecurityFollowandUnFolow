// src/main/java/com/example/EngLang/Service/WordlistConverter.java
package com.example.EngLang.Service;

import com.example.EngLang.Entity.Word;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.List;

@Converter
public class WordlistConverter implements AttributeConverter<List<Word>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<Word> attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting List<Word> to JSON string", e);
        }
    }

    @Override
    public List<Word> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<List<Word>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Error converting JSON string to List<Word>", e);
        }
    }
}