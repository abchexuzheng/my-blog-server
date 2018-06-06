const Router = require('koa-router');
const router = new Router();
const controller = require('../controller/c-article')


//发布文章
router.post('/article/createArticle',controller.articleCreate);
//获取文章列表
router.get('/article/articleList',controller.getArticle);



module.exports = router;