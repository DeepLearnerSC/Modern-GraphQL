const Subscription = {
    // count: {
    //     subscribe(parent, args, { pubsub }, info) {
    //         let count = 0

    //         setInterval(() => {
    //             count++
    //             pubsub.publish('count', {
    //                 count
    //             })
    //         }, 1000)

    //         return pubsub.asyncIterator('count')
    //     }
    // },
    comment: {
        subscribe(parent, { postId }, { prisma }, info){
            return prisma.subscription.comment({
                where: {
                    node: {
                        post: {
                            id: postId
                        }
                    }
                }
            }, info)
        }
    },

    // comment: {
    //     subscribe(parent, { postId }, { db, pubsub }, info){
    //         const post = db.posts.find((post) => post.id === postId && post.published)

    //         if (!post) {
    //             throw new Error('Post not found')
    //         }

    //         return pubsub.asyncIterator(`comment ${postId}`)
    //     }
    // },
    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
                where: {
                    node: {
                        published: true
                    }
                }
            }, info)
        }
    }
    // post: {
    //     subscribe(parent, args, { pubsub }, info) {
    //         return pubsub.asyncIterator('post')
    //     }
    // }
}

export { Subscription as default }