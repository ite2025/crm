// Dane aplikacji
const appData = {
    companies: [
        {id: 1, name: "IT Excellence S.A.", industry: "IT Services", location: "Wrocław", size: "Duża", status: "Aktywna", nip: "8971235467", revenue: 450000},
        {id: 2, name: "TechSoft Sp. z o.o.", industry: "Software", location: "Warszawa", size: "Średnia", status: "Aktywna", nip: "1234567890", revenue: 320000},
        {id: 3, name: "DataFlow Systems", industry: "Data Analytics", location: "Kraków", size: "Duża", status: "Aktywna", nip: "9876543210", revenue: 580000},
        {id: 4, name: "CloudPoint Ltd.", industry: "Cloud Services", location: "Gdańsk", size: "Średnia", status: "Aktywna", nip: "5555666677", revenue: 280000},
        {id: 5, name: "NetWork Solutions", industry: "Networking", location: "Poznań", size: "Mała", status: "Aktywna", nip: "1111222233", revenue: 270000}
    ],
    caregivers: [
        {id: 1, firstName: "Anna", lastName: "Kowalska", type: "handlowy", region: "Dolnośląskie", experience: "5 lat", specialization: "IT Services", email: "anna.kowalska@ite.pl"},
        {id: 2, firstName: "Piotr", lastName: "Nowak", type: "handlowy", region: "Mazowieckie", experience: "7 lat", specialization: "Software", email: "piotr.nowak@ite.pl"},
        {id: 3, firstName: "Magdalena", lastName: "Wiśniewska", type: "wdrożeniowy", region: "Małopolskie", experience: "4 lat", specialization: "Data Analytics", email: "magdalena.wisniewska@ite.pl"},
        {id: 4, firstName: "Tomasz", lastName: "Wójcik", type: "wdrożeniowy", region: "Pomorskie", experience: "6 lat", specialization: "Cloud Services", email: "tomasz.wojcik@ite.pl"},
        {id: 5, firstName: "Katarzyna", lastName: "Kaczmarek", type: "handlowy", region: "Wielkopolskie", experience: "3 lat", specialization: "Networking", email: "katarzyna.kaczmarek@ite.pl"},
        {id: 6, firstName: "Michał", lastName: "Zieliński", type: "wdrożeniowy", region: "Dolnośląskie", experience: "8 lat", specialization: "IT Services", email: "michal.zielinski@ite.pl"},
        {id: 7, firstName: "Agnieszka", lastName: "Szymańska", type: "handlowy", region: "Mazowieckie", experience: "5 lat", specialization: "Software", email: "agnieszka.szymanska@ite.pl"},
        {id: 8, firstName: "Paweł", lastName: "Dąbrowski", type: "wdrożeniowy", region: "Małopolskie", experience: "4 lat", specialization: "Data Analytics", email: "pawel.dabrowski@ite.pl"}
    ],
    relationships: [
        {companyId: 1, caregiverId: 1}, {companyId: 1, caregiverId: 6},
        {companyId: 2, caregiverId: 2}, {companyId: 2, caregiverId: 7},
        {companyId: 3, caregiverId: 3}, {companyId: 3, caregiverId: 8},
        {companyId: 4, caregiverId: 4}, {companyId: 5, caregiverId: 5}
    ],
    auth: {
        accounts: [
            {email: "admin@ite.pl", password: "admin123", role: "admin"},
            {email: "manager@ite.pl", password: "manager123", role: "manager"},
            {email: "user@ite.pl", password: "user123", role: "user"}
        ]
    }
};

// Stan aplikacji
let appState = {
    isLoggedIn: false,
    currentUser: null,
    selectedNode: null,
    expandedNodes: new Set(),
    searchQuery: '',
    filters: {
        sales: true,
        implementation: true
    },
    visibleNodes: new Set()
};

// Inicjalizacja aplikacji
function initApp() {
    console.log('Initializing Workflow365 CRM...');
    checkAuthStatus();
    setupEventListeners();
}

