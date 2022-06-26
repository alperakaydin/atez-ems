import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Location} from '../models';
import {LocationRepository} from '../repositories';
import {GenerateAdressService} from '../services';

let http = require('http');

export class LocationController {
  constructor(
    @repository(LocationRepository)
    public locationRepository: LocationRepository,
    @inject('service.calculator')
    public avgCalculator: GenerateAdressService,

    @inject('service.Geocoder')
    public geoService: GenerateAdressService
  ) { }

  @post('/locations')
  @response(200, {
    description: 'Location model instance',
    content: {'application/json': {schema: getModelSchemaRef(Location)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Location, {
            title: 'NewLocation',
            /* exclude: ['name'], */
          }),
        },
      },
    })
    location: Location,
  ): Promise<Location> {


    return this.locationRepository.create(location);
  }

  @get('/locations/count')
  @response(200, {
    description: 'Location model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Location) where?: Where<Location>,
  ): Promise<Count> {
    return this.locationRepository.count(where);
  }


  @get('/locations')
  @response(200, {
    description: 'Array of Location model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Location, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Location) filter?: Filter<Location>,
  ): Promise<Location[]> {
    return this.locationRepository.find({include: ['departments']});
  }

  @patch('/locations')
  @response(200, {
    description: 'Location PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Location, {partial: true}),
        },
      },
    })
    location: Location,
    @param.where(Location) where?: Where<Location>,
  ): Promise<Count> {
    return this.locationRepository.updateAll(location, where);
  }

  @get('/locations/{id}')
  @response(200, {
    description: 'Location model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Location, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Location, {exclude: 'where'}) filter?: FilterExcludingWhere<Location>
  ): Promise<Location> {
    return this.locationRepository.findById(id, {include: ['departments']});
  }

  @patch('/locations/{id}')
  @response(204, {
    description: 'Location PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Location, {partial: true}),
        },
      },
    })
    location: Location,
  ): Promise<void> {
    await this.locationRepository.updateById(id, location);
  }

  @put('/locations/{id}')
  @response(204, {
    description: 'Location PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() location: Location,
  ): Promise<void> {
    await this.locationRepository.replaceById(id, location);
  }

  @del('/locations/{id}')
  @response(204, {
    description: 'Location DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.locationRepository.deleteById(id);
  }
}