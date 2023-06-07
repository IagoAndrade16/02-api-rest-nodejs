import { expect, it, beforeAll, afterAll, describe } from 'vitest'
import { app } from '../app'
import request from 'supertest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('transactions', () => {
  it('should return 201 if transaction was created', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'transactions',
      amount: 5000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })
})
