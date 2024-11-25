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
const express_1 = __importDefault(require("express"));
const VacancyDB_1 = __importDefault(require("../models/VacancyDB"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacancies = yield VacancyDB_1.default.find();
        res.json(vacancies.map(vacancy => ({
            id: vacancy.id,
            company: vacancy.company,
            vacancy: vacancy.vacancy,
            salaryRange: vacancy.salaryRange,
            status: vacancy.status,
            note: vacancy.note,
        })));
    }
    catch (err) {
        console.error('Error fetching vacancies:', err);
        res.status(500).json({ error: 'Failed to fetch vacancies' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company, vacancy, salaryRange, status, note } = req.body;
        if (!company || !vacancy || !salaryRange || !status || !note) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const newVacancyDB = new VacancyDB_1.default({
            company,
            vacancy,
            salaryRange,
            status,
            note,
        });
        yield newVacancyDB.save();
        res.status(201).json({
            id: newVacancyDB.id,
            company,
            vacancy,
            salaryRange,
            status,
            note,
        });
    }
    catch (err) {
        console.error('Error creating vacancyDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { company, vacancy, salaryRange, status, note } = req.body;
        if (!company || !vacancy || !salaryRange || !status || !note) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const updatedVacancyDB = yield VacancyDB_1.default.findOneAndUpdate({ id }, { company, vacancy, salaryRange, status, note }, { new: true });
        if (!updatedVacancyDB) {
            res.status(404).json({ message: 'VacancyDB not found' });
            return;
        }
        res.status(200).json({
            id: updatedVacancyDB.id,
            company: updatedVacancyDB.company,
            vacancy: updatedVacancyDB.vacancy,
            salaryRange: updatedVacancyDB.salaryRange,
            status: updatedVacancyDB.status,
            note: updatedVacancyDB.note,
        });
    }
    catch (err) {
        console.error('Error updating vacancyDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedVacancyDB = yield VacancyDB_1.default.findOneAndDelete({ id });
        if (!deletedVacancyDB) {
            res.status(404).json({ message: 'VacancyDB not found' });
            return;
        }
        res.status(200).json({ message: 'VacancyDB deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting vacancyDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
