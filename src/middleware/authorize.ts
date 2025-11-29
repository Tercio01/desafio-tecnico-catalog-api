import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const authorize = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado.',
        });
        return;
      }

      const user = await User.findById(req.userId).select('role');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado.',
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: 'Permissão insuficiente para acessar este recurso.',
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar permissões.',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
};
