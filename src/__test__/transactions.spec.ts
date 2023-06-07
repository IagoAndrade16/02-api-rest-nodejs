import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { app } from '../app'
import request from 'supertest'
import { execSync } from 'node:child_process'
beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => {
  execSync('npx knex migrate:rollback --all')
  execSync('npx knex migrate:latest')
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

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'transactions',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: 'transactions',
        amount: 5000,
      }),
    ])
  })
})
