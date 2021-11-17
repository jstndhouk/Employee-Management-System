INSERT INTO department (department_name)
VALUES ('Human Resources'),
       ("Legal"),
       ("Operations"),
       ("Estimating");
       
INSERT INTO role (title, salary, department_id)
VALUES ('Project Manager', '110000', '3'),
       ('Director', '300000', '3'),
       ('Project Engineer', '70000', '3'),
       ('Lawyer', '100000', '2'),
       ('Clerk', '60000', '2' ),
       ('Estimator', '80000', '4'),
       ('Senior Estimator', '100000', '4'),
       ('Payroll Specialist', '60000', '1'),
       ('Benefits Specialist', '50000', '1');
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Shinida', 'Bump', '1', '2'),
       ('Sharon', 'Needles', '1', NULL),
       ('Trixie', 'Mattel', '5', '1'),
       ('Katya', 'Zamalochakova', '5', NULL),
       ('Ginger', 'Minj','4', NULL),
       ('Violet', 'Chachki', '4', NULL),
       ('Bianca', 'DelRio','2', NULL),
       ('Alexis', 'Matteo','3', '2'),
       ('Crystal', 'Method', '3', '2'),
       ('Alaska', 'ThunderF**k5000', '6', '7'),
       ('Trinity', 'The Tuck', '6', '7'),
       ('Alexis', 'Bevels', '7', NULL),
       ('Darby', 'Carhart', '7', NULL),
       ('Auntie', 'Chan', '8', NULL),
       ('Tammy', 'Brown', '9', NULL);
       
