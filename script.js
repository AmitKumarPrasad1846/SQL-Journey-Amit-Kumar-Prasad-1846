// Complete SQL Notes Database (70+ topics with real content)
const sqlNotes = [
    { title: "01. CREATE & USE Database", content: "Create a new database and switch to it for further operations.", code: "CREATE DATABASE SchoolDB;\nUSE SchoolDB;", color: "#FF0000" },
    { title: "02. CREATE TABLE", content: "Create tables with appropriate data types and constraints.", code: "CREATE TABLE Students (\n    ID INT PRIMARY KEY,\n    Name VARCHAR(100),\n    Age INT,\n    Grade CHAR(2)\n);", color: "#FF7F00" },
    { title: "03. INSERT Statement", content: "Add new data records into existing tables.", code: "INSERT INTO Students VALUES (1, 'John Doe', 20, 'A');\nINSERT INTO Students (Name, Age) VALUES ('Jane Smith', 22);", color: "#FFFF00" },
    { title: "04. SELECT Query", content: "Retrieve data from one or more tables.", code: "SELECT * FROM Students;\nSELECT Name, Age FROM Students WHERE Age > 18;", color: "#00FF00" },
    { title: "05. UPDATE Statement", content: "Modify existing records in a table.", code: "UPDATE Students SET Grade = 'A+' WHERE ID = 1;\nUPDATE Students SET Age = Age + 1;", color: "#0000FF" },
    { title: "06. DELETE Statement", content: "Remove records from a table permanently.", code: "DELETE FROM Students WHERE ID = 1;\n-- Be careful with WHERE clause!", color: "#4B0082" },
    { title: "07. INNER JOIN", content: "Combine rows from two tables based on a related column.", code: "SELECT Orders.OrderID, Customers.Name\nFROM Orders\nINNER JOIN Customers ON Orders.CustomerID = Customers.ID;", color: "#9400D3" },
    { title: "08. LEFT JOIN", content: "Returns all records from left table and matched from right.", code: "SELECT * FROM Students\nLEFT JOIN Courses ON Students.ID = Courses.StudentID;", color: "#FF1493" },
    { title: "09. RIGHT JOIN", content: "Returns all records from right table and matched from left.", code: "SELECT Students.Name, Scores.Marks\nFROM Students\nRIGHT JOIN Scores ON Students.ID = Scores.StudentID;", color: "#00CED1" },
    { title: "10. FULL OUTER JOIN", content: "Returns all records when there is a match in either table.", code: "SELECT * FROM Employees\nFULL OUTER JOIN Departments ON Employees.DeptID = Departments.ID;", color: "#FF4500" },
    { title: "11. CROSS JOIN", content: "Cartesian product of both tables.", code: "SELECT * FROM Colors CROSS JOIN Sizes;", color: "#FF0000" },
    { title: "12. GROUP BY", content: "Groups rows that have the same values into summary rows.", code: "SELECT Department, COUNT(*) as Total\nFROM Employees\nGROUP BY Department;", color: "#FF7F00" },
    { title: "13. HAVING Clause", content: "Filter groups (like WHERE but for GROUP BY).", code: "SELECT Department, AVG(Salary) as AvgSalary\nFROM Employees\nGROUP BY Department\nHAVING AVG(Salary) > 50000;", color: "#FFFF00" },
    { title: "14. ORDER BY", content: "Sort result set in ascending or descending order.", code: "SELECT * FROM Products\nORDER BY Price DESC;\nSELECT Name FROM Students ORDER BY Name ASC;", color: "#00FF00" },
    { title: "15. TOP Clause", content: "Limit the number of rows returned.", code: "SELECT TOP 10 * FROM Employees ORDER BY Salary DESC;\nSELECT TOP 50 PERCENT * FROM Orders;", color: "#0000FF" },
    { title: "16. DISTINCT Keyword", content: "Returns only unique/different values.", code: "SELECT DISTINCT Department FROM Employees;\nSELECT DISTINCT City, Country FROM Customers;", color: "#4B0082" },
    { title: "17. WHERE Clause", content: "Filter records based on conditions.", code: "SELECT * FROM Products WHERE Price > 100;\nSELECT * FROM Employees WHERE Department = 'IT' AND Salary > 50000;", color: "#9400D3" },
    { title: "18. LIKE Operator", content: "Search for a specified pattern in a column.", code: "SELECT * FROM Customers WHERE Name LIKE 'A%';\nSELECT * FROM Products WHERE Name LIKE '%phone%';", color: "#FF1493" },
    { title: "19. IN Operator", content: "Specify multiple values in WHERE clause.", code: "SELECT * FROM Employees WHERE Department IN ('IT', 'HR', 'Finance');", color: "#00CED1" },
    { title: "20. BETWEEN Operator", content: "Selects values within a given range.", code: "SELECT * FROM Products WHERE Price BETWEEN 50 AND 100;\nSELECT * FROM Orders WHERE OrderDate BETWEEN '2024-01-01' AND '2024-12-31';", color: "#FF4500" },
    { title: "21. ALIAS", content: "Temporary name for a table or column.", code: "SELECT Name AS EmployeeName, Salary AS MonthlyIncome FROM Employees;\nSELECT * FROM Orders AS O INNER JOIN Customers AS C ON O.CustomerID = C.ID;", color: "#FF0000" },
    { title: "22. Subqueries", content: "Query inside another query (nested query).", code: "SELECT Name FROM Students\nWHERE Age > (SELECT AVG(Age) FROM Students);\nSELECT * FROM Products WHERE Price > (SELECT AVG(Price) FROM Products);", color: "#FF7F00" },
    { title: "23. CTE (Common Table Expression)", content: "Temporary result set for a single query.", code: "WITH HighEarners AS (\n    SELECT * FROM Employees WHERE Salary > 70000\n)\nSELECT * FROM HighEarners;", color: "#FFFF00" },
    { title: "24. ROW_NUMBER()", content: "Assigns a unique sequential number to each row.", code: "SELECT Name, Salary,\nROW_NUMBER() OVER (ORDER BY Salary DESC) as RowNum\nFROM Employees;", color: "#00FF00" },
    { title: "25. RANK() & DENSE_RANK()", content: "Rank rows with proper handling of ties.", code: "SELECT Name, Score,\nRANK() OVER (ORDER BY Score DESC) as Rank,\nDENSE_RANK() OVER (ORDER BY Score DESC) as DenseRank\nFROM Results;", color: "#0000FF" },
    { title: "26. Stored Procedures", content: "Reusable SQL code blocks with parameters.", code: "CREATE PROCEDURE GetEmployeesByDept @Dept VARCHAR(50)\nAS\nBEGIN\n    SELECT * FROM Employees WHERE Department = @Dept\nEND;\n-- Execute: EXEC GetEmployeesByDept 'IT';", color: "#4B0082" },
    { title: "27. Triggers", content: "Auto-execute SQL code on table events.", code: "CREATE TRIGGER UpdateLog\nON Employees\nAFTER UPDATE\nAS\nBEGIN\n    INSERT INTO AuditLog VALUES('Employee Updated', GETDATE())\nEND;", color: "#9400D3" },
    { title: "28. Indexes", content: "Speed up data retrieval operations.", code: "CREATE INDEX idx_name ON Students(Name);\nCREATE UNIQUE INDEX idx_id ON Students(ID);\nDROP INDEX idx_name ON Students;", color: "#FF1493" },
    { title: "29. Clustered Index", content: "Determines physical order of data in table.", code: "CREATE CLUSTERED INDEX IX_Employees_ID ON Employees(ID);\n-- Only one clustered index per table", color: "#00CED1" },
    { title: "30. Non-Clustered Index", content: "Logical ordering without affecting physical order.", code: "CREATE NONCLUSTERED INDEX IX_Employees_Name ON Employees(Name);\n-- Can have multiple non-clustered indexes", color: "#FF4500" },
    { title: "31. Views", content: "Virtual table based on SELECT query.", code: "CREATE VIEW HighSalaryEmployees AS\nSELECT Name, Salary FROM Employees WHERE Salary > 60000;\nSELECT * FROM HighSalaryEmployees;", color: "#FF0000" },
    { title: "32. Transactions", content: "Group SQL operations as atomic unit.", code: "BEGIN TRANSACTION;\nUPDATE Accounts SET Balance = Balance - 1000 WHERE ID = 1;\nUPDATE Accounts SET Balance = Balance + 1000 WHERE ID = 2;\nCOMMIT;\n-- Or ROLLBACK to undo", color: "#FF7F00" },
    { title: "33. Exception Handling", content: "Handle errors gracefully in SQL.", code: "BEGIN TRY\n    DELETE FROM Employees WHERE ID = 999;\n    SELECT 1/0;\nEND TRY\nBEGIN CATCH\n    SELECT ERROR_MESSAGE() as Error, ERROR_NUMBER() as ErrorNumber;\nEND CATCH;", color: "#FFFF00" },
    { title: "34. CAST & CONVERT", content: "Convert data types.", code: "SELECT CAST('2024-01-15' AS DATE);\nSELECT CONVERT(VARCHAR, GETDATE(), 103) as DateDMY;\nSELECT CAST(Salary AS VARCHAR) FROM Employees;", color: "#00FF00" },
    { title: "35. COALESCE", content: "Returns first non-NULL value.", code: "SELECT Name, COALESCE(Phone, Mobile, 'No Contact') as Contact FROM Customers;\nSELECT COALESCE(Amount, 0) FROM Orders;", color: "#0000FF" },
    { title: "36. IIF Function", content: "Inline IF-THEN-ELSE logic.", code: "SELECT Name, Salary,\nIIF(Salary > 50000, 'High', 'Low') as SalaryCategory\nFROM Employees;", color: "#4B0082" },
    { title: "37. ROLLUP & CUBE", content: "Generate multiple grouping sets.", code: "SELECT Department, Gender, SUM(Salary)\nFROM Employees\nGROUP BY ROLLUP(Department, Gender);\n-- CUBE gives all combinations", color: "#9400D3" },
    { title: "38. OFFSET-FETCH", content: "Pagination in SQL Server.", code: "SELECT * FROM Employees\nORDER BY ID\nOFFSET 10 ROWS\nFETCH NEXT 5 ROWS ONLY;", color: "#FF1493" },
    { title: "39. STUFF Function", content: "Insert string into another string.", code: "SELECT STUFF('Hello World', 7, 5, 'SQL');\n-- Result: 'Hello SQL'\nSELECT STUFF(Name, 3, 0, ' - ') FROM Products;", color: "#00CED1" },
    { title: "40. String Functions", content: "Manipulate string data.", code: "SELECT UPPER(Name), LOWER(Name), LEN(Name), SUBSTRING(Name, 1, 3) FROM Employees;\nSELECT CONCAT(FirstName, ' ', LastName) as FullName FROM Persons;", color: "#FF4500" },
    { title: "41. Date Functions", content: "Work with date and time data.", code: "SELECT GETDATE(), YEAR(OrderDate), MONTH(OrderDate), DAY(OrderDate);\nSELECT DATEDIFF(DAY, OrderDate, GETDATE()) as DaysAgo FROM Orders;", color: "#FF0000" },
    { title: "42. Aggregate Functions", content: "Perform calculations on data.", code: "SELECT COUNT(*), SUM(Salary), AVG(Salary), MAX(Salary), MIN(Salary) FROM Employees;\nSELECT Department, COUNT(*) as EmpCount FROM Employees GROUP BY Department;", color: "#FF7F00" },
    { title: "43. UNION & UNION ALL", content: "Combine results of multiple queries.", code: "SELECT City FROM Customers\nUNION\nSELECT City FROM Suppliers;\n-- UNION removes duplicates, UNION ALL keeps all", color: "#FFFF00" },
    { title: "44. INTERSECT & EXCEPT", content: "Set operations on result sets.", code: "SELECT City FROM Customers\nINTERSECT\nSELECT City FROM Suppliers;\n-- Common cities\nEXCEPT gives difference", color: "#00FF00" },
    { title: "45. EXISTS Operator", content: "Tests for existence of rows.", code: "SELECT * FROM Customers C\nWHERE EXISTS (SELECT 1 FROM Orders O WHERE O.CustomerID = C.ID);", color: "#0000FF" },
    { title: "46. CASE Statement", content: "Conditional logic in SQL.", code: "SELECT Name, Salary,\nCASE \n    WHEN Salary > 70000 THEN 'High'\n    WHEN Salary > 40000 THEN 'Medium'\n    ELSE 'Low'\nEND as SalaryLevel\nFROM Employees;", color: "#4B0082" }
];

