db.createUser({
  user: "admin",
  pwd: "crispeta",
  roles: [
    {
      role: "readWrite",
      db: "usersdb"
    }
  ]
});

db.users.insert({
  username: "admin",
  password: "crispeta",
  role: "admin"
});
