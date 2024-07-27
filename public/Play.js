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
        
        // 터치 이벤트 핸들러 설정
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.setupTouchEvents();
    }

    setupInput() {
        window.addEventListener('keydown', this.handler.bind(this), { once: true });
    }

    setupTouchEvents() {
        this.$board.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });

        this.$board.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const xDiff = this.touchEndX - this.touchStartX;
        const yDiff = this.touchEndY - this.touchStartY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // Horizontal swipe
            if (xDiff > swipeThreshold) {
                this.handleArrowKey('right');
            } else if (xDiff < -swipeThreshold) {
                this.handleArrowKey('left');
            }
        } else {
            // Vertical swipe
            if (yDiff > swipeThreshold) {
                this.handleArrowKey('down');
            } else if (yDiff < -swipeThreshold) {
                this.handleArrowKey('up');
            }
        }
    }

    handleArrowKey(direction) {
        switch (direction) {
            case 'up':
                if (!this.canMoveUp()) { this.setupInput(); return; }
                this.moveUp().then(() => this.afterMove());
                break;
            case 'down':
                if (!this.canMoveDown()) { this.setupInput(); return; }
                this.moveDown().then(() => this.afterMove());
                break;
            case 'left':
                if (!this.canMoveLeft()) { this.setupInput(); return; }
                this.moveLeft().then(() => this.afterMove());
                break;
            case 'right':
                if (!this.canMoveRight()) { this.setupInput(); return; }
                this.moveRight().then(() => this.afterMove());
                break;
        }
    }

    afterMove() {
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
                    this.$modal.style.display = 'none';
                    document.body.classList.remove('modal-open');
    
                    // 랭킹 페이지로 이동
                    window.location.href = '/ranking'; // 이 경로는 실제 랭킹 페이지의 경로로 수정해야 합니다.
                } else {
                    console.error('점수 제출 실패');
                    alert('점수 제출에 실패했습니다. 다시 시도해 주세요.');
                }
            } catch (error) {
                console.error('점수 제출 중 오류 발생:', error);
                alert('점수 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        } else {
            alert('닉네임을 입력해 주세요.');
        }
    }
}