// Sprawdzenie stanu logowania
function checkAuthStatus() {
    console.log('Checking auth status...');
    const savedUser = localStorage.getItem('workflow365_user');
    if (savedUser) {
        try {
            appState.currentUser = JSON.parse(savedUser);
            appState.isLoggedIn = true;
            console.log('User found in localStorage:', appState.currentUser.email);
            showMainApp();
        } catch (e) {
            console.error('Error parsing saved user data:', e);
            localStorage.removeItem('workflow365_user');
            showLoginScreen();
        }
    } else {
        console.log('No saved user found, showing login screen');
        showLoginScreen();
    }
}

// Pokazanie ekranu logowania
function showLoginScreen() {
    console.log('Showing login screen...');
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (loginScreen && mainApp) {
        loginScreen.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }
}

// Pokazanie głównej aplikacji
function showMainApp() {
    console.log('Showing main app...');
    const loginScreen = document.getElementById('loginScreen');
    const mainApp = document.getElementById('mainApp');
    const userInfo = document.getElementById('userInfo');
    
    if (loginScreen && mainApp) {
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
    }
    
    if (userInfo && appState.currentUser) {
        userInfo.textContent = appState.currentUser.email;
    }
    
    // Inicjalizacja mapy i statystyk
    setTimeout(() => {
        initializeMap();
        updateStatistics();
    }, 200);
}

// Konfiguracja event listenerów
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Logowanie
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Wylogowanie
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Wyszukiwanie
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.addEventListener('click', clearSearchHandler);
    }
    
    // Filtry
    const filterSales = document.getElementById('filterSales');
    if (filterSales) {
        filterSales.addEventListener('change', updateFilters);
    }
    
    const filterImplementation = document.getElementById('filterImplementation');
    if (filterImplementation) {
        filterImplementation.addEventListener('change', updateFilters);
    }
    
    const resetFilters = document.getElementById('resetFilters');
    if (resetFilters) {
        resetFilters.addEventListener('click', resetFiltersHandler);
    }
    
    const resetView = document.getElementById('resetView');
    if (resetView) {
        resetView.addEventListener('click', resetViewHandler);
    }
    
    // Panel szczegółów
    const closeDetails = document.getElementById('closeDetails');
    if (closeDetails) {
        closeDetails.addEventListener('click', closeDetailsHandler);
    }
    
    // Excel import
    const excelFile = document.getElementById('excelFile');
    if (excelFile) {
        excelFile.addEventListener('change', handleFileSelect);
    }
    
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.addEventListener('click', handleExcelImport);
    }
}

// Obsługa logowania
function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    
    if (!emailInput || !passwordInput) {
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
        if (loginError) {
            loginError.textContent = 'Proszę wprowadzić email i hasło';
            loginError.classList.remove('hidden');
        }
        return;
    }
    
    const user = appData.auth.accounts.find(account => 
        account.email === email && account.password === password
    );
    
    if (user) {
        appState.currentUser = user;
        appState.isLoggedIn = true;
        
        try {
            localStorage.setItem('workflow365_user', JSON.stringify(user));
        } catch (e) {
            console.error('Failed to save user to localStorage:', e);
        }
        
        if (loginError) {
            loginError.classList.add('hidden');
        }
        
        showMainApp();
    } else {
        if (loginError) {
            loginError.textContent = 'Nieprawidłowy email lub hasło';
            loginError.classList.remove('hidden');
        }
    }
}

// Obsługa wylogowania
function handleLogout() {
    appState.currentUser = null;
    appState.isLoggedIn = false;
    localStorage.removeItem('workflow365_user');
    resetAppState();
    showLoginScreen();
    
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.reset();
    }
    
    if (loginError) {
        loginError.classList.add('hidden');
    }
}

// Resetowanie stanu aplikacji
function resetAppState() {
    appState.selectedNode = null;
    appState.expandedNodes.clear();
    appState.searchQuery = '';
    appState.visibleNodes.clear();
    
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (clearSearch) {
        clearSearch.classList.add('hidden');
    }
    
    closeDetailsHandler();
}

