--row number

use google
select *, row_number() over(order by name) as roll_number from Employee

select *, row_number() over(order by age desc) as senior from employee

select *, row_number() over(order by department) as dept_no from employee

select *, row_number() over(partition by gender order by name) as Roll_no from employee

select *, row_number() over(partition by department order by department) as dep_no from employee

select *, dense_rank() over(order by department) as dep_no from employee

select *, row_number() over(partition by id order by id) as Id_number from employee

insert into employee values (34, 'Mark', 27, 'Male', 45000, 'IT', 'Seattle', 'USA')

select * from employee where id = 34

select *, row_number() over(partition by id order by id) as id_no from employee

select *, row_number() over(order by age desc) as age_no from employee

select *, row_number() over(partition by age order by age desc) as age_no from employee