import __dirname from "../utils.js"

export default {
    welcome: {
        subject:'¡Bienvenido!',
        attachments: [
            {
                filename: 'logo.png',
                path: `${__dirname}/public/img/logo.png`,
                cid: 'logo'
            }
        ]
    },
    passwordrestore: {
        subject:'Restablecimiento de contraseña',
        attachments: [
            {
                filename: 'logo.png',
                path: `${__dirname}/public/img/logo.png`,
                cid: 'logo'
            }
        ]
    },
    purchase: {
        subject:'Gracias por comprar en Music Store!',
        attachments: [
            {
                filename: 'logo.png',
                path: `${__dirname}/public/img/logo.png`,
                cid: 'logo'
            }
        ]
    },
}