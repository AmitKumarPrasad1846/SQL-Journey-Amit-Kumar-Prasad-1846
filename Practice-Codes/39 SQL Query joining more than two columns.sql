--join more than two tables.

USE Google

SELECT * FROM employee 

SELECT * FROM Project

SELECT * FROM Company

SELECT * FROM Employee e inner join project p on e.id = p.pid inner join company c on p.pid = c.cid

select e.id, e.name, e.gender, e.age, e.salary, e.department, p.project_name,p.technology, p.pincode, c.company_name, c.headquaters from employee e inner join project p on e.id = p.pid inner join company c on p.pid = c.cid where c.headquaters = 'seattle'select e.id, e.name, e.gender, e.age, e.salary, e.department, p.project_name,p.technology, p.pincode, c.company_name, c.headquaters from employee e inner join project p on e.id = p.pid inner join company c on p.pid = c.cid where e.gender = 'male' order by e.nameselect e.id as EmpId, e.name as FirstName, e.gender, e.age, e.salary as Earnings, e.department, p.project_name,p.technology as Domain, p.pincode, c.company_name, c.headquaters from employee e inner join project p on e.id = p.pid inner join company c on p.pid = c.cid select p.technology, sum(e.salary) as Total_salary from employee e inner join project p on e.id = p.pid inner join company con p.pid = c.cid group by p.technology