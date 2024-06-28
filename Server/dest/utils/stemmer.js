"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stemmer {
    constructor() {
        this.j = 0;
        this.k = 0;
        this.b = '';
        this.i = 0;
        this.i_end = 0;
    }
    add(ch) {
        this.b = this.b.concat(ch);
        this.i++;
    }
    stemWord(word) {
        this.j = 0;
        this.k = 0;
        this.b = '';
        this.i = 0;
        this.i_end = 0;
        this.addAll(word);
        this.stem();
        return this.toString();
    }
    addAll(w) {
        this.b = this.b.concat(w);
        this.i = this.b.length;
    }
    toString() {
        return this.b.slice(0, this.i_end);
    }
    getResultLength() {
        return this.i_end;
    }
    getResultBuffer() {
        return this.b;
    }
    cons(i) {
        const ch = this.b.charCodeAt(i);
        if (ch === 97 || ch === 101 || ch === 105 || ch === 111 || ch === 117) {
            return false;
        }
        if (ch === 121) {
            return i === 0 ? true : !this.cons(i - 1);
        }
        return true;
    }
    m() {
        let n = 0;
        let i = 0;
        while (true) {
            if (i > this.k)
                return n;
            if (!this.cons(i))
                break;
            i++;
        }
        i++;
        while (true) {
            while (true) {
                if (i > this.k)
                    return n;
                if (this.cons(i))
                    break;
                i++;
            }
            i++;
            n++;
            while (true) {
                if (i > this.k)
                    return n;
                if (!this.cons(i))
                    break;
                i++;
            }
            i++;
        }
    }
    vowelinstem() {
        let i;
        for (i = 0; i <= this.j; i++)
            if (!this.cons(i))
                return true;
        return false;
    }
    doublec(j) {
        if (j < 1)
            return false;
        if (this.b.charCodeAt(j) !== this.b.charCodeAt(j - 1))
            return false;
        return this.cons(j);
    }
    cvc(i) {
        if (i < 2 || !this.cons(i) || this.cons(i - 1) || !this.cons(i - 2))
            return false;
        const ch = this.b.charCodeAt(i);
        return ch !== 119 && ch !== 120 && ch !== 121;
    }
    ends(s) {
        const l = s.length;
        const o = this.k - l + 1;
        if (o < 0)
            return false;
        for (let i = 0; i < l; i++)
            if (this.b.charCodeAt(o + i) !== s.charCodeAt(i))
                return false;
        this.j = this.k - l;
        return true;
    }
    setto(s) {
        const l = s.length;
        const o = this.j + 1;
        for (let i = 0; i < l; i++)
            this.b = this.b.substr(0, o + i) + s[i] + this.b.substr(o + i + 1);
        this.k = this.j + l;
    }
    r(s) {
        if (this.m() > 0)
            this.setto(s);
    }
    step1() {
        if (this.b.charCodeAt(this.k) === 115) {
            if (this.ends('sses'))
                this.k -= 2;
            else if (this.ends('ies'))
                this.setto('i');
            else if (this.b.charCodeAt(this.k - 1) !== 115)
                this.k--;
        }
        if (this.ends('eed')) {
            if (this.m() > 0)
                this.k--;
        }
        else if ((this.ends('ed') || this.ends('ing')) && this.vowelinstem()) {
            this.k = this.j;
            if (this.ends('at'))
                this.setto('ate');
            else if (this.ends('bl'))
                this.setto('ble');
            else if (this.ends('iz'))
                this.setto('ize');
            else if (this.doublec(this.k)) {
                this.k--;
                const ch = this.b.charCodeAt(this.k);
                if (ch === 108 || ch === 115 || ch === 122)
                    this.k++;
            }
            else if (this.m() === 1 && this.cvc(this.k))
                this.setto('e');
        }
    }
    step2() {
        if (this.ends('y') && this.vowelinstem())
            this.b = this.b.substr(0, this.k) + 'i' + this.b.substr(this.k + 1);
    }
    step3() {
        if (this.k === 0)
            return;
        const b = this.b;
        const k = this.k;
        switch (b.charCodeAt(k - 1)) {
            case 97:
                if (this.ends('ational')) {
                    this.r('ate');
                    break;
                }
                if (this.ends('tional')) {
                    this.r('tion');
                    break;
                }
                break;
            case 99:
                if (this.ends('enci')) {
                    this.r('ence');
                    break;
                }
                if (this.ends('anci')) {
                    this.r('ance');
                    break;
                }
                break;
            case 101:
                if (this.ends('izer')) {
                    this.r('ize');
                    break;
                }
                break;
            case 108:
                if (this.ends('bli')) {
                    this.r('ble');
                    break;
                }
                if (this.ends('alli')) {
                    this.r('al');
                    break;
                }
                if (this.ends('entli')) {
                    this.r('ent');
                    break;
                }
                if (this.ends('eli')) {
                    this.r('e');
                    break;
                }
                if (this.ends('ousli')) {
                    this.r('ous');
                    break;
                }
                break;
            case 111:
                if (this.ends('ization')) {
                    this.r('ize');
                    break;
                }
                if (this.ends('ation')) {
                    this.r('ate');
                    break;
                }
                if (this.ends('ator')) {
                    this.r('ate');
                    break;
                }
                break;
            case 115:
                if (this.ends('alism')) {
                    this.r('al');
                    break;
                }
                if (this.ends('iveness')) {
                    this.r('ive');
                    break;
                }
                if (this.ends('fulness')) {
                    this.r('ful');
                    break;
                }
                if (this.ends('ousness')) {
                    this.r('ous');
                    break;
                }
                break;
            case 116:
                if (this.ends('aliti')) {
                    this.r('al');
                    break;
                }
                if (this.ends('iviti')) {
                    this.r('ive');
                    break;
                }
                if (this.ends('biliti')) {
                    this.r('ble');
                    break;
                }
                break;
            case 103:
                if (this.ends('logi')) {
                    this.r('log');
                    break;
                }
        }
    }
    step4() {
        const b = this.b;
        const k = this.k;
        switch (b.charCodeAt(k)) {
            case 101:
                if (this.ends('icate')) {
                    this.r('ic');
                    break;
                }
                if (this.ends('ative')) {
                    this.r('');
                    break;
                }
                if (this.ends('alize')) {
                    this.r('al');
                    break;
                }
                break;
            case 105:
                if (this.ends('iciti')) {
                    this.r('ic');
                    break;
                }
                break;
            case 108:
                if (this.ends('ical')) {
                    this.r('ic');
                    break;
                }
                if (this.ends('ful')) {
                    this.r('');
                    break;
                }
                break;
            case 115:
                if (this.ends('ness')) {
                    this.r('');
                    break;
                }
                break;
        }
    }
    step5() {
        if (this.k === 0)
            return;
        const b = this.b;
        const k = this.k;
        switch (b.charCodeAt(k - 1)) {
            case 97:
                if (this.ends('al'))
                    break;
                return;
            case 99:
                if (this.ends('ance'))
                    break;
                if (this.ends('ence'))
                    break;
                return;
            case 101:
                if (this.ends('er'))
                    break;
                return;
            case 105:
                if (this.ends('ic'))
                    break;
                return;
            case 108:
                if (this.ends('able'))
                    break;
                if (this.ends('ible'))
                    break;
                return;
            case 110:
                if (this.ends('ant'))
                    break;
                if (this.ends('ement'))
                    break;
                if (this.ends('ment'))
                    break;
                /* element etc. not stripped before the m */
                if (this.ends('ent'))
                    break;
                return;
            case 111:
                if (this.ends('ion') && this.j >= 0 && (b.charCodeAt(this.j) === 115 || b.charCodeAt(this.j) === 116))
                    break;
                /* j >= 0 fixes Bug 2 */
                if (this.ends('ou'))
                    break;
                return;
            case 115:
                if (this.ends('ous'))
                    break;
                return;
            case 116:
                if (this.ends('ive'))
                    break;
                return;
            case 122:
                if (this.ends('ize'))
                    break;
                return;
            default:
                return;
        }
        if (this.m() > 1)
            this.k = this.j;
    }
    step6() {
        this.j = this.k;
        if (this.b.charCodeAt(this.k) === 101) {
            const a = this.m();
            if (a > 1 || a === 1 && !this.cvc(this.k - 1))
                this.k--;
        }
        if (this.b.charCodeAt(this.k) === 108 && this.doublec(this.k) && this.m() > 1)
            this.k--;
    }
    stem() {
        this.k = this.i - 1;
        if (this.k > 1) {
            this.step1();
            this.step2();
            this.step3();
            this.step4();
            this.step5();
            this.step6();
        }
        this.i_end = this.k + 1;
        this.i = 0;
    }
}
exports.default = Stemmer;
