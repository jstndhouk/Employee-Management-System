const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
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
        case 'Add an employee':
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

//Calls the main inquier function
userPrompt();

//Views all the departments
const viewDepartments = () => {
  db.query('SELECT * FROM department', function (err, results) {
    console.log(results);
  });
}

//Views all the roles with the joined associated department data.
//How do I get this formatted in a nice table???????????????????????????????????????
const viewRoles = () => {
  db.query('SELECT role.title, role.id, department.department_name, role.salary FROM role RIGHT JOIN department ON role.department_id = department.id ORDER BY role.id;', function (err, results) {
    console.log(results);
  });
}

//Views all the employees with the joined associated roles and department data.
//How to add manager tied back to employees manager id???????????????????????????
const viewEmployees = () => {
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
    console.log(results);
  });

}
//Adds a department.  Inquier to get data from the user, then mysql2 query.
const addDepartment = (newDept) => {
  inquirer.prompt({
      type: 'input',
      message: 'What department would you like to add?',
      name: 'newDept'
    })
    .then((response) => {
      console.log(response.newDept)
      db.query('INSERT INTO department (department_name) VALUES("?");', response.newDept, function (err, results) {
        console.log(results);
      db.query(`SELECT * FROM department`, function (err, results) {
         console.log(results);
      });
    })
})
}

const addRole = () => {
//prompts the user to enter the role to be added.
  inquirer.prompt({
      type: 'input',
      message: 'What role would you like to add?',
      name: 'newRoleName',
    })
//enters the role into the table.
    .then((response) => {
      db.query(`INSERT INTO role (title) VALUES(?);`, response.newRoleName, function (err, results) {
        console.log(results);
      });
    })

//prompts the user to enter the salary for the role.
  inquirer.prompt({
      type: 'input',
      message: 'What is the salary of this role?',
      name: 'newRoleSalary',
    })
//enters the salary into the table.
    .then((response) => {
      db.query(`INSERT INTO role (salary) VALUES($);`, response.newRoleSalary, function (err, results) {
        console.log(results);
      });
    })

//prompts the user to enter the department of the role.
  inquirer.prompt({
    type: 'input',
    message: "Enter the role's department ID",
    name: 'newRoleDeptID',
    })
    //enters the id in the table depending on which department was chosen
    .then((response) => {
      // let newID;
      // switch (newRoleDept) {
      //   case 'Human Resources':
      //      newID= 1;
      //     break;
      //   case 'Legal':
      //     newID = 2;
      //     break;
      //   case 'Operations':
      //     newID = 3;
      //     break;
      //   case 'Estimating':
      //     newID = 4;
      //     break;
      // }
      db.query(`INSERT INTO role (department_id) VALUES($); SELECT * FROM role`, newRoleDeptID, function (err, results) {
      console.log(results);
      });
    })
}


const addEmployee = () => {
  //prompts the user for the first name
  inquirer.prompt({
    type: 'input',
    message: "What is the employee's first name?",
    name: 'newFirstName',
  })
  //enters new first name into the table.
  .then((response) => {
    db.query(`INSERT INTO employee (first_name) VALUES(?);`, response.newFirstName, function (err, results) {
      console.log(results);
    });
  })

  //prompts the user for the last name
  inquirer.prompt({
    type: 'input',
    message: "What is the employee's first name?",
    name: 'newLastName',
  })
  //enters the new last name into the table
  .then((response) => {
    db.query(`INSERT INTO employee (last_name) VALUES(?);`, response.newLastName, function (err, results) {
      console.log(results);
    });
  })

  //prompts the user for the last name
  inquirer.prompt({
    type: 'input',
    message: "What is the employee's role ID?",
    name: 'newRoleID',
  })
  //enters the new last name into the table
  .then((response) => {
    db.query(`INSERT INTO employee (role_id) VALUES(?);`, response.newRoleID, function (err, results) {
      console.log(results);
    });
  })

  //prompts the user for the last name
  inquirer.prompt({
    type: 'input',
    message: "What is the employee's manager ID?  Enter 'NULL' if the employee has no manager",
    name: 'newManagerID',
  })
  //enters the new last name into the table
  .then((response) => {
    db.query(`INSERT INTO employee (manager_id) VALUES(?);`, response.newManagerID, function (err, results) {
      console.log(results);
    });
  })

}

const updateRole = () =>{
  inquirer.prompt({
    type: 'input',
    message: "Enter the role you would like to update",
    name: 'RoleToBeUpdated',
  })
  .then((response) => {
    const updatedRole=response.RoleToBeUpdated;
  })

  inquirer.prompt({
    type: 'input',
    message: "Enter the role you would like to update",
    name: 'RoleToBeUpdated',
  })
  .then((response) => {
    const updatedRole=response.RoleToBeUpdated;
  })
}

//gets the max department ID.
const getMaxDeptID = () => {
  db.query(`SELECT MAX (id) FROM department`, function (err, results) {
    console.log(results);
    return results;
  })
}



//calls the function that gest the max department ID.
//const maxDeptID=getMaxDeptID();
//loops through the departments
//for (let i=0 ; i < maxDeptID; i<++;){
//  db.query(`SELECT department_name FROM Department WHERE id=?`, i , function (err, results) {
//  console.log(results);
//  const thisDept=results;
//    