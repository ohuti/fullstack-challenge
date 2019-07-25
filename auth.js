var bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
  function findUser(email, callback){
    global.db.query('select * from accounts where email = ?', [email], function(err, doc){
      if(err) return done(err);
      callback(err, doc);
    });
  }

  function findUserId(id, callback){
    global.db.query('select * from accounts where id = ?', [id], function(err, doc){
      callback(err, doc);
    });
  }

  passport.serializeUser(function(user, done){
    done(null, user[0].ID);
  });

  passport.deserializeUser(function(id, done){
    findUserId(id, function(err, user){
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done){
    findUser(email, function(err, user){
      if (err) return done(err);

      // usuário inexistente
      if (!user) return done(null, false);

      // comparando as senhas
      bcrypt.compare(password, user[0].password, function(err, isValid){
        if (err)return done(err)
        if (!isValid)return done(null, false)
        return done(null, user);
      });
    });
  }
  ));
}
