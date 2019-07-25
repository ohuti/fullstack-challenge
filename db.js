var bcrypt = require('bcryptjs')

function createUser(username, email, password, callback){
  var cryptPwd = bcrypt.hashSync(password, 10)
  global.db.query('insert into accounts (username, email, password) values (?,?,?)', [username, email, cryptPwd], function(err, result){
    callback(err, result);
  });
}

function getTask(callback){
  global.db.query('select * from entries', function(err, result){
    callback(err, result);
  });
}

function createTask(task, username){
  global.db.query('insert into entries (task, createdBy, lastEditedBy) values (?,?,?)', [task, username, username]);
}

function updateTask(id, task) {
  global.db.query('update entries set task = ? where ID = ?', [task, id]);
}

function deleteTask(id){
  global.db.query('delete from entries where ID = ?', [id]);
}

module.exports = {createUser, getTask, createTask, updateTask, deleteTask}
