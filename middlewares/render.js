// 用于使用nunjucks模板引擎渲染页面
const nunjucks = require('nunjucks');

module.exports = function(path){
    // 初始化nunjucks
    const tpl = new nunjucks.Environment(new nunjucks.FileSystemLoader(path,{
        watch: true,
        noCache:true
    }));
    return async function(ctx,next){
        // render是自己定义的函数
        ctx.render = function(filename,data){
            ctx.body = tpl.render(filename,data);
        };
        // 不要漏掉了
        await next();
    }
}