import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})

export { prisma as default }

// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({ id: authorId })

//     if (!userExists) {
//         throw new Error('User not found')
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ author { id name email posts { id title published } } }')

//     return post.author
// }

// createPostForUser('cjy2kzgtk00a00971tbz7h5s5', {
//     title: 'The book you should read',
//     body: 'Sexy writing',
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({ id: postId })

//     if (!postExists) {
//         throw new Error('Post not found')
//     }

//     const post = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data
//     }, '{ author { id name email posts { id title published } } }')
    
//     return post.author
// }

// updatePostForUser("cjjzwjkez009p0822fbvn6lui", { published: false }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })

// prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.createPost({
//     data: {
//         title: "Twice",
//         body: "",
//         published: false,
//         author: {
//             connect: {
//                 id: "cjy2kzgtk00a00971tbz7h5s5"
//             }
//         }
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(data)
//     return prisma.query.users(null, '{ id name email posts { id title } }')
// }).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.updatePost({
//     where: {
//         id: "cjy2mfpcj00gy0971iwlops8i"
//     },
//     data: {
//         body: "Udating Se-jungs info!!",
//         published: true
//     }
// }, '{ id }').then((data) => {
//     return prisma.query.posts(null, '{ id title body published }')
// }).then((data) => {
//     console.log(data)
// })