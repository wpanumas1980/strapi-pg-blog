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

  //Create post with linked user

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.post.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.post.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  //Update user post
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [post] = await strapi.services.post.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!post) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.post.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.post.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.post });
  },

   // Delete a user post
   async delete(ctx) {
    const { id } = ctx.params;

    const [post] = await strapi.services.post.find({
      id: ctx.params.id,
      "user.id": ctx.state.user.id,
    });

    if (!post) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.post.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  // Get me data

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