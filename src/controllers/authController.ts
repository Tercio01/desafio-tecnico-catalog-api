import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';

// Registrar usuário
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    
    // Verificar se usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
      return;
    }
    
    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    
    // Gerar token
    const token = generateToken(user._id.toString());
    
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Validar campos
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
      return;
    }
    
    // Buscar usuário com senha
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
      return;
    }
    
    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
      return;
    }
    
    // Gerar token
    const token = generateToken(user._id.toString());
    
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Gerar JWT token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  
  return jwt.sign({ id: userId }, secret, { expiresIn: '24h' });
};
