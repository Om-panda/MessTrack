const bcrypt = require('bcrypt');

bcrypt.hash('123456', 10).then(hash => {
    console.log(hash);
});



//INSERT INTO students (name, reg_no, password, role) VALUES ('Admin', 'admin123', 'PASTE_HASH_HERE', 'admin');
//Raja-123
//admin123-123456
//stu101-12345
//stu102-1234
//cat101-1234567
//sek123-1212
//2241013131-123123
//debi123
//ambika123-ambika123