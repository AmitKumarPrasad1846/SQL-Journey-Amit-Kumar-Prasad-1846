--UPDATE

use Google

select * from employee

--updating single value.
update employee set age = 27 where name = 'Amit'

select * from employee

update employee set salary = 55000 where id = 2

select * from employee
--updating multiple values.
update employee set age = 27, salary = 40000, department = 'HR',
city = 'Delhi' where name = 'Vivek'

select * from employee

update employee set department = 'Accounts' where department is null

select * from employee