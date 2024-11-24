import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { SearchService } from './search.service';
import { Public } from 'src/common/decorators/customise.decorator';

@Controller('search')
export class SearchController {
    constructor(
        private readonly searchService: SearchService,
    ) {}

    // [GET]: api/search?q=
    @Get('')
    @HttpCode(HttpStatus.OK)
    @Public()
    search(
        @Query('q') query: string
    ){
        return this.searchService.search(query)
    }
}
