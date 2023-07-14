const CrudRepository = require('./crud-repository');
const { Role } = require('../models');


class RoleRepository extends CrudRepository {
    constructor() {
        super(Role);
    }
    async getRoleByName(roleName){
        const role = await Role.findOne({where: {
            name: roleName
        }});
        return role;
    }
}

module.exports = RoleRepository;