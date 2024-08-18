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
            const games = await Games.findAll();
            res.render('ranking', { games });
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

app.get('/azerty', (req, res) => {
    res.render('azerty', { message: null });
});

app.get('/rankingall', async (req, res) => {
    try {
        const games = await Games.findAll();
        res.render('rankingall', { games });
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 삭제 요청 처리
app.post('/delete', async (req, res) => {
    const { nickname } = req.body;

    if (nickname) {
        try {
            // 닉네임에 해당하는 모든 게임 기록을 삭제
            const initialCount = await Games.count({ where: { nickname } });
            await Games.destroy({ where: { nickname } });

            // 결과 메시지 생성
            const message = {
                type: initialCount > 0 ? 'success' : 'error',
                text: initialCount > 0 ? 'Scores deleted successfully.' : 'No scores found for this nickname.',
            };

            res.render('azerty', { message });
        } catch (error) {
            console.error('Error deleting game records:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).send('Nickname is required');
    }
});

// 닉네임 변경 요청 처리
app.post('/rename', async (req, res) => {
    const { oldNickname, newNickname } = req.body;

    if (oldNickname && newNickname) {
        try {
            // 닉네임을 변경
            const [updatedCount] = await Games.update(
                { nickname: newNickname },
                { where: { nickname: oldNickname } }
            );

            // 결과 메시지 생성
            const message = {
                type: updatedCount > 0 ? 'success' : 'error',
                text: updatedCount > 0 ? 'Nickname updated successfully.' : 'No scores found for the old nickname.',
            };

            res.render('azerty', { message });
        } catch (error) {
            console.error('Error updating nickname:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).send('Both old and new nicknames are required');
    }
});

app.post('/superegister', async (req, res) => {
    const { nickname, score } = req.body;

    if (nickname && score !== undefined) {
        try {
            await Games.create({ nickname, score });
            const message = {
                type: 'success',
                text: 'Game record created successfully.',
            };
            res.render('azerty', { message });
        } catch (error) {
            console.error('Error creating game record:', error);
            const message = {
                type: 'error',
                text: 'Internal Server Error. Could not create game record.',
            };
            res.render('azerty', { message });
        }
    } else {
        const message = {
            type: 'error',
            text: 'Both nickname and score are required.',
        };
        res.render('azerty', { message });
    }
});
