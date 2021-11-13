const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: 'root',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);


//Makes the initial prompt for the user to view/alter the database.
let userPrompt = () => {
  inquirer.prompt({
      type: 'list',
      message: 'What would you like to do?',
      name: 'next',
      choices: ['View all departments', 'View all roles', "View all employees", 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    })
    .then((response) => {
      //switch statement that handles what the program should do next, based off off the input.
      switch (response.next) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an eomployee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateRole();
          break;
        case "I'm finished":
          finish();
          break;
      }
    })
}

//Calls the inquier function
userPrompt();

//Creates an engineer object, and pushes the engineer to the team array
const viewDepartments = () => {
  db.query('SELECT * FROM department', function (err, results) {
    console.log(results);
  });
}

//Joins the deparment with the associated roles then displays all of them per the readme.
//How do I get this formatted in a nice table???????????????????????????????????????
const viewRoles = () => {
  db.query('SELECT role.title, role.id, department.department_name, role.salary FROM role RIGHT JOIN department ON role.department_id = department.id ORDER BY role.id;', function (err, results) {
    console.log(results);
  });
}

//How to add manager tied back to employees manager id
const viewEmployees = () => {
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
    console.log(results);
  });

}
const addDepartment = (newDept) => {
  inquirer.prompt({
    type: 'input',
    message: 'What department would you like to add?',
    name: 'newDept',
    })
  db.query(`INSERT INTO department (department_name) VALUES($); SELECT * FROM department`,newDept, function (err, results) {
    console.log(results);
  });
}
const addRole = () => {


}
const addEmployee = () => {


}