package com.example.EngLang.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Özel hata mesajları için RuntimeException
@ResponseStatus(HttpStatus.BAD_REQUEST) // Bu exception fırlatıldığında 400 Bad Request döner
public class UserValidationException extends RuntimeException {
    public UserValidationException(String message) {
        super(message);
    }
}