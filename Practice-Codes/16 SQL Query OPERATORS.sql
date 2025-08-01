--OPERATORS

USE Google

Select * FROM employee

--AND (both the condition should be true.)

SELECT * From employee WHERE gender = 'male' and Department = 'IT'

SELECT * From employee WHERE gender = 'female' and Department = 'HR'

--OR (either of the condition should be true.)

SELECT * From employee WHERE gender = 'male' and Department = 'Accounts'

SELECT * From employee WHERE gender = 'female' and Department = 'HR'

SELECT * FROM employee WHERE salary = 4000 OR city = 'Delhi'

--NOT (the specified condition should not be present.)

--method 1
SELECT * FROM employee WHERE gender != 'male'

--method 2
SELECT * FROM employee WHERE gender <> 'male'

--method 3 
SELECT * FROM employee WHERE not gender = 'male'

SELECT * FROM employee WHERE department != 'IT'

SELECT * FROM employee WHERE
(gender = 'male' AND department = 'HR')
OR
(gender = 'Female' AND department = 'marketing')

--Intersect (for combining operators)

SELECT * FROM employee WHERE salary = 40000
intersect
SELECT * FROM employee WHERE gender = 'male'

SELECT * FROM employee where salary = 40000
intersect
SELECT * FROM employee WHERE gender = 'male'
intersect 
SELECT * FROM employee WHERE id = 12

--UNION (combining two conditions - doesn't shows duplicate)

SELECT * FROM employee WHERE salary = 40000
union
SELECT * FROM employee WHERE gender = 'male'

--UNION ALL (combine two conditions but shows duplicate)

SELECT * FROm employee where salary = 40000
UNION ALL
SELECT * FROM employee WHERE gender = 'male'

