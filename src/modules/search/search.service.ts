import { Injectable } from '@nestjs/common';
import { HelperService } from '../helper/helper.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import { User } from '../users/schemas/user.schema';
import { sendResponse } from 'src/config';

@Injectable()
export class SearchService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly helperService: HelperService,
    ){

    }
    async search(query: string = ""){
        let keyword = new RegExp(this.helperService.slug(query), "i")
        
        const titleResult = await this.postModel.find({deleted: false, slug: keyword})
            .populate({
                path: "user",
                select: "fullName avatar slug"
            })
            .select("-image")
        
        const desResult = await this.postModel.find({deleted: false, description: new RegExp(query, "i")})
            .populate({
                path: "user",
                select: "fullName avatar slug"
            })
            .select("-image")
        
        let postResult = [...titleResult, ...desResult]
        
        const userResult = await this.userModel.find({banned: false, slug: keyword})
            .select("fullName avatar slug")
        
        postResult = postResult.reduce((acc, current) => {
            const x = acc.find(item => item._id.toString() === current._id.toString());
            if (!x) acc.push(current);
            return acc;
        }, []);

        return sendResponse("success", "Tìm kiếm thành công", {post: postResult, user: userResult})
    }
}
