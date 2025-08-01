--TRANSACTION IN SQL 
--a transaction is a sequence of one or more SQL operations (such as INSERT, UPDATE, DELETE)
--that are executed as a single unit of work.
--The key idea behind transactions is atomicity—either all operations within the transaction succeed, or none do. 
--This ensures data integrity.




use google 

select* from employee


--EXAMPLE OF  "TRANSACTION ROLLBACK'
begin try
begin transaction
update employee set age = 30 where name = 'Amit'
update employee set department = 'Marketing' where name = 'Anjali'
update employee set city = 'Dehradun' where name = 'Bdal'
update employee set salary = 90000/0 where name = 'Priya'
print 'Transaction committed'
end
try begin catch 
rollback transaction
print 'Transaction rollback'
end catch



--EXAMPLE OF "TRANSACTION COMMITTED"
begin try
begin transaction
update employee set age = 35 where name = 'Amit'
update employee set salary = 64000 where name = 'Anjali'
update employee set city = 'Kolkata' where name = 'Bdal'
update employee set department = 'Accounts' where name = 'Priya'
update employee set salary = 71000 where name = 'Arun'
print 'Transaction committed'
end
try begin catch 
rollback transaction
print 'Transaction rollback'
end catch