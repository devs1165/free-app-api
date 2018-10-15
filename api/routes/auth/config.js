const convict = require('convict');

const config = convict({
    http: {
        port: {
            doc: 'The port to listen on',
            default: 3000,
            env: 'PORT'
        }
    },
    authentication: {
        google: {
            "clientId": {
                "doc": "The Client ID from Google to use for authentication",
                "default": "985858472498-cm3irjfrs09jppbnc5gsopl81fkqub4v.apps.googleusercontent.com",
                "env": "GOOGLE_CLIENTID"
            },
            "clientSecret": {
                "doc": "The Client Secret from Google to use for authentication",
                "default": "_5jixT08f1bpy1LhFNU9agpS",
                "env": "GOOGLE_CLIENTSECRET"
            }
        },
        facebook: {
            "clientId": {
                "doc": "The Client ID from Facebook to use for authentication",
                "default": "529663280793592",
                "env": "FACEBOOK_CLIENTID"
            },
            "clientSecret": {
                "doc": "The Client Secret from Facebook to use for authentication",
                "default": "c69491eac3ebfd345470fcba5874da5b",
                "env": "FACEBOOK_CLIENTSECRET"
            }
        },
        token: {
            secret: {
                doc: 'The signing key for the JWT',
                default: 'mySuperSecretKey',
                env: 'JWT_SIGNING_KEY'
            },
            issuer: {
                doc: 'The issuer for the JWT',
                default: 'social-logins-spa'
            },
            audience: {
                doc: 'The audience for the JWT',
                default: 'social-logins-spa'
            }
        }
    }
});

config.validate();

module.exports = config;