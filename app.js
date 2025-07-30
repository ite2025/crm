// DANE NATYCHMIAST DOSTĘPNE - dokładnie z JSON
const sampleData = {
  companies: [
    {
      ID_Firmy: 1,
      Nazwa_Firmy: "IT Excellence S.A.",
      Branża: "Technologie IT",
      Lokalizacja: "Wrocław", 
      Wielkość_Firmy: "Duża (500+ pracowników)",
      Status: "Aktywny",
      Obrot_z_ITE: "2,5 mln PLN"
    },
    {
      ID_Firmy: 2,
      Nazwa_Firmy: "TechnoSoft Sp. z o.o.",
      Branża: "Oprogramowanie",
      Lokalizacja: "Warszawa",
      Wielkość_Firmy: "Średnia (50-250 pracowników)", 
      Status: "Aktywny",
      Obrot_z_ITE: "850 tys. PLN"
    },
    {
      ID_Firmy: 3,
      Nazwa_Firmy: "Digital Solutions Ltd.",
      Branża: "Usługi cyfrowe",
      Lokalizacja: "Kraków",
      Wielkość_Firmy: "Mała (10-50 pracowników)",
      Status: "Potencjalny", 
      Obrot_z_ITE: "320 tys. PLN"
    },
    {
      ID_Firmy: 4,
      Nazwa_Firmy: "InnovateCorp S.A.",
      Branża: "Innowacje technologiczne",
      Lokalizacja: "Gdańsk",
      Wielkość_Firmy: "Duża (500+ pracowników)",
      Status: "Aktywny",
      Obrot_z_ITE: "1,8 mln PLN"
    },
    {
      ID_Firmy: 5,
      Nazwa_Firmy: "DataFlow Systems", 
      Branża: "Analiza danych",
      Lokalizacja: "Poznań",
      Wielkość_Firmy: "Średnia (50-250 pracowników)",
      Status: "Aktywny",
      Obrot_z_ITE: "650 tys. PLN"
    }
  ],
  managers: [
    {
      ID_Opiekuna: 101,
      Imię_Nazwisko: "Anna Kowalska", 
      Typ_Opiekuna: "Handlowy",
      Region: "Dolnośląskie",
      Doświadczenie: "5 lat",
      Specjalizacja: "Duże firmy IT",
      Email: "anna.kowalska@ite.pl"
    },
    {
      ID_Opiekuna: 102,
      Imię_Nazwisko: "Piotr Nowak",
      Typ_Opiekuna: "Wdrożeniowy", 
      Region: "Mazowieckie",
      Doświadczenie: "3 lata",
      Specjalizacja: "Systemy CRM", 
      Email: "piotr.nowak@ite.pl"
    },
    {
      ID_Opiekuna: 103,
      Imię_Nazwisko: "Katarzyna Wiśniewska",
      Typ_Opiekuna: "Handlowy",
      Region: "Małopolskie",
      Doświadczenie: "7 lat",
      Specjalizacja: "Małe i średnie firmy",
      Email: "katarzyna.wisniewska@ite.pl"
    },
    {
      ID_Opiekuna: 104,
      Imię_Nazwisko: "Michał Zawadzki", 
      Typ_Opiekuna: "Wdrożeniowy",
      Region: "Pomorskie",
      Doświadczenie: "4 lata",
      Specjalizacja: "Integracje systemów",
      Email: "michal.zawadzki@ite.pl"
    },
    {
      ID_Opiekuna: 105,
      Imię_Nazwisko: "Magdalena Kowal",
      Typ_Opiekuna: "Handlowy", 
      Region: "Wielkopolskie",
      Doświadczenie: "6 lat",
      Specjalizacja: "Analiza danych",
      Email: "magdalena.kowal@ite.pl"
    }
  ],
  relationships: [
    { ID_Firmy: 1, ID_Opiekuna: 101 },
    { ID_Firmy: 1, ID_Opiekuna: 102 },
    { ID_Firmy: 2, ID_Opiekuna: 102 },
    { ID_Firmy: 3, ID_Opiekuna: 103 },
    { ID_Firmy: 4, ID_Opiekuna: 104 },
    { ID_Firmy: 5, ID_Opiekuna: 105 }
  ]
};

