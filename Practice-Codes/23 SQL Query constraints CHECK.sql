--CHECK (Constraints)

USE google;

SELECT * FROM employee;

INSERT INTO employee VALUES(18, 'Ravi', 7, 'Male', 130000, 'Marketing', 'Surat', 'India');

SELECT * FROM EMPLOYEE;
--This line will generate error of conflict of employee ravi.
ALTER TABLE employee ADD CONSTRAINT Chk_age CHECK (AGE BETWEEN 22 AND 60);
--NOW UPDATE THE AGE SO THAT THE CONFLICT RESOLVES.
UPDATE employee SET age = 47 WHERE NAME = 'Ravi'

UPDATE EMPLOYEE set age = 25 WHERE name = 'Shivansh'
--now adding the constraint CHECK.
ALTER table employee add constraint Chk_age CHECK (age between 22 and 60);

SELECT * FROM employee;

insert into employee values (19, 'Shivansh', 20, 'Male', 45000, 'HR', 'Pune', 'India');

sp_help 'employee';

--How to delete constraint?

alter table employee drop constraint chk_age;

insert into employee values (19, 'Shivansh', 20, 'Male', 45000, 'HR', 'Pune', 'India');

SELECT * FROM employee;