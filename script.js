/**
 * SQL Mastery Hub - Enterprise Core Engine
 * Professional, device-friendly, and accessible.
 * Powers:
 * - Theme Management (Dark / Light Mode with LocalStorage persistence)
 * - 57 Topics Dynamic Grid, Search & Category Filters
 * - LocalStorage Progress Tracking
 * - Clean SVG Icons & Toast Notifications
 * - In-Browser Interactive SQL Playground
 * - Interactive Challenges System
 * - Bottom Capsule Navbar Active State
 */

// ==========================================================================
// THEME MANAGEMENT (DARK & LIGHT MODES)
// ==========================================================================
(function initThemeEarly() {
    const savedTheme = localStorage.getItem('sql_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

function setupThemeToggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateThemeToggleButtons(currentTheme);

    window.toggleTheme = function () {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('sql_theme', next);
        updateThemeToggleButtons(next);
        window.showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    };
}

function updateThemeToggleButtons(theme) {
    const btns = document.querySelectorAll('.theme-toggle-btn');
    const isDark = theme === 'dark';
    btns.forEach(btn => {
        btn.innerHTML = isDark
            ? `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> <span>Light</span>`
            : `<svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> <span>Dark</span>`;
    });
}

// ==========================================================================
// CLEAN TOAST NOTIFICATIONS (No Emojis)
// ==========================================================================
window.showToast = function (message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconSvg = type === 'success'
        ? `<svg class="svg-icon" style="color: #10b981;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`
        : type === 'error'
        ? `<svg class="svg-icon" style="color: #ef4444;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
        : `<svg class="svg-icon" style="color: var(--cyan-primary);" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 260);
    }, 3000);
};

// Clipboard Helper
window.copyToClipboard = function (text, label = "Code") {
    navigator.clipboard.writeText(text).then(() => {
        window.showToast(`${label} copied to clipboard`, 'success');
    }).catch(() => {
        window.showToast('Failed to copy to clipboard', 'error');
    });
};

// Manage Active State for Bottom Capsule Navbar
function setupBottomNavbar() {
    const navItems = document.querySelectorAll('.bottom-capsule-nav .nav-item');
    if (!navItems.length) return;

    const currentPath = window.location.pathname.toLowerCase();

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (!href) return;
        const target = href.replace('../', '').toLowerCase();

        if (
            (currentPath.endsWith(target) && target !== '') ||
            (currentPath.endsWith('/') && target === 'index.html') ||
            (currentPath.includes('/notes/') && target === 'notes.html')
        ) {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        }
    });
}

// ==========================================================================
// PROGRESS TRACKER (Local Storage)
// ==========================================================================
function getCompletedTopics() {
    try {
        return JSON.parse(localStorage.getItem('sql_completed_topics') || '[]');
    } catch (e) {
        return [];
    }
}

function saveCompletedTopics(arr) {
    localStorage.setItem('sql_completed_topics', JSON.stringify(arr));
    updateProgressUI();
}

function updateProgressUI() {
    const completed = getCompletedTopics();
    const count = completed.length;
    const total = (typeof SQL_TOPICS_DATABASE !== 'undefined') ? SQL_TOPICS_DATABASE.length : 57;
    const pct = Math.round((count / total) * 100);

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressCount = document.getElementById('progressCount');

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressText) progressText.innerText = `${pct}%`;
    if (progressCount) progressCount.innerText = `${count} of ${total} topics completed`;
}