// ZMIENNE GLOBALNE
let appData = sampleData;
let svg, simulation, nodes, links;
let nodeElements, linkElements, labelElements;
let selectedNode = null;
let currentView = 'companies';
let width, height;
let zoomBehavior;
let showSalesManagers = true;
let showImplementationManagers = true;

// NATYCHMIASTOWA INICJALIZACJA PO ZAŁADOWANIU DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log("=== DEBUGOWANIE DANYCH ===");
  console.log("Dane załadowane:", sampleData);
  console.log("Firmy:", sampleData.companies.length);
  console.log("Opiekunowie:", sampleData.managers.length);
  console.log("Powiązania:", sampleData.relationships.length);
  console.log("========================");
  
  // NATYCHMIAST - bez opóźnień
  updateDebugInfo();
  updateStats();
  setupEventListeners();
  initializeVisualization();
  
  showMessage('✅ Aplikacja załadowana - dane widoczne!', 'success');
  console.log('✅ Aplikacja CRM gotowa!');
});

function updateDebugInfo() {
  const debugContent = document.getElementById('debug-content');
  if (debugContent) {
    const salesCount = appData.managers.filter(m => m.Typ_Opiekuna === 'Handlowy').length;
    const implCount = appData.managers.filter(m => m.Typ_Opiekuna === 'Wdrożeniowy').length;
    
    debugContent.textContent = `Firmy: ${appData.companies.length}
Opiekunowie handlowi: ${salesCount}
Opiekunowie wdrożeniowi: ${implCount}
Powiązania: ${appData.relationships.length}
Filtry: Handlowi=${showSalesManagers}, Wdrożeniowi=${showImplementationManagers}
Widok: ${currentView}`;
  }
}

function updateStats() {
  const totalCompanies = appData.companies.length;
  const salesManagers = appData.managers.filter(m => m.Typ_Opiekuna === 'Handlowy').length;
  const implManagers = appData.managers.filter(m => m.Typ_Opiekuna === 'Wdrożeniowy').length;
  
  console.log('📊 Statystyki:', { firmy: totalCompanies, handlowi: salesManagers, wdrożeniowi: implManagers });
  
  // NATYCHMIAST aktualizuj statystyki w DOM
  const totalCompaniesEl = document.getElementById('total-companies');
  const totalSalesEl = document.getElementById('total-sales');
  const totalImplEl = document.getElementById('total-impl');
  const visibleNodesEl = document.getElementById('visible-nodes');
  
  if (totalCompaniesEl) totalCompaniesEl.textContent = totalCompanies;
  if (totalSalesEl) totalSalesEl.textContent = salesManagers;
  if (totalImplEl) totalImplEl.textContent = implManagers;
  if (visibleNodesEl) visibleNodesEl.textContent = totalCompanies; // Początkowo wszystkie firmy
}

function setupEventListeners() {
  console.log('⚙️ Konfiguracja event listeners...');
  
  // Filtry checkbox
  const showSalesCheckbox = document.getElementById('show-sales');
  const showImplCheckbox = document.getElementById('show-implementation');
  const showAllCheckbox = document.getElementById('show-all');
  
  if (showSalesCheckbox) {
    showSalesCheckbox.addEventListener('change', function() {
      showSalesManagers = this.checked;
      console.log('🔧 Filtr handlowych:', showSalesManagers);
      updateShowAllCheckbox();
      refreshVisualization();
      updateDebugInfo();
    });
  }
  
  if (showImplCheckbox) {
    showImplCheckbox.addEventListener('change', function() {
      showImplementationManagers = this.checked;
      console.log('🔧 Filtr wdrożeniowych:', showImplementationManagers);
      updateShowAllCheckbox();
      refreshVisualization();
      updateDebugInfo();
    });
  }
  
  if (showAllCheckbox) {
    showAllCheckbox.addEventListener('change', function() {
      const checked = this.checked;
      showSalesManagers = checked;
      showImplementationManagers = checked;
      if (showSalesCheckbox) showSalesCheckbox.checked = checked;
      if (showImplCheckbox) showImplCheckbox.checked = checked;
      console.log('🔧 Filtr wszystko:', checked);
      refreshVisualization();
      updateDebugInfo();
    });
  }
  
  // Excel upload
  const loadExcelBtn = document.getElementById('load-excel-btn');
  const excelFile = document.getElementById('excel-file');
  
  if (loadExcelBtn && excelFile) {
    loadExcelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('📊 Otwieranie Excel...');
      excelFile.click();
    });
    
    excelFile.addEventListener('change', handleExcelUpload);
  }
  
  // Przyciski kontrolne
  const resetViewBtn = document.getElementById('reset-view');
  const centerViewBtn = document.getElementById('center-view');
  const closeDetailsBtn = document.getElementById('close-details');
  
  if (resetViewBtn) resetViewBtn.addEventListener('click', resetView);
  if (centerViewBtn) centerViewBtn.addEventListener('click', centerView);
  if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', clearSelection);
  
  console.log('✅ Event listeners gotowe');
}

