const bcrypt = require('bcryptjs');


//register a new user
const createUser = (userInfo, db) => {

  const {email} = userInfo;
  const password = bcrypt.hashSync(userInfo.password, 10);

  if (!email || !password){
    return {error: "Incomplete", data: null};
  }

  if (getUserByEmail(email, database)){
    return {error: "Email exists", data: null};
  }

  let id = generateRandomString();

  const newUser = {id, email, password};
  database[id] = newUser;
  return {error: null, data: newUser};

}