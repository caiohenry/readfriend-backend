// Imports
const knex = require('../../database')
const bcrypt = require('bcrypt')


// Controller
module.exports = {

    // Index
    async index(req, res) {

        try {

            // Get q in the query
            const { q } = req.query

            // Get user - SELECT
            const query = knex.from('users')
            .whereNot('id', req.user.id)
            .whereNotIn('id', function () {
                this.select('friend_id')
                .from('user_relationship')
                .where('user_id', req.user.id)
                .union(function () {
                    this.select('user_id')
                    .from('user_relationship')
                    .where('friend_id', req.user.id);
                });
            });

            // Filter name LIKE by q
            if (q != undefined && !!q) {
                query.andWhere(function () {
                    this.orWhereRaw('LOWER(name) LIKE ?', `%${q.toLowerCase()}%`)
                })
            }
                
            // Response data - success
            await query
                .select('id', 'name', 'status', 'email', 'photo')
                .orderBy('name')
                .then((data) => {
                    res.send({
                        data
                    })
            })

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user.index.nok',
                error: err
            })

        }
        
    },

    // Show
    async show(req, res) {

        // Get id in the params
        const { id } = req.params

        try {

            // Get user where id - SELECT WHERE
            const user = await knex
                .select(
                'id',
                'name',
                'email'
                )
                .from('users')
                .where({ id })
                .first()

            // Response data - success
            return res.send(user)

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user.show.nok'
            })

        }
    },

    // Create
    async create(req, res, next) {

        // Get body in the request
        const {
            name,
            email,
            password = "root"
        } = req.body

        try {

            // Create data in table - INSERT VALUES
            const [data] = await knex('users')
                .insert({
                name,
                email,
                password: bcrypt.hashSync(password, Number(process.env.SALT))
            }).returning('id')

            // Response data - success
            res.send({ data, message: 'user.create.ok' })
            next()

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user.create.nok',
                detail: {
                    code: err.code,
                    message: err.detail,
                    constraint: err.constraint?.replaceAll('_', '.')
                }
            })

        }

    },

    // External Create
    async externalCreate(req, res, next) {

        // Get body in the request
        const {
            name,
            email,
            password
        } = req.body

        const photo = req.file ? req.file.filename : null;

        try {

            // Create data in table - INSERT VALUES
            const [data] = await knex('users')
                .insert({
                name,
                email,
                password: bcrypt.hashSync(password, Number(process.env.SALT)),
                photo
            }).returning('id')

            // Response data - success
            res.send({ data, message: 'user.create.ok' })

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user.create.nok',
                detail: {
                    code: err.code,
                    message: err.detail,
                    constraint: err.constraint?.replaceAll('_', '.')
                }
            })

        }

    },

    // Update
    async update(req, res) {

        // Get id in the params
        const { id } = req.params

        // Get body in the request
        const {
            name,
            email,
            status,
            password
        } = req.body

        try {

            // Update data in table where id - UPDATE SET WHERE
            await knex('users')
                .update({
                    name,
                    email,
                    status,
                    password
                })
                .where({ id })
            
            // Response data - success
            return res.send({ message: 'user.update.ok' })

        } catch (err) {

            // Response data - error
            return res.status(400).json({
                message: 'user.update.nok',
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
            await knex('users').where({ id }).del()

            // Response data - success
            return res.send({
                message: 'user.delete.ok'
            })

        } catch (err) {

            // Response data - error
            return res.status(400).send({
                message: 'user.delete.nok'
            })

        }
    }

}
