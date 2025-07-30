// System autoryzacji
const AuthSystem = {
  users: [
    {email: "admin@ite.pl", password: "admin123", role: "admin", name: "Administrator"},
    {email: "manager@ite.pl", password: "manager123", role: "manager", name: "Manager"},
    {email: "user@ite.pl", password: "user123", role: "user", name: "Użytkownik"}
  ],
  
  currentUser: null,
  
  // Hook autoryzacji
  useAuth: {
    login: function(email, password) {
      console.log('Próba logowania:', email);
      const user = AuthSystem.users.find(u => u.email === email && u.password === password);
      if (user) {
        AuthSystem.currentUser = user;
        localStorage.setItem('workflow365_user', JSON.stringify(user));
        console.log('Logowanie pomyślne:', user);
        return { success: true, user: user };
      }
      console.log('Logowanie nieudane');
      return { success: false, error: 'Nieprawidłowy email lub hasło' };
    },
    
    logout: function() {
      console.log('Wylogowywanie użytkownika');
      AuthSystem.currentUser = null;
      localStorage.removeItem('workflow365_user');
    },
    
    getCurrentUser: function() {
      if (AuthSystem.currentUser) {
        return AuthSystem.currentUser;
      }
      
      const storedUser = localStorage.getItem('workflow365_user');
      if (storedUser) {
        try {
          AuthSystem.currentUser = JSON.parse(storedUser);
          return AuthSystem.currentUser;
        } catch (error) {
          console.error('Błąd podczas odczytu danych użytkownika:', error);
          localStorage.removeItem('workflow365_user');
        }
      }
      
      return null;
    },
    
    isAuthenticated: function() {
      return AuthSystem.useAuth.getCurrentUser() !== null;
    }
  }
};

// Dane aplikacji CRM z rozszerzonymi polami
let appData = {
  companies: [
    {
      id: 1, 
      name: "IT Excellence S.A.", 
      industry: "IT", 
      location: "Wrocław", 
      size: "duża", 
      status: "aktywna",
      nip: "1234567890",
      wartość_obrotu_ite: 500000
    },
    {
      id: 2, 
      name: "TechSoft Sp. z o.o.", 
      industry: "Software", 
      location: "Warszawa", 
      size: "średnia", 
      status: "aktywna",
      nip: "2345678901",
      wartość_obrotu_ite: 250000
    },
    {
      id: 3, 
      name: "DataFlow Ltd.", 
      industry: "Analytics", 
      location: "Kraków", 
      size: "mała", 
      status: "potencjalna",
      nip: "3456789012",
      wartość_obrotu_ite: 100000
    },
    {
      id: 4, 
      name: "CloudTech S.A.", 
      industry: "Cloud", 
      location: "Gdańsk", 
      size: "duża", 
      status: "aktywna",
      nip: "4567890123",
      wartość_obrotu_ite: 750000
    },
    {
      id: 5, 
      name: "WebSolutions Sp. z o.o.", 
      industry: "Web Development", 
      location: "Poznań", 
      size: "średnia", 
      status: "aktywna",
      nip: "5678901234",
      wartość_obrotu_ite: 300000
    }
  ],
  caregivers: [
    {id: 1, firstName: "Łukasz", lastName: "Dobrowolski", type: "handlowy", region: "Wrocław", experience: "8 lat", specialization: "Enterprise Sales", email: "lukasz.dobrowolski@ite.pl"},
    {id: 2, firstName: "Anna", lastName: "Kowalska", type: "handlowy", region: "Warszawa", experience: "5 lat", specialization: "SMB Sales", email: "anna.kowalska@ite.pl"},
    {id: 3, firstName: "Piotr", lastName: "Nowak", type: "handlowy", region: "Kraków", experience: "3 lata", specialization: "New Business", email: "piotr.nowak@ite.pl"},
    {id: 4, firstName: "Michał", lastName: "Wiśniewski", type: "wdrożeniowy", region: "Wrocław", experience: "6 lat", specialization: "Enterprise Implementation", email: "michal.wisniewski@ite.pl"},
    {id: 5, firstName: "Katarzyna", lastName: "Zielińska", type: "wdrożeniowy", region: "Warszawa", experience: "4 lata", specialization: "SMB Implementation", email: "katarzyna.zielinska@ite.pl"},
    {id: 6, firstName: "Tomasz", lastName: "Lewandowski", type: "wdrożeniowy", region: "Gdańsk", experience: "2 lata", specialization: "Technical Support", email: "tomasz.lewandowski@ite.pl"},
    {id: 7, firstName: "Magdalena", lastName: "Wójcik", type: "handlowy", region: "Poznań", experience: "7 lat", specialization: "Key Account Management", email: "magdalena.wojcik@ite.pl"},
    {id: 8, firstName: "Jakub", lastName: "Kowalczyk", type: "wdrożeniowy", region: "Kraków", experience: "3 lata", specialization: "Technical Implementation", email: "jakub.kowalczyk@ite.pl"}
  ],
  relationships: [
    {companyId: 1, caregiverId: 1},
    {companyId: 1, caregiverId: 4},
    {companyId: 2, caregiverId: 2},
    {companyId: 2, caregiverId: 5},
    {companyId: 3, caregiverId: 3},
    {companyId: 3, caregiverId: 8},
    {companyId: 4, caregiverId: 1},
    {companyId: 4, caregiverId: 6},
    {companyId: 5, caregiverId: 7}
  ]
};

