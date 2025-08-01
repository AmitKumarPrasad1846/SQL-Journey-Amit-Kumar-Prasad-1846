--ALIAS

USE google;

SELECT * FROM employee

SELECT id, name, age, gender, salary, department FROM employee

SELECT id, name as Firstname, age, gender, salary as Earning,
department as Domain from employee
--we cann't give space between any name.
SELECT id, name as First_name, age, gender, salary as Earning,
department as Domain from employee