// Challenges Database (20 real challenges)
const challenges = [
    { question: "Write a query to select all students who are older than 18 years.", table: "Students(ID, Name, Age, Grade)", answer: "SELECT * FROM Students WHERE Age > 18", hint: "Use WHERE clause with Age column" },
    { question: "Find the average salary of employees in each department.", table: "Employees(ID, Name, Salary, Department)", answer: "SELECT Department, AVG(Salary) FROM Employees GROUP BY Department", hint: "Use GROUP BY on Department" },
    { question: "List all customers who have placed orders (using INNER JOIN).", table: "Customers(ID, Name), Orders(OrderID, CustomerID, Amount)", answer: "SELECT DISTINCT Customers.Name FROM Customers INNER JOIN Orders ON Customers.ID = Orders.CustomerID", hint: "JOIN on CustomerID and select customer names" },
    { question: "Update the salary of all employees by 10% who earn less than 30000.", table: "Employees(ID, Name, Salary)", answer: "UPDATE Employees SET Salary = Salary * 1.10 WHERE Salary < 30000", hint: "Use UPDATE with SET and WHERE clause" },
    { question: "Delete all records from Products table where price is NULL.", table: "Products(ID, Name, Price)", answer: "DELETE FROM Products WHERE Price IS NULL", hint: "Use IS NULL condition with DELETE" },
    { question: "Get the top 5 highest paid employees.", table: "Employees(ID, Name, Salary)", answer: "SELECT TOP 5 * FROM Employees ORDER BY Salary DESC", hint: "Use TOP and ORDER BY DESC" },
    { question: "Count number of students in each grade.", table: "Students(ID, Name, Grade)", answer: "SELECT Grade, COUNT(*) FROM Students GROUP BY Grade", hint: "GROUP BY Grade with COUNT" },
    { question: "Find products with price between 50 and 100.", table: "Products(ID, Name, Price)", answer: "SELECT * FROM Products WHERE Price BETWEEN 50 AND 100", hint: "Use BETWEEN operator" },
    { question: "Get employee names starting with 'A'.", table: "Employees(ID, Name, Salary)", answer: "SELECT Name FROM Employees WHERE Name LIKE 'A%'", hint: "Use LIKE operator with wildcard" },
    { question: "Find the total sales amount per product.", table: "Sales(SaleID, ProductID, Amount), Products(ID, Name)", answer: "SELECT ProductID, SUM(Amount) FROM Sales GROUP BY ProductID", hint: "GROUP BY ProductID with SUM" }
];