// Funkcja formatowania kwot
function formatCurrency(amount) {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' PLN';
}

// Funkcje kalkulacji dla opiekunów
function calculateCaregiverStats(caregiverId) {
  const relatedCompanies = appData.relationships
    .filter(rel => rel.caregiverId === caregiverId)
    .map(rel => appData.companies.find(c => c.id === rel.companyId))
    .filter(company => company);
  
  const ilość_firm = relatedCompanies.length;
  const suma_obrotu = relatedCompanies.reduce((sum, company) => sum + (company.wartość_obrotu_ite || 0), 0);
  
  return { ilość_firm, suma_obrotu };
}

// Zmienne globalne wizualizacji
let svg, simulation, nodes, links;
let nodeElements, linkElements, labelElements;
let selectedNode = null;
let currentView = 'companies';
let width, height;
let zoomBehavior;

// Filtry
let showSalesManagers = true;
let showImplementationManagers = true;

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicjalizacja aplikacji...');
  
  // Sprawdź czy użytkownik jest zalogowany
  checkAuthAndShowPage();
  
  // Konfiguruj event listenery
  setupAuthEventListeners();
  setupAppEventListeners();
});

function checkAuthAndShowPage() {
  const isAuthenticated = AuthSystem.useAuth.isAuthenticated();
  const loginPage = document.getElementById('login-page');
  const mainApp = document.getElementById('main-app');
  
  console.log('Sprawdzanie autoryzacji:', isAuthenticated);
  
  if (isAuthenticated) {
    // Pokaż główną aplikację
    if (loginPage) loginPage.classList.add('hidden');
    if (mainApp) mainApp.classList.remove('hidden');
    
    // Aktualizuj dane użytkownika w interfejsie
    updateUserInterface();
    
    // Inicjalizuj CRM
    initializeCRM();
  } else {
    // Pokaż stronę logowania
    if (loginPage) loginPage.classList.remove('hidden');
    if (mainApp) mainApp.classList.add('hidden');
  }
}

function setupAuthEventListeners() {
  // Formularz logowania
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Przycisk wylogowania
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');
  
  console.log('Próba logowania dla:', email);
  
  // Pokaż loading
  if (loginBtn) {
    loginBtn.textContent = 'Logowanie...';
    loginBtn.disabled = true;
  }
  
  // Ukryj poprzednie błędy
  if (errorDiv) {
    errorDiv.classList.add('hidden');
  }
  
  // Spróbuj zalogować
  setTimeout(() => {
    const result = AuthSystem.useAuth.login(email, password);
    
    if (result.success) {
      console.log('Logowanie pomyślne, przekierowanie...');
      checkAuthAndShowPage();
      showMessage('Logowanie pomyślne!', 'success');
    } else {
      console.log('Błąd logowania:', result.error);
      if (errorDiv) {
        errorDiv.textContent = result.error;
        errorDiv.classList.remove('hidden');
      }
    }
    
    // Przywróć przycisk
    if (loginBtn) {
      loginBtn.textContent = 'Zaloguj się';
      loginBtn.disabled = false;
    }
  }, 500); // Symulacja opóźnienia
}

