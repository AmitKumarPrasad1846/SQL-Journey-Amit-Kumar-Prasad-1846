--indexes

use google

select * from employee

select * from employee where department = 'marketing'

--Non clustered index

create index inx_dep on employee(department)

select * from employee
select * from employee where department = 'marketing'
--without index 
select * from employee where name = 'Amit'
--here i have cresated an index
create nonclustered index Inx_name_nonc on employee(name)

select * from employee where department = 'marketting'
--with index
select * from employee where name = 'Amit'--dropping the indexesdrop index employee.inx_depdrop index employee.inx_name_noncsp_help 'employee'