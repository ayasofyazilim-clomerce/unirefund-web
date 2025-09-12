# Tag Details Components

Bu klasör, Tag Details sayfasının component'lerini içerir. Kod okunabilirliğini artırmak ve maintainability'yi geliştirmek için ana client.tsx dosyası küçük, odaklanmış component'lere bölünmüştür.

## Dosya Yapısı

```
components/
├── index.ts                        # Tüm component'lerin export edildiği dosya
├── types.ts                        # TypeScript type definition'ları
├── status-badge.tsx                 # Status gösterimi için badge component'i
├── page-header.tsx                  # Sayfa başlığı component'i
├── tag-information-card.tsx         # Tag bilgilerini gösteren kart
├── merchant-information-card.tsx    # Merchant bilgilerini gösteren kart
├── traveller-information-card.tsx   # Traveller bilgilerini gösteren kart
└── invoice-summary-card.tsx         # Invoice özet bilgilerini gösteren kart
```

## Component'ler

### StatusBadge

- Status'a göre uygun renk ve ikon gösterir
- Merkezi status logic'i içerir
- Yeniden kullanılabilir

### PageHeader

- Sayfa başlığını ve açıklamasını gösterir
- Tag numarasını highlight eder

### TagInformationCard

- Tag numarası, issue date ve status bilgilerini gösterir
- StatusBadge component'ini kullanır

### MerchantInformationCard

- Merchant bilgilerini gösterir
- Adres bilgilerini formatting ile gösterir

### TravellerInformationCard

- Traveller bilgilerini grid layout'ta gösterir
- Passport ve nationality bilgilerini ikon ile destekler

### InvoiceSummaryCard

- Invoice özet bilgilerini gösterir
- Action button'larını içerir
- Currency formatting logic'ini içerir

## Faydalar

1. **Kod Okunabilirliği**: Her component tek bir sorumluluğa odaklanır
2. **Maintainability**: Değişiklikler ilgili component'te yapılır
3. **Reusability**: Component'ler başka yerlerde kullanılabilir
4. **Testing**: Her component ayrı ayrı test edilebilir
5. **Type Safety**: TypeScript ile güçlü type checking

## Kullanım

```tsx
import {
  PageHeader,
  TagInformationCard,
  MerchantInformationCard,
  TravellerInformationCard,
  InvoiceSummaryCard
} from "../components";

// Component'leri kullan
<PageHeader tagNumber={tagNumber} />
<TagInformationCard
  tagNumber={tagNumber}
  issueDate={issueDate}
  status={status}
/>
```

## Gelecek Geliştirmeler

- [ ] Loading state'leri eklenebilir
- [ ] Error handling component'leri eklenebilir
- [ ] Animation/transition'lar geliştirilebilir
- [ ] Accessibility özellikleri artırılabilir