// ==========================================================================
// NOTES DIRECTORY & SEARCH / FILTER (For notes.html)
// ==========================================================================
function initNotesPage() {
    const grid = document.getElementById('topicsGrid');
    if (!grid) return;

    if (typeof SQL_TOPICS_DATABASE === 'undefined') {
        console.warn('SQL_TOPICS_DATABASE not loaded yet.');
        return;
    }

    let activeCategory = 'All';
    let searchTerm = '';

    function renderTopics() {
        const completed = getCompletedTopics();
        const filtered = SQL_TOPICS_DATABASE.filter(t => {
            const matchesCat = activeCategory === 'All' || t.category === activeCategory;
            const term = searchTerm.toLowerCase();
            const matchesSearch = t.title.toLowerCase().includes(term) ||
                t.summary.toLowerCase().includes(term) ||
                t.category.toLowerCase().includes(term) ||
                (t.id + '').includes(term);
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
                    <svg class="svg-icon svg-icon-lg" style="margin-bottom: 1rem; color: var(--cyan-primary);" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <h3 style="color: var(--text-main); margin-bottom: 6px;">No topics found matching "${searchTerm}"</h3>
                    <p>Try searching for SELECT, JOIN, TRIGGER, INDEX, or reset filters.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(t => {
            const isDone = completed.includes(t.id);
            const badgeClass = t.difficulty === 'Intermediate' ? 'badge-intermediate' :
                t.difficulty === 'Advanced' ? 'badge-advanced' : 'badge-beginner';

            return `
                <div class="topic-card" id="card-topic-${t.id}">
                    <div>
                        <div class="topic-card-header">
                            <span class="topic-num-badge">TOPIC #${String(t.id).padStart(2, '0')}</span>
                            <div class="topic-meta-tags">
                                <span class="badge ${badgeClass}">${t.difficulty}</span>
                                <span class="badge" style="background: var(--cyan-subtle); color: var(--cyan-primary); border: 1px solid var(--border-cyan);">${t.category}</span>
                            </div>
                        </div>
                        <h3 class="topic-title">${t.title}</h3>
                        <p class="topic-desc">${t.summary}</p>
                    </div>

                    <div>
                        <div class="topic-card-footer">
                            <label class="topic-completion-check" onclick="event.stopPropagation();">
                                <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTopicCheck(${t.id}, this.checked)">
                                <span>${isDone ? 'Completed' : 'Mark Done'}</span>
                            </label>
                            <a href="${t.html_file}" class="btn btn-accent btn-sm">
                                <span>Read Notes</span>
                                <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Filter pills setup
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategory = pill.getAttribute('data-category') || 'All';
            renderTopics();
        });
    });

    // Search input
    const searchInput = document.getElementById('topicSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.trim();
            renderTopics();
        });
    }

    window.toggleTopicCheck = function (id, isChecked) {
        let completed = getCompletedTopics();
        if (isChecked && !completed.includes(id)) {
            completed.push(id);
            window.showToast('Topic marked as completed', 'success');
        } else if (!isChecked) {
            completed = completed.filter(x => x !== id);
            window.showToast('Topic marked incomplete', 'info');
        }
        saveCompletedTopics(completed);
        renderTopics();
    };

    renderTopics();
    updateProgressUI();
}

// ==========================================================================
// INTERACTIVE SQL PLAYGROUND (Client-side Query Runner)
// ==========================================================================
const SAMPLE_DATABASE = {
    Employees: [
        { id: 1, name: "Amit Kumar", age: 24, gender: "Male", salary: 85000, department: "Engineering", city: "Indore" },
        { id: 2, name: "Priya Sharma", age: 22, gender: "Female", salary: 92000, department: "AI/ML", city: "Bengaluru" },
        { id: 3, name: "Rahul Verma", age: 26, gender: "Male", salary: 78000, department: "Engineering", city: "Delhi" },
        { id: 4, name: "Sneha Patel", age: 23, gender: "Female", salary: 81000, department: "IoT", city: "Pune" },
        { id: 5, name: "Vikas Singh", age: 28, gender: "Male", salary: 65000, department: "Marketing", city: "Indore" },
        { id: 6, name: "Ananya Gupta", age: 25, gender: "Female", salary: 89000, department: "AI/ML", city: "Hyderabad" },
        { id: 7, name: "Kunal Jain", age: 27, gender: "Male", salary: 72000, department: "Finance", city: "Mumbai" },
        { id: 8, name: "Pooja Reddy", age: 24, gender: "Female", salary: 95000, department: "Engineering", city: "Bengaluru" }
    ],
    Departments: [
        { dept_id: 101, dept_name: "Engineering", manager: "Amit Kumar", budget: 500000, location: "Tower A" },
        { dept_id: 102, dept_name: "AI/ML", manager: "Priya Sharma", budget: 750000, location: "Innovation Lab" },
        { dept_id: 103, dept_name: "IoT", manager: "Sneha Patel", budget: 400000, location: "Hardware Wing" },
        { dept_id: 104, dept_name: "Marketing", manager: "Vikas Singh", budget: 200000, location: "Tower B" },
        { dept_id: 105, dept_name: "Finance", manager: "Kunal Jain", budget: 350000, location: "HQ Floor 4" }
    ],
    Projects: [
        { pid: 1, project_name: "InfraGuard IoT", technology: "ESP8266/MQTT", pincode: 452001, budget: 150000 },
        { pid: 2, project_name: "CropShield AI", technology: "TensorFlow/Python", pincode: 781039, budget: 220000 },
        { pid: 3, project_name: "MSSQL Mastery Hub", technology: "MS SQL/Web", pincode: 452010, budget: 180000 },
        { pid: 4, project_name: "Smart Automation", technology: "Raspberry Pi", pincode: 110001, budget: 120000 }
    ],
    Students: [
        { id: 101, name: "Amit Prasad", age: 20, grade: "A+", major: "ECE", score: 98 },
        { id: 102, name: "Aarav Mehta", age: 21, grade: "A", major: "CSE", score: 91 },
        { id: 103, name: "Diya Roy", age: 20, grade: "B+", major: "AI/DS", score: 84 },
        { id: 104, name: "Rohan Das", age: 22, grade: "A", major: "ECE", score: 89 },
        { id: 105, name: "Kavya Nair", age: 19, grade: "A+", major: "Robotics", score: 96 }
    ],
    Orders: [
        { order_id: 1001, customer: "Amit Kumar", product: "SQL Server Enterprise", amount: 14500, status: "Completed", order_date: "2025-01-15" },
        { order_id: 1002, customer: "Priya Sharma", product: "IoT Development Kit", amount: 3500, status: "Shipped", order_date: "2025-01-18" },
        { order_id: 1003, customer: "Rahul Verma", product: "Cloud Database Hosting", amount: 6200, status: "Completed", order_date: "2025-01-20" },
        { order_id: 1004, customer: "Sneha Patel", product: "Arduino Sensor Pack", amount: 1800, status: "Pending", order_date: "2025-02-01" },
        { order_id: 1005, customer: "Vikas Singh", product: "Data Analytics Course", amount: 4900, status: "Completed", order_date: "2025-02-04" }
    ]
};

function executeMockSQL(sql) {
    const startTime = performance.now();
    const cleanSQL = sql.trim().replace(/;+$/, '');

    const simpleMatch = cleanSQL.match(/^SELECT\s+(.*?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY\s+(.*?))?$/i);
    const topMatch = cleanSQL.match(/^SELECT\s+TOP\s+(\d+)\s+(.*?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY\s+(.*?))?$/i);

    let targetTableName = "";
    let columnsPart = "*";
    let whereClause = "";
    let orderByClause = "";
    let limitCount = null;

    if (topMatch) {
        limitCount = parseInt(topMatch[1], 10);
        columnsPart = topMatch[2].trim();
        targetTableName = topMatch[3].trim();
        whereClause = topMatch[4] ? topMatch[4].trim() : "";
        orderByClause = topMatch[5] ? topMatch[5].trim() : "";
    } else if (simpleMatch) {
        columnsPart = simpleMatch[1].trim();
        targetTableName = simpleMatch[2].trim();
        whereClause = simpleMatch[3] ? simpleMatch[3].trim() : "";
        orderByClause = simpleMatch[4] ? simpleMatch[4].trim() : "";
    }

    const foundTableKey = Object.keys(SAMPLE_DATABASE).find(k => k.toLowerCase() === targetTableName.toLowerCase());

    if (!foundTableKey) {
        return {
            error: `Table '${targetTableName}' not found. Available tables: ${Object.keys(SAMPLE_DATABASE).join(', ')}`,
            duration: (performance.now() - startTime).toFixed(2)
        };
    }

    let rows = JSON.parse(JSON.stringify(SAMPLE_DATABASE[foundTableKey]));

    if (whereClause) {
        try {
            const eqMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?/i);
            const gtMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*>\s*([0-9.]+)/i);
            const ltMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*<\s*([0-9.]+)/i);
            const likeMatch = whereClause.match(/([a-zA-Z0-9_]+)\s+LIKE\s+['"]%?([^'"%]+)%?['"]/i);

            if (eqMatch) {
                const col = eqMatch[1].toLowerCase();
                const val = eqMatch[2];
                rows = rows.filter(r => {
                    const rKey = Object.keys(r).find(k => k.toLowerCase() === col);
                    return rKey && String(r[rKey]).toLowerCase() === val.toLowerCase();
                });
            } else if (gtMatch) {
                const col = gtMatch[1].toLowerCase();
                const num = parseFloat(gtMatch[2]);
                rows = rows.filter(r => {
                    const rKey = Object.keys(r).find(k => k.toLowerCase() === col);
                    return rKey && parseFloat(r[rKey]) > num;
                });
            } else if (ltMatch) {
                const col = ltMatch[1].toLowerCase();
                const num = parseFloat(ltMatch[2]);
                rows = rows.filter(r => {
                    const rKey = Object.keys(r).find(k => k.toLowerCase() === col);
                    return rKey && parseFloat(r[rKey]) < num;
                });
            } else if (likeMatch) {
                const col = likeMatch[1].toLowerCase();
                const pattern = likeMatch[2].toLowerCase();
                rows = rows.filter(r => {
                    const rKey = Object.keys(r).find(k => k.toLowerCase() === col);
                    return rKey && String(r[rKey]).toLowerCase().includes(pattern);
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (orderByClause) {
        const parts = orderByClause.trim().split(/\s+/);
        const col = parts[0].toLowerCase();
        const desc = parts[1] && parts[1].toUpperCase() === 'DESC';

        rows.sort((a, b) => {
            const aKey = Object.keys(a).find(k => k.toLowerCase() === col);
            const bKey = Object.keys(b).find(k => k.toLowerCase() === col);
            const valA = a[aKey];
            const valB = b[bKey];
            if (typeof valA === 'number' && typeof valB === 'number') {
                return desc ? valB - valA : valA - valB;
            }
            return desc ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
        });
    }

    if (columnsPart.toUpperCase().includes('COUNT(') || columnsPart.toUpperCase().includes('AVG(') || columnsPart.toUpperCase().includes('SUM(')) {
        let aggResult = {};
        if (columnsPart.toUpperCase().includes('COUNT(')) {
            aggResult['Total_Count'] = rows.length;
        }
        if (columnsPart.toUpperCase().includes('AVG(SALARY)')) {
            const avg = rows.reduce((s, r) => s + (r.salary || 0), 0) / (rows.length || 1);
            aggResult['Avg_Salary'] = Math.round(avg);
        }
        if (columnsPart.toUpperCase().includes('SUM(SALARY)')) {
            const sum = rows.reduce((s, r) => s + (r.salary || 0), 0);
            aggResult['Total_Salary'] = sum;
        }
        rows = [aggResult];
    } else if (columnsPart !== '*') {
        const reqCols = columnsPart.split(',').map(c => c.trim().toLowerCase());
        rows = rows.map(r => {
            const projected = {};
            reqCols.forEach(col => {
                const rKey = Object.keys(r).find(k => k.toLowerCase() === col);
                if (rKey) projected[rKey] = r[rKey];
                else projected[col] = "NULL";
            });
            return projected;
        });
    }

    if (limitCount !== null && limitCount > 0) {
        rows = rows.slice(0, limitCount);
    }

    const duration = (performance.now() - startTime).toFixed(2);
    return {
        table: foundTableKey,
        rows: rows,
        count: rows.length,
        duration: duration
    };
}

function initPlaygroundPage() {
    const editor = document.getElementById('playgroundEditor');
    const runBtn = document.getElementById('runQueryBtn');
    const resultsContainer = document.getElementById('queryResultsContainer');
    const executionStats = document.getElementById('executionStats');
    const presetSelect = document.getElementById('presetQueriesSelect');

    if (!editor || !runBtn) return;

    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('query');
    if (queryParam) {
        if (queryParam.includes('select') || queryParam.includes('SELECT')) {
            editor.value = decodeURIComponent(queryParam);
        } else {
            editor.value = `SELECT * FROM Employees WHERE Salary > 75000 ORDER BY Salary DESC;`;
        }
    }

    function runCurrentQuery() {
        const sql = editor.value.trim();
        if (!sql) {
            window.showToast("Please enter a SQL query to execute", "error");
            return;
        }

        const result = executeMockSQL(sql);

        if (result.error) {
            resultsContainer.innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; padding: 1.2rem; color: #f87171;">
                    <strong>Execution Error:</strong><br>
                    ${result.error}
                </div>
            `;
            if (executionStats) executionStats.innerText = `Error • ${result.duration} ms`;
            return;
        }

        if (!result.rows || result.rows.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    Query executed successfully. 0 rows returned.
                </div>
            `;
            if (executionStats) executionStats.innerText = `0 rows • ${result.duration} ms`;
            return;
        }

        const cols = Object.keys(result.rows[0]);
        let tableHTML = `
            <div class="table-wrapper">
                <table class="sql-result-table">
                    <thead>
                        <tr>
                            ${cols.map(c => `<th>${c.toUpperCase()}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${result.rows.map(r => `
                            <tr>
                                ${cols.map(c => `<td>${r[c] !== undefined ? r[c] : '<em>NULL</em>'}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        resultsContainer.innerHTML = tableHTML;
        if (executionStats) {
            executionStats.innerText = `${result.count} rows returned in ${result.duration} ms`;
        }
        window.showToast(`Query executed: ${result.count} rows returned`, "success");
    }

    runBtn.addEventListener('click', runCurrentQuery);

    editor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCurrentQuery();
        }
    });

    if (presetSelect) {
        presetSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                editor.value = e.target.value;
                runCurrentQuery();
            }
        });
    }

    runCurrentQuery();
}

// ==========================================================================
// INTERACTIVE CHALLENGES ENGINE (For challenges.html)
// ==========================================================================
const SQL_CHALLENGES_DB = [
    {
        id: 1,
        title: "Filter High Earners",
        difficulty: "Easy",
        question: "Retrieve all records from the Employees table where the Salary is strictly greater than 80000.",
        table: "Employees(id, name, age, gender, salary, department, city)",
        expectedSQL: "SELECT * FROM Employees WHERE Salary > 80000",
        hint: "Use SELECT * with a WHERE clause comparing the Salary column.",
        sampleData: [
            { id: 1, name: "Amit Kumar", salary: 85000, department: "Engineering" },
            { id: 2, name: "Priya Sharma", salary: 92000, department: "AI/ML" }
        ]
    },
    {
        id: 2,
        title: "Count Employees by Department",
        difficulty: "Medium",
        question: "Find the total count of employees working in each department. Show department and count.",
        table: "Employees(id, name, salary, department)",
        expectedSQL: "SELECT Department, COUNT(*) FROM Employees GROUP BY Department",
        hint: "Combine GROUP BY Department with the COUNT(*) aggregate function.",
        sampleData: [
            { department: "Engineering", count: 3 },
            { department: "AI/ML", count: 2 }
        ]
    },
    {
        id: 3,
        title: "Top 3 Highest Paid Employees",
        difficulty: "Easy",
        question: "Write an MS SQL Server query to fetch the top 3 highest paid employees ordered by salary descending.",
        table: "Employees(id, name, salary, department)",
        expectedSQL: "SELECT TOP 3 * FROM Employees ORDER BY Salary DESC",
        hint: "Use the TOP 3 clause followed by ORDER BY Salary DESC.",
        sampleData: [
            { id: 8, name: "Pooja Reddy", salary: 95000 },
            { id: 2, name: "Priya Sharma", salary: 92000 },
            { id: 6, name: "Ananya Gupta", salary: 89000 }
        ]
    },
    {
        id: 4,
        title: "Filter by City Pattern (LIKE)",
        difficulty: "Easy",
        question: "Select the names of all employees who reside in a city starting with the letter 'I'.",
        table: "Employees(id, name, city)",
        expectedSQL: "SELECT Name FROM Employees WHERE City LIKE 'I%'",
        hint: "Use the LIKE operator with the wildcard 'I%'.",
        sampleData: [
            { name: "Amit Kumar", city: "Indore" },
            { name: "Vikas Singh", city: "Indore" }
        ]
    },
    {
        id: 5,
        title: "Average Salary with Filter (HAVING)",
        difficulty: "Hard",
        question: "Calculate the average salary per department, but only display departments where the average salary exceeds 80000.",
        table: "Employees(id, name, salary, department)",
        expectedSQL: "SELECT Department, AVG(Salary) FROM Employees GROUP BY Department HAVING AVG(Salary) > 80000",
        hint: "Use GROUP BY Department and append a HAVING AVG(Salary) > 80000 clause.",
        sampleData: [
            { department: "Engineering", avg_salary: 86000 },
            { department: "AI/ML", avg_salary: 90500 }
        ]
    },
    {
        id: 6,
        title: "Students in ECE Major",
        difficulty: "Easy",
        question: "Find all students majoring in 'ECE' who scored 90 or higher.",
        table: "Students(id, name, age, grade, major, score)",
        expectedSQL: "SELECT * FROM Students WHERE Major = 'ECE' AND Score >= 90",
        hint: "Combine two conditions in the WHERE clause using the AND operator.",
        sampleData: [
            { id: 101, name: "Amit Prasad", major: "ECE", score: 98 }
        ]
    },
    {
        id: 7,
        title: "Unique Department List",
        difficulty: "Easy",
        question: "Produce an alphabetized, unique list of all distinct departments from the Employees table.",
        table: "Employees(id, name, department)",
        expectedSQL: "SELECT DISTINCT Department FROM Employees ORDER BY Department ASC",
        hint: "Use DISTINCT Department followed by ORDER BY Department.",
        sampleData: [
            { department: "AI/ML" },
            { department: "Engineering" },
            { department: "Finance" }
        ]
    },
    {
        id: 8,
        title: "Update Employee Salary",
        difficulty: "Medium",
        question: "Write an UPDATE query to increment the salary of employee ID 1 by 10000.",
        table: "Employees(id, name, salary)",
        expectedSQL: "UPDATE Employees SET Salary = Salary + 10000 WHERE ID = 1",
        hint: "Use UPDATE Employees SET Salary = Salary + 10000 WHERE ID = 1.",
        sampleData: [
            { id: 1, name: "Amit Kumar", salary: 95000 }
        ]
    }
];

let activeChallengeIdx = 0;
let userChallengeScore = 0;

function initChallengesPage() {
    const container = document.getElementById('challengeContainer');
    if (!container) return;

    function renderCurrentChallenge() {
        const item = SQL_CHALLENGES_DB[activeChallengeIdx];
        const badgeClass = item.difficulty === 'Medium' ? 'badge-intermediate' :
            item.difficulty === 'Hard' ? 'badge-advanced' : 'badge-beginner';

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
                <div>
                    <span class="badge ${badgeClass}">${item.difficulty}</span>
                    <strong style="margin-left: 10px; font-size: 1.2rem; color: var(--text-main);">${item.title}</strong>
                </div>
                <div style="font-size: 0.88rem; color: var(--text-muted);">
                    Question <strong>${activeChallengeIdx + 1}</strong> of ${SQL_CHALLENGES_DB.length}
                </div>
            </div>

            <div class="challenge-question">
                <strong>Task:</strong> ${item.question}<br><br>
                <strong>Schema Reference:</strong> <code style="color: var(--cyan-primary); font-family: var(--font-mono);">${item.table}</code>
            </div>

            <div style="margin-bottom: 1rem;">
                <label style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 6px;">Your SQL Query:</label>
                <textarea id="challengeAnswerInput" class="challenge-editor" placeholder="e.g. SELECT * FROM Employees WHERE ..."></textarea>
            </div>

            <div class="challenge-buttons">
                <button class="btn btn-primary btn-sm" onclick="verifyChallengeAnswer()">
                    <span>Submit Query</span>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="toggleChallengeHint()">
                    <span>Show Hint</span>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="advanceChallenge(1)">
                    <span>Next Problem</span>
                </button>
            </div>

            <div id="hintBox" style="display: none; background: var(--cyan-subtle); border-left: 4px solid var(--cyan-primary); padding: 1rem; border-radius: 6px; margin-top: 1rem; font-size: 0.92rem;">
                <strong>Hint:</strong> ${item.hint}
            </div>

            <div id="challengeFeedback" class="feedback" style="display: none; margin-top: 1rem;"></div>
        `;

        const scoreEl = document.getElementById('userScoreDisplay');
        if (scoreEl) scoreEl.innerText = userChallengeScore;

        const progressEl = document.getElementById('challengeProgressFill');
        if (progressEl) {
            const pct = Math.round(((activeChallengeIdx + 1) / SQL_CHALLENGES_DB.length) * 100);
            progressEl.style.width = `${pct}%`;
        }
    }

    window.toggleChallengeHint = function () {
        const hintEl = document.getElementById('hintBox');
        if (hintEl) {
            hintEl.style.display = hintEl.style.display === 'none' ? 'block' : 'none';
        }
    };

    window.verifyChallengeAnswer = function () {
        const input = document.getElementById('challengeAnswerInput');
        const feedback = document.getElementById('challengeFeedback');
        if (!input || !feedback) return;

        const userVal = input.value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/;+$/, '');
        const target = SQL_CHALLENGES_DB[activeChallengeIdx].expectedSQL.toLowerCase().replace(/\s+/g, ' ').replace(/;+$/, '');

        feedback.style.display = 'block';

        if (userVal === target) {
            feedback.innerHTML = `
                <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.4); color: #16a34a; padding: 1rem; border-radius: 10px;">
                    <strong>Correct Query!</strong> (+10 points)
                </div>
            `;
            userChallengeScore += 10;
            const scoreEl = document.getElementById('userScoreDisplay');
            if (scoreEl) scoreEl.innerText = userChallengeScore;
            window.showToast("Query Verified! +10 points", "success");
        } else {
            feedback.innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); color: #ef4444; padding: 1rem; border-radius: 10px;">
                    <strong>Incorrect Query.</strong> Please check syntax or review the hint.<br>
                    <small style="color: var(--text-muted); display: block; margin-top: 6px;">Expected format: <code>${SQL_CHALLENGES_DB[activeChallengeIdx].expectedSQL}</code></small>
                </div>
            `;
        }
    };

    window.advanceChallenge = function (step) {
        activeChallengeIdx = (activeChallengeIdx + step) % SQL_CHALLENGES_DB.length;
        renderCurrentChallenge();
    };

    renderCurrentChallenge();
}

// ==========================================================================
// INITIALIZE ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupBottomNavbar();
    initNotesPage();
    initPlaygroundPage();
    initChallengesPage();
    updateProgressUI();
});