import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

const createPostForUser = async (authorId, data) => {
    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ id }')
    const user = await prisma.query.user({
        where: {
            id: authorId
        }
    }, '{ id name email posts { id title published } }')
    return user
}

// createPostForUser('cjy2kzgtk00a00971tbz7h5s5', {
//     title: 'The book you should read',
//     body: 'Sexy writing',
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// })

const updatePostForUser = async (postId, data) => {
    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    }, '{ author { id } }')
    const user = await prisma.query.user({
        where: {
            id: post.author.id
        }
    }, '{ id name email posts { id title published } }')
    return user
}

// updatePostForUser("cjjzwjkez009p0822fbvn6lui", { published: false }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
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