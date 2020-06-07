import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type:  'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'nest_agenda_app',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],

    // NOT RECOMENDED FOR PRODUCTION ENV
    synchronize: true
};