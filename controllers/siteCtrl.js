const Sites = require('../models/siteModel')
const Users = require('../models/userModel')

class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const queryObj = { ...this.queryString } // = req.query

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(ex => delete (queryObj[ex]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        this.query.find(JSON.parse(queryStr))
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')

            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort('-createdAt')
        }

        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 20
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

const siteCtrl = {
    registerNewSite: async (req, res) => {
        try {
            const { name, lat, lng, leader, description, address } = req.body

            const user = await Users.findById({ _id: leader })

            if (!user)
                return res.json({ msg: "User does not exist." })

            if (name === "" || lat === "" || lng === "" || leader === "" || address === "")
                return res.json({ msg: "Please fill all the requirement." })

            const newSite = new Sites({
                name,
                lat,
                lng,
                leader,
                description,
                address
            })

            await newSite.save()
            await Users.findByIdAndUpdate({ _id: leader }, { role: 1 })

            return res.json({ msg: `Site has been created. You are now the leader of ${name}` })
        } catch (error) {
            return res.json({ msg: error.message })
        }
    },

    joinTheSite: async (req, res) => {
        try {
            const { listofpeople } = req.body

            const site = await Sites.findById({ _id: req.params.id })

            let array = site.listofpeople

            for (let i = 0; i < array.length; i++) {
                if (JSON.stringify(listofpeople) === JSON.stringify(array[i])) {
                    return res.json({ msg: `This account has already joined ${site.name}` })
                }
            }

            array = JSON.stringify([...array, listofpeople])

            await Sites.findByIdAndUpdate({ _id: req.params.id }, { listofpeople: JSON.parse(array) })

            res.json({ msg: `Successfully join ${site.name}` })
        } catch (error) {
            return res.json({ msg: error.message })
        }
    },

    updateNumberOfTested: async (req, res) => {
        try {
            const { numberoftested } = req.body

            const site = await Sites.findById({ _id: req.params.id })

            await Sites.findByIdAndUpdate({ _id: req.params.id }, { numberoftested })

            res.json({ msg: `Successfully update number of tested people on ${site.name}` })
        } catch (error) {
            return res.json({ msg: error.message });
        }
    },

    updateNotification: async (req, res) => {
        try {
            const { notification } = req.body

            const site = await Sites.findById({ _id: req.params.id })

            await Sites.findByIdAndUpdate({ _id: req.params.id }, { notification })

            res.json({ msg: `Sending notification to members in ${site.name}` })
        } catch (error) {
            return res.json({ msg: error.message });
        }
    },
    
    getAllInfoSite: async (req, res) => {
        try {
            const info = await Sites.findById({ _id: req.params.id })
                .populate({ path: "leader", select: "-__v -createdAt -updatedAt -password" })
                .populate({ path: "listofpeople", select: "-__v -createdAt -updatedAt -password" })

            if (!info)
                return res.json({ msg: "NOT FOUND." })

            return res.json(info)

        } catch (error) {
            return res.json({ msg: error.message })
        }
    },

    getAllSites: async (req, res) => {
        try {
            const feature = new APIfeatures(Sites.find()
                .populate({ path: "leader", select: "-__v -createdAt -updatedAt -password" })
                .populate({ path: "listofpeople", select: "-__v -createdAt -updatedAt -password" }), req.query)
                .filter().sort().paginate()

            const sites = await feature.query;

            return res.json(sites)
        } catch (error) {
            return res.json({ msg: error.message })
        }
    }
}

module.exports = siteCtrl
