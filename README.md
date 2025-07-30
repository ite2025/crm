# Workflow365 CRM - Aplikacja z Funkcją Wyszukiwania

## 🔍 Nowe Funkcjonalności v2.0

### ✅ Naprawione Problemy Logowania
- **Przycisk "Zaloguj" jest teraz wyraźnie widoczny** i w pełni funkcjonalny
- **Usunięto podpowiedzi** z danymi testowymi z interfejsu logowania
- **Zachowano funkcjonalność** autoryzacji z trzema kontami testowymi

### 🆕 Funkcja Wyszukiwania
- **Live search w czasie rzeczywistym** - wyniki pojawiają się podczas pisania
- **Wyszukiwanie firm** po nazwie, NIP, lokalizacji
- **Wyszukiwanie opiekunów** po imieniu, nazwisku, regionie
- **Podświetlanie wyników** na mapie relacji
- **Automatyczne ukrywanie** niepassujących elementów

## 🚀 Funkcjonalności

### Główne Cechy
- ✅ **System logowania** z trzema poziomami dostępu
- ✅ **Glass morphism design** bez cieni na tekstach
- ✅ **Logo Workflow365** (bez napisu "Mapa relacji CRM")
- ✅ **Interaktywna mapa relacji** z rozwijaniem bezpośrednich powiązań
- ✅ **Kolorowe rozróżnienie** opiekunów (handlowi: niebieski Facebook, wdrożeniowi: pomarańczowy)
- ✅ **Import danych z Excel** z szablonem
- ✅ **Panel szczegółów** i statystyki na żywo
- ✅ **Responsive design** dla urządzeń mobilnych

### Dane Firmowe
- **NIP** - Numer identyfikacji podatkowej
- **Wartość obrotu z ITE** - Roczne obroty w PLN
- **Automatyczne kalkulacje** sum obrotów

### Automatyczne Kalkulacje dla Opiekunów
- **Ilość przypisanych firm** - liczona automatycznie
- **Suma obrotu obsługiwanych firm** - sumowana z wszystkich firm

## 🔐 Dane Testowe

Po wdrożeniu dostępne konta:
- **Administrator**: `admin@ite.pl` / `admin123`
- **Manager**: `manager@ite.pl` / `manager123`
- **Użytkownik**: `user@ite.pl` / `user123`

## 📊 Struktura Danych

### Firmy
- ID, Nazwa, NIP, Branża, Lokalizacja, Wielkość, Status, Wartość_obrotu_ITE

### Opiekunowie
- ID, Imię, Nazwisko, Typ_opiekuna, Region, Doświadczenie, Email, Specjalizacja

### Powiązania
- ID_Firmy, ID_Opiekuna, Typ_opiekuna

## 🛠️ Instalacja i Wdrożenie

### Wymagania
- **Node.js 18+** (https://nodejs.org)
- **Konto GitHub** (darmowe)
- **Konto Vercel** (darmowe)

### Krok po Kroki - Vercel
1. **Skopiuj pliki** projektu do folderu
2. **Utwórz repozytorium** na GitHub
3. **Zaloguj się na Vercel.com** przez GitHub
4. **Import Project** → wybierz repozytorium
5. **Framework Preset**: "Other"
6. **Output Directory**: `.` (kropka)
7. **Deploy!**

### Lokalne Uruchomienie
```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Build do produkcji
npm run build
```

## 📁 Struktura Projektu

```
workflow365-crm/
├── index.html                               # Główna aplikacja
├── style.css                               # Style z glass morphism
├── app.js                                  # Logika + wyszukiwanie
├── package.json                            # Konfiguracja npm
├── vercel.json                             # Konfiguracja Vercel
├── vite.config.js                          # Konfiguracja build
├── workflow365_crm_szablon_z_wyszukiwaniem.xlsx # Szablon Excel
└── README.md                               # Ta dokumentacja
```

## 🔍 Użycie Wyszukiwania

### Przykłady Zapytań
- `"IT Excellence"` → znajdzie firmę IT Excellence
- `"1234567890"` → znajdzie firmę o tym NIP
- `"Wrocław"` → pokaże wszystkie firmy z Wrocławia
- `"Jan"` → znajdzie opiekuna Jan Kowalski  
- `"Kowalski"` → znajdzie opiekuna o tym nazwisku
- `"Południe"` → pokaże opiekunów z regionu Południe

### Działanie
1. **Wpisz tekst** w pole wyszukiwania
2. **Wyniki pojawiają się** natychmiast podczas pisania
3. **Passujące elementy** są podświetlone na mapie
4. **Niepassujące elementy** są przyciemnione
5. **Kliknij na wynik** aby zobaczyć szczegóły

## 🎨 Design

### Kolory
- **Opiekunowie handlowi**: #1877F2 (niebieski Facebook)
- **Opiekunowie wdrożeniowi**: #F59E0B (pomarańczowy)
- **Firmy**: #3B82F6 (niebieski standardowy)

### Efekty
- **Glass morphism** z przezroczystością i blur
- **Smooth animations** przy interakcjach
- **Responsive layout** dla urządzeń mobilnych
- **Accessibility** - dostępność dla użytkowników

## 🐛 Rozwiązywanie Problemów

### Problem: Nie mogę się zalogować
✅ **Rozwiązanie**: Sprawdź czy używasz poprawnych danych (admin@ite.pl / admin123)

### Problem: Wyszukiwanie nie działa
✅ **Rozwiązanie**: Upewnij się że dane w Excel zawierają nazwy firm i imiona opiekunów

### Problem: Excel nie wczytuje się
✅ **Rozwiązanie**: Użyj przygotowanego szablonu i zachowaj strukturę arkuszy

### Problem: Aplikacja nie działa na Vercel
✅ **Rozwiązanie**: Sprawdź czy Output Directory jest ustawiony na `.` (kropka)

## 📞 Wsparcie

**Autor**: Łukasz Dobrowolski  
**Firma**: IT Excellence S.A.  
**Email**: lukasz@ite.pl  
**Data**: 30 lipca 2025  
**Wersja**: 2.0

## 📄 Licencja

MIT License - możesz swobodnie używać, modyfikować i dystrybuować.

---

**🚀 Twoja aplikacja CRM z wyszukiwaniem jest gotowa do wdrożenia!**
