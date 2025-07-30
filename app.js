// NAPRAWIONE: Używanie prawidłowych danych z JSON
const appData = {
    companies: [
        {
            id: 1,
            name: "IT Excellence S.A.",
            nip: "8943048437", 
            industry: "IT/Software",
            location: "Wrocław",
            size: "Średnia",
            status: "Aktywna",
            revenue: 500000
        },
        {
            id: 2,
            name: "TechFlow Sp. z o.o.",
            nip: "5261234567",
            industry: "Automatyzacja", 
            location: "Warszawa",
            size: "Duża",
            status: "Aktywna", 
            revenue: 750000
        },
        {
            id: 3,
            name: "DataSync Solutions",
            nip: "7891234568",
            industry: "Analityka",
            location: "Kraków", 
            size: "Mała",
            status: "Aktywna",
            revenue: 300000
        },
        {
            id: 4,
            name: "CloudTech Innovations",
            nip: "9871234569",
            industry: "Chmura",
            location: "Gdańsk",
            size: "Średnia", 
            status: "Potencjalna",
            revenue: 200000
        },
        {
            id: 5,
            name: "SecureNet Systems",
            nip: "1234567890",
            industry: "Cyberbezpieczeństwo",
            location: "Poznań",
            size: "Duża",
            status: "Aktywna",
            revenue: 150000
        }
    ],
    caregivers: [
        {
            id: 1,
            firstName: "Anna",
            lastName: "Kowalska", 
            type: "handlowy",
            region: "Dolnośląskie",
            experience: "5 lat",
            email: "anna.kowalska@ite.pl",
            specialization: "IT Enterprise"
        },
        {
            id: 2,
            firstName: "Piotr", 
            lastName: "Nowak",
            type: "wdrożeniowy", 
            region: "Mazowieckie",
            experience: "8 lat",
            email: "piotr.nowak@ite.pl",
            specialization: "Automatyzacja procesów"
        },
        {
            id: 3,
            firstName: "Katarzyna",
            lastName: "Wiśniewska",
            type: "handlowy",
            region: "Małopolskie", 
            experience: "3 lat",
            email: "katarzyna.wisniewska@ite.pl",
            specialization: "Analityka danych"
        },
        {
            id: 4,
            firstName: "Marcin",
            lastName: "Kaczmarek",
            type: "wdrożeniowy",
            region: "Pomorskie",
            experience: "6 lat", 
            email: "marcin.kaczmarek@ite.pl",
            specialization: "Rozwiązania chmurowe"
        },
        {
            id: 5,
            firstName: "Agnieszka",
            lastName: "Zielińska",
            type: "handlowy",
            region: "Wielkopolskie",
            experience: "7 lat",
            email: "agnieszka.zielinska@ite.pl", 
            specialization: "Cyberbezpieczeństwo"
        }
    ],
    connections: [
        {companyId: 1, caregiverId: 1},
        {companyId: 1, caregiverId: 2},
        {companyId: 2, caregiverId: 2}, 
        {companyId: 2, caregiverId: 3},
        {companyId: 3, caregiverId: 3},
        {companyId: 3, caregiverId: 4},
        {companyId: 4, caregiverId: 4},
        {companyId: 4, caregiverId: 5},
        {companyId: 5, caregiverId: 5}
    ],
    users: [
        {email: "admin@ite.pl", password: "admin123", role: "admin"},
        {email: "manager@ite.pl", password: "manager123", role: "manager"}, 
        {email: "user@ite.pl", password: "user123", role: "user"}
    ]
};

// Stan aplikacji
let appState = {
    isLoggedIn: false,
    currentUser: null,
    selectedNode: null,
    expandedNodes: new Set(),
    searchQuery: '',
    filters: {
        handlowy: true,
        wdrożeniowy: true
    },
    visibleNodes: new Set()
};

// NAPRAWIONE: Inicjalizacja aplikacji
function initApp() {
    console.log('Initializing Workflow365 CRM...');
    showLoginScreen();
    setupEventListeners();
    
    // Sprawdź czy logo się ładuje
    const loginLogo = document.querySelector('.login-logo img');
    if (loginLogo) {
        loginLogo.onerror = function() {
            console.error('Logo failed to load, using fallback');
            this.style.display = 'none';
            const fallbackText = document.createElement('h1');
            fallbackText.textContent = 'Workflow365';
            fallbackText.style.color = '#0368ff';
            fallbackText.style.fontSize = '24px';
            fallbackText.style.margin = '0';
            this.parentElement.appendChild(fallbackText);
        };
        
        loginLogo.onload = function() {
            console.log('Logo loaded successfully');
        };
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
        console.log('Login screen displayed');
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
        console.log('Main app displayed');
    }
    
    if (userInfo && appState.currentUser) {
        userInfo.textContent = appState.currentUser.email;
    }
    
    // Inicjalizacja mapy i statystyk
    setTimeout(() => {
        console.log('Initializing map and statistics...');
        initializeMap();
        updateStatistics();
    }, 200);
}

