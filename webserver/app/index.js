const postImageApi = require('./api/post_image_api');
const express = require('express'); 
const fileUpload = require('express-fileupload');
const uuidv4 = require('uuid/v4');
const app = express();
app.use(fileUpload());
const amqp = require('amqplib/callback_api');
const Redis = require('ioredis');
const REDIS_HOST = process.env.REDIS_HOST;
//By default, ioredis will try to reconnect when the connection to Redis is lost except 
//when the connection is closed manually by redis.disconnect() or redis.quit().
const redis = new Redis(REDIS_HOST);
const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
const queueName = process.env.QUEUE_NAME;
const rabbitmqChannelLargetRetryTimes = 20;
let rabbitmqChannel = null;
let rabbitmqrRetry = 1;
let rabbitmqConnecting =  false;
initialRabbitmqChannel();

function initialRabbitmqChannel() {
    createRabbitmqChannel()
    if (rabbitmqChannel === null && rabbitmqrRetry <= rabbitmqChannelLargetRetryTimes) {
        setTimeout(initialRabbitmqChannel, 5000); 
        rabbitmqrRetry++;
    }
    rabbitmqConnecting = false;
}

function createRabbitmqChannel() {
    amqp.connect('amqp://' + RABBITMQ_HOST, function(rabbitmqConnectionError, connection) {
        if (rabbitmqConnectionError) {
            console.log(rabbitmqConnectionError)
            return
        }
        connection.createChannel(function(rabbitmqChannelConnctionError, channel) {
            if (rabbitmqChannelConnctionError) {
                console.log(rabbitmqChannelConnctionError);
                return
            }
            channel.assertQueue(queueName, {
                durable: true
            });
            rabbitmqChannel = channel;
        });
    });
}

app.get('/image/:imageId/thumbnail', (req, res) => {
    console.log("Get image %s", req.params["imageId"]);
    redis.get(req.params["imageId"], (redisConnectionError, redisResult) => {
        if (redisConnectionError) {
            console.log(redisConnectionError)
            res.json({error: "Can not connect to the redis server, please try again!"})
        }
        if (redisResult === null) {
            res.json({error: "There is no such image or the image is still processing, please try again!"});
        } else {
            console.log(redisResult)
            const file = redisResult
            res.download(file)
        }
    })
});

app.post('/image', (req, res) => {
    console.log("Post image");
    const uuid = uuidv4();
    const errors = postImageApi.postImage(req.files, uuid, rabbitmqChannel, queueName)
    let result = {
        id: "",
        error: ""
    }

    if (errors.serverError !== "") {
        if (!rabbitmqConnecting) {
            rabbitmqConnecting = true;
            rabbitmqrRetry = 1;
            initialRabbitmqChannel();
        }
        result.error = errors.serverError;
    }
    else {
        if (errors.fileError !== "") {
            result.error = errors.fileError;
        }
        else {
            result.id = uuid
        }
    }
    res.json(result)
});

app.listen(3000, () => { console.log('Listening on port 3000') });