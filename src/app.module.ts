import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WithdrawsModule } from './modules/withdraws/withdraws.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PostsModule } from './modules/posts/posts.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { RolesModule } from './modules/roles/roles.module';
import mongoose from 'mongoose';
import slugUpdater from 'mongoose-slug-updater';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

mongoose.plugin(slugUpdater);

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URL');        
        try {
          await mongoose.connect(uri)
          console.log('Database connected successfully');
          mongoose.connection.close();
        } catch (error) {
          console.error('Database connection failed');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule, 
    PaymentsModule, 
    WithdrawsModule, 
    CloudinaryModule, 
    AuthModule, 
    NotificationsModule, 
    PostsModule, 
    DepositsModule, 
    FavoritesModule, 
    RolesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
