import { ApiController, DELETE, GET, PATCH, POST } from 'core/api-decorators';
import { NextFunction, Response } from 'express';
import { dtoValidator } from 'middlewares/validate';
import BaseRequest from 'modules/base/base.request';
import { CreateItemDto } from 'modules/dto/create-item.dto';
import { UpdateItemDto } from 'modules/dto/update-item.dto';
import ExampleService from 'modules/services/example.service';

@ApiController('/example')
class ExampleController {
  @GET('/')
  async getTemplate(req: BaseRequest, res: Response, next: NextFunction) {
    const items = await ExampleService.getItems();
    res.json(items);
  }

  @GET('/:id')
  async getTemplateById(req: BaseRequest, res: Response, next: NextFunction) {
    const id = req.params.id;
    const item = await ExampleService.getItemById(id);
    res.json(item);
  }

  @POST('/', {
    handlers: [dtoValidator(CreateItemDto)],
  })
  async createTemplate(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: CreateItemDto = req.body;
    const item = await ExampleService.createItem(dto);
    res.json(item);
  }

  @PATCH('/:id', {
    handlers: [dtoValidator(UpdateItemDto)],
  })
  async updateTemplate(req: BaseRequest, res: Response, next: NextFunction) {
    const id = req.params.id;
    const dto: UpdateItemDto = req.body;
    const item = await ExampleService.updateItem(id, dto);
    res.json(item);
  }

  @DELETE('/:id')
  async deleteTemplate(req: BaseRequest, res: Response, next: NextFunction) {
    const id = req.params.id;
    const result = await ExampleService.deleteItem(id);
    res.json(result);
  }
}

export default new ExampleController();
