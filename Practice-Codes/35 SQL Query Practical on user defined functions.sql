--Practical on user defined function.

Use Google

SELECT * FROM employee
/* Create a function to find the volume of a cylindrical object
Function name ---> volume

V = pi * r * r * h
take pi = 3.14

In your table you can take age as Radius(r), id as height(h)*/

create function Volume
(
@r int,
@h int
)
returns int
as begin
return 3.14 * @r * @r * @h
end

select dbo.volume(2, 3)

select id AS HEIGHT, age AS RADIUS, name, dbo.volume(age ,id) as volume from employee