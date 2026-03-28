const API = 'https://opportunity-radar-api.onrender.com/api';
let allSignals = [];

document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
    const scanBtn = document.getElementById('scan-btn');
    if (scanBtn) {
        scanBtn.addEventListener('click', runScan);
        document.getElementById('send-btn').addEventListener('click', sendChat);
        document.getElementById('chat-input').addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });
        document.getElementById('modal-close').addEventListener('click', () => { document.getElementById('signal-modal').style.display = 'none'; });
        document.getElementById('signal-modal').addEventListener('click', e => { if (e.target === e.currentTarget) e.currentTarget.style.display = 'none'; });
        document.querySelectorAll('.pill').forEach(p => p.addEventListener('click', () => {
            document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
            p.classList.add('active');
            filterSignals(p.dataset.filter);
        }));
    }
});

async function runScan() {
    const btn = document.getElementById('scan-btn');
    const status = document.getElementById('pipeline-status');
    const progress = document.getElementById('pipeline-progress');
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-icon">⏳</span><span>Scanning...</span>';
    status.textContent = 'Running'; status.className = 'pipeline-status running';

    const stages = document.querySelectorAll('.stage');
    const names = ['ingestion', 'filing', 'technical', 'sentiment', 'scoring', 'synthesis'];
    for (let i = 0; i < stages.length; i++) {
        stages[i].classList.add('active');
        progress.style.width = ((i + 1) / stages.length * 100) + '%';
        await sleep(350);
        if (i > 0) { stages[i - 1].classList.remove('active'); stages[i - 1].classList.add('done'); }
    }
    stages[stages.length - 1].classList.remove('active');
    stages[stages.length - 1].classList.add('done');

    try {
        const res = await fetch(`${API}/signals/scan`);
        allSignals = await res.json();
        renderSignals(allSignals);
        status.textContent = `${allSignals.length} opportunities found`; status.className = 'pipeline-status complete';
    } catch (e) {
        document.getElementById('signals-container').innerHTML = '<div class="empty-state"><h3>Connection Error</h3><p>Could not reach backend. It may be waking up — try again in 30 seconds.</p></div>';
        status.textContent = 'Error'; status.className = 'pipeline-status';
    }
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">🔍</span><span>Run AI Scan</span>';
}

function renderSignals(signals) {
    const c = document.getElementById('signals-container');
    c.innerHTML = '';
    if (!signals.length) { c.innerHTML = '<div class="empty-state"><h3>No matches</h3></div>'; return; }
    signals.forEach((s, i) => {
        const card = document.createElement('div');
        card.className = `signal-card ${s.direction.toLowerCase()}`;
        card.dataset.direction = s.direction;
        card.dataset.conviction = s.conviction;
        card.style.animationDelay = `${i * 0.05}s`;
        card.innerHTML = `
            <div class="card-top">
                <div>
                    <div class="card-symbol">${s.symbol}</div>
                    <div class="card-company">${s.company_name}</div>
                    <div class="card-sector">${s.sector}</div>
                </div>
                <div class="card-score-wrap">
                    <div class="card-score">${s.score}</div>
                    <div class="card-score-label">AI Score</div>
                </div>
            </div>
            <div class="card-tags">
                <span class="tag ${s.direction.toLowerCase()}">${s.direction}</span>
                <span class="tag conviction">${s.conviction}</span>
                ${s.confluence_boost ? '<span class="tag confluence">🔥 Confluence</span>' : ''}
                ${s.agents_triggered.map(a => `<span class="tag neutral">${a}</span>`).join('')}
            </div>
            <div class="card-metrics">
                <div class="metric"><div class="metric-value">${s.current_price}</div><div class="metric-label">Price</div></div>
                <div class="metric"><div class="metric-value">${s.market_cap}</div><div class="metric-label">Mkt Cap</div></div>
                <div class="metric"><div class="metric-value">${s.pe_ratio}x</div><div class="metric-label">P/E</div></div>
            </div>
            <div class="card-brief">${s.ai_brief.substring(0, 150)}...</div>
            <div class="card-time">⏱ ${s.timestamp}</div>`;
        card.onclick = () => showModal(s);
        c.appendChild(card);
    });
}

