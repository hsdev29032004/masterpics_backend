import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FavoritesModule } from '../favorites/favorites.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    FavoritesModule,
    NotificationsModule
  ],
  controllers: [PostsController],
  providers: [PostsService, CloudinaryService],
  exports: [PostsService],
})
export class PostsModule {}
