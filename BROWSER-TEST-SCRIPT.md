# 🧪 Browser Console Test Script

## Giriş Sorunu Tespiti

Aşağıdaki kodu **browser console'da** çalıştırın (F12 → Console):

```javascript
// 1. Supabase bağlantı testi
console.log('🔍 Test başladı...');
console.log('📌 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'BULUNAMADI!');

// 2. Manuel giriş testi
async function testLogin() {
  console.log('👤 Manuel giriş testi başladı...');
  
  try {
    // Supabase import (global değişken olarak mevcut olmalı)
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      'https://mtonzsgnclyfzzkpysfn.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b256c2duY2x5Znp6a3B5c2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzM1ODAsImV4cCI6MjA3NTEwOTU4MH0.3WYGJGFJTaPqKV_UgQpiQ_XO7bLRhOnVBDk8JkxsS38'
    );
    
    // Öğrenci ile giriş dene
    console.log('🔑 Öğrenci ile giriş deneniyor...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'zeyno@zeynepunsal.com.tr',
      password: 'Zeyno_001'
    });
    
    if (error) {
      console.error('❌ Giriş hatası:', error);
      return;
    }
    
    console.log('✅ Giriş başarılı!', data.user.email);
    
    // Profile kontrol
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile hatası:', profileError);
      return;
    }
    
    console.log('✅ Profile bulundu:', profile);
    console.log('🎯 Role:', profile.role);
    console.log('📚 Grade:', profile.grade);
    
  } catch (err) {
    console.error('❌ Beklenmeyen hata:', err);
  }
}

// Fonksiyonu çalıştır
testLogin();
```

---

## 📝 Beklenen Sonuç

**Başarılı:**
```
✅ Giriş başarılı! zeyno@zeynepunsal.com.tr
✅ Profile bulundu: {id: "...", email: "...", role: "student", ...}
🎯 Role: student
📚 Grade: 8
```

**Başarısız:**
```
❌ Giriş hatası: {message: "Invalid login credentials"}
```
veya
```
❌ Profile hatası: {message: "..."}
```

---

## 🎯 Hata Durumları

### Senaryo 1: "Invalid login credentials"
→ Kullanıcı veya şifre yanlış
→ Supabase Auth'da kullanıcı mevcut değil

**Çözüm:** `check-admin-user.sql` ve kullanıcı oluşturma kontrolü

### Senaryo 2: "Profile hatası"
→ `profiles` tablosunda kayıt yok
→ RLS policy sorunu

**Çözüm:** Profile kayıtlarını kontrol et

### Senaryo 3: Network hatası
→ Supabase bağlantı sorunu
→ .env.local yanlış

**Çözüm:** Environment variables kontrol

---

Bu scripti console'da çalıştırın ve sonucu gösterin!
