--Import CSV

--dbo means database object.
use Google
--CREATING TABLE RABBIT
create table Rabbit
(id int, lastname varchar(255), firstname varchar(255), middlename varchar(255),
suffix varchar(255))
--METHOD 1 -- WITHOUT ANY LIMIT  _ COMPLETE IMPORT

--giving only firstrow.
bulk insert dbo.rabbit
from 'C:\sql file\Tiger.csv'
with
(
format = 'CSV',
firstrow = 2
)

select * from rabbit

--METHOD 2 -- WITH LIMIT  _ SELECTED IMPORT
--CREATING ANOTHER TABLE
create table parrot
(Id int, lastname varchar(255), firstname varchar(255), middlename varchar(255),
suffix varchar(255))

select * from parrot


--giving first and last row.
bulk insert dbo.parrot
from 'C:\sql file\Tiger.csv'
with
(
format = 'CSV',
firstrow = 2,
lastrow = 21
)

select * from parrot;

--METHOD 3

--USING RIGHT CLICK ON DATABASE > IMPORT FLAT FILE > SELECT YOUR FILE (BROWSE) > GIVE YOUR TABLE NAME > SELECT IF YOU NEED 
--ANY PRIMARY OR FOREIGN KEY OTHERWISE CLICK CONTINUE > THEN CLICK FINISH