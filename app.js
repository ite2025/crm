// Sample data
let companiesData = [
  {"Firma": "TechCorp Sp. z o.o.", "NIP": "123-456-78-90", "Opiekun": "Jan Kowalski", "Obrót": 250000},
  {"Firma": "Digital Solutions", "NIP": "987-654-32-10", "Opiekun": "Anna Nowak", "Obrót": 180000},
  {"Firma": "CodeFactory", "NIP": "456-789-12-34", "Opiekun": "Jan Kowalski", "Obrót": 320000},
  {"Firma": "WebMasters", "NIP": "321-654-98-76", "Opiekun": "Piotr Wiśniewski", "Obrót": 120000},
  {"Firma": "DataTech", "NIP": "789-123-45-67", "Opiekun": "Anna Nowak", "Obrót": 280000},
  {"Firma": "CloudSys", "NIP": "654-321-09-87", "Opiekun": "Jan Kowalski", "Obrót": 390000},
  {"Firma": "MobileDev", "NIP": "147-258-36-90", "Opiekun": "Piotr Wiśniewski", "Obrót": 150000},
  {"Firma": "AITech Solutions", "NIP": "963-852-74-10", "Opiekun": "Maria Kowalczyk", "Obrót": 420000}
];

// Global variables
let filteredData = [...companiesData];
let networkGraph = null;
let svg = null;
let simulation = null;
let currentTransform = d3.zoomIdentity;
let isDragging = false;

// DOM elements
const importBtn = document.getElementById('importBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const importModal = document.getElementById('importModal');
const companyModal = document.getElementById('companyModal');
const caregiverModal = document.getElementById('caregiverModal');
const closeImportModal = document.getElementById('closeImportModal');
const closeCompanyModal = document.getElementById('closeCompanyModal');
const closeCaregiverModal = document.getElementById('closeCaregiverModal');
const fileUploadArea = document.getElementById('fileUploadArea');
const selectFileBtn = document.getElementById('selectFileBtn');
const fileInput = document.getElementById('fileInput');
const loadingOverlay = document.getElementById('loadingOverlay');

// Filter elements
const companyFilter = document.getElementById('companyFilter');
const caregiverFilter = document.getElementById('caregiverFilter');
const minTurnover = document.getElementById('minTurnover');
const maxTurnover = document.getElementById('maxTurnover');
const applyFilters = document.getElementById('applyFilters');
const clearFilters = document.getElementById('clearFilters');

// Network controls
const resetZoom = document.getElementById('resetZoom');
const centerGraph = document.getElementById('centerGraph');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    populateCaregiverFilter();
    updateReports();
    setTimeout(() => {
        initializeNetworkGraph();
        hideLoading();
    }, 1000);
}

function setupEventListeners() {
    // Modal controls
    importBtn.addEventListener('click', () => showModal(importModal));
    closeImportModal.addEventListener('click', () => hideModal(importModal));
    closeCompanyModal.addEventListener('click', () => hideModal(companyModal));
    closeCaregiverModal.addEventListener('click', () => hideModal(caregiverModal));
    
    // File upload
    selectFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleFileDrop);
    
    // Filters
    applyFilters.addEventListener('click', applyDataFilters);
    clearFilters.addEventListener('click', clearDataFilters);
    
    // Network controls - Fixed to prevent visualization disappearing
    resetZoom.addEventListener('click', resetNetworkZoom);
    centerGraph.addEventListener('click', centerNetworkGraph);
    
    // Export
    exportDataBtn.addEventListener('click', exportData);
    
    // Modal backdrop clicks
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) hideModal(importModal);
    });
    companyModal.addEventListener('click', (e) => {
        if (e.target === companyModal) hideModal(companyModal);
    });
    caregiverModal.addEventListener('click', (e) => {
        if (e.target === caregiverModal) hideModal(caregiverModal);
    });

    // Accordion toggle logic
    const filtersToggle = document.getElementById('filtersToggle');
    const reportsToggle = document.getElementById('reportsToggle');
    const filtersItem = filtersToggle.parentElement;
    const reportsItem = reportsToggle.parentElement;

    filtersToggle.addEventListener('click', () => {
        filtersItem.classList.toggle('open');
    });
    
    reportsToggle.addEventListener('click', () => {
        reportsItem.classList.toggle('open');
    });

    // Open both sections by default
    filtersItem.classList.add('open');
    reportsItem.classList.add('open');
}

