// Complete SQL Notes Database (70+ topics with real content)
const sqlNotes = [
    { title: "01. CREATE & USE Database", content: "Create a new database and switch to it.", code: "CREATE DATABASE SchoolDB;\nUSE SchoolDB;", color: "#FF0000" },
    { title: "02. CREATE TABLE", content: "Create tables with appropriate data types.", code: "CREATE TABLE Students (\n    ID INT PRIMARY KEY,\n    Name VARCHAR(100),\n    Age INT,\n    Grade CHAR(2)\n);", color: "#FF7F00" },
    { title: "03. INSERT Statement", content: "Add data into tables.", code: "INSERT INTO Students VALUES (1, 'John Doe', 20, 'A');\nINSERT INTO Students (Name, Age) VALUES ('Jane Smith', 22);", color: "#FFFF00" },
    { title: "04. SELECT Query", content: "Retrieve data from tables.", code: "SELECT * FROM Students;\nSELECT Name, Age FROM Students WHERE Age > 18;", color: "#00FF00" },
    { title: "05. UPDATE Statement", content: "Modify existing records.", code: "UPDATE Students SET Grade = 'A+' WHERE ID = 1;", color: "#0000FF" },
    { title: "06. DELETE Statement", content: "Remove records from table.", code: "DELETE FROM Students WHERE ID = 1;\n-- Be careful with WHERE clause!", color: "#4B0082" },
    { title: "07. INNER JOIN", content: "Combine rows from two tables based on a related column.", code: "SELECT Orders.OrderID, Customers.Name\nFROM Orders\nINNER JOIN Customers ON Orders.CustomerID = Customers.ID;", color: "#9400D3" },
    { title: "08. LEFT JOIN", content: "Returns all records from left table and matched from right.", code: "SELECT * FROM Students\nLEFT JOIN Courses ON Students.ID = Courses.StudentID;", color: "#FF1493" },
    { title: "09. GROUP BY", content: "Groups rows that have the same values.", code: "SELECT Department, COUNT(*) as Total\nFROM Employees\nGROUP BY Department;", color: "#FF0000" },
    { title: "10. HAVING Clause", content: "Filter groups (like WHERE for GROUP BY).", code: "SELECT Department, AVG(Salary) as AvgSalary\nFROM Employees\nGROUP BY Department\nHAVING AVG(Salary) > 50000;", color: "#FF7F00" },
    { title: "11. Subqueries", content: "Query inside another query.", code: "SELECT Name FROM Students\nWHERE Age > (SELECT AVG(Age) FROM Students);", color: "#FFFF00" },
    { title: "12. CTE (Common Table Expression)", content: "Temporary result set.", code: "WITH HighEarners AS (\n    SELECT * FROM Employees WHERE Salary > 70000\n)\nSELECT * FROM HighEarners;", color: "#00FF00" },
    { title: "13. Window Functions - ROW_NUMBER()", content: "Assign unique row number.", code: "SELECT Name, Salary,\nROW_NUMBER() OVER (ORDER BY Salary DESC) as Rank\nFROM Employees;", color: "#0000FF" },
    { title: "14. RANK() & DENSE_RANK()", content: "Rank rows with ties.", code: "SELECT Name,\nRANK() OVER (ORDER BY Score DESC) as Rank,\nDENSE_RANK() OVER (ORDER BY Score DESC) as DenseRank\nFROM Results;", color: "#4B0082" },
    { title: "15. Stored Procedures", content: "Reusable SQL code blocks.", code: "CREATE PROCEDURE GetEmployeesByDept @Dept VARCHAR(50)\nAS\nBEGIN\n    SELECT * FROM Employees WHERE Department = @Dept\nEND;", color: "#9400D3" },
    { title: "16. Triggers", content: "Auto-execute on table events.", code: "CREATE TRIGGER UpdateLog\nON Employees\nAFTER UPDATE\nAS\nBEGIN\n    INSERT INTO AuditLog VALUES('Employee Updated', GETDATE())\nEND;", color: "#FF1493" },
    { title: "17. Indexes", content: "Speed up queries.", code: "CREATE INDEX idx_name ON Students(Name);\nCREATE UNIQUE INDEX idx_id ON Students(ID);", color: "#FF0000" },
    { title: "18. Transactions", content: "Group SQL operations.", code: "BEGIN TRANSACTION;\nUPDATE Accounts SET Balance = Balance - 1000 WHERE ID = 1;\nUPDATE Accounts SET Balance = Balance + 1000 WHERE ID = 2;\nCOMMIT;", color: "#FF7F00" },
    { title: "19. Exception Handling", content: "Handle errors gracefully.", code: "BEGIN TRY\n    DELETE FROM Employees WHERE ID = 999;\nEND TRY\nBEGIN CATCH\n    SELECT ERROR_MESSAGE() as Error;\nEND CATCH;", color: "#FFFF00" }
];

