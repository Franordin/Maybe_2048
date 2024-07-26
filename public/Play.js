import Tile from "./Tile.js";

export default class Play {
    #SCORE;

    constructor($board, GRID) {
        this.$board = $board;
        this.GRID = GRID;
        this.KEYS = Object.freeze({
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
        });
        this.$score = document.getElementById('score');
        this.score = 0;

        // 모달 요소 참조
        this.$modal = document.getElementById('game-over-modal');
        this.$finalScore = document.getElementById('final-score');
        this.$nickname = document.getElementById('nickname');
        this.$submitScore = document.getElementById('submit-score');

        // 점수 제출 버튼 이벤트 핸들러 추가
        this.$submitScore.addEventListener('click', this.submitScore.bind(this));

        // 모달 초기 상태 설정
        this.$modal.style.display = 'none';
    }

    setupInput() {
        window.addEventListener('keydown', this.handler.bind(this), { once: true });
    }

    handler = async (e) => {
        const { up, down, left, right } = this.KEYS;

        switch (e.key) {
            case up:
                if (!this.canMoveUp()) { this.setupInput(); return; }
                await this.moveUp();
                break;
            case down:
                if (!this.canMoveDown()) { this.setupInput(); return; }
                await this.moveDown();
                break;
            case left:
                if (!this.canMoveLeft()) { this.setupInput(); return; }
                await this.moveLeft();
                break;
            case right:
                if (!this.canMoveRight()) { this.setupInput(); return; }
                await this.moveRight();
                break;
            default:
                this.setupInput();
                return;
        }

        this.GRID.cells.forEach($cell => $cell.mergeTiles(this));

        const newTile = new Tile(this.$board);
        this.GRID.randomEmptyCell().tile = newTile;

        if (!this.canMoveUp() && !this.canMoveDown() && !this.canMoveLeft() && !this.canMoveRight()) {
            newTile.waitForTransition(true).then(() => {
                this.showGameOverModal();
            });
            return;
        }

        this.setupInput();
    }

    canMove(cells) {
        return cells.some(colOrRow => {
            return colOrRow.some(($cell, idx) => {
                if (idx === 0) return false;
                if ($cell.tile == null) return false;
                const $moveToCell = colOrRow[idx - 1];
                return $moveToCell.canAccept($cell.tile);
            });
        });
    }

    canMoveUp() { return this.canMove(this.GRID.cellsByColumn); }
    canMoveDown() { return this.canMove(this.GRID.cellsByColumn.map(col => [...col].reverse())); }
    canMoveLeft() { return this.canMove(this.GRID.cellsByRow); }
    canMoveRight() { return this.canMove(this.GRID.cellsByRow.map(row => [...row].reverse())); }

    slideTiles(cells) {
        return Promise.all(
            cells.flatMap(group => {
                const promises = [];
                for (let i = 1; i < group.length; i++) {
                    const $cell = group[i];
                    if ($cell.tile == null) continue;
                    let $lastValidCell;
                    for (let j = i - 1; j >= 0; j--) {
                        const moveToCell = group[j];
                        if (!moveToCell.canAccept($cell.tile)) break;
                        $lastValidCell = moveToCell;
                    }

                    if ($lastValidCell != null) {
                        promises.push($cell.tile.waitForTransition());
                        if ($lastValidCell.tile != null) {
                            $lastValidCell.mergeTile = $cell.tile;
                        } else {
                            $lastValidCell.tile = $cell.tile;
                        }
                        $cell.tile = null;
                    }
                }
                return promises;
            })
        );
    }

    moveUp() { return this.slideTiles(this.GRID.cellsByColumn); }
    moveDown() { return this.slideTiles(this.GRID.cellsByColumn.map(col => [...col].reverse())); }
    moveLeft() { return this.slideTiles(this.GRID.cellsByRow); }
    moveRight() { return this.slideTiles(this.GRID.cellsByRow.map(row => [...row].reverse())); }

    get score() { return this.#SCORE; }
    set score(num) {
        this.#SCORE = num;
        this.$score.textContent = this.#SCORE;
    }

    showGameOverModal() {
        this.$finalScore.textContent = this.score;
        this.$modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }

    submitScore = async () => {
        const nickname = this.$nickname.value;
        if (nickname) {
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        nickname: nickname,
                        score: this.score,
                    }),
                });
                if (response.ok) {
                    console.log('Score submitted successfully');
                    this.$modal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                } else {
                    console.error('Failed to submit score');
                    alert('Failed to submit score. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting score:', error);
                alert('Error submitting score. Please try again.');
            }
        } else {
            alert('Please enter a nickname.');
        }
    }
}