function updateShowAllCheckbox() {
  const showAllCheckbox = document.getElementById('show-all');
  if (showAllCheckbox) {
    showAllCheckbox.checked = showSalesManagers && showImplementationManagers;
  }
}

function initializeVisualization() {
  console.log('🎨 Inicjalizacja wizualizacji...');
  
  const container = document.getElementById('network-visualization');
  if (!container) {
    console.error('❌ Brak kontenera wizualizacji');
    return;
  }
  
  width = container.clientWidth || 800;
  height = container.clientHeight || 500;
  
  console.log('📐 Rozmiar:', width, 'x', height);
  
  // Wyczyść poprzednie SVG
  d3.select('#network-svg').selectAll('*').remove();
  
  svg = d3.select('#network-svg')
    .attr('width', width)
    .attr('height', height);
  
  // Zoom
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
  svg.append('g').attr('class', 'zoom-group');
  
  // NATYCHMIAST pokaż widok firm
  setTimeout(() => showCompaniesView(), 100); // Krótkie opóźnienie dla stabilności
  
  console.log('✅ Wizualizacja zainicjalizowana');
}

function showCompaniesView() {
  console.log('🏢 Pokazuję widok firm');
  currentView = 'companies';
  selectedNode = null;
  
  // Przygotuj dane - wszystkie firmy jako węzły
  const graphData = {
    nodes: appData.companies.map((company, index) => ({
      id: `company_${company.ID_Firmy}`,
      type: 'company',
      name: company.Nazwa_Firmy.length > 20 ? company.Nazwa_Firmy.substring(0, 17) + '...' : company.Nazwa_Firmy,
      fullName: company.Nazwa_Firmy,
      data: company,
      // Rozmieść firmy w okręgu
      x: width / 2 + Math.cos(index * 2 * Math.PI / appData.companies.length) * 150,
      y: height / 2 + Math.sin(index * 2 * Math.PI / appData.companies.length) * 150
    })),
    links: []
  };
  
  console.log('📊 Graf firm:', graphData.nodes.length, 'węzłów');
  
  updateVisualization(graphData);
  clearDetailsPanel();
  updateDebugInfo();
}

function showExpandedView(centerNodeId) {
  console.log('🔍 Rozszerzone powiązania dla:', centerNodeId);
  currentView = 'expanded';
  
  const graphData = prepareExpandedData(centerNodeId);
  updateVisualization(graphData);
  updateDebugInfo();
}

