package com.example.EngLang;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@SpringBootApplication
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EngLangApplication {

	private static final String TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
	private static final String API_KEY = "46ae674826d4432301ceeddd760347f6d4dd149c454c0e0676430507833ad838";
	private static final String MODEL_NAME = "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo";

	public static void main(String[] args) {
		SpringApplication.run(EngLangApplication.class, args);
	}

	@PostMapping("/translate")
	public ResponseEntity<String> translateWord(@RequestBody Map<String, String> payload) {
		String word = payload.get("word");

		if (word == null || word.trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Field 'word' is required");
		}

		// Together API üçün body hazırlığı
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("model", MODEL_NAME);

		List<Map<String, String>> messages = new ArrayList<>();
		Map<String, String> userMessage = new HashMap<>();
		userMessage.put("role", "user");
		userMessage.put("content", String.format(
				"Translate the word \"%s\" to Azerbaijani only. Also provide the English level of the word in short format like this: \"English level: A2-B1\". No extra explanations.",
				word
		));
		messages.add(userMessage);
		requestBody.put("messages", messages);
		requestBody.put("temperature", 0.2);

		// HTTP başlıqlar
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setBearerAuth(API_KEY);

		// Request göndər
		HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
		RestTemplate restTemplate = new RestTemplate();

		try {
			ResponseEntity<Map> response = restTemplate.postForEntity(TOGETHER_API_URL, request, Map.class);

			if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
				List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");

				if (choices != null && !choices.isEmpty()) {
					Map<String, Object> choice = choices.get(0);
					Map<String, String> message = (Map<String, String>) choice.get("message");
					String content = message.get("content");
					return ResponseEntity.ok(content);
				}
			}

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Together API returned no usable content");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error occurred while calling Together API: " + e.getMessage());
		}
	}

}
