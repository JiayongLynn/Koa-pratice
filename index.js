const path = require('path');
//引入koa
const Koa = require("koa");
//koa-router
const KoaRouter = require("koa-router");
//koa-static-cache
const KoaStaticCache = require("koa-static-cache");
// 自己封装一个渲染模板的中间件
const render = require('./middlewares/render')
const data  = require('./data/data.json')
const app = new Koa();

const router = new KoaRouter();
//使用该中间件
app.use(render('views'));

app.use(KoaStaticCache('./static',{
    prefix:'/static'
}))

app.use(async(ctx,next)=>{
    try{
        await next();
        if(!ctx.body && ctx.req.url!='/favicon.ico'){
            ctx.redirect("/404");
            //重定向
        }
    }catch(error){
        console.log(error);
        ctx.status = 500;
        ctx.body = '出错了';
    }
})

router.get('/',ctx=>{
    let page = ctx.query.page || 1;
    let total = data.length;
    const perpage = 5;
    const start = (page - 1) * perpage;
    const end = start + perpage;
    const pageTotal = Math.ceil(total/perpage);
    let renderData = data.slice(start,end);
    let nextPage = page + 1;
    let prePage = page - 1;
    ctx.render('index.html',{
        'title':'首页',
        renderData,
        page,
        pageTotal,
        nextPage,
        prePage
    });
})

router.get('/detail/:id(\\d+)',ctx=>{
    let id  = Number(ctx.params.id);
    let detail = data.find(item=>{
        return item.id == id;
    })
    ctx.render('detail.html',{
        detail
    });
})

router.get('/404',ctx=>{
    ctx.render('404.html');
})

app.use(router.routes());

app.listen(3000);