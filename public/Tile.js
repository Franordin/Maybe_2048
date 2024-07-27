// const bgColor = "--cell-bg-lightness";
// const txtColor = "--cell-text-lightness";

const tileImages = {
    2: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcOcnc0%2FbtsINL0U6I9%2FfhKOvzEaKkV17X3dOlAE6K%2Fimg.png',
    4: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fo7NFz%2FbtsIPNbMV2x%2FnQzACOB9tCcVLMunymbhaK%2Fimg.png',
    8: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FvApdv%2FbtsIOChPhQq%2FBtt8F61NVW1YKQr0Ykxii0%2Fimg.png',
    16: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FxYWMB%2FbtsIPMYfeux%2FOnmmogrwKLSvgXB3LJpyi1%2Fimg.png',
    32: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb2EBu4%2FbtsIPTv6SCG%2FKedWGGpXMRHUWdxsRl2N0K%2Fimg.png',
    64: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FLhFPo%2FbtsINs8g0sW%2FLVBW8rAgRHSuvBrfHPyh40%2Fimg.png',
    128: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FA4tQT%2FbtsINuruho1%2FBqlpqsIuTzKN1Ym1KyOW9K%2Fimg.png',
    256: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fcs49yp%2FbtsIOFyMwPr%2Fu2Qw3Jk2faUKEU45uKi8qK%2Fimg.png',
    512: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FP8kyZ%2FbtsIOTjiTRd%2FSEuyHhcEghBKH5ceHLFP2K%2Fimg.png',
    1024: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F3Uaop%2FbtsINNqSZvO%2FyPfJO71Vrv2fBieG9gqNHK%2Fimg.png',
    2048: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FuGIG6%2FbtsIOqIDfeE%2FeVBmNxDJE7cargJRBRwJlk%2Fimg.png',
    4096: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fn7fjj%2FbtsINVCjEGt%2FqK18QOxAbe3goA7CUuaMk0%2Fimg.png',
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
        // const power = Math.log2(vnum);
        // const bgLight = 100 - (power * 9);
    
        // this.#TILE.style.setProperty(bgColor, `${bgLight}%`);
        // this.#TILE.style.setProperty(txtColor, `${bgLight <= 50 ? 90 : 10}%`);
    
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
