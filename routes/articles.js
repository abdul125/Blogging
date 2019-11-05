var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var monk  = require('monk');
var db = monk('localhost:27017/Team22-HW4');
var ObjectId = require('mongodb').ObjectId;

router.get('/', function(req, res){
    console.log("articles get");
    var collection = db.get('articles');
    collection.find({}, function(err, articles){
        if (err) throw err;
        res.json(articles);
    });
});

router.post('/', function(req, res) {
    console.log("articles post");
    var collection = db.get('articles');
    collection.insert({
        title: req.body.Title,
        URL: req.body.URL,
        votes: 0,
        user: req.body.Username,
        comments: [{}]
    }, function(err, article){
        if (err) throw err;
        res.json(article);
    });
});

/*
********************************************************************************************
* This is the beginning of the /:articleid section
********************************************************************************************
*/

router.get('/:articleid', function(req, res){
    var a_id = req.params.articleid;
    var collection = db.get('articles');
    collection.findOne({"_id" : new ObjectId(a_id)}, function(err,article){
        if (err) throw err;
        res.json(article);
    });
});

router.delete('/:articleid', function(req, res){
    var collection = db.get('articles');
    collection.remove({"_id" : new ObjectId(req.params.articleid)}, function(err, article){
        if (err) throw err;
    });
});

router.post('/:articleid', function(req, res){
    var collection = db.get('articles');
    var time = dateTime.create().format('m/d/Y H:M:S');
    console.log(time);
    collection.findOneAndUpdate({"_id" : new ObjectId(req.params.articleid)}, {
        $push: {
          comments: { commentid: new ObjectId(), user: req.body.username, date: time, votes: 0, body: req.body.comments}
        }
      }, {new:true}, function(err, article){
        if (err) throw err;
        res.json(article); 
    });
});

router.put('/:articleid/add', function(req, res){
    var collection = db.get('articles');
    collection.findOneAndUpdate({"_id" : new ObjectId(req.params.articleid)}, { $inc: { votes: 1 } }, {new:true}, function(err, article){
        if (err) throw err;
        res.json(article);
    });
});

router.put('/:articleid/sub', function(req, res){
    var collection = db.get('articles');
    collection.findOneAndUpdate({"_id" : new ObjectId(req.params.articleid)}, { $inc: { votes: -1 } }, {new:true}, function(err, article){
        if (err) throw err;
        res.json(article);
    });
});

/*
********************************************************************************************
* This is the beginning of the /:articleid/:commentid section
********************************************************************************************
*/
router.delete('/:articleid/:commentid', function(req, res){
    console.log('/:articleid/:commentid DELETE called');
    console.log(req.params.articleid);
    console.log(req.params.commentid);
    var collection = db.get('articles');
    collection.findOneAndUpdate({"_id": new ObjectId(req.params.articleid)},{$pull:{"comments" : {"commentid" : new ObjectId(req.params.commentid) } } }, function(err, article){
        if (err) throw err;
        res.json(article);
    });
});

router.put('/:articleid/:commentid/add', function(req, res){
    console.log('/:articleid/:commentid/add');
    var collection = db.get('articles');
    collection.findOneAndUpdate({"_id": new ObjectId(req.params.articleid) , "comments.commentid" : new ObjectId(req.params.commentid)},
    {"$inc" : {"comments.$.votes" : 1}}, function(err,article){
        if (err) throw err;
        res.json(article);
    });
});

router.put('/:articleid/:commentid/sub', function(req, res){
    console.log('/:articleid/:commentid/sub');
    var collection = db.get('articles');
    collection.findOneAndUpdate({"_id": new ObjectId(req.params.articleid) , "comments.commentid" : new ObjectId(req.params.commentid)},
    {"$inc" : {"comments.$.votes" : -1}}, function(err,article){
        if (err) throw err;
        res.json(article);
    });
});


module.exports = router;
