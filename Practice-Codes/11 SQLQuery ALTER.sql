--ALTER

use google

SELECT * from employee

alter table employee add country varchar(255)

SELECT * from employee

alter table employee add email varchar(255), domain varchar(255), Pincode INT

SELECT * FROM employee

--be carefull while using these command

--we cannot drop any column without alter table

ALTER TABLE employee drop column pincode

SELECT * FROM employee

UPDATE employee set country = 'India'

SELECT * FROM employee