// Modal functions
function showModal(modal) {
    modal.classList.remove('hidden');
    modal.classList.add('fade-in');
    modal.style.display = 'flex';
}

function hideModal(modal) {
    modal.classList.add('hidden');
    modal.classList.remove('fade-in');
    modal.style.display = 'none';
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

// File handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    fileUploadArea.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    fileUploadArea.classList.remove('drag-over');
}

function handleFileDrop(event) {
    event.preventDefault();
    fileUploadArea.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
        showNotification('Proszę wybrać plik Excel (.xlsx lub .xls)', 'error');
        return;
    }
    
    showImportProgress();
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            processImportedData(jsonData);
        } catch (error) {
            showNotification('Błąd podczas importu pliku: ' + error.message, 'error');
            hideImportProgress();
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function showImportProgress() {
    document.getElementById('importProgress').classList.remove('hidden');
    const progressFill = document.getElementById('progressFill');
    const importStatus = document.getElementById('importStatus');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                hideImportProgress();
                importStatus.textContent = 'Import zakończony pomyślnie!';
            }, 500);
        }
    }, 100);
}

function hideImportProgress() {
    setTimeout(() => {
        document.getElementById('importProgress').classList.add('hidden');
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('importStatus').textContent = 'Importowanie danych...';
    }, 1500);
}

function processImportedData(jsonData) {
    const processedData = jsonData.map(row => ({
        Firma: row.Firma || row.firma || row.FIRMA || '',
        NIP: row.NIP || row.nip || row.Nip || '',
        Opiekun: row.Opiekun || row.opiekun || row.OPIEKUN || row['Opiekun Wdrożeniowy'] || '',
        Obrót: parseFloat(row.Obrót || row.obrót || row.OBRÓT || row['Obrót z IT Excellence'] || 0)
    })).filter(item => item.Firma && item.Opiekun);
    
    if (processedData.length === 0) {
        showNotification('Nie znaleziono poprawnych danych w pliku. Sprawdź czy plik zawiera kolumny: Firma, NIP, Opiekun, Obrót', 'error');
        return;
    }
    
    companiesData = processedData;
    filteredData = [...companiesData];
    
    populateCaregiverFilter();
    updateReports();
    updateNetworkGraph();
    
    setTimeout(() => {
        hideModal(importModal);
        showNotification(`Pomyślnie zaimportowano ${processedData.length} firm.`, 'success');
    }, 2000);
}

// Filter functions
function populateCaregiverFilter() {
    const caregivers = [...new Set(companiesData.map(c => c.Opiekun))].sort();
    caregiverFilter.innerHTML = '<option value="">Wszyscy opiekunowie</option>';
    
    caregivers.forEach(caregiver => {
        const option = document.createElement('option');
        option.value = caregiver;
        option.textContent = caregiver;
        caregiverFilter.appendChild(option);
    });
}

function applyDataFilters() {
    const companyName = companyFilter.value.toLowerCase();
    const selectedCaregiver = caregiverFilter.value;
    const minValue = parseFloat(minTurnover.value) || 0;
    const maxValue = parseFloat(maxTurnover.value) || Infinity;
    
    filteredData = companiesData.filter(company => {
        const matchesName = company.Firma.toLowerCase().includes(companyName);
        const matchesCaregiver = !selectedCaregiver || company.Opiekun === selectedCaregiver;
        const matchesTurnover = company.Obrót >= minValue && company.Obrót <= maxValue;
        
        return matchesName && matchesCaregiver && matchesTurnover;
    });
    
    updateReports();
    updateNetworkGraph();
    showNotification(`Zastosowano filtry. Wyświetlane: ${filteredData.length} firm.`, 'info');
}

function clearDataFilters() {
    companyFilter.value = '';
    caregiverFilter.value = '';
    minTurnover.value = '';
    maxTurnover.value = '';
    
    filteredData = [...companiesData];
    updateReports();
    updateNetworkGraph();
    showNotification('Wyczyszczono wszystkie filtry.', 'info');
}

// Reports functions
function updateReports() {
    updateCaregiverStats();
    updateSummaryStats();
}