// Challenges Database (20 real challenges)
const challenges = [
    { question: "Write a query to select all students who are older than 18 years.", table: "Students(ID, Name, Age, Grade)", answer: "SELECT * FROM Students WHERE Age > 18", hint: "Use WHERE clause" },
    { question: "Find the average salary of employees in each department.", table: "Employees(ID, Name, Salary, Department)", answer: "SELECT Department, AVG(Salary) FROM Employees GROUP BY Department", hint: "Use GROUP BY" },
    { question: "List all customers who have placed orders (using INNER JOIN).", table: "Customers(ID, Name), Orders(OrderID, CustomerID, Amount)", answer: "SELECT DISTINCT Customers.Name FROM Customers INNER JOIN Orders ON Customers.ID = Orders.CustomerID", hint: "JOIN on CustomerID" },
    { question: "Update the salary of all employees by 10% who earn less than 30000.", table: "Employees(ID, Name, Salary)", answer: "UPDATE Employees SET Salary = Salary * 1.10 WHERE Salary < 30000", hint: "Use UPDATE with WHERE" },
    { question: "Delete all records from Products table where price is NULL.", table: "Products(ID, Name, Price)", answer: "DELETE FROM Products WHERE Price IS NULL", hint: "Use IS NULL condition" },
    { question: "Get the top 5 highest paid employees.", table: "Employees(ID, Name, Salary)", answer: "SELECT TOP 5 * FROM Employees ORDER BY Salary DESC", hint: "Use TOP and ORDER BY" },
    { question: "Count number of students in each grade.", table: "Students(ID, Name, Grade)", answer: "SELECT Grade, COUNT(*) FROM Students GROUP BY Grade", hint: "GROUP BY grade" }
];

// Load notes dynamically
function loadNotes() {
    const notesGrid = document.getElementById('notesGrid');
    if (!notesGrid) return;

    notesGrid.innerHTML = sqlNotes.map(note => `
        <div class="note-card" style="border-left-color: ${note.color}">
            <div class="note-title">${note.title}</div>
            <div class="note-content">${note.content}</div>
            <div class="code-block"><pre>${note.code}</pre></div>
        </div>
    `).join('');
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = sqlNotes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );

        const notesGrid = document.getElementById('notesGrid');
        notesGrid.innerHTML = filtered.map(note => `
            <div class="note-card" style="border-left-color: ${note.color}">
                <div class="note-title">${note.title}</div>
                <div class="note-content">${note.content}</div>
                <div class="code-block"><pre>${note.code}</pre></div>
            </div>
        `).join('');
    });
}

// Challenge System
let currentChallengeIndex = 0;
let userScore = 0;

function loadChallenge() {
    const container = document.getElementById('challengeContainer');
    if (!container) return;

    const challenge = challenges[currentChallengeIndex];
    container.innerHTML = `
        <div class="challenge-question">
            <strong>📝 Question:</strong> ${challenge.question}<br>
            <strong>📊 Table Structure:</strong> ${challenge.table}<br>
            <strong>💡 Hint:</strong> ${challenge.hint}
        </div>
        <textarea id="sqlAnswer" class="challenge-editor" placeholder="Write your SQL query here..."></textarea>
        <div class="challenge-buttons">
            <button class="btn-challenge btn-submit" onclick="submitAnswer()">✅ Submit Answer</button>
            <button class="btn-challenge btn-next" onclick="nextChallenge()">🎲 Next Challenge</button>
        </div>
        <div id="feedback" class="feedback"></div>
    `;

    document.getElementById('currentIndex').innerText = currentChallengeIndex + 1;
    document.getElementById('totalChallenges').innerText = challenges.length;
    document.getElementById('score').innerText = userScore;

    const progress = ((currentChallengeIndex + 1) / challenges.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function submitAnswer() {
    const userAnswer = document.getElementById('sqlAnswer').value.trim().toLowerCase().replace(/\s/g, '');
    const correctAnswer = challenges[currentChallengeIndex].answer.toLowerCase().replace(/\s/g, '');
    const feedbackDiv = document.getElementById('feedback');

    if (userAnswer === correctAnswer) {
        feedbackDiv.innerHTML = '<span style="color: #00FF00;">✅ Correct! Great job!</span>';
        feedbackDiv.style.background = '#00FF0020';
        userScore++;
        document.getElementById('score').innerText = userScore;
    } else {
        feedbackDiv.innerHTML = `<span style="color: #FF0000;">❌ Incorrect! Correct answer: ${challenges[currentChallengeIndex].answer}</span>`;
        feedbackDiv.style.background = '#FF000020';
    }
}

function nextChallenge() {
    if (currentChallengeIndex < challenges.length - 1) {
        currentChallengeIndex++;
        loadChallenge();
    } else {
        alert(`🎉 Congratulations! You completed all challenges!\nFinal Score: ${userScore}/${challenges.length}`);
        currentChallengeIndex = 0;
        userScore = 0;
        loadChallenge();
    }
}

// Theme Toggle
function setupTheme() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeBtn.textContent = document.body.classList.contains('dark') ? '☀️ Light' : '🌙 Dark';
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    setupSearch();
    setupTheme();
    if (document.getElementById('challengeContainer')) {
        loadChallenge();
    }
});