import express from 'express';
import { rateLimit } from 'express-rate-limit';
import os from 'node:os';
import { Scores } from './db/scores.ts';
import { Validate } from './validation.ts';

const PORT = 9000;
const eth0 = os.networkInterfaces().eth0;
const HOST = eth0 ? eth0[0].address : '127.0.0.1';

// ------ MIDDLEWARE ------
const saveScoreLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 30,
	message: { ok: false, message: 'Too many submissions. Try again later.' },
	standardHeaders: true,
	legacyHeaders: false,
});

const globalLimiter = rateLimit({
	windowMs: 60 * 1000,
	limit: 120,
	message: { ok: false, message: 'Too many requests.' },
	standardHeaders: true,
	legacyHeaders: false,
});

// ------ APP ------
const app = express();
app.use(express.json());
app.use(globalLimiter);
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	next();
});

// ------ ROUTES ------
app.post('/api/save-score', saveScoreLimiter, (req, res) => {
	const { name, score, stage, date, slow } = req.body ?? {};

	if (!Validate.name(name))
		return res.status(400).json({
			ok: false,
			message: 'Invalid name. 3-12 alphanumeric characters, _ or - only.',
		});
	if (!Validate.score(score))
		return res.status(400).json({ ok: false, message: 'Invalid score.' });
	if (!Validate.stage(stage))
		return res.status(400).json({ ok: false, message: 'Invalid stage.' });
	if (!Validate.date(date))
		return res.status(400).json({ ok: false, message: 'Invalid date.' });
	if (!Validate.slow(slow))
		return res.status(400).json({ ok: false, message: 'Invalid slow value.' });

	Scores.insert(name, score, stage, date, slow);
	return res.json({ ok: true });
});

app.get('/api/leaderboard', (_req, res) => {
	return res.json(Scores.leaderboard());
});

app.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
});
