// module.exports = {
//     USER: "root",
//     PASSWORD: "Anka@1234",
//     DB: "demo_openshift",
//     HOST: "localhost"
// };


module.exports = {
    USER: "db_user",
    PASSWORD: "Anka@1234",
    DB: "node_app",
    HOST: "localhost"
};

// CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'P@ssW0rd';



// CREATE DATABASE node_app;

// CREATE USER 'db_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Anka@1234';

// GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON node_app.* TO 'db_user'@'localhost';

// GRANT FILE ON *.* TO 'db_user'@'localhost';