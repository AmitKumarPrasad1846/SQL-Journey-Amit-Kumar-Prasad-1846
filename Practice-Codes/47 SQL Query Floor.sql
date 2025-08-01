--Floor
--it shows the result as a whole no. by approximating to closest smaller value.

use google

select floor(23.2)

select floor(23.9)

select floor(1.89)

select floor(0.01)

select floor(-10.1)

select floor(-5.9)

select * from employee

select *, floor(age) from employee


--Ceiling(just opposite to floor)
--it shows the result as a whole no. by approximating to closest bigger value.

select ceiling(10.7)

select ceiling(0.7)

select ceiling(-1.2)

select ceiling(-10.7)

--lag and lead both are windows function

--lag
--it lags by one value.

select * from employee

select name from employee

select name, lag(name) over(order by name) as Lag_name from employee

--lead
--it leads by 1 value

select name, lead(name) over(order by name) as Lead_name from employee

select * from Employee

--now combining the both

select name, lag(name) over(order by name) as lag_name, lead(name) over(order by name) as lead_name from employee

select name, lag(lag(name) over(order by name) over(order by name)) from employee