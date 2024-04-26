<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

#### This monorepository shows how you can build API with microservice architecture using nestjs

    
    ┌── apps                                              # App Micro-Services (alternatively `apps`)
    │   ├── auth
    │   │   ├── src
    │   │   │   ├── clients
    │   │   │   │   └── registers.ts
    │   │   │   ├── app.controller.ts
    │   │   │   ├── app.module.ts
    │   │   │   ├── app.service.ts
    │   │   │   └── main.ts
    │   │   └── tsconfig.app.json
    │   ├── course
    │   │   ├── src
    │   │   │   ├── schema
    │   │   │   │   ├── buyCourse.schema.ts
    │   │   │   │   ├── course.schema.ts
    │   │   │   │   └── courseCategory.schema.ts
    │   │   │   ├── app.controller.ts
    │   │   │   ├── app.module.ts
    │   │   │   ├── app.service.ts
    │   │   │   └── main.ts
    │   │   └── tsconfig.app.json
    │   ├── gateway
    │   │   ├── src
    │   │   │   ├── apiControllers
    │   │   │   │   ├── auth.controller.ts
    │   │   │   │   └── user.controller.ts
    │   │   │   ├── clients
    │   │   │   │   └── registers.ts
    │   │   │   ├── app.module.ts
    │   │   │   └── main.ts
    │   │   └── tsconfig.app.json
    │   └── user
    │       ├── src
    │       │   ├── clients
    │       │   │   └── registers.ts
    │       │   ├── schema
    │       │   │   ├── user.schema.ts
    │       │   │   └── userPermission.schema.ts
    │       │   ├── app.controller.ts
    │       │   ├── app.module.ts
    │       │   ├── app.service.ts
    │       │   └── main.ts
    │       └── tsconfig.app.json
    ├── dist                                           # Compiled files (alternatively `dist`)
    ├── libs                                           # All Libraries (alternatively `libs`)
    |   ├── common
    │   │    └── enum.ts
    |   ├── config
    │   │   ├── src
    │   │   │   ├── config.module.ts
    │   │   │   ├── config.service.ts
    │   │   │   └── index.ts
    │   │   └── tsconfig.lib.json
    |   ├── guard
    │   │   ├── src
    │   │   │   ├── casl
    │   │   │   │    ├── casl-ability.factory
    │   │   │   │    │    ├── ability.ts
    │   │   │   │    │    ├── casl-ability.factory.ts
    │   │   │   │    │    ├── decorator.ts
    │   │   │   |    │    └── interface.ts
    │   │   │   │    └── casl-module.ts
    │   │   │   ├── guard.module.ts
    │   │   │   ├── guard.service.ts
    │   │   │   └── index.ts
    │   │   └── tsconfig.lib.json
    |   ├── interceptor
    │   │   ├── src
    │   │   │   ├── interceptor.module.ts
    │   │   │   ├── interceptor.service.ts
    │   │   │   └── index.ts
    │   │   └── tsconfig.lib.json
    |   ├── logger
    │   │   ├── src
    │   │   │   ├── interceptor.module.ts
    │   │   │   ├── interceptor.service.ts
    │   │   │   └── index.ts
    │   │   └── tsconfig.lib.json
    |   ├── message
    │   │   ├── src
    │   │   │   ├── message.module.ts
    │   │   │   ├── message.service.ts
    │   │   │   └── index.ts
    │   │   └── tsconfig.lib.json
    │   ├── sms
    │   │   ├── src
    │   │   │   ├── sms.module.ts
    │   │   │   ├── sms.service.ts
    │   │   │   └── index.ts
    │   │   └── tsconfig.lib.json
    │   ├── template
    │   │   ├── src
    │   │   │   ├── template.module.ts
    │   │   │   ├── template.service.ts
    │   │   │   └── index.ts
    │   │   └── tsconfig.lib.json
    │   └── validation
    │       ├── src
    │       │   ├── validation.module.ts
    │       │   ├── validation.schema.ts
    │       │   ├── validation.service.ts
    │       │   └── index.ts
    │       └── tsconfig.lib.json
    ├── .eslintrc.js
    ├── .gitignore
    ├── .prettierrc
    ├── nest-cli.json
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tsconfig-build.json
    └── tsconfig.json


# Description
- I have managed API gateway on port 4000.
- I have used message pattern for microservices communication.
- I have used Redis as a message broker which helps us to communicate with the services within microservices architecture.
- I have used mongoose as a client to communicate with mongoDB,  which can store data in a structured or unstructured way.
- I have setup 3 services Auth, User and Courses


# Brief architecture overview
- Use node **v20.11.1** and npm **v10.2.4**
- **Gateway**: handle all microservice on port 4000 and create service wise api controllers.
- **User Service**: handle all the authentication related task like sign-up and login.
- **Course Service**: handle all course which is created by teacher and set course schema and courseBuyer schema.
##### Libraries:
I have use many libraries for sharing code with microservies:
- **Common**: Set enums for all app like dbCollection and microservices.
- **Config**: handle the all env file keys.
- **Guard**: Use a AuthGuard for Authorization and use CaslAbilityGuard which is handle all api permissions.
- **Interceptor**: Use ResponseInterceptor which is handle all success and error response return by micro services and use
             HelmetInterceptor which is set security-related HTTP headers 
- **Logger**: Use for log the success and error messages.
- **Message**: Use to store all app messages.
- **SMS**: Use for send email and sms by any services(i.e sendgrid).
- **Template**: Use for save all app templates.
- **Validation**: I have use Joi validation for to validate the request body and if there are any errors, a 400 BadRequestException error is returned to the client.
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

This example uses a SINGLE database (MongoDB) instance for all microservices.