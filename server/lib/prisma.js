const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../generated/prisma')

let prisma

async function getPrisma() {
    if (!prisma) {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL })
        const adapter = new PrismaPg(pool)
        prisma = new PrismaClient({ adapter })
    }
    return prisma
}

module.exports = { getPrisma }
