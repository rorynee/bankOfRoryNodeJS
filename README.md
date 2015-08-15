#![alt text][logo] Bank of Rory Database Assignment
 [logo]: https://raw.github.com/rorynee/bankOfRoryNodeJS/master/public/images/borlogo.png  "Bank Of Rory Logo"

##Work in Progress

##About

The following project was set up by myself in a dib to learn Node.js and to be able to practice my JavaScript. This project is very close to the PHP version as outlined in a previous project.

##Technologies In Use

Node.js, Express Web Framework, JavaScript, HTML5, CSS3, Bootstrap, MySQL and Git
Possible others: Grunt, Angular.js 

## Assignment Outline

**Task:** You will develop an online system of your choice that uses Node.js and a MySQL database.

**Requirements Includes:**

New Users can either self-registration or be done by another User.

Also carry our simple crud operation.

There should be 2 or more types of users with different privileges.

The database will use Stored Procedures to execute queries.


##Outline of the system

The system that I have made is a banking system called “Bank of Rory”. This system could be used in a bank together with some kind of cash dispensing facility attached to it.
This system was built using Node.js using Express Framework. You will notice that throughout this system the URL are always restful.  


There are three different types of user roles incorporated into the system.

**Role 1:** A Normal user role has access to creating an account, doing various updates including making a withdrawal, depositing money and updating their own account information. The user will also be able view recent transaction on the “Show history” page and the user can delete their account. By doing a delete they will fully delete any record of their account. 


**Role 2:** The Admin role will have complete access to all accounts and ticket system. The Admin role can update their own account and also add new accounts. The Admin role can also See the History, update account types and update the balance of an account but a record of the change to a balance will be kept in the “history” for that user.  

The administrator will have the only access to the report feature on the website. There will be four reports available that access information for all the tables in the database.  

***


##System Login’s

The following are the Login details that you will need to access the system.

Username: admin@bankofrory.com - Password: admin1234

Username: liam@example.com - Password: 1234567

Username: will@yourbank.com - Password: 1234567

Username: billy@ait.ie - Password: 1234567


