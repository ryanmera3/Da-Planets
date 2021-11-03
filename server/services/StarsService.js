import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class StarsService {
  async getAll(query = {}) {
    const stars = await dbContext.Stars.find({}).populate('creator', 'name picture')
    return stars
  }

  async getById(id) {
    const found = await dbContext.Stars.findById(id).populate('creator', 'name picture')
    if (!found) {
      throw new BadRequest('No Star with that ID found')
    }
    return found
  }

  async create(body) {
    const newStar = await dbContext.Stars.create(body)
    return await this.getById(newStar.id)
  }

  async edit(body) {
    const found = await this.getById(body.id)
    if (found.creatorId.toString() !== body.creatorId) {
      throw new Forbidden('You do not have permission to edit this')
    }
    const updated = await dbContext.Stars.findByIdAndUpdate(body.id, body, { new: true })
    return updated
  }

  async remove(id, userId) {
    const found = await this.getById(id)
    if (found.creatorId.toString() !== userId) {
      throw new Forbidden('You do not have permission to delete this')
    }
    await dbContext.Stars.findByIdAndDelete(id)
  }
}

export const starsService = new StarsService()
