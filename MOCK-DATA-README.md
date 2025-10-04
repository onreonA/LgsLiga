# 📊 LgsLiga Mock Data Kurulum Rehberi

Bu rehber, LgsLiga projesindeki mock dataları Supabase veritabanına nasıl aktaracağınızı adım adım açıklar.

---

## 🎯 Neler Ekleniyor?

### 📦 Mock Data İçeriği:

1. **8 Ödül** (Shop Rewards) - Ödül mağazası için
2. **4 Hedef** (User Goals) - Günlük, haftalık, aylık, yıllık hedefler
3. **4 Aile Mesajı** (Family Messages) - Anne, Baba, Abla, Dede mesajları
4. **2 Haftalık Mektup** (Weekly Letters) - Kişisel günlük kayıtları
5. **4 Görev** (Quests) - Matematik, Türkçe, Fen, İnkılap görevleri
6. **12 Çalışma Oturumu** (Study Sessions) - Son 7 günlük çalışma verisi
7. **3 Sınav** (Exams) - Tamamlanmış ve devam eden sınavlar
8. **1250 Coin** (User Coins) - Ödül sistemi için bakiye
9. **4 Konu** (Topics) - Ders konuları

---

## 🚀 Hızlı Başlangıç (Önerilen)

### Adım 1: Supabase'de Giriş Yapın

1. Uygulamaya giriş yapın (SignUp/Login)
2. Profilinizi oluşturun

### Adım 2: SQL Script'i Çalıştırın

1. **Supabase Dashboard**'a gidin: https://supabase.com/dashboard
2. **LgsLiga** projenizi seçin
3. Sol menüden **SQL Editor** sekmesine tıklayın
4. **New Query** butonuna tıklayın
5. `supabase-quick-seed.sql` dosyasının içeriğini kopyalayıp yapıştırın
6. **Run** (CMD/CTRL + Enter) butonuna basın

### Adım 3: Sonuçları Kontrol Edin

Script çalıştıktan sonra şu mesajları görmelisiniz:

```
✅ Mock data başarıyla eklendi! User ID: xxxxx-xxxx-xxxx...
✅ Ödüller: 8 adet
✅ Hedefler: 4 adet
✅ Aile Mesajları: 4 adet
✅ Görevler: 4 adet
✅ Çalışma Oturumları: 12 adet
✅ Sınavlar: 3 adet
✅ Coinler: 1250 coin
```

### Adım 4: Uygulamayı Yenileyin

Tarayıcınızda uygulamayı yenileyin (F5) ve verilerin geldiğini kontrol edin!

---

## 📁 Dosyalar ve Kullanımları

### 1. `supabase-schema.sql`
- **Ne yapar:** Veritabanı yapısını oluşturur (tablolar, ilişkiler, güvenlik kuralları)
- **Ne zaman kullanılır:** Proje ilk kurulumunda (zaten çalıştırıldı ✅)
- **Tekrar çalıştırılmalı mı:** Hayır, bir kez yeterli

### 2. `supabase-quick-seed.sql` ⭐ (ÖNERİLEN)
- **Ne yapar:** Otomatik olarak mock data ekler
- **Ne zaman kullanılır:** Giriş yaptıktan sonra
- **Tekrar çalıştırılabilir mi:** Evet, eski verileri siler ve yenilerini ekler
- **Avantajları:**
  - ✅ User ID'yi otomatik bulur
  - ✅ Tek tıkla çalışır
  - ✅ Hata yapmaz

### 3. `supabase-seed-data.sql` (Gelişmiş)
- **Ne yapar:** Manuel olarak mock data ekler
- **Ne zaman kullanılır:** Özelleştirilmiş veri eklemek istediğinizde
- **Tekrar çalıştırılabilir mi:** Evet, ama YOUR_USER_ID değerlerini düzeltmelisiniz
- **Avantajları:**
  - ✅ Daha fazla kontrol
  - ✅ Birden fazla kullanıcı için özelleştirilebilir
  - ✅ Detaylı açıklamalar

---

## 🔍 Mock Data Detayları

### Ödüller (Shop Rewards)
```
Extra Molalar         - 150 coin - Mola hakkı
Favori Yemek         - 300 coin - Anne'den yemek
Arkadaş Buluşması    - 250 coin - 2 saat arkadaş izni
Oyun Zamanı          - 200 coin - Oyun/telefon zamanı
Film Gecesi          - 180 coin - Aile film gecesi
Alışveriş            - 400 coin - 100₺ alışveriş
Özel Ders Yok        - 350 coin - Ders yapmama hakkı
Gezi Günü            - 500 coin - Ailece gezi
```

