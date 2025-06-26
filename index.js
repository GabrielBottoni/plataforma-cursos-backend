const express = require('express');
const sequelize = require('./config/database');
const CursoRoutes = require('./src/routes/CursoRoutes');
const UsuarioRoutes = require('./src/routes/UsuarioRoutes');
const AuthRoutes = require('./src/routes/AuthRoutes');
const RootRoutes = require('./src/routes/RootRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, 'src/images')));

// rotas

app.use('/cursos',CursoRoutes);
app.use('/usuarios',UsuarioRoutes)
app.use('/login', AuthRoutes);
app.use('/', RootRoutes);

sequelize.sync().then(() => {
    console.log('Banco de dados conectado com sucesso!');
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
}).catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1); 
});   