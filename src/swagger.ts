'use strict'

import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { readFileSync } from 'fs'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { SwaggerCustomOptions } from '@nestjs/swagger/dist/interfaces/swagger-custom-options.interface'

export default function(app: NestExpressApplication) {
    const config = app.get(ConfigService) as ConfigService
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
    const build = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription(pkg.description)
      .setVersion(pkg.version)
      .build()
    const document = SwaggerModule.createDocument(app, build)

    SwaggerModule.setup(
      config.get<string>('swagger.path'),
      app,
      document,
      config.get<SwaggerCustomOptions>('swagger.options'),
    )

    app.getHttpAdapter().get(
      config.get<string>('swagger.api'),
      (req: Request, res: Response) => res.json(document),
    )
}
