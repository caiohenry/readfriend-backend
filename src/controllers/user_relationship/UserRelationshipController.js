// Imports
const knex = require('../../database')

const { relationship } = require('../../utils/lovs')
const type = relationship.types


// Controller
module.exports = {

    // Index
    async index(req, res) {

        try {

            const {type, user_id} = req.query;

            // Get user relationship - SELECT WHERE
            const query = knex.from('user_relationship')

            if (type != undefined && !!type) {
                query.andWhere(function () {
                    this.orWhereRaw('LOWER(type) LIKE ?', `%${type.toLowerCase()}%`)
                })
            }

            if (user_id != undefined && !!user_id) {
                query.where({user_id: user_id})
            }
                
            // Response data - success
            await query
                .join('users as friend', 'user_relationship.friend_id', 'friend.id')
                .select(
                    'user_relationship.id',
                    'user_relationship.friend_id',
                    'friend.name as name',
                    'friend.email as email',
                    'friend.photo as photo'
                )
                .orderBy('name')
                .then((data) => {
                    res.send({
                        data
                    })
            })

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user_relationship.index.nok',
                error: err
            })

        }
        
    },

    // Solicitation
    async solicitation(req, res) {

        try {

            const user_id = req.user.id;

            // Get user relationship - SELECT WHERE
            const query = knex.from('user_relationship').where('type', type.SOLICITATION)
            query.where(function () {
                this.where('friend_id', user_id).orWhere('user_id', user_id);
            });
                
            // Response data - success
            await query
            .join('users as friend', 'user_relationship.friend_id', 'friend.id')
            .select(
                'user_relationship.id',
                'user_relationship.user_id',
                'user_relationship.friend_id',
                'user_relationship.created_at',
                'friend.name as friend_name',
                'friend.photo as friend_photo_url',
                'type'
            )
            .orderBy('friend_name')
            .then((data) => {
                res.send({ data });
            });

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user_relationship.index.nok',
                error: err
            })

        }
        
    },


    // Create
    async create(req, res, next) {

        // Get body in the request
        const {
            friend_id
        } = req.body

        // Get user id in the request
        const user_id = req.user.id

        try {

            // If user id is equal for friend id
            if (user_id == friend_id) {

                // Response data - error
                return res.status(400).json({
                    message: 'user_relationship.create.nok',
                    detail: {
                        constraint: "user.relationship.user.notself"
                    }
                })
            }

            // Create data in table - INSERT VALUES
            const [data] = await knex('user_relationship')
                .insert([
                    { user_id: user_id, friend_id: friend_id }
                ]).returning('id')

            // Response data - success
            res.send({ data, message: 'user_relationship.create.ok' })
            next()

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user_relationship.create.nok',
                detail: {
                    code: err.code,
                    message: err.detail,
                    constraint: err.constraint?.replaceAll('_', '.')
                }
            })

        }

    },

    // Update
    async update(req, res, next) {

        // Get body in the request
        const {
            friend_id
        } = req.body

        // Get user id in the request
        const user_id = req.user.id

        // Get id in the params
        const { id } = req.params

        try {

            // If user id is equal for friend id
            if (user_id == friend_id) {

                // Response data - error
                return res.status(400).json({
                    message: 'user_relationship.update.nok',
                    detail: {
                        constraint: "user.relationship.user.notself"
                    }
                })
            }

            // Create data in table - INSERT VALUES
            const [data] = await knex('user_relationship')
                .insert([
                    { user_id: user_id, friend_id: friend_id, type: type.FRIEND }
                ]).returning('id')

            // Update data in table where id - UPDATE SET WHERE
            await knex('user_relationship')
                .update({
                    type: type.FRIEND
                })
                .where({ id })

            // Response data - success
            res.send({ data, message: 'user_relationship.update.ok' })
            next()

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user_relationship.update.nok',
                detail: {
                    code: err.code,
                    message: err.detail,
                    constraint: err.constraint?.replaceAll('_', '.')
                }
            })

        }

    },

    // Delete
    async delete(req, res) {

        // Get id in the params
        const { id } = req.params

        try {

            // Delete data in table where id - DELETE WHERE
            await knex('user_relationship').where({ id }).del()

            // Response data - success
            return res.send({
                message: 'user_relationship.delete.ok'
            })

        } catch (err) {

            // Response data - error
            return res.status(400).send({
                message: 'user_relationship.delete.nok'
            })

        }
    }

}
