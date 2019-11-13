'use strict';
// Copyright 2018 The Casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(function(resolve) { resolve(result.value); }).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, '__esModule', { value: true });
const casbin_1 = require('casbin');
const casbinRule_1 = require('./casbinRule');
const typeorm_1 = require('typeorm');
/**
 * TypeORMAdapter represents the TypeORM adapter for policy storage.
 */
class TypeORMAdapter {
  constructor(option) {
    this.option = option;
  }
  /**
     * newAdapter is the constructor.
     * @param option typeorm connection option
     */
  static newAdapter(option) {
    return __awaiter(this, void 0, void 0, function* () {
      const defaults = {
        synchronize: true,
        name: 'node-casbin-official',
      };
      const entities = { entities: [ casbinRule_1.CasbinRule ] };
      const configuration = Object.assign(defaults, option);

      const a = new TypeORMAdapter(Object.assign(configuration, entities));
      yield a.open();
      return a;
    });
  }
  open() {
    return __awaiter(this, void 0, void 0, function* () {

      this.typeorm = yield typeorm_1.createConnection(this.option);
      if (!this.typeorm.isConnected) {
        yield this.typeorm.connect();
      }
    });
  }
  close() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.typeorm.isConnected) {
        yield this.typeorm.close();
      }
    });
  }
  clearTable() {
    return __awaiter(this, void 0, void 0, function* () {
      yield typeorm_1.getRepository(casbinRule_1.CasbinRule, this.option.name).clear();
    });
  }
  loadPolicyLine(line, model) {
    const result = line.ptype + ', ' + [ line.v0, line.v1, line.v2, line.v3, line.v4, line.v5 ].filter(n => n).join(', ');
    casbin_1.Helper.loadPolicyLine(result, model);
  }
  /**
     * loadPolicy loads all policy rules from the storage.
     */
  loadPolicy(model) {
    return __awaiter(this, void 0, void 0, function* () {
      const lines = yield typeorm_1.getRepository(casbinRule_1.CasbinRule, this.option.name).find();
      for (const line of lines) {
        this.loadPolicyLine(line, model);
      }
    });
  }
  savePolicyLine(ptype, rule) {
    const line = new casbinRule_1.CasbinRule();
    line.ptype = ptype;
    if (rule.length > 0) {
      line.v0 = rule[0];
    }
    if (rule.length > 1) {
      line.v1 = rule[1];
    }
    if (rule.length > 2) {
      line.v2 = rule[2];
    }
    if (rule.length > 3) {
      line.v3 = rule[3];
    }
    if (rule.length > 4) {
      line.v4 = rule[4];
    }
    if (rule.length > 5) {
      line.v5 = rule[5];
    }
    return line;
  }
  /**
     * savePolicy saves all policy rules to the storage.
     */
  savePolicy(model) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.clearTable();
      let astMap = model.model.get('p');
      const lines = [];
      // @ts-ignore
      for (const [ ptype, ast ] of astMap) {
        for (const rule of ast.policy) {
          const line = this.savePolicyLine(ptype, rule);
          lines.push(line);
        }
      }
      astMap = model.model.get('g');
      // @ts-ignore
      for (const [ ptype, ast ] of astMap) {
        for (const rule of ast.policy) {
          const line = this.savePolicyLine(ptype, rule);
          lines.push(line);
        }
      }
      yield typeorm_1.getRepository(casbinRule_1.CasbinRule, this.option.name).save(lines);
      return true;
    });
  }
  /**
     * addPolicy adds a policy rule to the storage.
     */
  addPolicy(sec, ptype, rule) {
    return __awaiter(this, void 0, void 0, function* () {
      const line = this.savePolicyLine(ptype, rule);
      yield typeorm_1.getRepository(casbinRule_1.CasbinRule, this.option.name).save(line);
    });
  }
  /**
     * removePolicy removes a policy rule from the storage.
     */
  removePolicy(sec, ptype, rule) {
    return __awaiter(this, void 0, void 0, function* () {
      const line = this.savePolicyLine(ptype, rule);
      yield typeorm_1.getRepository(casbinRule_1.CasbinRule, this.option.name).delete(line);
    });
  }
  /**
     * removeFilteredPolicy removes policy rules that match the filter from the storage.
     */
  removeFilteredPolicy(sec, ptype, fieldIndex, ...fieldValues) {
    return __awaiter(this, void 0, void 0, function* () {
      const line = new casbinRule_1.CasbinRule();
      line.ptype = ptype;
      if (fieldIndex <= 0 && fieldIndex + fieldValues.length > 0) {
        line.v0 = fieldValues[0 - fieldIndex];
      }
      if (fieldIndex <= 1 && fieldIndex + fieldValues.length > 1) {
        line.v1 = fieldValues[1 - fieldIndex];
      }
      if (fieldIndex <= 2 && fieldIndex + fieldValues.length > 2) {
        line.v2 = fieldValues[2 - fieldIndex];
      }
      if (fieldIndex <= 3 && fieldIndex + fieldValues.length > 3) {
        line.v3 = fieldValues[3 - fieldIndex];
      }
      if (fieldIndex <= 4 && fieldIndex + fieldValues.length > 4) {
        line.v4 = fieldValues[4 - fieldIndex];
      }
      if (fieldIndex <= 5 && fieldIndex + fieldValues.length > 5) {
        line.v5 = fieldValues[5 - fieldIndex];
      }
      yield typeorm_1.getRepository(casbinRule_1.CasbinRule, this.option.name).delete(line);
    });
  }
}
exports.default = TypeORMAdapter;
