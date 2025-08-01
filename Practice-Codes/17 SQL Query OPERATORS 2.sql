--EXCEPT

USE Google

SELECT * FROM employee

SELECT * FROM employee WHERE gender = 'male'

EXCEPT

SELECT * FROM Employee WHERE department = 'IT'

--Greater than Greater than equal to.

SELECT * FROM employee WHERE age > 35

SELECT * FROM employee WHERE age >= 35

--Less than or less than equal to.

SELECT * FROM employee WHERE age < 35

SELECT * FROM employee WHERE age <= 35