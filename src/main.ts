'use strict'

import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from '~/app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Response } from 'express'
import { join } from 'path'
import { Logger } from '@nestjs/common'

declare const module: any

;(async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    cors: false,
  })
  const config = app.get<ConfigService>(ConfigService)
  //TODO Configure NestJS app with config service

  app.use((_, res: Response, next: Function) => {
    res.removeHeader('x-powered-by')
    next()
  })

  app.useStaticAssets(join(__dirname, 'public'))
  app.setBaseViewsDir(join(__dirname, 'templates'))
  app.setViewEngine('pug')

  if (process.env.NODE_ENV !== 'production') require('./swagger').default(app)

  await app.listen(4000, async (): Promise<void> => {
    Logger.log('NestJS is READY on <http://127.0.0.1:4000> !')
  })
  
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
})()
