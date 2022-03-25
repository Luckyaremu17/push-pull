import client from "./redis";
import redis from "../modules/mails/controllers";


const redis = require('redis')
const client = redis.createClient()
const cron = require('node-cron');
var mysql = require('mysql');


cron.schedule('0 * /6  * * *', function() {
  console.log('Process running every 6 hours');

  client.keys('*', (err, key) => {
    if (key != '') {

      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "redistest"
      });

      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to MySQL!");
      });

      // redis isi
    let return_dataset = []
    let multi = client.multi()
    let keys = Object.keys(key)
    let i = 0

    keys.forEach( (l) => {
      client.hgetall(key[l], (e, o) => {
        // i++
        if (e) {console.log(e)} else {
          temp_data = Object.values(o);
          
          var sql = "INSERT INTO `desc` (message, email) VALUES (?)";

          con.query(sql, [temp_data], function (err) {
            if (err) throw err;
            console.log("record inserted");

          client.flushdb( function (err, succeeded) {
            console.log(succeeded + ' flush redis');
        });
          });

        }

      })
    })
    // redis end

    } else {
      // kalo redis kosong
	  console.log(sucess)
    }
  })
  
 });


module.exports = mysql
