package com.example.EngLang.Service.YeniTelegram;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import com.example.EngLang.Entity.Word;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component // Spring tarafından yönetilen bir bileşen olması için
public class TelegramBot extends TelegramLongPollingBot {

    private final String botName;
    private final SearchService searchService; // SearchService enjekte edildi
    private final Map<Long, Boolean> waitingForEmail = new ConcurrentHashMap<>();

    // Constructor'da botName ve botToken ile birlikte SearchService'i de al
    public TelegramBot(String botName, String botToken, SearchService searchService) {
        super(botToken);
        this.botName = botName;
        this.searchService = searchService; // SearchService'i ata
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        Message message = update.getMessage();
        Long chatId = message.getChatId();
        String messageText = message.getText();

        log.info("Message received: {}", messageText);

        if (waitingForEmail.containsKey(chatId) && waitingForEmail.get(chatId)) {
            // E-posta beklendiği durumda gelen mesajı e-posta olarak kabul et
            String email = messageText.trim();
            waitingForEmail.put(chatId, false); // Bekleme durumunu kapat

            List<Word> words = searchService.getWordsByEmail(email); // Doğrudan servis çağrısı

            if (!words.isEmpty()) {
                StringBuilder builder = new StringBuilder("<b>");
                builder.append("Email: ").append(email).append(" için kelimeler:\n\n");
                builder.append(String.format("<code>%-10s | %-25s | %-12s\n", "Kelime", "Tərcümə", "Səviyyə"));
                builder.append("--------------------------------------------------\n"); // Çizgi ekle
                for (Word wordData : words) {
                    String word = wordData.getWord();
                    String translation = wordData.getTranslation();
                    String level = wordData.getEnglishLevel();
                    builder.append(String.format("%-10s | %-25s | %-12s\n", word, translation, level));
                }
                builder.append("</code>"); // Preformatted text için code etiketi
                builder.append("</pre>"); // Eski pre etiketi kaldırıldı, HTML'de code veya pre yeterli

                SendMessage sendMessage = new SendMessage();
                sendMessage.setChatId(chatId.toString());
                sendMessage.setText(builder.toString());
                sendMessage.setParseMode("HTML"); // HTML parse rejimi aktivdir
                try {
                    execute(sendMessage);
                } catch (TelegramApiException e) {
                    log.error("Failed to send message: {}", e.getMessage());
                }

            } else {
                sendText(chatId, "❌ Bu email üçün heç bir məlumat tapılmadı.");
            }
            return; // E-posta işlendikten sonra başka bir komut beklemeyin
        }


        if (messageText.equalsIgnoreCase("/start")) {
            sendText(chatId, "Salam! Mən aktivəm ✅");
        } else if (messageText.equalsIgnoreCase("/melumat")) {
            waitingForEmail.put(chatId, true); // E-posta bekleme durumunu aç
            sendText(chatId, " \uD83D\uDCE7 EngLang mexsus email adresini yazın:");
        } else {
            sendText(chatId, "Komandanı başa düşmədim. /melumat yazaraq başlaya bilərsən.");
        }
    }

    @Override
    public String getBotUsername() {
        return botName;
    }

    private void sendText(Long chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId.toString());
        message.setText(text);

        try {
            execute(message);
        } catch (TelegramApiException e) {
            log.error("Send message error", e);
        }
    }
}