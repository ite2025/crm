// Data
const data = {
  "companies": [
    {
      "id": "1",
      "name": "IT Excellence S.A.",
      "industry": "Technologie IT",
      "location": "Wrocław",
      "size": "Średnia",
      "assignedReps": ["rep1", "rep2"]
    },
    {
      "id": "2", 
      "name": "TechPol Sp. z o.o.",
      "industry": "Software",
      "location": "Warszawa",
      "size": "Duża",
      "assignedReps": ["rep1"]
    },
    {
      "id": "3",
      "name": "Digital Solutions",
      "industry": "Konsulting IT",
      "location": "Kraków",
      "size": "Mała",
      "assignedReps": ["rep3"]
    },
    {
      "id": "4",
      "name": "InnovateTech",
      "industry": "Rozwój oprogramowania",
      "location": "Gdańsk",
      "size": "Średnia",
      "assignedReps": ["rep2", "rep3"]
    },
    {
      "id": "5",
      "name": "BusinessPro",
      "industry": "Usługi biznesowe",
      "location": "Poznań",
      "size": "Duża",
      "assignedReps": ["rep1", "rep4"]
    }
  ],
  "salesReps": [
    {
      "id": "rep1",
      "name": "Anna Kowalska",
      "region": "Zachód",
      "experience": "5 lat",
      "specialization": "Enterprise IT",
      "email": "a.kowalska@company.pl",
      "phone": "+48 123 456 789"
    },
    {
      "id": "rep2",
      "name": "Marek Nowak",
      "region": "Południe",
      "experience": "8 lat",
      "specialization": "Software Solutions",
      "email": "m.nowak@company.pl",
      "phone": "+48 987 654 321"
    },
    {
      "id": "rep3",
      "name": "Katarzyna Wiśniewska",
      "region": "Północ",
      "experience": "3 lata",
      "specialization": "SMB/Startups",
      "email": "k.wisniewska@company.pl",
      "phone": "+48 555 123 456"
    },
    {
      "id": "rep4",
      "name": "Piotr Zieliński",
      "region": "Wschód",
      "experience": "6 lat",
      "specialization": "Key Accounts",
      "email": "p.zielinski@company.pl",
      "phone": "+48 777 888 999"
    }
  ]
};

// Global variables
let svg, simulation, nodes, links, nodeElements, linkElements, labelElements;
let tooltip, selectedNode = null;
let width, height;
let zoomBehavior;

// Wait for D3 to load, then initialize
function waitForD3() {
  if (typeof d3 !== 'undefined') {
    initializeApp();
  } else {
    setTimeout(waitForD3, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForD3);
} else {
  waitForD3();
}

function initializeApp() {
  console.log('Initializing app...');
  
  // Create tooltip
  tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0);
  
  setupEventListeners();
  renderSidePanelLists();
  updateStats();
  createNetworkVisualization();
}

function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('search-input');
  const clearSearch = document.getElementById('clear-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keyup', handleSearch);
  }
  
  if (clearSearch) {
    clearSearch.addEventListener('click', clearSearchResults);
  }
  
  // Reset zoom button
  const resetZoomBtn = document.getElementById('reset-zoom');
  if (resetZoomBtn) {
    resetZoomBtn.addEventListener('click', resetZoom);
  }
  
  // Modal close button
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  
  // Close modal when clicking outside
  const modal = document.getElementById('details-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }
}

