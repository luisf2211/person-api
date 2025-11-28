// src/features/persons/persons.service.ts
import { Injectable } from '@nestjs/common';
import { CoreService } from 'src/infra/http/core.service';
import { CreatePersonDto } from './dtos/create-person.dto';

@Injectable()
export class PersonsService {
  constructor(private readonly coreService: CoreService) {}

  async getAll() {
    return this.coreService.getAllPersons();
  }

  async getById(id: string) {
    return this.coreService.getPersonById(id);
  }

  async create(payload: CreatePersonDto) {
    return this.coreService.createPerson(payload);
  }

  async update(id: string, payload: Partial<CreatePersonDto>) {
    return this.coreService.updatePerson(id, payload);
  }

  async delete(id: string) {
    return this.coreService.deletePerson(id);
  }
}