function handleLogout() {
  console.log('Obsługa wylogowania');
  AuthSystem.useAuth.logout();
  showMessage('Zostałeś wylogowany', 'info');
  checkAuthAndShowPage();
}

function updateUserInterface() {
  const currentUser = AuthSystem.useAuth.getCurrentUser();
  if (!currentUser) return;
  
  const userNameEl = document.getElementById('current-user-name');
  const userRoleEl = document.getElementById('current-user-role');
  
  if (userNameEl) {
    userNameEl.textContent = currentUser.name;
  }
  
  if (userRoleEl) {
    const roleNames = {
      'admin': 'Administrator',
      'manager': 'Manager',
      'user': 'Użytkownik'
    };
    userRoleEl.textContent = roleNames[currentUser.role] || currentUser.role;
  }
}

function initializeCRM() {
  console.log('Inicjalizacja CRM...');
  updateStats();
  initializeVisualization();
  showMessage('CRM załadowany pomyślnie!', 'success');
}

function setupAppEventListeners() {
  // Checkbox filters
  const showSalesCheckbox = document.getElementById('show-sales');
  const showImplCheckbox = document.getElementById('show-implementation');
  const showAllCheckbox = document.getElementById('show-all');
  
  if (showSalesCheckbox) {
    showSalesCheckbox.addEventListener('change', function() {
      showSalesManagers = this.checked;
      updateShowAllCheckbox();
      refreshVisualization();
      updateStats();
    });
  }
  
  if (showImplCheckbox) {
    showImplCheckbox.addEventListener('change', function() {
      showImplementationManagers = this.checked;
      updateShowAllCheckbox();
      refreshVisualization();
      updateStats();
    });
  }
  
  if (showAllCheckbox) {
    showAllCheckbox.addEventListener('change', function() {
      if (this.checked) {
        showSalesManagers = true;
        showImplementationManagers = true;
        if (showSalesCheckbox) showSalesCheckbox.checked = true;
        if (showImplCheckbox) showImplCheckbox.checked = true;
      } else {
        showSalesManagers = false;
        showImplementationManagers = false;
        if (showSalesCheckbox) showSalesCheckbox.checked = false;
        if (showImplCheckbox) showImplCheckbox.checked = false;
      }
      refreshVisualization();
      updateStats();
    });
  }
  
  // Excel upload
  const loadExcelBtn = document.getElementById('load-excel-btn');
  const excelFile = document.getElementById('excel-file');
  
  if (loadExcelBtn && excelFile) {
    loadExcelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      excelFile.click();
    });
    
    excelFile.addEventListener('change', handleExcelUpload);
  }
  
  // Control buttons
  const resetViewBtn = document.getElementById('reset-view');
  const centerViewBtn = document.getElementById('center-view');
  const closeDetailsBtn = document.getElementById('close-details');
  
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', resetView);
  }
  
  if (centerViewBtn) {
    centerViewBtn.addEventListener('click', centerView);
  }
  
  if (closeDetailsBtn) {
    closeDetailsBtn.addEventListener('click', clearSelection);
  }
}

function updateShowAllCheckbox() {
  const showAllCheckbox = document.getElementById('show-all');
  if (showAllCheckbox) {
    showAllCheckbox.checked = showSalesManagers && showImplementationManagers;
  }
}

function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  console.log('Wczytywanie pliku:', file.name);
  showLoading(true);
  showMessage('Wczytywanie pliku Excel...', 'info');
  
  // Symulacja wczytywania pliku
  setTimeout(() => {
    showMessage('Funkcja Excel w wersji demo', 'info');
    showLoading(false);
    event.target.value = '';
  }, 1000);
}

