const inquirer = require('inquirer');
const db = require('./connection')

// Create function to display the main menu options for the employee tracker
function displayMainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'Select from the choices below:',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ])
        .then((answers) => {
            const { menuChoice } = answers;

            // Call needed function based on the selection made by the user
            switch (menuChoice) {
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
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    console.log('Thanks for using employee tracker!');
                    return;
            }
        })
}

async function viewDepartments() {
    // Display department SQL table
    try {
        const [rows] = await db.query('SELECT * FROM department')

        const deptData = ['Department ID', 'Department Name'];

        const formattedData = rows.map(row => {
            return {
                'Department ID': row.id,
                'Department Name': row.name
            }
        })
        console.table(formattedData, deptData)

    }
    catch (err) {
        console.log(err)
    }

}

async function viewRoles() {
    // Display role table
    try {
        const [rows] = await db.query('SELECT * FROM roles')

        const roleData = ['Title', 'Salary', 'Department ID'];

        const formattedData = rows.map(row => {
            return {
                'Title': row.title,
                'Salary': row.salary,
                'Department ID': row.department_id
            }
        })
        console.table(formattedData, roleData)

    }
    catch (err) {
        console.log(err)
    }
}

async function viewEmployees() {
    // Display employee table (add job title, department, salary)
    try {
        const [rows] = await db.query('SELECT * FROM employee')

        const employeeData = ['First Name', 'Last Name', 'Role ID', 'Manager ID'];

        const formattedData = rows.map(row => {
            return {
                'First Name': row.first_name,
                'Last Name': row.last_name,
                'Role ID': row.role_id,
                'Manager ID': row.manager_id
            }
        })
        console.table(formattedData, employeeData)

    }
    catch (err) {
        console.log(err)
    }
}

async function addDepartment() {
    try {
        const newDept = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter department name:',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter a valid department.'
                    }
                    return true;
                }
            }
        ]);
        const updateQuery = 'INSERT INTO department (name) VALUES (?);'
        await db.query(updateQuery, [newDept.name]);

        console.log('Department Added!');
        displayMainMenu();
    }
    catch (err) {
        console.log(err);
    }

}

async function addRole() {
    try {
        const newRole = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter role title:',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter a valid role.'
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for this role:',
                validate: (input) => {
                    if (!/^\d+(\.\d{1,2})?$/.test(input)) {
                        return 'Please enter a valid salary (e.g., 50000 or 50000.00).'
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter the department ID for this role:',
                validate: (input) => {
                    if (!/^\d+(\.\d{1,2})?$/.test(input)) {
                        return 'Please enter a valid department ID.'
                    }
                    return true;
                }
            }

        ]);
        const updateQuery = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);'
        await db.query(updateQuery, [newRole.title, newRole.salary, newRole.department_id]);

        console.log('Role Added!');
        displayMainMenu();
    }
    catch (err) {
        console.log(err);
    }
}

async function addEmployee() {
    try {
        const newEmployee = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter employees first name:',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter a valid name.'
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter employees last name:',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter a valid name.'
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'Enter the employees role ID:',
                validate: (input) => {
                    if (!/^\d+(\.\d{1,2})?$/.test(input)) {
                        return 'Please enter a valid role ID.'
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'manager_id',
                message: 'Enter the employees manager ID:',
                validate: (input) => {
                    if (!/^\d+(\.\d{1,2})?$/.test(input)) {
                        return 'Please enter a valid manager ID.'
                    }
                    return true;
                }
            }

        ]);
        const updateQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);'
        await db.query(updateQuery, [newEmployee.first_name, newEmployee.last_name, newEmployee.role_id, newEmployee.manager_id]);

        console.log('Employee Added!');
        displayMainMenu();
    }
    catch (err) {
        console.log(err);
    }
}


async function updateEmployeeRole() {
 try {
    // Get the list of current employees from db
    const employee = await db.query('SELECT id, first_name, last_name FROM employee');

    // Select which user you want to update
    const employChoices = employee.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    }));
    const {employeeId} = await inquirer.prompt({
        type: 'list',
        name: 'employeeId',
        message: 'Select which employee you would like to update:',
        choices: employChoices
    });

    console.log('Selected Employee ID:', employeeId);

    // Get the role from the db
    const roles = await db.query('SELECT id, title FROM roles');

    // Select a new role for the user
    const roleChoices = roles.map( role => ({
        name: role.title,
        value: role.id
    }));
    const {roleId} =await inquirer.prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select updated role:',
        choices: roleChoices
    });

    // Update the database with the new info
    const updateQuery = 'UPDATE employee SET role_id=? WHERE id=?;'
    await db.query(updateQuery, [roleId, employeeId]);

    console.log('Employee Role Updated!')
    displayMainMenu();

 }
 catch (err) {
    console.log(err)
 }
}

displayMainMenu();