import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Al iniciar, generamos el hash del password configurado en .env
let adminPasswordHash: string | null = null;

const getAdminHash = async (): Promise<string> => {
  if (!adminPasswordHash) {
    const plain = process.env.ADMIN_PASSWORD || 'admin123';
    adminPasswordHash = await bcrypt.hash(plain, 10);
  }
  return adminPasswordHash;
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos' });
    return;
  }

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  const userMatch = username === adminUser;
  const passMatch = await bcrypt.compare(password, await getAdminHash().then(async () => {
    return bcrypt.hash(adminPass, 10);
  }));

  // Comparación directa segura
  const passwordOk = password === adminPass;

  if (!userMatch || !passwordOk) {
    res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'fallback_secret_dev';
  const token = jwt.sign(
    { username, role: 'admin' },
    secret,
    { expiresIn: '8h' }
  );

  res.json({
    success: true,
    token,
    expiresIn: 8 * 60 * 60,
    username,
  });
};

export const verifyToken = (req: Request, res: Response): void => {
  // Si llega acá, el middleware ya validó el token
  res.json({ success: true, message: 'Token válido' });
};
