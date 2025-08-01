--Rollup

use Google

select * from employee

delete from employee where department = 'Duplicate'

update employee set department = 'Marketing' where department is null

--rollup is an extension for group by function.

select department, sum(salary) as Total_sal from employee group by department

select department, gender, sum(salary) as Total_sal from employee group by department, genderselect department, gender, sum(salary) as Total from employeegroup by rollup (department, gender)select coalesce(department, 'Sum'), coalesce(gender, 'Total') , sum(salary) as Total_salary from employee group by rollup(department, gender)select department , sum(salary) as Total_salary from employee group by departmentselect department , sum(salary) as Total_salary from employee group by rollup (department)select coalesce(department, 'Total sum'), sum(salary) as Total_salary from employeegroup by rollup(department)--Roundselect round(12.4567, 3)select round(12.4567, 2)select round(12.4567, 1)