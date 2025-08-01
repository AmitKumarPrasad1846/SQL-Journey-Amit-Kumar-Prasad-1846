--rename a Column name

USE google

SELECT * from employee

--it is your wish to insert EXEC in the code or not
--the will still works even i you don't put the EXEC

exec sp_rename 'employee.name', 'Firstname'

SELECT * from employee

exec sp_rename 'employee.salary', 'Earnings'

SELECT * FROM employee

exec sp_rename 'employee.Earnings', 'Salary'

exec sp_rename 'employee.Firstname', 'Name'

SELECT * FROM employee

exec sp_help 'employee'

--REMEMBER 
EXEC sp_help 'employee'
--is same as
sp_help 'employee'