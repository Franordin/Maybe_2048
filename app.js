const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Games = sequelize.define('Games', {
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

const app = express();
const PORT = 5000;
const HOST = '0.0.0.0'; // 모든 IP 주소에서 접근 가능

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
}).catch((error) => {
    console.error('Error creating tables:', error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/register', async (req, res) => {
    const { nickname, score } = req.body;

    if (nickname) {
        try {
            await Games.create({ nickname, score });
            // res.redirect('/');
        } catch (error) {
            console.error('Error creating game record:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).send('Nickname is required');
    }
});

// 새로운 라우트: 게임 기록 보기
app.get('/ranking', async (req, res) => {
    try {
        const games = await Games.findAll();
        res.render('ranking', { games });
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).send('Internal Server Error');
    }
});
