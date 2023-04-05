import { beforeEach, describe, it } from 'node:test'
import App from '../../src/app'
import TestModel from '../../src/database/model/final/TestModel.model'
import CurrentEnv from '../../src/utils/env_config'
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import { Response } from "express"
import request from "supertest"

chai.use(chaiHttp);

const test_data: TestModel[] = [{
  id: 1,
  str: "kek"
} as TestModel, {
  id: 2,
  str: "lol"
} as TestModel]

const beforeFun = async () => {
  console.log("before")
  await TestModel.destroy({
    where: {},
    truncate: true
  })

  console.log("after delete")
  test_data.forEach(async (val, _index, _arr) => {
    await TestModel.create({
      id: val.id,
      str: val.str
    })
  })

  console.log("done")
}

describe('GET /api/test', async () => {
  it('return test data', async () => {
    await beforeFun()

    return request((await App.create(CurrentEnv.env())).getExpress())
      .get('/api/test')
      .then(res => {
        console.log(res.body)
        chai.expect(res.body.testModels.length).to.eql(2)
        chai.expect(res.body.testModels[0].str).to.eql("kek")
        chai.expect(res.body.testModels[1].str).to.eql("lol")
      })
  })
})