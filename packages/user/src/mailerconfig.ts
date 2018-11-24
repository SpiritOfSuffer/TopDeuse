export = {
    transport: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user',
        pass: 'password',
      },
    },
    defaults: {
      forceEmbeddedImages: true,
      from: '"nest-modules" <modules@nestjs.com>',
    },
  };