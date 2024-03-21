import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './entities/user.entity';
import { RolesGuard } from '../auth/strategies/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    debugger;
    try {
      const response = await this.userService.create(createUserDto);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async findAll() {
    const response = await this.userService.findAll();
    return response;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
