--JOINS

use google

select * from employee

select * from project

insert into project values
(26, 'Querty', 'Azure', 22132),
(27, 'Milo', 'Automation', 26564),
(28, 'Western', 'Python', 74468),
(29, 'Fannu', 'SQL', 66514),
(30, 'Rabbit', 'Testing', 45623)

select * from project



--Inner Join

SELECT * FROM employee

select * from project

select * from employee inner join project on employee.id = project.pid
--a shorter way
select * from employee e inner join project p on e.id = p.pid

select e.id, e.name, e.age, e.gender, e.salary, p.project_name, p.technology,
p.pincode from employee e inner join project p on e.id = p.pid

select e.id, e.name, e.age, e.gender, e.salary, p.project_name, p.technology,
p.pincode from employee e inner join project p on e.id = p.pid
where e.gender = 'female'

select e.id, e.name, e.age, e.gender, e.salary, p.project_name, p.technology,
p.pincode from employee e inner join project p on e.id = p.pid
where e.gender = 'female' order by p.technology

select e.id, e.name, e.age, e.gender, e.salary, p.project_name, p.technology,
p.pincode into emp_j from employee e inner join project p on e.id = p.pid
where e.gender = 'female'

select * from emp_j

--FULL JOIN

SELECT * FROM employee e full join project p on e.id = p.pid

--LEFT JOIN

SELECT * FROM employee e left join project p on e.id = p.pid

--RIGHT JOIN 

SELECT * FROM employee e right join project p on e.id = p.pid