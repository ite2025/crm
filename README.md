# Workflow365 CRM

System zarządzania relacjami z klientami z interaktywną mapą powiązań między firmami a opiekunami handlowymi/wdrożeniowymi.

## Funkcjonalności

- 🔐 **System logowania** - bezpieczna autoryzacja użytkowników
- 🗺️ **Mapa relacji** - wizualizacja powiązań firm z opiekunami
- 👥 **Zarządzanie opiekunami** - handlowi (niebieski) i wdrożeniowi (pomarańczowy)
- 📊 **Statystyki na żywo** - automatyczne aktualizowanie danych
- 📱 **Responsive design** - działa na wszystkich urządzeniach
- 💎 **Glass morphism** - nowoczesny design
- 📁 **Import Excel** - wczytywanie danych z plików Excel

## Dane testowe

### Logowanie:
- **Admin**: admin@ite.pl / admin123
- **Manager**: manager@ite.pl / manager123  
- **User**: user@ite.pl / user123

## Instalacja i uruchomienie

### Lokalne uruchomienie:
```bash
npm install
npm run dev
```

### Build produkcyjny:
```bash
npm run build
npm run preview
```

### Wdrożenie na Vercel:
```bash
npm install -g vercel
vercel --prod
```

## Technologie

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Wizualizacja**: D3.js v7
- **Import danych**: SheetJS (xlsx)
- **Build tool**: Vite
- **Hosting**: Vercel

## Struktura projektu

```
workflow365-crm/
├── index.html          # Główny plik HTML
├── style.css           # Style aplikacji
├── app.js              # Logika aplikacji
├── package.json        # Konfiguracja npm
├── vercel.json         # Konfiguracja Vercel
├── vite.config.js      # Konfiguracja Vite
└── README.md           # Dokumentacja
```

## Autor

IT Excellence S.A. - Łukasz Dobrowolski
