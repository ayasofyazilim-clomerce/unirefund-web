# Layout oluşturma

- Sayfalarda scroll çıkma problemlerini önlemek ve belirli bir düzende oluşturmak için aşağıdaki şeylere dikkat edilmeli.

```html
<!-- Ekran boyutundan 104px (ekran yüksekliği navbar'ın yüksekliği kadar azaltılmış) yüksekliğinde sayfa içeriği boyutumuz var. -->
<div className="mt-5 mx-10 h-[calc(100vh-164px)]">
  <!-- children -->
</div>
```

Bir elemanlı örnek:

```html
<!-- Sayfada tek bir eleman olacaksa kalan boşluğu doldurması için bu elemana h-full ve overflow-hidden eklemeliyiz. -->
<div className="h-full overflow-hidden">
  <!-- Herhangi bir eleman -->
  <div></div>

  <!-- Kaydırılması gerekebilecek olan eleman -->
  <div className="overflow-auto"></div>
</div>
```

Birden fazla eleman bulunan örnek:

```html
<!-- Sayfada birden fazla eleman olacaksa bu elemanları bir parent div'e almalı ve aşağıdaki class'ları vermeliyiz. -->
<div className="flex flex-col gap-2 h-full">
  <!-- Herhangi bir eleman -->
  <div>...</div>

  <!-- Boşluğu dolduracak olan  eleman -->
  <div className="h-full overflow-hidden">
    <!-- Herhangi bir eleman -->
    <div></div>

    <!-- Kaydırılması gerekebilecek olan eleman -->
    <div className="overflow-auto"></div>
  </div>
</div>
```
