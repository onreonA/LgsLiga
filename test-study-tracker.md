# 📝 Study-Tracker Test Rehberi

Bu rehber, study-tracker sayfasındaki formların test edilmesi ve veritabanına kaydedilip kaydedilmediğinin kontrolü için hazırlanmıştır.

---

## 🧪 Test Senaryoları

### **TEST 1: Günlük Çalışma Formu**

#### Adım 1: Formu Doldurun
```
📅 Tarih: Bugünün tarihi
📚 Ders: Matematik
📖 Konu: Çarpanlar ve Katlar
📦 Kaynak: Doping
🔢 Toplam Soru: 20
✅ Doğru Sayısı: 18
❌ Yanlış Sayısı: 2
⭕ Boş Sayısı: 0
```

#### Adım 2: "Çalışmayı Kaydet" Butonuna Basın

#### Adım 3: Başarı Mesajını Kontrol Edin
```
✅ Veriler başarıyla kaydedildi!
+180 XP • +18 Coin
```

#### Adım 4: Veritabanında Kontrol Edin

**Supabase Dashboard > SQL Editor** - Şu query'yi çalıştırın:

```sql
-- En son eklenen çalışma kaydını kontrol et
SELECT 
    ss.id,
    s.name as subject_name,
    t.name as topic_name,
    ss.questions_solved,
    ss.correct_answers,
    ss.xp_earned,
    ss.duration_minutes,
    ss.completed_at
FROM study_sessions ss
LEFT JOIN subjects s ON ss.subject_id = s.id
LEFT JOIN topics t ON ss.topic_id = t.id
ORDER BY ss.completed_at DESC
LIMIT 5;
```

**Beklenen Sonuç:**
| subject_name | topic_name | questions_solved | correct_answers | xp_earned |
|--------------|------------|------------------|-----------------|-----------|
| Matematik | Çarpanlar ve Katlar | 20 | 18 | 180 |

---

### **TEST 2: Sınav Sonuçları Formu**

#### Adım 1: Formu Doldurun
```
📅 Sınav Tarihi: Bugünün tarihi
📝 Sınav Türü: Deneme
🔢 Toplam Soru: 90
✅ Doğru Sayısı: 75
❌ Yanlış Sayısı: 10
⭕ Boş Sayısı: 5
📊 Net: 72.5 (otomatik hesaplanır)
🎯 Puan: 385
```

#### Adım 2: "Sınav Sonucunu Kaydet" Butonuna Basın

#### Adım 3: Veritabanında Kontrol Edin

```sql
-- En son eklenen sınav kaydını kontrol et
SELECT 
    id,
    title,
    exam_type,
    total_questions,
    correct_answers,
    score,
    status,
    started_at,
    completed_at
FROM exams
ORDER BY completed_at DESC
LIMIT 5;
```

**Beklenen Sonuç:**
| title | exam_type | total_questions | correct_answers | score |
|-------|-----------|-----------------|-----------------|-------|
| Deneme Sınavı | practice | 90 | 75 | 385 |

---

### **TEST 3: Kitap Serüveni Formu**

#### ÖNCE: Book Reading Tablosunu Oluşturun
Supabase SQL Editor'da `create-book-reading-table.sql` scriptini çalıştırın!

#### Adım 1: Formu Doldurun
```
📅 Tarih: Bugünün tarihi
📚 Kitap Adı: + Yeni Kitap Ekle → "Matematik Soru Bankası"
📖 Toplam Sayfa: 450
📄 Bugün Okunan Sayfa: 25
📊 Kalan Sayfa: 425 (otomatik hesaplanır)
```

#### Adım 2: "Kitap Kaydını Kaydet" Butonuna Basın

#### Adım 3: Veritabanında Kontrol Edin

```sql
-- En son eklenen kitap kaydını kontrol et
SELECT 
    id,
    book_name,
    total_pages,
    pages_read_today,
    remaining_pages,
    reading_date,
    created_at
FROM book_reading
ORDER BY created_at DESC
LIMIT 5;
```

**Beklenen Sonuç:**
| book_name | total_pages | pages_read_today | remaining_pages |
|-----------|-------------|------------------|-----------------|
| Matematik Soru Bankası | 450 | 25 | 425 |

---

## 🎯 Coin ve XP Artışını Kontrol Edin

### User Coins Kontrol:

