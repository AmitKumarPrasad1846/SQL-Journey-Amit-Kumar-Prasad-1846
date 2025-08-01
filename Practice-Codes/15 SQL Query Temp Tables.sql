--Temp Tables

USE Google

SELECT * FROM employee

CREATE TABLE #Lion (
ID INT,
location VARCHAR(255),
Count INT
)
SELECT * FROM #lion

INSERT INTO #Lion values
(1, 'Chennai', 125),
(2, 'Bangalore', 235),
(3, 'Delhi', 425)

SELECT * FROM #Lion

/* All the tables starting with # symbol are Temp Tables 
All the temp tables are created in system databases in TempDB under Temporary Tables Folder.
If we close the active session automatically the temp tables will be dropped. */

