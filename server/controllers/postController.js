const { getPrisma } = require('../lib/prisma')

const getAllPosts = async (req, res) => {
    try {
        const prisma = await getPrisma()
        const posts = await prisma.post.findMany()
        res.json(posts)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts', detail: error.message })
    }
}

const getPostById = async (req, res) => {
    try {
        const prisma = await getPrisma()
        const post = await prisma.post.findUnique({
            where: { id: req.params.id }
        })

        if (!post) return res.status(404).json({ error: 'Post not found' })

        res.json(post)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post', detail: error.message })
    }
}

const createPost = async (req, res) => {
    try {
        const prisma = await getPrisma()
        const { title, content } = req.body

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' })
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: req.user.userId
            }
        })

        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post', detail: error.message })
    }
}

const getMyPosts = async (req, res) => {
    try {
        const prisma = await getPrisma()
        const posts = await prisma.post.findMany({
            where: { authorId: req.user.userId },
            orderBy: { createdAt: 'desc' }
        })
        res.json(posts)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user posts', detail: error.message })
    }
}

const updatePost = async (req, res) => {
    try {
        const prisma = await getPrisma()
        const { title, content } = req.body

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' })
        }

        const post = await prisma.post.findUnique({
            where: { id: req.params.id }
        })

        if (!post) {
            return res.status(404).json({ error: 'Post not found' })
        }

        if (post.authorId !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized to update this post' })
        }

        const updatedPost = await prisma.post.update({
            where: { id: req.params.id },
            data: { title, content }
        })

        res.json(updatedPost)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post', detail: error.message })
    }
}

const deletePost = async (req, res) => {
    try {
        const prisma = await getPrisma()

        const post = await prisma.post.findUnique({
            where: { id: req.params.id }
        })

        if (!post) {
            return res.status(404).json({ error: 'Post not found' })
        }

        if (post.authorId !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized to delete this post' })
        }

        await prisma.post.delete({
            where: { id: req.params.id }
        })

        res.json({ message: 'Post deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post', detail: error.message })
    }
}

module.exports = { getAllPosts, getPostById, createPost, getMyPosts, updatePost, deletePost }
