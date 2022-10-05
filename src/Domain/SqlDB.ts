import { Sequelize } from 'sequelize-typescript'
export { Op, Includeable, col as Column } from 'sequelize'
import Logger from '../Utils/Logger.js'
import * as Models from './Models/index.js'

export const sequelize = new Sequelize(
  process.env?.DBNAME ?? 'ikomida',
  process.env?.DBUSER ?? 'ikomida',
  process.env?.DBPASS ?? 'ikomida@123',
  {
    models: Object.values(Models),
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 1000
    },
    host: process.env?.DBHOST ?? 'localhost',
    port: Number(process.env?.DBPORT) ?? 3306,
    typeValidation: true,
    logging: false
  }
)

export const connect = async (service: string) => {
  const logger = Logger.getInstance(service)
  logger.info(`Checking database connection...`)
  try {
    await sequelize.authenticate()
    logger.info('Database connection OK!')
  } catch (error: any) {
    logger.error(`Unable to connect to the database: ${error}`)
    process.exit(1)
  }
}
export const sync = async (service: any, alter = false, force = false) => {
  const logger = Logger.getInstance(service)
  logger.info(`Syncing database structure...`)
  try {
    await sequelize.sync({
      logging: console.log,
      force,
      alter
    })
    logger.info('Syncing database structure OK!')
  } catch (error: any) {
    logger.error(`Syncing database structure erro: ${error}`)
    process.exit(1)
  }
}
