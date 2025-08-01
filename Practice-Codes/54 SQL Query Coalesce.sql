--Coalesce()

use google
select coalesce(null, null, null, 'SQL', null, 'python')

select * from employee

select *, coalesce(city, 'Indore') as Updated_city from employee
update employee set city = coalesce(city, 'Indore')

select * from employee

select coalesce(null, null, 'Testing', 'SQL', null, 'python')

--STUFF

select stuff('This is SQL class', 9, 3, 'Data Science')

select stuff('This month is June', 15, 4, 'July')

select * from employee

select *, stuff(department, 1, 0, 'dept-') from employee

select *, stuff('IT', 2, 1, 'T-Engineer') as engineer_type from employee