```sql
-- Güncel coin bakiyesini kontrol et
SELECT 
    user_id,
    total_coins,
    spent_coins,
    earned_coins,
    updated_at
FROM user_coins
WHERE user_id = (SELECT id FROM profiles WHERE role = 'student' ORDER BY created_at DESC LIMIT 1);
```

**Beklenen Sonuç:**
- Önceki bakiye + 18 coin artmış olmalı

### Toplam XP Kontrol:

```sql
-- Toplam kazanılan XP'yi hesapla
SELECT 
    user_id,
    SUM(xp_earned) as total_xp,
    COUNT(*) as total_sessions
FROM study_sessions
WHERE user_id = (SELECT id FROM profiles WHERE role = 'student' ORDER BY created_at DESC LIMIT 1)
GROUP BY user_id;
```

**Beklenen Sonuç:**
- total_xp: Önceki XP + 180 = ???
- total_sessions: Önceki oturum sayısı + 1

---

## ✅ Test Checklist

### Günlük Çalışma:
- [ ] Form dolduruldu
- [ ] "Çalışmayı Kaydet" butonuna basıldı
- [ ] Başarı mesajı göründü (+180 XP, +18 Coin)
- [ ] study_sessions tablosunda kayıt var
- [ ] Subject_id doğru kaydedildi
- [ ] Topic_id doğru kaydedildi
- [ ] XP hesaplaması doğru
- [ ] Coin bakiyesi arttı

### Sınav Sonuçları:
- [ ] Form dolduruldu
- [ ] Net otomatik hesaplandı
- [ ] "Sınav Sonucunu Kaydet" butonuna basıldı
- [ ] Başarı mesajı göründü
- [ ] exams tablosunda kayıt var
- [ ] Puan doğru kaydedildi
- [ ] Status 'completed' olarak kaydedildi

### Kitap Serüveni:
- [ ] book_reading tablosu oluşturuldu
- [ ] Yeni kitap eklendi
- [ ] Form dolduruldu
- [ ] Kalan sayfa otomatik hesaplandı
- [ ] İlerleme çubuğu göründü
- [ ] "Kitap Kaydını Kaydet" butonuna basıldı
- [ ] Başarı mesajı göründü
- [ ] book_reading tablosunda kayıt var

---

## 🐛 Sorun Giderme

### Hata 1: "subjects is not defined"
**Çözüm:** Sayfayı yenileyin (CTRL + SHIFT + R)

### Hata 2: Konular gelmiyor
**Çözüm:** Supabase'de topics tablosunda veri var mı kontrol edin:
```sql
SELECT * FROM topics;
```

### Hata 3: Kitap kaydedilmiyor
**Çözüm:** `create-book-reading-table.sql` scriptini çalıştırdınız mı kontrol edin.

### Hata 4: Coin artmıyor
**Çözüm:** user_coins tablosunda kayıt var mı kontrol edin:
```sql
SELECT * FROM user_coins;
```

---

## 📊 Tüm Verileri Görüntüleme

### Kapsamlı Veri Kontrolü:

```sql
-- Tüm öğrenci aktivitelerini görüntüle
SELECT 
    'Study Sessions' as type,
    COUNT(*) as count,
    SUM(xp_earned) as total_xp
FROM study_sessions
WHERE user_id = (SELECT id FROM profiles WHERE role = 'student' ORDER BY created_at DESC LIMIT 1)

UNION ALL

SELECT 
    'Exams' as type,
    COUNT(*) as count,
    AVG(score) as avg_score
FROM exams
WHERE user_id = (SELECT id FROM profiles WHERE role = 'student' ORDER BY created_at DESC LIMIT 1)

UNION ALL

SELECT 
    'Book Reading' as type,
    COUNT(*) as count,
    SUM(pages_read_today) as total_pages_read
FROM book_reading
WHERE user_id = (SELECT id FROM profiles WHERE role = 'student' ORDER BY created_at DESC LIMIT 1);
```

---

## 🎯 Başarı Kriterleri

✅ **Başarılı Test:**
1. Form gönderildi
2. Başarı mesajı göründü
3. XP ve Coin kazanımı gösterildi
4. Veritabanında kayıt var
5. Bakiye güncellendi
6. Form temizlendi (reset)

❌ **Başarısız Test:**
1. Hata mesajı aldınız
2. Veritabanında kayıt yok
3. Bakiye artmadı
4. Console'da error var

---

**Test sonuçlarını ve ekran görüntülerini paylaşın!** 🚀

