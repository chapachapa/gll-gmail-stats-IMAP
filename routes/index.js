var express = require('express');
var Imap = require('imap');
var inspect = require('util').inspect;
var router = express.Router();
var userInfo = require('../login');
var imap = new Imap(userInfo);


/*var status = {
  total: 0,
  unread: 0,
  attach: 0,
  type: {},
  ready: false
};*/

function status(){
  this.total = 0;
  this.unread = 0;
  this.attach = 0;
  this.type = 0;
  this.ready = false;
}

var statusBatch = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  //getStatus();
  res.render('index', { title: 'Express'});
});

router.get('/imap/getData', function(req, res){
  console.log(statusBatch);
  if(statusBatch['1234ABCD'].ready){
    res.status(200).json(statusBatch['1234ABCD']);
  } else {
    res.status(204).json({});
  }
});

router.get('/imap', function(req, res){
  getStatus('1234ABCD');
  res.status(202).json({message: 'processing!!'});
});


function getStatus(id){
  statusBatch[id] = new status;

  console.log('inside');
  imap.once('ready', function(){
    imap.openBox('INBOX',true, function(err, box){
      console.log(box);
      imap.search(['UNSEEN'], function(err, result){
        console.log('you have '+ result.length + ' unread messages');
        statusBatch[id].unread = result.length;
      });
      imap.search(['ALL'], function(err, result){
        if (err) throw err;
        console.log('you have '+ result.length + ' total messages');
        statusBatch[id].total = result.length;

        var f = imap.fetch(result, { bodies: [''], struct: true});
        var counter = 0;

        searchInF(f);
        var prom = new Promise(function(resolve, reject){
          var inter = setInterval(function(){
            if(counter === statusBatch[id].total){
              statusBatch[id].ready = true;
              console.log('DONE with', id);
              resolve();
              clearInterval(inter);
            } else {
              console.log('not done yet', counter, statusBatch[id].total);
            }
          }, 5000);
        });

        prom.then(function(){
          statusBatch[id].ready = true;
          console.log('status is ready now!', id);
        });

        //searchInF(f);

        function searchInF(fetched){
          fetched.on('message', function(msg, seqno) {
            //console.log('got message for seqno: ', seqno);
            msg.once('attributes', function(attrs){
              /*msg.on('body', function(stream, info) {
               //console.log('Body');
               });*/
              //console.log('Attributes: %s', inspect(attrs, false, 8));
              if(typeof attrs.struct[2] !== 'undefined') {
                t = attrs.struct[2];
                if(t[0].disposition.type === 'ATTACHMENT') {
                  //console.log('stop here' + attrs.struct[2]);
                  statusBatch[id].attach++;

                  if(typeof statusBatch[id].type[t[0].subtype] !== 'undefined'){
                    statusBatch[id].type[t[0].subtype]++;
                  } else {
                    statusBatch[id].type[t[0].subtype] = 1;
                  }

                  // assuming everything is done at this point.
                  // might not be correct.
                  console.log(statusBatch[id]);
                }
              }
            });

            counter++;
          });
        }
      });
    });
  });

  imap.connect();
}

/*function getIMap(){

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.once('ready', function(){
    openInbox(function(err, box){

      console.log(box.messages.total);

      var f = imap.seq.fetch('1:100', {

      });


      /!*f.search(['SEEN', 'UNSEEN'], function(err, box){
        //console.lo
      })*!/
    });
  });

  /!*imap.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      var f = imap.seq.fetch('1:3', {
        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        struct: true
      });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', function() {
            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
          });
        });
        msg.once('attributes', function(attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });*!/

  imap.once('error', function(err) {
    console.log(err);
  });

  imap.once('end', function() {
    console.log('Connection ended');
  });

  imap.connect();
}*/

module.exports = router;
