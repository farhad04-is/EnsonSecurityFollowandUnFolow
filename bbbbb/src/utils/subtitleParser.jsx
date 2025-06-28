// src/utils/subtitleParser.js

// Yardımcı fonksiyon: Zaman dizgesini (örn. "00:00:05.123") saniyeye dönüştürür
// Bu fonksiyon, zaman stringinin sonundaki "align:middle" gibi VTT özelliklerini doğru şekilde ayırır.
export const toSeconds = (timeString) => {
  if (!timeString) return 0;

  // Zaman damgasının sonundaki olası VTT özelliklerini veya boşlukları temizle.
  // Örneğin "00:00:07.529 align:middle" -> "00:00:07.529"
  const cleanTimeString = timeString.split(' ')[0].trim();

  const parts = cleanTimeString.split(':');
  if (parts.length < 2) {
    // console.warn("Invalid time string format for toSeconds:", timeString); // Hata ayıklama için
    return 0; // Geçersiz format
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let milliseconds = 0;

  if (parts.length === 3) {
    // HH:MM:SS.ms formatı (örn: 00:01:05.123)
    hours = parseInt(parts[0] || '0', 10);
    minutes = parseInt(parts[1] || '0', 10);
    const [sec, ms] = (parts[2] || '0.0').split('.');
    seconds = parseInt(sec || '0', 10);
    milliseconds = parseInt(ms || '0', 10); // Milisaniyeleri tam sayı olarak al
  } else if (parts.length === 2) {
    // MM:SS.ms formatı (ör: 01:05.123)
    minutes = parseInt(parts[0] || '0', 10);
    const [sec, ms] = (parts[1] || '0.0').split('.');
    seconds = parseInt(sec || '0', 10);
    milliseconds = parseInt(ms || '0', 10); // Milisaniyeleri tam sayı olarak al
  }

  // Tüm zamanı saniyeye çevirip döndür (milisaniyeyi de dahil et)
  return (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000);
};

// VTT içeriğini altyazı nesneleri dizisine ayrıştırır
export const parseVTT = (vttContent) => {
  const subtitles = [];
  // VTT içeriğini bloklara ayır, çift yeni satırları (hem \n\n hem de \r\n\r\n) dikkate al
  const blocks = vttContent.split(/(?:\r?\n){2,}/); // İki veya daha fazla yeni satır eşleşmesi

  for (let block of blocks) {
    block = block.trim(); // Bloğun başındaki/sonundaki boşlukları temizle

    // Yorumları, WEBVTT başlığını, ID satırlarını veya boş blokları atla
    // ID satırları sadece sayısal değer içerir ve zaman damgasından önce gelir.
    if (!block || block.startsWith('WEBVTT') || block.startsWith('NOTE') || /^\d+$/.test(block)) {
      continue;
    }

    const lines = block.split(/\r?\n/);
    let timeLine = '';
    let contentLines = [];

    // Zaman satırını ve içerik satırlarını ayır
    for (const line of lines) {
      if (line.includes('-->')) {
        timeLine = line;
      } else if (timeLine) { // Zaman satırından sonraki tüm satırlar içeriktir
        contentLines.push(line);
      }
    }

    if (!timeLine) continue; // Zaman satırı olmayan blokları atla

    // Zaman damgalarını ayırın ve toSeconds fonksiyonu ile saniyeye çevirin
    const [startStr, endStrWithProps] = timeLine.split('-->').map(t => t.trim());

    const start = toSeconds(startStr);
    const end = toSeconds(endStrWithProps); // toSeconds fonksiyonu artık "align:middle" gibi kısımları da hallediyor.

    let content = contentLines.join(' ').trim(); // İçerik satırlarını birleştir ve boşlukları temizle

    // İçeriği temizle: VTT etiketlerini ve yerleşik zaman damgalarını kaldır
    content = content
      .replace(/<c[^>]*>/g, '') // <c.classname> gibi etiketleri kaldır
      .replace(/<\/[^>]*>/g, '') // </c> gibi kapatma etiketlerini kaldır
      .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '') // <00:00:05.123> gibi zaman damgalarını kaldır
      .replace(/<v[^>]*>/g, '') // <v John> gibi konuşmacı etiketlerini kaldır
      .replace(/<\/[^>]*>/g, '') // </v> gibi kapatma etiketlerini kaldır
      .replace(/&nbsp;/g, ' ') // &nbsp; HTML varlığını boşlukla değiştir
      .replace(/\s+/g, ' ') // Birden fazla boşluğu tek bir boşlukla normalleştir
      .trim(); // Başındaki/sonundaki boşlukları tekrar temizle

    // İçerik temizlendikten sonra boş değilse altyazı dizisine ekle
    if (content) {
      subtitles.push({ start, end, content });
    }
  }
  return subtitles;
};