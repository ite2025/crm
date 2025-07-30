// Dane z JSON użytkownika
let appData = {
  companies: [
    {
      id: "f1",
      nazwa: "IT Excellence S.A.",
      branza: "IT/Software", 
      lokalizacja: "Wrocław",
      wielkosc: "Duża",
      status: "Aktywna",
      obrot_z_ite: "3,2 mln PLN"
    },
    {
      id: "f2", 
      nazwa: "TechSoft Sp. z o.o.",
      branza: "IT/Consulting",
      lokalizacja: "Kraków", 
      wielkosc: "Średnia",
      status: "Aktywna",
      obrot_z_ite: "1,8 mln PLN"
    },
    {
      id: "f3",
      nazwa: "DataCorp Ltd.", 
      branza: "Big Data",
      lokalizacja: "Warszawa",
      wielkosc: "Duża", 
      status: "Potencjalna",
      obrot_z_ite: "4,5 mln PLN"
    },
    {
      id: "f4",
      nazwa: "CloudNet Systems",
      branza: "Cloud Services", 
      lokalizacja: "Gdańsk",
      wielkosc: "Średnia",
      status: "Aktywna", 
      obrot_z_ite: "2,1 mln PLN"
    },
    {
      id: "f5",
      nazwa: "WebDev Agency",
      branza: "Web Development",
      lokalizacja: "Poznań", 
      wielkosc: "Mała",
      status: "Aktywna",
      obrot_z_ite: "850 tys. PLN"
    }
  ],
  managers: [
    {
      id: "oh1",
      imie: "Anna", 
      nazwisko: "Kowalska",
      typ: "handlowy",
      region: "Wrocław",
      doswiadczenie: "5 lat", 
      specjalizacja: "Enterprise Sales",
      email: "anna.kowalska@ite.pl"
    },
    {
      id: "oh2",
      imie: "Piotr",
      nazwisko: "Nowak", 
      typ: "handlowy",
      region: "Kraków", 
      doswiadczenie: "3 lata",
      specjalizacja: "SMB Sales",
      email: "piotr.nowak@ite.pl"
    },
    {
      id: "ow1", 
      imie: "Michał",
      nazwisko: "Wiśniewski",
      typ: "wdrożeniowy",
      region: "Warszawa",
      doswiadczenie: "7 lat",
      specjalizacja: "Technical Implementation", 
      email: "michal.wisniewski@ite.pl"
    },
    {
      id: "ow2",
      imie: "Katarzyna",
      nazwisko: "Zielińska", 
      typ: "wdrożeniowy",
      region: "Gdańsk",
      doswiadczenie: "4 lata",
      specjalizacja: "Project Management",
      email: "katarzyna.zielinska@ite.pl"
    }
  ],
  relationships: [
    {"firma_id": "f1", "opiekun_id": "oh1"},
    {"firma_id": "f1", "opiekun_id": "ow1"}, 
    {"firma_id": "f2", "opiekun_id": "oh2"},
    {"firma_id": "f3", "opiekun_id": "oh1"},
    {"firma_id": "f3", "opiekun_id": "ow2"},
    {"firma_id": "f4", "opiekun_id": "oh1"},
    {"firma_id": "f5", "opiekun_id": "oh2"}
  ]
};

// Zmienne globalne
let svg, simulation, nodes, links;
let nodeElements, linkElements, labelElements;
let selectedNode = null;
let currentView = 'companies'; // 'companies', 'expanded'
let width, height;
let zoomBehavior;
let searchQuery = '';

// Filtry
let showSalesManagers = true;
let showImplementationManagers = true;

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicjalizacja aplikacji...');
  setupEventListeners();
  updateStats();
  initializeVisualization();
  showMessage('Aplikacja załadowana pomyślnie! Kliknij na firmę aby zobaczyć jej opiekunów.', 'success');
});

