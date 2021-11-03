
import { Auth0Provider } from '@bcwdev/auth0provider'
import BaseController from '../utils/BaseController'
import { planetsService } from '../services/PlanetsService'

export class PlanetsController extends BaseController {
  constructor() {
    super('api/planets')
    this.router
      .get('', this.getAll)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .delete('/:id', this.remove)
  }

  async create(req, res, next) {
    try {
      // NEver trust the client
      req.body.creatorId = req.userInfo.id
      const planet = await planetsService.create(req.body)
      // custom status code
      return res.status(201).send(planet)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.userInfo.id
      const planetId = req.params.id
      await planetsService.remove(planetId, userId)
      return res.send('Deleted')
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    try {
      const query = req.query
      const planets = await planetsService.getAll(query)
      return res.send(planets)
    } catch (error) {
      next(error)
    }
  }
}
