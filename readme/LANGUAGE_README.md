# Çeviri ekleme düzenleme

- Bir projeye admin paneli üzerinden çeviri eklendiğinde o çeviriyi 'src/language-data' klasörü altında ilgili klasörün altında bulunan ilgili dile eklemek gerekiyor.
- Canlıya çıkıldığında JSON'dan çeviri ekle diyerek uygulama içindeki çeviriler canlıya admin panelinden eklenmeli.

## Tek çeviri girme

1. Admin panelinde Dil Yönetimi sayfasına gidin.
2. İlgili dil tablosunu seçin. (Ör: AbpUiNavigation)
3. Yeni Çeviri butonuna tıklayın.
4. Key alanına çeviriyi ifade eden bir açıklama yazın.
5. English Translation kısmına o key'e karşılık gelen İngilizce çeviriyi girin.
6. Target Translation kısmına o key'e karşılık gelen hedef dile çeviriyi girin. (Uygulamanın aktif dili hangi dil ise oraya ekler.)
7. Çevirinin hangi uygulamalara girileceğini seçin.
8. 'src/language-data/AbpUiNavigation/resources/AbpUiNavigation/en.json' dosyasına girdiğiniz key'i ve karşılık gelen ingilizce çevirisini ekleyin.
9. 'src/language-data/AbpUiNavigation/resources/AbpUiNavigation/tr.json' dosyasına girdiğiniz key'i ve karşılık gelen türkçe çevirisini ekleyin.
10. 'src/language-data/AbpUiNavigation/resources/AbpUiNavigation' dizininde bulunan dosyaya çevirilerinizi ekleyin. Örneğin 'src/language-data/AbpUiNavigation/resources/AbpUiNavigation/navbar.ts' dosyasında getLanguageData fonksiyonunun içine.

PR Example:https://github.com/ayasofyazilim-clomerce/ayasofyazilim-core-project/pull/514

## JSON'dan çeviri girme

1. 'src/language-data/AbpUiNavigation/resources/AbpUiNavigation/en.json' dosyasına bir key ve karşılık gelen ingilizce çevirisini ekleyin.
2. 'src/language-data/AbpUiNavigation/resources/AbpUiNavigation/tr.json' dosyasına bir key ve karşılık gelen türkçe çevirisini ekleyin.
3. Admin panelinde Dil Yönetimi sayfasına gidin.
4. İlgili dil tablosunu seçin. (Ör: AbpUiNavigation)
5. JSON'dan Çeviri Ekle'ye tıklayın.
6. Key alanına herhangi bir şey yazabilirsiniz, kullanılmıyor.
7. English Translation kısmına 'src/language-data/AbpUiNavigation/resources/AbpUiNavigation/en.json' dosyasının içini kopyalayın.
8. Target Translation kısmına 'src/language-data/AbpUiNavigation/resources/AbpUiNavigation/tr.json' dosyasının içini kopyalayın.
9. Çevirinin hangi uygulamalara girileceğini seçin.
10. Çevirilerin gönderilmesini bekleyin. (Uzun sürüyor)
