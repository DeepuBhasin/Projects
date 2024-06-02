const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require("@reduxjs/toolkit");

const config = {
    secret: 'TestingApp'  // Change this to a strong secret key
};

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

// Middleware to enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, userid');
    next();
});

// Utility function to read users from the JSON file
const readUsers = async () => {
    const data = await fs.readFile('db.json', 'utf-8');
    return JSON.parse(data);
};

// Utility function to write users to the JSON file
const writeUsers = async (users) => {
    await fs.writeFile('db.json', JSON.stringify(users, null, 2));
};

// Route to indicate that the application is running
app.get('/', async (req, res) => {
    const users = await readUsers();
    res.json(users);
});

// Route to register a new user
app.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    const data = await readUsers();

    if (data.users.find(user => user.email === email)) {
        return res.status(400).json({ status: "failed", message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = nanoid();
    const newUser = {
        id,
        fullName,
        email,
        password: hashedPassword,
        hasCreatedAccount: false,
        accounts: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        "__v": 0,
        "_id": id
    };

    data.users.push(newUser);
    await writeUsers(data);
    res.status(201).json({ status: "success", message: 'User registered successfully' });
});

// Route to login a user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const data = await readUsers();

    const user = data.users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ status: "failed", message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ status: "failed", message: 'Invalid password' });
    }

    const token = jwt.sign({ email: user.email }, config.secret, { expiresIn: '1h' });

    const userObj = {
        status: "success",
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        token
    };

    res.json(userObj);
});

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const userId = req.headers['userid']; // Ensure this matches the header key used in the client request

    if (!authHeader) {
        return res.status(401).json({ status: "failed", message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: "failed", message: 'Token not found in Authorization header' });
    }

    jwt.verify(token, config.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ status: "failed", message: 'Failed to authenticate token. Please login again' });
        }
        req.user = user;
        req.userId = userId; // Attach userId to the req object
        next();
    });
};

// Route to get user profile
app.get('/profile', authenticateToken, async (req, res) => {
    const userId = req.userId;
    const data = await readUsers();

    const user = data.users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ status: "failed", message: 'User not found' });
    }

    res.json(user);
});

// Route to create a new account for the user
app.post('/accounts', authenticateToken, async (req, res) => {
    const { name, accountType, initialBalance, notes } = req.body;
    const userId = req.userId;
    const data = await readUsers();

    const user = data.users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ status: "failed", message: 'User not found' });
    }

    const id = nanoid();
    const newAccount = {
        name,
        accountType,
        initialBalance,
        transactions: [],
        createBy: userId,
        notes,
        id,
        "__v": 0,
        "_id": id,
        createdAt: new Date(),
    };

    user.accounts = [...user.accounts, newAccount];
    await writeUsers(data);
    res.status(201).json({ status: "success", data: newAccount });
});

// Route to update an existing account for the user
app.put('/accounts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, accountType, initialBalance, notes } = req.body;
    const userId = req.userId;
    const data = await readUsers();

    const user = data.users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ status: "failed", message: 'User not found' });
    }

    const account = user.accounts.find(account => account.id === id);
    if (!account) {
        return res.status(404).json({ status: "failed", message: 'Account not found' });
    }

    // Update account details
    if (name !== undefined) account.name = name;
    if (accountType !== undefined) account.accountType = accountType;
    if (initialBalance !== undefined) account.initialBalance = initialBalance;
    if (notes !== undefined) account.notes = notes;
    account.updatedAt = new Date();

    await writeUsers(data);
    res.status(200).json({ status: "success", data: account });
});


// Get single account
app.get('/accounts/:id', authenticateToken, async (req, res) => {
    const data = await readUsers();
    const userId = req.userId;

    const user = data.users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ status: "failed", message: 'User not found' });
    }
    const { id } = req.params;
    const account = user.accounts.find(account => account.id === id);
    if (!account) {
        return res.status(404).json({ status: "failed", message: 'Account not found' });
    }
    res.json(account);
});

// Route to update a user
app.put('/user', authenticateToken, async (req, res) => {
    const { fullName, password } = req.body;
    const data = await readUsers();

    const user = data.users.find(user => user.email === req.user.email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) {
        user.fullName = fullName;
    }

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    user.updatedAt = new Date();

    await writeUsers(data);
    res.json({ message: 'User updated successfully' });
});

// add transaction
app.post('/transactions', authenticateToken, async (req, res) => {
    const userId = req.userId;
    const { accountId, name, transactionType, amount, category, notes } = req.body;
    const data = await readUsers();
    const user = data.users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({ status: "failed", message: 'User not found' });
    }
    const account = user.accounts.find(account => account.id === accountId);
    if (!account) {
        return res.status(404).json({ status: "failed", message: 'Account not found' });
    }
    const id = nanoid();
    const newTransaction = {
        name,
        transactionType,
        category,
        amount,
        createBy: userId,
        notes,
        id,
        "__v": 0,
        "_id": id,
        createdAt: new Date(),
    };
    account.transactions = [...account.transactions, newTransaction];
    await writeUsers(data);
    res.status(201).json({ status: "success", data: newTransaction });
});


// Route to delete a user
app.delete('/user', authenticateToken, async (req, res) => {
    let data = await readUsers();
    data.users = data.users.filter(user => user.email !== req.user.email);
    await writeUsers(data);
    res.json({ message: 'User deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
