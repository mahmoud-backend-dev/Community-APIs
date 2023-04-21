const { param } = require('express-validator');
const { BadRequest } = require('../../errors');
const validationMiddleWare = require('../../middleware/validatorMiddleware');
const Post = require('../../models/Post');


exports.getSpecificDocValidator = [
  param('id')
    .custom(async (val) => {
      const post = await Post.findById(val);
      if (!post)
        throw new BadRequest(`No such post for this id: ${val}`)
    }),
  validationMiddleWare
]