--Practical on Substring

USE google

select * from employee
select substring('Tomorrow is Friday', 13, 6)

/*
Generate a Username an Password from employee table in below format
username (First three letters of name in capital + first two letters of gender in lower + 
first letter of department in capital + first three letters of city in lower)
Password (First two letters of name inlower + age + first two letter of department in capital + first four 
letters of city in lower)
*/

--Substring command works like  
--substring(give_the_name_you_want, starting_nth_digit_no., ending_on_digit_no.)
SELECT substring( 'I am Amit Kumar Prasad', 6, 4 )

select id, name, concat(upper(substring(name, 1,3)), lower(substring(gender, 1,2)),
upper(substring(department, 1,1)), lower(substring(city, 1,3))) as Username,
concat(lower(substring(name, 1,2)), age, upper(substring(department, 1,2)),
lower(substring(city, 1, 4))) as Password from employee