import express, {type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Brak tokena - zaloguj się!' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token nieprawidłowy lub wygasł' });
        }

        req.user = user as { userId: string; email: string };
        next();
    });
}

app.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, firstName, lastName, email, phone, password } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username: username }, { email: email }, { phone: phone }],
            },
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Użytkownik o podanym adresie e-mail lub numerze telefonu już istnieje.',
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                firstName,
                lastName,
                email,
                phone,
                passwordHash,
            },
        });

        res.status(201).json({
            message: 'Użytkownik utworzony.',
            user: {
                id: newUser.id,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Błąd serwera podczas rejestracji.',
        });
    }
});

app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findFirst({
            where: { email: email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Nieprawidłowy adres email lub hasło.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Nieprawidłowy adres email lub hasło.' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({
            message: 'Zalogowano.',
            token,
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Błąd serwera.',
        });
    }
});

app.post('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
    res.status(200).json({ message: 'Wylogowano. (token usunac po stronie klienta)' });
});

app.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { id: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                username: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd pobierania użytkowników.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend działa na porcie: ${PORT}`);
});