'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {

    // async create(ctx) {
    //     let entity;
    //     const user = ctx.state.user;
    //     console.log('user => ', user);
       
    //     if (!user) {
    //         return ctx.request(null, [{ messages: [{ id: 'No authorization' }] }])
    //     }

    //     if (ctx.is('multipart')) {
    //         const { data, files } = parseMultipartData(ctx);
    //         data['user'] = user;
    //         entity = await strapi.services.post.create({ ...data, author: user.id }, { files });
    //     } else {
    //         const data = ctx.request.body;
    //         entity = await strapi.services.post.create({ ...data, author: user.id });
    //     }
    //     return sanitizeEntity(entity, { model: strapi.models.post });
    // },

    async me(ctx) {
        const user = ctx.state.user;
    
        if (!user) {
          return ctx.badRequest(null, [
            { messages: [{ id: "No authorization header was found" }] },
          ]);
        }
    
        const data = await strapi.services.post.find({ user: user.id });
    
        if (!data) {
          return ctx.notFound();
        }
    
        return sanitizeEntity(data, { model: strapi.models.post });
      },
};