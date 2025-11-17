# 🦷 Diş Hastanesi Yönetim Sistemi - Frontend Detaylı Şema

## 📋 İçindekiler

1. [Genel Mimari](#genel-mimari)
2. [Staff Paneli (Öncelikli)](#staff-paneli)
3. [Doktor Paneli](#doktor-paneli)
4. [Admin Paneli](#admin-paneli)
5. [Hasta Portalı](#hasta-portali)
6. [Teknik Detaylar](#teknik-detaylar)
7. [Implementasyon Sırası](#implementasyon-sirasi)

---

## 🏗️ Genel Mimari

### Roller ve Yetkiler

```
Admin
  └─ Tüm yetkilere sahip
  └─ Şube yönetimi
  └─ Kullanıcı yönetimi
  └─ Raporlama

Doctor (Doktor)
  └─ Kendi randevuları
  └─ Hasta muayeneleri
  └─ Tedavi planları
  └─ Dental chart

Receptionist (Resepsiyonist)
  └─ Randevu yönetimi
  └─ Hasta kaydı
  └─ Ödeme işlemleri
  └─ Klinik yönetimi

Nurse (Hemşire/Asistan)
  └─ Hasta hazırlık
  └─ Muayene yardımı
  └─ Tıbbi kayıt giriş

Patient (Hasta)
  └─ Randevu alma
  └─ Tedavi geçmişi görüntüleme
  └─ Belgeler
```

---

## 🟦 STAFF PANELİ (ÖNCELİKLİ)

Staff paneli, diş hastanesindeki en yoğun kullanılan paneldir. Resepsiyonist ve kayıt personeli tarafından kullanılır.

### 📅 A. Randevu Yönetimi Modülü

#### A1. Randevu Takvimi Görünümü

**Haftalık Takvim (Default View)**

```
Features:
- Google Calendar benzeri drag & drop interface
- Zaman slotları: 08:00 - 20:00 (15-30-45-60 dakika aralıkları)
- Doktor bazlı sütunlar
- Renk kodlaması:
  * Bekliyor: Sarı
  * Onaylandı: Yeşil
  * Muayenede: Mavi
  * Tamamlandı: Gri
  * İptal: Kırmızı
  * Gelmedi: Turuncu

UI Components:
- Multi-select doktor filtresi
- Şube seçici (multi-branch için)
- Tarih navigator (prev/next week)
- Bugüne git butonu
- Randevu tipi filtreleri
```

**Günlük Takvim**

```
Features:
- Saat başı detaylı görünüm
- Hasta fotoğrafı ve bilgileri
- Son muayene notları quick preview
- Randevuya tıkla → detay sidebar
- Sağ tık → hızlı işlemler menüsü
```

**Liste Görünümü**

```
Features:
- Tüm randevular tablo formatında
- Advanced filtreleme
- Bulk operations (toplu iptal, onaylama)
- Export to Excel/PDF
```

#### A2. Randevu Oluşturma (Quick Appointment)

**Step 1: Hasta Seçimi**

```
UI:
- Arama kutusu (TC No, Tel, Ad-Soyad)
- Autocomplete dropdown
- "Yeni Hasta Ekle" quick action butonu
- Hasta bilgileri preview card
  * Son randevu
  * Toplam tedavi sayısı
  * Borç durumu
  * Alerji uyarısı (varsa kırmızı badge)
```

**Step 2: Tedavi Seçimi**

```
UI:
- Tedavi kategorileri dropdown
  * Muayene
  * Dolgu
  * Kanal Tedavisi
  * Çekim
  * Ortodonti Kontrol
  * Temizlik & Beyazlatma
  * Protez
  * İmplant
  * Diğer

- Seçilen tedaviye göre otomatik süre:
  * Muayene: 30 dk
  * Dolgu: 45 dk
  * Kanal: 60 dk
  * Çekim: 30 dk
  * vb.

- Manuel süre düzenleme seçeneği
```

**Step 3: Doktor & Tarih Seçimi**

```
UI:
- Uzmanlık bazlı doktor filtreleme
- Şube seçimi (doktorun o şubede olduğu günler)
- Date picker (müsait günler yeşil, dolu günler kırmızı)
- Saat seçimi (müsait saatler listesi)
- Çakışma kontrolü real-time
- "İlk müsait randevu" önerisi
```

**Step 4: Notlar & Onay**

```
UI:
- Randevu notu text area
- Hatırlatma türü:
  * SMS
  * Email
  * WhatsApp
- Onay durumu toggle
- Kaydet & Yazdır butonu
```

#### A3. Randevu Detay Sayfası

```
Sections:
1. Hasta Bilgileri Card
   - Fotoğraf
   - Ad Soyad
   - TC No
   - Telefon
   - Email
   - Yaş
   - Son randevu
   - Toplam borç

2. Randevu Bilgileri Card
   - Randevu No
   - Durum badge
   - Tarih & Saat
   - Doktor
   - Şube
   - Tedavi türü
   - Süre
   - Oluşturan personel

3. Timeline (Geçmiş İşlemler)
   - Randevu oluşturuldu
   - Hasta geldi
   - Muayeneye alındı
   - Muayene tamamlandı
   - Ödeme yapıldı

4. Hızlı İşlemler
   - Durumu Değiştir
   - Yeniden Planla
   - İptal Et
   - Yazdır
   - SMS Gönder
   - Muayeneye Başla

5. İlgili Kayıtlar
   - Önceki randevular
   - Tedavi geçmişi
   - Faturalar
```

#### A4. Randevu İptal & Erteleme

**İptal**

```
UI:
- İptal nedeni dropdown (zorunlu)
  * Hasta isteği
  * Doktor müsait değil
  * Acil durum
  * Diğer
- İptal notu
- SMS/Email bildirimi checkbox
- Onay modalı
```

**Erteleme (Reschedule)**

```
UI:
- Yeni tarih seçici
- Yeni doktor seçimi (opsiyonel)
- Neden text area
- Hastaya bildirim gönder checkbox
```

---

### 👤 B. Hasta Kayıt Yönetimi

#### B1. Hasta Listesi

```
Features:
- Arama & filtreleme
  * Ad, soyad, TC No, telefon
  * Kayıt tarihi aralığı
  * Yaş aralığı
  * Sigorta durumu
  * Borç durumu

- Tablo kolonları:
  * Hasta No
  * Fotoğraf
  * Ad Soyad
  * TC No
  * Telefon
  * Son Randevu
  * Toplam Tedavi
  * Borç
  * Durum (Aktif/Pasif)
  * İşlemler

- Bulk işlemler:
  * Excel export
  * SMS gönder (toplu)
  * Etiket ekle
```

#### B2. Yeni Hasta Kaydı

**Step 1: Temel Bilgiler**

```
Form:
- Hasta Numarası (otomatik: HKD-2025-00001)
- Ad *
- Soyad *
- TC Kimlik No * (11 haneli validasyon)
- Pasaport No (yabancı hastalar için)
- Doğum Tarihi * (date picker)
- Cinsiyet * (radio)
- Kan Grubu (dropdown)
- Fotoğraf yükleme (drag & drop)
```

**Step 2: İletişim Bilgileri**

```
Form:
- Telefon * (format: 5XX XXX XX XX)
- Email
- Adres (textarea)
- İl (dropdown)
- İlçe (dropdown - il'e göre)
- Posta Kodu

Acil Durum İletişimi:
- Ad Soyad
- Yakınlık (dropdown: Anne, Baba, Eş, Kardeş, vb.)
- Telefon
```

**Step 3: Sağlık Bilgileri**

```
Form:
- Alerjiler (textarea + tag sistemi)
  * İlaç alerjisi
  * Besin alerjisi
  * Diğer

- Kronik Hastalıklar (checkbox list)
  * Diyabet
  * Hipertansiyon
  * Kalp hastalığı
  * Astım
  * Diğer (text field)

- Kullandığı İlaçlar (textarea)
- Özel Notlar (textarea)
```

**Step 4: Sigorta & Ödeme**

```
Form:
- Sigorta Var mı? (toggle)
- Sigorta Şirketi (dropdown)
- Sigorta Poliçe No
- Anlaşmalı Kurum (dropdown)
  * SGK
  * Özel Sigorta
  * Kurumsal Anlaşma
- İndirim Oranı (%)
- Notlar
```

#### B3. Hasta Detay Sayfası

**Üst Kısım (Header)**

```
Components:
- Hasta fotoğrafı (büyük)
- Ad Soyad
- Hasta No & TC No
- Yaş & Cinsiyet
- Telefon (tıkla ara)
- Email (tıkla mail gönder)
- Son randevu tarihi
- Kayıt tarihi
- Hızlı işlemler:
  * Randevu Ver
  * Düzenle
  * Sil
  * Yazdır (Hasta Dosyası)
```

**Tab 1: Genel Bilgiler**

```
Sections:
- İletişim Bilgileri Card
- Acil Durum Bilgileri Card
- Sağlık Bilgileri Card
- Sigorta Bilgileri Card
```

**Tab 2: Randevular**

```
Features:
- Gelecek randevular (timeline)
- Geçmiş randevular (tablo)
- Randevu istatistikleri:
  * Toplam randevu
  * Tamamlanan
  * İptal edilen
  * Gelmedi
```

**Tab 3: Tedavi Geçmişi**

```
Features:
- Timeline görünümü
- Her tedavi için:
  * Tarih
  * Doktor
  * Tedavi türü
  * Diş numarası
  * Notlar
  * Belgeler (röntgen, fotoğraf)
  * Ücret
  * Ödeme durumu
- Dental chart özeti
```

**Tab 4: Muayene Kayıtları**

```
Features:
- Tüm muayene notları
- Filtreleme (tarih, doktor)
- Her kayıt için:
  * Tarih & Saat
  * Doktor
  * Şikayet
  * Tanı
  * Tedavi planı
  * Reçeteler
  * Belgeler
```

**Tab 5: Faturalar & Ödemeler**

```
Features:
- Fatura listesi (tablo)
- Ödeme geçmişi
- Toplam borç (kırmızı highlight)
- Ödeme planı (varsa)
- Tahsilat kartı
- "Ödeme Al" butonu
```

**Tab 6: Belgeler**

```
Features:
- Dosya yükleme (drag & drop)
- Kategori seçimi:
  * Röntgen
  * Fotoğraf
  * Onam formu
  * Lab sonucu
  * Diğer
- Dosya önizleme (lightbox)
- İndirme
- Silme
```

---

### 📂 C. Muayene & Tedavi Kayıtları

#### C1. Muayene Listesi

```
Features:
- Bugünün muayeneleri (default)
- Tarih aralığı filtresi
- Doktor filtresi
- Durum filtresi
- Tablo görünümü:
  * Muayene No
  * Hasta
  * Doktor
  * Tarih & Saat
  * Şikayet
  * Durum
  * İşlemler
```

#### C2. Yeni Muayene Kaydı

**Header**

```
Components:
- Hasta bilgileri (autocomplete search)
- Randevu No (varsa bağla)
- Doktor seçimi
- Muayene tarihi & saati
- Şube
```

**Section 1: Şikayet & Hikaye**

```
Form:
- Ana şikayet (textarea)
- Şikayet süresi (text)
- Semptomlar (checkbox + textarea)
- Daha önce tedavi gördü mü?
```

**Section 2: Muayene Bulguları**

```
Form:
- Ağız içi muayene (textarea)
- Vital bulgular (opsiyonel):
  * Kan basıncı
  * Nabız
  * Ateş
- Görsel muayene notları
```

**Section 3: Dental Chart (Diş Şeması)**

```
Component:
- Interactive dental chart
- Her diş için:
  * Mevcut durum
  * Yapılan işlem
  * Planlanan işlem
- Diş numaraları (FDI sistem)
- Renk kodları:
  * Sağlam: Beyaz
  * Dolgulu: Mavi
  * Kanal tedavili: Kırmızı
  * Çekilmiş: Gri
  * Çürük: Sarı
```

**Section 4: Tanı**

```
Form:
- Tanı listesi (multi-select)
- ICD-10 kodları (opsiyonel)
- Tanı notları
```

**Section 5: Tedavi Planı**

```
Form:
- Önerilen tedaviler (table)
  * Tedavi adı
  * Diş no
  * Öncelik (Acil, Yüksek, Normal, Düşük)
  * Tahmini süre
  * Tahmini ücret
  * Notlar
- Toplam tahmini ücret
- "Tedavi Planını Kaydet" butonu
```

**Section 6: Reçete**

```
Form:
- İlaç ekle butonu
- Her ilaç için:
  * İlaç adı (autocomplete)
  * Doz
  * Kullanım şekli
  * Kullanım süresi
  * Notlar
- Reçete yazdır butonu
```

**Section 7: Onam Formları**

```
Features:
- Onam formu şablonları
- Digital imza alanı (canvas)
- PDF export
- Kaydet
```

**Section 8: Belgeler**

```
Features:
- Röntgen yükleme
- Ağız içi fotoğraf
- Lab sonuçları
- Drag & drop upload
- Galeriye kaydet
```

#### C3. Muayene Detay Sayfası

```
Layout:
- Üst kısım: Hasta & Doktor bilgileri
- Sol panel: Navigation (sections)
- Orta alan: Content
- Sağ panel: Timeline & Quick actions

Features:
- Tüm muayene bilgileri read-only
- "Düzenle" butonu (doktor veya yetkili)
- "Yazdır" butonu (muayene raporu)
- "Devam Eden Tedavi" ekle
- "Randevu Ver" (bu tedavi için)
```

---

### 🧾 D. Fatura & Ödeme Yönetimi

#### D1. Fatura Listesi

```
Features:
- Filtreleme:
  * Tarih aralığı
  * Hasta
  * Durum (Ödendi, Bekliyor, Gecikmiş)
  * Ödeme yöntemi

- Tablo kolonları:
  * Fatura No
  * Hasta
  * Tarih
  * Tutar
  * Ödenen
  * Kalan
  * Durum
  * İşlemler

- Özet kartlar (üstte):
  * Toplam ciro (bugün)
  * Bekleyen ödemeler
  * Tahsilat oranı
```

#### D2. Yeni Fatura Oluşturma

**Step 1: Hasta & Randevu Seçimi**

```
UI:
- Hasta arama
- Randevu seçimi (varsa)
- Muayene kaydı seçimi (varsa)
```

**Step 2: Hizmet/Tedavi Ekleme**

```
UI:
- Hizmet kategorisi dropdown
- Hizmet listesi (multi-select table)
- Her satır:
  * Hizmet adı
  * Diş no (varsa)
  * Birim fiyat
  * Adet
  * İndirim %
  * Toplam
- "Satır Ekle" butonu
```

**Step 3: Hesaplama**

```
UI:
- Ara toplam
- İndirim (% veya tutar)
- KDV (%)
- Toplam tutar
- Sigorta katkısı (varsa, otomatik hesaplama)
- Hastanın ödemesi gereken
```

**Step 4: Ödeme & Kayıt**

```
UI:
- Ödeme yöntemi:
  * Nakit
  * Kredi Kartı
  * Banka Transferi
  * Sigorta
  * Çek

- Ödeme durumu:
  * Tamamen ödendi
  * Kısmi ödeme
  * Bekliyor

- Ödenen tutar input
- Kalan tutar (hesaplanmış)
- Vade tarihi (kısmi ödemede)
- Notlar
- "Kaydet & Yazdır" butonu
```

#### D3. Tahsilat (Ödeme Alma)

```
UI:
- Hasta seçimi
- Bekleyen fatura listesi (table)
- Her fatura için checkbox
- Toplam borç
- Ödeme yapılacak tutar input
- Ödeme yöntemi
- Dekont/Fiş no
- "Tahsil Et" butonu
- Makbuz yazdır
```

#### D4. Fatura Detay & Düzenleme

```
Sections:
1. Fatura Bilgileri
   - Fatura No
   - Tarih
   - Vade tarihi
   - Durum badge

2. Hasta Bilgileri

3. Hizmet/Tedavi Listesi (table)

4. Tutar Özeti

5. Ödeme Geçmişi (timeline)

6. İşlemler:
   - Düzenle
   - Ödeme Al
   - İptal Et
   - Yazdır
   - Email Gönder
```

---

### 🛎 E. Klinik Yönetimi

#### E1. Bekleme Listesi (Queue Management)

```
UI:
- Real-time queue display
- Hasta kartları (drag & drop sıralama)
- Her kart:
  * Hasta adı
  * Randevu saati
  * Doktor
  * Tedavi türü
  * Bekleme süresi (timer)
  * Durum badge

- Durum değişiklikleri:
  * Bekleme Odasında
  * Muayeneye Alındı
  * Tedaviye Başlandı
  * Tamamlandı

- Filtreler:
  * Doktor bazlı
  * Şube bazlı
  * Durum bazlı

- Ses uyarısı (yeni hasta geldiğinde)
```

#### E2. Oda & Doktor Durumu

```
UI:
- Grid layout (oda kartları)
- Her oda kartı:
  * Oda adı
  * Durum (Boş, Dolu, Temizleniyor)
  * Hangi doktor
  * Hangi hasta
  * İşlem süresi (timer)
  * "Bitir" butonu

- Doktor kartları (ayrı bölüm):
  * Doktor adı & fotoğrafı
  * Şu anki hastası
  * Bugünkü randevu sayısı
  * Tamamlanan/Kalan
  * Müsaitlik durumu
```

#### E3. Günlük Özet Dashboard

```
Widgets:
- Bugünkü randevu sayısı
- Gelen hasta sayısı
- Tamamlanan tedavi
- Gelmeyen hasta (No-show)
- Toplam ciro
- Bekleyen ödemeler
- Doktor bazlı iş yükü (bar chart)
- Saatlik yoğunluk (line chart)
```

---

## 🟩 DOKTOR PANELİ

### 📅 A. Doktor Takvimi

#### A1. Kişisel Randevu Takvimi

```
Features:
- Günlük/Haftalık/Aylık görünüm
- Sadece kendi randevuları
- Multi-branch view (birden fazla şubede çalışıyorsa)
- Randevu detayları (popup)
- Hızlı muayene notu ekleme
- "İzinli/Müsait değil" işaretleme
```

#### A2. Randevu Detay (Doktor View)

```
Components:
- Hasta bilgileri özet
- Tedavi geçmişi quick view
- Son muayene notları
- Alerjiler (kırmızı uyarı)
- Hızlı işlemler:
  * Muayeneye Başla
  * Erteleme Talebi
  * Randevuyu Tamamla
```

---

### 📝 B. Muayene & Tedavi Modülü

#### B1. Muayene Formu (Doktor için özelleştirilmiş)

```
Quick Actions Bar (üstte):
- Şablon yükle (sık kullanılan notlar)
- Ses kaydı (voice-to-text)
- Hızlı kod (ICD-10, diş tedavi kodları)
- Reçete yaz
- Fotoğraf çek

Sections:
1. Şikayet & Hikaye (auto-complete)
2. Vital signs (opsiyonel)
3. Dental chart (interactive)
4. Klinik muayene bulguları
5. Tanı (multi-select + search)
6. Tedavi planı
7. Reçete
8. Sonraki kontrol tarihi
9. Onam formları
10. Fotoğraf/Röntgen ekleme

Features:
- Otomatik kaydetme (her 30 saniye)
- Şablon sistemi
- Kopyala (önceki muayeneden)
- Yazdır (muayene raporu)
```

#### B2. Tedavi Planı Oluşturma

```
UI:
- Planlanan tedaviler tablosu
- Drag & drop önceliklendirme
- Her tedavi için:
  * Tedavi adı
  * Diş no
  * Seans sayısı
  * Tahmini süre
  * Tahmini maliyet
  * Aciliyet seviyesi
  * Notlar

- Tedavi sıralama (bağımlılıklar)
- Tahmini toplam süre
- Tahmini toplam maliyet
- "Planı Onayla" butonu
- "Hastaya Göster" (PDF export)
```

---

### 🦷 C. Dental Chart (Diş Şeması)

#### C1. Interactive Dental Chart

```
Features:
- FDI Tooth Numbering System
- 32 diş (yetişkin)
- Her diş için:
  * Mevcut durum göstergesi
  * Tıkla → detay popup
  * Sağ tık → hızlı işlem menüsü

Tooth Status Icons:
- Sağlam (beyaz diş ikonu)
- Dolgulu (mavi işaret)
- Kanal tedavili (kırmızı işaret)
- Çekilmiş (boş alan)
- Çürük (sarı işaret)
- İmplant (gri metal işaret)
- Kron (turuncu taç ikonu)
- Ortodontik braket

Actions:
- İşlem ekle
- İşlem geçmişi görüntüle
- Fotoğraf ekle
- Röntgen ekle
- Notlar
```

#### C2. Diş Detay Popup

```
Components:
- Diş numarası & adı
- Mevcut durum
- Yapılan işlemler (timeline)
  * Tarih
  * İşlem adı
  * Doktor
  * Notlar
  * Fotoğraflar

- "Yeni İşlem Ekle" form:
  * İşlem türü dropdown
  * Tarih
  * Notlar
  * Malzeme kullanımı
  * Kaydet

- Fotoğraf galerisi
- Röntgen galerisi
```

#### C3. Treatment Progress (Tedavi İlerlemesi)

```
UI:
- Planlanan tedaviler listesi
- Her tedavi için progress bar
- Tamamlanan seanslar
- Sonraki seans tarihi
- Genel tamamlanma oranı
```

---

### 📋 D. Hasta Geçmişi (Doktor Perspektifi)

#### D1. Hasta Özeti

```
Quick Info Card:
- Temel bilgiler
- Alerjiler (highlight)
- Kronik hastalıklar
- İlaçlar
- Son muayene
- Aktif tedavi planı
```

#### D2. Tedavi Timeline

```
Features:
- Kronolojik sıralama
- Filtreleme (tedavi türü, tarih)
- Her kayıt için:
  * Tarih
  * Tedavi türü
  * Diş no
  * Doktor
  * Notlar özeti
  * Detay butonu

- Collapse/Expand
- Yazdır seçeneği
```

#### D3. Dental History Chart

```
UI:
- Tüm dişlerin geçmiş durumu
- Zaman çizelgesi (slider)
- Değişiklikleri animasyon ile göster
- "O zamana git" özelliği
```

---

### 🧑‍⚕️ E. Doktor Profil & Ayarları

#### E1. Profil Bilgileri

```
Sections:
- Kişisel Bilgiler
  * Fotoğraf
  * Ad Soyad
  * Uzmanlık
  * Diploma No
  * İletişim

- Mesleki Bilgiler
  * Mezuniyet
  * Sertifikalar
  * Deneyim
  * Biyografi

- Düzenle butonu
```

#### E2. Çalışma Saatleri Yönetimi

```
UI:
- Şube bazlı çalışma takvimi
- Her şube için:
  * Çalışma günleri (checkbox)
  * Başlangıç saati
  * Bitiş saati
  * Öğle molası

- İzin/Tatil ekleme
- Tekrarlayan izinler
- "Kaydet" butonu
```

#### E3. Muayene Ayarları

```
Options:
- Varsayılan muayene süresi
- Otomatik şablon yükleme
- Ses kaydı kullan
- Fotoğraf kalitesi
- Bildirim tercihleri
```

---

## 🟥 ADMIN PANELİ

### 👥 A. Kullanıcı Yönetimi

#### A1. Kullanıcı Listesi

```
Features:
- Tablo görünümü
- Filtreleme (rol, şube, durum)
- Arama
- Bulk işlemler
- Kolonlar:
  * Kullanıcı adı
  * Ad Soyad
  * Rol
  * Şube(ler)
  * Email
  * Son giriş
  * Durum
  * İşlemler
```

#### A2. Kullanıcı Ekle/Düzenle

```
Form:
- Kullanıcı Bilgileri
  * Kullanıcı adı
  * Şifre
  * Email
  * Telefon

- Rol Seçimi (radio)
  * Admin
  * Doctor
  * Receptionist
  * Nurse

- Şube Ataması (multi-select)
  * Birincil şube
  * Diğer şubeler

- Yetkiler (checkbox tree)
  * Modül bazlı
  * İşlem bazlı

- Durum (aktif/pasif toggle)
```

#### A3. Doktor Yönetimi (Admin)

```
Features:
- Doktor listesi
- Her doktor için:
  * Temel bilgiler
  * Uzmanlık ataması
  * Şube atamaları
  * Çalışma saatleri
  * Randevu limitleri
  * Ücret/Fiyatlandırma ayarları

- Bulk atama işlemleri
```

---

### 🏥 B. Şube Yönetimi

#### B1. Şube Listesi

```
Features:
- Şube kartları (grid view)
- Her kart:
  * Şube adı
  * Şube kodu
  * Şehir
  * Telefon
  * Aktif doktor sayısı
  * Bugünkü randevu
  * Aylık ciro
  * Durum badge

- "Yeni Şube Ekle" butonu
```

#### B2. Şube Detay/Düzenle

```
Tabs:
1. Genel Bilgiler
   - Şube adı
   - Kod
   - Tip (Merkez/Şube)
   - Başhekim
   - Adres
   - İletişim
   - Çalışma saatleri (JSON)

2. Personel
   - Şubedeki doktorlar (table)
   - Şubedeki staff (table)
   - Atama/Çıkarma işlemleri

3. Odalar
   - Oda listesi
   - Oda ekleme/düzenleme
   - Oda tipi (Muayene, Röntgen, Sterilizasyon)

4. İstatistikler
   - Aylık randevu sayısı
   - Doktor başı performans
   - Ciro grafiği
   - Hasta memnuniyeti
```

---

### 📊 C. Raporlama & İstatistikler

#### C1. Dashboard (Ana Sayfa)

```
Widgets:
1. Genel Özet Kartları
   - Toplam hasta sayısı
   - Aktif doktor sayısı
   - Bugünkü randevu
   - Aylık ciro

2. Grafikler
   - Aylık ciro trendi (line chart)
   - Tedavi türü dağılımı (pie chart)
   - Şube bazlı performans (bar chart)
   - Doktor başı hasta sayısı (bar chart)

3. Güncel Veriler
   - Son kayıtlı hastalar
   - Bekleyen ödemeler
   - Bugünkü randevu durumu
   - Sistem bildirimleri
```

#### C2. Finansal Raporlar

```
Reports:
- Gelir-Gider Raporu
- Doktor Bazlı Ciro
- Tedavi Türü Bazlı Gelir
- Sigorta Tahsilatları
- Bekleyen Ödemeler
- Günlük Kasa Raporu

Filters:
- Tarih aralığı
- Şube
- Doktor
- Tedavi türü

Export:
- PDF
- Excel
- CSV
```

#### C3. Operasyonel Raporlar

```
Reports:
- Randevu Analizi
  * Toplam randevu
  * İptal oranı
  * No-show oranı
  * Ortalama bekleme süresi

- Doktor Performans
  * Hasta sayısı
  * Tedavi sayısı
  * Ortalama tedavi süresi
  * Hasta memnuniyeti

- Klinik Verimliliği
  * Oda kullanım oranı
  * Günlük hasta kapasitesi
  * Çalışma saati kullanımı
```

#### C4. Hasta Analitiği

```
Reports:
- Hasta Demografisi
  * Yaş dağılımı
  * Cinsiyet dağılımı
  * İl/İlçe dağılımı

- Hasta Davranışı
  * Yeni hasta / Mevcut hasta oranı
  * Tekrar ziyaret oranı
  * Ortalama tedavi süresi

- Tedavi Tercihleri
  * En çok tercih edilen tedaviler
  * Uzmanlık bazlı dağılım
```

---

## 🟨 HASTA PORTALI (Opsiyonel)

### 📱 A. Hasta Ana Sayfa

```
Components:
- Hoş geldin mesajı
- Yaklaşan randevular (timeline)
- Hızlı işlemler:
  * Randevu Al
  * Randevularım
  * Tedavi Geçmişim
  * Faturalarım
  * Belgelerim
```

### 🗓️ B. Online Randevu Alma

```
Steps:
1. Şube seçimi
2. Uzmanlık/Tedavi türü seçimi
3. Doktor seçimi (fotoğraf, bio, değerlendirmeler)
4. Müsait tarih & saat seçimi
5. Notlar
6. Onay
7. Onay email/SMS
```

### 📋 C. Hasta Profil & Belgeler

```
Sections:
- Kişisel Bilgiler (düzenleme)
- Sağlık Bilgileri (readonly)
- Randevu Geçmişi
- Tedavi Geçmişi
- Faturalar
- Belgelerim (röntgen, raporlar)
- İletişim Tercihleri
```

---

## 🛠️ TEKNİK DETAYLAR & COMPONENT'LER

### 🎨 UI Components Library

#### Temel Componentler

```
- Button (variants: primary, secondary, danger, ghost)
- Input (text, number, tel, email, date)
- Select (single, multi, autocomplete)
- Checkbox
- Radio
- Toggle/Switch
- Textarea
- DatePicker (single, range)
- TimePicker
- FileUpload (drag & drop)
- Avatar
- Badge
- Card
- Modal
- Drawer (sidebar)
- Tabs
- Accordion
- Breadcrumb
- Pagination
- Table (sortable, filterable)
- Toast/Notification
- Loading (spinner, skeleton)
- ProgressBar
- Tooltip
```

#### Özel Componentler

```
- Calendar (weekly, monthly, drag & drop)
- DentalChart (interactive tooth chart)
- Timeline (vertical, horizontal)
- RichTextEditor (WYSIWYG)
- SignaturePad (canvas imza)
- ImageViewer (lightbox, zoom, rotate)
- Chart (line, bar, pie, doughnut)
- StatCard (dashboard widgets)
- SearchableSelect (hasta, doktor arama)
- QueueCard (bekleme listesi kartı)
- AppointmentCard (randevu kartı)
- PatientCard (hasta bilgi kartı)
```

### 📐 Layout Structure

```
Desktop Layout:
┌─────────────────────────────────────┐
│           TopBar (Navbar)           │
├─────┬───────────────────────────────┤
│     │                               │
│ S   │        Main Content          │
│ i   │                               │
│ d   │                               │
│ e   │                               │
│ b   │                               │
│ a   │                               │
│ r   │                               │
│     │                               │
└─────┴───────────────────────────────┘

TopBar:
- Logo
- Şube seçici (multi-branch)
- Search bar (global)
- Notifications
- User menu

Sidebar:
- Role-based menu items
- Collapse/Expand
- Active state indicator
```

### 🎭 Role-Based Views

```javascript
// Menu items by role
const menuByRole = {
  admin: [
    "Dashboard",
    "Branches",
    "Users",
    "Doctors",
    "Staff",
    "Patients",
    "Appointments",
    "Medical Records",
    "Billing",
    "Reports",
    "Settings",
  ],

  receptionist: [
    "Dashboard",
    "Appointments",
    "Patients",
    "Queue",
    "Billing",
    "Clinical Status",
  ],

  doctor: [
    "My Schedule",
    "My Patients",
    "Examinations",
    "Dental Charts",
    "Profile",
    "Settings",
  ],

  nurse: ["Queue", "Patient Prep", "Clinical Support", "Inventory"],
};
```

---

## 📋 IMPLEMENTASYON SIRASI

### PHASE 1: Temel Altyapı (1-2 hafta)

```
✅ Backend API'ler hazır
☐ Frontend project setup (React + Vite + TailwindCSS)
☐ Auth sistem (Login, Role-based routing)
☐ Layout structure (Sidebar, TopBar, Main)
☐ Temel UI components
☐ API integration (Axios setup)
☐ State management (Context API / Zustand)
```

### PHASE 2: Staff Paneli - Randevu Modülü (2-3 hafta)

```
☐ Randevu takvimi (haftalık view)
☐ Randevu oluşturma formu
☐ Randevu detay sayfası
☐ Randevu durumu yönetimi
☐ Doktor & şube filtreleme
☐ Çakışma kontrolü
☐ SMS/Email bildirimleri (backend)
```

### PHASE 3: Staff Paneli - Hasta Yönetimi (1-2 hafta)

```
☐ Hasta listesi
☐ Yeni hasta kaydı
☐ Hasta detay sayfası
☐ Hasta arama & filtreleme
☐ Hasta dosyası yazdırma
```

### PHASE 4: Staff Paneli - Fatura & Ödeme (1-2 hafta)

```
☐ Fatura listesi
☐ Yeni fatura oluşturma
☐ Tahsilat ekranı
☐ Fatura yazdırma
☐ Ödeme geçmişi
```

### PHASE 5: Staff Paneli - Klinik Yönetimi (1 hafta)

```
☐ Bekleme listesi (queue)
☐ Oda durumu
☐ Günlük dashboard
```

### PHASE 6: Doktor Paneli - Temel (2 hafta)

```
☐ Doktor takvimi
☐ Muayene formu
☐ Hasta geçmişi görüntüleme
☐ Reçete yazma
```

### PHASE 7: Doktor Paneli - Dental Chart (2-3 hafta)

```
☐ Interactive dental chart component
☐ Diş detay popup
☐ İşlem ekleme
☐ Tedavi planı
☐ Fotoğraf/Röntgen galerisi
```

### PHASE 8: Admin Paneli (1-2 hafta)

```
☐ Dashboard
☐ Kullanıcı yönetimi
☐ Şube yönetimi
☐ Raporlama
```

### PHASE 9: Optimizasyon & Polish (1-2 hafta)

```
☐ Performance optimization
☐ Mobile responsiveness
☐ Error handling
☐ Loading states
☐ Form validations
☐ Accessibility
☐ Testing
```

### PHASE 10: Hasta Portalı (Opsiyonel)

```
☐ Hasta girişi
☐ Online randevu
☐ Tedavi geçmişi
☐ Belgeler
```

---

## 📌 KRİTİK NOTLAR

### Performans

- Lazy loading (route-based)
- Image optimization
- Pagination (25-50 items per page)
- Virtual scrolling (büyük listeler için)
- Debounce (arama inputları)
- React.memo (gereksiz re-render'ları önle)

### Güvenlik

- JWT authentication
- Role-based access control
- HTTPS
- XSS protection
- SQL injection prevention (backend)
- GDPR compliance (hasta verileri)

### UX

- Loading states (skeleton screens)
- Error messages (user-friendly)
- Success feedback (toasts)
- Keyboard shortcuts
- Auto-save (formlar için)
- Confirmation dialogs (destructive actions)
- Empty states (boş listeler için)

### Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast (WCAG 2.1)
- Focus indicators

### Mobile

- Responsive design (mobile-first)
- Touch-friendly (button sizes)
- Bottom navigation (mobilde)
- Swipe gestures

---

Bu şema ile **Staff Paneli** öncelikli olarak, adım adım implement edebiliriz. İlk başlayacağımız modül: **Randevu Yönetimi** olabilir. Hazır mısın? 🚀
