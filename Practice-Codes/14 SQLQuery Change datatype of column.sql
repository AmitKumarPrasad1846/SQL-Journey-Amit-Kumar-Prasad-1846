--Change datatype of a column

USE google

SELECT * FROM employee

alter table employee alter column id varchar(255)

SELECT * from employee

sp_help 'employee'

alter table employee alter column id int

sp_help 'employee'