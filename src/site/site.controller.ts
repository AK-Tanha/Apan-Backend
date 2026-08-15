import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SiteService } from './site.service';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CacheControl } from 'src/common/decorators/cache-control.decorator';

@ApiTags('site')
@Controller('site')
export class SiteController {
  constructor(private siteService: SiteService) {}

  @Get()
  @CacheControl('public, max-age=60, s-maxage=60, stale-while-revalidate=300')
  @ApiOperation({
    summary: 'Get public site settings (name, logo, description)',
  })
  get() {
    return this.siteService.get();
  }

  @Patch()
  @ApiOperation({ summary: 'Update site settings (admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Body() dto: UpdateSiteDto) {
    return this.siteService.update(dto);
  }
}
