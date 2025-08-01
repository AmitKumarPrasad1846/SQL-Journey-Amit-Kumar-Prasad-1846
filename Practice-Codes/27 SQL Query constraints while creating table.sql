--constraint while creating table.

USE google

CREATE TABLE school(
Roll_number INT NOT NULL, 
Name VARCHAR(255) NOT NULL, 
Marks INT, 
Sport VARCHAR(255)
);

SELECT * FROM school;
SP_Help 'School'

--now creating another table.

CREATE TABLE Sports(
SID INT NOT NULL,
Name VARCHAR(255),
Players INT NOT NULL,
CONSTRAINT chkp_play CHECK (players > 5)
)

Select * from sports;
Sp_help 'sports'

insert into sports values (1, 'Cricket', 11);
--this will give an error because the value of player is less than 5.    hence this statement will be terminated.
insert into sports values (2, 'Badminton', 4)