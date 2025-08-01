--IIF() Statement
--iif statement is alternate statement for case statement.

--it is used viewing only

use google

select * from employee

select *, IIF(salary > 60000, 'Senior Engineer', 'Junior Engineer') from employee

select *,IIf(gender = 'Male', concat('Mr.', name), concat('Miss.', name)) as Emp_name from employee

select *, IIF(department = 'IT', 'Engineering Domain', IIF(department = 'Marketting', 'Sales Domain',
IIF(department = 'Accounts', 'Finance domain', 'Management Domain')))
as Domain from employee

select *, IIF(department = 'IT', 'Engineering Domain', IIF(department = 'Marketting', 'Sales Domain',
IIF(department = 'Accounts', 'Finance domain', 'Management Domain')))
as Domain into emp_dom from employee

select * from emp_dom

select *, IIF(age < 42, 'Junior Engineer', 'Senior Engineer') from employee order by age

select *, IIf(age < 23, 'Intern', IIF(age < 27, 'Junior Engineer',
IIF(age < 29, 'Senior Engineer', IIF(age < 33,'Team Leader',
IIF(age < 41, 'Manager', IIf(age < 50, 'Senior Manager', 'President'))))))
as Designation From employee order by age

/*Use IIF condition to assign Projects for People according to their name
all the people whose name starts with a, b, c, d, e, f will be given 'Jhonson Project'
all other people will be in 'vodafone project'*/

select *, iif(substring(name, 1,1) in ('a', 'b', 'c', 'd', 'e', 'f'), 'Western Union',IIf(substring(name, 1,1) in ('g', 'h', 'I', 'j', 'k', 'l'), 'Jhonson', 'Vodafone')) as Project_namefrom employeeselect     name,    IIF(name LIKE '[A-F]%', 'Western Union',        IIF(name LIKE '[H-L]%', 'Johnson', 'Vodafone')) as Project_namefrom employee