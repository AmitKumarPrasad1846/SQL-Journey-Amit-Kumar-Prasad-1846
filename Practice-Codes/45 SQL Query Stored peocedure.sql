--stored procedure

use google

select * from employee

--create a procedure to give 10% hike to all the employees

create procedure hike
as
select *, (salary * 1.1) as New_salary from employee

exec Hike

sp_helptext 'hike'

alter procedure hike
as
select *, (salary * 1.2) as New_salary from employee

exec hike

sp_helptext 'hike'

--create a procedore to give 25% to the employee and know their new CTC

create procedure CTC
as
select *, (salary * 1.25) as New_salary, ((salary * 1.25) * 12) as yearly_package
from employee

exec CTC

sp_helptext 'CTC'

alter procedure CTC
as
select *, (salary * 1.3) as New_salary, ((salary * 1.3) * 12) as yearly_package
from employee

exec ctc

--write a procedure to create salary slip from employee & project

select * from employee e inner join project p on e.id = p.pid 

Create procedure Salary_slip
as
select e.id, e.name, (e.salary * 0.2) as HRA, (e.salary * 0.3) as Special_allowence,
(e.age * 20 ) as Professional_tax, (e.age * 25) as Food_allowence,
(p.pincode * 0.8) as Income_tax, (p.pincode * 0.5) as Transport_allowence,
(e.salary * 0.2) as Shift_allowence from employee e inner join
project p on e.id = p.pid

exec Salary_slip

--How to take variable in procedure

create procedure dept
(@a varchar(255))
as
select *, (salary * 1.25) as New_salary from employee where department = @a
--it will give specific departments.
exec dept @a = 'IT'

exec dept @a = 'hr'

exec dept @a = 'Accounts'

--dropping the procedure.

drop procedure hike