function createNetworkVisualization() {
  console.log('Creating network visualization...');
  
  const container = document.getElementById('network-visualization');
  if (!container) {
    console.error('Network container not found');
    return;
  }
  
  width = container.clientWidth || 800;
  height = container.clientHeight || 600;
  
  console.log('Container dimensions:', width, height);
  
  // Clear any existing SVG
  d3.select('#network-svg').selectAll('*').remove();
  
  svg = d3.select('#network-svg')
    .attr('width', width)
    .attr('height', height);
  
  // Create zoom behavior
  zoomBehavior = d3.zoom()
    .scaleExtent([0.3, 3])
    .on('zoom', function(event) {
      const g = svg.select('.zoom-group');
      if (!g.empty()) {
        g.attr('transform', event.transform);
      }
    });
  
  svg.call(zoomBehavior);
  
  // Create zoom group
  const g = svg.append('g').attr('class', 'zoom-group');
  
  // Prepare data for D3
  const graphData = prepareGraphData();
  nodes = graphData.nodes;
  links = graphData.links;
  
  console.log('Nodes:', nodes.length, 'Links:', links.length);
  
  // Create force simulation
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-800))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(40));
  
  // Create links
  linkElements = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('stroke', '#999')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.6);
  
  // Create nodes
  nodeElements = g.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('class', d => `node ${d.type}-node`)
    .attr('r', d => d.type === 'company' ? 25 : 18)
    .attr('fill', d => d.type === 'company' ? '#218296' : '#32b8c8')
    .attr('stroke', d => d.type === 'company' ? '#1d7485' : '#2a9cb0')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('click', function(event, d) {
      handleNodeClick(event, d, this);
    })
    .on('mouseover', function(event, d) {
      showTooltip(event, d);
    })
    .on('mouseout', function(event, d) {
      hideTooltip();
    });
  
  // Create labels
  labelElements = g.append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('class', 'node-label')
    .attr('text-anchor', 'middle')
    .attr('dy', d => d.type === 'company' ? 40 : 33)
    .style('font-size', '12px')
    .style('font-weight', '500')
    .style('fill', '#1f3435')
    .style('pointer-events', 'none')
    .text(d => {
      if (d.name.length > 15) {
        return d.name.substring(0, 15) + '...';
      }
      return d.name;
    });
  
  // Update positions on simulation tick
  simulation.on('tick', function() {
    linkElements
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    nodeElements
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    labelElements
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
  
  console.log('Network visualization created successfully');
}

function prepareGraphData() {
  const nodes = [];
  const links = [];
  
  // Add company nodes
  data.companies.forEach(company => {
    nodes.push({
      id: company.id,
      name: company.name,
      type: 'company',
      data: company
    });
  });
  
  // Add sales rep nodes
  data.salesReps.forEach(rep => {
    nodes.push({
      id: rep.id,
      name: rep.name,
      type: 'rep',
      data: rep
    });
  });
  
  // Create links between companies and their assigned reps
  data.companies.forEach(company => {
    company.assignedReps.forEach(repId => {
      links.push({
        source: company.id,
        target: repId,
        type: 'assignment'
      });
    });
  });
  
  return { nodes, links };
}

function handleNodeClick(event, d, element) {
  event.stopPropagation();
  console.log('Node clicked:', d);
  
  // Clear previous selection
  clearSelection();
  
  // Select current node
  d3.select(element)
    .attr('stroke-width', 4)
    .attr('stroke-dasharray', '5,5');
  
  selectedNode = d;
  
  // Highlight connected links
  linkElements
    .attr('stroke', link => 
      (link.source.id === d.id || link.target.id === d.id) ? '#218296' : '#999'
    )
    .attr('stroke-width', link => 
      (link.source.id === d.id || link.target.id === d.id) ? 3 : 2
    )
    .attr('stroke-opacity', link => 
      (link.source.id === d.id || link.target.id === d.id) ? 1 : 0.6
    );
  
  // Update side panel selection
  updateSidePanelSelection(d);
  
  // Show details modal
  showDetailsModal(d);
}

function clearSelection() {
  if (nodeElements) {
    nodeElements
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', null);
  }
  
  if (linkElements) {
    linkElements
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);
  }
  
  selectedNode = null;
  
  // Clear side panel selection
  document.querySelectorAll('.list-item').forEach(item => {
    item.classList.remove('active');
  });
}

