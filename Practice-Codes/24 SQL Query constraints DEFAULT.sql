--DEFAULT (Constraint)

USE google;

SELECT * FROM employee;

insert into employee values (20, 'Andrea', 32, 'Female', 40000, 'HR', 'Oslo', 'Norway');

select * from employee;

alter table employee add constraint Df_C DEFAULT 'India' for country;

insert into employee (id, name, age, gender) values (21, 'Rahul', 37, 'Male');

Select * from employee;
--there is no restriction with the default constraint.  
--As we were facing some restriction with the CHECK constraint.
insert into employee values (22, 'Joseph', 24, 'Male', 35000, 'Marketing', 'San Jose', 'USA');

select * from employee;