function initializeVisualization() {
  const container = document.getElementById('network-visualization');
  if (!container) {
    console.error('Nie znaleziono kontenera wizualizacji');
    return;
  }
  
  width = container.clientWidth || 800;
  height = container.clientHeight || 500;
  
  console.log('Inicjalizacja wizualizacji:', width, 'x', height);
  
  // Usuń poprzednie SVG
  d3.select('#network-svg').selectAll('*').remove();
  
  svg = d3.select('#network-svg')
    .attr('width', width)
    .attr('height', height);
  
  // Zoom behavior
  zoomBehavior = d3.zoom()
    .scaleExtent([0.3, 3])
    .on('zoom', function(event) {
      const g = svg.select('.zoom-group');
      if (!g.empty()) {
        g.attr('transform', event.transform);
      }
    });
  
  svg.call(zoomBehavior);
  
  // Grupa główna
  const g = svg.append('g').attr('class', 'zoom-group');
  
  showCompaniesView();
}

function showCompaniesView() {
  console.log('Pokazuję widok firm');
  currentView = 'companies';
  selectedNode = null;
  
  // Przygotuj dane - tylko firmy
  const graphData = {
    nodes: appData.companies.map(company => ({
      id: `company_${company.id}`,
      type: 'company',
      name: company.name,
      data: company
    })),
    links: []
  };
  
  updateVisualization(graphData);
  clearDetailsPanel();
}

function showExpandedView(centerNodeId) {
  console.log('Pokazuję rozszerzone powiązania dla:', centerNodeId);
  currentView = 'expanded';
  
  const graphData = prepareExpandedData(centerNodeId);
  updateVisualization(graphData);
}

function prepareExpandedData(centerNodeId) {
  const nodes = [];
  const links = [];
  
  if (centerNodeId.startsWith('company_')) {
    const companyId = parseInt(centerNodeId.replace('company_', ''));
    const company = appData.companies.find(c => c.id === companyId);
    
    if (company) {
      // Dodaj firmę
      nodes.push({
        id: centerNodeId,
        type: 'company',
        name: company.name,
        data: company,
        fx: width / 2,
        fy: height / 2
      });
      
      // Znajdź powiązanych opiekunów
      const relatedCaregivers = appData.relationships
        .filter(rel => rel.companyId === companyId)
        .map(rel => appData.caregivers.find(c => c.id === rel.caregiverId))
        .filter(caregiver => caregiver && shouldShowCaregiver(caregiver));
      
      // Dodaj opiekunów
      relatedCaregivers.forEach(caregiver => {
        const caregiverId = `caregiver_${caregiver.id}`;
        const caregiverType = getCaregiverType(caregiver.type);
        nodes.push({
          id: caregiverId,
          type: caregiverType,
          name: `${caregiver.firstName} ${caregiver.lastName}`,
          data: caregiver
        });
        
        // Dodaj link
        links.push({
          source: centerNodeId,
          target: caregiverId,
          type: 'assignment'
        });
      });
    }
  } else if (centerNodeId.startsWith('caregiver_')) {
    const caregiverId = parseInt(centerNodeId.replace('caregiver_', ''));
    const caregiver = appData.caregivers.find(c => c.id === caregiverId);
    
    if (caregiver && shouldShowCaregiver(caregiver)) {
      // Dodaj opiekuna
      const caregiverType = getCaregiverType(caregiver.type);
      nodes.push({
        id: centerNodeId,
        type: caregiverType,
        name: `${caregiver.firstName} ${caregiver.lastName}`,
        data: caregiver,
        fx: width / 2,
        fy: height / 2
      });
      
      // Znajdź powiązane firmy
      const relatedCompanies = appData.relationships
        .filter(rel => rel.caregiverId === caregiverId)
        .map(rel => appData.companies.find(c => c.id === rel.companyId))
        .filter(company => company);
      
      // Dodaj firmy
      relatedCompanies.forEach(company => {
        const companyId = `company_${company.id}`;
        nodes.push({
          id: companyId,
          type: 'company',
          name: company.name,
          data: company
        });
        
        // Dodaj link
        links.push({
          source: centerNodeId,
          target: companyId,
          type: 'assignment'
        });
      });
    }
  }
  
  return { nodes, links };
}

