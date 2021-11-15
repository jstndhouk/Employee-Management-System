//requires needed packages
const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const consTable=require('console.table')

//creates connection to the database
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
      choices: ['View all departments', 'View all roles', "View all employees", 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role','Im Finished']
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
        default:
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
    console.table(results)
    userPrompt();
  });
}
//Views all the roles with the joined associated department data.
const viewRoles = () => {
  db.query('SELECT role.title, role.id, department.department_name, role.salary FROM role RIGHT JOIN department ON role.department_id = department.id ORDER BY role.id;', function (err, results) {
    console.table(results);
    userPrompt();
  });
}

//Views all the employees with the joined associated roles and department data.
const viewEmployees = () => {
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id;', function (err, results) {
    console.table(results);
    userPrompt();
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
      db.query('INSERT INTO department (department_name) VALUES(?);', response.newDept, function (err, results) {
        console.table(results);
      db.query(`SELECT * FROM department`, function (err, results) {
        console.table(results);
        userPrompt();
      });
    })
})
}

const addRole =  () => {
//prompts the user to enter the role data.  Grabs the department ids and names so give the user as options, then inserts it into the table.
db.query(`SELECT * FROM department`, function (err, results) {
  let allDepartments = results.map(department => {
    return  {value: department.id, name: department.department_name}
  })
  inquirer.prompt([{
      type: 'input',
      message: 'What role would you like to add?',
      name: 'newRoleName',
    },
    {
      type: 'input',
      message: 'What is the salary of this role?',
      name: 'newRoleSalary',
    },
    {
     type: 'list',
      message: 'Choose a department for the employee',
      name: 'newRoleDeptID',
      choices: allDepartments
    }
    ])
    //queries to insert the role data into the table
    .then(({newRoleName, newRoleSalary, newRoleDeptID}) => {
      console.log(newRoleDeptID)
      db.query('INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?);', [newRoleName, newRoleSalary, newRoleDeptID], function (err, results) {
      });
      db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
        userPrompt();
        });
    })
  })
}


const addEmployee = () => {
  db.query(`SELECT * FROM role`, function (err, results) {
    let allRoles = results.map(roles => {
      return  {value: roles.id, name: roles.title}
    })
      db.query(`SELECT * FROM employee`, function (err, results) {
        let allEmployees = results.map(employees => {
          return  {value: employees.id, name: employees.first_name}
        })
      //prompts the user for the employee data.
      inquirer.prompt([
        {
          type: 'input',
          message: "What is the employee's first name?",
          name: 'newFirstName',
        },
        {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'newLastName',
      },
      {
        type: 'list',
        message: 'Choose a role for the employee',
        name: 'newRole',
        choices: allRoles
      },
      {
        type: 'list',
        message: 'Choose a manager for the employee',
        name: 'newManager',
        choices: allEmployees
      }])
        .then(({newFirstName, newLastName, newRole, newManager}) => {
          db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);', [newFirstName, newLastName, newRole, newManager ], function (err, results) {
          });
          db.query('SELECT * FROM employee', function (err, results) {
            console.table(results);
            userPrompt();
            });
        })
      })
  })
}

const updateRole = () =>{
  db.query(`SELECT * FROM role`, function (err, results) {
    let allroles = results.map(role => {
      return  {value: role.id, name: role.title}
    })

  inquirer.prompt([{
    type: 'input',
    message: "Enter the first name of the employee you would like to update",
    name: 'employeeToBeUpdated',
  },
  {
    type: 'list',
    message: "What would you like their new role to be?",
    name: 'newRoleID',
    choices: allroles
  }])
    .then(({employeeToBeUpdated, newRoleID}) => {
      db.query(`UPDATE employee SET role_id = ? WHERE first_name = ?`, [newRoleID, employeeToBeUpdated], function (err, results) {
      })
    db.query('SELECT * FROM employee', function (err, results) {
      console.table(results);
      userPrompt();
      });
    })
})
}

const finish = () => process.exit();

  