// Obsługa wyszukiwania
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    appState.searchQuery = query;
    
    const clearSearch = document.getElementById('clearSearch');
    
    if (query && clearSearch) {
        clearSearch.classList.remove('hidden');
    } else if (clearSearch) {
        clearSearch.classList.add('hidden');
    }
    
    filterAndRenderNodes();
}

// Wyczyszczenie wyszukiwania
function clearSearchHandler() {
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    appState.searchQuery = '';
    
    if (clearSearch) {
        clearSearch.classList.add('hidden');
    }
    
    filterAndRenderNodes();
}

// Aktualizacja filtrów
function updateFilters() {
    const filterSales = document.getElementById('filterSales');
    const filterImplementation = document.getElementById('filterImplementation');
    
    if (filterSales) {
        appState.filters.sales = filterSales.checked;
    }
    
    if (filterImplementation) {
        appState.filters.implementation = filterImplementation.checked;
    }
    
    filterAndRenderNodes();
}

// Resetowanie filtrów
function resetFiltersHandler() {
    const filterSales = document.getElementById('filterSales');
    const filterImplementation = document.getElementById('filterImplementation');
    
    if (filterSales) {
        filterSales.checked = true;
    }
    
    if (filterImplementation) {
        filterImplementation.checked = true;
    }
    
    appState.filters.sales = true;
    appState.filters.implementation = true;
    filterAndRenderNodes();
}

// Resetowanie widoku
function resetViewHandler() {
    appState.selectedNode = null;
    appState.expandedNodes.clear();
    closeDetailsHandler();
    filterAndRenderNodes();
}

// Obsługa wyboru pliku Excel
function handleFileSelect(e) {
    const file = e.target.files[0];
    const importBtn = document.getElementById('importBtn');
    const label = document.querySelector('.file-input-label');
    
    if (file && importBtn && label) {
        importBtn.disabled = false;
        label.textContent = file.name;
    } else if (importBtn && label) {
        importBtn.disabled = true;
        label.textContent = 'Wybierz plik Excel';
    }
}

