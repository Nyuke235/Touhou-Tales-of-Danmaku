import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'node:os';

let HOST: string;
let PORT: number = 9000;
const eth0 = os.networkInterfaces().eth0;
const dataFilePath = path.join(process.cwd(), 'server', 'data', 'data.json');

if (eth0) {
	HOST = eth0[0].address;
} else {
	HOST = '127.0.0.1';
}

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

const readData = (callback: (users: any[]) => void) => {
	fs.readFile(dataFilePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return callback([]);
		}
		callback(data ? JSON.parse(data) : []);
	});
};

app.post('/api/auth', (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: 'Username and password are required.' });
	}

	readData(users => {
		const userExists = users.find(u => u.username === username);

		if (userExists) {
			if (userExists.password === password) {
				return res.status(200).json({
					message: 'Login successful!',
					saveData: userExists.saveData,
				});
			} else {
				return res.status(401).json({ message: 'Incorrect password.' });
			}
		} else {
			const newUser = { username, password, saveData: null };
			users.push(newUser);

			fs.writeFile(
				dataFilePath,
				JSON.stringify(users, null, 4),
				'utf8',
				writeErr => {
					if (writeErr)
						return res.status(500).json({ message: 'Server write error.' });
					return res.status(201).json({
						message: 'Account created and logged in successfully!',
						saveData: null,
					});
				}
			);
		}
	});
});

app.post('/api/save', (req, res) => {
	const { username, saveData } = req.body;

	if (!username || !saveData)
		return res.status(400).json({ message: 'Incomplete data.' });

	readData(users => {
		const userIndex = users.findIndex(u => u.username === username);
		if (userIndex !== -1) {
			users[userIndex].saveData = saveData;
			fs.writeFile(
				dataFilePath,
				JSON.stringify(users, null, 4),
				'utf8',
				writeErr => {
					if (writeErr)
						return res.status(500).json({ message: 'Write error.' });
					return res.status(200).json({ message: 'Save successful.' });
				}
			);
		} else {
			return res.status(404).json({ message: 'User not found.' });
		}
	});
});

app.post('/api/load', (req, res) => {
	const { username } = req.body;

	readData(users => {
		const user = users.find(u => u.username === username);
		if (user) {
			return res.status(200).json({ saveData: user.saveData });
		} else {
			return res.status(404).json({ message: 'User not found.' });
		}
	});
});

app.listen(PORT, HOST, () => {
	console.log(`Authentication server started on http://${HOST}:${PORT}`);
});
