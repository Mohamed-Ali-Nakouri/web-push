module.exports = {
    //i used mlab database for fast and realiable pace development enviroment
       mongoURI: 'mongodb://localhost:27017/inn-db',
       privateKey: 'VwcOa-ZVg2fH5jM4-PSVKnPizJBaFm-DFTk7l10bDeE' || process.env.VAPID_PRIVATE_KEY,
       publicKey: 'BFdOeJXqugauLrE4IWRdx8aAJ06yOC-uy_Qw5QBCPZEmAsYltNWjcJBr8yddwIxrd_M9sAqL_Xq5my6gFx7DA_A' || process.env.VAPID_PUBLIC_KEY
    }