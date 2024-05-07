"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'codewithtom',
    password: 'codewithtom',
    port: 5432,
});
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = fs_1.default.readFileSync('../codeBlocks.json', 'utf-8');
        const codeBlocks = JSON.parse(data);
        yield Promise.all(codeBlocks.map((block) => __awaiter(void 0, void 0, void 0, function* () {
            yield pool.query('INSERT INTO code_blocks (title, code, solution) VALUES ($1, $2, $3)', [block.title, block.code, block.solution]);
        })));
        console.log('Database seeded successfully.');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        yield pool.end();
    }
});
seedDatabase();