function prepareExpandedData(centerNodeId) {
  const nodes = [];
  const links = [];
  
  if (centerNodeId.startsWith('company_')) {
    const companyId = parseInt(centerNodeId.replace('company_', ''));
    const company = appData.companies.find(c => c.ID_Firmy === companyId);
    
    if (company) {
      console.log('🏢 Firma:', company.Nazwa_Firmy);
      
      // Centralny węzeł - firma
      nodes.push({
        id: centerNodeId,
        type: 'company',
        name: company.Nazwa_Firmy.length > 20 ? company.Nazwa_Firmy.substring(0, 17) + '...' : company.Nazwa_Firmy,
        fullName: company.Nazwa_Firmy,
        data: company,
        fx: width / 2,
        fy: height / 2
      });
      
      // Znajdź powiązanych opiekunów
      const relatedManagers = appData.relationships
        .filter(rel => rel.ID_Firmy === companyId)
        .map(rel => appData.managers.find(m => m.ID_Opiekuna === rel.ID_Opiekuna))
        .filter(manager => manager && shouldShowManager(manager));
      
      console.log('👥 Powiązani opiekunowie:', relatedManagers.length);
      
      // Dodaj opiekunów wokół firmy
      relatedManagers.forEach((manager, index) => {
        const managerId = `manager_${manager.ID_Opiekuna}`;
        const angle = (index * 2 * Math.PI) / relatedManagers.length;
        
        nodes.push({
          id: managerId,
          type: manager.Typ_Opiekuna === 'Handlowy' ? 'sales' : 'implementation',
          name: manager.Imię_Nazwisko,
          data: manager,
          x: width / 2 + Math.cos(angle) * 200,
          y: height / 2 + Math.sin(angle) * 200
        });
        
        // Link między firmą a opiekunem
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
      console.log('👤 Opiekun:', manager.Imię_Nazwisko);
      
      // Centralny węzeł - opiekun
      nodes.push({
        id: centerNodeId,
        type: manager.Typ_Opiekuna === 'Handlowy' ? 'sales' : 'implementation',
        name: manager.Imię_Nazwisko,
        data: manager,
        fx: width / 2,
        fy: height / 2
      });
      
      // Znajdź powiązane firmy
      const relatedCompanies = appData.relationships
        .filter(rel => rel.ID_Opiekuna === managerId)
        .map(rel => appData.companies.find(c => c.ID_Firmy === rel.ID_Firmy))
        .filter(company => company);
      
      console.log('🏢 Powiązane firmy:', relatedCompanies.length);
      
      // Dodaj firmy wokół opiekuna
      relatedCompanies.forEach((company, index) => {
        const companyId = `company_${company.ID_Firmy}`;
        const angle = (index * 2 * Math.PI) / relatedCompanies.length;
        
        nodes.push({
          id: companyId,
          type: 'company',
          name: company.Nazwa_Firmy.length > 20 ? company.Nazwa_Firmy.substring(0, 17) + '...' : company.Nazwa_Firmy,
          fullName: company.Nazwa_Firmy,
          data: company,
          x: width / 2 + Math.cos(angle) * 200,
          y: height / 2 + Math.sin(angle) * 200
        });
        
        // Link między opiekunem a firmą
        links.push({
          source: centerNodeId,
          target: companyId,
          type: 'assignment'
        });
      });
    }
  }
  
  console.log('📊 Przygotowano:', nodes.length, 'węzłów,', links.length, 'linków');
  return { nodes, links };
}

function shouldShowManager(manager) {
  if (manager.Typ_Opiekuna === 'Handlowy') {
    return showSalesManagers;
  } else if (manager.Typ_Opiekuna === 'Wdrożeniowy') {
    return showImplementationManagers;
  }
  return false;
}

function updateVisualization(graphData) {
  nodes = graphData.nodes;
  links = graphData.links;
  
  console.log(`🎨 Aktualizacja: ${nodes.length} węzłów, ${links.length} linków`);
  
  // Wyczyść poprzednie elementy
  const g = svg.select('.zoom-group');
  g.selectAll('*').remove();
  
  // Symulacja sił
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 5));
  
  // Linki
  linkElements = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('stroke', '#1877F2')
    .attr('stroke-width', 2)
    .attr('opacity', 0.6);
  
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
    .attr('text-anchor', 'middle')
    .attr('dy', d => getNodeRadius(d) + 15)
    .style('font-size', '10px')
    .style('font-weight', 'bold')
    .style('fill', 'var(--color-text)')
    .text(d => d.name);
  
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
  
  console.log('✅ Wizualizacja zaktualizowana');
}

function getNodeRadius(d) {
  switch (d.type) {
    case 'company': return 25;
    case 'sales': return 18;
    case 'implementation': return 18;
    default: return 15;
  }
}

function handleNodeClick(event, d) {
  event.stopPropagation();
  console.log('🖱️ Klik na:', d.fullName || d.name);
  
  selectedNode = d;
  
  // Oznacz wybrany węzeł
  if (nodeElements) {
    nodeElements.classed('selected', node => node.id === d.id);
  }
  
  // Pokaż rozszerzone powiązania
  showExpandedView(d.id);
  
  // Pokaż szczegóły w panelu
  showNodeDetails(d);
}