function getCaregiverType(type) {
  if (type === 'handlowy') {
    return 'sales';
  } else if (type === 'wdrożeniowy') {
    return 'implementation';
  }
  return 'caregiver';
}

function shouldShowCaregiver(caregiver) {
  if (caregiver.type === 'handlowy') {
    return showSalesManagers;
  } else if (caregiver.type === 'wdrożeniowy') {
    return showImplementationManagers;
  }
  return false;
}

function updateVisualization(graphData) {
  nodes = graphData.nodes;
  links = graphData.links;
  
  console.log(`Aktualizacja wizualizacji: ${nodes.length} węzłów, ${links.length} linków`);
  
  // Usuń poprzednie elementy
  svg.select('.zoom-group').selectAll('.links').remove();
  svg.select('.zoom-group').selectAll('.nodes').remove();
  svg.select('.zoom-group').selectAll('.labels').remove();
  
  const g = svg.select('.zoom-group');
  
  // Utwórz nową symulację
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-800))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 10));
  
  // Linki
  linkElements = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link');
  
  // Węzły
  nodeElements = g.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('class', d => `node ${d.type}-node`)
    .attr('r', getNodeRadius)
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('click', handleNodeClick)
    .on('mouseover', showTooltip)
    .on('mouseout', hideTooltip);
  
  // Etykiety
  labelElements = g.append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('class', 'node-label')
    .attr('dy', d => getNodeRadius(d) + 20)
    .text(d => truncateText(d.name, 15));
  
  // Aktualizacja pozycji podczas symulacji
  simulation.on('tick', function() {
    if (linkElements) {
      linkElements
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    }
    
    if (nodeElements) {
      nodeElements
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }
    
    if (labelElements) {
      labelElements
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    }
  });
  
  // Aktualizuj licznik widocznych węzłów
  const visibleNodesEl = document.getElementById('visible-nodes');
  if (visibleNodesEl) {
    visibleNodesEl.textContent = nodes.length;
  }
}

