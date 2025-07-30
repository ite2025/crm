# Instrukcja Wdrożenia Aplikacji Workflow365 CRM na Vercel

## Spis treści
1. [Przygotowanie projektu](#1-przygotowanie-projektu)
2. [Instalacja narzędzi](#2-instalacja-narzędzi)
3. [Konfiguracja GitHub](#3-konfiguracja-github)
4. [Wdrożenie przez GitHub (ZALECANE)](#4-wdrożenie-przez-github-zalecane)
5. [Wdrożenie przez Vercel CLI](#5-wdrożenie-przez-vercel-cli)
6. [Konfiguracja domeny](#6-konfiguracja-domeny)
7. [Rozwiązywanie problemów](#7-rozwiązywanie-problemów)

---

## 1. Przygotowanie projektu

### 1.1 Struktura plików
Upewnij się, że masz wszystkie wymagane pliki w folderze projektu:

```
workflow365-crm/
├── index.html          # Główny plik HTML z aplikacją
├── style.css           # Style CSS z glass morphism
├── app.js              # Logika aplikacji i system logowania
├── package.json        # Konfiguracja npm
├── vercel.json         # Konfiguracja Vercel
├── vite.config.js      # Konfiguracja Vite
├── .gitignore          # Pliki ignorowane przez Git
└── README.md           # Dokumentacja projektu
```

### 1.2 Sprawdzenie zawartości plików

**package.json** - musi zawierać:
```json
{
  "name": "workflow365-crm",
  "version": "1.0.0",
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview"
  },
  "dependencies": {
    "d3": "^7.8.5",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

**vercel.json** - konfiguracja wdrożenia:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

---

## 2. Instalacja narzędzi

### 2.1 Wymagania systemowe
- **Node.js** w wersji 18 lub nowszej
- **npm** lub **yarn**
- **Git**
- Konto na **GitHub** (dla metody zalecanej)
- Konto na **Vercel**

### 2.2 Instalacja Node.js
1. Pobierz Node.js z oficjalnej strony: https://nodejs.org/
2. Zainstaluj wersję LTS (Long Term Support)
3. Sprawdź instalację:
```bash
node --version
npm --version
```

### 2.3 Instalacja Vercel CLI (opcjonalne)
```bash
npm install -g vercel
```

Sprawdź instalację:
```bash
vercel --version
```

---

## 3. Konfiguracja GitHub

### 3.1 Tworzenie repozytorium na GitHub

1. **Zaloguj się na GitHub** (https://github.com)
2. **Kliknij "New repository"** w prawym górnym rogu
3. **Wypełnij dane:**
   - Repository name: `workflow365-crm`
   - Description: `System CRM z mapą relacji i logowaniem`
   - Wybierz **Public** lub **Private**
   - ❌ **NIE zaznaczaj** "Add a README file"
   - ❌ **NIE zaznaczaj** "Add .gitignore"
4. **Kliknij "Create repository"**

### 3.2 Inicjalizacja Git w projekcie

Otwórz terminal w folderze z projektem i wykonaj:

```bash
# Inicjalizuj repozytorium Git
git init

# Dodaj wszystkie pliki
git add .

# Pierwszy commit
git commit -m "Initial commit - Workflow365 CRM"

# Dodaj zdalne repozytorium (zastąp YOUR_USERNAME swoją nazwą użytkownika)
git remote add origin https://github.com/YOUR_USERNAME/workflow365-crm.git

# Prześlij kod na GitHub
git push -u origin main
```

⚠️ **UWAGA**: Jeśli pojawi się błąd z "main" branch, użyj:
```bash
git branch -M main
git push -u origin main
```

---

## 4. Wdrożenie przez GitHub (ZALECANE)

### 4.1 Logowanie do Vercel

1. Idź na stronę: https://vercel.com
2. Kliknij **"Continue with GitHub"**
3. Zaloguj się swoim kontem GitHub
4. Autoryzuj Vercel

### 4.2 Import projektu z GitHub

1. **Na dashboard Vercel kliknij "Import Project"**
2. **Wybierz "Import Git Repository"**
3. **Znajdź swoje repozytorium** `workflow365-crm`
4. **Kliknij "Import"**

### 4.3 Konfiguracja wdrożenia

**Vercel automatycznie wykryje ustawienia, ale sprawdź czy są poprawne:**

- **Framework Preset**: `Other` (lub zostaw puste)
- **Root Directory**: `.` (katalog główny)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4.4 Rozpoczęcie wdrożenia

1. **Kliknij "Deploy"**
2. **Czekaj na zakończenie** (zwykle 1-3 minuty)
3. **Po sukcesie** otrzymasz URL aplikacji

---

## 5. Wdrożenie przez Vercel CLI

### 5.1 Logowanie przez CLI

```bash
vercel login
```

Wybierz metodę logowania (GitHub, GitLab, email)

### 5.2 Inicjalizacja projektu

W folderze z aplikacją:

```bash
vercel
```

**Odpowiedz na pytania:**
- Set up and deploy "~/workflow365-crm"? **Y**
- Which scope do you want to deploy to? **[wybierz swoje konto]**
- Link to existing project? **N**
- What's your project's name? **workflow365-crm**
- In which directory is your code located? **[naciśnij Enter - zostaw puste]**

### 5.3 Wdrożenie produkcyjne

```bash
vercel --prod
```

### 5.4 Sprawdzenie statusu

```bash
vercel ls
```

---

## 6. Konfiguracja domeny

### 6.1 Domena Vercel (automatyczna)

Po wdrożeniu otrzymasz automatycznie domenę:
- `https://workflow365-crm.vercel.app`
- lub podobną z losowym sufiksem

### 6.2 Własna domena (opcjonalnie)

1. **W dashboard Vercel:**
   - Przejdź do swojego projektu
   - Kliknij zakładkę **"Domains"**
   - Kliknij **"Add"**
   - Wprowadź swoją domenę
   - Postępuj zgodnie z instrukcjami DNS

---

## 7. Rozwiązywanie problemów

### 7.1 Błędy podczas build

**Problem**: `Command "npm install" exited with 1`
```bash
# Usuń node_modules i package-lock.json
rm -rf node_modules package-lock.json
# Reinstalacja
npm install
# Lokalne testowanie
npm run build
```

**Problem**: `Build failed`
```bash
# Sprawd test lokalny
npm run dev
# Sprawdź logi w Vercel dashboard
```

### 7.2 Błędy JavaScript

**Problem**: Aplikacja nie działa po wdrożeniu
- Sprawdź Console w narzędziach deweloperskich przeglądarki
- Upewnij się, że wszystkie pliki są poprawnie linkowane
- Sprawdź czy ścieżki do plików CSS/JS są względne

### 7.3 Problemy z Git

**Problem**: `Permission denied (publickey)`
```bash
# Użyj HTTPS zamiast SSH
git remote set-url origin https://github.com/YOUR_USERNAME/workflow365-crm.git
```

**Problem**: `Updates were rejected`
```bash
git pull origin main --rebase
git push origin main
```

### 7.4 Ponowne wdrożenie

**Przez GitHub:**
1. Wprowadź zmiany w kodzie
2. `git add .`
3. `git commit -m "Update aplikacji"`
4. `git push`
5. Vercel automatycznie wdroży nową wersję

**Przez CLI:**
```bash
vercel --prod
```

---

## 8. Testowanie aplikacji

### 8.1 Dostęp do aplikacji

Po wdrożeniu otwórz aplikację w przeglądarce. Powinieneś zobaczyć:

1. **Stronę logowania** z logo Workflow365
2. **Formularz logowania** z polami email/hasło
3. **Przykładowe konta** widoczne na stronie

### 8.2 Test logowania

Użyj przykładowych danych:
- **Email**: `admin@ite.pl`
- **Hasło**: `admin123`

### 8.3 Test funkcjonalności CRM

Po zalogowaniu sprawdź:
- ✅ Mapa relacji firm i opiekunów
- ✅ Filtrowanie opiekunów handlowych/wdrożeniowych
- ✅ Klikanie na elementy mapy
- ✅ Panel szczegółów po prawej stronie
- ✅ Statystyki na dole
- ✅ Przycisk wylogowania

---

## 9. Monitoring i analityka

### 9.1 Vercel Analytics

1. W dashboard Vercel przejdź do projektu
2. Kliknij **"Analytics"**
3. Włącz **Web Analytics** (bezpłatne)

### 9.2 Logi błędów

1. Przejdź do **"Functions"** → **"Logs"**
2. Monitoruj błędy w czasie rzeczywistym

---

## 10. Aktualizacje i maintenance

### 10.1 Aktualizacja kodu

```bash
# Wprowadź zmiany w plikach
# Zatwierdź zmiany
git add .
git commit -m "Opis zmian"
git push

# Aplikacja zostanie automatycznie wdrożona
```

### 10.2 Rollback do poprzedniej wersji

W dashboard Vercel:
1. Przejdź do **"Deployments"**
2. Znajdź poprzednią wersję
3. Kliknij **"Promote to Production"**

---

## Gotowe! 🎉

Twoja aplikacja Workflow365 CRM powinna być teraz dostępna online pod adresem Vercel. 

**Następne kroki:**
- Udostępnij link swojemu zespołowi
- Skonfiguruj własną domenę (opcjonalnie)
- Dodaj więcej danych firm i opiekunów
- Monitoruj wydajność w Vercel Analytics

**Potrzebujesz pomocy?**
- Dokumentacja Vercel: https://vercel.com/docs
- Support: https://vercel.com/support
- GitHub Issues: w swoim repozytorium

---

*Instrukcja przygotowana dla IT Excellence S.A.*  
*Autor: Łukasz Dobrowolski*  
*Data: 30 lipca 2025*