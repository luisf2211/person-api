import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PersonsService } from './persons.service';
import { BaseResponse } from 'src/common/http/base-response';
import { CreatePersonDto } from './dtos/create-person.dto';
import { PersonDto } from './dtos/person.dto';

@ApiTags('Persons')
@ApiBearerAuth('access-token')
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get()
  async getAll(): Promise<BaseResponse<any[]>> {
    const result = await this.personsService.getAll();
    return new BaseResponse(true, 'Listado obtenido', result);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<BaseResponse<any>> {
    const result = await this.personsService.getById(id);
    return new BaseResponse(true, 'Persona encontrada', result);
  }

  @Post('')
  @HttpCode(201)
  async create(@Body() body: CreatePersonDto): Promise<BaseResponse<PersonDto>> {
    const result = await this.personsService.create(body);
    return new BaseResponse(true, 'Persona creada', result);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: CreatePersonDto): Promise<BaseResponse<PersonDto>> {
    await this.personsService.update(id, body);
    return new BaseResponse(true, 'Persona actualizada');
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BaseResponse<null>> {
    await this.personsService.delete(id);
    return new BaseResponse(true, 'Persona eliminada');
  }
}