// NAPRAWIONE: Konfiguracja event listenerów z debugowaniem
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // KRYTYCZNA NAPRAWA: Logowanie z prawidłowym handlerem
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, attaching event listener');
        
        // Usuń poprzednie event listenery
        loginForm.onsubmit = null;
        
        // Dodaj nowy event listener
        loginForm.addEventListener('submit', function(e) {
            console.log('=== LOGIN FORM SUBMITTED ===');
            e.preventDefault();
            e.stopPropagation();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const loginError = document.getElementById('loginError');
            
            if (!emailInput || !passwordInput) {
                console.error('Login form inputs not found');
                return false;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            console.log('Login attempt:', { 
                email: email, 
                password: password.length > 0 ? '[PROVIDED]' : '[EMPTY]' 
            });
            
            if (!email || !password) {
                showLoginError('Proszę wprowadzić email i hasło');
                return false;
            }
            
            // Sprawdzenie danych uwierzytelniających
            const user = appData.users.find(account => 
                account.email === email && account.password === password
            );
            
            console.log('User lookup result:', user ? 'FOUND' : 'NOT FOUND');
            
            if (user) {
                console.log('=== LOGIN SUCCESSFUL ===');
                appState.currentUser = user;
                appState.isLoggedIn = true;
                
                if (loginError) {
                    loginError.classList.add('hidden');
                }
                
                // Przejście do głównej aplikacji
                showMainApp();
            } else {
                console.log('=== LOGIN FAILED ===');
                showLoginError('Nieprawidłowy email lub hasło');
            }
            
            return false;
        });
        
        console.log('Login form event listener attached successfully');
    } else {
        console.error('LOGIN FORM NOT FOUND!');
    }
    
    // Wylogowanie
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('Logout button event listener attached');
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
    
    // Import Excel
    const importExcel = document.getElementById('importExcel');
    if (importExcel) {
        importExcel.addEventListener('click', handleImportExcel);
    }
    
    // Panel szczegółów
    const closeDetails = document.getElementById('closeDetails');
    if (closeDetails) {
        closeDetails.addEventListener('click', closeDetailsHandler);
    }
    
    console.log('All event listeners set up successfully');
}

function showLoginError(message) {
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.remove('hidden');
        console.log('Login error displayed:', message);
    }
}

// Obsługa wylogowania
function handleLogout() {
    console.log('Logging out...');
    appState.currentUser = null;
    appState.isLoggedIn = false;
    resetAppState();
    showLoginScreen();
    
    // Wyczyszczenie formularza logowania
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
        appState.filters.handlowy = filterSales.checked;
    }
    
    if (filterImplementation) {
        appState.filters.wdrożeniowy = filterImplementation.checked;
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
    
    appState.filters.handlowy = true;
    appState.filters.wdrożeniowy = true;
    filterAndRenderNodes();
}

// Resetowanie widoku
function resetViewHandler() {
    appState.selectedNode = null;
    appState.expandedNodes.clear();
    closeDetailsHandler();
    filterAndRenderNodes();
}

// Obsługa importu Excel
function handleImportExcel() {
    alert('Funkcja importu Excel zostanie wkrótce dodana.');
}

// Inicjalizacja mapy
function initializeMap() {
    console.log('Initializing map...');
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
    return appState.filters[caregiver.type] === true;
}

// Renderowanie mapy
function renderMap(companies, caregivers) {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    
    console.log(`Rendering map with ${companies.length} companies and ${caregivers.length} caregivers`);
    
    mapContainer.innerHTML = '';
    
    const containerWidth = mapContainer.clientWidth || 600;
    const containerHeight = mapContainer.clientHeight || 500;
    
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
    
    // Renderowanie połączeń po krótkim opóźnieniu
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
        console.log('Company clicked:', company.name);
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
        console.log('Caregiver clicked:', `${caregiver.firstName} ${caregiver.lastName}`);
        selectNode('caregiver', caregiver);
        toggleNodeExpansion(`caregiver_${caregiver.id}`);
    });
    
    return node;
}

// Wybór węzła
function selectNode(type, data) {
    console.log('Selecting node:', type, data.name || `${data.firstName} ${data.lastName}`);
    
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
    
    appData.connections.forEach(rel => {
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
        // Usuń wszystkie efekty przyciemnienia
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
        const totalCaregivers = relatedCaregivers.length;
        
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
                <h4>Opiekunowie (${totalCaregivers})</h4>
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
    const caregiverIds = appData.connections
        .filter(rel => rel.companyId === companyId)
        .map(rel => rel.caregiverId);
    
    return appData.caregivers.filter(caregiver => 
        caregiverIds.includes(caregiver.id)
    );
}

// Pobieranie powiązanych firm
function getRelatedCompanies(caregiverId) {
    const companyIds = appData.connections
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
    const caregiversCount = document.getElementById('caregiversCount');
    const totalRevenue = document.getElementById('totalRevenue');
    const relationshipsCount = document.getElementById('relationshipsCount');
    
    const visibleCompanies = appData.companies.filter(company => 
        appState.visibleNodes.has(`company_${company.id}`) || appState.visibleNodes.size === 0
    );
    
    const visibleCaregivers = appData.caregivers.filter(caregiver => 
        appState.visibleNodes.has(`caregiver_${caregiver.id}`) || appState.visibleNodes.size === 0
    );
    
    const totalRevenueValue = visibleCompanies.reduce((sum, company) => sum + company.revenue, 0);
    const totalRelationships = appData.connections.length;
    
    if (companiesCount) {
        companiesCount.textContent = visibleCompanies.length;
    }
    
    if (caregiversCount) {
        caregiversCount.textContent = visibleCaregivers.length;
    }
    
    if (totalRevenue) {
        totalRevenue.textContent = formatCurrency(totalRevenueValue);
    }
    
    if (relationshipsCount) {
        relationshipsCount.textContent = totalRelationships;
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

// NAPRAWIONE: Uruchomienie aplikacji po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM LOADED ===');
    
    // Dodatkowe debugowanie
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    console.log('Elements found:', {
        loginForm: !!loginForm,
        emailInput: !!emailInput,
        passwordInput: !!passwordInput
    });
    
    initApp();
});