### Görevler (Quests)
```
Matematik Çarpanlar   - 12/20 tamamlandı - 150 XP - 5 gün kaldı
Türkçe Paragraf       - 8/15 tamamlandı - 120 XP - 4 gün kaldı
Fen Hareket          - 25/25 tamamlandı - 200 XP - ✅ Tamamlandı
İnkılap Savaşları    - 5/18 tamamlandı - 140 XP - ⏰ Süresi Doldu
```

### Çalışma İstatistikleri
```
Bugün:        43 soru çözüldü, 38 doğru
Dün:          52 soru çözüldü, 45 doğru
2 gün önce:   35 soru çözüldü, 31 doğru
...toplam 12 oturum
```

---

## ⚠️ Sık Karşılaşılan Sorunlar

### Sorun 1: "Kullanıcı bulunamadı" Hatası
**Çözüm:** Önce uygulamaya giriş yapıp profil oluşturun, sonra SQL scriptini çalıştırın.

### Sorun 2: Veriler Gelmiyor
**Çözüm:** 
- Tarayıcınızı yenileyin (F5)
- Console'da hata var mı kontrol edin (F12)
- Supabase'de Row Level Security (RLS) politikalarını kontrol edin

### Sorun 3: "Duplicate Key" Hatası
**Çözüm:** `supabase-quick-seed.sql` otomatik olarak eski verileri siler. Ama manuel ekleme yapıyorsanız önce verileri silin:
```sql
DELETE FROM public.user_goals WHERE user_id = 'YOUR_USER_ID';
DELETE FROM public.family_messages WHERE user_id = 'YOUR_USER_ID';
-- vb...
```

### Sorun 4: Görseller Görünmüyor
**Çözüm:** `supabase-quick-seed.sql` placeholder görseller kullanır. Gerçek görseller için `supabase-seed-data.sql` dosyasındaki URL'leri kullanın.

---

## 🔄 Verileri Güncelleme

Mock datayı yeniden eklemek için:

1. `supabase-quick-seed.sql` dosyasını tekrar çalıştırın
2. Script otomatik olarak eski verileri siler ve yenilerini ekler
3. Uygulamayı yenileyin

---

## 📚 Veritabanı Tabloları

### Ana Tablolar:
- `profiles` - Kullanıcı profilleri
- `subjects` - Dersler (Matematik, Türkçe, vb.)
- `topics` - Konular
- `study_sessions` - Çalışma oturumları
- `quests` - Görevler
- `exams` - Sınavlar
- `shop_rewards` - Ödüller
- `purchase_requests` - Satın alma talepleri
- `user_coins` - Coin bakiyesi
- `family_messages` - Aile mesajları
- `user_goals` - Hedefler
- `weekly_letters` - Haftalık mektuplar
- `achievements` - Başarılar

### İlişkiler:
- Her tablo `user_id` ile kullanıcıya bağlıdır
- `study_sessions` → `subjects` → `topics`
- `quests` → `topics`
- `purchase_requests` → `shop_rewards`

---

## 🎨 Özelleştirme

### Kendi Verilerinizi Eklemek:

1. `supabase-seed-data.sql` dosyasını açın
2. `YOUR_USER_ID` değerlerini kendi User ID'nizle değiştirin
3. Veri değerlerini istediğiniz gibi düzenleyin
4. SQL Editor'da çalıştırın

### User ID'nizi Bulma:

1. Supabase Dashboard > Authentication > Users
2. Kullanıcınıza tıklayın
3. UUID'yi kopyalayın (örn: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

---

## ✅ Test Checklist

Mock data eklendikten sonra kontrol edin:

- [ ] Dashboard'da XP ve Level görünüyor mu?
- [ ] Quests sayfasında 4 görev var mı?
- [ ] Shop sayfasında 8 ödül var mı?
- [ ] Settings'te hedefler görünüyor mu?
- [ ] Settings'te aile mesajları görünüyor mu?
- [ ] Reports sayfasında grafikler çalışıyor mu?
- [ ] Coin bakiyesi 1250 görünüyor mu?

---

## 🆘 Yardım

Sorun yaşıyorsanız:

1. **Console Log**'ları kontrol edin (F12 > Console)
2. **Network Tab**'ı kontrol edin (F12 > Network)
3. **Supabase Logs**'u kontrol edin (Dashboard > Logs)
4. SQL scriptini adım adım çalıştırın

---

## 📝 Notlar

- Mock data gerçek kullanım için örnektir
- Production'da gerçek veriler kullanılmalıdır
- Görseller placeholder'dır, gerçek görseller eklenmelidir
- Tarihler script çalıştırıldığında otomatik oluşturulur

---

**Başarılar! 🎉**

