# 🔐 Admin Kullanıcısı Oluşturma Rehberi

Bu rehber, LgsLiga uygulaması için admin kullanıcısı oluşturma adımlarını açıklar.

---

## 📋 Admin Bilgileri

```
Email: admin@lgsliga.com
Şifre: LgsLiga_001
Role: admin
```

---

## 🚀 Adım Adım Kurulum

### ADIM 1: Supabase Dashboard'dan Kullanıcı Oluşturma

1. **Supabase Dashboard**'a gidin: https://supabase.com/dashboard
2. **LgsLiga** projenizi seçin
3. Sol menüden **Authentication** > **Users** sekmesine tıklayın
4. Sağ üstteki **"Add User"** butonuna tıklayın
5. **"Create New User"** seçeneğini seçin

6. Formu doldurun:

   ```
   Email: admin@lgsliga.com
   Password: LgsLiga_001
   Auto Confirm User: ✅ (İşaretleyin!)
   ```

7. **"Create User"** butonuna basın
8. ✅ Kullanıcı oluşturuldu!

---

### ADIM 2: Admin Yetkisi Verme (SQL)

1. Supabase Dashboard'da **SQL Editor** sekmesine gidin
2. **New Query** butonuna tıklayın
3. `create-admin-user.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. **Run** (CMD/CTRL + Enter) butonuna basın

**Beklenen Çıktı:**

```
✅ Admin kullanıcısı oluşturuldu! ID: xxxxx-xxxx-xxxx...
✅ Admin yetkisi verildi!
📧 Email: admin@lgsliga.com
🔑 Şifre: LgsLiga_001
👤 Role: admin
```

---

### ADIM 3: Admin Olarak Giriş Yapma

1. Uygulamaya gidin (localhost:3000 veya canlı site)
2. Giriş sayfasına gidin
3. **Email:** `admin@lgsliga.com`
4. **Şifre:** `LgsLiga_001`
5. **Login** butonuna basın
6. ✅ Admin paneline yönlendirildiniz!

---

## 🎯 Admin Kullanıcısının Yetkileri

Admin kullanıcısı şu sayfalara erişebilir:

- ✅ **Dashboard** - Genel bakış
- ✅ **Admin Panel** (`/admin`) - Öğrenci yönetimi, satın alma onayları
- ✅ **Reports** - Tüm raporlar
- ✅ **Settings** - Sistem ayarları

---

## 🔍 Kontrol ve Doğrulama

### Kullanıcı Oluşturuldu mu?

**Supabase Dashboard > Authentication > Users** bölümünde `admin@lgsliga.com` kullanıcısını görmelisiniz.

### Admin Yetkisi Verildi mi?

SQL Editor'da şu sorguyu çalıştırın:

```sql
SELECT id, email, full_name, role
FROM public.profiles
WHERE email = 'admin@lgsliga.com';
```

**Beklenen Sonuç:**
| id | email | full_name | role |
|----|-------|-----------|------|
| uuid... | admin@lgsliga.com | Admin | admin |

### Giriş Yapabiliyor mu?

Uygulamada login sayfasından giriş yapmayı deneyin.

---

## ⚠️ Güvenlik Notları

### Önemli Güvenlik Önerileri:

1. **Şifreyi Değiştirin**
   - İlk girişten sonra şifreyi mutlaka değiştirin
   - Güçlü bir şifre kullanın (en az 12 karakter, büyük/küçük harf, sayı, özel karakter)

2. **2FA Aktif Edin** (Opsiyonel)
   - Supabase Dashboard > Authentication > Settings
   - Multi-Factor Authentication'ı aktif edin

3. **Admin Email'ini Gizli Tutun**
   - Halka açık yerlerde paylaşmayın
   - Dokümantasyondan silin (production'da)

4. **Row Level Security (RLS)**
   - Admin paneli sayfalarına sadece admin rolü erişebilmeli
   - Frontend'de role kontrolü yapın

---

## 🔄 Şifre Değiştirme

### Yöntem 1: Supabase Dashboard'dan

1. **Supabase Dashboard** > **Authentication** > **Users**
2. `admin@lgsliga.com` kullanıcısına tıklayın
3. **"Reset Password"** butonuna basın
4. Yeni şifreyi girin

### Yöntem 2: Uygulamadan (Önerilen)

1. Uygulamaya giriş yapın
2. **Profile** veya **Settings** sayfasına gidin
3. **"Change Password"** bölümünden şifreyi değiştirin

---

## 🆘 Sorun Giderme

### Sorun 1: "Kullanıcı bulunamadı" Hatası

**Çözüm:**

- Supabase Dashboard'dan kullanıcıyı oluşturmayı unutmuş olabilirsiniz
- ADIM 1'i tekrar kontrol edin

### Sorun 2: Giriş Yapamıyorum

**Çözüm:**

- Email'i doğru yazdığınızdan emin olun: `admin@lgsliga.com`
- Şifreyi doğru yazdığınızdan emin olun: `LgsLiga_001`
- Büyük/küçük harf duyarlılığına dikkat edin

### Sorun 3: Admin Paneline Erişemiyorum

**Çözüm:**

- SQL scriptini çalıştırdığınızdan emin olun (ADIM 2)
- Profiles tablosunda role='admin' olduğunu kontrol edin
- Tarayıcıyı yenileyip tekrar giriş yapın

### Sorun 4: "Email Not Confirmed" Hatası

**Çözüm:**

- Kullanıcı oluştururken "Auto Confirm User" seçeneğini işaretlemeyi unutmuş olabilirsiniz
- Supabase Dashboard'dan kullanıcıyı manuel olarak confirm edin

---

## 📝 Ek Notlar

### Birden Fazla Admin Oluşturma

Başka admin kullanıcıları oluşturmak için:

1. ADIM 1'i farklı bir email ile tekrarlayın
2. `create-admin-user.sql` dosyasında `v_admin_email` değerini yeni email ile değiştirin
3. SQL scriptini tekrar çalıştırın

### Admin Kullanıcısını Silme

```sql
-- Önce profiles tablosundan sil
DELETE FROM public.profiles WHERE email = 'admin@lgsliga.com';

-- Sonra Supabase Dashboard > Authentication > Users'dan kullanıcıyı manuel olarak silin
```

---

## ✅ Kurulum Checklist

- [ ] Supabase Dashboard'dan kullanıcı oluşturuldu
- [ ] Auto Confirm User işaretlendi
- [ ] SQL scripti çalıştırıldı
- [ ] Profiles tablosunda role='admin' olduğu doğrulandı
- [ ] Uygulamadan giriş yapıldı
- [ ] Admin paneline erişim test edildi
- [ ] Şifre değiştirildi (önerilen)

---

**Başarılar! 🎉**

Sorularınız için: [GitHub Issues](https://github.com/onreonA/LgsLiga/issues)
