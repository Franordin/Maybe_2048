export default class Cell {
    #CELL
    #X
    #Y
    #TILE
    #MERGETILE

    constructor($cell, X, Y) {
        this.#CELL = $cell;
        this.#X = X;
        this.#Y = Y;
    }//constructor

    /* 💥 01.Cell의 기본 세팅 - Tile 값에 영향 */
    /* [GETTER, SETTER] */
    get x() { return this.#X }
    get y() { return this.#Y }

    get tile() {
        // console.log('class:',this.#TILE);
        return this.#TILE;
    }

    set tile(newTile) {
        this.#TILE = newTile;
        if (newTile == null) { return; }
        this.#TILE.x = this.#X;
        this.#TILE.y = this.#Y;
    }//tile

    /* 💥02. 키보드 이벤트 관련 */
    get mergeTile() { return this.#MERGETILE; }

    set mergeTile(tile) {
        this.#MERGETILE = tile;
        if (tile == null) { return; }
        this.#MERGETILE.x = this.#X;
        this.#MERGETILE.y = this.#Y;
    }

    canAccept(tile) {
        return (
            this.tile == null ||
            (this.mergeTile == null && this.tile.value === tile.value)
        );
    }//canAccept

    mergeTiles(PLAY) {
        if (this.tile == null || this.mergeTile == null) { return; }

        this.tile.value = this.tile.value + this.mergeTile.value;
        PLAY.score += this.tile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
    }//mergeTiles

}//class Cell
