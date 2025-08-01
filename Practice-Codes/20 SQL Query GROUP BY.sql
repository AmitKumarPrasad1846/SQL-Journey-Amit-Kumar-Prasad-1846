--Group By

USE Google;

SELECT * FROM employee;

SELECT SUM(SALARY) FROM employee;

SELECT SUM(SALARY) AS Total_salary FROM employee;

--AGGREGATE FUNCTION are the mathematical function.  (ex:- SUM)

SELECT department, SUM(SALARY) as Total_sal FROM employee GROUP BY department;

SELECT gender, SUM(SALARY) AS Total_salary FROM employee GROUP BY gender;

SELECT department, gender, SUM(SALARY) AS Total_salary FROM employee
GROUP BY department, gender;

SELECT department, gender, SUM(SALARY) AS Total_salary FROM employee
GROUP BY department, gender ORDER BY department;

SELECT DEPARTMENT, SUM(SALARY) AS Total_salary FROM employee GROUP BY DEPARTMENT ORDER BY DEPARTMENT;

--Always include non-aggregated columns used in SELECT inside the GROUP BY
SELECT department, gender, SUM(salary)
FROM employee
GROUP BY department;

--Fixed code
Select department, gender, SUM(salary)
FROM employee
GROUP BY department, gender;


select * from employee