function getNodeRadius(d) {
  switch (d.type) {
    case 'company': return 30;
    case 'sales': return 20;
    case 'implementation': return 20;
    default: return 15;
  }
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function handleNodeClick(event, d) {
  event.stopPropagation();
  console.log('Kliknięto węzeł:', d);
  
  selectedNode = d;
  
  // Aktualizuj klasę selected
  if (nodeElements) {
    nodeElements.classed('selected', node => node.id === d.id);
  }
  
  // Pokaż rozszerzone powiązania
  showExpandedView(d.id);
  
  // Pokaż szczegóły
  showNodeDetails(d);
}

function showNodeDetails(node) {
  console.log('Pokazuję szczegóły dla:', node);
  
  const noSelection = document.getElementById('no-selection');
  const selectionDetails = document.getElementById('selection-details');
  
  if (!noSelection || !selectionDetails) {
    console.error('Nie znaleziono elementów panelu szczegółów');
    return;
  }
  
  noSelection.classList.add('hidden');
  selectionDetails.classList.remove('hidden');
  
  let detailsHTML = '';
  
  if (node.type === 'company') {
    const relatedCaregivers = getRelatedCaregivers(node.data.id);
    
    detailsHTML = `
      <h4>Firma: ${node.data.name}</h4>
      <div class="detail-section">
        <div class="detail-item">
          <span class="detail-label">Branża:</span>
          <span class="detail-value">${node.data.industry}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Lokalizacja:</span>
          <span class="detail-value">${node.data.location}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wielkość:</span>
          <span class="detail-value">${node.data.size}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span class="detail-value">${node.data.status}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">NIP:</span>
          <span class="detail-value">${node.data.nip}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wartość obrotu z ITE:</span>
          <span class="detail-value">${formatCurrency(node.data.wartość_obrotu_ite)}</span>
        </div>
      </div>
      <h4>Opiekunowie (${relatedCaregivers.length})</h4>
      <ul class="connections-list">
        ${relatedCaregivers.map(caregiver => `
          <li class="connection-item" onclick="focusOnCaregiver(${caregiver.id})">
            <div class="connection-name">${caregiver.firstName} ${caregiver.lastName}</div>
            <div class="connection-details">${caregiver.type} • ${caregiver.specialization}</div>
          </li>
        `).join('')}
      </ul>
    `;
  } else {
    const relatedCompanies = getRelatedCompanies(node.data.id);
    const caregiverStats = calculateCaregiverStats(node.data.id);
    
    detailsHTML = `
      <h4>Opiekun: ${node.data.firstName} ${node.data.lastName}</h4>
      <div class="detail-section">
        <div class="detail-item">
          <span class="detail-label">Typ:</span>
          <span class="detail-value">${node.data.type}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Region:</span>
          <span class="detail-value">${node.data.region}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Doświadczenie:</span>
          <span class="detail-value">${node.data.experience}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Specjalizacja:</span>
          <span class="detail-value">${node.data.specialization}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${node.data.email}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Ilość przypisanych firm:</span>
          <span class="detail-value">${caregiverStats.ilość_firm}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Suma obrotu obsługiwanych firm:</span>
          <span class="detail-value">${formatCurrency(caregiverStats.suma_obrotu)}</span>
        </div>
      </div>
      <h4>Firmy (${relatedCompanies.length})</h4>
      <ul class="connections-list">
        ${relatedCompanies.map(company => `
          <li class="connection-item" onclick="focusOnCompany(${company.id})">
            <div class="connection-name">${company.name}</div>
            <div class="connection-details">${company.industry} • ${company.location} • ${formatCurrency(company.wartość_obrotu_ite)}</div>
          </li>
        `).join('')}
      </ul>
    `;
  }
  
  selectionDetails.innerHTML = detailsHTML;
}

function getRelatedCaregivers(companyId) {
  return appData.relationships
    .filter(rel => rel.companyId === companyId)
    .map(rel => appData.caregivers.find(c => c.id === rel.caregiverId))
    .filter(caregiver => caregiver && shouldShowCaregiver(caregiver));
}

function getRelatedCompanies(caregiverId) {
  return appData.relationships
    .filter(rel => rel.caregiverId === caregiverId)
    .map(rel => appData.companies.find(c => c.id === rel.companyId))
    .filter(company => company);
}

// Funkcje globalne dla onclick
window.focusOnCaregiver = function(caregiverId) {
  const nodeId = `caregiver_${caregiverId}`;
  const caregiver = appData.caregivers.find(c => c.id === caregiverId);
  if (caregiver && shouldShowCaregiver(caregiver)) {
    const caregiverType = getCaregiverType(caregiver.type);
    const nodeData = {
      id: nodeId,
      type: caregiverType,
      name: `${caregiver.firstName} ${caregiver.lastName}`,
      data: caregiver
    };
    selectedNode = nodeData;
    showExpandedView(nodeId);
    showNodeDetails(nodeData);
  }
};

window.focusOnCompany = function(companyId) {
  const nodeId = `company_${companyId}`;
  const company = appData.companies.find(c => c.id === companyId);
  if (company) {
    const nodeData = {
      id: nodeId,
      type: 'company',
      name: company.name,
      data: company
    };
    selectedNode = nodeData;
    showExpandedView(nodeId);
    showNodeDetails(nodeData);
  }
};

function clearSelection() {
  selectedNode = null;
  showCompaniesView();
  clearDetailsPanel();
}

function clearDetailsPanel() {
  const noSelection = document.getElementById('no-selection');
  const selectionDetails = document.getElementById('selection-details');
  
  if (noSelection) noSelection.classList.remove('hidden');
  if (selectionDetails) selectionDetails.classList.add('hidden');
}

function refreshVisualization() {
  if (currentView === 'companies') {
    showCompaniesView();
  } else if (selectedNode) {
    showExpandedView(selectedNode.id);
  }
}

function resetView() {
  if (svg && zoomBehavior) {
    svg.transition()
      .duration(750)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  }
  showCompaniesView();
}

function centerView() {
  if (svg && zoomBehavior) {
    svg.transition()
      .duration(750)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  }
}

function updateStats() {
  const totalCompanies = appData.companies.length;
  const salesCaregivers = appData.caregivers.filter(c => c.type === 'handlowy').length;
  const implCaregivers = appData.caregivers.filter(c => c.type === 'wdrożeniowy').length;
  
  // Oblicz łączny obrót i średnią
  const totalTurnover = appData.companies.reduce((sum, company) => sum + (company.wartość_obrotu_ite || 0), 0);
  const averageTurnover = totalCompanies > 0 ? totalTurnover / totalCompanies : 0;
  
  const totalCompaniesEl = document.getElementById('total-companies');
  const totalSalesEl = document.getElementById('total-sales');
  const totalImplEl = document.getElementById('total-impl');
  const totalTurnoverEl = document.getElementById('total-turnover');
  const averageTurnoverEl = document.getElementById('average-turnover');
  
  if (totalCompaniesEl) totalCompaniesEl.textContent = totalCompanies;
  if (totalSalesEl) totalSalesEl.textContent = salesCaregivers;
  if (totalImplEl) totalImplEl.textContent = implCaregivers;
  if (totalTurnoverEl) totalTurnoverEl.textContent = formatCurrency(totalTurnover);
  if (averageTurnoverEl) averageTurnoverEl.textContent = formatCurrency(averageTurnover);
}

function showTooltip(event, d) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;
  
  let content = '';
  if (d.type === 'company') {
    content = `
      <h4>${d.data.name}</h4>
      <p><strong>Branża:</strong> ${d.data.industry}</p>
      <p><strong>Lokalizacja:</strong> ${d.data.location}</p>
      <p><strong>Status:</strong> ${d.data.status}</p>
      <p><strong>NIP:</strong> ${d.data.nip}</p>
      <p><strong>Obrót:</strong> ${formatCurrency(d.data.wartość_obrotu_ite)}</p>
    `;
  } else {
    const caregiverStats = calculateCaregiverStats(d.data.id);
    content = `
      <h4>${d.data.firstName} ${d.data.lastName}</h4>
      <p><strong>Typ:</strong> ${d.data.type}</p>
      <p><strong>Specjalizacja:</strong> ${d.data.specialization}</p>
      <p><strong>Region:</strong> ${d.data.region}</p>
      <p><strong>Firm:</strong> ${caregiverStats.ilość_firm}</p>
      <p><strong>Suma obrotu:</strong> ${formatCurrency(caregiverStats.suma_obrotu)}</p>
    `;
  }
  
  tooltip.innerHTML = `<div class="tooltip-content">${content}</div>`;
  tooltip.style.left = (event.pageX + 10) + 'px';
  tooltip.style.top = (event.pageY - 10) + 'px';
  tooltip.classList.remove('hidden');
  tooltip.classList.add('visible');
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) {
    tooltip.classList.remove('visible');
    tooltip.classList.add('hidden');
  }
}

function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) {
    if (show) {
      loading.classList.remove('hidden');
    } else {
      loading.classList.add('hidden');
    }
  }
}

function showMessage(text, type = 'info') {
  const container = document.getElementById('message-container');
  if (!container) return;
  
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;
  
  container.appendChild(message);
  
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

// Funkcje drag and drop dla D3
function dragstarted(event, d) {
  if (!event.active && simulation) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active && simulation) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// Responsywność
window.addEventListener('resize', function() {
  const container = document.getElementById('network-visualization');
  if (!container || !svg) return;
  
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;
  
  if (newWidth !== width || newHeight !== height) {
    width = newWidth;
    height = newHeight;
    
    svg.attr('width', width).attr('height', height);
    if (simulation) {
      simulation.force('center', d3.forceCenter(width / 2, height / 2));
      simulation.restart();
    }
  }
});

// Obsługa kliknięcia w tło SVG
document.addEventListener('click', function(event) {
  if (event.target.closest('#network-svg') && !event.target.closest('.node')) {
    if (currentView === 'expanded') {
      resetView();
    }
  }
});