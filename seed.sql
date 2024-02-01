USE employee_tracker; 

INSERT INTO department (name) VALUES
    ('Human Resources'), ('Finance'), ('Marketing');

INSERT INTO roles (title, salary, department_id) VALUES
    ('HR Director', '80000.00', 1), 
    ('Financial Analyst', '60000.00', 2),
    ('Marketing Manager', '70000.00', 3),
    ('Marketing Analyst', '55000.00', 3),
    ('HR Associate', '50000.00', 1) ;

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Smith', 1, 1),
    ('Sam', 'Johnson', 2, 1),
    ('Jane', 'Adams', 3, 3),
    ('Delaney', 'Brown', 2, 2),
    ('Rick', 'Williams', 5, 1),
    ('Erin', 'Butler', 4, 2);