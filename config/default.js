module.exports = {
    port: 3000,
    session: {
        secret: 'pdmi',
        key: 'pdmi',
        maxAge: 86400000
    },
    redis: {
        host: '192.168.8.244',
        port: '6379',
        auth: 'dayang123'
    },
    pupLogin: {
        clientId: 'aee034540f0445ccbf6ce11773aad555',
        authorizeUrl: 'http://oauth.pup.hubpd.com/pup-asserver/authorize'
    },
    serviceUrl: {
        cre: 'http://localhost:8080/cre/'
    },
    appRelated: ['CRE', 'RESOURCEMANAGER', 'PORTAL', 'PEOPLEDAILYAPI']
};