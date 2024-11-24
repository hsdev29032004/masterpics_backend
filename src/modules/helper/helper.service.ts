import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  slug(s: string){
    const input = 'àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ'
    const output = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
    return s
        .toLowerCase()
        .split('')
        .map(char => {
            const index = input.indexOf(char);
            return index !== -1 ? output[index] : char;
        })
        .join('')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '') 
  }
}
