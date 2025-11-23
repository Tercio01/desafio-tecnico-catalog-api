import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;
    
    // Verificar se o token está no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Não autorizado - Token não fornecido'
      });
      return;
    }
    
    // Verificar token
    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded: any = jwt.verify(token, secret);
    
    // Buscar usuário
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }
    
    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Não autorizado - Token inválido'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Não autorizado'
      });
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Sem permissão para acessar este recurso'
      });
      return;
    }
    
    next();
  };
};
