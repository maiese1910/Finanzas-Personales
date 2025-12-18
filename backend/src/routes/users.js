import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    loginUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/profile/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
