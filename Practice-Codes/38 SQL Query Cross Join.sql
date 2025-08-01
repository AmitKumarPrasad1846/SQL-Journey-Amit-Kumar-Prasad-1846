--Cross Join

USE Google

SELECT * FROM Employee --21 rows

SELECT * FROM Project --19 rows

--A * B - (21 rows) * (19 rows) = 399 rows

SELECT * FROM Employee CROSS JOIN Project;