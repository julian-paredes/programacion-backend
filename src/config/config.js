import dotenv from 'dotenv'
import { Command, Option } from 'commander'

const program = new Command()

program.option('-m, --mode <mode>','Modo de trabajo', 'production')
    .option('-p <port>', 'Puerto del servidor', 8080)

program.parse()

dotenv.config({
    path: program.opts().mode === 'dev' ? './.env.dev' : './.env.prod'
})


export default {
    app: {
        PORT: process.env.PORT || 8080,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASS: process.env.ADMIN_PASS,
        PERSISTENCE: process.env.PERSISTENCE || "MONGO",
        ENV: process.env.ENV
    },

    mongo: {
        MONGO_URL: process.env.MONGO_URL || 'localhost:27017'
    },
    jwt: {
        JWT_COOKIE: process.env.JWT_COOKIE,
        JWT_SECRET: process.env.JWT_SECRET
    },
    mailer:{
        USER: process.env.NODE_MAILER_USER,
        PWD: process.env.NODE_MAILER_PASSWORD
    }
}