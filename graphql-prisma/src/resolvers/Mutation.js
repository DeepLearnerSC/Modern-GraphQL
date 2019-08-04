// import uuidv4 from 'uuid/v4'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'


const Mutation = {
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },
    async createUser(parent, args, { prisma }, info) {
        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer.')
        }

        const password = await bcrypt.hash(args.data.password, 10)
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },

    // version 2ß
    // async createUser(parent, args, { prisma }, info) {
    //     const emailTaken = await prisma.exists.User({ email: args.data.email })

    //     if (emailTaken) {
    //         throw new Error('Email taken')
    //     }

    //     return prisma.mutation.createUser({ data: args.data }, info)
    // },

    //db
    // createUser(parent, args, { db }, info) {
    //     const emailTaken = db.users.some((user) => user.email === args.data.email)

    //     if (emailTaken) {
    //         throw new Error('Email taken')
    //     }

    //     const user = {
    //         id: uuidv4(),
    //         ...args.data
    //         // name: args.name,
    //         // email: args.email,
    //         // age: args.age
    //     }

    //     db.users.push(user)

    //     return user
    // },

    async deleteUser(parent, args, { prisma }, info) {
        return prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info)
    },
    // async deleteUser(parent, args, { prisma }, info) {
    //     const userExists = await prisma.exists.User({ id: args.id })

    //     if (!userExists) {
    //         throw new Error('User not found')
    //     }

    //     return prisma.mutation.deleteUser({
    //         where: {
    //             id: args.id
    //         }
    //     }, info)
    // },
    // deleteUser(parent, args, { db }, info) {
    //     const userIndex = db.users.findIndex((user) => user.id === args.id)

    //     if (userIndex === -1) {
    //         throw new Error('User not found')
    //     }

    //     const deletedUsers = db.users.splice(userIndex, 1)

    //     db.posts = db.posts.filter((post) => {
    //         const match = post.author === args.id

    //         if (match) {
    //             db.comments = db.comments.filter((comment) => comment.post !== post.id)
    //         }

    //         return !match
    //     })
    //     db.comments = db.comments.filter((comment) => comment.author !== args.id)

    //     return deletedUsers[0]
    // },

    async updateUser(parent, args, { prisma }, info) {
        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },

    // updateUser(parent, args, { db }, info) {
    //     const { id, data } = args
    //     const user = db.users.find((user) => user.id === id)

    //     if (!user) {
    //         throw new Error('User not found')
    //     }

    //     if (typeof data.email === 'string') {
    //         const emailTaken = db.users.some((user) => user.email === data.email)

    //         if (emailTaken) {
    //             throw new Error('Email taken')
    //         }

    //         user.email = data.email
    //     }

    //     if (typeof data.name === 'string') {
    //         user.name = data.name
    //     }

    //     if (typeof data.age !== 'undefined') {
    //         user.age = data.age
    //     }

    //     return user
    // },

    //POST
    createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
    // createPost(parent, args, { db, pubsub }, info) {
    //     const userExists = db.users.some((user) => user.id === args.data.author)

    //     if (!userExists) {
    //         throw new Error('User not found')
    //     }

    //     const post = {
    //         id: uuidv4(),
    //         ...args.data
    //         // title: args.title,
    //         // body: args.body,
    //         // published: args.published,
    //         // author: args.author
    //     }

    //     db.posts.push(post)

    //     if (args.data.published) {
    //         pubsub.publish('post', { 
    //             post: {
    //                 mutation: 'CREATED',
    //                 data: post
    //             }
    //         })
    //     }

    //     return post
    // },

    deletePost(parent, args, { prisma }, info) {
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },

    // deletePost(parent, args, { db }, info) {
    //     const postIndex = db.posts.findIndex((post) => post.id === args.id)

    //     if (postIndex === -1) {
    //         throw new Error('Post not found')
    //     }

    //     // const deletedPosts = db.posts.splice(postIndex, 1)
    //     const [post] = db.posts.splice(postIndex, 1)

    //     db.comments = db.comments.filter((comment) => comment.post !== args.id)

    //     if (post.published) {
    //         pubsub.publish('post', {
    //             post: {
    //                 mutation: 'DELETED',
    //                 data: post
    //             }
    //         })
    //     }

    //     return post
    // },

    updatePost(parent, args, { prisma }, info) {
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },

    // updatePost(parent, args, { db }, info) {
    //     const { id, data } = args
    //     const post = db.posts.find((post) => post.id === id)
    //     const originalPost = { ...post }

    //     if (!post) {
    //         throw new Error('Post not found')
    //     }

    //     if (typeof data.title === 'string') {
    //         post.title = data.title
    //     }

    //     if (typeof data.body === 'string') {
    //         post.body = data.body
    //     }

    //     if (typeof data.published === 'boolean') {
    //         post.published = data.published

    //         if (originalPost.published && !post.published) {
    //             pubsub.publish('post', {
    //                 post: {
    //                     mutation: 'DELETED',
    //                     data: originalPost
    //                 }
    //             })
    //         } else if (!originalPost.published && post.published) {
    //             pubsub.publish('post', {
    //                 post: {
    //                     mutation: 'CREATED',
    //                     data: post
    //                 }
    //             })
    //         }
    //     } else if (post.published) {
    //         pubsub.publish('post', {
    //             post: {
    //                 mutation: 'UPDATED',
    //                 data: post
    //             }
    //         })
    //     }

    //     return post
    // },

    createComment(parent, args, { prisma }, info) {
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },

    // createComment(parent, args, { db, pubsub }, info) {
    //     const userExists = db.users.some((user) => user.id === args.data.author)
    //     const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

    //     if (!userExists || !postExists) {
    //         throw new Error('Unable to find user and post')
    //     }

    //     const comment = {
    //         id: uuidv4(),
    //         ...args.data
    //         // text: args.text,
    //         // author: args.author,
    //         // post: args.post
            
    //     }

    //     db.comments.push(comment)
    //     pubsub.publish(`comment ${args.data.post}`, { 
    //         comment: {
    //             mutation: 'CREATED',
    //             data: comment
    //         }
    //     })

    //     return comment
    // },

    deleteComment(parent, args, { prisma }, info) {
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },

    // deleteComment(parent, args, { db, pubsub }, info) {
    //     const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

    //     if (commentIndex === -1) {
    //         throw new Error('Comment not found')
    //     }

    //     const [deletedComment] = db.comments.splice(commentIndex, 1)
    //     pubsub.publish(`comment ${deletedComment.post}`, {
    //         comment: {
    //             mutation: 'DELETED',
    //             data: deletedComment
    //         }
    //     })

    //     return deletedComments[0]
    // },

    updateComment(parent, args, { prisma }, info) {
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },

    // updateComment(parent, args, { db, pubsub }, info) {
    //     const { id, data } = args
    //     const comment = db.comments.find((comment) => comment.id === id)

    //     if (!comment) {
    //         throw new Error('Comment not found')
    //     }

    //     if (typeof data.text === 'string') {
    //         comment.text = data.text
    //     }

    //     pubsub.publish(`comment ${comment.post}`, {
    //         comment: {
    //             mutation: 'UPDATED',
    //             data: comment
    //         }
    //     })

    //     return comment
    // }
}

export { Mutation as default }