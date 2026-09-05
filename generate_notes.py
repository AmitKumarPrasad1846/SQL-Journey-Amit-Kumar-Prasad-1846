# -*- coding: utf-8 -*-
"""
Generator script to build all 57 standalone HTML lesson pages in the notes/ directory,
and export the structured metadata for notes.html and script.js.
"""

import os
import glob
import re
import json

TOPIC_CONFIGS = [
    # 01 - 15: DDL & Database / Table Basics
    {
        "id": 1,
        "title": "Create Database & USE Database",
        "category": "DDL & Setup",
        "difficulty": "Beginner",
        "readTime": "2 min",
        "summary": "Learn how to create a brand new database in MS SQL Server and switch context using the USE statement.",
        "theory": "In MS SQL Server, a database serves as the container for tables, views, stored procedures, and security principals. The `CREATE DATABASE` statement provisions physical data files (.mdf) and transaction log files (.ldf). The `USE` statement sets the execution context of the current session to the specified database so subsequent commands target the correct schema.",
        "pro_tip": "Always verify that you are connected to the target database before running schema alteration scripts to avoid accidentally modifying system databases like master or model.",
        "expected_output": "Commands completed successfully. Session context switched to Google."
    },
    {
        "id": 2,
        "title": "Create a Table",
        "category": "DDL & Setup",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Define schema, columns, and data types (INT, VARCHAR, FLOAT) to establish structured tables.",
        "theory": "Tables represent the relational foundation of SQL Server. `CREATE TABLE` defines the column names and their associated data types (such as `INT`, `VARCHAR(n)`, `DECIMAL(p,s)`, `DATETIME`). Selecting appropriate data types minimizes disk I/O, optimizes indexing, and prevents invalid data entry.",
        "pro_tip": "Prefer VARCHAR over CHAR when string lengths vary significantly to conserve storage, but consider CHAR for fixed-length codes like ISO currency or status codes.",
        "expected_output": "Table created successfully with columns: id, name, age, gender, salary, city."
    },
    {
        "id": 3,
        "title": "INSERT Statement",
        "category": "Core DML",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Populate tables with single and multi-row data records using standard SQL INSERT syntax.",
        "theory": "The `INSERT INTO` statement appends new records into a table. You can specify target column lists explicitly—which is recommended for production resilience—or insert positionally matching all columns. MS SQL Server supports multi-row inserts in a single statement using comma-separated value tuples.",
        "pro_tip": "Always specify explicit column lists in INSERT statements: `INSERT INTO table (col1, col2) VALUES (...)`. This prevents runtime failures if table columns are reordered or added.",
        "expected_output": "Rows inserted into employee table: 1 Amit, 2 Priya, 3 Rahul, etc."
    },
    {
        "id": 4,
        "title": "UPDATE Statement",
        "category": "Core DML",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Safely modify existing records in a table with targeted WHERE filter conditions.",
        "theory": "The `UPDATE` statement modifies column values for existing rows. Applying a `WHERE` clause filters the modification to specific records. Omitting the `WHERE` clause updates every single row in the table, which can lead to catastrophic data loss if unintentional.",
        "pro_tip": "Run a `SELECT * FROM table WHERE condition` first to verify exactly which records will be affected before converting it to an `UPDATE` statement.",
        "expected_output": "1 row affected: Employee ID 3 salary updated to 65000."
    },
    {
        "id": 5,
        "title": "SELECT Statement",
        "category": "Core DML",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Retrieve data rows and project specific columns using SELECT, WHERE, and comparison operators.",
        "theory": "The `SELECT` query is the foundational operation for data retrieval. SQL processes clauses in a logical order: `FROM` -> `WHERE` -> `SELECT`. Projections specify exactly which columns are sent over the network, reducing bandwidth and CPU overhead.",
        "pro_tip": "Avoid `SELECT *` in production applications. Requesting only needed columns leverages non-clustered covering indexes and cuts network payload.",
        "expected_output": "Result set displayed with filtered employee rows matching criteria."
    },
    {
        "id": 6,
        "title": "TOP Clause",
        "category": "Core DML",
        "difficulty": "Beginner",
        "readTime": "2 min",
        "summary": "Restrict query result row counts using TOP N and TOP N PERCENT in MS SQL Server.",
        "theory": "The `TOP` clause restricts the number of rows returned by a query. When paired with `ORDER BY`, `TOP (N)` reliably returns the highest or lowest ranked records (e.g. top earners, most recent transactions). You can also retrieve a percentage using `TOP (N) PERCENT`.",
        "pro_tip": "Always pair `TOP` with an deterministic `ORDER BY` clause to guarantee consistent and reproducible results.",
        "expected_output": "Top 3 highest salary employee records displayed."
    },
    {
        "id": 7,
        "title": "DISTINCT Keyword",
        "category": "Core DML",
        "difficulty": "Beginner",
        "readTime": "2 min",
        "summary": "Eliminate duplicate result rows to produce unique lists of values or composite combinations.",
        "theory": "`DISTINCT` evaluates the entire projected column set and removes duplicate rows from the final result set. It executes after the WHERE clause and requires an internal sort or hash aggregate operation to identify uniqueness.",
        "pro_tip": "Overusing DISTINCT can mask underlying JOIN issues that cause unintended duplication. Inspect your JOIN keys if unexpected duplicates appear.",
        "expected_output": "Distinct department list returned: ['Engineering', 'Marketing', 'Finance', 'HR']."
    },
    {
        "id": 8,
        "title": "DELETE Statement",
        "category": "Core DML",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Remove individual records matching a WHERE predicate while recording entries in the transaction log.",
        "theory": "The `DELETE` statement removes specific rows from a table. Unlike TRUNCATE, DELETE logs every deleted row individually, allowing rollback within transactions and firing `AFTER DELETE` triggers.",
        "pro_tip": "Wrap critical DELETE operations inside a `BEGIN TRANSACTION` block, inspect the row count using `@@ROWCOUNT`, and only `COMMIT` if the count matches your expectation.",
        "expected_output": "1 row affected: Deleted employee with ID 5."
    },
    {
        "id": 9,
        "title": "Cloning Tables (SELECT INTO)",
        "category": "DDL & Setup",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Duplicate table schema and data in one step using the powerful SELECT INTO statement.",
        "theory": "`SELECT * INTO NewTable FROM ExistingTable` creates a new destination table with matching column names and data types, copying all records. It is minimally logged in bulk-logged or simple recovery models, making it very fast for creating backups or test fixtures.",
        "pro_tip": "To clone ONLY the table structure without copying any data rows, add a false condition: `SELECT * INTO EmptyClone FROM SourceTable WHERE 1 = 0;`.",
        "expected_output": "New table employee_backup created with identical data."
    },
    {
        "id": 10,
        "title": "DELETE vs DROP vs TRUNCATE",
        "category": "DDL & Setup",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Understand the critical differences between row deletion, structure deletion, and table deallocation.",
        "theory": "- `DELETE`: DML operation, can filter with WHERE, logs row-by-row, fires triggers, does not reset IDENTITY.\n- `TRUNCATE`: DDL operation, removes all rows by deallocating data pages, minimal logging, resets IDENTITY, faster than DELETE.\n- `DROP`: DDL operation, completely destroys both data and table structure from the catalog.",
        "pro_tip": "`TRUNCATE` cannot be used on tables referenced by FOREIGN KEY constraints, even if the referencing table is empty.",
        "expected_output": "Demonstrations comparing row deletions, truncate identity resets, and table drops."
    },
    {
        "id": 11,
        "title": "ALTER Table",
        "category": "DDL & Setup",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Modify table definitions by adding new columns, removing deprecated columns, or changing properties.",
        "theory": "The `ALTER TABLE` DDL statement lets you evolve database schemas over time without rebuilding tables from scratch. You can `ADD` new columns with default values, `DROP COLUMN` for deprecated attributes, or alter constraints.",
        "pro_tip": "When adding a NOT NULL column to an existing table populated with data, provide a DEFAULT constraint so existing rows receive a valid value.",
        "expected_output": "Column 'department' successfully added to employee table."
    },
    {
        "id": 12,
        "title": "DROP Database",
        "category": "DDL & Setup",
        "difficulty": "Beginner",
        "readTime": "2 min",
        "summary": "Permanently delete database containers and clean up underlying OS storage files.",
        "theory": "`DROP DATABASE` removes one or more user databases from the SQL Server instance, deleting disk data files (.mdf/.ndf) and log files (.ldf). A database cannot be dropped while open connections exist.",
        "pro_tip": "To force drop a database with active connections: `ALTER DATABASE [DB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [DB];`.",
        "expected_output": "Database School successfully dropped."
    },
    {
        "id": 13,
        "title": "Renaming Column (sp_rename)",
        "category": "DDL & Setup",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Use the system stored procedure sp_rename to rename columns and tables safely.",
        "theory": "In MS SQL Server, renaming a column is executed via the system stored procedure `sp_rename 'TableName.OldColumn', 'NewColumn', 'COLUMN'`. This updates catalog metadata without copying data.",
        "pro_tip": "Renaming columns can break dependent views, stored procedures, or applications. Query `sys.sql_expression_dependencies` before renaming.",
        "expected_output": "Caution: Changing any part of an object name could break scripts. Column renamed."
    },
    {
        "id": 14,
        "title": "Change Datatype of Column",
        "category": "DDL & Setup",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Alter column definitions using ALTER TABLE ALTER COLUMN to expand capacity or precision.",
        "theory": "`ALTER TABLE table_name ALTER COLUMN column_name new_data_type` modifies the type or size of a column. Expanding `VARCHAR(50)` to `VARCHAR(100)` is an efficient metadata operation.",
        "pro_tip": "You cannot change the data type of a column participating in a primary key or foreign key constraint until the constraint is temporarily dropped.",
        "expected_output": "Column salary converted to BIGINT / DECIMAL."
    },
    {
        "id": 15,
        "title": "Temporary Tables (#temp & ##global)",
        "category": "DDL & Setup",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Harness local (#) and global (##) temporary tables stored in tempdb for complex intermediate processing.",
        "theory": "Local temporary tables (`#temp`) are visible only to the current session and dropped automatically upon session termination. Global temporary tables (`##global`) are shared across all sessions until all referencing sessions disconnect. Both support indexes and transactions in tempdb.",
        "pro_tip": "Use `#temp` tables instead of table variables (`@tbl`) when working with more than 1,000 rows so SQL Server can maintain distribution statistics for optimal query plans.",
        "expected_output": "Temp table created, populated, queried, and dropped successfully."
    },

    # 16 - 19: Operators & Filters
    {
        "id": 16,
        "title": "SQL Operators (Arithmetic, Comparison, Logical)",
        "category": "Operators & Filters",
        "difficulty": "Beginner",
        "readTime": "4 min",
        "summary": "Master mathematical, comparison (=, <>, <, >), and logical (AND, OR, NOT, BETWEEN, IN) operators.",
        "theory": "SQL operators enable conditional evaluation in WHERE and HAVING clauses. Logical operators evaluate truth conditions: `AND` requires both conditions to be true; `OR` requires at least one; `NOT` negates truth value. Parentheses enforce operator precedence.",
        "pro_tip": "When mixing `AND` and `OR` in queries, always wrap conditions in parentheses `(A OR B) AND C` to avoid subtle logic bugs due to operator precedence.",
        "expected_output": "Filtered employee results matching combined salary and age thresholds."
    },
    {
        "id": 17,
        "title": "EXCEPT Operator (Set Difference)",
        "category": "Operators & Filters",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Return distinct rows from the left query that do not appear in the right query result.",
        "theory": "The `EXCEPT` set operator compares result sets between two queries and returns all distinct records from the first query that are absent in the second query. Both queries must have matching column counts and compatible data types.",
        "pro_tip": "`EXCEPT` implicitly applies a DISTINCT filter. It is an elegant alternative to `LEFT JOIN ... WHERE right.key IS NULL` for finding missing records.",
        "expected_output": "Returns employees who are not assigned to any active project."
    },
    {
        "id": 18,
        "title": "LIKE Operator & Wildcards",
        "category": "Operators & Filters",
        "difficulty": "Beginner",
        "readTime": "4 min",
        "summary": "Perform pattern matching on string columns using wildcards (%, _, [], [^]).",
        "theory": "The `LIKE` operator matches character patterns:\n- `%`: Matches zero or more characters (`'A%'` starts with A).\n- `_`: Matches exactly one single character (`'_m%'`).\n- `[a-c]`: Matches any character within a range.\n- `[^a-c]`: Matches any character NOT within the range.",
        "pro_tip": "Leading wildcards (e.g. `LIKE '%term'`) force full index scans. Trailing wildcards (e.g. `LIKE 'term%'`) can utilize index seek operations.",
        "expected_output": "Names matching pattern 'A%' and '_m%' displayed."
    },
    {
        "id": 19,
        "title": "Column & Table ALIAS (AS Keyword)",
        "category": "Operators & Filters",
        "difficulty": "Beginner",
        "readTime": "2 min",
        "summary": "Provide readable temporary names for query columns and shorthand aliases for joined tables.",
        "theory": "Aliases improve query readability and disambiguate column names across tables. In the SELECT clause, `AS alias_name` formats output headers for reports. In the FROM clause, table aliases like `e` for `Employees` streamline JOIN predicates.",
        "pro_tip": "Aliases cannot be referenced directly in the WHERE clause of the same query level because WHERE executes before SELECT in the logical processing order.",
        "expected_output": "Output headers displayed as EmployeeName, MonthlySalary."
    },

    # 20 - 21: Aggregation & Grouping
    {
        "id": 20,
        "title": "GROUP BY Clause",
        "category": "Grouping & Aggregates",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Group individual data rows into summary records and compute aggregate metrics (COUNT, SUM, AVG).",
        "theory": "`GROUP BY` collapses rows that share common values in specified columns into summary rows. Non-aggregated columns in the SELECT clause must be included in the GROUP BY expression. It is essential for calculating departmental payrolls, regional sales, or daily transaction counts.",
        "pro_tip": "Ensure numeric columns used in `AVG()` or `SUM()` handle NULL values properly; SQL aggregates ignore NULLs except in `COUNT(*)`.",
        "expected_output": "Department summary: Department name, employee count, and average salary."
    },
    {
        "id": 21,
        "title": "HAVING Clause",
        "category": "Grouping & Aggregates",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Filter aggregated groups based on summary conditions after GROUP BY has executed.",
        "theory": "While `WHERE` filters individual rows before grouping, `HAVING` filters aggregated groups after grouping has occurred. You can use aggregate functions directly in the HAVING clause (e.g. `HAVING COUNT(*) > 5`).",
        "pro_tip": "Use `WHERE` for row-level filters (e.g., `WHERE status = 'Active'`) and reserve `HAVING` exclusively for aggregate calculations (e.g., `HAVING SUM(amount) > 10000`).",
        "expected_output": "Only departments with average salary > 50,000 displayed."
    },

    # 22 - 28: Constraints & Integrity
    {
        "id": 22,
        "title": "SQL Constraints Overview",
        "category": "Constraints",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Enforce data integrity, validity, and business rules at the database engine level.",
        "theory": "Constraints ensure the accuracy and reliability of data. Primary types include `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, `CHECK`, and `DEFAULT`. Enforcing constraints at the database layer prevents corrupt or orphaned data from reaching storage.",
        "pro_tip": "Always name your constraints explicitly (e.g. `PK_Employees_ID`, `FK_Orders_CustomerID`) rather than letting SQL Server generate cryptic default names.",
        "expected_output": "Demonstrations of constraint validation and violation traps."
    },
    {
        "id": 23,
        "title": "CHECK Constraint",
        "category": "Constraints",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Enforce domain integrity by limiting allowable column values via boolean expressions.",
        "theory": "A `CHECK` constraint specifies a logical boolean condition that every inserted or updated row must satisfy (e.g. `age >= 18`, `salary > 0`, `status IN ('Pending', 'Approved')`). If an operation evaluates to FALSE, the transaction is rejected.",
        "pro_tip": "CHECK constraints can reference multiple columns in the same table, making them perfect for range validations like `CHECK (End_Date >= Start_Date)`.",
        "expected_output": "Constraint successfully rejects records with negative salary or age < 18."
    },
    {
        "id": 24,
        "title": "DEFAULT Constraint",
        "category": "Constraints",
        "difficulty": "Beginner",
        "readTime": "2 min",
        "summary": "Automatically supply default values when an INSERT does not provide an explicit value.",
        "theory": "The `DEFAULT` constraint provides a fallback value when inserting a row without specifying a value for that column. Common defaults include `GETDATE()` for timestamp tracking, `'Active'` for user statuses, or `0` for numeric counters.",
        "pro_tip": "Combine DEFAULT with NOT NULL to ensure the column is never empty while keeping INSERT syntax lightweight.",
        "expected_output": "Rows inserted without city receive default value 'Indore'."
    },
    {
        "id": 25,
        "title": "UNIQUE Constraint",
        "category": "Constraints",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Prevent duplicate values in specific columns (e.g. Email, SSN) while permitting a single NULL.",
        "theory": "The `UNIQUE` constraint guarantees all values in a column or set of columns are distinct across the table. In MS SQL Server, a UNIQUE constraint automatically creates a supporting unique non-clustered index, and allows at most one NULL value.",
        "pro_tip": "Use UNIQUE constraints for candidate keys such as email addresses, government IDs, and usernames alongside your surrogate primary key.",
        "expected_output": "Table accepts unique email entries, blocks duplicate insertion."
    },
    {
        "id": 26,
        "title": "PRIMARY KEY Constraint",
        "category": "Constraints",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Uniquely identify every row in a table with non-null, immutable primary keys.",
        "theory": "A `PRIMARY KEY` uniquely identifies each record. It enforces both `UNIQUE` and `NOT NULL` constraints. By default in SQL Server, creating a primary key generates a clustered index on the key columns, defining the physical storage order on disk.",
        "pro_tip": "Keep primary keys compact (e.g., `INT` or `BIGINT` with `IDENTITY(1,1)`). Narrow primary keys minimize index overhead across all foreign key relationships.",
        "expected_output": "Primary key enforced on id column; prevents duplicate and null IDs."
    },
    {
        "id": 27,
        "title": "Constraints During Table Creation",
        "category": "Constraints",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Define primary keys, check conditions, defaults, and unique keys inline within CREATE TABLE.",
        "theory": "You can declare constraints either column-level (inline next to column definitions) or table-level (after all columns). Table-level syntax is required when creating composite constraints spanning two or more columns.",
        "pro_tip": "Declare constraints with clear names in the CREATE script for easier schema migration scripts later.",
        "expected_output": "Multi-constraint table schema created with PK, UNIQUE, CHECK, and DEFAULT."
    },
    {
        "id": 28,
        "title": "FOREIGN KEY (Referential Integrity)",
        "category": "Constraints",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Establish relationships between parent and child tables to enforce referential integrity.",
        "theory": "A `FOREIGN KEY` links a column in a child table to the `PRIMARY KEY` or `UNIQUE` key of a parent table. It prevents insertion of orphan records and supports cascading actions (`ON DELETE CASCADE`, `ON UPDATE CASCADE`).",
        "pro_tip": "Always index foreign key columns in child tables to avoid full table scans during parent table DELETE operations and JOIN queries.",
        "expected_output": "Child table links to parent table; rejects invalid foreign key references."
    },

    # 29 - 31: Data Management & System DBs
    {
        "id": 29,
        "title": "Importing CSV Files into SQL Server",
        "category": "Data Flow",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Load bulk delimited text data into SQL Server tables using BULK INSERT and SSMS wizards.",
        "theory": "Loading flat files like CSV or TSV into relational tables is a common ETL requirement. The T-SQL `BULK INSERT` command streams external data directly into a table, specifying row terminators (`\\n`), field terminators (`,`), and header skip lines (`FIRSTROW = 2`).",
        "pro_tip": "When importing large CSV files, switch the database recovery model to `BULK_LOGGED` temporarily to minimize transaction log growth.",
        "expected_output": "Successfully imported rows from external CSV into database table."
    },
    {
        "id": 30,
        "title": "Exporting Files from SQL Server",
        "category": "Data Flow",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Export database query results and table contents to external CSV or text files.",
        "theory": "SQL Server supports exporting query results via the SQL Server Import and Export Wizard, SSMS 'Save Results As', or the command-line `bcp` (Bulk Copy Program) utility. This enables seamless sharing with data analysts and external systems.",
        "pro_tip": "Use the command-line `bcp` utility or SQL Server Integration Services (SSIS) for automated, scheduled exports in production pipelines.",
        "expected_output": "Export command initiated; data dumped to target file."
    },
    {
        "id": 31,
        "title": "System Databases (master, model, msdb, tempdb)",
        "category": "Database Admin",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Explore the roles of the four core SQL Server system databases that power the instance.",
        "theory": "- `master`: Holds instance-level metadata, logins, and configurations.\n- `model`: Template for every newly created database.\n- `msdb`: Powers SQL Server Agent jobs, alerts, and backup histories.\n- `tempdb`: Shared scratchpad for temp tables, sorting, and row versioning.",
        "pro_tip": "Ensure `tempdb` data files are split equally across multiple CPU cores to reduce allocation contention in high-concurrency environments.",
        "expected_output": "Catalog query reveals all 4 system databases and their internal file paths."
    },

    # 32 - 35: Functions & Manipulations
    {
        "id": 32,
        "title": "System Functions (String, Date, Math)",
        "category": "Functions",
        "difficulty": "Beginner",
        "readTime": "5 min",
        "summary": "Explore built-in SQL Server scalar functions: UPPER, LOWER, LEN, GETDATE, DATEDIFF, ROUND.",
        "theory": "Built-in system functions perform calculations on scalar values. String functions (`UPPER`, `LOWER`, `LEN`, `TRIM`) cleanse textual data. Date functions (`GETDATE()`, `DATEADD()`, `DATEDIFF()`) handle timestamps. Math functions (`ROUND`, `POWER`, `ABS`) support numeric computing.",
        "pro_tip": "Avoid wrapping indexed columns in functions within WHERE clauses (e.g. `WHERE YEAR(HireDate) = 2024`), as this makes the predicate non-sargable and forces an index scan.",
        "expected_output": "System function results: String lengths, transformed names, and date differences."
    },
    {
        "id": 33,
        "title": "Practical on SUBSTRING Function",
        "category": "Functions",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Extract specific character sequences from text columns using SUBSTRING(string, start, length).",
        "theory": "The `SUBSTRING` function extracts portions of a string based on a 1-indexed starting position and character length. Combining `SUBSTRING` with `CHARINDEX` enables dynamic parsing of emails, phone numbers, and delimited codes.",
        "pro_tip": "Remember that SQL Server strings are 1-indexed (the first character is at position 1, not 0).",
        "expected_output": "Substrings extracted: Initials, area codes, and domains parsed."
    },
    {
        "id": 34,
        "title": "User Defined Functions (Scalar & Table-Valued)",
        "category": "Functions",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Build custom reusable SQL functions to encapsulate business logic and calculations.",
        "theory": "User Defined Functions (UDFs) return either a single scalar value (`RETURNS INT/VARCHAR`) or a full result table (`RETURNS TABLE`). Inline Table-Valued Functions (iTVFs) are expanded by the query optimizer like views, offering superior performance over multi-statement UDFs.",
        "pro_tip": "Always favor Inline Table-Valued Functions over Multi-Statement Table-Valued Functions (MSTVFs) to allow the optimizer to estimate cardinality accurately.",
        "expected_output": "Custom function created and invoked in SELECT query."
    },
    {
        "id": 35,
        "title": "Practical on User Defined Functions",
        "category": "Functions",
        "difficulty": "Intermediate",
        "readTime": "3 min",
        "summary": "Hands-on implementation of custom calculation functions for salary and tax computation.",
        "theory": "Practical application of scalar UDFs: creating a function that takes an employee's salary and applies custom tax brackets or bonus rates, returning the computed net compensation.",
        "pro_tip": "In SQL Server 2019+, Scalar UDF Inlining automatically optimizes many scalar functions to eliminate row-by-row overhead.",
        "expected_output": "Net salary and bonus calculated dynamically per employee row."
    },

    # 36 - 40: JOINS & Relations
    {
        "id": 36,
        "title": "SQL JOINS (INNER, LEFT, RIGHT, FULL)",
        "category": "JOINS & Relations",
        "difficulty": "Intermediate",
        "readTime": "5 min",
        "summary": "Combine rows across multiple related tables using INNER, LEFT, RIGHT, and FULL OUTER joins.",
        "theory": "Joins link tables based on related keys:\n- `INNER JOIN`: Returns only rows with matches in both tables.\n- `LEFT JOIN`: Returns all left rows plus matched right rows (NULL if no match).\n- `RIGHT JOIN`: Returns all right rows plus matched left rows.\n- `FULL OUTER JOIN`: Returns all rows when there is a match in either table.",
        "pro_tip": "90% of business queries utilize INNER and LEFT JOINs. Master matching keys and handle NULL values in outer joins carefully.",
        "expected_output": "Consolidated employee and project details displayed side by side."
    },
    {
        "id": 37,
        "title": "Create Company Table Schema",
        "category": "JOINS & Relations",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Set up relational schema with Company, Employee, and Project tables for multi-table queries.",
        "theory": "Establishing realistic relational schemas is crucial for mastering SQL. This lesson builds the company, employee, and project tables, complete with foreign keys and sample test records.",
        "pro_tip": "Always establish your test data with intentional edge cases (unassigned employees, projects without staff) to test outer joins properly.",
        "expected_output": "Schema established and seeded with test data."
    },
    {
        "id": 38,
        "title": "CROSS JOIN (Cartesian Product)",
        "category": "JOINS & Relations",
        "difficulty": "Intermediate",
        "readTime": "2 min",
        "summary": "Generate the complete Cartesian product of two tables (every row paired with every row).",
        "theory": "A `CROSS JOIN` matches every single row of the first table with every single row of the second table. If table A has N rows and table B has M rows, the output produces N x M rows. It is useful for generating matrix reports, calendar dates, or product size/color combinations.",
        "pro_tip": "Be cautious using CROSS JOIN on large tables. Joining two tables with 10,000 rows each produces 100,000,000 rows!",
        "expected_output": "Matrix of all employees cross-joined with all company departments."
    },
    {
        "id": 39,
        "title": "Joining More Than Two Tables",
        "category": "JOINS & Relations",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Chain three or more tables together through foreign keys in a single cohesive query.",
        "theory": "Real-world databases store data across normalized entities. You can chain joins sequentially: `FROM Employees e JOIN Departments d ON e.DeptID = d.ID JOIN Locations l ON d.LocID = l.ID` to retrieve unified views of the data.",
        "pro_tip": "Organize your joins logically from highest-cardinality transaction table out to dimension tables for cleaner, self-documenting queries.",
        "expected_output": "Three-way joined dataset: Employee, Project, and Company data combined."
    },
    {
        "id": 40,
        "title": "Practical on Complex JOINS",
        "category": "JOINS & Relations",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Solve practical business reporting challenges with multi-condition joins and filtering.",
        "theory": "Real-world scenarios often require filtering joined records by gender, salary, or technology, and persisting the resulting joined dataset into new reporting tables via `SELECT ... INTO`.",
        "pro_tip": "Filtering conditions placed in the ON clause vs the WHERE clause behave differently in LEFT JOINs: ON filters before joining; WHERE filters after joining.",
        "expected_output": "Filtered female employee project report created and populated into emp_j table."
    },

    # 41 - 57: Advanced Querying, Objects & Modern SQL
    {
        "id": 41,
        "title": "Subqueries (Nested Queries)",
        "category": "Advanced Querying",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Embed queries inside SELECT, WHERE, and FROM clauses to solve multi-stage data problems.",
        "theory": "A subquery is a query nested inside another statement. Scalar subqueries return a single value (e.g. `WHERE salary > (SELECT AVG(salary) FROM emp)`). Correlated subqueries reference columns from the outer query and evaluate once per outer row.",
        "pro_tip": "Where possible, rewrite correlated subqueries as JOINs or Common Table Expressions (CTEs) for better execution plans.",
        "expected_output": "Employees earning above the departmental average salary identified."
    },
    {
        "id": 42,
        "title": "RANK() and DENSE_RANK()",
        "category": "Advanced Querying",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Compute ordered ranking across partitions with ties handled with or without gaps.",
        "theory": "Window ranking functions calculate position based on `ORDER BY`:\n- `RANK()`: Assigns the same rank to ties, but leaves gaps in subsequent ranks (1, 2, 2, 4).\n- `DENSE_RANK()`: Assigns the same rank to ties, with NO gaps in subsequent ranks (1, 2, 2, 3).",
        "pro_tip": "Use `DENSE_RANK()` when finding the Nth highest value (e.g. 2nd highest salary), regardless of how many employees share the top salary.",
        "expected_output": "Ranked leaderboard of employees ordered by salary with rank and dense_rank."
    },
    {
        "id": 43,
        "title": "Database Indexes Overview",
        "category": "Database Admin",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Accelerate data retrieval with B-Tree indexes, understanding when and where to index.",
        "theory": "Indexes are specialized data structures (typically B-Trees) that allow SQL Server to find rows rapidly without scanning entire tables. While indexes speed up SELECT queries, they introduce write overhead on INSERT, UPDATE, and DELETE operations.",
        "pro_tip": "Index columns frequently used in WHERE filters, JOIN ON conditions, and ORDER BY clauses, but avoid over-indexing small or write-heavy tables.",
        "expected_output": "Indexes created on employee table; query plan shows index seek."
    },
    {
        "id": 44,
        "title": "Clustered vs Non-Clustered Index",
        "category": "Database Admin",
        "difficulty": "Advanced",
        "readTime": "4 min",
        "summary": "Master the physical data layout: clustered indexes order leaf pages; non-clustered indexes point to rows.",
        "theory": "- `Clustered Index`: Dictates the actual physical storage order of rows in the table. Only ONE clustered index can exist per table.\n- `Non-Clustered Index`: A separate B-Tree structure containing key columns and row locators (pointers to the clustered index key or heap RID).",
        "pro_tip": "Include non-key columns using `INCLUDE(col1, col2)` in non-clustered indexes to create covering indexes that eliminate costly key lookups.",
        "expected_output": "Clustered and non-clustered indexes defined and verified."
    },
    {
        "id": 45,
        "title": "Stored Procedures",
        "category": "Database Objects",
        "difficulty": "Intermediate",
        "readTime": "5 min",
        "summary": "Encapsulate modular T-SQL code with input/output parameters and execution plan caching.",
        "theory": "Stored procedures (`CREATE PROCEDURE`) are compiled, reusable batches of T-SQL statements stored in the database. They support parameters, procedural logic (IF/ELSE, WHILE), transactions, and security permissions. SQL Server caches their execution plans for high throughput.",
        "pro_tip": "Always use parameterized stored procedures to prevent SQL injection vulnerabilities and maximize query plan reuse.",
        "expected_output": "Stored procedure created and executed with parameter: EXEC GetEmployeesByCity 'Indore'."
    },
    {
        "id": 46,
        "title": "Views (Virtual Tables)",
        "category": "Database Objects",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Simplify complex queries and enforce column-level security using virtual views.",
        "theory": "A `VIEW` is a saved SELECT query that behaves like a virtual table. It does not store data physically (unless indexed); instead, it dynamically runs the underlying query when accessed. Views hide schema complexity and restrict user access to sensitive columns like SSN or salary.",
        "pro_tip": "Create Indexed Views (`WITH SCHEMABINDING`) on aggregate-heavy reports to physically materialize data for lightning-fast reads.",
        "expected_output": "View created; accessed via standard SELECT * FROM HighEarnersView."
    },
    {
        "id": 47,
        "title": "FLOOR & Mathematical Functions",
        "category": "Functions",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Perform mathematical transformations with FLOOR, CEILING, ABS, and SQRT in SQL queries.",
        "theory": "`FLOOR()` returns the largest integer less than or equal to the numeric expression, effectively rounding down. It is widely used in financial tier calculations, age bucketing, and pagination logic.",
        "pro_tip": "Contrast `FLOOR()` with `CEILING()` (which rounds up) and `ROUND()` (which rounds to the nearest specified decimal place).",
        "expected_output": "Decimals transformed: FLOOR(45.75) returns 45."
    },
    {
        "id": 48,
        "title": "Transactions in SQL (ACID & Rollback)",
        "category": "Advanced Querying",
        "difficulty": "Advanced",
        "readTime": "5 min",
        "summary": "Ensure Atomicity, Consistency, Isolation, and Durability with BEGIN TRAN, COMMIT, and ROLLBACK.",
        "theory": "A database transaction groups multiple SQL operations into a single atomic unit of work. Either ALL modifications succeed and are committed (`COMMIT TRANSACTION`), or if any failure occurs, all modifications are undone (`ROLLBACK TRANSACTION`), guaranteeing ACID compliance.",
        "pro_tip": "Keep transactions as short as possible to avoid holding locks that cause blocking and deadlocks in multi-user applications.",
        "expected_output": "Transaction executed; updates committed or safely rolled back upon error."
    },
    {
        "id": 49,
        "title": "OFFSET-FETCH & STUFF Function",
        "category": "Advanced Querying",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Implement clean server-side pagination with OFFSET-FETCH and manipulate strings with STUFF.",
        "theory": "- `OFFSET N ROWS FETCH NEXT M ROWS ONLY`: Standard ANSI SQL syntax for paginating through large result sets.\n- `STUFF(string, start, length, new_string)`: Deletes a specified length of characters and inserts new text at that position.",
        "pro_tip": "`OFFSET-FETCH` requires an explicit `ORDER BY` clause. It is significantly more efficient and readable than old pagination workarounds.",
        "expected_output": "Page 2 of employee records retrieved (rows 6 to 10); phone numbers formatted via STUFF."
    },
    {
        "id": 50,
        "title": "Exception Handling (TRY...CATCH)",
        "category": "Database Objects",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Gracefully intercept runtime errors and manage rollbacks using BEGIN TRY ... BEGIN CATCH.",
        "theory": "T-SQL supports structured exception handling. If an error occurs inside `BEGIN TRY`, execution immediately jumps to `BEGIN CATCH`. You can inspect error details using `ERROR_MESSAGE()`, `ERROR_NUMBER()`, and `ERROR_LINE()`.",
        "pro_tip": "Inside the CATCH block, check `XACT_STATE()` to determine if the transaction is committable or uncommittable before attempting a ROLLBACK.",
        "expected_output": "Divide by zero caught gracefully: Error 8134 logged without crashing session."
    },
    {
        "id": 51,
        "title": "Triggers (DML & Audit Logging)",
        "category": "Database Objects",
        "difficulty": "Advanced",
        "readTime": "5 min",
        "summary": "Automatically execute procedural code on table INSERT, UPDATE, or DELETE events.",
        "theory": "Triggers are specialized stored procedures that execute automatically in response to DML operations on a table. SQL Server provides virtual tables `inserted` and `deleted` inside the trigger to inspect old and new values.",
        "pro_tip": "Always write triggers that handle MULTI-ROW operations! Avoid assuming `inserted` contains only a single row.",
        "expected_output": "Audit log record inserted automatically upon employee salary update."
    },
    {
        "id": 52,
        "title": "CAST and CONVERT Functions",
        "category": "Functions",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Explicitly convert expressions between data types and format dates with style codes.",
        "theory": "`CAST(expression AS target_type)` is ANSI SQL compliant and portable across database engines. `CONVERT(target_type, expression, [style])` is specific to SQL Server and offers extensive formatting styles for date/time values.",
        "pro_tip": "Use `TRY_CAST` or `TRY_CONVERT` to return NULL instead of throwing a query-aborting error if conversion fails on dirty data.",
        "expected_output": "Date converted to format 103 (dd/mm/yyyy); integer cast to string."
    },
    {
        "id": 53,
        "title": "ROW_NUMBER() Window Function",
        "category": "Advanced Querying",
        "difficulty": "Intermediate",
        "readTime": "4 min",
        "summary": "Generate sequential unique integers for rows within partitions for deduplication and ranking.",
        "theory": "`ROW_NUMBER() OVER ([PARTITION BY col] ORDER BY col)` assigns a continuous integer sequence (1, 2, 3...) to each row. When partitioned, the counter resets back to 1 for each new group.",
        "pro_tip": "Pair `ROW_NUMBER()` inside a CTE to effortlessly delete duplicate rows: `WITH CTE AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY Email ORDER BY ID) AS rn FROM Users) DELETE FROM CTE WHERE rn > 1;`.",
        "expected_output": "Sequential row numbering assigned per department group."
    },
    {
        "id": 54,
        "title": "COALESCE Function",
        "category": "Functions",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Return the first non-NULL expression from an evaluated list of arguments.",
        "theory": "`COALESCE(val1, val2, ..., fallback)` evaluates its arguments in order and returns the first value that is not NULL. It is ANSI SQL compliant and accepts multiple arguments.",
        "pro_tip": "`COALESCE` is more flexible than `ISNULL(val, default)` because it accepts multiple fallback arguments and determines return type via type precedence rules.",
        "expected_output": "Replaces null contact details with secondary mobile or fallback text."
    },
    {
        "id": 55,
        "title": "CTE (Common Table Expressions)",
        "category": "Advanced Querying",
        "difficulty": "Intermediate",
        "readTime": "5 min",
        "summary": "Structure complex queries with readable, reusable temporary named result sets.",
        "theory": "A Common Table Expression (CTE) is defined using the `WITH CTE_Name AS (SELECT ...)` syntax. CTEs simplify complex joins and subqueries, improve maintainability, and support recursive queries for organizational hierarchies or bill-of-materials.",
        "pro_tip": "The query following a CTE must immediately consume it. If multiple CTEs are needed, chain them with commas after a single `WITH` keyword.",
        "expected_output": "CTE result set queried to identify top earners across branches."
    },
    {
        "id": 56,
        "title": "IIF() Conditional Function",
        "category": "Functions",
        "difficulty": "Beginner",
        "readTime": "3 min",
        "summary": "Evaluate shorthand inline IF-THEN-ELSE logical branching directly inside SQL statements.",
        "theory": "`IIF(boolean_expression, true_value, false_value)` is a convenient shorthand for a standard two-branch `CASE WHEN boolean_expression THEN true_value ELSE false_value END` expression introduced in SQL Server 2012.",
        "pro_tip": "Use `IIF()` for simple binary conditions (e.g. `IIF(salary > 50000, 'High', 'Low')`), but switch to `CASE` for multi-condition logic.",
        "expected_output": "Categorization column populated with 'Pass'/'Fail' or 'High'/'Low'."
    },
    {
        "id": 57,
        "title": "ROLLUP (Subtotals & Grand Totals)",
        "category": "Grouping & Aggregates",
        "difficulty": "Advanced",
        "readTime": "4 min",
        "summary": "Generate hierarchical multi-level subtotals and grand totals in a single aggregated pass.",
        "theory": "`GROUP BY ROLLUP(col1, col2)` produces grouping sets that roll up hierarchically from right to left, computing departmental subtotals, division totals, and an overall grand total in a single result set.",
        "pro_tip": "Use the `GROUPING()` function alongside ROLLUP to identify which rows represent subtotal aggregates versus detailed grouped rows.",
        "expected_output": "Hierarchical report showing department totals, gender breakdown, and overall grand total."
    }
]

def sanitize_slug(title):
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-')
    return slug

def highlight_sql(code):
    # Basic syntax highlighter for HTML display
    escaped = code.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    keywords = [
        'SELECT', 'FROM', 'WHERE', 'INSERT INTO', 'INSERT', 'VALUES', 'UPDATE', 'SET', 'DELETE',
        'CREATE DATABASE', 'CREATE TABLE', 'CREATE PROCEDURE', 'CREATE VIEW', 'CREATE TRIGGER',
        'CREATE INDEX', 'CREATE UNIQUE INDEX', 'CREATE CLUSTERED INDEX', 'CREATE NONCLUSTERED INDEX',
        'ALTER TABLE', 'ALTER COLUMN', 'DROP TABLE', 'DROP DATABASE', 'DROP PROCEDURE', 'DROP VIEW',
        'DROP TRIGGER', 'DROP INDEX', 'TRUNCATE TABLE', 'TRUNCATE', 'USE', 'JOIN', 'INNER JOIN',
        'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'AS', 'ORDER BY', 'GROUP BY',
        'HAVING', 'ASC', 'DESC', 'TOP', 'DISTINCT', 'UNION ALL', 'UNION', 'INTERSECT', 'EXCEPT',
        'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL', 'EXISTS', 'BEGIN',
        'END', 'COMMIT', 'ROLLBACK', 'TRANSACTION', 'BEGIN TRANSACTION', 'BEGIN TRY', 'END TRY',
        'BEGIN CATCH', 'END CATCH', 'EXEC', 'WITH', 'OVER', 'PARTITION BY', 'PRIMARY KEY',
        'FOREIGN KEY', 'REFERENCES', 'CHECK', 'DEFAULT', 'UNIQUE', 'CONSTRAINT', 'INTO'
    ]
    
    # Keyword replacement with case-insensitivity
    for kw in sorted(keywords, key=len, reverse=True):
        pattern = re.compile(r'\b(' + re.escape(kw) + r')\b', re.IGNORECASE)
        escaped = pattern.sub(r'<span class="sql-keyword">\1</span>', escaped)
        
    return escaped

def main():
    practice_dir = "Practice-Codes"
    notes_dir = "notes"
    os.makedirs(notes_dir, exist_ok=True)

    files = sorted(glob.glob(os.path.join(practice_dir, "*.sql")))
    print(f"Found {len(files)} SQL files in {practice_dir}")

    topics_export = []

    for i, cfg in enumerate(TOPIC_CONFIGS):
        topic_id = cfg["id"]
        matched_file = None
        for f in files:
            base = os.path.basename(f)
            prefix = f"{topic_id:02d}"
            if base.startswith(prefix) or base.startswith(str(topic_id) + " "):
                matched_file = f
                break
        
        if not matched_file:
            print(f"Warning: could not find file for topic {topic_id}")
            continue

        with open(matched_file, 'r', encoding='utf-8', errors='ignore') as fp:
            sql_content = fp.read().strip()

        slug = f"topic-{topic_id:02d}-" + sanitize_slug(cfg["title"])
        html_filename = f"{slug}.html"
        html_path = os.path.join(notes_dir, html_filename)

        cfg["sql_file"] = os.path.basename(matched_file)
        cfg["html_file"] = f"notes/{html_filename}"
        cfg["slug"] = slug
        cfg["raw_sql"] = sql_content

        topics_export.append(cfg)

    # Now generate all 57 HTML pages with navigation links
    total_topics = len(topics_export)
    for index, topic in enumerate(topics_export):
        prev_topic = topics_export[index - 1] if index > 0 else None
        next_topic = topics_export[index + 1] if index < total_topics - 1 else None

        highlighted_code = highlight_sql(topic["raw_sql"])
        escaped_raw_sql = topic["raw_sql"].replace('`', '\\`').replace('\\', '\\\\')

        prev_link_html = f"""<a href="{os.path.basename(prev_topic['html_file'])}" class="btn btn-secondary btn-sm">← {prev_topic['id']:02d}. {prev_topic['title']}</a>""" if prev_topic else """<span></span>"""
        next_link_html = f"""<a href="{os.path.basename(next_topic['html_file'])}" class="btn btn-primary btn-sm">{next_topic['id']:02d}. {next_topic['title']} →</a>""" if next_topic else """<span></span>"""

        badge_class = "badge-beginner"
        if topic["difficulty"] == "Intermediate":
            badge_class = "badge-intermediate"
        elif topic["difficulty"] == "Advanced":
            badge_class = "badge-advanced"

        page_html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{topic['id']:02d}. {topic['title']} | MS SQL Mastery Hub</title>
    <meta name="description" content="{topic['summary']}">
    <link rel="stylesheet" href="../style.css">
    <script>
        (function() {{
            const saved = localStorage.getItem('sql_theme') || 'dark';
            document.documentElement.setAttribute('data-theme', saved);
        }})();
    </script>
</head>
<body>
    <!-- Top Brand Header -->
    <header class="top-brand-bar">
        <a href="../index.html" class="brand-logo">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
            <span>SQL Mastery Hub</span>
            <span class="brand-badge">PRO</span>
        </a>
        <div class="top-bar-actions">
            <a href="../notes.html" class="quick-link-btn">Curriculum</a>
            <a href="../playground.html" class="quick-link-btn">Playground</a>
            <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle Theme">
                <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                <span>Theme</span>
            </button>
            <a href="../MS_SQL_Notes.pdf" download class="quick-link-btn" style="border-color: var(--cyan-primary); color: var(--cyan-primary);">PDF Guide</a>
        </div>
    </header>

    <!-- Main Content Container -->
    <main class="container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs">
            <a href="../index.html">Home</a>
            <span>/</span>
            <a href="../notes.html">Notes</a>
            <span>/</span>
            <span style="color: var(--cyan-primary);">Topic {topic['id']:02d}</span>
        </nav>

        <article class="lesson-article">
            <div class="lesson-meta-bar">
                <div>
                    <span class="topic-num-badge">TOPIC #{topic['id']:02d}</span>
                    <span class="badge {badge_class}">{topic['difficulty']}</span>
                    <span class="badge" style="background: var(--cyan-subtle); color: var(--cyan-primary); border: 1px solid var(--border-cyan);">{topic['category']}</span>
                </div>
                <div style="font-size: 0.88rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                    <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>{topic['readTime']} read</span>
                </div>
            </div>

            <h1>{topic['title']}</h1>
            <p class="lead" style="color: var(--text-muted); font-size: 1.08rem; margin-bottom: 2rem;">{topic['summary']}</p>

            <!-- Action Toolbar -->
            <div class="lesson-toolbar">
                <button class="btn btn-secondary btn-sm" id="completeBtn" onclick="toggleCompletion({topic['id']})">
                    <span id="completeText">Mark as Completed</span>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="copyCodeFromBlock()">
                    <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    <span>Copy Code</span>
                </button>
                <a href="../playground.html?query={sanitize_slug(topic['title'])}" class="btn btn-accent btn-sm">
                    <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                    <span>Open in Playground</span>
                </a>
                <a href="../Practice-Codes/{topic['sql_file']}" download class="btn btn-secondary btn-sm">
                    <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>Download Script</span>
                </a>
            </div>

            <!-- Concept Explanation -->
            <section class="content-block">
                <h2>Concept Overview</h2>
                <p>{topic['theory']}</p>
            </section>

            <!-- SQL Code Snippet -->
            <section class="content-block">
                <h2>Hands-on SQL Script</h2>
                <div class="code-container">
                    <div class="code-header">
                        <span class="code-title">{topic['sql_file']}</span>
                        <button class="copy-btn" onclick="copyCodeFromBlock()">Copy SQL</button>
                    </div>
                    <div class="code-body">
                        <pre class="sql-code" id="sqlContent"><code>{highlighted_code}</code></pre>
                    </div>
                </div>
            </section>

            <!-- Pro Tip Box -->
            <div class="tip-card">
                <strong>Best Practice:</strong> {topic['pro_tip']}
            </div>

            <!-- Expected Output -->
            <section class="content-block">
                <h2>Execution & Behavior</h2>
                <div style="background: var(--bg-code); padding: 1.2rem; border-radius: 10px; border: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.9rem; color: #38bdf8;">
                    {topic['expected_output']}
                </div>
            </section>

            <!-- Pagination Navigation -->
            <div class="lesson-pagination">
                {prev_link_html}
                <a href="../notes.html" class="btn btn-secondary btn-sm">All Topics</a>
                {next_link_html}
            </div>
        </article>
    </main>

    <!-- Bottom Rectangular Capsule Navbar (Glassmorphism) -->
    <nav class="bottom-capsule-nav" aria-label="Bottom Navigation">
        <a href="../index.html" class="nav-item">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span class="nav-text">Home</span>
        </a>
        <a href="../notes.html" class="nav-item active">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
            <span class="nav-text">Notes</span>
        </a>
        <a href="../challenges.html" class="nav-item">
            <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            <span class="nav-text">Challenges</span>
        </a>
        <a href="../playground.html" class="nav-item">
            <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            <span class="nav-text">Playground</span>
        </a>
        <a href="../about.html" class="nav-item">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span class="nav-text">About</span>
        </a>
        <a href="../MS_SQL_Notes.pdf" download class="nav-item nav-btn-highlight">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span class="nav-text">PDF</span>
        </a>
    </nav>

    <!-- Toast Notification Container -->
    <div id="toastContainer" class="toast-container"></div>

    <script src="../script.js"></script>
    <script>
        function copyCodeFromBlock() {{
            const codeEl = document.getElementById('sqlContent');
            if (codeEl) {{
                const text = codeEl.innerText;
                navigator.clipboard.writeText(text).then(() => {{
                    if (window.showToast) {{
                        window.showToast("SQL script copied to clipboard", "success");
                    }}
                }});
            }}
        }}

        function checkCompletionState() {{
            const completed = JSON.parse(localStorage.getItem('sql_completed_topics') || '[]');
            const isDone = completed.includes({topic['id']});
            const btn = document.getElementById('completeBtn');
            const text = document.getElementById('completeText');
            if (btn && text) {{
                if (isDone) {{
                    btn.classList.add('btn-primary');
                    btn.classList.remove('btn-secondary');
                    text.textContent = "Completed";
                }} else {{
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-secondary');
                    text.textContent = "Mark as Completed";
                }}
            }}
        }}

        function toggleCompletion(id) {{
            let completed = JSON.parse(localStorage.getItem('sql_completed_topics') || '[]');
            if (completed.includes(id)) {{
                completed = completed.filter(x => x !== id);
                if (window.showToast) window.showToast("Topic marked incomplete", "info");
            }} else {{
                completed.push(id);
                if (window.showToast) window.showToast("Topic marked as completed", "success");
            }}
            localStorage.setItem('sql_completed_topics', JSON.stringify(completed));
            checkCompletionState();
        }}

        document.addEventListener('DOMContentLoaded', checkCompletionState);
    </script>
</body>
</html>
"""
        page_slug = os.path.basename(topic['html_file'])
        current_html_path = os.path.join(notes_dir, page_slug)

        with open(current_html_path, 'w', encoding='utf-8') as out_fp:
            out_fp.write(page_html)

    print(f"Generated {len(topics_export)} HTML pages in {notes_dir}/")

    # Save topics metadata to a JSON file and a JavaScript file
    with open("topics_data.json", 'w', encoding='utf-8') as jfp:
        json.dump(topics_export, jfp, indent=2)

    js_code = f"const SQL_TOPICS_DATABASE = {json.dumps(topics_export, indent=2)};\n"
    with open("topics_data.js", 'w', encoding='utf-8') as jsfp:
        jsfp.write(js_code)

    print("Successfully created topics_data.json and topics_data.js")

if __name__ == "__main__":
    main()
