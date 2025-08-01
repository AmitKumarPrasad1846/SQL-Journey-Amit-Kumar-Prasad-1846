--CLUSTERED INDEX

use google;

select * from employee;

alter table employee alter column id int not null;

alter table employee add constraint Pri_key_id Primary key(id);

select * from employee;

alter table employee drop constraint pri_key_id;

--creating clustered index
create clustered index inx_name on employee(name);

select * from employee;

--when we put a primary key automatically clustered index created.

insert into employee values (30, 'Ravi', 40, 'male', 120000, 'HR', 'Pune', 'India');

select * from employee;
--but it will not impact the table structure.
drop index employee.inx_name;

create clustered index inx_d on employee(department);

select * from employee;

drop index employee.inx_d;

alter table employee add constraint Pri_key_id Primary key(id);

select * from employee;
