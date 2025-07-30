// Dane domyślne aplikacji
let appData = {
  companies: [
    {
      ID_Firmy: 1,
      Nazwa_Firmy: "IT Excellence S.A.",
      Branża: "Technologie IT",
      Lokalizacja: "Wrocław",
      Wielkość_Firmy: "Duża (500+ pracowników)",
      Status: "Aktywny"
    },
    {
      ID_Firmy: 2,
      Nazwa_Firmy: "TechnoSoft Sp. z o.o.",
      Branża: "Oprogramowanie",
      Lokalizacja: "Warszawa",
      Wielkość_Firmy: "Średnia (50-250 pracowników)",
      Status: "Aktywny"
    },
    {
      ID_Firmy: 3,
      Nazwa_Firmy: "Digital Solutions Ltd.",
      Branża: "Usługi cyfrowe",
      Lokalizacja: "Kraków",
      Wielkość_Firmy: "Mała (10-50 pracowników)",
      Status: "Potencjalny"
    },
    {
      ID_Firmy: 4,
      Nazwa_Firmy: "InnovateCorp S.A.",
      Branża: "Innowacje technologiczne",
      Lokalizacja: "Gdańsk",
      Wielkość_Firmy: "Duża (500+ pracowników)",
      Status: "Aktywny"
    },
    {
      ID_Firmy: 5,
      Nazwa_Firmy: "DataFlow Systems",
      Branża: "Analiza danych",
      Lokalizacja: "Poznań",
      Wielkość_Firmy: "Średnia (50-250 pracowników)",
      Status: "Aktywny"
    },
    {
      ID_Firmy: 6,
      Nazwa_Firmy: "CloudTech Poland",
      Branża: "Chmura obliczeniowa",
      Lokalizacja: "Warszawa",
      Wielkość_Firmy: "Mała (10-50 pracowników)",
      Status: "Potencjalny"
    },
    {
      ID_Firmy: 7,
      Nazwa_Firmy: "SmartBusiness S.A.",
      Branża: "Rozwiązania biznesowe",
      Lokalizacja: "Wrocław",
      Wielkość_Firmy: "Średnia (50-250 pracowników)",
      Status: "Aktywny"
    },
    {
      ID_Firmy: 8,
      Nazwa_Firmy: "NextGen Software",
      Branża: "Tworzenie oprogramowania",
      Lokalizacja: "Kraków",
      Wielkość_Firmy: "Mała (10-50 pracowników)",
      Status: "Aktywny"
    }
  ],
  managers: [
    {
      ID_Opiekuna: 101,
      Imię_Nazwisko: "Anna Kowalska",
      Typ_Opiekuna: "Handlowy",
      Region: "Dolnośląskie",
      Doświadczenie_Lata: 8,
      Specjalizacja: "Enterprise Sales",
      Email: "anna.kowalska@itexcellence.pl"
    },
    {
      ID_Opiekuna: 102,
      Imię_Nazwisko: "Marek Nowak",
      Typ_Opiekuna: "Wdrożeniowy",
      Region: "Mazowieckie",
      Doświadczenie_Lata: 6,
      Specjalizacja: "Systemy ERP",
      Email: "marek.nowak@itexcellence.pl"
    },
    {
      ID_Opiekuna: 103,
      Imię_Nazwisko: "Katarzyna Wiśniewska",
      Typ_Opiekuna: "Handlowy",
      Region: "Małopolskie",
      Doświadczenie_Lata: 5,
      Specjalizacja: "SME Sales",
      Email: "katarzyna.wisniewska@itexcellence.pl"
    },
    {
      ID_Opiekuna: 104,
      Imię_Nazwisko: "Tomasz Kowalczyk",
      Typ_Opiekuna: "Wdrożeniowy",
      Region: "Pomorskie",
      Doświadczenie_Lata: 7,
      Specjalizacja: "Workflow365",
      Email: "tomasz.kowalczyk@itexcellence.pl"
    },
    {
      ID_Opiekuna: 105,
      Imię_Nazwisko: "Agnieszka Jankowska",
      Typ_Opiekuna: "Handlowy",
      Region: "Wielkopolskie",
      Doświadczenie_Lata: 4,
      Specjalizacja: "Cloud Solutions",
      Email: "agnieszka.jankowska@itexcellence.pl"
    },
    {
      ID_Opiekuna: 106,
      Imię_Nazwisko: "Paweł Dąbrowski",
      Typ_Opiekuna: "Wdrożeniowy",
      Region: "Dolnośląskie",
      Doświadczenie_Lata: 9,
      Specjalizacja: "Business Intelligence",
      Email: "pawel.dabrowski@itexcellence.pl"
    }
  ],
  connections: [
    {"ID_Firmy": 1, "ID_Opiekuna": 101},
    {"ID_Firmy": 1, "ID_Opiekuna": 106},
    {"ID_Firmy": 2, "ID_Opiekuna": 102},
    {"ID_Firmy": 3, "ID_Opiekuna": 103},
    {"ID_Firmy": 4, "ID_Opiekuna": 104},
    {"ID_Firmy": 5, "ID_Opiekuna": 105},
    {"ID_Firmy": 6, "ID_Opiekuna": 102},
    {"ID_Firmy": 7, "ID_Opiekuna": 101},
    {"ID_Firmy": 7, "ID_Opiekuna": 106},
    {"ID_Firmy": 8, "ID_Opiekuna": 103}
  ]
};

