--LIKE
--this operator is also known as WILD CARD OPERATOR.

USE Google

SELECT * FROM employee
--starting with a
SELECT * FROM employee WHERE NAME like 'a%'
--ending with a
SELECT * FROM employee WHERE NAME like '%a'
--second letter is a
SELECT * FROM employee WHERE Name like '_a%'
--third letter is a
SELECT * FROM employee WHERE name like '__a%'
--employee whose name has letter a
SELECT * FROM employee WHERE name like '%a%'
--name ending with ni
SELECT * FROM employee WHERE name like '%ni'

--IN

SELECT * FROM employee WHERE id = 2

SELECT * FROM employee WHERE name = 'Amit'

SELECT * FROM employee WHERE id in (1, 3, 4, 5, 7, 8, 10)

SELECT * FROM employee WHERE name in ('Amit', 'Priya', 'Badal')

SELECT * FROM employee WHERE department in ('HR', 'Accounts')

SELECT * FROM employee WHERE city in ('delhi', 'pune', 'Bangalore', 'Jaipur')

--ORDER BY

SELECT * FROM employee
--name in ascending order.
SELECT * FROM employee ORDER BY name 
--name in descending order.
SELECT * FROM employee ORDER BY name desc

SELECT * FROM employee ORDER BY age

SELECT * FROM employee ORDER BY age desc

SELECT * FROM employee ORDER BY Department

--IF THERE IS ANY NULL VALUE THEN IT WILL COME FIRST IN ASCENDING ORDER AND AND AT LAST IN DESCENDING ORDER.

SELECT * FROM employee WHERE name like 'a%' ORDER BY name



--BETWEEN 

SELECT * FROM employee WHERE age between 35 and 39

SELECT * FROM employee WHERE id between 5 and 11
--here between will select name in order.
SELECT * FROM employee WHERE name between 'Arun' and 'Neeta'

SELECT * FROM employee WHERE name between 'Anjali' and 'Neeta'

SELECT * FROM employee WHERE name between 'Anjali' and 'Neeta' order by name