
import { Auth0Provider } from '@bcwdev/auth0provider'
import BaseController from '../utils/BaseController'
import { galaxiesService } from '../services/GalaxiesService'

export class GalaxiesController extends BaseController {
  constructor() {
    super('api/galaxies')
    this.router
      .get('', this.getAll)
      .get('/:id', this.getById)

      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.remove)
  }

  async getAll(req, res, next) {
    try {
      const query = req.query
      const galaxies = await galaxiesService.getAll(query)
      return res.send(galaxies)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const galaxiesResult = await galaxiesService.getById(req.params.id)
      return res.send(galaxiesResult)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const newGalaxies = await galaxiesService.create(req.body)
      return res.send(newGalaxies)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const update = await galaxiesService.edit(req.body)
      return res.send(update)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      await galaxiesService.remove(req.params.id, req.userInfo.id)
      return res.send('Deleted')
    } catch (error) {
      next(error)
    }
  }
}