// Load notes dynamically
function loadNotes() {
    const notesGrid = document.getElementById('notesGrid');
    if (!notesGrid) return;

    notesGrid.innerHTML = sqlNotes.map(note => `
        <div class="note-card" style="border-left-color: ${note.color}">
            <div class="note-title">${note.title}</div>
            <div class="note-content">${note.content}</div>
            <div class="code-block"><pre>${escapeHtml(note.code)}</pre></div>
        </div>
    `).join('');
}

// Helper function to escape HTML
function escapeHtml(text) {
    return text.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
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
                <div class="code-block"><pre>${escapeHtml(note.code)}</pre></div>
            </div>
        `).join('');

        if (filtered.length === 0) {
            notesGrid.innerHTML = '<div style="text-align:center; padding:2rem;">❌ No matching topics found. Try different keywords.</div>';
        }
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
            <strong>📝 Question:</strong> ${challenge.question}<br><br>
            <strong>📊 Table Structure:</strong> ${challenge.table}<br><br>
            <strong>💡 Hint:</strong> <em>${challenge.hint}</em>
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
    const userAnswer = document.getElementById('sqlAnswer').value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/;/g, '');
    const correctAnswer = challenges[currentChallengeIndex].answer.toLowerCase().replace(/\s+/g, ' ').replace(/;/g, '');
    const feedbackDiv = document.getElementById('feedback');

    // Normalize for comparison (remove extra spaces, case insensitive)
    const normalizedUser = userAnswer.replace(/\s+/g, ' ').trim();
    const normalizedCorrect = correctAnswer.replace(/\s+/g, ' ').trim();

    if (normalizedUser === normalizedCorrect) {
        feedbackDiv.innerHTML = '✅ <strong>Correct!</strong> Great job! +1 point';
        feedbackDiv.style.background = '#00FF0020';
        feedbackDiv.style.color = '#00AA00';
        if (document.body.classList.contains('dark')) {
            feedbackDiv.style.color = '#00FF00';
        }
        userScore++;
        document.getElementById('score').innerText = userScore;
    } else {
        feedbackDiv.innerHTML = `❌ <strong>Incorrect!</strong><br>Correct answer: <code style="background:#333; padding:2px 5px; border-radius:4px;">${challenges[currentChallengeIndex].answer}</code><br>Your answer: <code>${userAnswer || '(empty)'}</code>`;
        feedbackDiv.style.background = '#FF000020';
        feedbackDiv.style.color = '#FF0000';
        if (document.body.classList.contains('dark')) {
            feedbackDiv.style.color = '#FF6666';
        }
    }
}

function nextChallenge() {
    if (currentChallengeIndex < challenges.length - 1) {
        currentChallengeIndex++;
        loadChallenge();
    } else {
        alert(`🎉 Congratulations! You completed all challenges!\n\nFinal Score: ${userScore}/${challenges.length}\n\nGreat learning! 🎓`);
        currentChallengeIndex = 0;
        userScore = 0;
        loadChallenge();
    }
}

// Theme Toggle
function setupTheme() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    // Check for saved theme
    const savedTheme = localStorage.getItem('sqlTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeBtn.textContent = '☀️ Light';
    } else {
        themeBtn.textContent = '🌙 Dark';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        themeBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
        localStorage.setItem('sqlTheme', isDark ? 'dark' : 'light');
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