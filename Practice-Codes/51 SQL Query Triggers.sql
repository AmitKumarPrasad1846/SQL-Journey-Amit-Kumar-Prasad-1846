--TRIGGER 
--used in DML (INSERT, UPDATE, DELETE)
--we can add multiple triggers in a single table.

use google

select* from employee


--AFTER TRIGGER 
--trigger on update command.
--when we have to display a message we use "Print" command. 
create trigger Trig_upd on employee
after update
as begin
print 'Your data has been updated'
end

select* from employee

update employee set age=29 where name = 'Amit'

select* from employee

--altering the trigger's maessage.
Alter trigger trig_upd on employee
after update
as begin
print 'you have successfully updated the data in employee table'
end

update employee set salary =65000 where name='Anjali'

--adding trigger on insert and delete inside the table employee.
create trigger tri_in_del on employee
after insert, delete
as begin
print 'you have inserted or deleted row or multiple rows from employee table'
end

select* from employee

delete from employee where id = 33

insert into employee values (33,'Kabir',29,'Male',45000,'Marketing','San jose','USA')

select* from employee

--dropping the triggers.
drop trigger tri_in_del

drop trigger trig_upd




--INSTEAD OF
--"instead of" trigger won't let the desired operation to happen.
create trigger t_u_i on employee
instead of update
as begin
print 'you cannot update any data in the employee table'
end

select* from employee

update employee set department = 'IT' where name = 'Badal'

select* from employee



create trigger ti_del_inst on employee
instead of delete
as begin 
print 'you cannot delete any row from the table employee'
end

delete from employee where department= 'IT'

select* from employee



--HERE WE CAN DISABLE THE TRIGGER
alter table employee disable trigger ti_del_inst 

delete from employee where name = 'Ganesh'

select * from employee
--enabling the trigger again.
alter table employee enable trigger ti_del_inst

delete from employee where name = 'Ravi'

select * from employee

sp_help 'employee'

DROP TRIGGER t_u_i , ti_del_inst