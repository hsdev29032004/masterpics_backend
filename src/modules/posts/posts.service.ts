import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CONFIG_PERMISSIONS, sendResponse } from 'src/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as sharp from 'sharp';
import { IUser } from '../users/users.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async getListPost(page: number){    
    let limit = 5
    const totalPost = await this.postModel.countDocuments({deleted: false})

    const posts = await this.postModel.find({deleted: false})
      .populate({
        path: "user",
        select: "slug fullName avatar"
      })
      .select("-image")
      .sort({createdAt: -1})
      .limit(limit)
      .skip((page-1)*limit)
    
    return sendResponse("success", "Lấy danh sách bài viết thành công", {posts, totalPage: Math.ceil(totalPost / limit)})
  }

  async getListPostByFollow(page: number, user: IUser){    
    let limit = 5
    const totalPost = await this.postModel.countDocuments({
      deleted: false,
      user: { $in: user.follow }
    })

    const posts = await this.postModel.find({
      deleted: false, 
      user: {$in: user.follow}
    })
      .populate({
        path: "user",
        select: "slug fullName avatar"
      })
      .select("-image")
      .sort({createdAt: -1})
      .limit(limit)
      .skip((page-1)*limit)
    
    return sendResponse("success", "Lấy danh sách bài viết thành công", {posts, totalPage: Math.ceil(totalPost / limit)})
  }

  async findByslug(slug: string) {
    const post = await this.postModel.findOne({ slug: slug, deleted: false }).select("-image")
    if (post) {
      return sendResponse("success", "Lấy bài viết thành công", post)
    }
    return sendResponse("error", "Không tìm thấy bài viết", null)
  }

  async findByIdUser(id: string) {
    const posts = await this.postModel.find({ user: id, deleted: false }).select("-image")
    return sendResponse("success", "Lấy bài viết thành công", posts)
  }

  async upPost(createPostDto: CreatePostDto, image: Express.Multer.File, user: IUser) {
    const { title, description, price } = createPostDto
    if (!title || !description || !price) {
      return sendResponse("error", "Vui lòng nhập đầy đủ các trường", null)
    }

    if (!image) {
      throw new BadRequestException(sendResponse("error", "Chưa tải ảnh lên", null))
    }

    const originalImageResult = await this.cloudinaryService.uploadFile(image);
    const { width, height } = await sharp(image.buffer).metadata();
    const watermarkedBuffer = await sharp(image.buffer)
      .composite([
        {
          input: Buffer.from(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <style>
                  .watermark {
                    font-size: ${Math.max(width, height) / 10}px;
                    fill: rgba(0, 0, 0, 0.3);
                    font-family: Arial, sans-serif;
                    text-anchor: middle;
                    dominant-baseline: middle;
                  }
                </style>
              </defs>
              <text x="50%" y="50%" class="watermark" transform="rotate(-30, ${width / 2}, ${height / 2})">
                @MasterPics
              </text>
            </svg>
          `),
          gravity: 'southeast',
        },
      ])
      .toBuffer()

    const fakeFile = {
      buffer: watermarkedBuffer,
    } as Express.Multer.File

    const watermarkUpload = await this.cloudinaryService.uploadFile(fakeFile)
    const post = await this.postModel.create({ title, description, price, image: originalImageResult.url, watermark: watermarkUpload.url, user: user._id })
    return sendResponse("success", "Tạo mới bài viết thành công", post)
  }

  async editPost(updatePostDto: UpdatePostDto, image: Express.Multer.File, user: IUser, id: string) {
    const { title, description, price } = updatePostDto
    if (!title || !description || !price) {
      return sendResponse("error", "Vui lòng nhập đầy đủ các trường", null)
    }

    let post = await this.postModel.findOne({_id: id})
    if(!post){
      throw new NotFoundException(sendResponse("error", "Không tìm thấy bài viết", null))
    }else if(user._id != post.user.toString()){
      throw new ForbiddenException(sendResponse("error", "Bạn không có quyền thực hiện", null))
    }

    let newPost: UpdatePostDto = {title, description, price}

    if (image) {
      const originalImageResult = await this.cloudinaryService.uploadFile(image);
      const { width, height } = await sharp(image.buffer).metadata();
      const watermarkedBuffer = await sharp(image.buffer)
        .composite([
          {
            input: Buffer.from(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <style>
                  .watermark {
                    font-size: ${Math.max(width, height) / 10}px;
                    fill: rgba(0, 0, 0, 0.3);
                    font-family: Arial, sans-serif;
                    text-anchor: middle;
                    dominant-baseline: middle;
                  }
                </style>
              </defs>
              <text x="50%" y="50%" class="watermark" transform="rotate(-30, ${width / 2}, ${height / 2})">
                @MasterPics
              </text>
            </svg>
          `),
            gravity: 'southeast',
          },
        ])
        .toBuffer()

      const fakeFile = {
        buffer: watermarkedBuffer,
      } as Express.Multer.File

      const watermarkUpload = await this.cloudinaryService.uploadFile(fakeFile)
      newPost.image = originalImageResult.url
      newPost.watermark = watermarkUpload.url
    }

    await post.updateOne(newPost)
    post = await this.postModel.findOne({ _id: id })

    return sendResponse("success", "Chỉnh bài viết thành công", post)
  }

  async deletePost(id: string, user: IUser) {
    let post = await this.postModel.findOne({ _id: id })
    if (post) {
      if (user._id == post.user.toString() || user.role.permissions.includes(CONFIG_PERMISSIONS.POST.DELETE)) {
        post.deleted = true
        await post.save()
        return sendResponse("success", "Xóa bài viết thành công", null)
      } else {
        throw new ForbiddenException(sendResponse("error", "Bạn không có quyền thực hiện", null))
      }
    } else {
      throw new NotFoundException(sendResponse("error", "Không tìm thấy bài viết", null))
    }
  }
}