// Zmienne globalne
let svg, simulation, nodes, links;
let nodeElements, linkElements, labelElements;
let selectedNode = null;
let currentView = 'companies'; // 'companies', 'expanded'
let width, height;
let zoomBehavior;

// Filtry
let showSalesManagers = true;
let showImplementationManagers = true;

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicjalizacja aplikacji...');
  setupEventListeners();
  updateStats();
  initializeVisualization();
  showMessage('Aplikacja załadowana pomyślnie!', 'success');
});

function setupEventListeners() {
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
      console.log('Otwieranie dialogu pliku...');
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
  if (!file) {
    console.log('Nie wybrano pliku');
    return;
  }
  
  console.log('Wczytywanie pliku:', file.name);
  showLoading(true);
  showMessage('Wczytywanie pliku Excel...', 'info');
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      console.log('Dostępne arkusze:', workbook.SheetNames);
      
      // Sprawdź czy arkusze istnieją
      const requiredSheets = ['Firmy', 'Opiekunowie', 'Powiązania'];
      const availableSheets = workbook.SheetNames;
      
      const missingSheets = requiredSheets.filter(sheet => !availableSheets.includes(sheet));
      if (missingSheets.length > 0) {
        showMessage(`Brakuje arkuszy: ${missingSheets.join(', ')}`, 'error');
        showLoading(false);
        return;
      }
      
      // Wczytaj dane z arkuszy
      const companies = XLSX.utils.sheet_to_json(workbook.Sheets['Firmy']);
      const managers = XLSX.utils.sheet_to_json(workbook.Sheets['Opiekunowie']);
      const connections = XLSX.utils.sheet_to_json(workbook.Sheets['Powiązania']);
      
      console.log('Wczytano firmy:', companies.length);
      console.log('Wczytano opiekunów:', managers.length);
      console.log('Wczytano powiązania:', connections.length);
      
      // Walidacja danych
      if (companies.length === 0 || managers.length === 0) {
        showMessage('Plik Excel nie zawiera wystarczających danych', 'error');
        showLoading(false);
        return;
      }
      
      // Aktualizuj dane aplikacji
      appData = {
        companies: companies,
        managers: managers,
        connections: connections
      };
      
      // Odśwież wizualizację
      clearSelection();
      refreshVisualization();
      updateStats();
      
      showMessage(`Wczytano: ${companies.length} firm, ${managers.length} opiekunów`, 'success');
      showLoading(false);
      
      // Wyczyść input
      event.target.value = '';
      
    } catch (error) {
      console.error('Błąd podczas wczytywania Excel:', error);
      showMessage('Błąd podczas wczytywania pliku Excel: ' + error.message, 'error');
      showLoading(false);
    }
  };
  
  reader.onerror = function(error) {
    console.error('Błąd odczytu pliku:', error);
    showMessage('Błąd podczas odczytu pliku', 'error');
    showLoading(false);
  };
  
  reader.readAsArrayBuffer(file);
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
  
  // Defs dla gradientów
  const defs = svg.append('defs');
  
  // Gradient dla linków
  const gradient = defs.append('linearGradient')
    .attr('id', 'link-gradient')
    .attr('gradientUnits', 'userSpaceOnUse');
  
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#3B82F6')
    .attr('stop-opacity', 0.8);
  
  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#1877F2')
    .attr('stop-opacity', 0.8);
  
  showCompaniesView();
}