function updateCaregiverStats() {
    const caregiverData = {};
    
    filteredData.forEach(company => {
        if (!caregiverData[company.Opiekun]) {
            caregiverData[company.Opiekun] = {
                count: 0,
                totalTurnover: 0,
                companies: []
            };
        }
        
        caregiverData[company.Opiekun].count++;
        caregiverData[company.Opiekun].totalTurnover += company.Obrót;
        caregiverData[company.Opiekun].companies.push(company.Firma);
    });
    
    const statsContainer = document.getElementById('caregiverStats');
    statsContainer.innerHTML = '';
    
    Object.entries(caregiverData)
        .sort(([,a], [,b]) => b.totalTurnover - a.totalTurnover)
        .forEach(([caregiver, data]) => {
            const avgTurnover = data.totalTurnover / data.count;
            
            const statElement = document.createElement('div');
            statElement.className = 'caregiver-stat';
            statElement.innerHTML = `
                <div class="caregiver-name">${caregiver}</div>
                <div class="caregiver-details">
                    <div>Liczba firm: ${data.count}</div>
                    <div>Łączny obrót: ${formatCurrency(data.totalTurnover)}</div>
                    <div>Średni obrót: ${formatCurrency(avgTurnover)}</div>
                </div>
            `;
            
            statsContainer.appendChild(statElement);
        });
}

function updateSummaryStats() {
    const totalCompanies = filteredData.length;
    const totalTurnover = filteredData.reduce((sum, company) => sum + company.Obrót, 0);
    const avgTurnover = totalCompanies > 0 ? totalTurnover / totalCompanies : 0;
    const totalCaregivers = new Set(filteredData.map(c => c.Opiekun)).size;
    
    document.getElementById('totalCompanies').textContent = totalCompanies;
    document.getElementById('totalTurnover').textContent = formatCurrency(totalTurnover);
    document.getElementById('avgTurnover').textContent = formatCurrency(avgTurnover);
    document.getElementById('totalCaregivers').textContent = totalCaregivers;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Network graph functions
function initializeNetworkGraph() {
    const container = document.getElementById('networkGraph');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Clear existing graph
    d3.select('#networkGraph svg').remove();
    
    svg = d3.select('#networkGraph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Define gradients - BARDZO JASNE ale bardziej widoczne
    const defs = svg.append('defs');
    
    // Company gradient - bardziej widoczny jasny błękit
    const companyGradient = defs.append('linearGradient')
        .attr('id', 'companyGradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%');
    companyGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#e3f2fd');
    companyGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#b3e5fc');
    
    // Caregiver gradient - bardziej widoczna jasna zieleń
    const caregiverGradient = defs.append('linearGradient')
        .attr('id', 'caregiverGradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%');
    caregiverGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#e8f5e8');
    caregiverGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#a5d6a7');
    
    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            currentTransform = event.transform;
            svg.select('.graph-container').attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Create container for graph elements
    const graphContainer = svg.append('g').attr('class', 'graph-container');
    
    // Store zoom for reset function
    svg.zoom = zoom;
    
    updateNetworkGraph();
}

function updateNetworkGraph() {
    if (!svg) return;
    
    const { nodes, links } = prepareGraphData();
    
    console.log('Created links:', links);
    
    // Clear existing elements
    svg.select('.graph-container').selectAll('*').remove();
    const graphContainer = svg.select('.graph-container');
    
    // Apply current transform to maintain zoom/pan state
    graphContainer.attr('transform', currentTransform);
    
    // Create force simulation
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(120))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(svg.attr('width') / 2, svg.attr('height') / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius + 25));
    
    // Create links FIRST - so they appear behind nodes
    const link = graphContainer.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .style('stroke', '#000')
        .style('stroke-width', '1px')
        .style('opacity', '0.4');
    
    // Create nodes
    const node = graphContainer.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', d => d.radius)
        .style('fill', d => d.type === 'company' ? 'url(#companyGradient)' : 'url(#caregiverGradient)')
        .style('stroke', 'rgba(0, 0, 0, 0.4)')
        .style('stroke-width', '1px')
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start', function(event, d) {
                isDragging = false;
                dragstarted(event, d);
            })
            .on('drag', function(event, d) {
                isDragging = true;
                dragged(event, d);
            })
            .on('end', function(event, d) {
                dragended(event, d);
                // Allow click to fire if not dragging
                setTimeout(() => { isDragging = false; }, 100);
            }))
        .on('click', function(event, d) {
            // Prevent click if we were dragging
            if (isDragging) {
                return;
            }
            
            event.stopPropagation();
            console.log('Clicked node:', d.type, d.name); // debug
            
            // Hide tooltip first
            hideTooltip();
            
            if (d.type === 'company') {
                console.log('Opening company modal for:', d.name);
                showCompanyModal(d);
            } else if (d.type === 'caregiver') {
                console.log('Opening caregiver modal for:', d.name);
                showCaregiverModal(d.name);
            }
        })
        .on('mouseover', function(event, d) {
            d3.select(this).style('filter', 'brightness(1.3)');
            
            // Highlight connected links
            link.style('opacity', function(linkData) {
                return (linkData.source.id === d.id || linkData.target.id === d.id) ? '1' : '0.2';
            }).style('stroke-width', function(linkData) {
                return (linkData.source.id === d.id || linkData.target.id === d.id) ? '3px' : '1px';
            });
            
            showTooltip(event, d);
        })
        .on('mouseout', function(event, d) {
            d3.select(this).style('filter', null);
            
            // Reset all links
            link.style('opacity', '0.4').style('stroke-width', '1px');
            
            hideTooltip();
        });
    
    // Add icons inside nodes - wycentrowane
    const nodeIcons = graphContainer.append('g')
        .attr('class', 'node-icons')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#333')
        .attr('font-size', d => d.radius * 0.6)
        .style('pointer-events', 'none')
        .text(d => d.type === 'company' ? '\u{1F3E2}' : '\u{1F464}');
    
    // Add labels
    const labels = graphContainer.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .style('font-family', 'var(--font-family-base)')
        .style('font-size', '11px')
        .style('font-weight', 'var(--font-weight-medium)')
        .style('fill', 'var(--color-text)')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.3)')
        .text(d => d.label)
        .attr('dy', d => d.radius + 15);
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        nodeIcons
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        
        labels
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });
}

