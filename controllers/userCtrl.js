const Users = require('../models/userModel')
const bcrypt = require('bcrypt')

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body

            const user = await Users.findOne({ email })

            if (user)
                return res.json({ msg: 'The email is already exists.' })

            if (password.length < 6)
                return res.json({ msg: 'Password need 6 character.' })

            if (!name)
                return res.json({ msg: 'Please fill all the requirement.' })

            const hashPW = await bcrypt.hash(password, 10)

            const newUser = new Users({
                name,
                email,
                password: hashPW
            })

            await newUser.save()

            return res.json({ msg: 'Register successfully' })

        } catch (error) {
            return res.json({ msg: error.message })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })

            if (!user)
                return res.json({ msg: 'The email is not existed' })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch)
                return res.json({ msg: "Password does not correct" })

            return res.json({
                msg: `Login successfully as ${email}`,
                data: user,
            })

        } catch (error) {
            return res.json({ msg: error.message })
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await Users.findById({ _id: req.params.id })

            if (!user)
                return res.json({ msg: 'User does not exist.' })

            return res.json(user)

        } catch (error) {
            return res.json({ msg: error.message })
        }
    }
}

module.exports = userCtrl
