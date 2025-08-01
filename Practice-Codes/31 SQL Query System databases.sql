--System databases

/*
Master DB : Master database is the most important system database. 
All the key values of user defined databases are stored here.
In case our master database is corrupted, we will not be able to 
access any of these data 
*/

/*
Model DB : when we create a new database we will see that it is not blank.
There are lot of system objects like system views system 
function etc present here all these objects are created by 
the Model DB. Basically model db acts like a template for a new database. 
*/

/*
Temp DB: All the temprorary files are stored in temp db. 
Like we have temp tables.
*/

/*
MSDB: All the information ralated to sql 
server agent is stored in MSDB.
*/