// Obsługa importu Excel
function handleExcelImport() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Proszę wybrać plik Excel');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            
            // Sprawdź arkusze
            const sheetNames = workbook.SheetNames;
            console.log('Dostępne arkusze:', sheetNames);
            
            // Importuj dane z arkuszy
            if (sheetNames.includes('Firmy')) {
                const firmySheet = workbook.Sheets['Firmy'];
                const firmyData = XLSX.utils.sheet_to_json(firmySheet);
                console.log('Dane firm:', firmyData);
                
                // Zaktualizuj dane firm (przykład)
                if (firmyData.length > 0) {
                    // Możesz tutaj dodać logikę aktualizacji danych
                    console.log('Aktualizowanie danych firm...');
                }
            }
            
            if (sheetNames.includes('Opiekunowie')) {
                const opiekunowieSheet = workbook.Sheets['Opiekunowie'];
                const opiekunowieData = XLSX.utils.sheet_to_json(opiekunowieSheet);
                console.log('Dane opiekunów:', opiekunowieData);
            }
            
            if (sheetNames.includes('Powiązania')) {
                const powiazaniaSheet = workbook.Sheets['Powiązania'];
                const powiazaniaData = XLSX.utils.sheet_to_json(powiazaniaSheet);
                console.log('Dane powiązań:', powiazaniaData);
            }
            
            alert('Dane zostały zaimportowane pomyślnie!');
            
            // Odśwież wizualizację
            filterAndRenderNodes();
            updateStatistics();
            
        } catch (error) {
            console.error('Błąd importu:', error);
            alert('Błąd podczas importu pliku Excel');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Inicjalizacja mapy
function initializeMap() {
    filterAndRenderNodes();
}

// Filtrowanie i renderowanie węzłów
function filterAndRenderNodes() {
    const visibleCompanies = appData.companies.filter(company => 
        matchesSearchQuery(company, 'company')
    );
    
    const visibleCaregivers = appData.caregivers.filter(caregiver => 
        matchesSearchQuery(caregiver, 'caregiver') && 
        matchesFilters(caregiver)
    );
    
    appState.visibleNodes.clear();
    visibleCompanies.forEach(company => appState.visibleNodes.add(`company_${company.id}`));
    visibleCaregivers.forEach(caregiver => appState.visibleNodes.add(`caregiver_${caregiver.id}`));
    
    renderMap(visibleCompanies, visibleCaregivers);
    updateStatistics();
}

// Sprawdzenie czy element pasuje do zapytania wyszukiwania
function matchesSearchQuery(item, type) {
    if (!appState.searchQuery) return true;
    
    const query = appState.searchQuery;
    
    if (type === 'company') {
        return (
            item.name.toLowerCase().includes(query) ||
            item.nip.includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.industry.toLowerCase().includes(query)
        );
    } else if (type === 'caregiver') {
        return (
            item.firstName.toLowerCase().includes(query) ||
            item.lastName.toLowerCase().includes(query) ||
            item.region.toLowerCase().includes(query) ||
            item.specialization.toLowerCase().includes(query) ||
            `${item.firstName} ${item.lastName}`.toLowerCase().includes(query)
        );
    }
    
    return false;
}

// Sprawdzenie czy opiekun pasuje do filtrów
function matchesFilters(caregiver) {
    if (caregiver.type === 'handlowy') {
        return appState.filters.sales;
    } else if (caregiver.type === 'wdrożeniowy') {
        return appState.filters.implementation;
    }
    return true;
}

// Renderowanie mapy
function renderMap(companies, caregivers) {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) {
        return;
    }
    
    mapContainer.innerHTML = '';
    
    const containerWidth = mapContainer.clientWidth || 600;
    
    // Pozycjonowanie firm (lewa strona)
    companies.forEach((company, index) => {
        const node = createCompanyNode(company);
        const x = 50;
        const y = 50 + (index * 90);
        
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        
        mapContainer.appendChild(node);
    });
    
    // Pozycjonowanie opiekunów (prawa strona)
    caregivers.forEach((caregiver, index) => {
        const node = createCaregiverNode(caregiver);
        const x = Math.max(containerWidth - 230, 320);
        const y = 50 + (index * 90);
        
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        
        mapContainer.appendChild(node);
    });
    
    // Renderowanie połączeń
    setTimeout(() => {
        renderConnections();
        applySearchEffects();
    }, 100);
}

// Tworzenie węzła firmy
function createCompanyNode(company) {
    const node = document.createElement('div');
    node.className = 'node company';
    node.id = `company_${company.id}`;
    node.textContent = company.name;
    
    node.addEventListener('click', () => {
        selectNode('company', company);
        toggleNodeExpansion(`company_${company.id}`);
    });
    
    return node;
}

// Tworzenie węzła opiekuna
function createCaregiverNode(caregiver) {
    const node = document.createElement('div');
    node.className = `node caregiver-${caregiver.type}`;
    node.id = `caregiver_${caregiver.id}`;
    node.textContent = `${caregiver.firstName} ${caregiver.lastName}`;
    
    node.addEventListener('click', () => {
        selectNode('caregiver', caregiver);
        toggleNodeExpansion(`caregiver_${caregiver.id}`);
    });
    
    return node;
}

// Wybór węzła
function selectNode(type, data) {
    // Usuń poprzednie zaznaczenie
    document.querySelectorAll('.node.selected').forEach(node => {
        node.classList.remove('selected');
    });
    
    // Zaznacz nowy węzeł
    const nodeId = `${type}_${data.id}`;
    const nodeElement = document.getElementById(nodeId);
    if (nodeElement) {
        nodeElement.classList.add('selected');
    }
    
    appState.selectedNode = {type, data};
    showDetails(type, data);
}