function showDetailsModal(node) {
  console.log('Showing modal for:', node);
  
  const modal = document.getElementById('details-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  
  if (!modal || !title || !body) {
    console.error('Modal elements not found');
    return;
  }
  
  if (node.type === 'company') {
    const assignedReps = node.data.assignedReps.map(repId => 
      data.salesReps.find(r => r.id === repId)
    ).filter(rep => rep); // Filter out undefined
    
    title.textContent = node.data.name;
    body.innerHTML = `
      <div class="detail-group">
        <h4>Informacje o firmie</h4>
        <p><strong>Branża:</strong> ${node.data.industry}</p>
        <p><strong>Lokalizacja:</strong> ${node.data.location}</p>
        <p><strong>Rozmiar:</strong> ${node.data.size}</p>
      </div>
      <div class="detail-group">
        <h4>Przypisani opiekunowie (${assignedReps.length})</h4>
        <ul class="connections-list">
          ${assignedReps.map(rep => `
            <li>
              <strong>${rep.name}</strong><br>
              ${rep.specialization} • ${rep.region}<br>
              <small>${rep.email} • ${rep.phone}</small>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  } else {
    const assignedCompanies = data.companies.filter(c => 
      c.assignedReps.includes(node.data.id)
    );
    
    title.textContent = node.data.name;
    body.innerHTML = `
      <div class="detail-group">
        <h4>Informacje kontaktowe</h4>
        <p><strong>Email:</strong> ${node.data.email}</p>
        <p><strong>Telefon:</strong> ${node.data.phone}</p>
        <p><strong>Region:</strong> ${node.data.region}</p>
        <p><strong>Doświadczenie:</strong> ${node.data.experience}</p>
        <p><strong>Specjalizacja:</strong> ${node.data.specialization}</p>
      </div>
      <div class="detail-group">
        <h4>Przypisane firmy (${assignedCompanies.length})</h4>
        <ul class="connections-list">
          ${assignedCompanies.map(company => `
            <li>
              <strong>${company.name}</strong><br>
              ${company.industry} • ${company.location}<br>
              <small>Rozmiar: ${company.size}</small>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('details-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showTooltip(event, d) {
  let content = '';
  
  if (d.type === 'company') {
    content = `
      <h4>${d.data.name}</h4>
      <p><strong>Branża:</strong> ${d.data.industry}</p>
      <p><strong>Lokalizacja:</strong> ${d.data.location}</p>
      <p><strong>Rozmiar:</strong> ${d.data.size}</p>
      <p><strong>Opiekunów:</strong> ${d.data.assignedReps.length}</p>
    `;
  } else {
    const assignedCompanies = data.companies.filter(c => 
      c.assignedReps.includes(d.data.id)
    );
    
    content = `
      <h4>${d.data.name}</h4>
      <p><strong>Region:</strong> ${d.data.region}</p>
      <p><strong>Specjalizacja:</strong> ${d.data.specialization}</p>
      <p><strong>Doświadczenie:</strong> ${d.data.experience}</p>
      <p><strong>Przypisanych firm:</strong> ${assignedCompanies.length}</p>
    `;
  }
  
  tooltip.html(content)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px')
    .style('opacity', 1);
}

function hideTooltip() {
  tooltip.style('opacity', 0);
}

function renderSidePanelLists() {
  // Render companies list
  const companiesList = document.getElementById('companies-list');
  if (companiesList) {
    companiesList.innerHTML = data.companies.map(company => `
      <div class="list-item" data-id="${company.id}" data-type="company">
        <h4>${company.name}</h4>
        <p>${company.industry} • ${company.location}</p>
        <p>Rozmiar: ${company.size} • Opiekunów: ${company.assignedReps.length}</p>
      </div>
    `).join('');
  }
  
  // Render sales reps list
  const repsList = document.getElementById('reps-list');
  if (repsList) {
    repsList.innerHTML = data.salesReps.map(rep => {
      const assignedCount = data.companies.filter(c => 
        c.assignedReps.includes(rep.id)
      ).length;
      
      return `
        <div class="list-item" data-id="${rep.id}" data-type="rep">
          <h4>${rep.name}</h4>
          <p>${rep.specialization}</p>
          <p>Region: ${rep.region} • Firm: ${assignedCount}</p>
        </div>
      `;
    }).join('');
  }
  
  // Add click listeners to all list items
  document.querySelectorAll('.list-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const id = this.dataset.id;
      const node = nodes ? nodes.find(n => n.id === id) : null;
      
      if (node) {
        console.log('List item clicked:', node);
        
        // Clear previous selections
        clearSelection();
        
        // Select this item
        this.classList.add('active');
        
        // Find the corresponding node element
        const nodeElement = nodeElements.nodes().find(n => 
          d3.select(n).datum().id === id
        );
        
        if (nodeElement) {
          // Simulate node click
          handleNodeClick(new Event('click'), node, nodeElement);
          
          // Center the view on the selected node
          if (svg && zoomBehavior) {
            const scale = 1.2;
            const transform = d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(scale)
              .translate(-node.x, -node.y);
            
            svg.transition()
              .duration(750)
              .call(zoomBehavior.transform, transform);
          }
        }
      }
    });
  });
}

