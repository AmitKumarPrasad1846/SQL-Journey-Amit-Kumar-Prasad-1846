--Having(only works with group by Query)
--IN is useD for selecting columns.
USE google

SELECT Department, SUM(Salary) AS Total_salary FROM employee GROUP BY department
HAVING department IN ('IT', 'HR', 'Accounts')

SELECT Department, SUM(Salary) AS Total_salary FROM employee GROUP BY department
HAVING department IN ('IT', 'HR', 'Accounts')
ORDER BY department DESC

SELECT department, gender, SUM(SALARY) AS Total_salary FROM employee
GROUP BY department, gender HAVING gender = 'male'

select Department, gender, sum(salary) as total_salary from Employee
group by Department, gender having gender = 'male' or Department = 'hr'