function showCompaniesView() {
  console.log('Pokazuję widok firm');
  currentView = 'companies';
  selectedNode = null;
  
  // Przygotuj dane - tylko firmy
  const graphData = {
    nodes: appData.companies.map(company => ({
      id: `company_${company.ID_Firmy}`,
      type: 'company',
      name: company.Nazwa_Firmy,
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
  
  // Sprawdź typ centralnego węzła
  if (centerNodeId.startsWith('company_')) {
    const companyId = parseInt(centerNodeId.replace('company_', ''));
    const company = appData.companies.find(c => c.ID_Firmy === companyId);
    
    if (company) {
      // Dodaj firmę
      nodes.push({
        id: centerNodeId,
        type: 'company',
        name: company.Nazwa_Firmy,
        data: company,
        fx: width / 2,
        fy: height / 2
      });
      
      // Znajdź powiązanych opiekunów
      const relatedManagers = appData.connections
        .filter(rel => rel.ID_Firmy === companyId)
        .map(rel => appData.managers.find(m => m.ID_Opiekuna === rel.ID_Opiekuna))
        .filter(manager => manager && shouldShowManager(manager));
      
      console.log('Powiązani opiekunowie dla firmy', companyId, ':', relatedManagers);
      
      // Dodaj opiekunów
      relatedManagers.forEach(manager => {
        const managerId = `manager_${manager.ID_Opiekuna}`;
        const managerType = getManagerType(manager.Typ_Opiekuna);
        nodes.push({
          id: managerId,
          type: managerType,
          name: manager.Imię_Nazwisko,
          data: manager
        });
        
        // Dodaj link
        links.push({
          source: centerNodeId,
          target: managerId,
          type: 'assignment'
        });
      });
    }
  } else if (centerNodeId.startsWith('manager_')) {
    const managerId = parseInt(centerNodeId.replace('manager_', ''));
    const manager = appData.managers.find(m => m.ID_Opiekuna === managerId);
    
    if (manager && shouldShowManager(manager)) {
      // Dodaj opiekuna
      const managerType = getManagerType(manager.Typ_Opiekuna);
      nodes.push({
        id: centerNodeId,
        type: managerType,
        name: manager.Imię_Nazwisko,
        data: manager,
        fx: width / 2,
        fy: height / 2
      });
      
      // Znajdź powiązane firmy
      const relatedCompanies = appData.connections
        .filter(rel => rel.ID_Opiekuna === managerId)
        .map(rel => appData.companies.find(c => c.ID_Firmy === rel.ID_Firmy))
        .filter(company => company);
      
      console.log('Powiązane firmy dla opiekuna', managerId, ':', relatedCompanies);
      
      // Dodaj firmy
      relatedCompanies.forEach(company => {
        const companyId = `company_${company.ID_Firmy}`;
        nodes.push({
          id: companyId,
          type: 'company',
          name: company.Nazwa_Firmy,
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

function getManagerType(typOpiekuna) {
  const type = typOpiekuna.toLowerCase();
  if (type === 'handlowy') {
    return 'sales';
  } else if (type === 'wdrożeniowy') {
    return 'implementation';
  }
  return 'manager';
}

function shouldShowManager(manager) {
  const type = manager.Typ_Opiekuna.toLowerCase();
  if (type === 'handlowy') {
    return showSalesManagers;
  } else if (type === 'wdrożeniowy') {
    return showImplementationManagers;
  }
  return false;
}

function updateVisualization(graphData) {
  nodes = graphData.nodes;
  links = graphData.links;
  
  console.log(`Aktualizacja wizualizacji: ${nodes.length} węzłów, ${links.length} linków`);
  console.log('Typy węzłów:', nodes.map(n => `${n.name}: ${n.type}`));
  
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
  
  // Pokaź szczegóły - wywołaj natychmiast
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
    const relatedManagers = getRelatedManagers(node.data.ID_Firmy);
    
    detailsHTML = `
      <h4>Firma: ${node.data.Nazwa_Firmy}</h4>
      <div class="detail-section">
        <div class="detail-item">
          <span class="detail-label">Branża:</span>
          <span class="detail-value">${node.data.Branża}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Lokalizacja:</span>
          <span class="detail-value">${node.data.Lokalizacja}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wielkość:</span>
          <span class="detail-value">${node.data.Wielkość_Firmy}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span class="detail-value">${node.data.Status}</span>
        </div>
      </div>
      <h4>Opiekunowie (${relatedManagers.length})</h4>
      <ul class="connections-list">
        ${relatedManagers.map(manager => `
          <li class="connection-item" onclick="focusOnManager(${manager.ID_Opiekuna})">
            <div class="connection-name">${manager.Imię_Nazwisko}</div>
            <div class="connection-details">${manager.Typ_Opiekuna} • ${manager.Specjalizacja}</div>
          </li>
        `).join('')}
      </ul>
    `;
  } else {
    const relatedCompanies = getRelatedCompanies(node.data.ID_Opiekuna);
    
    detailsHTML = `
      <h4>Opiekun: ${node.data.Imię_Nazwisko}</h4>
      <div class="detail-section">
        <div class="detail-item">
          <span class="detail-label">Typ:</span>
          <span class="detail-value">${node.data.Typ_Opiekuna}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Region:</span>
          <span class="detail-value">${node.data.Region}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Doświadczenie:</span>
          <span class="detail-value">${node.data.Doświadczenie_Lata} lat</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Specjalizacja:</span>
          <span class="detail-value">${node.data.Specjalizacja}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${node.data.Email}</span>
        </div>
      </div>
      <h4>Firmy (${relatedCompanies.length})</h4>
      <ul class="connections-list">
        ${relatedCompanies.map(company => `
          <li class="connection-item" onclick="focusOnCompany(${company.ID_Firmy})">
            <div class="connection-name">${company.Nazwa_Firmy}</div>
            <div class="connection-details">${company.Branża} • ${company.Lokalizacja}</div>
          </li>
        `).join('')}
      </ul>
    `;
  }
  
  selectionDetails.innerHTML = detailsHTML;
}

function getRelatedManagers(companyId) {
  return appData.connections
    .filter(rel => rel.ID_Firmy === companyId)
    .map(rel => appData.managers.find(m => m.ID_Opiekuna === rel.ID_Opiekuna))
    .filter(manager => manager && shouldShowManager(manager));
}

function getRelatedCompanies(managerId) {
  return appData.connections
    .filter(rel => rel.ID_Opiekuna === managerId)
    .map(rel => appData.companies.find(c => c.ID_Firmy === rel.ID_Firmy))
    .filter(company => company);
}

// Funkcje globalne dla onclick
window.focusOnManager = function(managerId) {
  const nodeId = `manager_${managerId}`;
  const manager = appData.managers.find(m => m.ID_Opiekuna === managerId);
  if (manager && shouldShowManager(manager)) {
    const managerType = getManagerType(manager.Typ_Opiekuna);
    const nodeData = {
      id: nodeId,
      type: managerType,
      name: manager.Imię_Nazwisko,
      data: manager
    };
    selectedNode = nodeData;
    showExpandedView(nodeId);
    showNodeDetails(nodeData);
  }
};

window.focusOnCompany = function(companyId) {
  const nodeId = `company_${companyId}`;
  const company = appData.companies.find(c => c.ID_Firmy === companyId);
  if (company) {
    const nodeData = {
      id: nodeId,
      type: 'company',
      name: company.Nazwa_Firmy,
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
  const salesManagers = appData.managers.filter(m => m.Typ_Opiekuna.toLowerCase() === 'handlowy').length;
  const implManagers = appData.managers.filter(m => m.Typ_Opiekuna.toLowerCase() === 'wdrożeniowy').length;
  
  const totalCompaniesEl = document.getElementById('total-companies');
  const totalSalesEl = document.getElementById('total-sales');
  const totalImplEl = document.getElementById('total-impl');
  
  if (totalCompaniesEl) totalCompaniesEl.textContent = totalCompanies;
  if (totalSalesEl) totalSalesEl.textContent = salesManagers;
  if (totalImplEl) totalImplEl.textContent = implManagers;
}

function showTooltip(event, d) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;
  
  let content = '';
  if (d.type === 'company') {
    content = `
      <h4>${d.data.Nazwa_Firmy}</h4>
      <p><strong>Branża:</strong> ${d.data.Branża}</p>
      <p><strong>Lokalizacja:</strong> ${d.data.Lokalizacja}</p>
      <p><strong>Status:</strong> ${d.data.Status}</p>
    `;
  } else {
    content = `
      <h4>${d.data.Imię_Nazwisko}</h4>
      <p><strong>Typ:</strong> ${d.data.Typ_Opiekuna}</p>
      <p><strong>Specjalizacja:</strong> ${d.data.Specjalizacja}</p>
      <p><strong>Region:</strong> ${d.data.Region}</p>
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