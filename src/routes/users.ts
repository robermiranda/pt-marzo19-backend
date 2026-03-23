import express from 'express'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import db from '../db.js'

const router = express.Router()

interface CreateUserBody {
    nombre: string;
    email: string;
    password: string;
}

router.get('/', (req: Request, res: Response) => {
    
    try {
    const stmt = db.prepare('SELECT id, nombre, email FROM users')
    const users = stmt.all()

    res.json({
        status: 'ok',
        results: users.length,
        data: users
    })
    }
    catch(error: unknown) {
        console.error('Error while getting users', error)
        res.status(500).json({
            status: 'error',
            message: 'Error interno al consultar la base de datos'
        })
    }
})

router.post('/', async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    
    try {
        const {nombre, email, password } = req.body

        if ( ! nombre || ! email || ! password) {
            return res.status(400).json({error: 'todos los campos son obligatorios: nombre, email y password'})
        }

        const saltRounds: number = 10
        const passwHashed: string = await bcrypt.hash(password, saltRounds)
        
        const insert = db.prepare('INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)')
        const result = insert.run(nombre, email, passwHashed)

        res.status(201).json({
            message: 'user inserted',
            id: result.lastInsertRowid
        })
    }
    catch(error: unknown) {
        if (error instanceof Object && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'email already exists' });
        }

        res.status(500).json({ error: 'Error en el servidor' });
    }
})

export default router

//curl -X POST http://localhost:3001/users \
//     -H "Content-Type: application/json" \
//     -d '{
//          "nombre": "Roberto Miranda Morales",
//          "email": "rober.mirandaa@gmail.com",
//          "password": "rober123"
//         }'