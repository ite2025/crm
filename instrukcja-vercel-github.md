# Szczegółowa Instrukcja Wdrożenia Aplikacji na Vercel przez GitHub - Krok po Kroku

## Spis Treści
1. [Przygotowanie wstępne](#przygotowanie-wstępne)
2. [Konfiguracja GitHub](#konfiguracja-github)
3. [Konfiguracja konta Vercel](#konfiguracja-konta-vercel)
4. [Wdrożenie aplikacji](#wdrożenie-aplikacji)
5. [Konfiguracja zaawansowana](#konfiguracja-zaawansowana)
6. [Rozwiązywanie problemów](#rozwiązywanie-problemów)
7. [Zarządzanie domeną](#zarządzanie-domeną)

---

## Przygotowanie wstępne

### Co będziesz potrzebować:
- **Konto GitHub** (darmowe)
- **Aplikacja Workflow365 CRM** - wszystkie pliki projektu
- **Komputer z przeglądarką internetową**
- **Połączenie z internetem**

### Struktura plików aplikacji CRM:
```
workflow365-crm/
├── index.html                    # Główny plik aplikacji
├── style.css                     # Style z glass morphism
├── app.js                        # Logika + system logowania
├── package.json                  # Konfiguracja npm
├── vercel.json                   # Konfiguracja Vercel
├── workflow365_crm_szablon.xlsx  # Szablon Excel
└── README.md                     # Dokumentacja
```

---

## Konfiguracja GitHub

### Krok 1: Stworzenie repozytorium
1. **Zaloguj się na GitHub.com**
2. **Kliknij zielony przycisk "New"** w lewym górnym rogu lub ikonę "+" w prawym górnym rogu
3. **Wybierz "New repository"**

### Krok 2: Konfiguracja repozytorium
1. **Repository name**: `workflow365-crm` (lub dowolna nazwa)
2. **Description**: `Aplikacja CRM z mapą relacji firm i opiekunów`
3. **Visibility**: 
   - **Public** - widoczne publicznie (zalecane dla projektów demo)
   - **Private** - tylko dla Ciebie (wymaga płatnego planu Vercel dla zespołów)
4. **Initialize repository**:
   - ✅ **Add a README file**
   - ✅ **Add .gitignore** → wybierz "Node"
   - ❌ **Choose a license** (opcjonalne)
5. **Kliknij "Create repository"**

### Krok 3: Upload plików aplikacji
**Opcja A: Przez interfejs webowy (łatwiejsze dla początkujących)**
1. **Kliknij "uploading an existing file"** w głównym widoku repozytorium
2. **Przeciągnij wszystkie pliki aplikacji** do okna przeglądarki lub kliknij "choose your files"
3. **Wybierz wszystkie pliki**:
   - `index.html`
   - `style.css`
   - `app.js`
   - `package.json`
   - `vercel.json`
   - `workflow365_crm_szablon.xlsx`
4. **Dodaj commit message**: `"Initial commit - Workflow365 CRM app"`
5. **Kliknij "Commit changes"**

**Opcja B: Przez Git w terminalu (dla zaawansowanych)**
```bash
# Sklonuj repozytorium
git clone https://github.com/TwojeNazwaUzytkownika/workflow365-crm.git
cd workflow365-crm

# Skopiuj pliki aplikacji do folderu
# Dodaj pliki do Git
git add .
git commit -m "Initial commit - Workflow365 CRM app"
git push origin main
```

---

## Konfiguracja konta Vercel

### Krok 1: Rejestracja na Vercel
1. **Idź na vercel.com**
2. **Kliknij "Continue with GitHub"** (najlepsza opcja)
3. **Zaloguj się swoim kontem GitHub**
4. **Autoryzuj Vercel** - kliknij "Authorize Vercel"

### Krok 2: Wybór planu
1. **Hobby Plan** - **DARMOWY** (wystarczający dla Twojej aplikacji)
   - Unlimited personal projects
   - 100GB bandwidth
   - Automatic HTTPS
   - CI/CD integration
2. **Kliknij "Continue with Hobby"**

### Krok 3: Potwierdzenie konta
1. **Wprowadź swoje imię** (jeśli nie zostało automatycznie pobrane z GitHub)
2. **Kliknij "Continue"**
3. **Jeśli zostaniesz poproszony o weryfikację email** - sprawdź swoją skrzynkę pocztową

---

## Wdrożenie aplikacji

### Krok 1: Import projektu z GitHub
1. **W dashboard Vercel kliknij "Add New..."** (przycisk z plusem w prawym górnym rogu)
2. **Wybierz "Project"**
3. **W sekcji "Import Git Repository"** znajdziesz listę swoich repozytoriów GitHub
4. **Znajdź "workflow365-crm"** (lub nazwę którą nadałeś)
5. **Kliknij "Import"**

### Krok 2: Konfiguracja projektu
**Kluczowe ustawienia dla aplikacji CRM:**

#### Project Name:
- **Zostaw domyślną nazwę** lub zmień na `workflow365-crm-[twoja-nazwa]`

#### Framework Preset:
- **Wybierz "Other"** (ponieważ to aplikacja HTML/CSS/JS)

#### Build and Output Settings:
**⚠️ WAŻNE - Kliknij "Override" i ustaw:**
- **Build Command**: pozostaw puste
- **Output Directory**: `.` (kropka - oznacza główny folder)
- **Install Command**: pozostaw puste
- **Development Command**: pozostaw puste

#### Environment Variables:
- **Dla aplikacji CRM nie są wymagane** - pomiń tę sekcję

### Krok 3: Deploy!
1. **Sprawdź wszystkie ustawienia**
2. **Kliknij duży niebieski przycisk "Deploy"**
3. **Poczekaj 1-3 minuty** - zobaczysz progress build'a

### Krok 4: Gratulacje! 🎉
Po zakończeniu wdrożenia zobaczysz:
- **Zielony checkmark**
- **Preview aplikacji**
- **Link do Twojej aplikacji** (np. `workflow365-crm-abc123.vercel.app`)

---

## Konfiguracja zaawansowana

### Plik vercel.json dla aplikacji CRM
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Plik package.json (minimalny)
```json
{
  "name": "workflow365-crm",
  "version": "1.0.0",
  "description": "Aplikacja CRM z mapą relacji firm i opiekunów",
  "main": "index.html",
  "scripts": {
    "start": "http-server",
    "dev": "http-server -p 3000"
  },
  "dependencies": {},
  "devDependencies": {
    "http-server": "^14.1.1"
  }
}
```

---

## Rozwiązywanie problemów

### Problem: "Build failed"
**Rozwiązanie:**
1. **Sprawdź struktura plików** - `index.html` musi być w głównym folderze
2. **Sprawdź Output Directory** - ustaw na `.` (kropka)
3. **Usuń niepotrzebne Build Commands**

### Problem: "404 - Not Found"
**Rozwiązanie:**
1. **Sprawdź czy masz plik `index.html`** w głównym folderze
2. **Dodaj plik `vercel.json`** z rewrites (patrz powyżej)

### Problem: "Access Denied" lub "Git author must have access"
**Rozwiązanie:**
1. **Upewnij się że jesteś właścicielem repozytorium** na GitHub
2. **Sprawdź uprawnienia Vercel** w GitHub Settings → Applications
3. **Reconnect GitHub** w ustawieniach Vercel

### Problem: Aplikacja nie działa prawidłowo
**Rozwiązanie:**
1. **Sprawdź Console w przeglądarce** (F12)
2. **Upewnij się że wszystkie pliki zostały wgrane** (CSS, JS, Excel template)
3. **Sprawdź czy ścieżki do plików są poprawne**

---

## Zarządzanie domeną

### Twoja darmowa domena Vercel
Po wdrożeniu otrzymasz automatyczną domenę typu:
- `workflow365-crm-abc123.vercel.app`
- Działa natychmiast z HTTPS
- Idealny do testów i demonstracji

### Dodanie własnej domeny (opcjonalne)
1. **W Vercel dashboard** → **Projects** → **Twój projekt**
2. **Settings** → **Domains**
3. **Add Domain** → wpisz swoją domenę
4. **Skonfiguruj DNS** zgodnie z instrukcjami Vercel

---

## Automatyczne wdrożenia

### Co się dzieje po wdrożeniu:
✅ **Każda zmiana w GitHub** automatycznie wyzwala nowe wdrożenie  
✅ **Preview deployments** dla wszystkich branch'y  
✅ **Production deployment** dla branch'a `main`  
✅ **Rollback** - możliwość powrotu do poprzedniej wersji  

### Jak aktualizować aplikację:
1. **Wprowadź zmiany w kodzie lokalnie**
2. **Upload nowych plików na GitHub** (przez interfejs lub Git)
3. **Vercel automatycznie wykryje zmiany** i wdroży nową wersję
4. **Sprawdź status** w dashboard Vercel

---

## Podsumowanie

🎯 **Twoja aplikacja Workflow365 CRM jest teraz online!**

**Adres Twojej aplikacji**: `https://[nazwa-projektu].vercel.app`

### Dane testowe do logowania:
- **Admin**: `admin@ite.pl` / `admin123`
- **Manager**: `manager@ite.pl` / `manager123`
- **User**: `user@ite.pl` / `user123`

### Następne kroki:
1. **Przetestuj wszystkie funkcje** aplikacji online
2. **Wgraj własne dane** używając szablonu Excel  
3. **Udostępnij link** zespołowi IT Excellence
4. **Monitoruj wydajność** w dashboard Vercel

### Wsparcie:
- **Vercel Documentation**: vercel.com/docs
- **GitHub Help**: docs.github.com
- **Community**: reddit.com/r/nextjs (dla pytań o Vercel)

---

**Powodzenia z Twoją aplikacją CRM! 🚀**

*Łukasz Dobrowolski, IT Excellence S.A.*  
*Instrukcja przygotowana: 30 lipca 2025*