function filterSignals(filter) {
    if (filter === 'all') return renderSignals(allSignals);
    if (filter === 'HIGH') return renderSignals(allSignals.filter(s => s.conviction === 'HIGH'));
    renderSignals(allSignals.filter(s => s.direction === filter));
}

function showModal(s) {
    document.getElementById('modal-body').innerHTML = `
        <div class="modal-header">
            <div class="modal-symbol">${s.symbol}</div>
            <div class="modal-company">${s.company_name} · ${s.sector}</div>
        </div>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem;">${s.description}</p>
        <div class="modal-grid">
            <div class="modal-stat"><div class="modal-stat-label">AI Score</div><div class="modal-stat-value" style="color:var(--accent)">${s.score}</div></div>
            <div class="modal-stat"><div class="modal-stat-label">Direction</div><div class="modal-stat-value">${s.direction}</div></div>
            <div class="modal-stat"><div class="modal-stat-label">Current Price</div><div class="modal-stat-value">${s.current_price}</div></div>
            <div class="modal-stat"><div class="modal-stat-label">Market Cap</div><div class="modal-stat-value">${s.market_cap}</div></div>
            <div class="modal-stat"><div class="modal-stat-label">P/E Ratio</div><div class="modal-stat-value">${s.pe_ratio}x</div></div>
            <div class="modal-stat"><div class="modal-stat-label">52W High</div><div class="modal-stat-value">${s.week_high}</div></div>
            <div class="modal-stat"><div class="modal-stat-label">52W Low</div><div class="modal-stat-value">${s.week_low}</div></div>
            <div class="modal-stat"><div class="modal-stat-label">Promoter</div><div class="modal-stat-value">${s.promoter_holding}</div></div>
        </div>
        <div class="modal-signals">
            <h4>📋 Raw Agent Signals</h4>
            ${s.raw_signals.map(sig => `<div class="modal-signal-item">${sig}</div>`).join('')}
        </div>
        <div class="modal-brief"><strong>AI Synthesis:</strong><br><br>${s.ai_brief}</div>`;
    document.getElementById('signal-modal').style.display = 'flex';
}

function sendChat() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    addMsg(msg, 'user');
    input.value = '';
    const aiDiv = addMsg('', 'ai');
    const src = new EventSource(`${API}/chat/stream?query=${encodeURIComponent(msg)}`);
    let full = '';
    src.onmessage = e => { full += e.data; aiDiv.innerHTML = `<span class="msg-label">AI Analyst</span>${full}`; document.getElementById('chat-window').scrollTop = 9999; };
    src.onerror = () => { src.close(); if (!full) aiDiv.innerHTML = '<span class="msg-label">AI Analyst</span>Connection error — try again.'; };
}

function addMsg(text, role) {
    const w = document.getElementById('chat-window');
    const d = document.createElement('div');
    d.className = `chat-msg ${role}`;
    d.innerHTML = role === 'user' ? text : `<span class="msg-label">AI Analyst</span>${text}`;
    w.appendChild(d);
    w.scrollTop = 9999;
    return d;
}

async function loadPortfolio() {
    const el = document.getElementById('portfolio-content');
    if (!el) return;
    try {
        const res = await fetch(`${API}/portfolio/analyze`);
        const d = await res.json();
        el.innerHTML = `
            <div class="portfolio-summary">
                <p><strong>Portfolio Value:</strong> ${d.total_value} &nbsp;|&nbsp; <strong>Return:</strong> <span style="color:var(--green)">${d.overall_return}</span></p>
                <p><strong>Health:</strong> ${d.overall_health} &nbsp;|&nbsp; <strong>Diversification:</strong> ${d.diversification_score}/100</p>
            </div>
            ${d.holdings.map(h => `<div class="portfolio-holding">
                <div><div class="holding-name">${h.symbol}</div><div class="holding-sector">${h.sector}</div></div>
                <div class="holding-stats"><div class="holding-weight">${h.weight}%</div><div class="holding-return ${h.return_1y.startsWith('+') ? 'positive' : 'negative'}">${h.return_1y}</div></div>
            </div>`).join('')}
            ${d.warnings.map(w => `<div class="portfolio-warning">⚠️ ${w}</div>`).join('')}
            ${d.recommendations.map(r => `<div class="portfolio-rec">💡 ${r}</div>`).join('')}`;
    } catch { el.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">Backend waking up — refresh in 30s.</p>'; }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
