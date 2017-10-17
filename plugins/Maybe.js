export default class Maybe {
    constructor(val) {
        this.val = val;
    }

    static of(val) {
        return new Maybe(val);
    }

    isNoThing() {
        return (this.val === undefined || this.val === null)
    }

    map(f) {
        return this.isNoThing() ? null : f(this.val);
    }
}