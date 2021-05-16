const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const q = require('q');
const webPush = require('web-push');
const keys = require('./../kk/keys');
const url1 = "mongodb+srv://inn_db:Qdv1898XXyjauKDF@inn-db.8el2u.mongodb.net/inn_db?maxPoolSize=600000&socketTimeoutMS=600000?connectTimeoutMS=600000?retryWrites=true&w=majority";

//Post route of push url is as http://host:3000/push
router.post('/', (req, res) => {
    const payload = {
        title: req.body.title,
        message: req.body.message,
        url: req.body.url,
        ttl: req.body.ttl,
        icon: req.body.icon,
        image: req.body.image,
        badge: req.body.badge,
        tag: req.body.tag
    };
    sendWebPush(req,res,payload);


    // Subscription.find({}, (err, subscriptions) => {
        // if (err) {
        //     console.error(`Error occurred while getting subscriptions`);
        //     res.status(500).json({
        //         error: 'Technical error occurred'
        //     });
    //     } else {
    //         let parallelSubscriptionCalls = subscriptions.map((subscription) => {
    //             return new Promise((resolve, reject) => {
    //                 const pushSubscription = {
    //                     endpoint: subscription.endpoint,
    //                     keys: {
    //                         p256dh: subscription.keys.p256dh,
    //                         auth: subscription.keys.auth
    //                     }
    //                 };

    //                 const pushPayload = JSON.stringify(payload);
    //                 const pushOptions = {
    //                     vapidDetails: {
    //                         subject: "http://inngage.com.br",
    //                         privateKey: keys.privateKey,
    //                         publicKey: keys.publicKey
    //                     },
    //                     TTL: payload.ttl,
    //                     headers: {}
    //                 };
    //                 webPush.sendNotification(
    //                     pushSubscription,
    //                     pushPayload,
    //                     pushOptions
    //                 ).then((value) => {
    //                     resolve({
    //                         status: true,
    //                         endpoint: subscription.endpoint,
    //                         data: value
    //                     });
    //                 }).catch((err) => {
    //                     reject({
    //                         status: false,
    //                         endpoint: subscription.endpoint,
    //                         data: err
    //                     });
    //                 });
    //             });
    //         });
    //         q.allSettled(parallelSubscriptionCalls).then((pushResults) => {
    //             console.info(pushResults);
    //         });
    //         res.json({
    //             data: 'Push triggered'
    //         });
    //     }
    // });
});
async function sendWebPush(req,res,payload) {
    const client = await mongoClient.connect(url1, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    const db = client.db('inn_db');
    const items = await db.collection("subscriber").find({ app_id:161 , platform_id:3 }).toArray();
    let parallelSubscriptionCalls = items.map((subscription) => {
       // console.log(subscription);
        return new Promise((resolve, reject) => {
            const pushSubscription = {
                endpoint: subscription.registration,
                keys: {
                    p256dh: subscription.webpush_keys.p256dh,
                    auth: subscription.webpush_keys.auth
                }
            };

            const pushPayload = JSON.stringify(payload);
            const pushOptions = {
                vapidDetails: {
                    subject: "http://inngage.com.br",
                    privateKey: keys.privateKey,
                    publicKey: keys.publicKey
                },
                TTL: payload.ttl,
                headers: {}
            };
            webPush.sendNotification(
                pushSubscription,
                pushPayload,
                pushOptions
            ).then((value) => {
                resolve({
                    status: true,
                    endpoint: subscription.registration,
                    data: value
                });
            }).catch((err) => {
                console.log(err);
                reject({
                    status: false,
                    endpoint: subscription.registration,
                    data: err
                });
            });
        });
    });
    q.allSettled(parallelSubscriptionCalls).then((pushResults) => {
        console.info(pushResults);
    });
    res.json({
        data: 'Push triggered'
    });
    client.close();
}
// fixed the error get request for this route with a meaningful callback
router.get('/', (req, res) => {
    res.json({
        data: 'Invalid Request Bad'
    });
});
module.exports = router;