function setupEventListeners() {
  // Wyszukiwanie
  const searchInput = document.getElementById('search-input');
  const clearSearch = document.getElementById('clear-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      searchQuery = e.target.value.toLowerCase().trim();
      console.log('Wyszukiwanie:', searchQuery);
      
      if (clearSearch) {
        if (searchQuery) {
          clearSearch.classList.remove('hidden');
        } else {
          clearSearch.classList.add('hidden');
        }
      }
      
      performSearch();
    });
  }
  
  if (clearSearch) {
    clearSearch.addEventListener('click', function() {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        clearSearch.classList.add('hidden');
        performSearch();
        searchInput.focus();
      }
    });
  }

  // Checkbox filters
  const showSalesCheckbox = document.getElementById('show-sales');
  const showImplCheckbox = document.getElementById('show-implementation');
  const showAllCheckbox = document.getElementById('show-all');
  
  if (showSalesCheckbox) {
    showSalesCheckbox.addEventListener('change', function() {
      showSalesManagers = this.checked;
      updateShowAllCheckbox();
      refreshVisualization();
    });
  }
  
  if (showImplCheckbox) {
    showImplCheckbox.addEventListener('change', function() {
      showImplementationManagers = this.checked;
      updateShowAllCheckbox();
      refreshVisualization();
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
    });
  }
  
  // Excel upload - naprawione
  const loadExcelBtn = document.getElementById('load-excel-btn');
  const excelFile = document.getElementById('excel-file');
  
  if (loadExcelBtn && excelFile) {
    loadExcelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Kliknięto przycisk Excel - otwieranie dialogu...');
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

function performSearch() {
  console.log('Wykonuję wyszukiwanie dla:', searchQuery);
  
  if (!searchQuery) {
    // Usuń podświetlenia
    if (nodeElements) {
      nodeElements.classed('highlighted', false);
    }
    if (labelElements) {
      labelElements.classed('highlighted', false);
    }
    showMessage('Wyszukiwanie wyczyszczone', 'info');
    return;
  }
  
  const matchingNodes = [];
  
  // Przeszukaj firmy
  appData.companies.forEach(company => {
    if (company.nazwa.toLowerCase().includes(searchQuery)) {
      matchingNodes.push(`company_${company.id}`);
      console.log('Znaleziono firmę:', company.nazwa);
    }
  });
  
  // Przeszukaj opiekunów
  appData.managers.forEach(manager => {
    const fullName = `${manager.imie} ${manager.nazwisko}`.toLowerCase();
    if (fullName.includes(searchQuery) || 
        manager.imie.toLowerCase().includes(searchQuery) ||
        manager.nazwisko.toLowerCase().includes(searchQuery)) {
      matchingNodes.push(`manager_${manager.id}`);
      console.log('Znaleziono opiekuna:', fullName);
    }
  });
  
  console.log('Wszystkie znalezione węzły:', matchingNodes);
  
  // Podświetl znalezione węzły
  if (nodeElements && nodes) {
    nodeElements.classed('highlighted', d => {
      const isMatch = matchingNodes.includes(d.id);
      if (isMatch) console.log('Podświetlam węzeł:', d.id, d.name);
      return isMatch;
    });
  }
  if (labelElements && nodes) {
    labelElements.classed('highlighted', d => matchingNodes.includes(d.id));
  }
  
  // Komunikat o wynikach
  if (matchingNodes.length > 0) {
    showMessage(`Znaleziono ${matchingNodes.length} wyników dla "${searchQuery}"`, 'success');
    
    // Jeśli znaleziono dokładnie jeden element, pokaż jego szczegóły
    if (matchingNodes.length === 1) {
      const nodeId = matchingNodes[0];
      const nodeData = nodes ? nodes.find(n => n.id === nodeId) : null;
      if (nodeData) {
        setTimeout(() => {
          selectedNode = nodeData;
          showExpandedView(nodeId);
          showNodeDetails(nodeData);
        }, 500);
      }
    }
  } else {
    showMessage(`Nie znaleziono wyników dla "${searchQuery}"`, 'warning');
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
  
  console.log('Przetwarzanie pliku Excel:', file.name);
  showMessage('Wczytywanie pliku Excel...', 'info');
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      console.log('Odczytywanie danych pliku...');
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      console.log('Dostępne arkusze:', workbook.SheetNames);
      
      // Sprawdź czy arkusze istnieją
      const requiredSheets = ['Firmy', 'Opiekunowie', 'Powiązania'];
      const availableSheets = workbook.SheetNames;
      
      const missingSheets = requiredSheets.filter(sheet => !availableSheets.includes(sheet));
      if (missingSheets.length > 0) {
        showMessage(`Brakuje arkuszy: ${missingSheets.join(', ')}. Wymagane arkusze: Firmy, Opiekunowie, Powiązania`, 'error');
        event.target.value = '';
        return;
      }
      
      console.log('Parsowanie arkuszy...');
      
      // Wczytaj dane z arkuszy
      const companies = XLSX.utils.sheet_to_json(workbook.Sheets['Firmy']);
      const managers = XLSX.utils.sheet_to_json(workbook.Sheets['Opiekunowie']);
      const relationships = XLSX.utils.sheet_to_json(workbook.Sheets['Powiązania']);
      
      console.log('Wczytano firmy:', companies.length, companies);
      console.log('Wczytano opiekunów:', managers.length, managers);
      console.log('Wczytano powiązania:', relationships.length, relationships);
      
      // Walidacja danych
      if (companies.length === 0) {
        showMessage('Arkusz "Firmy" jest pusty lub nie zawiera danych', 'error');
        event.target.value = '';
        return;
      }
      
      if (managers.length === 0) {
        showMessage('Arkusz "Opiekunowie" jest pusty lub nie zawiera danych', 'error');
        event.target.value = '';
        return;
      }
      
      // Przekształć dane do formatu aplikacji
      const transformedData = {
        companies: companies.map((company, index) => ({
          id: `f${index + 1}`,
          nazwa: company.Nazwa || company.nazwa || `Firma ${index + 1}`,
          branza: company.Branża || company.branza || 'Nie podano',
          lokalizacja: company.Lokalizacja || company.lokalizacja || 'Nie podano',
          wielkosc: company.Wielkość || company.wielkosc || 'Nie podano', 
          status: company.Status || company.status || 'Aktywna',
          obrot_z_ite: company['Obrót z ITE'] || company.obrot_z_ite || 'Brak danych'
        })),
        managers: managers.map((manager, index) => ({
          id: `o${index + 1}`,
          imie: manager.Imię || manager.imie || 'Imię',
          nazwisko: manager.Nazwisko || manager.nazwisko || 'Nazwisko',
          typ: (manager.Typ || manager.typ || 'handlowy').toLowerCase(),
          region: manager.Region || manager.region || 'Nie podano',
          doswiadczenie: manager.Doświadczenie || manager.doswiadczenie || 'Nie podano',
          specjalizacja: manager.Specjalizacja || manager.specjalizacja || 'Nie podano',
          email: manager.Email || manager.email || 'brak@ite.pl'
        })),
        relationships: relationships.map(rel => ({
          firma_id: rel.firma_id || rel.ID_Firmy || rel.Firma_ID,
          opiekun_id: rel.opiekun_id || rel.ID_Opiekuna || rel.Opiekun_ID
        })).filter(rel => rel.firma_id && rel.opiekun_id)
      };
      
      console.log('Przekształcone dane:', transformedData);
      
      // Aktualizuj dane aplikacji
      appData = transformedData;
      
      // Wyczyść wyszukiwanie
      const searchInput = document.getElementById('search-input');
      const clearSearch = document.getElementById('clear-search');
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
      }
      if (clearSearch) {
        clearSearch.classList.add('hidden');
      }
      
      // Odśwież wizualizację
      clearSelection();
      refreshVisualization();
      updateStats();
      
      showMessage(`Pomyślnie wczytano: ${transformedData.companies.length} firm, ${transformedData.managers.length} opiekunów, ${transformedData.relationships.length} powiązań`, 'success');
      
      // Wyczyść input
      event.target.value = '';
      
    } catch (error) {
      console.error('Błąd podczas przetwarzania Excel:', error);
      showMessage('Błąd podczas wczytywania pliku Excel: ' + error.message, 'error');
      event.target.value = '';
    }
  };
  
  reader.onerror = function(error) {
    console.error('Błąd odczytu pliku:', error);
    showMessage('Błąd podczas odczytu pliku', 'error');
    event.target.value = '';
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
  
  // Natychmiast pokaż widok firm
  showCompaniesView();
}

