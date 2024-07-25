const bgColor = "--cell-bg-lightness";
const txtColor = "--cell-text-lightness";

const tileImages = {
    2: 'https://image1.marpple.co/files/u_2404120/2024/4/original/93a0269c0b647acbf758ea7d8d336d2c2fab7ab71.png?q=92&w=1600&f=jpeg',
    4: 'https://image1.marpple.co/files/u_2404120/2024/4/original/9ddd09f6a5f4b4dd83aec2cd241ef7feaba76f7e1.png?q=92&w=1600&f=jpeg',
    8: 'https://image1.marpple.co/files/u_2404120/2024/1/original/5e677dc14cbb5ab71ae69203bb3b707c0c9e6d081.png?q=92&w=600&f=webp',
    16: 'https://image1.marpple.co/files/u_2404120/2024/1/original/a50685c642b5bc84812e3833052d4be14dabd6b51.png?q=92&w=600&f=webp',
    32: 'https://image1.marpple.co/files/u_2404120/2024/1/original/6ba3224ecc32504c1a29acac1e8d410413f225d61.png?q=92&w=600&f=webp',
    64: 'https://image1.marpple.co/files/u_2404120/2024/1/original/d2fcd9ae65ba0cc330337c1f26268dbb4ceb6a841.png?q=92&w=600&f=webp',
    128: 'https://image1.marpple.co/files/u_2404120/2023/3/original/24614310adfbd10513dcfa23091e1e1ad6d307ed1.png?q=92&w=600&f=webp',
    256: 'https://s3.marpple.co/files/u_2404120/2023/12/original/8b3bed9805b7c0294ac110e0574472e0ac0580331.png',
    512: 'https://image1.marpple.co/files/u_2404120/2023/12/original/b1d43c10cce4cedb3261be3f03bdbc244c3d25e01.png?q=80&amp;w=360&amp;f=webp',
    1024: 'https://image1.marpple.co/files/u_2404120/2023/12/original/11a391dc3085f9d4d6058a6e48aad1645b1882e21.jpg?q=80&amp;w=2880&amp;f=webp',
    2048: 'path/to/image2048.png',
    // 필요한 만큼 추가
};


export default class Tile {
    #TILE
    #x
    #y
    #VALUE

    constructor($board, vnum = Math.random() > 0.5 ? 2 : 4) {
        this.$board = $board;
        this.#TILE = this.addTileElement();
        this.value = vnum; //set에서 실행됨
    }//constructor

    /* 💥 01. 랜덤한 타일 2개 생성 관련 */
    addTileElement() {
        const $tile = document.createElement('DIV');
        $tile.classList.add('tile');
        this.$board.appendChild($tile);
        return $tile;
    }//addTileElement

    /* [GETTER, SETTER] */
    set x(xnum) {
        this.#x = xnum;
        this.#TILE.style.setProperty('--x', xnum);
    }//set-x

    set y(ynum) {
        this.#x = ynum;
        this.#TILE.style.setProperty('--y', ynum);
    }//set-x

    get value() { return this.#VALUE; }

    set value(vnum) {
        // 숫자 설정
        this.#VALUE = vnum;
        // this.#TILE.textContent = vnum;
    
        // 배경색 및 글씨색
        const power = Math.log2(vnum);
        const bgLight = 100 - (power * 9);
    
        this.#TILE.style.setProperty(bgColor, `${bgLight}%`);
        this.#TILE.style.setProperty(txtColor, `${bgLight <= 50 ? 90 : 10}%`);
    
        // 배경 이미지 설정
        if (tileImages[vnum]) {
            this.#TILE.style.backgroundImage = `url(${tileImages[vnum]})`;
            this.#TILE.style.backgroundSize = 'cover';
            this.#TILE.style.backgroundPosition = 'center';
        } else {
            // 이미지가 없는 경우 기본 배경색 사용
            this.#TILE.style.backgroundImage = 'none';
        }
    }

    /* 💥 02. 이벤트 관련 */
    remove() { this.#TILE.remove(); }

    waitForTransition(animation = false) {
        return new Promise(res => {
            const evt = animation ? "animationend" : "transitionend";
            this.#TILE.addEventListener(evt, res, { once: true });
        });
    }//waitForTransition
}//class-Tile
