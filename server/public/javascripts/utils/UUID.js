/* Generate a new universally unique identifier (UUID) according to RFC
 4122.
 * Returns the string representation of the UUID as defined in section 3
 of RFC 4122.
 *   (type) - The type of UUID to generate: "v4" (default) or "NIL"
 */
UUID = {
    generate: function (type) {
        switch ((type || 'v4').toUpperCase()) {
            // Version 4 UUID  (Section 4.4 of RFC 4122)
            case 'V4':
                var tl = this._randomHexString(8);
                // time_low
                var tm = this._randomHexString(4);
                // time_mid
                var thav = '4' + this._randomHexString(3);
                // time_hi_and_version
                var cshar = Math.randomInt(0, 0xFF);
                // clock_seq_hi_and_reserved
                cshar = ((cshar & ~(1 << 6)) | (1 << 7)).toString(16);
                var csl = this._randomHexString(2);
                // clock_seq_low
                var n = this._randomHexString(12);
                // node

                return (tl + '-' + tm + '-' + thav + '-' + cshar + csl + '-' + n);

            // Nil UUID  (Section 4.1.7 of RFC 4122)
            case 'NIL':
                return ('00000000-0000-0000-0000-000000000000');
        }
        return (null);
    },

    _randomHexString: function (len) {
        var random = Math.randomInt(0, Math.pow(16, len) - 1);
        return (random.toString(16).pad(len, '0', String.PAD_LEFT));
    }
};

/* Pad a string to a certain length with another string; similar to
 PHP's str_pad() function.
 * Derived from code by Carlos Reche <carlosreche at yahoo.com>.
 *    len   - Pad the string up to this length
 *   (pad)  - String used for padding (default: a single space)
 *   (type) - Type can be String.PAD_LEFT, String.PAD_RIGHT (default) or
 String.PAD_BOTH
 */
String.PAD_LEFT = 0;
String.PAD_RIGHT = 1;
String.PAD_BOTH = 2;

String.prototype.pad = function (len, pad, type) {
    var string = this;
    var append = new String();

    len = isNaN(len) ? 0 : len - string.length;
    pad = typeof (pad) == 'string' ? pad : ' ';

    if (type == String.PAD_BOTH) {
        string = string.pad(Math.floor(len / 2) + string.length, pad,
            String.PAD_LEFT);
        return (string.pad(Math.ceil(len / 2) + string.length, pad,
            String.PAD_RIGHT));
    }

    while ((len -= pad.length) > 0)
        append += pad;
    append += pad.substr(0, len + pad.length);

    return (type == String.PAD_LEFT ? append.concat(string) :
        string.concat(append));
};

/* Generate a uniformly distributed random integer within the range
 <min> .. <max>.
 *   (min) - Lower limit: random >= min (default: 0)
 *   (max) - Upper limit: random <= max (default: 1)
 */
Math.randomInt = function (min, max) {
    if (!isFinite(min)) min = 0;
    if (!isFinite(max)) max = 1;
    return (Math.floor((Math.random() % 1) * (max - min + 1) + min));
};