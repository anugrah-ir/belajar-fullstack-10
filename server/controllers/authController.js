const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getPrisma } = require('../lib/prisma')

const register = async (req, res) => {
    try {
        const prisma = await getPrisma()
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })

        res.status(201).json({ message: 'User registered successfully', token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

const login = async (req, res) => {
    try {
        const prisma = await getPrisma()
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })

        res.status(200).json({ message: 'Login successful', token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

module.exports = {
    register,
    login,
}
