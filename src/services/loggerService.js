import winston from 'winston';

export default class LoggerService {
    constructor(env){
        this.options = {
            levels:{
                fatal: 0,
                error: 1,
                warning:2,
                http:3,
                info:4
            }
        }
        this.logger = this.createLogger(env);
    }

    createLogger = env => {
        switch(env){
            case "dev":
                return winston.createLogger({
                    levels:this.options.levels,
                    transports: [
                      new winston.transports.Console({
                        level: 'info',
                      })
                    ],
                  });
            
            case "production":
                return winston.createLogger({
                    levels:this.options.levels,
                    transports: [
                      new winston.transports.Console({
                        level: 'http',
                      }),
                      new winston.transports.File({
                        level:"warning",
                        filename:'./activity.log'
                      })
                    ],
                  });
        }
    }
}