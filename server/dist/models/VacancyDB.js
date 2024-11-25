"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// @ts-ignore
const mongoose_sequence_1 = __importDefault(require("mongoose-sequence"));
const connection = mongoose_1.default.connection;
const AutoIncrement = (0, mongoose_sequence_1.default)(connection);
const vacancyDBSchema = new mongoose_1.default.Schema({
    company: { type: String, required: true },
    vacancy: { type: String, required: true },
    salaryRange: { type: String, required: true },
    status: { type: String, required: true },
    note: { type: String, required: true },
});
vacancyDBSchema.plugin(AutoIncrement, { inc_field: 'id' });
const VacancyDBModel = mongoose_1.default.model('VacancyDB', vacancyDBSchema);
exports.default = VacancyDBModel;
