const allRoles = {
  user: [],
  admin: ["getUsers", "manageUsers"],
};

//   define roles array [roles,roles2]
const roles = Object.keys(allRoles);
// define roles permission hashMap
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
