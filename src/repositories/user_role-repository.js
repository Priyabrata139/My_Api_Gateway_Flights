const CrudRepository = require('./crud-repository');

const { User_role } = require('../models');
const { Op } = require('sequelize');


class User_roleRepository extends CrudRepository {
    constructor() {
        super(User_role);
    }
    async getUser_role(data){
        console.log('inside user role')
        const user_role = await User_role.findOne({where:{
            [Op.and] : [
                {
                    userId: {
                        [Op.eq]: data.userId
                      }
                },
                {
                    roleId:  {
                            [Op.eq]: data.roleId
                        }
                     
                }
            ]
        }});
        
        return user_role;
    }
}

module.exports = User_roleRepository;