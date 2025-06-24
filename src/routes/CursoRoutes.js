const express = require('express');
const router = express.Router();
const CursoController = require('../controllers/CursoController');
const InscricaoController = require('../controllers/InscricaoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', CursoController.listarCursos);
router.post('/:idCurso', InscricaoController.inscrever);
router.patch('/:idCurso', InscricaoController.cancelar);
router.get('/inscritos/:idUsuario', CursoController.listarCursosInscritos)

module.exports = router;