function prepareGraphData() {
    const nodes = [];
    const links = [];
    
    // Get unique caregivers
    const caregivers = [...new Set(filteredData.map(c => c.Opiekun))];
    
    // Add caregiver nodes
    caregivers.forEach(caregiver => {
        nodes.push({
            id: `caregiver_${caregiver}`,
            label: caregiver,
            type: 'caregiver',
            radius: 25,
            name: caregiver,
            data: { name: caregiver, type: 'caregiver' }
        });
    });
    
    // Add company nodes
    filteredData.forEach(company => {
        nodes.push({
            id: `company_${company.Firma}`,
            label: company.Firma,
            type: 'company',
            radius: Math.max(15, Math.min(35, company.Obrót / 15000)),
            name: company.Firma,
            data: company
        });
    });
    
    // Create links ONLY between companies and their caregivers
    filteredData.forEach(company => {
        links.push({
            source: `company_${company.Firma}`,
            target: `caregiver_${company.Opiekun}`
        });
    });
    
    return { nodes, links };
}

// Tooltip functions
function showTooltip(event, d) {
    const tooltip = d3.select('body').append('div')
        .attr('class', 'network-tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.9)')
        .style('color', 'white')
        .style('padding', '12px')
        .style('border-radius', '8px')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('backdrop-filter', 'blur(5px)')
        .style('font-size', '12px')
        .style('max-width', '250px')
        .style('z-index', '2000');
    
    let content;
    if (d.type === 'company') {
        content = `<strong>${d.data.Firma}</strong><br>Obrót: ${formatCurrency(d.data.Obrót)}<br>Opiekun: ${d.data.Opiekun}`;
    } else {
        const companiesCount = filteredData.filter(c => c.Opiekun === d.name).length;
        const totalTurnover = filteredData.filter(c => c.Opiekun === d.name).reduce((sum, c) => sum + c.Obrót, 0);
        content = `<strong>${d.name}</strong><br>Liczba firm: ${companiesCount}<br>Łączny obrót: ${formatCurrency(totalTurnover)}`;
    }
    
    tooltip.html(content)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
}

function hideTooltip() {
    d3.selectAll('.network-tooltip').remove();
}

// Drag handlers
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Network controls - Fixed to prevent visualization disappearing
function resetNetworkZoom() {
    if (svg && svg.zoom) {
        // Reset transform and store it
        currentTransform = d3.zoomIdentity;
        svg.transition().duration(750).call(
            svg.zoom.transform,
            d3.zoomIdentity
        );
        // Ensure graph container maintains correct transform
        svg.select('.graph-container').attr('transform', currentTransform);
    }
}