function updateSidePanelSelection(selectedNode) {
  // Clear previous selections
  document.querySelectorAll('.list-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Highlight selected item
  const selectedItem = document.querySelector(`.list-item[data-id="${selectedNode.id}"]`);
  if (selectedItem) {
    selectedItem.classList.add('active');
  }
}

function updateStats() {
  const totalCompanies = data.companies.length;
  const totalReps = data.salesReps.length;
  
  // Calculate total assignments
  const totalAssignments = data.companies.reduce((sum, company) => 
    sum + company.assignedReps.length, 0
  );
  const avgCompaniesPerRep = (totalAssignments / totalReps).toFixed(1);
  
  const totalCompaniesEl = document.getElementById('total-companies');
  const totalRepsEl = document.getElementById('total-reps');
  const avgCompaniesEl = document.getElementById('avg-companies');
  
  if (totalCompaniesEl) totalCompaniesEl.textContent = totalCompanies;
  if (totalRepsEl) totalRepsEl.textContent = totalReps;
  if (avgCompaniesEl) avgCompaniesEl.textContent = avgCompaniesPerRep;
}

function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  console.log('Search:', query);
  
  // Clear previous highlights
  document.querySelectorAll('.list-item').forEach(item => {
    item.classList.remove('highlighted');
    item.style.display = '';
  });
  
  if (nodeElements) {
    nodeElements.attr('stroke', d => d.type === 'company' ? '#1d7485' : '#2a9cb0');
  }
  
  if (labelElements) {
    labelElements.style('font-weight', '500').style('fill', '#1f3435');
  }
  
  if (query.length > 0) {
    // Search and highlight matching items in lists
    document.querySelectorAll('.list-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.classList.add('highlighted');
      } else {
        item.style.display = 'none';
      }
    });
    
    // Highlight matching nodes in visualization
    if (nodeElements) {
      nodeElements.attr('stroke', d => {
        const matches = d.name.toLowerCase().includes(query) ||
          (d.type === 'company' && 
           (d.data.industry.toLowerCase().includes(query) || 
            d.data.location.toLowerCase().includes(query))) ||
          (d.type === 'rep' && 
           (d.data.specialization.toLowerCase().includes(query) ||
            d.data.region.toLowerCase().includes(query)));
        return matches ? '#e68661' : (d.type === 'company' ? '#1d7485' : '#2a9cb0');
      });
    }
    
    // Also highlight labels of matching nodes
    if (labelElements) {
      labelElements
        .style('font-weight', d => {
          const matches = d.name.toLowerCase().includes(query) ||
            (d.type === 'company' && 
             (d.data.industry.toLowerCase().includes(query) || 
              d.data.location.toLowerCase().includes(query))) ||
            (d.type === 'rep' && 
             (d.data.specialization.toLowerCase().includes(query) ||
              d.data.region.toLowerCase().includes(query)));
          return matches ? '700' : '500';
        })
        .style('fill', d => {
          const matches = d.name.toLowerCase().includes(query) ||
            (d.type === 'company' && 
             (d.data.industry.toLowerCase().includes(query) || 
              d.data.location.toLowerCase().includes(query))) ||
            (d.type === 'rep' && 
             (d.data.specialization.toLowerCase().includes(query) ||
              d.data.region.toLowerCase().includes(query)));
          return matches ? '#a84b2f' : '#1f3435';
        });
    }
  }
}

function clearSearchResults() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = '';
  }
  
  // Show all items and remove highlights
  document.querySelectorAll('.list-item').forEach(item => {
    item.classList.remove('highlighted');
    item.style.display = '';
  });
  
  if (nodeElements) {
    nodeElements.attr('stroke', d => d.type === 'company' ? '#1d7485' : '#2a9cb0');
  }
  
  if (labelElements) {
    labelElements.style('font-weight', '500').style('fill', '#1f3435');
  }
}

function resetZoom() {
  if (svg && zoomBehavior) {
    svg.transition()
      .duration(750)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  }
}

// Drag functions for D3
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

// Handle window resize
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