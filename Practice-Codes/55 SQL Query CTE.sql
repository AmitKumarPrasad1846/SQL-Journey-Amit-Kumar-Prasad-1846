--CTE

use google
select * from employee

select * from employee where name = 'mark'

delete top(6) from employee where name = 'mark'

select * from employee

insert into employee values (35, 'Rudra', 29, 'Male', 150000, 'IT', 'Delhi', 'India')insert into employee values(36, 'Priya', 55, 'Female', 45000, 'HR', 'Mumbai', 'India')insert into employee values(37, 'Vijay', 34, 'Male', 50000, 'Marketing', 'Amritsar', 'India')insert into employee values (38, 'Sherry', 40, 'Female', 45000, 'HR', 'Aukland', 'New Zealand') select * from employeeselect *, row_number() over (partition by id order by id) as Id_no from employeewith Lion as(select *, row_number() over (partition by id order by id) as Id_no from employee)delete from Lion where id_no > 1select * from employeeinsert into employee values (39, 'Siva', 29, 'Male', 150000, 'IT', 'Delhi', 'India')insert into employee values(40, 'Payal', 55, 'Female', 45000, 'HR', 'Mumbai', 'India')insert into employee values(41, 'Varun', 34, 'Male', 50000, 'Marketing', 'Amritsar', 'India')insert into employee values (42, 'Sharline', 40, 'Female', 45000, 'HR', 'Aukland', 'New Zealand') select * from employeewith Class as (select * , row_number() over (partition by id order by id) as Rownumber from employee)delete from Class where rownumber > 1select * from employeewith Lion as(select *, row_number() over (partition by id order by id) as Id_no from employee)delete from Lion where id_no > 1select * from Employee