const Router = require('koa-router');
const router = new Router();

router.get('/', async (ctx) => {
    ctx.body = `<h1>welcome hxz</h1>`;
})



router.get("/getLic",function(ctx,next){
    ctx.body = {bol:true};
});


module.exports = router;