// Przełączanie rozwinięcia węzła
function toggleNodeExpansion(nodeId) {
    if (appState.expandedNodes.has(nodeId)) {
        appState.expandedNodes.delete(nodeId);
    } else {
        appState.expandedNodes.add(nodeId);
    }
    
    renderConnections();
}

// Renderowanie połączeń
function renderConnections() {
    // Usuń istniejące połączenia
    document.querySelectorAll('.connection').forEach(conn => conn.remove());
    
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    appData.relationships.forEach(rel => {
        const companyNode = document.getElementById(`company_${rel.companyId}`);
        const caregiverNode = document.getElementById(`caregiver_${rel.caregiverId}`);
        
        if (companyNode && caregiverNode) {
            const shouldShow = appState.expandedNodes.has(`company_${rel.companyId}`) || 
                             appState.expandedNodes.has(`caregiver_${rel.caregiverId}`) ||
                             appState.expandedNodes.size === 0;
            
            if (shouldShow) {
                createConnection(companyNode, caregiverNode, mapContainer);
            }
        }
    });
}

// Tworzenie połączenia między węzłami
function createConnection(node1, node2, container) {
    const rect1 = node1.getBoundingClientRect();
    const rect2 = node2.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const x1 = rect1.right - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
    const x2 = rect2.left - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;
    
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    
    const connection = document.createElement('div');
    connection.className = 'connection';
    connection.style.left = `${x1}px`;
    connection.style.top = `${y1}px`;
    connection.style.width = `${distance}px`;
    connection.style.transform = `rotate(${angle}deg)`;
    
    container.appendChild(connection);
}

// Aplikowanie efektów wyszukiwania
function applySearchEffects() {
    if (!appState.searchQuery) {
        document.querySelectorAll('.node.dimmed').forEach(node => {
            node.classList.remove('dimmed');
        });
        return;
    }
    
    // Przyciemnij wszystkie węzły
    document.querySelectorAll('.node').forEach(node => {
        node.classList.add('dimmed');
    });
    
    // Podświetl pasujące węzły
    appState.visibleNodes.forEach(nodeId => {
        const node = document.getElementById(nodeId);
        if (node) {
            node.classList.remove('dimmed');
        }
    });
}