function showCompaniesView() {
  console.log('Pokazuję widok firm - liczba firm:', appData.companies.length);
  currentView = 'companies';
  selectedNode = null;
  
  // Przygotuj dane - tylko firmy
  const graphData = {
    nodes: appData.companies.map(company => ({
      id: `company_${company.id}`,
      type: 'company',
      name: company.nazwa,
      data: company
    })),
    links: []
  };
  
  console.log('Dane grafu firm:', graphData);
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
    const companyId = centerNodeId.replace('company_', '');
    const company = appData.companies.find(c => c.id === companyId);
    
    if (company) {
      // Dodaj firmę w centrum
      nodes.push({
        id: centerNodeId,
        type: 'company',
        name: company.nazwa,
        data: company,
        fx: width / 2,
        fy: height / 2
      });
      
      // Znajdź powiązanych opiekunów
      const relatedManagers = appData.relationships
        .filter(rel => rel.firma_id === companyId)
        .map(rel => appData.managers.find(m => m.id === rel.opiekun_id))
        .filter(manager => manager && shouldShowManager(manager));
      
      console.log('Powiązani opiekunowie dla firmy:', company.nazwa, relatedManagers);
      
      // Dodaj opiekunów w okręgu wokół firmy
      relatedManagers.forEach((manager, index) => {
        const managerId = `manager_${manager.id}`;
        const angle = (2 * Math.PI * index) / relatedManagers.length;
        const radius = 150;
        
        nodes.push({
          id: managerId,
          type: manager.typ === 'handlowy' ? 'sales' : 'implementation',
          name: `${manager.imie} ${manager.nazwisko}`,
          data: manager,
          fx: width / 2 + Math.cos(angle) * radius,
          fy: height / 2 + Math.sin(angle) * radius
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
    const managerId = centerNodeId.replace('manager_', '');
    const manager = appData.managers.find(m => m.id === managerId);
    
    if (manager && shouldShowManager(manager)) {
      // Dodaj opiekuna w centrum
      nodes.push({
        id: centerNodeId,
        type: manager.typ === 'handlowy' ? 'sales' : 'implementation',
        name: `${manager.imie} ${manager.nazwisko}`,
        data: manager,
        fx: width / 2,
        fy: height / 2
      });
      
      // Znajdź powiązane firmy
      const relatedCompanies = appData.relationships
        .filter(rel => rel.opiekun_id === managerId)
        .map(rel => appData.companies.find(c => c.id === rel.firma_id))
        .filter(company => company);
      
      console.log('Powiązane firmy dla opiekuna:', `${manager.imie} ${manager.nazwisko}`, relatedCompanies);
      
      // Dodaj firmy w okręgu wokół opiekuna
      relatedCompanies.forEach((company, index) => {
        const companyId = `company_${company.id}`;
        const angle = (2 * Math.PI * index) / relatedCompanies.length;
        const radius = 150;
        
        nodes.push({
          id: companyId,
          type: 'company',
          name: company.nazwa,
          data: company,
          fx: width / 2 + Math.cos(angle) * radius,
          fy: height / 2 + Math.sin(angle) * radius
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

function shouldShowManager(manager) {
  if (manager.typ === 'handlowy') {
    return showSalesManagers;
  } else if (manager.typ === 'wdrożeniowy') {
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
    .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 15));
  
  // Linki
  if (links.length > 0) {
    linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link');
  }
  
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
    .text(d => truncateText(d.name, 20))
    .style('cursor', 'pointer')
    .on('click', handleNodeClick);
  
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
  
  // Ponownie zastosuj wyszukiwanie jeśli jest aktywne
  if (searchQuery) {
    setTimeout(() => performSearch(), 100);
  }
  
  // Aktualizuj licznik widocznych węzłów
  const visibleNodesEl = document.getElementById('visible-nodes');
  if (visibleNodesEl) {
    visibleNodesEl.textContent = nodes.length;
  }
}

function getNodeRadius(d) {
  switch (d.type) {
    case 'company': return 35;
    case 'sales': return 25;
    case 'implementation': return 25;
    default: return 20;
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
  console.log('Pokazuję szczegóły dla węzła:', node);
  
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
    const relatedManagers = getRelatedManagers(node.data.id);
    
    detailsHTML = `
      <h4>🏢 Firma: ${node.data.nazwa}</h4>
      <div class="detail-section">
        <div class="detail-item">
          <span class="detail-label">Branża:</span>
          <span class="detail-value">${node.data.branza}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Lokalizacja:</span>
          <span class="detail-value">${node.data.lokalizacja}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wielkość:</span>
          <span class="detail-value">${node.data.wielkosc}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span class="detail-value">${node.data.status}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Obrót z ITE:</span>
          <span class="detail-value"><strong>${node.data.obrot_z_ite}</strong></span>
        </div>
      </div>
      <h4>👥 Opiekunowie (${relatedManagers.length})</h4>
      <ul class="connections-list">
        ${relatedManagers.length > 0 ? relatedManagers.map(manager => `
          <li class="connection-item" onclick="focusOnManager('${manager.id}')">
            <div class="connection-name">${manager.imie} ${manager.nazwisko}</div>
            <div class="connection-details">${manager.typ.charAt(0).toUpperCase() + manager.typ.slice(1)} • ${manager.specjalizacja}</div>
          </li>
        `).join('') : '<li class="connection-item">Brak przypisanych opiekunów</li>'}
      </ul>
    `;
  } else {
    const relatedCompanies = getRelatedCompanies(node.data.id);
    
    detailsHTML = `
      <h4>👤 Opiekun: ${node.data.imie} ${node.data.nazwisko}</h4>
      <div class="detail-section">
        <div class="detail-item">
          <span class="detail-label">Typ:</span>
          <span class="detail-value">${node.data.typ.charAt(0).toUpperCase() + node.data.typ.slice(1)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Region:</span>
          <span class="detail-value">${node.data.region}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Doświadczenie:</span>
          <span class="detail-value">${node.data.doswiadczenie}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Specjalizacja:</span>
          <span class="detail-value">${node.data.specjalizacja}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value"><a href="mailto:${node.data.email}">${node.data.email}</a></span>
        </div>
      </div>
      <h4>🏢 Firmy (${relatedCompanies.length})</h4>
      <ul class="connections-list">
        ${relatedCompanies.length > 0 ? relatedCompanies.map(company => `
          <li class="connection-item" onclick="focusOnCompany('${company.id}')">
            <div class="connection-name">${company.nazwa}</div>
            <div class="connection-details">${company.branza} • ${company.lokalizacja}</div>
          </li>
        `).join('') : '<li class="connection-item">Brak przypisanych firm</li>'}
      </ul>
    `;
  }
  
  selectionDetails.innerHTML = detailsHTML;
  
  console.log('Szczegóły zaktualizowane w panelu');
}

function getRelatedManagers(companyId) {
  return appData.relationships
    .filter(rel => rel.firma_id === companyId)
    .map(rel => appData.managers.find(m => m.id === rel.opiekun_id))
    .filter(manager => manager && shouldShowManager(manager));
}

function getRelatedCompanies(managerId) {
  return appData.relationships
    .filter(rel => rel.opiekun_id === managerId)
    .map(rel => appData.companies.find(c => c.id === rel.firma_id))
    .filter(company => company);
}

// Funkcje globalne dla onclick
window.focusOnManager = function(managerId) {
  console.log('Fokus na opiekuna:', managerId);
  const nodeId = `manager_${managerId}`;
  const manager = appData.managers.find(m => m.id === managerId);
  if (manager && shouldShowManager(manager)) {
    const nodeData = {
      id: nodeId,
      type: manager.typ === 'handlowy' ? 'sales' : 'implementation',
      name: `${manager.imie} ${manager.nazwisko}`,
      data: manager
    };
    selectedNode = nodeData;
    showExpandedView(nodeId);
    showNodeDetails(nodeData);
  }
};

window.focusOnCompany = function(companyId) {
  console.log('Fokus na firmę:', companyId);
  const nodeId = `company_${companyId}`;
  const company = appData.companies.find(c => c.id === companyId);
  if (company) {
    const nodeData = {
      id: nodeId,
      type: 'company',
      name: company.nazwa,
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
  const salesManagers = appData.managers.filter(m => m.typ === 'handlowy').length;
  const implManagers = appData.managers.filter(m => m.typ === 'wdrożeniowy').length;
  
  const totalCompaniesEl = document.getElementById('total-companies');
  const totalSalesEl = document.getElementById('total-sales');
  const totalImplEl = document.getElementById('total-impl');
  
  if (totalCompaniesEl) totalCompaniesEl.textContent = totalCompanies;
  if (totalSalesEl) totalSalesEl.textContent = salesManagers;
  if (totalImplEl) totalImplEl.textContent = implManagers;
  
  console.log('Statystyki zaktualizowane:', { totalCompanies, salesManagers, implManagers });
}

function showTooltip(event, d) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;
  
  let content = '';
  if (d.type === 'company') {
    content = `
      <h4>${d.data.nazwa}</h4>
      <p><strong>Branża:</strong> ${d.data.branza}</p>
      <p><strong>Lokalizacja:</strong> ${d.data.lokalizacja}</p>
      <p><strong>Status:</strong> ${d.data.status}</p>
      <p><strong>Obrót z ITE:</strong> ${d.data.obrot_z_ite}</p>
    `;
  } else {
    content = `
      <h4>${d.data.imie} ${d.data.nazwisko}</h4>
      <p><strong>Typ:</strong> ${d.data.typ.charAt(0).toUpperCase() + d.data.typ.slice(1)}</p>
      <p><strong>Specjalizacja:</strong> ${d.data.specjalizacja}</p>
      <p><strong>Region:</strong> ${d.data.region}</p>
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
  }, 4000);
  
  console.log('Komunikat:', text, type);
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
  if (event.target.closest('#network-svg') && !event.target.closest('.node') && !event.target.closest('.node-label')) {
    if (currentView === 'expanded') {
      resetView();
    }
  }
});