function showNodeDetails(node) {
  console.log('📋 Szczegóły dla:', node.fullName || node.name);
  
  const noSelection = document.getElementById('no-selection');
  const selectionDetails = document.getElementById('selection-details');
  
  if (!noSelection || !selectionDetails) {
    console.error('❌ Brak elementów panelu szczegółów');
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
        <div class="detail-item">
          <span class="detail-label">Obrót z ITE:</span>
          <span class="detail-value">${node.data.Obrot_z_ITE}</span>
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
          <span class="detail-value">${node.data.Doświadczenie}</span>
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
  return appData.relationships
    .filter(rel => rel.ID_Firmy === companyId)
    .map(rel => appData.managers.find(m => m.ID_Opiekuna === rel.ID_Opiekuna))
    .filter(manager => manager && shouldShowManager(manager));
}

function getRelatedCompanies(managerId) {
  return appData.relationships
    .filter(rel => rel.ID_Opiekuna === managerId)
    .map(rel => appData.companies.find(c => c.ID_Firmy === rel.ID_Firmy))
    .filter(company => company);
}

// Funkcje globalne dla onclick w HTML
window.focusOnManager = function(managerId) {
  const nodeId = `manager_${managerId}`;
  const manager = appData.managers.find(m => m.ID_Opiekuna === managerId);
  if (manager && shouldShowManager(manager)) {
    const nodeData = {
      id: nodeId,
      type: manager.Typ_Opiekuna === 'Handlowy' ? 'sales' : 'implementation',
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
      fullName: company.Nazwa_Firmy,
      data: company
    };
    selectedNode = nodeData;
    showExpandedView(nodeId);
    showNodeDetails(nodeData);
  }
};

function clearSelection() {
  console.log('🔄 Czyszczenie zaznaczenia');
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
  console.log('🔄 Odświeżanie wizualizacji');
  if (currentView === 'companies') {
    showCompaniesView();
  } else if (selectedNode) {
    showExpandedView(selectedNode.id);
  }
}

function resetView() {
  console.log('🔄 Reset widoku');
  if (svg && zoomBehavior) {
    svg.transition()
      .duration(750)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  }
  clearSelection();
}

function centerView() {
  console.log('🎯 Centrowanie widoku');
  if (svg && zoomBehavior) {
    svg.transition()
      .duration(750)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  }
}

function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  console.log('📊 Wczytywanie Excel:', file.name);
  showMessage('📊 Wczytywanie pliku Excel...', 'info');
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const requiredSheets = ['Firmy', 'Opiekunowie', 'Powiązania'];
      const availableSheets = workbook.SheetNames;
      
      const missingSheets = requiredSheets.filter(sheet => !availableSheets.includes(sheet));
      if (missingSheets.length > 0) {
        showMessage(`❌ Brakuje arkuszy: ${missingSheets.join(', ')}`, 'error');
        return;
      }
      
      const companies = XLSX.utils.sheet_to_json(workbook.Sheets['Firmy']);
      const managers = XLSX.utils.sheet_to_json(workbook.Sheets['Opiekunowie']);
      const relationships = XLSX.utils.sheet_to_json(workbook.Sheets['Powiązania']);
      
      if (companies.length === 0 || managers.length === 0) {
        showMessage('❌ Plik Excel nie zawiera wystarczających danych', 'error');
        return;
      }
      
      appData = { companies, managers, relationships };
      
      clearSelection();
      refreshVisualization();
      updateStats();
      updateDebugInfo();
      
      showMessage(`✅ Wczytano: ${companies.length} firm, ${managers.length} opiekunów`, 'success');
      event.target.value = '';
      
    } catch (error) {
      console.error('❌ Błąd Excel:', error);
      showMessage('❌ Błąd podczas wczytywania pliku Excel: ' + error.message, 'error');
    }
  };
  
  reader.readAsArrayBuffer(file);
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

// Funkcje drag dla D3
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

// Kliknięcie w tło resetuje widok
document.addEventListener('click', function(event) {
  if (event.target.closest('#network-svg') && !event.target.closest('.node')) {
    if (currentView === 'expanded') {
      resetView();
    }
  }
});

console.log('🚀 App.js załadowany - CRM gotowy!');