// Pokazanie szczegółów
function showDetails(type, data) {
    const detailsContent = document.getElementById('detailsContent');
    const detailsPanel = document.getElementById('detailsPanel');
    
    if (!detailsContent) return;
    
    let content = '';
    
    if (type === 'company') {
        const relatedCaregivers = getRelatedCaregivers(data.id);
        
        content = `
            <div class="detail-section">
                <h4>${data.name}</h4>
                <div class="detail-item">
                    <span class="detail-label">NIP:</span>
                    <span class="detail-value">${data.nip}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Lokalizacja:</span>
                    <span class="detail-value">${data.location}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Branża:</span>
                    <span class="detail-value">${data.industry}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Obrót:</span>
                    <span class="detail-value">${formatCurrency(data.revenue)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Rozmiar:</span>
                    <span class="detail-value">${data.size}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${data.status}</span>
                </div>
            </div>
            <div class="detail-section">
                <h4>Opiekunowie (${relatedCaregivers.length})</h4>
                ${relatedCaregivers.map(caregiver => `
                    <div class="detail-item">
                        <span class="detail-label">${caregiver.firstName} ${caregiver.lastName}</span>
                        <span class="detail-value">${caregiver.type}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (type === 'caregiver') {
        const relatedCompanies = getRelatedCompanies(data.id);
        const totalRevenue = relatedCompanies.reduce((sum, company) => sum + company.revenue, 0);
        
        content = `
            <div class="detail-section">
                <h4>${data.firstName} ${data.lastName}</h4>
                <div class="detail-item">
                    <span class="detail-label">Typ:</span>
                    <span class="detail-value">${data.type}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Region:</span>
                    <span class="detail-value">${data.region}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Doświadczenie:</span>
                    <span class="detail-value">${data.experience}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${data.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Specjalizacja:</span>
                    <span class="detail-value">${data.specialization}</span>
                </div>
            </div>
            <div class="detail-section">
                <h4>Firmy (${relatedCompanies.length})</h4>
                <div class="detail-item">
                    <span class="detail-label">Łączny obrót:</span>
                    <span class="detail-value">${formatCurrency(totalRevenue)}</span>
                </div>
                ${relatedCompanies.map(company => `
                    <div class="detail-item">
                        <span class="detail-label">${company.name}</span>
                        <span class="detail-value">${formatCurrency(company.revenue)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    detailsContent.innerHTML = content;
    
    if (detailsPanel) {
        detailsPanel.classList.add('fade-in');
    }
}

// Pobieranie powiązanych opiekunów
function getRelatedCaregivers(companyId) {
    const caregiverIds = appData.relationships
        .filter(rel => rel.companyId === companyId)
        .map(rel => rel.caregiverId);
    
    return appData.caregivers.filter(caregiver => 
        caregiverIds.includes(caregiver.id)
    );
}

// Pobieranie powiązanych firm
function getRelatedCompanies(caregiverId) {
    const companyIds = appData.relationships
        .filter(rel => rel.caregiverId === caregiverId)
        .map(rel => rel.companyId);
    
    return appData.companies.filter(company => 
        companyIds.includes(company.id)
    );
}

// Zamknięcie panelu szczegółów
function closeDetailsHandler() {
    const detailsContent = document.getElementById('detailsContent');
    const detailsPanel = document.getElementById('detailsPanel');
    
    if (detailsContent) {
        detailsContent.innerHTML = '<p>Kliknij na firmę lub opiekuna, aby zobaczyć szczegóły</p>';
    }
    
    if (detailsPanel) {
        detailsPanel.classList.remove('fade-in');
    }
    
    // Usuń zaznaczenie
    document.querySelectorAll('.node.selected').forEach(node => {
        node.classList.remove('selected');
    });
    
    appState.selectedNode = null;
}

// Aktualizacja statystyk
function updateStatistics() {
    const companiesCount = document.getElementById('companiesCount');
    const salesCount = document.getElementById('salesCount');
    const implementationCount = document.getElementById('implementationCount');
    const totalRevenue = document.getElementById('totalRevenue');
    const averageRevenue = document.getElementById('averageRevenue');
    
    const visibleCompanies = appData.companies.filter(company => 
        appState.visibleNodes.has(`company_${company.id}`) || appState.visibleNodes.size === 0
    );
    
    const visibleCaregivers = appData.caregivers.filter(caregiver => 
        appState.visibleNodes.has(`caregiver_${caregiver.id}`) || appState.visibleNodes.size === 0
    );
    
    const salesCaregivers = visibleCaregivers.filter(c => c.type === 'handlowy');
    const implementationCaregivers = visibleCaregivers.filter(c => c.type === 'wdrożeniowy');
    
    const totalRevenueValue = visibleCompanies.reduce((sum, company) => sum + company.revenue, 0);
    const averageRevenueValue = visibleCompanies.length > 0 ? totalRevenueValue / visibleCompanies.length : 0;
    
    if (companiesCount) {
        companiesCount.textContent = visibleCompanies.length;
    }
    
    if (salesCount) {
        salesCount.textContent = salesCaregivers.length;
    }
    
    if (implementationCount) {
        implementationCount.textContent = implementationCaregivers.length;
    }
    
    if (totalRevenue) {
        totalRevenue.textContent = formatCurrency(totalRevenueValue);
    }
    
    if (averageRevenue) {
        averageRevenue.textContent = formatCurrency(averageRevenueValue);
    }
}

// Formatowanie waluty
function formatCurrency(amount) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Uruchomienie aplikacji po załadowaniu DOM
document.addEventListener('DOMContentLoaded', initApp);