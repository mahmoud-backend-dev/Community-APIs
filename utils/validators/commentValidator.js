const { param,body } = require('express-validator');
const { BadRequest } = require('../../errors');
const validationMiddleWare = require('../../middleware/validatorMiddleware');
const Comment = require('../../models/Comment');

exports.addCommentValidator = [
  body('text').notEmpty().withMessage('Text Required'),
  validationMiddleWare
];


exports.getSpecificCommentIdValidator = [
  param('commentId')
    .custom(async (val) => {
      const comment = await Comment.findById(val)
      if (!comment)
        throw new BadRequest(`No such comment for this id: ${val}`)
    }),
  validationMiddleWare,
]