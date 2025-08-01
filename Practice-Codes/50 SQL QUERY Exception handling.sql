--EXCEPTION HANDLINGS

use google
select* from employee

begin transaction salary_employee
begin try 
select salary/0 from employee
end try 
begin catch 
select error_message() as error
end catch


begin transaction salary_123
begin try
select salary from employee 
end try
begin catch 
select error_message() as error
end catch


begin transaction salary_321
begin try 
select *, salary * name as new_weekly from employee 
end try 
begin catch 
select error_message() as error
end catch
