const apiUrl = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
    
    // Check if on dashboard page
    const scanBtn = document.getElementById('scan-btn');
    if(scanBtn) {
        scanBtn.addEventListener('click', runScan);
        document.getElementById('send-btn').addEventListener('click', sendChatMessage);
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.getElementById('signal-modal').style.display = 'none';
        });
    }
});

async function runScan() {
    const btn = document.getElementById('scan-btn');
    btn.disabled = true;
    btn.innerText = 'Running AI Agents...';
    
    // Animate pipeline
    const stages = document.querySelectorAll('.stage');
    for (let i = 0; i < stages.length; i++) {
        stages[i].classList.add('active');
        await new Promise(r => setTimeout(r, 400));
        if (i > 0) stages[i-1].classList.remove('active');
    }
    stages[stages.length-1].classList.remove('active');
    
    try {
        const response = await fetch(`${apiUrl}/signals/scan`);
        const signals = await response.json();
        renderSignals(signals);
    } catch (err) {
        console.error('Scan failed', err);
        document.getElementById('signals-container').innerHTML = '<p class="empty-state">Scan failed to reach backend.</p>';
    }
    
    btn.disabled = false;
    btn.innerText = 'Run AI Scan';
}

function renderSignals(signals) {
    const container = document.getElementById('signals-container');
    container.innerHTML = '';
    
    signals.forEach(sig => {
        const card = document.createElement('div');
        card.className = 'signal-card';
        card.innerHTML = `
            <div>
                <div class="signal-header">
                    <h3>${sig.symbol}</h3>
                </div>
                <div class="signal-meta">
                    <span class="pill ${sig.direction.toLowerCase()}">${sig.direction}</span>
                    <span class="pill conviction-${sig.conviction.toLowerCase()}">${sig.conviction} Conviction</span>
                    ${sig.confluence_boost ? '<span class="pill confluence" style="color:#f59e0b; background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.2);">🔥 Confluence Boost</span>' : ''}
                </div>
                <p style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-secondary)">${sig.summary}</p>
            </div>
            <div class="score-badge">${sig.score}</div>
        `;
        card.onclick = () => showModal(sig);
        container.appendChild(card);
    });
}

function showModal(sig) {
    document.getElementById('modal-title').innerText = `${sig.symbol} - Details`;
    document.getElementById('modal-body').innerHTML = `
        <p style="margin-bottom:0.5rem"><strong>Score:</strong> <span class="score-badge" style="font-size:1.2rem">${sig.score}</span></p>
        <p style="margin-bottom:0.5rem"><strong>Direction:</strong> ${sig.direction}</p>
        <p style="margin-bottom:0.5rem"><strong>Agents Triggered:</strong> ${sig.agents_triggered.join(', ')}</p>
        <div style="margin-top:1rem; padding:1rem; background:var(--bg-color); border:1px solid var(--border-color); border-radius:6px;">
            <p><strong>AI Synthesis:</strong></p>
            <p style="color:var(--text-secondary); margin-top:0.5rem;">${sig.summary}</p>
        </div>
    `;
    document.getElementById('signal-modal').style.display = 'flex';
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    
    appendMessage(msg, 'user');
    input.value = '';
    
    const uiMsg = appendMessage('...', 'ai');
    
    const eventSource = new EventSource(`${apiUrl}/chat/stream?query=${encodeURIComponent(msg)}`);
    
    let fullResponse = '';
    eventSource.onmessage = (e) => {
        fullResponse += e.data;
        uiMsg.innerText = fullResponse;
    };
    
    eventSource.onerror = (e) => {
        eventSource.close();
        if (fullResponse === '') uiMsg.innerText = "Error connecting to AI Analyst.";
    };
}

function appendMessage(text, role) {
    const chat = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
}

async function loadPortfolio() {
    const content = document.getElementById('portfolio-content');
    if (!content) return;
    try {
        const response = await fetch(`${apiUrl}/portfolio/analyze`);
        const data = await response.json();
        let html = `<p><strong>Health:</strong> ${data.overall_health}</p><ul style="list-style:none; margin-top:0.5rem;">`;
        data.holdings.forEach(h => {
            html += `<li style="margin-bottom:0.3rem;">${h.symbol} <span style="float:right; color:var(--text-secondary)">${h.weight}% (Risk: ${h.risk_score})</span></li>`;
        });
        html += `</ul>`;
        if (data.warnings.length > 0) {
            html += `<div style="margin-top:1rem; padding:0.5rem; background:rgba(239, 68, 68, 0.1); border-left:2px solid var(--accent-red); font-size:0.8rem;">${data.warnings[0]}</div>`;
        }
        content.innerHTML = html;
    } catch (err) {
        content.innerHTML = "Could not load portfolio.";
    }
}
