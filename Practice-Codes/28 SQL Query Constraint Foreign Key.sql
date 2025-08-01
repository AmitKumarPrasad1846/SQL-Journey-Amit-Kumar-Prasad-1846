--Foreign Key			(IT CAN ACCEPT DUPLICATE VALUES.)

USE google;

select * from employee

--adding foreign key to table project by using employee as a reference.
alter table project add constraint For_key Foreign key(PID) references employee(id)

insert into project values (25, 'jerry', 'Azure', 65546)

insert into employee values (25, 'Sharline', 39, 'Female', 25000, 'HR', 'Perth', 'Australia')

select * from employee
insert into project values (25, 'Jerry', 'Azure', 65546)

Select * from project;

UPDATE PROJECT SET PID = 16 WHERE Project_name = 'JERRY'
--it will give error
delete from employee where id = 7
--first we have to delete from project.
delete from project where pid = 7
--NOW THIS WORKS
delete from employee where id = 7 

--BUT WE CAN DELETE THOSE VALUES FROM EMPLOYEE DIRECTLY WHICH ARE NOT ASSOCIATED WITH PROJECT.
select * from employee

delete from employee where id = 23

--NOW DROPPING CONSTRAINT.

--IT WILL GENERATE ERROR.
ALTER TABLE EMPLOYEE DROP CONSTRAINT PRI_KEY_ID
--FIRST WE HAVE TO DROP FROM PROJECT.
ALTER TABLE PROJECT DROP CONSTRAINT FOR_KEY
--NOW EMPLOYEE.
ALTER TABLE EMPLOYEE DROP CONSTRAINT PRI_KEY_ID