const Users = require('../models/userModel')
const bcrypt = require('bcrypt')

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body

            const user = await Users.findOne({ email })

            if (user) 
            return res.status(400).json({ msg: 'The email is already exists.' })

            if (password.length < 6) 
            return res.status(400).json({ msg: 'Password need 6 character.' })

            const hashPW = await bcrypt.hash(password, 10)

            const newUser = new Users({
                name,
                email,
                password: hashPW
            })

            await newUser.save()

            res.json({ msg: 'Register successfully' })
            // res.json({ password, hashPW })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })

            if (!user)
                return res.status(400).json({ msg: 'The email is not existed' })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch)
                return res.status(400).json({ msg: "Password does not correct" })

            return res.json({
                msg:`Login successfully as ${email}`,
                result: user._id,
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }ß
    },
}

module.exports = userCtrl