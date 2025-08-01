--System Functions

USE Google

--SUM

SELECT SUM(SALARY) FROM employee

SELECT MAX(SALARY) AS MAX_SALARY FROM employee

--MAX

SELECT MAX(salary) as max_salary from employee

--MIN

SELECT MIN(age) as youngest_age from employee

--AVG

SELECT AVG(salary) from employee

SELECT AVG(age) FROM employee

--APPLYING IT WITH GROUP BY
select department, avg(age) as AVg_age from employee group by department

SELECT gender, avg(salary) as avg_sal from employee group by gender


--COUNT

select count(*) from employee

select * from employee

SELECT COUNT(name) from employee
--the count function does not counts the null values.
select count(department) from employee

select count(distinct department) from employee

--Lower

SELECT lower(name) from employee

--Upper

Select upper(name) from employee

--Reverse  [Amit -- timA]

select reverse(name) from employee
--merging system functions

-- lower + reverse
select lower(reverse(name)) from employee
--upper + reverse
select upper(reverse(name)) from employee



--Len [It will calculate character length]

select name from employee

select name, len(name) from employee

select name, len(name) as n_len, len(city) as l_city, age, len(age) from employee


--Concat

select * from employee

select concat(id, name, age, gender, salary, department, city) from employee
--now giving some space between them.
select concat(id, ' ', name, ' ', age, ' ', gender, ' ', salary, ' ', department, ' ', city) from employee
--now inserting some special characters.
select concat(id, '@', name, ' ', age, '/', gender, ' ', salary, ' ', department, 'in', city) from employee

/* Amit Id is 1 , age is 27, gender is male, earning salary of 40000 Rupees works for 
  IT Department belongs to city Delhi. */

select concat(name, ' Id is ', id, ' , age is ', age, ' ,gender is ', gender, ' , earning 
salary of ', salary , ' Rupees works for ', department, ' Department belongs to city ', 
city, '.') as Emp_info from employee
--we can even add a clause.
select concat(name, ' Id is ', id, ' , age is ', age, ' ,gender is ', gender, ' , earning 
salary of ', salary , ' Rupees works for ', department, ' Department belongs to city ', 
city, '.') as Emp_info from employee where gender = 'Female'

/* AMIT Id is 1 , age is 27, gender is male, earning salary of 40000 Rupees works for
IT Department belongs to city Delhi. */

select concat(upper(name), ' Id is ', id, ' , age is ', age, ' ,gender is ', lower(gender), 
' , earning salary of ', salary , ' Rupees works for ', upper(department), 
' Department belongs to city ',  city, '.') as Emp_info from employee

--we can even clone data

select concat(upper(name), ' Id is ', id, ' , age is ', age, ' ,gender is ', lower(gender), 
' , earning salary of ', salary , ' Rupees works for ', upper(department), 
' Department belongs to city ',  city, '.') as Emp_info into info from employee

select * from info

--when we use ' * ' then we will get concat with that table

select *, concat(upper(name), ' Id is ', id, ' , age is ', age, ' ,gender is ', lower(gender), 
' , earning salary of ', salary , ' Rupees works for ', upper(department), 
' Department belongs to city ',  city, '.') as Emp_info from employee

--Replace

select replace('IPLIWINNERKKR', 'KKR', 'BANGALORE')

select replace('This is Python Class', 'Python', 'SQL')

select * from employee

select *, replace(city, 'Delhi', 'New Delhi') as Updated_city from employee


--SUBSTRING

select substring('This is SQL class', 1, 4)

select substring('This is SQL class', 9 , 3)

select substring( 'This is the month of July 2025', 13, 5)


select substring( 'This is the month of July 2025', 22, 4)

select substring( 'This is the month of July 2025', 27, 4)