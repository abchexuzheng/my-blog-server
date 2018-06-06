const userModel = require('../lib/mysql.js');
const moment = require('moment');
const checkNotLogin = require('../middlewares/check.js').checkNotLogin;
const checkLogin = require('../middlewares/check.js').checkLogin;
const md = require('markdown-it')();

/**
 * 发表文章
 */
exports.articleCreate = async ctx => {
    let {title,content} = ctx.request.body,
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        newContent = content.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        }),
        newTitle = title.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });
    await userModel.insertArticle([newTitle, newContent,time])
        .then(() => {
            ctx.body = {
                code:200,
                message:'发表文章成功'
            }
        }).catch(() => {
            ctx.body = {
                code: 500,
                message: '发表文章失败'
            }
        })
}


/**
 * 文章页
 */
exports.getArticle = async ctx => {
    let res,
        postsLength,
        name = decodeURIComponent(ctx.request.querystring.split('=')[1]);
    if (ctx.request.querystring) {
        await userModel.findDataByUser(name)
            .then(result => {
                postsLength = result.length
            })
        await userModel.findPostByUserPage(name, 1)
            .then(result => {
                res = result
            })
        await ctx.render('selfPosts', {
            session: ctx.session,
            posts: res,
            postsPageLength: Math.ceil(postsLength / 10),
        })
    } else {
        await userModel.findArticleByPage(1)
            .then(result => {
                res = result
            })
        await userModel.findAllArticle()
            .then(result => {
                postsLength = result.length
            })
            .then(()=>{
                ctx.body={
                    posts: res,
                    postsLength: postsLength,
                    postsPageLength: Math.ceil(postsLength / 10),
                }
            })
        //await ctx.render('posts', {
        //    posts: res,
        //    postsLength: postsLength,
        //    postsPageLength: Math.ceil(postsLength / 10),
        //})
    }
}