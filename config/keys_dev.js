module.exports = {
    //i used mlab database for fast and realiable pace development enviroment
       mongoURI: 'mongodb://localhost:27017/web-push',
       privateKey: 'ayTIBl3f0gcI-koFq-ZXPxSR4qicC0GcMNHA1dpHaj0' || process.env.VAPID_PRIVATE_KEY,
       publicKey: 'BK3Q7j8fcGFws03RiU5XakzDJ7KGEiRhdIX2H5U8eNmhhkdHT_j0_SD09KL96aFZOH_bsjr3uRuQPTd77SRP3DI' || process.env.VAPID_PUBLIC_KEY
    }