function centerNetworkGraph() {
    if (simulation) {
        // Restart simulation with gentle alpha to re-center nodes
        simulation.alpha(0.3).restart();
        
        // Reset any zoom/pan while maintaining visualization
        if (svg && svg.zoom) {
            const width = svg.attr('width');
            const height = svg.attr('height');
            
            // Update center force
            simulation.force('center', d3.forceCenter(width / 2, height / 2));
        }
    }
}

// Company details modal
function showCompanyModal(d) {
    console.log('showCompanyModal called with:', d);
    const company = d.data;
    
    document.getElementById('companyModalTitle').textContent = company.Firma;
    
    const detailsContainer = document.getElementById('companyDetails');
    detailsContainer.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Nazwa firmy:</span>
            <span class="detail-value">${company.Firma}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">NIP:</span>
            <span class="detail-value">${company.NIP}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Opiekun wdrożeniowy:</span>
            <span class="detail-value">${company.Opiekun}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Obrót z IT Excellence:</span>
            <span class="detail-value">${formatCurrency(company.Obrót)}</span>
        </div>
    `;
    
    showModal(companyModal);
}

// Caregiver details modal - NAPRAWIONY
function showCaregiverModal(caregiverName) {
    console.log('showCaregiverModal called with:', caregiverName);
    
    const modal = document.getElementById('caregiverModal');
    if (!modal) {
        console.error('caregiverModal not found!');
        return;
    }
    
    const caregiverData = filteredData.filter(d => d.Opiekun === caregiverName);
    const totalTurnover = caregiverData.reduce((sum, d) => sum + d.Obrót, 0);
    const avgTurnover = caregiverData.length > 0 ? totalTurnover / caregiverData.length : 0;
    
    document.getElementById('caregiverName').textContent = caregiverName;
    document.getElementById('caregiverNameDisplay').textContent = caregiverName;
    document.getElementById('caregiverCompanyCount').textContent = caregiverData.length;
    document.getElementById('caregiverTotalTurnover').textContent = totalTurnover.toLocaleString('pl-PL') + ' zł';
    document.getElementById('caregiverAvgTurnover').textContent = Math.round(avgTurnover).toLocaleString('pl-PL') + ' zł';
    
    const companiesList = document.getElementById('caregiverCompanies');
    companiesList.innerHTML = '';
    caregiverData.forEach(company => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${company.Firma}</strong> - ${company.Obrót.toLocaleString('pl-PL')} zł`;
        companiesList.appendChild(li);
    });
    
    showModal(modal);
}

// Enhanced export function with user feedback
function exportData() {
    try {
        // Show loading state
        exportDataBtn.textContent = 'Eksportowanie...';
        exportDataBtn.disabled = true;
        
        const dataToExport = filteredData.map(company => ({
            'Firma': company.Firma,
            'NIP': company.NIP,
            'Opiekun wdrożeniowy': company.Opiekun,
            'Obrót z IT Excellence': company.Obrót
        }));
        
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Dane');
        
        const filename = `IT_Excellence_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        // Show success notification
        showNotification(`Wyeksportowano ${filteredData.length} firm do pliku ${filename}`, 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Błąd podczas eksportu danych: ' + error.message, 'error');
    } finally {
        // Reset button state
        setTimeout(() => {
            exportDataBtn.textContent = 'Eksportuj';
            exportDataBtn.disabled = false;
        }, 1000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(15px);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        max-width: 400px;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set color based on type
    switch (type) {
        case 'success':
            notification.style.borderLeftColor = '#059669';
            notification.style.color = '#059669';
            break;
        case 'error':
            notification.style.borderLeftColor = '#DC2626';
            notification.style.color = '#DC2626';
            break;
        case 'info':
        default:
            notification.style.borderLeftColor = '#3B82F6';
            notification.style.color = '#3B82F6';
            break;
    }
    notification.style.borderLeftWidth = '4px';
    notification.style.borderLeftStyle = 'solid';
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Responsive handling
window.addEventListener('resize', () => {
    if (svg) {
        const container = document.getElementById('networkGraph');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        svg.attr('width', width).attr('height', height);
        
        if (simulation) {
            simulation.force('center', d3.forceCenter(width / 2, height / 2));
            simulation.alpha(0.3).restart();
        }
    }
});