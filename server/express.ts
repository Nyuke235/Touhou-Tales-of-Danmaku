import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import os from 'node:os';
import { Users } from './db/users.ts';
import { Settings } from './db/settings.ts';
import { Scores } from './db/scores.ts';
import { Sessions } from './db/sessions.ts';
import { Validate } from './validation.ts';

const PORT = 9000;
const eth0 = os.networkInterfaces().eth0;
const HOST = eth0 ? eth0[0].address : '127.0.0.1';

// ------ MIDDLEWARE ------
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 20,
	message: { ok: false, message: 'Too many attempts. Try again later.' },
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

interface AuthRequest extends Request {
	userId: number;
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
	const token = req.headers.authorization?.slice(7);
	if (!token) {
		res.status(401).json({ ok: false, message: 'Authentication required.' });
		return;
	}
	const session = Sessions.find(token);
	if (!session) {
		res.status(401).json({ ok: false, message: 'Invalid or expired session.' });
		return;
	}
	(req as AuthRequest).userId = session.user_id;
	next();
}

// ------ APP ------
const app = express();
app.use(express.json());
app.use(globalLimiter);
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	next();
});

// ------ ROUTES ------
app.post('/api/auth', authLimiter, async (req, res) => {
	const { username, password } = req.body ?? {};

	if (!Validate.username(username))
		return res.status(400).json({
			ok: false,
			message: 'Invalid username. 3-20 alphanumeric characters, _ or - only.',
		});
	if (!Validate.password(password))
		return res
			.status(400)
			.json({ ok: false, message: 'Password must be 6-64 characters.' });

	const user = Users.find(username);

	if (user) {
		if (!(await bcrypt.compare(password, user.password)))
			return res
				.status(401)
				.json({ ok: false, message: 'Incorrect password.' });

		const token = Sessions.create(user.id);
		return res.json({
			ok: true,
			message: 'Login successful!',
			token,
			settings: Settings.get(user.id),
			scores: Scores.forUser(user.id),
		});
	}

	const hash = await bcrypt.hash(password, 10);
	const userId = Users.create(username, hash);
	Settings.init(userId);
	const token = Sessions.create(userId);
	return res.status(201).json({
		ok: true,
		message: 'Account created and logged in successfully!',
		token,
		settings: null,
		scores: [],
	});
});

app.post('/api/save-settings', requireAuth, (req, res) => {
	const { controls, music_vol, sfx_vol } = req.body ?? {};
	const userId = (req as AuthRequest).userId;
	Settings.save(userId, controls ?? null, music_vol ?? 0.7, sfx_vol ?? 0.8);
	return res.json({ ok: true });
});

app.post('/api/save-score', requireAuth, (req, res) => {
	const { score, stage, date, slow } = req.body ?? {};
	const userId = (req as AuthRequest).userId;

	if (!Validate.score(score))
		return res.status(400).json({ ok: false, message: 'Invalid score.' });
	if (!Validate.stage(stage))
		return res.status(400).json({ ok: false, message: 'Invalid stage.' });
	if (!Validate.date(date))
		return res.status(400).json({ ok: false, message: 'Invalid date.' });
	if (!Validate.slow(slow))
		return res.status(400).json({ ok: false, message: 'Invalid slow value.' });

	const inserted = Scores.insert(userId, score, stage, date, slow);
	if (!inserted)
		return res.status(429).json({ ok: false, message: 'Score limit reached.' });

	return res.json({ ok: true });
});

app.get('/api/leaderboard', (_req, res) => {
	return res.json(Scores.leaderboard());
});

app.get('/api/scores/:username', (req, res) => {
	const user = Users.find(req.params.username);
	if (!user) return res.json([]);
	return res.json(Scores.forUser(user.id));
});

app.delete('/api/session', requireAuth, (req, res) => {
	const token = req.headers.authorization!.slice(7);
	Sessions.deleteToken(token);
	return res.json({ ok: true });
});

app.get('/api/user-data', requireAuth, (req, res) => {
	const userId = (req as AuthRequest).userId;
	return res.json({
		ok: true,
		settings: Settings.get(userId),
		scores: Scores.forUser(userId),
	});
});

app.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
});
