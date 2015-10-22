/*
Concept管理api。
v1.0.0
目标：
1. 实现Concept的创建、删除、获取
2. 实现Concept的name和desc的增加、删除、获取
3. 任何Concept的数据都将是完全公开的（相对于调用api的服务）。
*/

var express = require('express'),
    router = express.Router();
var config = require('../../config/config');
var Middleware = require('nagu-concepts').Middleware;

module.exports = function (app, cfg) {
    app.use('/concepts', router);
};

var M = new Middleware(config.neo_url);
/*
通用中间件，将执行结果以json的方式返回客户端。
*/
var sendConcept = function(req, res, next){
    if(res.err){
        res.send({ret: -1, msg: res.err});
    } else {
        res.send({ret: 0, data: {
            id: res.concept.id,
            labels: res.concept.labels,
            properties: res.concept.properties,
            names: res.concept.nameList || [],
            descs: res.concept.descList || []
        }});
    }
};

var prepareId = function(req, res, next){
    req.concept = {
        id: req.params.id
    };
    next();
};

var endIfError = function(req, res, next){
    if(res.err) res.send({ret: -1, msg: res.err});
    else next();
};

/*
获取指定id的Concept
*/
router.get('/:id', prepareId, M.getOne(), endIfError, M.names(), M.descs(), sendConcept);


/*
根据名称查找Concept
*/
router.get('/by-name/:name', function(req, res, next){
    req.concept = {
        name: req.params.name
    };
    next();
}, M.findByName(), function(req, res, next){
    if(res.err) res.send({ret: -1, msg: res.err});
    else res.send({ ret: 0, data: res.conceptList});
});


/*
创建Concept
*/
router.put('/', M.addNew(), 
    function(req, res, next){
        req.concept.name = req.body.name;
        req.concept.desc = req.body.desc;
        req.concept.data = {creator: req.body.creator};
        next();
    }, M.addName(), M.addDesc(), sendConcept);


/*
删除指定id的Concept
*/
router.delete('/:id', prepareId, M.del(), function(req, res, next){
    if(res.err){
        res.send({ret: -1, msg: res.err});
    } else {
        res.send({ret: 0, data: {}});
    }
});
    
/*
为Concept添加name
*/
router.put('/:id/name', prepareId, function(req, res, next){
    req.concept.name = req.body.name;
    req.concept.data = {
        creator: req.body.creator,
        dateCreated: new Date()
    };
    next();
}, M.addName(), sendConcept);

/*
为Concept删除一个name
*/
router.delete('/:id/name', prepareId, function(req, res, next){
    req.concept.name = req.body.name;
    req.concept.data = {
        creator: req.body.creator
    };
    next();
}, M.removeName(), sendConcept);

/*
为Concept添加desc
*/
router.put('/:id/desc', prepareId, function(req, res, next){
    req.concept.desc = req.body.desc;
    req.concept.data = {
        creator: req.body.creator,
        dateCreated: new Date()
    };
    next();
}, M.addDesc(), sendConcept);

/*
为Concept删除一个desc
*/
router.delete('/:id/desc', prepareId, function(req, res, next){
    req.concept.desc = req.body.desc,
    req.concept.data = {
        creator: req.body.creator
    };
    next();
}, M.removeDesc(), sendConcept);