
import { Auth0Provider } from '@bcwdev/auth0provider'
import BaseController from '../utils/BaseController'
import { galaxiesService } from '../services/GalaxiesService'
import { starsService } from '../services/StarsService'

export class StarsController extends BaseController {
  constructor() {
    super('api/stars')
    this.router
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get(':id/galaxies', this.getGalaxies)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.remove)
  }

  async getAll(req, res, next) {
    try {
      const query = req.query
      const stars = await starsService.getAll(query)
      return res.send(stars)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const starsResult = await starsService.getById(req.params.id)
      return res.send(starsResult)
    } catch (error) {
      next(error)
    }
  }

  async getGalaxies(req, res, next) {
    try {
      const galaxies = await galaxiesService.getByGalaxyId(req.params.id)
      return res.send(galaxies)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const newStars = await starsService.create(req.body)
      return res.send(newStars)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const update = await starsService.edit(req.body)
      return res.send(update)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.userInfo.id
      const starId = req.params.id
      await starsService.remove(starId, userId)
      return res.send('Deleted')
    } catch (error) {
      next(error)
    }
  }
}
