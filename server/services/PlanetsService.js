import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class PlanetsService {
  async getAll(query = {}) {
    const planets = await dbContext.Planets.find({}).populate('creator', 'name picture')
    return planets
  }

  async create(body) {
    const newPlanet = await dbContext.Planets.create(body)
    return newPlanet
  }

  async remove(planetId, userId) {
    const planet = await dbContext.Planets.findById(planetId)
    if (!planet) {
      throw new BadRequest('invalid Id')
    }
    if (planet.creatorId.toString() !== userId) {
      throw new Forbidden('You do not have permission')
    }
    await dbContext.Planets.findByIdAndDelete(planetId)
  }
}

export const planetsService = new PlanetsService()
