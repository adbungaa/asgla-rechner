(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}

var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Types$Angemessen = function (a) {
	return {$: 'Angemessen', a: a};
};
var $author$project$Types$Left = {$: 'Left'};
var $author$project$Types$Mutter = {$: 'Mutter'};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$getMonthandYear = _Platform_outgoingPort(
	'getMonthandYear',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{
			activeTab: $author$project$Types$Left,
			customRegelbedarf: false,
			durchschnittseinkommen: false,
			error: $elm$core$Maybe$Nothing,
			freitext: '',
			haftungsbetragMutterInput: '',
			haftungsbetragMutterSpiegel: $elm$core$Maybe$Nothing,
			haftungsbetragMutterUebernommen: $elm$core$Maybe$Nothing,
			haftungsbetragQuelle: $elm$core$Maybe$Nothing,
			haftungsbetragVaterInput: '',
			haftungsbetragVaterSpiegel: $elm$core$Maybe$Nothing,
			haftungsbetragVaterUebernommen: $elm$core$Maybe$Nothing,
			jahr: '2023',
			kind: {
				alter: 0,
				alterInput: '0',
				einkuenfte: _List_fromArray(
					[
						{bezeichnung: '', kosten: ''}
					]),
				erbrachteLeistungen: _List_fromArray(
					[
						{bezahltVon: $elm$core$Maybe$Nothing, bezeichnung: '', kosten: ''}
					]),
				mehrbedarf: _List_fromArray(
					[
						{bezahltVon: $elm$core$Maybe$Nothing, bezeichnung: '', kosten: ''}
					]),
				regelbedarf: '',
				sonderbedarf: _List_fromArray(
					[
						{bezahltVon: $elm$core$Maybe$Nothing, bezeichnung: '', kosten: ''}
					])
			},
			kindergeldEmpfaenger: $author$project$Types$Mutter,
			modalExportOpen: false,
			monat: 'Januar',
			mutter: {
				abzugsposten: _List_fromArray(
					[
						{bezeichnung: '', kosten: ''}
					]),
				einkommenZumDurchschnittsberechnung: _List_fromArray(
					[
						{bezeichnung: ' ', kosten: ''}
					]),
				haupttaetigkeit: '',
				selbstbehalt: $author$project$Types$Angemessen('1750'),
				showSelbstbehaltOptions: false,
				weitereEinkuenfte: _List_fromArray(
					[
						{bezeichnung: ' ', kosten: ''}
					])
			},
			qrIsProcessing: false,
			qrResult: $elm$core$Maybe$Nothing,
			showCameraScanner: false,
			showErgebnis: false,
			showUeberUns: false,
			vater: {
				abzugsposten: _List_fromArray(
					[
						{bezeichnung: '', kosten: ''}
					]),
				einkommenZumDurchschnittsberechnung: _List_fromArray(
					[
						{bezeichnung: ' ', kosten: ''}
					]),
				haupttaetigkeit: '',
				selbstbehalt: $author$project$Types$Angemessen('1750'),
				showSelbstbehaltOptions: false,
				weitereEinkuenfte: _List_fromArray(
					[
						{bezeichnung: ' ', kosten: ''}
					])
			},
			vorschlagHft: false
		},
		$author$project$Main$getMonthandYear(_Utils_Tuple0));
};
var $author$project$Types$CameraScanner = function (a) {
	return {$: 'CameraScanner', a: a};
};
var $author$project$Types$CameraScannerStarted = function (a) {
	return {$: 'CameraScannerStarted', a: a};
};
var $author$project$Types$GetMonthYear = function (a) {
	return {$: 'GetMonthYear', a: a};
};
var $author$project$Types$ImportFile = function (a) {
	return {$: 'ImportFile', a: a};
};
var $author$project$Types$QRDecoded = function (a) {
	return {$: 'QRDecoded', a: a};
};
var $author$project$Types$QRError = function (a) {
	return {$: 'QRError', a: a};
};
var $author$project$Types$Update = function (a) {
	return {$: 'Update', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Main$cameraScannerStarted = _Platform_incomingPort('cameraScannerStarted', $elm$json$Json$Decode$bool);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Types$MonthYear = F2(
	function (month, year) {
		return {month: month, year: year};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$monthYearDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$MonthYear,
	A2($elm$json$Json$Decode$field, 'month', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'year', $elm$json$Json$Decode$string));
var $author$project$Main$qrDecoded = _Platform_incomingPort('qrDecoded', $elm$json$Json$Decode$string);
var $author$project$Main$qrError = _Platform_incomingPort('qrError', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$receiveMonthandYear = _Platform_incomingPort('receiveMonthandYear', $elm$json$Json$Decode$value);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$qrDecoded(
				A2($elm$core$Basics$composeL, $author$project$Types$ImportFile, $author$project$Types$QRDecoded)),
				$author$project$Main$qrError(
				A2($elm$core$Basics$composeL, $author$project$Types$ImportFile, $author$project$Types$QRError)),
				$author$project$Main$cameraScannerStarted(
				A2($elm$core$Basics$composeL, $author$project$Types$CameraScanner, $author$project$Types$CameraScannerStarted)),
				$author$project$Main$receiveMonthandYear(
				function (value) {
					var _v1 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$monthYearDecoder, value);
					if (_v1.$ === 'Ok') {
						var result = _v1.a;
						return $author$project$Types$Update(
							$author$project$Types$GetMonthYear(result));
					} else {
						return $author$project$Types$Update(
							$author$project$Types$GetMonthYear(
								{month: '', year: ''}));
					}
				})
			]));
};
var $author$project$Types$ImageFile = {$: 'ImageFile'};
var $author$project$Types$JsonFile = {$: 'JsonFile'};
var $author$project$Types$OnFileRead = function (a) {
	return {$: 'OnFileRead', a: a};
};
var $author$project$Types$OnFileSelected = F2(
	function (a, b) {
		return {$: 'OnFileSelected', a: a, b: b};
	});
var $author$project$Types$Vater = {$: 'Vater'};
var $author$project$Kind$addBedarf = F2(
	function (bedarfsTyp, model) {
		var currentList = function () {
			switch (bedarfsTyp.$) {
				case 'Mehrbedarf':
					return model.kind.mehrbedarf;
				case 'Sonderbedarf':
					return model.kind.sonderbedarf;
				default:
					return model.kind.erbrachteLeistungen;
			}
		}();
		if ($elm$core$List$length(currentList) < 5) {
			var newList = _List_fromArray(
				[
					{bezahltVon: $elm$core$Maybe$Nothing, bezeichnung: '', kosten: ''}
				]);
			var modelPerson = model.kind;
			var updatedData = function () {
				switch (bedarfsTyp.$) {
					case 'Mehrbedarf':
						return _Utils_update(
							modelPerson,
							{
								mehrbedarf: _Utils_ap(model.kind.mehrbedarf, newList)
							});
					case 'Sonderbedarf':
						return _Utils_update(
							modelPerson,
							{
								sonderbedarf: _Utils_ap(model.kind.sonderbedarf, newList)
							});
					default:
						return _Utils_update(
							modelPerson,
							{
								erbrachteLeistungen: _Utils_ap(model.kind.erbrachteLeistungen, newList)
							});
				}
			}();
			return _Utils_update(
				model,
				{kind: updatedData});
		} else {
			return _Utils_update(
				model,
				{
					error: $elm$core$Maybe$Just('Zu viele Posten (Max. 5)')
				});
		}
	});
var $author$project$Elternteil$maxPostenCount = function (postenType) {
	if (postenType.$ === 'EinkommenzumDurchschnittsberechnung') {
		return 12;
	} else {
		return 5;
	}
};
var $author$project$Elternteil$addPosten = F3(
	function (person, postenType, model) {
		var modelPerson = function () {
			if (person.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		var currentPosten = function () {
			switch (postenType.$) {
				case 'Abzugsposten':
					return modelPerson.abzugsposten;
				case 'WeitereEinkuenfte':
					return modelPerson.weitereEinkuenfte;
				default:
					return modelPerson.einkommenZumDurchschnittsberechnung;
			}
		}();
		if (_Utils_cmp(
			$elm$core$List$length(currentPosten),
			$author$project$Elternteil$maxPostenCount(postenType)) < 0) {
			var newList = function () {
				switch (postenType.$) {
					case 'Abzugsposten':
						return _List_fromArray(
							[
								{bezeichnung: '', kosten: ''}
							]);
					case 'WeitereEinkuenfte':
						return _List_fromArray(
							[
								{bezeichnung: ' ', kosten: ''}
							]);
					default:
						return _List_fromArray(
							[
								{bezeichnung: ' ', kosten: ''}
							]);
				}
			}();
			var updatedData = function () {
				switch (postenType.$) {
					case 'Abzugsposten':
						return _Utils_update(
							modelPerson,
							{
								abzugsposten: _Utils_ap(modelPerson.abzugsposten, newList)
							});
					case 'WeitereEinkuenfte':
						return _Utils_update(
							modelPerson,
							{
								weitereEinkuenfte: _Utils_ap(modelPerson.weitereEinkuenfte, newList)
							});
					default:
						return _Utils_update(
							modelPerson,
							{
								einkommenZumDurchschnittsberechnung: _Utils_ap(modelPerson.einkommenZumDurchschnittsberechnung, newList)
							});
				}
			}();
			if (person.$ === 'Vater') {
				return _Utils_update(
					model,
					{vater: updatedData});
			} else {
				return _Utils_update(
					model,
					{mutter: updatedData});
			}
		} else {
			return _Utils_update(
				model,
				{
					error: $elm$core$Maybe$Just(
						'Zu viele Posten (Max. ' + ($elm$core$String$fromInt(
							$author$project$Elternteil$maxPostenCount(postenType)) + ')'))
				});
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$core$Basics$round = _Basics_round;
var $elm$core$String$toFloat = _String_toFloat;
var $elm$core$String$trim = _String_trim;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Utils$Format$formatInputToFloat = function (input) {
	var cleaned = $elm$core$String$trim(input);
	var commaCount = $elm$core$List$length(
		A2($elm$core$String$indexes, ',', cleaned));
	var dotCount = $elm$core$List$length(
		A2($elm$core$String$indexes, '.', cleaned));
	var totalSeparators = dotCount + commaCount;
	var normalized = function () {
		if (!totalSeparators) {
			return cleaned;
		} else {
			if (totalSeparators === 1) {
				return A3($elm$core$String$replace, ',', '.', cleaned);
			} else {
				var lastDotIndex = A2(
					$elm$core$Maybe$withDefault,
					-1,
					$elm$core$List$head(
						$elm$core$List$reverse(
							A2($elm$core$String$indexes, '.', cleaned))));
				var lastCommaIndex = A2(
					$elm$core$Maybe$withDefault,
					-1,
					$elm$core$List$head(
						$elm$core$List$reverse(
							A2($elm$core$String$indexes, ',', cleaned))));
				return (_Utils_cmp(lastCommaIndex, lastDotIndex) > 0) ? A3(
					$elm$core$String$replace,
					',',
					'.',
					A3($elm$core$String$replace, '.', '', cleaned)) : A3($elm$core$String$replace, ',', '', cleaned);
			}
		}
	}();
	return A2(
		$elm$core$Maybe$map,
		function (euros) {
			return $elm$core$Basics$round(euros * 100) / 100;
		},
		$elm$core$String$toFloat(normalized));
};
var $author$project$Utils$Validation$isValidNumber = function (str) {
	var _v0 = $author$project$Utils$Format$formatInputToFloat(str);
	if (_v0.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Utils$Format$renderSelbstbehaltBetrag = function (selb) {
	switch (selb.$) {
		case 'Angemessen':
			var betrag = selb.a;
			return betrag;
		case 'NotwendigErwerbstaetig':
			var betrag = selb.a;
			return betrag;
		case 'NotwendigNichtErwerbstaetig':
			var betrag = selb.a;
			return betrag;
		default:
			var betrag = selb.a;
			return betrag;
	}
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Utils$Validation$isValidAge = function (age) {
	return (age >= 0) && (age <= 120);
};
var $author$project$Utils$Validation$isValidAgeInput = function (value) {
	var _v0 = $elm$core$String$toInt(
		$elm$core$String$trim(value));
	if (_v0.$ === 'Just') {
		var age = _v0.a;
		return $author$project$Utils$Validation$isValidAge(age);
	} else {
		return false;
	}
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Utils$Validation$isLeapYear = function (year) {
	return (!A2($elm$core$Basics$modBy, 400, year)) || ((!A2($elm$core$Basics$modBy, 4, year)) && (!(!A2($elm$core$Basics$modBy, 100, year))));
};
var $author$project$Utils$Validation$daysInMonth = F2(
	function (month, year) {
		switch (month) {
			case 2:
				return $author$project$Utils$Validation$isLeapYear(year) ? 29 : 28;
			case 4:
				return 30;
			case 6:
				return 30;
			case 9:
				return 30;
			case 11:
				return 30;
			default:
				return 31;
		}
	});
var $author$project$Utils$Validation$isValidDate = function (_v0) {
	var day = _v0.day;
	var month = _v0.month;
	var year = _v0.year;
	return (year >= 1900) && ((month >= 1) && ((month <= 12) && ((day >= 1) && (_Utils_cmp(
		day,
		A2($author$project$Utils$Validation$daysInMonth, month, year)) < 1))));
};
var $elm$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					return $elm$core$Maybe$Just(
						A3(func, a, b, c));
				}
			}
		}
	});
var $author$project$Utils$Validation$parseBirthday = function (value) {
	var _v0 = A2($elm$core$String$split, '.', value);
	if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.b.b)) {
		var dayText = _v0.a;
		var _v1 = _v0.b;
		var monthText = _v1.a;
		var _v2 = _v1.b;
		var yearText = _v2.a;
		return (($elm$core$String$length(dayText) === 2) && (($elm$core$String$length(monthText) === 2) && (($elm$core$String$length(yearText) === 4) && A2(
			$elm$core$List$all,
			$elm$core$String$all($elm$core$Char$isDigit),
			_List_fromArray(
				[dayText, monthText, yearText]))))) ? A2(
			$elm$core$Maybe$andThen,
			function (birthday) {
				return $author$project$Utils$Validation$isValidDate(birthday) ? $elm$core$Maybe$Just(birthday) : $elm$core$Maybe$Nothing;
			},
			A4(
				$elm$core$Maybe$map3,
				F3(
					function (day, month, year) {
						return {day: day, month: month, year: year};
					}),
				$elm$core$String$toInt(dayText),
				$elm$core$String$toInt(monthText),
				$elm$core$String$toInt(yearText))) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Utils$Validation$isValidBirthdayInput = function (value) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (_v0) {
				return true;
			},
			$author$project$Utils$Validation$parseBirthday(
				$elm$core$String$trim(value))));
};
var $author$project$Utils$Validation$isAgeOrBirthdayFormatValid = function (value) {
	return $author$project$Utils$Validation$isValidAgeInput(value) || $author$project$Utils$Validation$isValidBirthdayInput(value);
};
var $author$project$Utils$Validation$validateAgeOrBirthday = function (value) {
	return ($elm$core$String$trim(value) === '') ? $elm$core$Maybe$Just('Dieses Feld darf nicht leer sein.') : ($author$project$Utils$Validation$isAgeOrBirthdayFormatValid(value) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just('Bitte Alter als Zahl oder Geburtsdatum im Format TT.MM.JJJJ eingeben.'));
};
var $author$project$Utils$Validation$validateMoney = function (value) {
	return ($elm$core$String$trim(value) === '') ? $elm$core$Maybe$Nothing : ($author$project$Utils$Validation$isValidNumber(value) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just('Bitte nur Zahlen eingeben, z.B. 300 oder 300,50.'));
};
var $author$project$Utils$Validation$validateRequiredMoney = function (value) {
	return ($elm$core$String$trim(value) === '') ? $elm$core$Maybe$Just('Dieses Feld darf nicht leer sein.') : $author$project$Utils$Validation$validateMoney(value);
};
var $author$project$Utils$Validation$areInputsValid = function (model) {
	var requiredString = A2(
		$elm$core$List$filter,
		A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
		_List_fromArray(
			[model.vater.haupttaetigkeit, model.mutter.haupttaetigkeit]));
	var totalSum = $elm$core$List$sum(
		A2($elm$core$List$filterMap, $author$project$Utils$Format$formatInputToFloat, requiredString));
	var customRegelbedarfValid = (!model.customRegelbedarf) || _Utils_eq(
		$author$project$Utils$Validation$validateRequiredMoney(model.kind.regelbedarf),
		$elm$core$Maybe$Nothing);
	var allStrings = _Utils_ap(
		requiredString,
		_Utils_ap(
			_List_fromArray(
				[
					$author$project$Utils$Format$renderSelbstbehaltBetrag(model.vater.selbstbehalt),
					$author$project$Utils$Format$renderSelbstbehaltBetrag(model.mutter.selbstbehalt)
				]),
			_Utils_ap(
				A2(
					$elm$core$List$filter,
					A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
					A2(
						$elm$core$List$map,
						function ($) {
							return $.kosten;
						},
						model.vater.abzugsposten)),
				_Utils_ap(
					A2(
						$elm$core$List$filter,
						A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
						A2(
							$elm$core$List$map,
							function ($) {
								return $.kosten;
							},
							model.mutter.abzugsposten)),
					_Utils_ap(
						A2(
							$elm$core$List$filter,
							A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
							A2(
								$elm$core$List$map,
								function ($) {
									return $.kosten;
								},
								model.vater.weitereEinkuenfte)),
						_Utils_ap(
							A2(
								$elm$core$List$filter,
								A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
								A2(
									$elm$core$List$map,
									function ($) {
										return $.kosten;
									},
									model.mutter.weitereEinkuenfte)),
							_Utils_ap(
								model.durchschnittseinkommen ? A2(
									$elm$core$List$filter,
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
									A2(
										$elm$core$List$map,
										function ($) {
											return $.kosten;
										},
										_Utils_ap(model.vater.einkommenZumDurchschnittsberechnung, model.mutter.einkommenZumDurchschnittsberechnung))) : _List_Nil,
								_Utils_ap(
									A2(
										$elm$core$List$filter,
										A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
										A2(
											$elm$core$List$map,
											function ($) {
												return $.kosten;
											},
											model.kind.einkuenfte)),
									_Utils_ap(
										A2(
											$elm$core$List$filter,
											A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
											A2(
												$elm$core$List$map,
												function ($) {
													return $.kosten;
												},
												model.kind.mehrbedarf)),
										_Utils_ap(
											A2(
												$elm$core$List$filter,
												A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
												A2(
													$elm$core$List$map,
													function ($) {
														return $.kosten;
													},
													model.kind.sonderbedarf)),
											A2(
												$elm$core$List$filter,
												A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
												A2(
													$elm$core$List$map,
													function ($) {
														return $.kosten;
													},
													model.kind.erbrachteLeistungen))))))))))));
	var ageValid = _Utils_eq(
		$author$project$Utils$Validation$validateAgeOrBirthday(model.kind.alterInput),
		$elm$core$Maybe$Nothing);
	return (totalSum > 0) && (A2($elm$core$List$all, $author$project$Utils$Validation$isValidNumber, allStrings) && (customRegelbedarfValid && ageValid));
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Calculation$calculateAnteil = F2(
	function (verteilbarerBetrag, verteilbarerBetragGesamt) {
		return (!verteilbarerBetragGesamt) ? 0 : (verteilbarerBetrag / verteilbarerBetragGesamt);
	});
var $author$project$Calculation$calculateBarAnteil = F2(
	function (baranteil, anteil) {
		return baranteil * anteil;
	});
var $author$project$Calculation$calculateBereitsGezahlterZusatzbedarf = F4(
	function (person, mehrbedarf, sonderbedarf, erbrachteLeistungen) {
		var paidByPerson = function (item) {
			return _Utils_eq(
				item.bezahltVon,
				$elm$core$Maybe$Just(person));
		};
		var kosten = function (item) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$author$project$Utils$Format$formatInputToFloat(item.kosten));
		};
		return $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				kosten,
				A2(
					$elm$core$List$filter,
					paidByPerson,
					_Utils_ap(
						mehrbedarf,
						_Utils_ap(sonderbedarf, erbrachteLeistungen)))));
	});
var $author$project$Elternteil$calculateWeitereEinkuenfte = function (postenList) {
	return $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (field) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$author$project$Utils$Format$formatInputToFloat(field.kosten));
			},
			postenList));
};
var $author$project$Elternteil$calculateEinkommen = function (elternteil) {
	var weitereEinkuenfte = $author$project$Elternteil$calculateWeitereEinkuenfte(elternteil.weitereEinkuenfte);
	var haupttaetigkeit = A2(
		$elm$core$Maybe$withDefault,
		0,
		$author$project$Utils$Format$formatInputToFloat(elternteil.haupttaetigkeit));
	return haupttaetigkeit + weitereEinkuenfte;
};
var $author$project$Kind$calculateGesamtKindbedarf = F6(
	function (regelbedarf, einkuenfte, mehrbedarf, sonderbedarf, haelftigesKindergeld, alter) {
		var zusatzbedarfGes = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (item) {
					return A2(
						$elm$core$Maybe$withDefault,
						0,
						$author$project$Utils$Format$formatInputToFloat(item.kosten));
				},
				mehrbedarf)) + $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (item) {
					return A2(
						$elm$core$Maybe$withDefault,
						0,
						$author$project$Utils$Format$formatInputToFloat(item.kosten));
				},
				sonderbedarf));
		var einkuenfteGes = (alter < 18) ? ($elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (item) {
					return A2(
						$elm$core$Maybe$withDefault,
						0,
						$author$project$Utils$Format$formatInputToFloat(item.kosten));
				},
				einkuenfte)) / 2) : $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (item) {
					return A2(
						$elm$core$Maybe$withDefault,
						0,
						$author$project$Utils$Format$formatInputToFloat(item.kosten));
				},
				einkuenfte));
		return A2($elm$core$Basics$max, 0, ((regelbedarf + zusatzbedarfGes) - einkuenfteGes) - haelftigesKindergeld);
	});
var $author$project$Calculation$calculateVerteilbarerBetrag = F3(
	function (bereinigtesEinkommen, person, model) {
		var selbstbehaltString = function () {
			if (person.$ === 'Vater') {
				return $author$project$Utils$Format$renderSelbstbehaltBetrag(model.vater.selbstbehalt);
			} else {
				return $author$project$Utils$Format$renderSelbstbehaltBetrag(model.mutter.selbstbehalt);
			}
		}();
		var selbstbehalt = A2(
			$elm$core$Maybe$withDefault,
			0,
			$author$project$Utils$Format$formatInputToFloat(selbstbehaltString));
		return (_Utils_cmp(selbstbehalt, bereinigtesEinkommen) > -1) ? 0 : (bereinigtesEinkommen - selbstbehalt);
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Constants$kindergeldTabelle = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('2023', 250),
			_Utils_Tuple2('2024', 250),
			_Utils_Tuple2('2025', 255),
			_Utils_Tuple2('2026', 259)
		]));
var $author$project$Constants$getKindergeld = function (jahr) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		A2($elm$core$Dict$get, jahr, $author$project$Constants$kindergeldTabelle));
};
var $author$project$Constants$getAltersgruppe = function (age) {
	return (age <= 5) ? '0-5' : ((age <= 11) ? '6-11' : ((age <= 17) ? '12-17' : '18+'));
};
var $author$project$Constants$duesseldorferTabelle2023 = {
	eintraege: _List_fromArray(
		[
			{
			altersgruppe: '0-5',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 1900, einkommenVon: 0, regelbedarf: 437},
					{einkommenBis: 2300, einkommenVon: 1901, regelbedarf: 459},
					{einkommenBis: 2700, einkommenVon: 2301, regelbedarf: 481},
					{einkommenBis: 3100, einkommenVon: 2701, regelbedarf: 503},
					{einkommenBis: 3500, einkommenVon: 3101, regelbedarf: 525},
					{einkommenBis: 3900, einkommenVon: 3501, regelbedarf: 560},
					{einkommenBis: 4300, einkommenVon: 3901, regelbedarf: 595},
					{einkommenBis: 4700, einkommenVon: 4301, regelbedarf: 630},
					{einkommenBis: 5100, einkommenVon: 4701, regelbedarf: 665},
					{einkommenBis: 5500, einkommenVon: 5101, regelbedarf: 700},
					{einkommenBis: 6200, einkommenVon: 5501, regelbedarf: 735},
					{einkommenBis: 7000, einkommenVon: 6201, regelbedarf: 770},
					{einkommenBis: 8000, einkommenVon: 7001, regelbedarf: 805},
					{einkommenBis: 9500, einkommenVon: 8001, regelbedarf: 840},
					{einkommenBis: 11000, einkommenVon: 9501, regelbedarf: 874}
				])
		},
			{
			altersgruppe: '6-11',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 1900, einkommenVon: 0, regelbedarf: 502},
					{einkommenBis: 2300, einkommenVon: 1901, regelbedarf: 528},
					{einkommenBis: 2700, einkommenVon: 2301, regelbedarf: 553},
					{einkommenBis: 3100, einkommenVon: 2701, regelbedarf: 578},
					{einkommenBis: 3500, einkommenVon: 3101, regelbedarf: 603},
					{einkommenBis: 3900, einkommenVon: 3501, regelbedarf: 643},
					{einkommenBis: 4300, einkommenVon: 3901, regelbedarf: 683},
					{einkommenBis: 4700, einkommenVon: 4301, regelbedarf: 723},
					{einkommenBis: 5100, einkommenVon: 4701, regelbedarf: 764},
					{einkommenBis: 5500, einkommenVon: 5101, regelbedarf: 804},
					{einkommenBis: 6200, einkommenVon: 5501, regelbedarf: 844},
					{einkommenBis: 7000, einkommenVon: 6201, regelbedarf: 884},
					{einkommenBis: 8000, einkommenVon: 7001, regelbedarf: 924},
					{einkommenBis: 9500, einkommenVon: 8001, regelbedarf: 964},
					{einkommenBis: 11000, einkommenVon: 9501, regelbedarf: 1004}
				])
		},
			{
			altersgruppe: '12-17',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 1900, einkommenVon: 0, regelbedarf: 588},
					{einkommenBis: 2300, einkommenVon: 1901, regelbedarf: 618},
					{einkommenBis: 2700, einkommenVon: 2301, regelbedarf: 647},
					{einkommenBis: 3100, einkommenVon: 2701, regelbedarf: 677},
					{einkommenBis: 3500, einkommenVon: 3101, regelbedarf: 706},
					{einkommenBis: 3900, einkommenVon: 3501, regelbedarf: 753},
					{einkommenBis: 4300, einkommenVon: 3901, regelbedarf: 800},
					{einkommenBis: 4700, einkommenVon: 4301, regelbedarf: 847},
					{einkommenBis: 5100, einkommenVon: 4701, regelbedarf: 894},
					{einkommenBis: 5500, einkommenVon: 5101, regelbedarf: 941},
					{einkommenBis: 6200, einkommenVon: 5501, regelbedarf: 988},
					{einkommenBis: 7000, einkommenVon: 6201, regelbedarf: 1035},
					{einkommenBis: 8000, einkommenVon: 7001, regelbedarf: 1082},
					{einkommenBis: 9500, einkommenVon: 8001, regelbedarf: 1129},
					{einkommenBis: 11000, einkommenVon: 9501, regelbedarf: 1176}
				])
		},
			{
			altersgruppe: '18+',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 1900, einkommenVon: 0, regelbedarf: 628},
					{einkommenBis: 2300, einkommenVon: 1901, regelbedarf: 660},
					{einkommenBis: 2700, einkommenVon: 2301, regelbedarf: 691},
					{einkommenBis: 3100, einkommenVon: 2701, regelbedarf: 723},
					{einkommenBis: 3500, einkommenVon: 3101, regelbedarf: 754},
					{einkommenBis: 3900, einkommenVon: 3501, regelbedarf: 804},
					{einkommenBis: 4300, einkommenVon: 3901, regelbedarf: 855},
					{einkommenBis: 4700, einkommenVon: 4301, regelbedarf: 905},
					{einkommenBis: 5100, einkommenVon: 4701, regelbedarf: 955},
					{einkommenBis: 5500, einkommenVon: 5101, regelbedarf: 1005},
					{einkommenBis: 6200, einkommenVon: 5501, regelbedarf: 1056},
					{einkommenBis: 7000, einkommenVon: 6201, regelbedarf: 1106},
					{einkommenBis: 8000, einkommenVon: 7001, regelbedarf: 1156},
					{einkommenBis: 9500, einkommenVon: 8001, regelbedarf: 1206},
					{einkommenBis: 11000, einkommenVon: 9501, regelbedarf: 1256}
				])
		}
		]),
	jahr: '2023'
};
var $author$project$Constants$duesseldorferTabelle2024 = {
	eintraege: _List_fromArray(
		[
			{
			altersgruppe: '0-5',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 480},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 504},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 528},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 552},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 576},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 615},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 653},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 692},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 730},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 768},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 807},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 845},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 884},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 922},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 960}
				])
		},
			{
			altersgruppe: '6-11',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 551},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 579},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 607},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 634},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 662},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 706},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 750},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 794},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 838},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 882},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 926},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 970},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1014},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1058},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1102}
				])
		},
			{
			altersgruppe: '12-17',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 645},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 678},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 710},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 742},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 774},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 826},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 878},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 929},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 981},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 1032},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 1084},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1136},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1187},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1239},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1290}
				])
		},
			{
			altersgruppe: '18+',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 689},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 724},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 758},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 793},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 827},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 882},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 938},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 993},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 1048},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 1103},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 1158},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1213},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1268},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1323},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1378}
				])
		}
		]),
	jahr: '2024'
};
var $author$project$Constants$duesseldorferTabelle2025 = {
	eintraege: _List_fromArray(
		[
			{
			altersgruppe: '0-5',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 482},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 507},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 531},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 555},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 579},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 617},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 656},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 695},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 733},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 772},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 810},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 849},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 887},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 926},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 964}
				])
		},
			{
			altersgruppe: '6-11',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 554},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 582},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 610},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 638},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 665},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 710},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 754},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 798},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 843},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 887},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 931},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 976},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1020},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1064},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1108}
				])
		},
			{
			altersgruppe: '12-17',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 649},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 682},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 714},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 747},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 779},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 831},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 883},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 935},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 987},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 1039},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 1091},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1143},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1195},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1247},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1298}
				])
		},
			{
			altersgruppe: '18+',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 693},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 728},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 763},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 797},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 832},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 888},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 943},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 998},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 1054},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 1109},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 1165},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1220},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1276},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1331},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1386}
				])
		}
		]),
	jahr: '2025'
};
var $author$project$Constants$duesseldorferTabelle2026 = {
	eintraege: _List_fromArray(
		[
			{
			altersgruppe: '0-5',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 486},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 511},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 535},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 559},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 584},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 623},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 661},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 700},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 739},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 778},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 817},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 856},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 895},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 934},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 972}
				])
		},
			{
			altersgruppe: '6-11',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 558},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 586},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 614},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 642},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 670},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 715},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 759},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 804},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 849},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 893},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 938},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 983},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1027},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1072},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1116}
				])
		},
			{
			altersgruppe: '12-17',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 653},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 686},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 719},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 751},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 784},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 836},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 889},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 941},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 993},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 1045},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 1098},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1150},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1202},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1254},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1306}
				])
		},
			{
			altersgruppe: '18+',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 698},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 733},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 768},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 803},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 838},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 894},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 950},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 1006},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 1061},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 1117},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 1173},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1229},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1285},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1341},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1396}
				])
		}
		]),
	jahr: '2026'
};
var $author$project$Constants$getTabelleForYear = function (jahr) {
	switch (jahr) {
		case '2023':
			return $elm$core$Maybe$Just($author$project$Constants$duesseldorferTabelle2023);
		case '2024':
			return $elm$core$Maybe$Just($author$project$Constants$duesseldorferTabelle2024);
		case '2025':
			return $elm$core$Maybe$Just($author$project$Constants$duesseldorferTabelle2025);
		case '2026':
			return $elm$core$Maybe$Just($author$project$Constants$duesseldorferTabelle2026);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Constants$matchIncome = F2(
	function (income, _v0) {
		var einkommenVon = _v0.einkommenVon;
		var einkommenBis = _v0.einkommenBis;
		var regelbedarf = _v0.regelbedarf;
		return ((_Utils_cmp(income, einkommenVon) > -1) && (_Utils_cmp(income, einkommenBis) < 1)) ? $elm$core$Maybe$Just(regelbedarf) : $elm$core$Maybe$Nothing;
	});
var $author$project$Constants$getRegelbedarf = F3(
	function (jahr, income, alter) {
		return A2(
			$elm$core$Maybe$andThen,
			function (eintrag) {
				return $elm$core$List$head(
					A2(
						$elm$core$List$filterMap,
						$author$project$Constants$matchIncome(income),
						eintrag.einkommensgruppen));
			},
			A2(
				$elm$core$Maybe$andThen,
				function (tabelle) {
					return $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (e) {
								return _Utils_eq(
									e.altersgruppe,
									$author$project$Constants$getAltersgruppe(alter));
							},
							tabelle.eintraege));
				},
				$author$project$Constants$getTabelleForYear(jahr)));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Elternteil$sumAbzugsposten = function (postenList) {
	return $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (a) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$author$project$Utils$Format$formatInputToFloat(a.kosten));
			},
			postenList));
};
var $author$project$Calculation$calculateAusgleichsanspruch = function (model) {
	var weitereEinkuenfteVater = $author$project$Elternteil$calculateWeitereEinkuenfte(model.vater.weitereEinkuenfte);
	var weitereEinkuenfteMutter = $author$project$Elternteil$calculateWeitereEinkuenfte(model.mutter.weitereEinkuenfte);
	var kindergeld = $author$project$Constants$getKindergeld(
		$elm$core$String$trim(model.jahr));
	var gesamtAbzugsVater = $author$project$Elternteil$sumAbzugsposten(model.vater.abzugsposten);
	var gesamtAbzugsMutter = $author$project$Elternteil$sumAbzugsposten(model.mutter.abzugsposten);
	var einkommenVater = $author$project$Elternteil$calculateEinkommen(model.vater);
	var einkommenMutter = $author$project$Elternteil$calculateEinkommen(model.mutter);
	var bereinigtesEinkommenVater = einkommenVater - gesamtAbzugsVater;
	var verteilbarerBetragVater = A3($author$project$Calculation$calculateVerteilbarerBetrag, bereinigtesEinkommenVater, $author$project$Types$Vater, model);
	var bereinigtesEinkommenMutter = einkommenMutter - gesamtAbzugsMutter;
	var verteilbarerBetragMutter = A3($author$project$Calculation$calculateVerteilbarerBetrag, bereinigtesEinkommenMutter, $author$project$Types$Mutter, model);
	var verteilbarerBetragGesamt = verteilbarerBetragVater + verteilbarerBetragMutter;
	var anteilVater = A2($author$project$Calculation$calculateAnteil, verteilbarerBetragVater, verteilbarerBetragGesamt);
	var anteilMutter = A2($author$project$Calculation$calculateAnteil, verteilbarerBetragMutter, verteilbarerBetragGesamt);
	var gesamtEinkommen = (!anteilVater) ? (0 + bereinigtesEinkommenMutter) : ((!anteilMutter) ? (bereinigtesEinkommenVater + 0) : (bereinigtesEinkommenVater + bereinigtesEinkommenMutter));
	var regelbedarf = model.customRegelbedarf ? $author$project$Utils$Format$formatInputToFloat(model.kind.regelbedarf) : A3($author$project$Constants$getRegelbedarf, model.jahr, gesamtEinkommen, model.kind.alter);
	if (regelbedarf.$ === 'Nothing') {
		return {abzufuehrendesKindergeld: 0, anspruchsberechtigt: $author$project$Types$Vater, anteilMutterGesamtbedarf: 0, anteilMutterOhneZusatzbedarf: 0, anteilVaterGesamtbedarf: 0, anteilVaterOhneZusatzbedarf: 0, ausgleichsanspruch: $elm$core$Maybe$Nothing, auszugleichenderBetrag: 0, baranteilMutter: 0, baranteilVater: 0, bereinigtesEinkommenMutter: bereinigtesEinkommenMutter, bereinigtesEinkommenVater: bereinigtesEinkommenVater, betreuungsanteil: 0, differenzAnteil: 0, einkommenMutter: einkommenMutter, einkommenVater: einkommenVater, gesamtAbzugMutter: 0, gesamtAbzugVater: 0, gesamtEinkommen: gesamtEinkommen, gesamtKindbedarf_mitGetrageneZusatzbedarf: 0, gesamtKindbedarf_ohneGetrageneZusatzbedarf: 0, haftungsanteilMutter: 0, haftungsanteilVater: 0, haftungsbetragMutter: 0, haftungsbetragMutterVorBegrenzung: 0, haftungsbetragVater: 0, haftungsbetragVaterVorBegrenzung: 0, nichtanspruchsberechtigt: $author$project$Types$Mutter, regelbedarf: $elm$core$Maybe$Nothing, verteilbarerBetragGesamt: 0, verteilbarerBetragMutter: 111, verteilbarerBetragVater: 111, weitereEinkuenfteMutter: weitereEinkuenfteMutter, weitereEinkuenfteVater: weitereEinkuenfteVater};
	} else {
		var rBedarf = regelbedarf.a;
		var gesamtKindbedarf_ohneGetrageneZusatzbedarf = A6($author$project$Kind$calculateGesamtKindbedarf, rBedarf, model.kind.einkuenfte, _List_Nil, _List_Nil, kindergeld / 2, model.kind.alter);
		var gesamtKindbedarf_mitGetrageneZusatzbedarf = A6($author$project$Kind$calculateGesamtKindbedarf, rBedarf, model.kind.einkuenfte, model.kind.mehrbedarf, model.kind.sonderbedarf, kindergeld / 2, model.kind.alter);
		var haftungsbetragMutterVorBegrenzung = A2($elm$core$Maybe$withDefault, anteilMutter * gesamtKindbedarf_mitGetrageneZusatzbedarf, model.haftungsbetragMutterUebernommen);
		var haftungsbetragVaterVorBegrenzung = A2($elm$core$Maybe$withDefault, anteilVater * gesamtKindbedarf_mitGetrageneZusatzbedarf, model.haftungsbetragVaterUebernommen);
		var betreuungsanteil = (kindergeld / 2) / 2;
		var bereitsGezahlterZusatzbedarfLeistungenVater = A4($author$project$Calculation$calculateBereitsGezahlterZusatzbedarf, $author$project$Types$Vater, model.kind.mehrbedarf, model.kind.sonderbedarf, model.kind.erbrachteLeistungen);
		var bereitsGezahlterZusatzbedarfLeistungenMutter = A4($author$project$Calculation$calculateBereitsGezahlterZusatzbedarf, $author$project$Types$Mutter, model.kind.mehrbedarf, model.kind.sonderbedarf, model.kind.erbrachteLeistungen);
		var baranteil = kindergeld / 2;
		var baranteilMutter = A2($author$project$Calculation$calculateBarAnteil, baranteil, anteilMutter);
		var baranteilVater = A2($author$project$Calculation$calculateBarAnteil, baranteil, anteilVater);
		var anteil_vater_ohne_zusatzbedarf = anteilVater * gesamtKindbedarf_ohneGetrageneZusatzbedarf;
		var anteil_vater_gesamtbedarf = A2($elm$core$Basics$min, verteilbarerBetragVater, haftungsbetragVaterVorBegrenzung);
		var anteil_vater_nach_gezahltem_zusatzbedarf = _Utils_eq(model.kindergeldEmpfaenger, $author$project$Types$Vater) ? ((anteil_vater_gesamtbedarf - bereitsGezahlterZusatzbedarfLeistungenVater) + (kindergeld / 2)) : (anteil_vater_gesamtbedarf - bereitsGezahlterZusatzbedarfLeistungenVater);
		var anteil_mutter_ohne_zusatzbedarf = anteilMutter * gesamtKindbedarf_ohneGetrageneZusatzbedarf;
		var anteil_mutter_gesamtbedarf = A2($elm$core$Basics$min, verteilbarerBetragMutter, haftungsbetragMutterVorBegrenzung);
		var anteil_mutter_nach_gezahltem_zusatzbedarf = _Utils_eq(model.kindergeldEmpfaenger, $author$project$Types$Mutter) ? ((anteil_mutter_gesamtbedarf - bereitsGezahlterZusatzbedarfLeistungenMutter) + (kindergeld / 2)) : (anteil_mutter_gesamtbedarf - bereitsGezahlterZusatzbedarfLeistungenMutter);
		var differenzAnteil = $elm$core$Basics$abs(anteil_mutter_nach_gezahltem_zusatzbedarf - anteil_vater_nach_gezahltem_zusatzbedarf);
		var auszugleichender_betrag = differenzAnteil / 2;
		var anspruchsberechtigt = (_Utils_cmp(anteil_vater_nach_gezahltem_zusatzbedarf, anteil_mutter_nach_gezahltem_zusatzbedarf) > 0) ? $author$project$Types$Mutter : $author$project$Types$Vater;
		var abzufuehrendesKindergeld = function () {
			var _v1 = model.kindergeldEmpfaenger;
			if (_v1.$ === 'Mutter') {
				return betreuungsanteil + baranteilVater;
			} else {
				return betreuungsanteil + baranteilMutter;
			}
		}();
		var ausgleichsanspruch = _Utils_eq(anspruchsberechtigt, $author$project$Types$Mutter) ? (_Utils_eq(model.kindergeldEmpfaenger, $author$project$Types$Vater) ? (auszugleichender_betrag + abzufuehrendesKindergeld) : (auszugleichender_betrag - abzufuehrendesKindergeld)) : (_Utils_eq(model.kindergeldEmpfaenger, $author$project$Types$Mutter) ? (auszugleichender_betrag + abzufuehrendesKindergeld) : (auszugleichender_betrag - abzufuehrendesKindergeld));
		return {
			abzufuehrendesKindergeld: abzufuehrendesKindergeld,
			anspruchsberechtigt: anspruchsberechtigt,
			anteilMutterGesamtbedarf: anteil_mutter_nach_gezahltem_zusatzbedarf,
			anteilMutterOhneZusatzbedarf: anteil_mutter_ohne_zusatzbedarf,
			anteilVaterGesamtbedarf: anteil_vater_nach_gezahltem_zusatzbedarf,
			anteilVaterOhneZusatzbedarf: anteil_vater_ohne_zusatzbedarf,
			ausgleichsanspruch: $elm$core$Maybe$Just(ausgleichsanspruch),
			auszugleichenderBetrag: auszugleichender_betrag,
			baranteilMutter: baranteilMutter,
			baranteilVater: baranteilVater,
			bereinigtesEinkommenMutter: bereinigtesEinkommenMutter,
			bereinigtesEinkommenVater: bereinigtesEinkommenVater,
			betreuungsanteil: betreuungsanteil,
			differenzAnteil: differenzAnteil,
			einkommenMutter: einkommenMutter,
			einkommenVater: einkommenVater,
			gesamtAbzugMutter: gesamtAbzugsMutter,
			gesamtAbzugVater: gesamtAbzugsVater,
			gesamtEinkommen: gesamtEinkommen,
			gesamtKindbedarf_mitGetrageneZusatzbedarf: gesamtKindbedarf_mitGetrageneZusatzbedarf,
			gesamtKindbedarf_ohneGetrageneZusatzbedarf: gesamtKindbedarf_ohneGetrageneZusatzbedarf,
			haftungsanteilMutter: anteilMutter,
			haftungsanteilVater: anteilVater,
			haftungsbetragMutter: anteil_mutter_gesamtbedarf,
			haftungsbetragMutterVorBegrenzung: haftungsbetragMutterVorBegrenzung,
			haftungsbetragVater: anteil_vater_gesamtbedarf,
			haftungsbetragVaterVorBegrenzung: haftungsbetragVaterVorBegrenzung,
			nichtanspruchsberechtigt: _Utils_eq(anspruchsberechtigt, $author$project$Types$Vater) ? $author$project$Types$Mutter : $author$project$Types$Vater,
			regelbedarf: $elm$core$Maybe$Just(rBedarf),
			verteilbarerBetragGesamt: verteilbarerBetragGesamt,
			verteilbarerBetragMutter: verteilbarerBetragMutter,
			verteilbarerBetragVater: verteilbarerBetragVater,
			weitereEinkuenfteMutter: weitereEinkuenfteMutter,
			weitereEinkuenfteVater: weitereEinkuenfteVater
		};
	}
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$calculateDurchschnittseinkommen = function (einkommen) {
	var werte = A2(
		$elm$core$List$filterMap,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.kosten;
			},
			$author$project$Utils$Format$formatInputToFloat),
		einkommen);
	return $elm$core$List$isEmpty(werte) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
		$elm$core$List$sum(werte) / $elm$core$List$length(werte));
};
var $author$project$Elternteil$calculateGesamtEinkommen = function (model) {
	var gesamtAbzugsVater = $author$project$Elternteil$sumAbzugsposten(model.vater.abzugsposten);
	var gesamtAbzugsMutter = $author$project$Elternteil$sumAbzugsposten(model.mutter.abzugsposten);
	var einkommenVater = $author$project$Elternteil$calculateEinkommen(model.vater);
	var einkommenMutter = $author$project$Elternteil$calculateEinkommen(model.mutter);
	var bereinigtesEinkommenVater = einkommenVater - gesamtAbzugsVater;
	var bereinigtesEinkommenMutter = einkommenMutter - gesamtAbzugsMutter;
	return bereinigtesEinkommenVater + bereinigtesEinkommenMutter;
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$copyToClipboard = _Platform_outgoingPort('copyToClipboard', $elm$json$Json$Encode$string);
var $author$project$Types$Elternteil = F6(
	function (haupttaetigkeit, weitereEinkuenfte, abzugsposten, selbstbehalt, showSelbstbehaltOptions, einkommenZumDurchschnittsberechnung) {
		return {abzugsposten: abzugsposten, einkommenZumDurchschnittsberechnung: einkommenZumDurchschnittsberechnung, haupttaetigkeit: haupttaetigkeit, selbstbehalt: selbstbehalt, showSelbstbehaltOptions: showSelbstbehaltOptions, weitereEinkuenfte: weitereEinkuenfte};
	});
var $author$project$Types$Benutzerdefiniert = function (a) {
	return {$: 'Benutzerdefiniert', a: a};
};
var $author$project$Types$NotwendigErwerbstaetig = function (a) {
	return {$: 'NotwendigErwerbstaetig', a: a};
};
var $author$project$Types$NotwendigNichtErwerbstaetig = function (a) {
	return {$: 'NotwendigNichtErwerbstaetig', a: a};
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$ImportExport$decodeSelbstbehalt = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$andThen,
			function (typeString) {
				switch (typeString) {
					case 'Angemessen':
						return A2(
							$elm$json$Json$Decode$map,
							$author$project$Types$Angemessen,
							A2($elm$json$Json$Decode$field, 'betrag', $elm$json$Json$Decode$string));
					case 'NotwendigErwerbstaetig':
						return A2(
							$elm$json$Json$Decode$map,
							$author$project$Types$NotwendigErwerbstaetig,
							A2($elm$json$Json$Decode$field, 'betrag', $elm$json$Json$Decode$string));
					case 'NotwendigNichtErwerbstaetig':
						return A2(
							$elm$json$Json$Decode$map,
							$author$project$Types$NotwendigNichtErwerbstaetig,
							A2($elm$json$Json$Decode$field, 'betrag', $elm$json$Json$Decode$string));
					case 'Benutzerdefiniert':
						return A2(
							$elm$json$Json$Decode$map,
							$author$project$Types$Benutzerdefiniert,
							A2($elm$json$Json$Decode$field, 'betrag', $elm$json$Json$Decode$string));
					default:
						return $elm$json$Json$Decode$fail('Unknown Selbstbehalt typ: ' + typeString);
				}
			},
			A2($elm$json$Json$Decode$field, 'typ', $elm$json$Json$Decode$string))
		]));
var $author$project$Types$StringFieldType = F2(
	function (kosten, bezeichnung) {
		return {bezeichnung: bezeichnung, kosten: kosten};
	});
var $author$project$ImportExport$decodeStringFieldType = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$StringFieldType,
	A2($elm$json$Json$Decode$field, 'kos', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'bez', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map6 = _Json_map6;
var $author$project$ImportExport$decodeElternteil = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Types$Elternteil,
	A2($elm$json$Json$Decode$field, 'hp', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'we',
		$elm$json$Json$Decode$list($author$project$ImportExport$decodeStringFieldType)),
	A2(
		$elm$json$Json$Decode$field,
		'abz',
		$elm$json$Json$Decode$list($author$project$ImportExport$decodeStringFieldType)),
	A2($elm$json$Json$Decode$field, 'slb', $author$project$ImportExport$decodeSelbstbehalt),
	$elm$json$Json$Decode$succeed(false),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'avg',
				$elm$json$Json$Decode$list($author$project$ImportExport$decodeStringFieldType)),
				$elm$json$Json$Decode$succeed(
				_List_fromArray(
					[
						{bezeichnung: ' ', kosten: ''}
					]))
			])));
var $author$project$Types$Kind = F7(
	function (alter, alterInput, mehrbedarf, sonderbedarf, erbrachteLeistungen, einkuenfte, regelbedarf) {
		return {alter: alter, alterInput: alterInput, einkuenfte: einkuenfte, erbrachteLeistungen: erbrachteLeistungen, mehrbedarf: mehrbedarf, regelbedarf: regelbedarf, sonderbedarf: sonderbedarf};
	});
var $author$project$Types$ZusatzbedarfTyp = F3(
	function (kosten, bezeichnung, bezahltVon) {
		return {bezahltVon: bezahltVon, bezeichnung: bezeichnung, kosten: kosten};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Utils$Format$stringToMaybePerson = function (str) {
	switch (str) {
		case 'Vater':
			return $elm$core$Maybe$Just($author$project$Types$Vater);
		case 'Mutter':
			return $elm$core$Maybe$Just($author$project$Types$Mutter);
		case 'Nicht angegeben':
			return $elm$core$Maybe$Nothing;
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$ImportExport$decodeZusatzbedarf = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Types$ZusatzbedarfTyp,
	A2($elm$json$Json$Decode$field, 'kos', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'bez', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'bezahltVon',
		A2(
			$elm$json$Json$Decode$andThen,
			A2($elm$core$Basics$composeL, $elm$json$Json$Decode$succeed, $author$project$Utils$Format$stringToMaybePerson),
			$elm$json$Json$Decode$string)));
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map7 = _Json_map7;
var $author$project$ImportExport$decodeKind = A8(
	$elm$json$Json$Decode$map7,
	$author$project$Types$Kind,
	A2($elm$json$Json$Decode$field, 'alt', $elm$json$Json$Decode$int),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'alti', $elm$json$Json$Decode$string),
				A2(
				$elm$json$Json$Decode$map,
				$elm$core$String$fromInt,
				A2($elm$json$Json$Decode$field, 'alt', $elm$json$Json$Decode$int))
			])),
	A2(
		$elm$json$Json$Decode$field,
		'mehr',
		$elm$json$Json$Decode$list($author$project$ImportExport$decodeZusatzbedarf)),
	A2(
		$elm$json$Json$Decode$field,
		'sonder',
		$elm$json$Json$Decode$list($author$project$ImportExport$decodeZusatzbedarf)),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'erbrachteLeistungen',
				$elm$json$Json$Decode$list($author$project$ImportExport$decodeZusatzbedarf)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	A2(
		$elm$json$Json$Decode$field,
		'eink',
		$elm$json$Json$Decode$list($author$project$ImportExport$decodeStringFieldType)),
	A2($elm$json$Json$Decode$field, 'reg', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$map8 = _Json_map8;
var $author$project$ImportExport$decodeQRCodeData = A9(
	$elm$json$Json$Decode$map8,
	F8(
		function (monat, jahr, kind, vater, mutter, kindergeldEmpfaenger, freitext, customRegelbedarf) {
			return {customRegelbedarf: customRegelbedarf, freitext: freitext, jahr: jahr, kind: kind, kindergeldEmpfaenger: kindergeldEmpfaenger, monat: monat, mutter: mutter, vater: vater};
		}),
	A2($elm$json$Json$Decode$field, 'mo', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'ja', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'ki', $author$project$ImportExport$decodeKind),
	A2($elm$json$Json$Decode$field, 'vat', $author$project$ImportExport$decodeElternteil),
	A2($elm$json$Json$Decode$field, 'mut', $author$project$ImportExport$decodeElternteil),
	A2($elm$json$Json$Decode$field, 'kemp', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'frei', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'togCustomReg', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Main$downloadFile = _Platform_outgoingPort(
	'downloadFile',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'content',
					$elm$json$Json$Encode$string($.content)),
					_Utils_Tuple2(
					'mimeType',
					$elm$json$Json$Encode$string($.mimeType)),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string($.name))
				]));
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Utils$Format$formatEuroRounded = function (number) {
	var roundedUp = $elm$core$Basics$round(number * 100) / 100;
	var parts = A2(
		$elm$core$String$split,
		'.',
		$elm$core$String$fromFloat(roundedUp));
	var euros = A2(
		$elm$core$Maybe$withDefault,
		'0',
		$elm$core$List$head(parts));
	var cents = function () {
		var _v0 = $elm$core$List$tail(parts);
		if (((_v0.$ === 'Just') && _v0.a.b) && (!_v0.a.b.b)) {
			var _v1 = _v0.a;
			var decimals = _v1.a;
			return A3(
				$elm$core$String$padRight,
				2,
				_Utils_chr('0'),
				A2($elm$core$String$left, 2, decimals));
		} else {
			return '00';
		}
	}();
	return euros + (',' + cents);
};
var $author$project$ImportExport$encodeSelbstbehalt = function (selbstbehalt) {
	switch (selbstbehalt.$) {
		case 'Angemessen':
			var betrag = selbstbehalt.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'typ',
						$elm$json$Json$Encode$string('Angemessen')),
						_Utils_Tuple2(
						'betrag',
						$elm$json$Json$Encode$string(
							$author$project$Utils$Format$formatEuroRounded(
								A2(
									$elm$core$Maybe$withDefault,
									0,
									$author$project$Utils$Format$formatInputToFloat(betrag)))))
					]));
		case 'NotwendigErwerbstaetig':
			var betrag = selbstbehalt.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'typ',
						$elm$json$Json$Encode$string('NotwendigErwerbstaetig')),
						_Utils_Tuple2(
						'betrag',
						$elm$json$Json$Encode$string(
							$author$project$Utils$Format$formatEuroRounded(
								A2(
									$elm$core$Maybe$withDefault,
									0,
									$author$project$Utils$Format$formatInputToFloat(betrag)))))
					]));
		case 'NotwendigNichtErwerbstaetig':
			var betrag = selbstbehalt.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'typ',
						$elm$json$Json$Encode$string('NotwendigNichtErwerbstaetig')),
						_Utils_Tuple2(
						'betrag',
						$elm$json$Json$Encode$string(
							$author$project$Utils$Format$formatEuroRounded(
								A2(
									$elm$core$Maybe$withDefault,
									0,
									$author$project$Utils$Format$formatInputToFloat(betrag)))))
					]));
		default:
			var betrag = selbstbehalt.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'typ',
						$elm$json$Json$Encode$string('Benutzerdefiniert')),
						_Utils_Tuple2(
						'betrag',
						$elm$json$Json$Encode$string(
							$author$project$Utils$Format$formatEuroRounded(
								A2(
									$elm$core$Maybe$withDefault,
									0,
									$author$project$Utils$Format$formatInputToFloat(betrag)))))
					]));
	}
};
var $author$project$ImportExport$encodeStringFieldType = function (field) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'kos',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(
						A2(
							$elm$core$Maybe$withDefault,
							0,
							$author$project$Utils$Format$formatInputToFloat(field.kosten))))),
				_Utils_Tuple2(
				'bez',
				$elm$json$Json$Encode$string(field.bezeichnung))
			]));
};
var $author$project$ImportExport$getStringBezahltVon = function (maybePerson) {
	if (maybePerson.$ === 'Nothing') {
		return 'Nicht angegeben';
	} else {
		if (maybePerson.a.$ === 'Vater') {
			var _v1 = maybePerson.a;
			return 'Vater';
		} else {
			var _v2 = maybePerson.a;
			return 'Mutter';
		}
	}
};
var $author$project$ImportExport$encodeZusatzbedarf = function (field) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'kos',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(
						A2(
							$elm$core$Maybe$withDefault,
							0,
							$author$project$Utils$Format$formatInputToFloat(field.kosten))))),
				_Utils_Tuple2(
				'bez',
				$elm$json$Json$Encode$string(field.bezeichnung)),
				_Utils_Tuple2(
				'bezahltVon',
				$elm$json$Json$Encode$string(
					$author$project$ImportExport$getStringBezahltVon(field.bezahltVon)))
			]));
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Utils$Format$personToString = function (person) {
	if (person.$ === 'Vater') {
		return 'Vater';
	} else {
		return 'Mutter';
	}
};
var $author$project$ImportExport$encodeModeltoQRCode = function (model) {
	var qrData = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'mo',
				$elm$json$Json$Encode$string(model.monat)),
				_Utils_Tuple2(
				'ja',
				$elm$json$Json$Encode$string(model.jahr)),
				_Utils_Tuple2(
				'ki',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'alt',
							$elm$json$Json$Encode$int(model.kind.alter)),
							_Utils_Tuple2(
							'alti',
							$elm$json$Json$Encode$string(model.kind.alterInput)),
							_Utils_Tuple2(
							'mehr',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeZusatzbedarf, model.kind.mehrbedarf)),
							_Utils_Tuple2(
							'sonder',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeZusatzbedarf, model.kind.sonderbedarf)),
							_Utils_Tuple2(
							'erbrachteLeistungen',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeZusatzbedarf, model.kind.erbrachteLeistungen)),
							_Utils_Tuple2(
							'eink',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeStringFieldType, model.kind.einkuenfte)),
							_Utils_Tuple2(
							'reg',
							$elm$json$Json$Encode$string(model.kind.regelbedarf))
						]))),
				_Utils_Tuple2(
				'vat',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'hp',
							$elm$json$Json$Encode$string(model.vater.haupttaetigkeit)),
							_Utils_Tuple2(
							'we',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeStringFieldType, model.vater.weitereEinkuenfte)),
							_Utils_Tuple2(
							'abz',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeStringFieldType, model.vater.abzugsposten)),
							_Utils_Tuple2(
							'slb',
							$author$project$ImportExport$encodeSelbstbehalt(model.vater.selbstbehalt)),
							_Utils_Tuple2(
							'avg',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeStringFieldType, model.vater.einkommenZumDurchschnittsberechnung))
						]))),
				_Utils_Tuple2(
				'mut',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'hp',
							$elm$json$Json$Encode$string(model.mutter.haupttaetigkeit)),
							_Utils_Tuple2(
							'we',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeStringFieldType, model.mutter.weitereEinkuenfte)),
							_Utils_Tuple2(
							'abz',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeStringFieldType, model.mutter.abzugsposten)),
							_Utils_Tuple2(
							'slb',
							$author$project$ImportExport$encodeSelbstbehalt(model.mutter.selbstbehalt)),
							_Utils_Tuple2(
							'avg',
							A2($elm$json$Json$Encode$list, $author$project$ImportExport$encodeStringFieldType, model.mutter.einkommenZumDurchschnittsberechnung))
						]))),
				_Utils_Tuple2(
				'kemp',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$personToString(model.kindergeldEmpfaenger))),
				_Utils_Tuple2(
				'frei',
				$elm$json$Json$Encode$string(model.freitext)),
				_Utils_Tuple2(
				'togCustomReg',
				$elm$json$Json$Encode$bool(model.customRegelbedarf))
			]));
	return A2($elm$json$Json$Encode$encode, 0, qrData);
};
var $author$project$Elternteil$getAkusativElternTitle = function (person) {
	if (person.$ === 'Vater') {
		return 'den Kindsvater';
	} else {
		return 'die Kindsmutter';
	}
};
var $author$project$Elternteil$getDativElternTitle = function (person) {
	if (person.$ === 'Vater') {
		return 'dem Kindsvater';
	} else {
		return 'der Kindsmutter';
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Quartile = {$: 'Quartile'};
var $pablohirafuji$elm_qrcode$QRCode$QRCode = function (a) {
	return {$: 'QRCode', a: a};
};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex = F3(
	function (size, row, col) {
		return (size * row) + col;
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$isOccupy = F4(
	function (row, col, size, matrix) {
		var _v0 = A2(
			$elm$core$Array$get,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			matrix);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Just')) {
			return true;
		} else {
			return false;
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$nextModule = function (placement) {
	var row = placement.row;
	var col = placement.col;
	var isRight = placement.isRight;
	var isUp = placement.isUp;
	return isRight ? _Utils_update(
		placement,
		{col: col - 1, isRight: false}) : (isUp ? _Utils_update(
		placement,
		{col: col + 1, isRight: true, row: row - 1}) : _Utils_update(
		placement,
		{col: col + 1, isRight: true, row: row + 1}));
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$bitToColor = F2(
	function (_byte, offset) {
		return (1 & (_byte >> (7 - offset))) === 1;
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setDataModule = F3(
	function (_v0, _byte, offset) {
		var size = _v0.size;
		var row = _v0.row;
		var col = _v0.col;
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(
					false,
					A2($pablohirafuji$elm_qrcode$QRCode$Matrix$bitToColor, _byte, offset))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$addDataModule = F4(
	function (placement, bytes, offset, matrix) {
		addDataModule:
		while (true) {
			var size = placement.size;
			var row = placement.row;
			var col = placement.col;
			if (!bytes.b) {
				return matrix;
			} else {
				var head = bytes.a;
				var tail = bytes.b;
				if (offset >= 8) {
					var $temp$placement = placement,
						$temp$bytes = tail,
						$temp$offset = 0,
						$temp$matrix = matrix;
					placement = $temp$placement;
					bytes = $temp$bytes;
					offset = $temp$offset;
					matrix = $temp$matrix;
					continue addDataModule;
				} else {
					if (col === 6) {
						var $temp$placement = _Utils_update(
							placement,
							{col: col - 1, isRight: true}),
							$temp$bytes = bytes,
							$temp$offset = offset,
							$temp$matrix = matrix;
						placement = $temp$placement;
						bytes = $temp$bytes;
						offset = $temp$offset;
						matrix = $temp$matrix;
						continue addDataModule;
					} else {
						if (row < 0) {
							var $temp$placement = _Utils_update(
								placement,
								{col: col - 2, isRight: true, isUp: false, row: 0}),
								$temp$bytes = bytes,
								$temp$offset = offset,
								$temp$matrix = matrix;
							placement = $temp$placement;
							bytes = $temp$bytes;
							offset = $temp$offset;
							matrix = $temp$matrix;
							continue addDataModule;
						} else {
							if (_Utils_cmp(row, size) > -1) {
								var $temp$placement = _Utils_update(
									placement,
									{col: col - 2, isRight: true, isUp: true, row: size - 1}),
									$temp$bytes = bytes,
									$temp$offset = offset,
									$temp$matrix = matrix;
								placement = $temp$placement;
								bytes = $temp$bytes;
								offset = $temp$offset;
								matrix = $temp$matrix;
								continue addDataModule;
							} else {
								if (A4($pablohirafuji$elm_qrcode$QRCode$Matrix$isOccupy, row, col, size, matrix)) {
									var $temp$placement = $pablohirafuji$elm_qrcode$QRCode$Matrix$nextModule(placement),
										$temp$bytes = bytes,
										$temp$offset = offset,
										$temp$matrix = matrix;
									placement = $temp$placement;
									bytes = $temp$bytes;
									offset = $temp$offset;
									matrix = $temp$matrix;
									continue addDataModule;
								} else {
									var $temp$placement = $pablohirafuji$elm_qrcode$QRCode$Matrix$nextModule(placement),
										$temp$bytes = bytes,
										$temp$offset = offset + 1,
										$temp$matrix = A4($pablohirafuji$elm_qrcode$QRCode$Matrix$setDataModule, placement, head, offset, matrix);
									placement = $temp$placement;
									bytes = $temp$bytes;
									offset = $temp$offset;
									matrix = $temp$matrix;
									continue addDataModule;
								}
							}
						}
					}
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$initPlacement = function (size) {
	return {col: size + 1, isRight: true, isUp: true, row: size + 1, size: size};
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$addData = F3(
	function (size, bytes, matrix) {
		return A4(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$addDataModule,
			$pablohirafuji$elm_qrcode$QRCode$Matrix$initPlacement(size),
			bytes,
			0,
			matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$Error$AlignmentPatternNotFound = {$: 'AlignmentPatternNotFound'};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentPatternData = $elm$core$Array$fromList(
	_List_fromArray(
		[
			_List_Nil,
			_List_fromArray(
			[6, 18]),
			_List_fromArray(
			[6, 22]),
			_List_fromArray(
			[6, 26]),
			_List_fromArray(
			[6, 30]),
			_List_fromArray(
			[6, 34]),
			_List_fromArray(
			[6, 22, 38]),
			_List_fromArray(
			[6, 24, 42]),
			_List_fromArray(
			[6, 26, 46]),
			_List_fromArray(
			[6, 28, 50]),
			_List_fromArray(
			[6, 30, 54]),
			_List_fromArray(
			[6, 32, 58]),
			_List_fromArray(
			[6, 34, 62]),
			_List_fromArray(
			[6, 26, 46, 66]),
			_List_fromArray(
			[6, 26, 48, 70]),
			_List_fromArray(
			[6, 26, 50, 74]),
			_List_fromArray(
			[6, 30, 54, 78]),
			_List_fromArray(
			[6, 30, 56, 82]),
			_List_fromArray(
			[6, 30, 58, 86]),
			_List_fromArray(
			[6, 34, 62, 90]),
			_List_fromArray(
			[6, 28, 50, 72, 94]),
			_List_fromArray(
			[6, 26, 50, 74, 98]),
			_List_fromArray(
			[6, 30, 54, 78, 102]),
			_List_fromArray(
			[6, 28, 54, 80, 106]),
			_List_fromArray(
			[6, 32, 58, 84, 110]),
			_List_fromArray(
			[6, 30, 58, 86, 114]),
			_List_fromArray(
			[6, 34, 62, 90, 118]),
			_List_fromArray(
			[6, 26, 50, 74, 98, 122]),
			_List_fromArray(
			[6, 30, 54, 78, 102, 126]),
			_List_fromArray(
			[6, 26, 52, 78, 104, 130]),
			_List_fromArray(
			[6, 30, 56, 82, 108, 134]),
			_List_fromArray(
			[6, 34, 60, 86, 112, 138]),
			_List_fromArray(
			[6, 30, 58, 86, 114, 142]),
			_List_fromArray(
			[6, 34, 62, 90, 118, 146]),
			_List_fromArray(
			[6, 30, 54, 78, 102, 126, 150]),
			_List_fromArray(
			[6, 24, 50, 76, 102, 128, 154]),
			_List_fromArray(
			[6, 28, 54, 80, 106, 132, 158]),
			_List_fromArray(
			[6, 32, 58, 84, 110, 136, 162]),
			_List_fromArray(
			[6, 26, 54, 82, 110, 138, 166]),
			_List_fromArray(
			[6, 30, 58, 86, 114, 142, 170])
		]));
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (maybe.$ === 'Just') {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getAreaCoord = F2(
	function (rows, cols) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (row, list) {
					return A3(
						$elm$core$List$foldl,
						F2(
							function (col, list_) {
								return A2(
									$elm$core$List$cons,
									_Utils_Tuple2(row, col),
									list_);
							}),
						list,
						cols);
				}),
			_List_Nil,
			rows);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$isValidAlign = F2(
	function (size, _v0) {
		var row = _v0.a;
		var col = _v0.b;
		return ((row > 10) || ((10 < col) && (_Utils_cmp(col, size - 10) < 0))) && ((_Utils_cmp(row, size - 10) < 0) || (col > 10));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentRange = A2($elm$core$List$range, -2, 2);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentColor = F2(
	function (row, col) {
		return (_Utils_eq(row, -2) || ((row === 2) || (_Utils_eq(col, -2) || ((col === 2) || ((!row) && (!col)))))) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(true, true)) : $elm$core$Maybe$Just(
			_Utils_Tuple2(true, false));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignModule = F4(
	function (size, rowPos, colPos, _v0) {
		var row = _v0.a;
		var col = _v0.b;
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row + rowPos, col + colPos),
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentColor, row, col));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignment = F3(
	function (size, _v0, matrix) {
		var row = _v0.a;
		var col = _v0.b;
		return A3(
			$elm$core$List$foldl,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignModule, size, row, col),
			matrix,
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getAreaCoord, $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentRange, $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentRange));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignments = F3(
	function (size, locations, matrix) {
		return A3(
			$elm$core$List$foldl,
			$pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignment(size),
			matrix,
			A2(
				$elm$core$List$filter,
				$pablohirafuji$elm_qrcode$QRCode$Matrix$isValidAlign(size),
				A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getAreaCoord, locations, locations)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentPattern = F3(
	function (version, size, matrix) {
		return A2(
			$elm$core$Result$map,
			function (a) {
				return A3($pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignments, size, a, matrix);
			},
			A2(
				$elm$core$Result$fromMaybe,
				$pablohirafuji$elm_qrcode$QRCode$Error$AlignmentPatternNotFound,
				A2($elm$core$Array$get, version - 1, $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentPatternData)));
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$darkModule = F2(
	function (version, size) {
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, (4 * version) + 9, 8),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(true, true)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$finderRange = A2($elm$core$List$range, 0, 8);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$finderColor = F2(
	function (row, col) {
		return ((1 <= row) && ((row <= 7) && ((col === 1) || (col === 7)))) || (((1 <= col) && ((col <= 7) && ((row === 1) || (row === 7)))) || ((3 <= row) && ((row <= 5) && ((3 <= col) && (col <= 5)))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setFinder = F5(
	function (size, rowOffset, colOffset, _v0, matrix) {
		var row = _v0.a;
		var col = _v0.b;
		var finalRow = row + rowOffset;
		var finalCol = col + colOffset;
		return ((finalRow < 0) || ((finalCol < 0) || ((_Utils_cmp(finalRow, size) > -1) || (_Utils_cmp(finalCol, size) > -1)))) ? matrix : A3(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, finalRow, finalCol),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(
					true,
					A2($pablohirafuji$elm_qrcode$QRCode$Matrix$finderColor, row, col))),
			matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$finderPattern = F4(
	function (size, rowOffset, colOffset, matrix) {
		return A3(
			$elm$core$List$foldl,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$setFinder, size, rowOffset, colOffset),
			matrix,
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getAreaCoord, $pablohirafuji$elm_qrcode$QRCode$Matrix$finderRange, $pablohirafuji$elm_qrcode$QRCode$Matrix$finderRange));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$applyMaskColor = F2(
	function (maybeModule, isChange) {
		if (isChange) {
			if ((maybeModule.$ === 'Just') && (!maybeModule.a.a)) {
				var _v1 = maybeModule.a;
				var isDark = _v1.b;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(false, !isDark));
			} else {
				return maybeModule;
			}
		} else {
			return maybeModule;
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getCoord = F2(
	function (size, index) {
		return _Utils_Tuple2(
			(index / size) | 0,
			A2($elm$core$Basics$modBy, size, index));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$applyMaskFunction = F4(
	function (_function, size, index, maybeModule) {
		return A2(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$applyMaskColor,
			maybeModule,
			_function(
				A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getCoord, size, index)));
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			nodeList: _List_Nil,
			nodeListSize: 0,
			tail: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.nodeListSize * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						nodeList: A2($elm$core$List$cons, mappedLeaf, builder.nodeList),
						nodeListSize: builder.nodeListSize + 1,
						tail: builder.tail
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$maskFunction = function (mask) {
	switch (mask.$) {
		case 'Pattern0':
			return function (_v1) {
				var row = _v1.a;
				var col = _v1.b;
				return !A2($elm$core$Basics$modBy, 2, row + col);
			};
		case 'Pattern1':
			return function (_v2) {
				var row = _v2.a;
				return !A2($elm$core$Basics$modBy, 2, row);
			};
		case 'Pattern2':
			return function (_v3) {
				var col = _v3.b;
				return !A2($elm$core$Basics$modBy, 3, col);
			};
		case 'Pattern3':
			return function (_v4) {
				var row = _v4.a;
				var col = _v4.b;
				return !A2($elm$core$Basics$modBy, 3, row + col);
			};
		case 'Pattern4':
			return function (_v5) {
				var row = _v5.a;
				var col = _v5.b;
				return !A2(
					$elm$core$Basics$modBy,
					2,
					$elm$core$Basics$floor(row / 2) + $elm$core$Basics$floor(col / 3));
			};
		case 'Pattern5':
			return function (_v6) {
				var row = _v6.a;
				var col = _v6.b;
				return !(A2($elm$core$Basics$modBy, 2, row * col) + A2($elm$core$Basics$modBy, 3, row * col));
			};
		case 'Pattern6':
			return function (_v7) {
				var row = _v7.a;
				var col = _v7.b;
				return !A2(
					$elm$core$Basics$modBy,
					2,
					A2($elm$core$Basics$modBy, 2, row * col) + A2($elm$core$Basics$modBy, 3, row * col));
			};
		default:
			return function (_v8) {
				var row = _v8.a;
				var col = _v8.b;
				return !A2(
					$elm$core$Basics$modBy,
					2,
					A2($elm$core$Basics$modBy, 3, row * col) + A2($elm$core$Basics$modBy, 2, row + col));
			};
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$applyMask = F3(
	function (size, mask, matrix) {
		return A2(
			$elm$core$Array$indexedMap,
			A2(
				$pablohirafuji$elm_qrcode$QRCode$Matrix$applyMaskFunction,
				$pablohirafuji$elm_qrcode$QRCode$Matrix$maskFunction(mask),
				size),
			matrix);
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$breakList = F3(
	function (width, list, acc) {
		breakList:
		while (true) {
			if (!list.b) {
				return $elm$core$List$reverse(acc);
			} else {
				var $temp$width = width,
					$temp$list = A2($elm$core$List$drop, width, list),
					$temp$acc = A2(
					$elm$core$List$cons,
					A2($elm$core$List$take, width, list),
					acc);
				width = $temp$width;
				list = $temp$list;
				acc = $temp$acc;
				continue breakList;
			}
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$isDarkModule = A2(
	$elm$core$Basics$composeR,
	$elm$core$Maybe$map($elm$core$Tuple$second),
	$elm$core$Maybe$withDefault(false));
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score_ = F2(
	function (simplifiedList, _v0) {
		rule1Score_:
		while (true) {
			var last = _v0.a;
			var partialScore = _v0.b;
			var score = _v0.c;
			if (!simplifiedList.b) {
				return (partialScore >= 5) ? ((score + partialScore) - 2) : score;
			} else {
				var head = simplifiedList.a;
				var tail = simplifiedList.b;
				if (_Utils_eq(last, head)) {
					var $temp$simplifiedList = tail,
						$temp$_v0 = _Utils_Tuple3(last, partialScore + 1, score);
					simplifiedList = $temp$simplifiedList;
					_v0 = $temp$_v0;
					continue rule1Score_;
				} else {
					if (partialScore >= 5) {
						var $temp$simplifiedList = tail,
							$temp$_v0 = _Utils_Tuple3(head, 0, (score + partialScore) - 2);
						simplifiedList = $temp$simplifiedList;
						_v0 = $temp$_v0;
						continue rule1Score_;
					} else {
						var $temp$simplifiedList = tail,
							$temp$_v0 = _Utils_Tuple3(head, 0, score);
						simplifiedList = $temp$simplifiedList;
						_v0 = $temp$_v0;
						continue rule1Score_;
					}
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$map(
		function (a) {
			return A2(
				$pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score_,
				a,
				_Utils_Tuple3(false, 0, 0));
		}),
	$elm$core$List$sum);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule2Score_ = F4(
	function (row1, row2, maybeLast, score) {
		rule2Score_:
		while (true) {
			if (!row1.b) {
				return score;
			} else {
				var head = row1.a;
				var tail = row1.b;
				if (!row2.b) {
					return score;
				} else {
					var head2 = row2.a;
					var tail2 = row2.b;
					if (_Utils_eq(head, head2)) {
						if (_Utils_eq(
							$elm$core$Maybe$Just(head),
							maybeLast)) {
							var $temp$row1 = tail,
								$temp$row2 = tail2,
								$temp$maybeLast = $elm$core$Maybe$Just(head),
								$temp$score = score + 3;
							row1 = $temp$row1;
							row2 = $temp$row2;
							maybeLast = $temp$maybeLast;
							score = $temp$score;
							continue rule2Score_;
						} else {
							var $temp$row1 = tail,
								$temp$row2 = tail2,
								$temp$maybeLast = $elm$core$Maybe$Just(head),
								$temp$score = score;
							row1 = $temp$row1;
							row2 = $temp$row2;
							maybeLast = $temp$maybeLast;
							score = $temp$score;
							continue rule2Score_;
						}
					} else {
						var $temp$row1 = tail,
							$temp$row2 = tail2,
							$temp$maybeLast = $elm$core$Maybe$Nothing,
							$temp$score = score;
						row1 = $temp$row1;
						row2 = $temp$row2;
						maybeLast = $temp$maybeLast;
						score = $temp$score;
						continue rule2Score_;
					}
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule2Score = F2(
	function (list, score) {
		rule2Score:
		while (true) {
			if (list.b && list.b.b) {
				var head1 = list.a;
				var _v1 = list.b;
				var head2 = _v1.a;
				var tail = _v1.b;
				var $temp$list = tail,
					$temp$score = score + A4($pablohirafuji$elm_qrcode$QRCode$Matrix$rule2Score_, head1, head2, $elm$core$Maybe$Nothing, 0);
				list = $temp$list;
				score = $temp$score;
				continue rule2Score;
			} else {
				return score;
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score_ = F2(
	function (simplifiedList, score) {
		rule3Score_:
		while (true) {
			_v0$3:
			while (true) {
				if (!simplifiedList.b) {
					return score;
				} else {
					if (!simplifiedList.a) {
						if (((((((((((((((((((simplifiedList.b.b && (!simplifiedList.b.a)) && simplifiedList.b.b.b) && (!simplifiedList.b.b.a)) && simplifiedList.b.b.b.b) && (!simplifiedList.b.b.b.a)) && simplifiedList.b.b.b.b.b) && simplifiedList.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.b.b.b.b.a) {
							var _v1 = simplifiedList.b;
							var _v2 = _v1.b;
							var _v3 = _v2.b;
							var _v4 = _v3.b;
							var _v5 = _v4.b;
							var _v6 = _v5.b;
							var _v7 = _v6.b;
							var _v8 = _v7.b;
							var _v9 = _v8.b;
							var _v10 = _v9.b;
							var tail = _v10.b;
							var $temp$simplifiedList = tail,
								$temp$score = score + 40;
							simplifiedList = $temp$simplifiedList;
							score = $temp$score;
							continue rule3Score_;
						} else {
							break _v0$3;
						}
					} else {
						if (((((((((((((((((((simplifiedList.b.b && (!simplifiedList.b.a)) && simplifiedList.b.b.b) && simplifiedList.b.b.a) && simplifiedList.b.b.b.b) && simplifiedList.b.b.b.a) && simplifiedList.b.b.b.b.b) && simplifiedList.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.b.b.b.a)) {
							var _v11 = simplifiedList.b;
							var _v12 = _v11.b;
							var _v13 = _v12.b;
							var _v14 = _v13.b;
							var _v15 = _v14.b;
							var _v16 = _v15.b;
							var _v17 = _v16.b;
							var _v18 = _v17.b;
							var _v19 = _v18.b;
							var _v20 = _v19.b;
							var tail = _v20.b;
							var $temp$simplifiedList = tail,
								$temp$score = score + 40;
							simplifiedList = $temp$simplifiedList;
							score = $temp$score;
							continue rule3Score_;
						} else {
							break _v0$3;
						}
					}
				}
			}
			var head = simplifiedList.a;
			var tail = simplifiedList.b;
			var $temp$simplifiedList = tail,
				$temp$score = score;
			simplifiedList = $temp$simplifiedList;
			score = $temp$score;
			continue rule3Score_;
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score = A2($elm$core$List$foldl, $pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score_, 0);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule4Score = F2(
	function (size, simplifiedList) {
		var moduleCount = size * size;
		var darkCount = $elm$core$List$length(
			A2($elm$core$List$filter, $elm$core$Basics$identity, simplifiedList));
		var darkPerc = $elm$core$Basics$round((100 * darkCount) / moduleCount);
		var remOf5 = darkPerc % 5;
		var nextMult5 = $elm$core$Basics$round(
			$elm$core$Basics$abs((darkPerc + (5 - remOf5)) - 50) / 5);
		var prevMult5 = $elm$core$Basics$round(
			$elm$core$Basics$abs((darkPerc - remOf5) - 50) / 5);
		return A2($elm$core$Basics$min, prevMult5, nextMult5) * 10;
	});
var $pablohirafuji$elm_qrcode$QRCode$Helpers$transpose = function (ll) {
	transpose:
	while (true) {
		if (!ll.b) {
			return _List_Nil;
		} else {
			if (!ll.a.b) {
				var xss = ll.b;
				var $temp$ll = xss;
				ll = $temp$ll;
				continue transpose;
			} else {
				var _v1 = ll.a;
				var x = _v1.a;
				var xs = _v1.b;
				var xss = ll.b;
				var tails = A2($elm$core$List$filterMap, $elm$core$List$tail, xss);
				var heads = A2($elm$core$List$filterMap, $elm$core$List$head, xss);
				return A2(
					$elm$core$List$cons,
					A2($elm$core$List$cons, x, heads),
					$pablohirafuji$elm_qrcode$QRCode$Helpers$transpose(
						A2($elm$core$List$cons, xs, tails)));
			}
		}
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getMaskScore = F2(
	function (size, matrix) {
		var list = A2(
			$elm$core$List$map,
			$pablohirafuji$elm_qrcode$QRCode$Matrix$isDarkModule,
			$elm$core$Array$toList(matrix));
		var rowList = A3($pablohirafuji$elm_qrcode$QRCode$Matrix$breakList, size, list, _List_Nil);
		var transposedRowList = $pablohirafuji$elm_qrcode$QRCode$Helpers$transpose(rowList);
		return function (b) {
			return _Utils_Tuple2(rowList, b);
		}(
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$rule4Score, size, list) + ($pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score(transposedRowList) + ($pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score(rowList) + (A2($pablohirafuji$elm_qrcode$QRCode$Matrix$rule2Score, rowList, 0) + ($pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score(transposedRowList) + $pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score(rowList))))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$ecLevelToInt = function (ecLevel) {
	switch (ecLevel.$) {
		case 'L':
			return 1;
		case 'M':
			return 0;
		case 'Q':
			return 3;
		default:
			return 2;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit = function (_int) {
	var helper = F2(
		function (digit, int_) {
			helper:
			while (true) {
				if (!(!int_)) {
					var $temp$digit = digit + 1,
						$temp$int_ = int_ >>> 1;
					digit = $temp$digit;
					int_ = $temp$int_;
					continue helper;
				} else {
					return digit;
				}
			}
		});
	return A2(helper, 0, _int);
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$maskToInt = function (mask) {
	switch (mask.$) {
		case 'Pattern0':
			return 0;
		case 'Pattern1':
			return 1;
		case 'Pattern2':
			return 2;
		case 'Pattern3':
			return 3;
		case 'Pattern4':
			return 4;
		case 'Pattern5':
			return 5;
		case 'Pattern6':
			return 6;
		default:
			return 7;
	}
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$encodeFormatInfo = F2(
	function (ecLevel, mask) {
		var g15Mask = 21522;
		var g15Int = 1335;
		var g15Digit = $pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(g15Int);
		var formatInfoInt = $pablohirafuji$elm_qrcode$QRCode$Matrix$maskToInt(mask) | ($pablohirafuji$elm_qrcode$QRCode$Matrix$ecLevelToInt(ecLevel) << 3);
		var helper = function (d_) {
			helper:
			while (true) {
				if (($pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(d_) - g15Digit) >= 0) {
					var $temp$d_ = d_ ^ (g15Int << ($pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(d_) - g15Digit));
					d_ = $temp$d_;
					continue helper;
				} else {
					return g15Mask ^ (d_ | (formatInfoInt << 10));
				}
			}
		};
		var d = formatInfoInt << 10;
		return helper(d);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$formatInfoHorizontal = F2(
	function (size, count) {
		return (count < 8) ? _Utils_Tuple2(8, (size - count) - 1) : ((count < 9) ? _Utils_Tuple2(8, 15 - count) : _Utils_Tuple2(8, (15 - count) - 1));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$formatInfoVertical = F2(
	function (size, count) {
		return (count < 6) ? _Utils_Tuple2(count, 8) : ((count < 8) ? _Utils_Tuple2(count + 1, 8) : _Utils_Tuple2((size - 15) + count, 8));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatModule = F4(
	function (size, isBlack, row, col) {
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(true, isBlack)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo_ = F4(
	function (size, isBlackFn, count, matrix) {
		setFormatInfo_:
		while (true) {
			if (count < 15) {
				var isBlack = isBlackFn(count);
				var _v0 = A2($pablohirafuji$elm_qrcode$QRCode$Matrix$formatInfoVertical, size, count);
				var x2 = _v0.a;
				var y2 = _v0.b;
				var _v1 = A2($pablohirafuji$elm_qrcode$QRCode$Matrix$formatInfoHorizontal, size, count);
				var x1 = _v1.a;
				var y1 = _v1.b;
				var $temp$size = size,
					$temp$isBlackFn = isBlackFn,
					$temp$count = count + 1,
					$temp$matrix = A5(
					$pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatModule,
					size,
					isBlack,
					x2,
					y2,
					A5($pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatModule, size, isBlack, x1, y1, matrix));
				size = $temp$size;
				isBlackFn = $temp$isBlackFn;
				count = $temp$count;
				matrix = $temp$matrix;
				continue setFormatInfo_;
			} else {
				return matrix;
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo = F4(
	function (ecLevel, size, mask, matrix) {
		var isBlack = F2(
			function (bits_, count) {
				return (1 & (bits_ >> count)) === 1;
			});
		var bits = A2($pablohirafuji$elm_qrcode$QRCode$Matrix$encodeFormatInfo, ecLevel, mask);
		return A4(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo_,
			size,
			isBlack(bits),
			0,
			matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getBestMask_ = F5(
	function (ecLevel, size, matrix, mask, _v0) {
		var minSMatrix = _v0.a;
		var minScore = _v0.b;
		var maskedMatrix = A4(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo,
			ecLevel,
			size,
			mask,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$applyMask, size, mask, matrix));
		var _v1 = A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getMaskScore, size, maskedMatrix);
		var maskSMatrix = _v1.a;
		var maskScore = _v1.b;
		return ((_Utils_cmp(minScore, maskScore) < 0) && (!_Utils_eq(minScore, -1))) ? _Utils_Tuple2(minSMatrix, minScore) : _Utils_Tuple2(maskSMatrix, maskScore);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern0 = {$: 'Pattern0'};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern1 = {$: 'Pattern1'};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern2 = {$: 'Pattern2'};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern3 = {$: 'Pattern3'};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern4 = {$: 'Pattern4'};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern5 = {$: 'Pattern5'};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern6 = {$: 'Pattern6'};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern7 = {$: 'Pattern7'};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$patternList = _List_fromArray(
	[$pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern0, $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern1, $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern2, $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern3, $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern4, $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern5, $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern6, $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern7]);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getBestMask = F3(
	function (ecLevel, size, matrix) {
		return A3(
			$elm$core$List$foldl,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getBestMask_, ecLevel, size, matrix),
			_Utils_Tuple2(_List_Nil, -1),
			$pablohirafuji$elm_qrcode$QRCode$Matrix$patternList).a;
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$reserveFormatInfo = F2(
	function (size, matrix) {
		return A4(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo_,
			size,
			$elm$core$Basics$always(true),
			0,
			matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$encodeVersionInfo = function (version) {
	var g18Int = 7973;
	var g18Digit = $pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(g18Int);
	var helper = function (d_) {
		helper:
		while (true) {
			if (($pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(d_) - g18Digit) >= 0) {
				var $temp$d_ = d_ ^ (g18Int << ($pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(d_) - g18Digit));
				d_ = $temp$d_;
				continue helper;
			} else {
				return d_ | (version << 12);
			}
		}
	};
	var d = version << 12;
	return helper(d);
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionModule = F3(
	function (size, isBlack, _v0) {
		var row = _v0.a;
		var col = _v0.b;
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(true, isBlack)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionInfo_ = F4(
	function (size, isBlackFn, count, matrix) {
		setVersionInfo_:
		while (true) {
			if (count < 18) {
				var topRight = _Utils_Tuple2(
					$elm$core$Basics$floor(count / 3),
					((A2($elm$core$Basics$modBy, 3, count) + size) - 8) - 3);
				var isBlack = isBlackFn(count);
				var bottomLeft = _Utils_Tuple2(
					((A2($elm$core$Basics$modBy, 3, count) + size) - 8) - 3,
					$elm$core$Basics$floor(count / 3));
				var $temp$size = size,
					$temp$isBlackFn = isBlackFn,
					$temp$count = count + 1,
					$temp$matrix = A4(
					$pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionModule,
					size,
					isBlack,
					bottomLeft,
					A4($pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionModule, size, isBlack, topRight, matrix));
				size = $temp$size;
				isBlackFn = $temp$isBlackFn;
				count = $temp$count;
				matrix = $temp$matrix;
				continue setVersionInfo_;
			} else {
				return matrix;
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionInfo = F3(
	function (version, size, matrix) {
		if (version >= 7) {
			var isBlack = F2(
				function (bits_, count) {
					return (1 & (bits_ >> count)) === 1;
				});
			var bits = $pablohirafuji$elm_qrcode$QRCode$Matrix$encodeVersionInfo(version);
			return A4(
				$pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionInfo_,
				size,
				isBlack(bits),
				0,
				matrix);
		} else {
			return matrix;
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$timingColor = F2(
	function (row, col) {
		return (!A2($elm$core$Basics$modBy, 2, row + col)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(true, true)) : $elm$core$Maybe$Just(
			_Utils_Tuple2(true, false));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setTiming = F3(
	function (size, row, col) {
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$timingColor, row, col));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$timingPattern = F2(
	function (size, matrix) {
		var range = A2($elm$core$List$range, 8, size - 9);
		return A3(
			$elm$core$List$foldl,
			function (b) {
				return A3($pablohirafuji$elm_qrcode$QRCode$Matrix$setTiming, size, b, 6);
			},
			A3(
				$elm$core$List$foldl,
				A2($pablohirafuji$elm_qrcode$QRCode$Matrix$setTiming, size, 6),
				matrix,
				range),
			range);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$apply = function (_v0) {
	var ecLevel = _v0.a.ecLevel;
	var groupInfo = _v0.a.groupInfo;
	var bytes = _v0.b;
	var version = groupInfo.version;
	var size = ((version - 1) * 4) + 21;
	return A2(
		$elm$core$Result$map,
		A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getBestMask, ecLevel, size),
		A2(
			$elm$core$Result$map,
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$addData, size, bytes),
			A3(
				$pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentPattern,
				version,
				size,
				A2(
					$pablohirafuji$elm_qrcode$QRCode$Matrix$timingPattern,
					size,
					A3(
						$pablohirafuji$elm_qrcode$QRCode$Matrix$darkModule,
						version,
						size,
						A3(
							$pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionInfo,
							version,
							size,
							A2(
								$pablohirafuji$elm_qrcode$QRCode$Matrix$reserveFormatInfo,
								size,
								A4(
									$pablohirafuji$elm_qrcode$QRCode$Matrix$finderPattern,
									size,
									-1,
									size - 8,
									A4(
										$pablohirafuji$elm_qrcode$QRCode$Matrix$finderPattern,
										size,
										size - 8,
										-1,
										A4(
											$pablohirafuji$elm_qrcode$QRCode$Matrix$finderPattern,
											size,
											-1,
											-1,
											A2(
												$elm$core$Array$initialize,
												size * size,
												$elm$core$Basics$always($elm$core$Maybe$Nothing))))))))))));
};
var $pablohirafuji$elm_qrcode$QRCode$ECLevel$H = {$: 'H'};
var $pablohirafuji$elm_qrcode$QRCode$ECLevel$L = {$: 'L'};
var $pablohirafuji$elm_qrcode$QRCode$ECLevel$M = {$: 'M'};
var $pablohirafuji$elm_qrcode$QRCode$ECLevel$Q = {$: 'Q'};
var $pablohirafuji$elm_qrcode$QRCode$convertEC = function (ec) {
	switch (ec.$) {
		case 'Low':
			return $pablohirafuji$elm_qrcode$QRCode$ECLevel$L;
		case 'Medium':
			return $pablohirafuji$elm_qrcode$QRCode$ECLevel$M;
		case 'Quartile':
			return $pablohirafuji$elm_qrcode$QRCode$ECLevel$Q;
		default:
			return $pablohirafuji$elm_qrcode$QRCode$ECLevel$H;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$AlignmentPatternNotFound = {$: 'AlignmentPatternNotFound'};
var $pablohirafuji$elm_qrcode$QRCode$InputLengthOverflow = {$: 'InputLengthOverflow'};
var $pablohirafuji$elm_qrcode$QRCode$InvalidAlphanumericChar = {$: 'InvalidAlphanumericChar'};
var $pablohirafuji$elm_qrcode$QRCode$InvalidNumericChar = {$: 'InvalidNumericChar'};
var $pablohirafuji$elm_qrcode$QRCode$InvalidUTF8Char = {$: 'InvalidUTF8Char'};
var $pablohirafuji$elm_qrcode$QRCode$LogTableException = function (a) {
	return {$: 'LogTableException', a: a};
};
var $pablohirafuji$elm_qrcode$QRCode$PolynomialModException = {$: 'PolynomialModException'};
var $pablohirafuji$elm_qrcode$QRCode$PolynomialMultiplyException = {$: 'PolynomialMultiplyException'};
var $pablohirafuji$elm_qrcode$QRCode$convertError = function (e) {
	switch (e.$) {
		case 'AlignmentPatternNotFound':
			return $pablohirafuji$elm_qrcode$QRCode$AlignmentPatternNotFound;
		case 'InvalidNumericChar':
			return $pablohirafuji$elm_qrcode$QRCode$InvalidNumericChar;
		case 'InvalidAlphanumericChar':
			return $pablohirafuji$elm_qrcode$QRCode$InvalidAlphanumericChar;
		case 'InvalidUTF8Char':
			return $pablohirafuji$elm_qrcode$QRCode$InvalidUTF8Char;
		case 'LogTableException':
			var n = e.a;
			return $pablohirafuji$elm_qrcode$QRCode$LogTableException(n);
		case 'PolynomialMultiplyException':
			return $pablohirafuji$elm_qrcode$QRCode$PolynomialMultiplyException;
		case 'PolynomialModException':
			return $pablohirafuji$elm_qrcode$QRCode$PolynomialModException;
		default:
			return $pablohirafuji$elm_qrcode$QRCode$InputLengthOverflow;
	}
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$firstFillerByte = 236;
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$secondFillerByte = 17;
var $pablohirafuji$elm_qrcode$QRCode$Encode$addFiller = F2(
	function (capacity, bytes) {
		var fillerLength = ((capacity / 8) | 0) - $elm$core$List$length(bytes);
		var ns = $elm$core$List$concat(
			A2(
				$elm$core$List$repeat,
				(fillerLength / 2) | 0,
				_List_fromArray(
					[$pablohirafuji$elm_qrcode$QRCode$Encode$firstFillerByte, $pablohirafuji$elm_qrcode$QRCode$Encode$secondFillerByte])));
		return (!A2($elm$core$Basics$modBy, 2, fillerLength)) ? _Utils_ap(bytes, ns) : _Utils_ap(
			bytes,
			_Utils_ap(
				ns,
				_List_fromArray(
					[$pablohirafuji$elm_qrcode$QRCode$Encode$firstFillerByte])));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$addTerminator = F3(
	function (capacity, bitsCount, bits) {
		return _Utils_ap(
			bits,
			_List_fromArray(
				[
					_Utils_Tuple2(
					0,
					A2($elm$core$Basics$min, 4, capacity - bitsCount))
				]));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes3 = function (_v0) {
	bitsToBytes3:
	while (true) {
		var _v1 = _v0.a;
		var bits = _v1.a;
		var length = _v1.b;
		var bytes = _v0.b;
		if (length >= 8) {
			var remLength = length - 8;
			var remBits = bits & ((1 << remLength) - 1);
			var _byte = bits >> remLength;
			var $temp$_v0 = _Utils_Tuple2(
				_Utils_Tuple2(remBits, remLength),
				A2($elm$core$List$cons, _byte, bytes));
			_v0 = $temp$_v0;
			continue bitsToBytes3;
		} else {
			return _Utils_Tuple2(
				_Utils_Tuple2(bits, length),
				bytes);
		}
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes2 = F2(
	function (_v0, _v1) {
		var curBits = _v0.a;
		var curLength = _v0.b;
		var _v2 = _v1.a;
		var remBits = _v2.a;
		var remLength = _v2.b;
		var bytes = _v1.b;
		var lengthSum = curLength + remLength;
		var bitsSum = curBits | (remBits << curLength);
		return $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes3(
			_Utils_Tuple2(
				_Utils_Tuple2(bitsSum, lengthSum),
				bytes));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes1 = F2(
	function (bits, _v0) {
		bitsToBytes1:
		while (true) {
			var _v1 = _v0.a;
			var remBits = _v1.a;
			var remLength = _v1.b;
			var bytes = _v0.b;
			if (bits.b) {
				var head = bits.a;
				var tail = bits.b;
				var $temp$bits = tail,
					$temp$_v0 = A2(
					$pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes2,
					head,
					_Utils_Tuple2(
						_Utils_Tuple2(remBits, remLength),
						bytes));
				bits = $temp$bits;
				_v0 = $temp$_v0;
				continue bitsToBytes1;
			} else {
				return (!remLength) ? $elm$core$List$reverse(bytes) : $elm$core$List$reverse(
					A2($elm$core$List$cons, remBits << (8 - remLength), bytes));
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes = function (bits) {
	return A2(
		$pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes1,
		bits,
		_Utils_Tuple2(
			_Utils_Tuple2(0, 0),
			_List_Nil));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8 = {$: 'UTF8'};
var $pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicatorLength = F2(
	function (mode, version) {
		if (version <= 9) {
			switch (mode.$) {
				case 'Numeric':
					return 10;
				case 'Alphanumeric':
					return 9;
				case 'Byte':
					return 8;
				default:
					return 8;
			}
		} else {
			if (version <= 26) {
				switch (mode.$) {
					case 'Numeric':
						return 12;
					case 'Alphanumeric':
						return 11;
					case 'Byte':
						return 16;
					default:
						return 16;
				}
			} else {
				switch (mode.$) {
					case 'Numeric':
						return 14;
					case 'Alphanumeric':
						return 13;
					case 'Byte':
						return 16;
					default:
						return 16;
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicator = F2(
	function (_v0, bits) {
		var groupInfo = _v0.groupInfo;
		var inputStr = _v0.inputStr;
		var mode = _v0.mode;
		var length = A2($pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicatorLength, mode, groupInfo.version);
		var charCount = _Utils_eq(mode, $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8) ? $elm$core$List$length(bits) : $elm$core$String$length(inputStr);
		return _Utils_Tuple2(charCount, length);
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$modeIndicator = function (mode) {
	switch (mode.$) {
		case 'Numeric':
			return 1;
		case 'Alphanumeric':
			return 2;
		case 'Byte':
			return 4;
		default:
			return 4;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$addInfoAndFinalBits = function (_v0) {
	var bits = _v0.a;
	var model = _v0.b;
	return _Utils_Tuple2(
		model,
		A2(
			$pablohirafuji$elm_qrcode$QRCode$Encode$addFiller,
			model.groupInfo.capacity,
			$pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes(
				A3(
					$pablohirafuji$elm_qrcode$QRCode$Encode$addTerminator,
					model.groupInfo.capacity,
					model.bitsCount,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							$pablohirafuji$elm_qrcode$QRCode$Encode$modeIndicator(model.mode),
							4),
						A2(
							$elm$core$List$cons,
							A2($pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicator, model, bits),
							bits))))));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$concatTranspose = function (_v0) {
	var model = _v0.a;
	var dataBlocks = _v0.b;
	var ecBlocks = _v0.c;
	return _Utils_Tuple2(
		model,
		$elm$core$List$concat(
			_Utils_ap(
				$pablohirafuji$elm_qrcode$QRCode$Helpers$transpose(dataBlocks),
				$pablohirafuji$elm_qrcode$QRCode$Helpers$transpose(ecBlocks))));
};
var $elm_community$list_extra$List$Extra$greedyGroupsOfWithStep = F3(
	function (size, step, list) {
		if ((size <= 0) || (step <= 0)) {
			return _List_Nil;
		} else {
			var go = F2(
				function (xs, acc) {
					go:
					while (true) {
						if ($elm$core$List$isEmpty(xs)) {
							return $elm$core$List$reverse(acc);
						} else {
							var $temp$xs = A2($elm$core$List$drop, step, xs),
								$temp$acc = A2(
								$elm$core$List$cons,
								A2($elm$core$List$take, size, xs),
								acc);
							xs = $temp$xs;
							acc = $temp$acc;
							continue go;
						}
					}
				});
			return A2(go, list, _List_Nil);
		}
	});
var $elm_community$list_extra$List$Extra$greedyGroupsOf = F2(
	function (size, xs) {
		return A3($elm_community$list_extra$List$Extra$greedyGroupsOfWithStep, size, size, xs);
	});
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 'Err') {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 'Err') {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Error$InvalidAlphanumericChar = {$: 'InvalidAlphanumericChar'};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$alphanumericCodes = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			_Utils_chr('0'),
			0),
			_Utils_Tuple2(
			_Utils_chr('1'),
			1),
			_Utils_Tuple2(
			_Utils_chr('2'),
			2),
			_Utils_Tuple2(
			_Utils_chr('3'),
			3),
			_Utils_Tuple2(
			_Utils_chr('4'),
			4),
			_Utils_Tuple2(
			_Utils_chr('5'),
			5),
			_Utils_Tuple2(
			_Utils_chr('6'),
			6),
			_Utils_Tuple2(
			_Utils_chr('7'),
			7),
			_Utils_Tuple2(
			_Utils_chr('8'),
			8),
			_Utils_Tuple2(
			_Utils_chr('9'),
			9),
			_Utils_Tuple2(
			_Utils_chr('A'),
			10),
			_Utils_Tuple2(
			_Utils_chr('B'),
			11),
			_Utils_Tuple2(
			_Utils_chr('C'),
			12),
			_Utils_Tuple2(
			_Utils_chr('D'),
			13),
			_Utils_Tuple2(
			_Utils_chr('E'),
			14),
			_Utils_Tuple2(
			_Utils_chr('F'),
			15),
			_Utils_Tuple2(
			_Utils_chr('G'),
			16),
			_Utils_Tuple2(
			_Utils_chr('H'),
			17),
			_Utils_Tuple2(
			_Utils_chr('I'),
			18),
			_Utils_Tuple2(
			_Utils_chr('J'),
			19),
			_Utils_Tuple2(
			_Utils_chr('K'),
			20),
			_Utils_Tuple2(
			_Utils_chr('L'),
			21),
			_Utils_Tuple2(
			_Utils_chr('M'),
			22),
			_Utils_Tuple2(
			_Utils_chr('N'),
			23),
			_Utils_Tuple2(
			_Utils_chr('O'),
			24),
			_Utils_Tuple2(
			_Utils_chr('P'),
			25),
			_Utils_Tuple2(
			_Utils_chr('Q'),
			26),
			_Utils_Tuple2(
			_Utils_chr('R'),
			27),
			_Utils_Tuple2(
			_Utils_chr('S'),
			28),
			_Utils_Tuple2(
			_Utils_chr('T'),
			29),
			_Utils_Tuple2(
			_Utils_chr('U'),
			30),
			_Utils_Tuple2(
			_Utils_chr('V'),
			31),
			_Utils_Tuple2(
			_Utils_chr('W'),
			32),
			_Utils_Tuple2(
			_Utils_chr('X'),
			33),
			_Utils_Tuple2(
			_Utils_chr('Y'),
			34),
			_Utils_Tuple2(
			_Utils_chr('Z'),
			35),
			_Utils_Tuple2(
			_Utils_chr(' '),
			36),
			_Utils_Tuple2(
			_Utils_chr('$'),
			37),
			_Utils_Tuple2(
			_Utils_chr('%'),
			38),
			_Utils_Tuple2(
			_Utils_chr('*'),
			39),
			_Utils_Tuple2(
			_Utils_chr('+'),
			40),
			_Utils_Tuple2(
			_Utils_chr('-'),
			41),
			_Utils_Tuple2(
			_Utils_chr('.'),
			42),
			_Utils_Tuple2(
			_Utils_chr('/'),
			43),
			_Utils_Tuple2(
			_Utils_chr(':'),
			44)
		]));
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toAlphanumericCode = function (_char) {
	return A2(
		$elm$core$Result$fromMaybe,
		$pablohirafuji$elm_qrcode$QRCode$Error$InvalidAlphanumericChar,
		A2($elm$core$Dict$get, _char, $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$alphanumericCodes));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toBinary = function (chars) {
	_v0$2:
	while (true) {
		if (chars.b) {
			if (chars.b.b) {
				if (!chars.b.b.b) {
					var firstChar = chars.a;
					var _v1 = chars.b;
					var secondChar = _v1.a;
					return A3(
						$elm$core$Result$map2,
						F2(
							function (firstCode, secondCode) {
								return _Utils_Tuple2((firstCode * 45) + secondCode, 11);
							}),
						$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toAlphanumericCode(firstChar),
						$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toAlphanumericCode(secondChar));
				} else {
					break _v0$2;
				}
			} else {
				var _char = chars.a;
				return A2(
					$elm$core$Result$map,
					function (a) {
						return _Utils_Tuple2(a, 6);
					},
					$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toAlphanumericCode(_char));
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Result$Err($pablohirafuji$elm_qrcode$QRCode$Error$InvalidAlphanumericChar);
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$encode = function (str) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Result$map2($elm$core$List$cons),
		$elm$core$Result$Ok(_List_Nil),
		A2(
			$elm$core$List$map,
			$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toBinary,
			A2(
				$elm_community$list_extra$List$Extra$greedyGroupsOf,
				2,
				$elm$core$String$toList(str))));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Byte$encode = function (str) {
	return $elm$core$Result$Ok(
		A2(
			$elm$core$List$map,
			function (a) {
				return _Utils_Tuple2(
					$elm$core$Char$toCode(a),
					8);
			},
			$elm$core$String$toList(str)));
};
var $pablohirafuji$elm_qrcode$QRCode$Error$InvalidNumericChar = {$: 'InvalidNumericChar'};
var $elm$core$String$fromList = _String_fromList;
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$numericLength = function (str) {
	var _v0 = $elm$core$String$length(str);
	switch (_v0) {
		case 1:
			return 4;
		case 2:
			return 7;
		default:
			return 10;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$encodeHelp = function (chars) {
	var str = $elm$core$String$fromList(chars);
	return A2(
		$elm$core$Result$fromMaybe,
		$pablohirafuji$elm_qrcode$QRCode$Error$InvalidNumericChar,
		A2(
			$elm$core$Maybe$map,
			function (a) {
				return _Utils_Tuple2(
					a,
					$pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$numericLength(str));
			},
			$elm$core$String$toInt(str)));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$encode = function (str) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Result$map2($elm$core$List$cons),
		$elm$core$Result$Ok(_List_Nil),
		A2(
			$elm$core$List$map,
			$pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$encodeHelp,
			A2(
				$elm_community$list_extra$List$Extra$greedyGroupsOf,
				3,
				$elm$core$String$toList(str))));
};
var $pablohirafuji$elm_qrcode$QRCode$Error$InvalidUTF8Char = {$: 'InvalidUTF8Char'};
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 'I8':
			return 1;
		case 'I16':
			return 2;
		case 'I32':
			return 4;
		case 'U8':
			return 1;
		case 'U16':
			return 2;
		case 'U32':
			return 4;
		case 'F32':
			return 4;
		case 'F64':
			return 8;
		case 'Seq':
			var w = builder.a;
			return w;
		case 'Utf8':
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = {$: 'LE'};
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 'I8':
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 'I16':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_i16,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'I32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_i32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'U8':
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 'U16':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_u16,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'U32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_u32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'F32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_f32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'F64':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_f64,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'Seq':
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 'Utf8':
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0.a;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $elm$bytes$Bytes$Encode$getStringWidth = _Bytes_getStringWidth;
var $elm$bytes$Bytes$Decode$Decoder = function (a) {
	return {$: 'Decoder', a: a};
};
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0.a;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (step.$ === 'Loop') {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return $elm$bytes$Bytes$Decode$Decoder(
			A2($elm$bytes$Bytes$Decode$loopHelp, state, callback));
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v1 = A2(decodeA, bites, offset);
					var aOffset = _v1.a;
					var a = _v1.b;
					return _Utils_Tuple2(
						aOffset,
						func(a));
				}));
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return $elm$bytes$Bytes$Decode$Decoder(
		F2(
			function (_v0, offset) {
				return _Utils_Tuple2(offset, a);
			}));
};
var $elm$bytes$Bytes$Decode$unsignedInt8 = $elm$bytes$Bytes$Decode$Decoder(_Bytes_read_u8);
var $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8$step = function (_v0) {
	var n = _v0.a;
	var xs = _v0.b;
	return (n <= 0) ? $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(
			$elm$core$List$reverse(xs))) : A2(
		$elm$bytes$Bytes$Decode$map,
		function (x) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					n - 1,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(x, 8),
						xs)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8);
};
var $elm$bytes$Bytes$Encode$Utf8 = F2(
	function (a, b) {
		return {$: 'Utf8', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$string = function (str) {
	return A2(
		$elm$bytes$Bytes$Encode$Utf8,
		_Bytes_getStringWidth(str),
		str);
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8$encode = function (str) {
	var utf8BytesWidth = $elm$bytes$Bytes$Encode$getStringWidth(str);
	var decoder = A2(
		$elm$bytes$Bytes$Decode$loop,
		_Utils_Tuple2(utf8BytesWidth, _List_Nil),
		$pablohirafuji$elm_qrcode$QRCode$Encode$UTF8$step);
	return A2(
		$elm$core$Result$fromMaybe,
		$pablohirafuji$elm_qrcode$QRCode$Error$InvalidUTF8Char,
		A2(
			$elm$bytes$Bytes$Decode$decode,
			decoder,
			$elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$string(str))));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$encoder = function (mode) {
	switch (mode.$) {
		case 'Numeric':
			return $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$encode;
		case 'Alphanumeric':
			return $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$encode;
		case 'Byte':
			return $pablohirafuji$elm_qrcode$QRCode$Encode$Byte$encode;
		default:
			return $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8$encode;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$expTable = $elm$core$Array$fromList(
	_List_fromArray(
		[1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142, 1]));
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getExp = function (index) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Array$get,
			A2($elm$core$Basics$modBy, 255, index),
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$expTable));
};
var $pablohirafuji$elm_qrcode$QRCode$Error$PolynomialMultiplyException = {$: 'PolynomialMultiplyException'};
var $pablohirafuji$elm_qrcode$QRCode$Error$LogTableException = function (a) {
	return {$: 'LogTableException', a: a};
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$logTable = $elm$core$Array$fromList(
	_List_fromArray(
		[0, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199, 75, 4, 100, 224, 14, 52, 141, 239, 129, 28, 193, 105, 248, 200, 8, 76, 113, 5, 138, 101, 47, 225, 36, 15, 33, 53, 147, 142, 218, 240, 18, 130, 69, 29, 181, 194, 125, 106, 39, 249, 185, 201, 154, 9, 120, 77, 228, 114, 166, 6, 191, 139, 98, 102, 221, 48, 253, 226, 152, 37, 179, 16, 145, 34, 136, 54, 208, 148, 206, 143, 150, 219, 189, 241, 210, 19, 92, 131, 56, 70, 64, 30, 66, 182, 163, 195, 72, 126, 110, 107, 58, 40, 84, 250, 133, 186, 61, 202, 94, 155, 159, 10, 21, 121, 43, 78, 212, 229, 172, 115, 243, 167, 87, 7, 112, 192, 247, 140, 128, 99, 13, 103, 74, 222, 237, 49, 197, 254, 24, 227, 165, 153, 119, 38, 184, 180, 124, 17, 68, 146, 217, 35, 32, 137, 46, 55, 63, 209, 91, 149, 188, 207, 205, 144, 135, 151, 178, 220, 252, 190, 97, 242, 86, 211, 171, 20, 42, 93, 158, 132, 60, 57, 83, 71, 109, 65, 162, 31, 45, 67, 216, 183, 123, 164, 118, 196, 23, 73, 236, 127, 12, 111, 246, 108, 161, 59, 82, 41, 157, 85, 170, 251, 96, 134, 177, 187, 204, 62, 90, 203, 89, 95, 176, 156, 169, 160, 81, 11, 245, 22, 235, 122, 117, 44, 215, 79, 174, 213, 233, 230, 231, 173, 232, 116, 214, 244, 234, 168, 80, 88, 175]));
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog = function (index) {
	return (index < 1) ? $elm$core$Result$Err(
		$pablohirafuji$elm_qrcode$QRCode$Error$LogTableException(index)) : A2(
		$elm$core$Result$fromMaybe,
		$pablohirafuji$elm_qrcode$QRCode$Error$LogTableException(index),
		A2($elm$core$Array$get, index - 1, $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$logTable));
};
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getOffset = function (_v0) {
	getOffset:
	while (true) {
		var num = _v0.a;
		var offset = _v0.b;
		if (num.b) {
			var head = num.a;
			var tail = num.b;
			if (!head) {
				var $temp$_v0 = _Utils_Tuple2(tail, offset + 1);
				_v0 = $temp$_v0;
				continue getOffset;
			} else {
				return offset;
			}
		} else {
			return offset;
		}
	}
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial = F2(
	function (num, shift) {
		var offset = $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getOffset(
			_Utils_Tuple2(num, 0));
		var numArray = $elm$core$Array$fromList(num);
		return A2(
			$elm$core$Array$initialize,
			($elm$core$List$length(num) - offset) + shift,
			function (index) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($elm$core$Array$get, index + offset, numArray));
			});
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$multiply = F2(
	function (poly1, poly2) {
		var valuesArray = A2(
			$elm$core$List$indexedMap,
			F2(
				function (index1, value1) {
					return A2(
						$elm$core$List$indexedMap,
						F2(
							function (index2, value2) {
								return _Utils_Tuple3(index1 + index2, value1, value2);
							}),
						$elm$core$Array$toList(poly2));
				}),
			$elm$core$Array$toList(poly1));
		var process__ = F3(
			function (indexSum, num_, exp) {
				return A2(
					$elm$core$Result$fromMaybe,
					$pablohirafuji$elm_qrcode$QRCode$Error$PolynomialMultiplyException,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Bitwise$xor(exp),
						A2($elm$core$Array$get, indexSum, num_)));
			});
		var process_ = F2(
			function (_v0, num_) {
				var indexSum = _v0.a;
				var value1 = _v0.b;
				var value2 = _v0.c;
				return A2(
					$elm$core$Result$map,
					function (r) {
						return A3($elm$core$Array$set, indexSum, r, num_);
					},
					A2(
						$elm$core$Result$andThen,
						A2(process__, indexSum, num_),
						A2(
							$elm$core$Result$map,
							$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getExp,
							A3(
								$elm$core$Result$map2,
								$elm$core$Basics$add,
								$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog(value1),
								$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog(value2)))));
			});
		var process = F2(
			function (args, numResult) {
				return A2(
					$elm$core$Result$andThen,
					process_(args),
					numResult);
			});
		var num = A2(
			$elm$core$Array$initialize,
			($elm$core$Array$length(poly1) + $elm$core$Array$length(poly2)) - 1,
			$elm$core$Basics$always(0));
		return A2(
			$elm$core$Result$map,
			function (a) {
				return A2($pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial, a, 0);
			},
			A2(
				$elm$core$Result$map,
				$elm$core$Array$toList,
				A3(
					$elm$core$List$foldl,
					process,
					$elm$core$Result$Ok(num),
					$elm$core$List$concat(valuesArray))));
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getECPolynomial = function (ecLength) {
	var generate = F2(
		function (count, polyResult) {
			generate:
			while (true) {
				if (_Utils_cmp(count, ecLength) < 0) {
					var $temp$count = count + 1,
						$temp$polyResult = A2(
						$elm$core$Result$andThen,
						function (a) {
							return A2(
								$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$multiply,
								a,
								A2(
									$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial,
									_List_fromArray(
										[
											1,
											$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getExp(count)
										]),
									0));
						},
						polyResult);
					count = $temp$count;
					polyResult = $temp$polyResult;
					continue generate;
				} else {
					return polyResult;
				}
			}
		});
	return A2(
		generate,
		0,
		$elm$core$Result$Ok(
			A2(
				$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial,
				_List_fromArray(
					[1]),
				0)));
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get___ = F2(
	function (ecLength, modPoly) {
		return $elm$core$Array$toList(
			A2(
				$elm$core$Array$initialize,
				ecLength,
				function (index) {
					var modIndex = (index + $elm$core$Array$length(modPoly)) - ecLength;
					return (modIndex >= 0) ? A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Array$get, modIndex, modPoly)) : 0;
				}));
	});
var $pablohirafuji$elm_qrcode$QRCode$Error$PolynomialModException = {$: 'PolynomialModException'};
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$mod = F2(
	function (poly1, poly2) {
		if (($elm$core$Array$length(poly1) - $elm$core$Array$length(poly2)) < 0) {
			return $elm$core$Result$Ok(poly1);
		} else {
			var helper_ = F3(
				function (index2, poly1_, exp) {
					return A2(
						$elm$core$Result$fromMaybe,
						$pablohirafuji$elm_qrcode$QRCode$Error$PolynomialModException,
						A2(
							$elm$core$Maybe$map,
							$elm$core$Bitwise$xor(exp),
							A2($elm$core$Array$get, index2, poly1_)));
				});
			var getHead = function (poly) {
				return A2(
					$elm$core$Result$andThen,
					$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog,
					A2(
						$elm$core$Result$fromMaybe,
						$pablohirafuji$elm_qrcode$QRCode$Error$PolynomialModException,
						A2($elm$core$Array$get, 0, poly)));
			};
			var ratio = A3(
				$elm$core$Result$map2,
				$elm$core$Basics$sub,
				getHead(poly1),
				getHead(poly2));
			var helper = F2(
				function (_v0, poly1_) {
					var index2 = _v0.a;
					var value2 = _v0.b;
					return A2(
						$elm$core$Result$map,
						function (r) {
							return A3($elm$core$Array$set, index2, r, poly1_);
						},
						A2(
							$elm$core$Result$andThen,
							A2(helper_, index2, poly1_),
							A2(
								$elm$core$Result$map,
								$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getExp,
								A3(
									$elm$core$Result$map2,
									$elm$core$Basics$add,
									ratio,
									$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog(value2)))));
				});
			var numFold = F2(
				function (args, poly1Result) {
					return A2(
						$elm$core$Result$andThen,
						helper(args),
						poly1Result);
				});
			var numResult = A3(
				$elm$core$Array$foldl,
				numFold,
				$elm$core$Result$Ok(poly1),
				A2(
					$elm$core$Array$indexedMap,
					F2(
						function (a, b) {
							return _Utils_Tuple2(a, b);
						}),
					poly2));
			return A2(
				$elm$core$Result$andThen,
				function (a) {
					return A2($pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$mod, a, poly2);
				},
				A2(
					$elm$core$Result$map,
					function (a) {
						return A2($pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial, a, 0);
					},
					A2($elm$core$Result$map, $elm$core$Array$toList, numResult)));
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get__ = F2(
	function (rsPoly, dataCodewords) {
		return A2(
			$elm$core$Result$map,
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get___(
				$elm$core$Array$length(rsPoly) - 1),
			A2(
				$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$mod,
				A2(
					$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial,
					dataCodewords,
					$elm$core$Array$length(rsPoly) - 1),
				rsPoly));
	});
var $pablohirafuji$elm_qrcode$QRCode$Helpers$listResult = F3(
	function (fun, listb, lista) {
		if (lista.b) {
			var head = lista.a;
			var tail = lista.b;
			return A2(
				$elm$core$Result$andThen,
				function (a) {
					return A3($pablohirafuji$elm_qrcode$QRCode$Helpers$listResult, fun, a, tail);
				},
				A2(
					$elm$core$Result$map,
					function (r) {
						return A2($elm$core$List$cons, r, listb);
					},
					fun(head)));
		} else {
			return $elm$core$Result$Ok(
				$elm$core$List$reverse(listb));
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get_ = F2(
	function (byteBlocks, rsPoly) {
		return A3(
			$pablohirafuji$elm_qrcode$QRCode$Helpers$listResult,
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get__(rsPoly),
			_List_Nil,
			byteBlocks);
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get = F2(
	function (ecPerBlock, byteBlocks) {
		return A2(
			$elm$core$Result$andThen,
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get_(byteBlocks),
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getECPolynomial(ecPerBlock));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$getErrorCorrection = function (_v0) {
	var model = _v0.a;
	var dataBlocks = _v0.b;
	return A2(
		$elm$core$Result$map,
		function (c) {
			return _Utils_Tuple3(model, dataBlocks, c);
		},
		A2($pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get, model.groupInfo.ecPerBlock, dataBlocks));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric = {$: 'Alphanumeric'};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Byte = {$: 'Byte'};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric = {$: 'Numeric'};
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var $elm$regex$Regex$contains = _Regex_contains;
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$onlyAlphanumeric = A2(
	$elm$regex$Regex$fromStringWith,
	{caseInsensitive: false, multiline: false},
	'^[0-9A-Z $%*+\\-.\\/:]+$');
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$isValid = function (input) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (r) {
				return A2($elm$regex$Regex$contains, r, input);
			},
			$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$onlyAlphanumeric));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Byte$only8Bit = A2(
	$elm$regex$Regex$fromStringWith,
	{caseInsensitive: false, multiline: false},
	'^[\\u0000-\\u00ff]+$');
var $pablohirafuji$elm_qrcode$QRCode$Encode$Byte$isValid = function (input) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (r) {
				return A2($elm$regex$Regex$contains, r, input);
			},
			$pablohirafuji$elm_qrcode$QRCode$Encode$Byte$only8Bit));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$onlyNumber = A2(
	$elm$regex$Regex$fromStringWith,
	{caseInsensitive: false, multiline: false},
	'^[0-9]+$');
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$isValid = function (input) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (r) {
				return A2($elm$regex$Regex$contains, r, input);
			},
			$pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$onlyNumber));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$selectMode = function (input) {
	return $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$isValid(input) ? $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric : ($pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$isValid(input) ? $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric : ($pablohirafuji$elm_qrcode$QRCode$Encode$Byte$isValid(input) ? $pablohirafuji$elm_qrcode$QRCode$Encode$Byte : $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8));
};
var $pablohirafuji$elm_qrcode$QRCode$Error$InputLengthOverflow = {$: 'InputLengthOverflow'};
var $pablohirafuji$elm_qrcode$QRCode$Encode$filterCapacity = F3(
	function (mode, dataLength, _v0) {
		var version = _v0.version;
		var capacity = _v0.capacity;
		return _Utils_cmp(
			A2($pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicatorLength, mode, version) + dataLength,
			capacity) < 1;
	});
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$blockByteCapacity = function (_v0) {
	var blockCount = _v0.a;
	var bytePerBlock = _v0.b;
	return blockCount * bytePerBlock;
};
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$byteCapacity = F2(
	function (group1, maybeGroup2) {
		if (maybeGroup2.$ === 'Just') {
			var block2 = maybeGroup2.a;
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$blockByteCapacity(group1) + $pablohirafuji$elm_qrcode$QRCode$GroupInfo$blockByteCapacity(block2);
		} else {
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$blockByteCapacity(group1);
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo = F4(
	function (version, ecPerBlock, group1, maybeGroup2) {
		return {
			capacity: A2($pablohirafuji$elm_qrcode$QRCode$GroupInfo$byteCapacity, group1, maybeGroup2) * 8,
			ecPerBlock: ecPerBlock,
			group1: group1,
			maybeGroup2: maybeGroup2,
			version: version
		};
	});
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataH = _List_fromArray(
	[
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		1,
		17,
		_Utils_Tuple2(1, 9),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		2,
		28,
		_Utils_Tuple2(1, 16),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		3,
		22,
		_Utils_Tuple2(2, 13),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		4,
		16,
		_Utils_Tuple2(4, 9),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		5,
		22,
		_Utils_Tuple2(2, 11),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 12))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		6,
		28,
		_Utils_Tuple2(4, 15),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		7,
		26,
		_Utils_Tuple2(4, 13),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 14))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		8,
		26,
		_Utils_Tuple2(4, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		9,
		24,
		_Utils_Tuple2(4, 12),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 13))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		10,
		28,
		_Utils_Tuple2(6, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		11,
		24,
		_Utils_Tuple2(3, 12),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(8, 13))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		12,
		28,
		_Utils_Tuple2(7, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		13,
		22,
		_Utils_Tuple2(12, 11),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 12))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		14,
		24,
		_Utils_Tuple2(11, 12),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 13))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		15,
		24,
		_Utils_Tuple2(11, 12),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 13))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		16,
		30,
		_Utils_Tuple2(3, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(13, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		17,
		28,
		_Utils_Tuple2(2, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(17, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		18,
		28,
		_Utils_Tuple2(2, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(19, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		19,
		26,
		_Utils_Tuple2(9, 13),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(16, 14))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		20,
		28,
		_Utils_Tuple2(15, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		21,
		30,
		_Utils_Tuple2(19, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		22,
		24,
		_Utils_Tuple2(34, 13),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		23,
		30,
		_Utils_Tuple2(16, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		24,
		30,
		_Utils_Tuple2(30, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		25,
		30,
		_Utils_Tuple2(22, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(13, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		26,
		30,
		_Utils_Tuple2(33, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		27,
		30,
		_Utils_Tuple2(12, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(28, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		28,
		30,
		_Utils_Tuple2(11, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(31, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		29,
		30,
		_Utils_Tuple2(19, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(26, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		30,
		30,
		_Utils_Tuple2(23, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(25, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		31,
		30,
		_Utils_Tuple2(23, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(28, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		32,
		30,
		_Utils_Tuple2(19, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(35, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		33,
		30,
		_Utils_Tuple2(11, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(46, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		34,
		30,
		_Utils_Tuple2(59, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		35,
		30,
		_Utils_Tuple2(22, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(41, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		36,
		30,
		_Utils_Tuple2(2, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(64, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		37,
		30,
		_Utils_Tuple2(24, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(46, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		38,
		30,
		_Utils_Tuple2(42, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(32, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		39,
		30,
		_Utils_Tuple2(10, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(67, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		40,
		30,
		_Utils_Tuple2(20, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(61, 16)))
	]);
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataL = _List_fromArray(
	[
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		1,
		7,
		_Utils_Tuple2(1, 19),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		2,
		10,
		_Utils_Tuple2(1, 34),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		3,
		15,
		_Utils_Tuple2(1, 55),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		4,
		20,
		_Utils_Tuple2(1, 80),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		5,
		26,
		_Utils_Tuple2(1, 108),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		6,
		18,
		_Utils_Tuple2(2, 68),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		7,
		20,
		_Utils_Tuple2(2, 78),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		8,
		24,
		_Utils_Tuple2(2, 97),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		9,
		30,
		_Utils_Tuple2(2, 116),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		10,
		18,
		_Utils_Tuple2(2, 68),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 69))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		11,
		20,
		_Utils_Tuple2(4, 81),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		12,
		24,
		_Utils_Tuple2(2, 92),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 93))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		13,
		26,
		_Utils_Tuple2(4, 107),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		14,
		30,
		_Utils_Tuple2(3, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		15,
		22,
		_Utils_Tuple2(5, 87),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 88))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		16,
		24,
		_Utils_Tuple2(5, 98),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 99))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		17,
		28,
		_Utils_Tuple2(1, 107),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 108))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		18,
		30,
		_Utils_Tuple2(5, 120),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 121))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		19,
		28,
		_Utils_Tuple2(3, 113),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 114))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		20,
		28,
		_Utils_Tuple2(3, 107),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 108))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		21,
		28,
		_Utils_Tuple2(4, 116),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 117))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		22,
		28,
		_Utils_Tuple2(2, 111),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 112))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		23,
		30,
		_Utils_Tuple2(4, 121),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 122))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		24,
		30,
		_Utils_Tuple2(6, 117),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 118))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		25,
		26,
		_Utils_Tuple2(8, 106),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 107))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		26,
		28,
		_Utils_Tuple2(10, 114),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 115))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		27,
		30,
		_Utils_Tuple2(8, 122),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 123))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		28,
		30,
		_Utils_Tuple2(3, 117),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 118))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		29,
		30,
		_Utils_Tuple2(7, 116),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 117))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		30,
		30,
		_Utils_Tuple2(5, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		31,
		30,
		_Utils_Tuple2(13, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(3, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		32,
		30,
		_Utils_Tuple2(17, 115),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		33,
		30,
		_Utils_Tuple2(17, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		34,
		30,
		_Utils_Tuple2(13, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		35,
		30,
		_Utils_Tuple2(12, 121),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 122))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		36,
		30,
		_Utils_Tuple2(6, 121),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 122))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		37,
		30,
		_Utils_Tuple2(17, 122),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 123))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		38,
		30,
		_Utils_Tuple2(4, 122),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(18, 123))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		39,
		30,
		_Utils_Tuple2(20, 117),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 118))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		40,
		30,
		_Utils_Tuple2(19, 118),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 119)))
	]);
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataM = _List_fromArray(
	[
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		1,
		10,
		_Utils_Tuple2(1, 16),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		2,
		16,
		_Utils_Tuple2(1, 28),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		3,
		26,
		_Utils_Tuple2(1, 44),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		4,
		18,
		_Utils_Tuple2(2, 32),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		5,
		24,
		_Utils_Tuple2(2, 43),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		6,
		16,
		_Utils_Tuple2(4, 27),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		7,
		18,
		_Utils_Tuple2(4, 31),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		8,
		22,
		_Utils_Tuple2(2, 38),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 39))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		9,
		22,
		_Utils_Tuple2(3, 36),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 37))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		10,
		26,
		_Utils_Tuple2(4, 43),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 44))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		11,
		30,
		_Utils_Tuple2(1, 50),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 51))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		12,
		22,
		_Utils_Tuple2(6, 36),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 37))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		13,
		22,
		_Utils_Tuple2(8, 37),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 38))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		14,
		24,
		_Utils_Tuple2(4, 40),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 41))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		15,
		24,
		_Utils_Tuple2(5, 41),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 42))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		16,
		28,
		_Utils_Tuple2(7, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(3, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		17,
		28,
		_Utils_Tuple2(10, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		18,
		26,
		_Utils_Tuple2(9, 43),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 44))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		19,
		26,
		_Utils_Tuple2(3, 44),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(11, 45))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		20,
		26,
		_Utils_Tuple2(3, 41),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(13, 42))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		21,
		26,
		_Utils_Tuple2(17, 42),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		22,
		28,
		_Utils_Tuple2(17, 46),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		23,
		28,
		_Utils_Tuple2(4, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		24,
		28,
		_Utils_Tuple2(6, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		25,
		28,
		_Utils_Tuple2(8, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(13, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		26,
		28,
		_Utils_Tuple2(19, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		27,
		28,
		_Utils_Tuple2(22, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(3, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		28,
		28,
		_Utils_Tuple2(3, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(23, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		29,
		28,
		_Utils_Tuple2(21, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		30,
		28,
		_Utils_Tuple2(19, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		31,
		28,
		_Utils_Tuple2(2, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(29, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		32,
		28,
		_Utils_Tuple2(10, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(23, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		33,
		28,
		_Utils_Tuple2(14, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(21, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		34,
		28,
		_Utils_Tuple2(14, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(23, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		35,
		28,
		_Utils_Tuple2(12, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(26, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		36,
		28,
		_Utils_Tuple2(6, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(34, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		37,
		28,
		_Utils_Tuple2(29, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		38,
		28,
		_Utils_Tuple2(13, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(32, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		39,
		28,
		_Utils_Tuple2(40, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		40,
		28,
		_Utils_Tuple2(18, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(31, 48)))
	]);
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataQ = _List_fromArray(
	[
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		1,
		13,
		_Utils_Tuple2(1, 13),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		2,
		22,
		_Utils_Tuple2(1, 22),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		3,
		18,
		_Utils_Tuple2(2, 17),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		4,
		26,
		_Utils_Tuple2(2, 24),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		5,
		18,
		_Utils_Tuple2(2, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		6,
		24,
		_Utils_Tuple2(4, 19),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		7,
		18,
		_Utils_Tuple2(2, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		8,
		22,
		_Utils_Tuple2(4, 18),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 19))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		9,
		20,
		_Utils_Tuple2(4, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		10,
		24,
		_Utils_Tuple2(6, 19),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 20))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		11,
		28,
		_Utils_Tuple2(4, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		12,
		26,
		_Utils_Tuple2(4, 20),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 21))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		13,
		24,
		_Utils_Tuple2(8, 20),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 21))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		14,
		20,
		_Utils_Tuple2(11, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		15,
		30,
		_Utils_Tuple2(5, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		16,
		24,
		_Utils_Tuple2(15, 19),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 20))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		17,
		28,
		_Utils_Tuple2(1, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(15, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		18,
		28,
		_Utils_Tuple2(17, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		19,
		26,
		_Utils_Tuple2(17, 21),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 22))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		20,
		30,
		_Utils_Tuple2(15, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		21,
		28,
		_Utils_Tuple2(17, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		22,
		30,
		_Utils_Tuple2(7, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(16, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		23,
		30,
		_Utils_Tuple2(11, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		24,
		30,
		_Utils_Tuple2(11, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(16, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		25,
		30,
		_Utils_Tuple2(7, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(22, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		26,
		28,
		_Utils_Tuple2(28, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		27,
		30,
		_Utils_Tuple2(8, 23),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(26, 24))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		28,
		30,
		_Utils_Tuple2(4, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(31, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		29,
		30,
		_Utils_Tuple2(1, 23),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(37, 24))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		30,
		30,
		_Utils_Tuple2(15, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(25, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		31,
		30,
		_Utils_Tuple2(42, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		32,
		30,
		_Utils_Tuple2(10, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(35, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		33,
		30,
		_Utils_Tuple2(29, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(19, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		34,
		30,
		_Utils_Tuple2(44, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		35,
		30,
		_Utils_Tuple2(39, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		36,
		30,
		_Utils_Tuple2(46, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		37,
		30,
		_Utils_Tuple2(49, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		38,
		30,
		_Utils_Tuple2(48, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		39,
		30,
		_Utils_Tuple2(43, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(22, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		40,
		30,
		_Utils_Tuple2(34, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(34, 25)))
	]);
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$getGroupData = function (ecLevel) {
	switch (ecLevel.$) {
		case 'L':
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataL;
		case 'M':
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataM;
		case 'Q':
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataQ;
		default:
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataH;
	}
};
var $elm$core$List$sortBy = _List_sortBy;
var $pablohirafuji$elm_qrcode$QRCode$Encode$getVersion = F3(
	function (ecLevel, mode, dataLength) {
		return A2(
			$elm$core$Result$fromMaybe,
			$pablohirafuji$elm_qrcode$QRCode$Error$InputLengthOverflow,
			$elm$core$List$head(
				A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.capacity;
					},
					A2(
						$elm$core$List$filter,
						A2($pablohirafuji$elm_qrcode$QRCode$Encode$filterCapacity, mode, dataLength),
						$pablohirafuji$elm_qrcode$QRCode$GroupInfo$getGroupData(ecLevel)))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$versionToModel = F5(
	function (inputStr, ecLevel, mode, partialBitsCount, groupInfo) {
		return {
			bitsCount: partialBitsCount + A2($pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicatorLength, mode, groupInfo.version),
			ecLevel: ecLevel,
			groupInfo: groupInfo,
			inputStr: inputStr,
			mode: mode
		};
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$selectVersion = F4(
	function (inputStr, ecLevel, mode, encodedStr) {
		var partialBitsCount = 4 + A3(
			$elm$core$List$foldl,
			F2(
				function (a, b) {
					return a.b + b;
				}),
			0,
			encodedStr);
		return A2(
			$elm$core$Result$map,
			function (b) {
				return _Utils_Tuple2(encodedStr, b);
			},
			A2(
				$elm$core$Result$map,
				A4($pablohirafuji$elm_qrcode$QRCode$Encode$versionToModel, inputStr, ecLevel, mode, partialBitsCount),
				A3($pablohirafuji$elm_qrcode$QRCode$Encode$getVersion, ecLevel, mode, partialBitsCount)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$breakList = F3(
	function (checkFinish, _v0, _v1) {
		breakList:
		while (true) {
			var times = _v0.a;
			var itemCount = _v0.b;
			var byteList = _v1.a;
			var progress = _v1.b;
			if (times > 0) {
				var remainList = A2($elm$core$List$drop, itemCount, byteList);
				var block = A2($elm$core$List$take, itemCount, byteList);
				var $temp$checkFinish = checkFinish,
					$temp$_v0 = _Utils_Tuple2(times - 1, itemCount),
					$temp$_v1 = _Utils_Tuple2(
					remainList,
					A2($elm$core$List$cons, block, progress));
				checkFinish = $temp$checkFinish;
				_v0 = $temp$_v0;
				_v1 = $temp$_v1;
				continue breakList;
			} else {
				if (checkFinish && ($elm$core$List$length(byteList) > 0)) {
					return $elm$core$Result$Err($pablohirafuji$elm_qrcode$QRCode$Error$InputLengthOverflow);
				} else {
					return $elm$core$Result$Ok(
						_Utils_Tuple2(byteList, progress));
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$toBlocks = function (_v0) {
	var model = _v0.a;
	var groupInfo = model.groupInfo;
	var byteList = _v0.b;
	var _v1 = groupInfo.maybeGroup2;
	if (_v1.$ === 'Just') {
		var group2 = _v1.a;
		return A2(
			$elm$core$Result$map,
			function (b) {
				return _Utils_Tuple2(model, b);
			},
			A2(
				$elm$core$Result$map,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $elm$core$List$reverse),
				A2(
					$elm$core$Result$andThen,
					A2($pablohirafuji$elm_qrcode$QRCode$Encode$breakList, true, group2),
					A3(
						$pablohirafuji$elm_qrcode$QRCode$Encode$breakList,
						false,
						groupInfo.group1,
						_Utils_Tuple2(byteList, _List_Nil)))));
	} else {
		return A2(
			$elm$core$Result$map,
			function (b) {
				return _Utils_Tuple2(model, b);
			},
			A2(
				$elm$core$Result$map,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $elm$core$List$reverse),
				A3(
					$pablohirafuji$elm_qrcode$QRCode$Encode$breakList,
					true,
					groupInfo.group1,
					_Utils_Tuple2(byteList, _List_Nil))));
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$encode = F2(
	function (inputStr, ecLevel) {
		var mode = $pablohirafuji$elm_qrcode$QRCode$Encode$selectMode(inputStr);
		return A2(
			$elm$core$Result$map,
			$pablohirafuji$elm_qrcode$QRCode$Encode$concatTranspose,
			A2(
				$elm$core$Result$andThen,
				$pablohirafuji$elm_qrcode$QRCode$Encode$getErrorCorrection,
				A2(
					$elm$core$Result$andThen,
					$pablohirafuji$elm_qrcode$QRCode$Encode$toBlocks,
					A2(
						$elm$core$Result$map,
						$pablohirafuji$elm_qrcode$QRCode$Encode$addInfoAndFinalBits,
						A2(
							$elm$core$Result$andThen,
							A3($pablohirafuji$elm_qrcode$QRCode$Encode$selectVersion, inputStr, ecLevel, mode),
							A2($pablohirafuji$elm_qrcode$QRCode$Encode$encoder, mode, inputStr))))));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$fromStringWith = F2(
	function (ecLevel, input) {
		return A2(
			$elm$core$Result$mapError,
			$pablohirafuji$elm_qrcode$QRCode$convertError,
			A2(
				$elm$core$Result$andThen,
				function (_v0) {
					var encodeModel = _v0.a;
					var encodedData = _v0.b;
					return A2(
						$elm$core$Result$map,
						function (matrix) {
							return $pablohirafuji$elm_qrcode$QRCode$QRCode(
								{matrix: matrix, version: encodeModel.groupInfo.version});
						},
						$pablohirafuji$elm_qrcode$QRCode$Matrix$apply(
							_Utils_Tuple2(encodeModel, encodedData)));
				},
				A2(
					$pablohirafuji$elm_qrcode$QRCode$Encode$encode,
					input,
					$pablohirafuji$elm_qrcode$QRCode$convertEC(ecLevel))));
	});
var $pablohirafuji$elm_qrcode$QRCode$fromString = $pablohirafuji$elm_qrcode$QRCode$fromStringWith($pablohirafuji$elm_qrcode$QRCode$Quartile);
var $pablohirafuji$elm_qrcode$QRCode$defaultImageOptions = {darkColor: 255, lightColor: 4294967295, moduleSize: 5, quietZoneSize: 4};
var $pablohirafuji$elm_qrcode$QRCode$Render$Raster$addQuietZone = F2(
	function (quietZoneSize, matrix) {
		if (quietZoneSize <= 0) {
			return matrix;
		} else {
			var matrixWithQZLength = $elm$core$List$length(matrix) + (2 * quietZoneSize);
			var rows = A2(
				$elm$core$List$repeat,
				quietZoneSize,
				A2($elm$core$List$repeat, matrixWithQZLength, false));
			var cols = A2($elm$core$List$repeat, quietZoneSize, false);
			return _Utils_ap(
				rows,
				_Utils_ap(
					A2(
						$elm$core$List$map,
						function (row) {
							return _Utils_ap(
								cols,
								_Utils_ap(row, cols));
						},
						matrix),
					rows));
		}
	});
var $justgook$elm_image$Image$Internal$Meta$FromData = function (a) {
	return {$: 'FromData', a: a};
};
var $justgook$elm_image$Image$Internal$Meta$FromDataBitDepth8 = {$: 'FromDataBitDepth8'};
var $justgook$elm_image$Image$Internal$Meta$FromDataChannel4 = function (a) {
	return {$: 'FromDataChannel4', a: a};
};
var $justgook$elm_image$Image$Internal$ImageData$ImageRaw = F2(
	function (a, b) {
		return {$: 'ImageRaw', a: a, b: b};
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $justgook$elm_image$Image$Internal$Array2d$fromList2D = A2(
	$elm$core$List$foldl,
	A2($elm$core$Basics$composeR, $elm$core$Array$fromList, $elm$core$Array$push),
	$elm$core$Array$empty);
var $justgook$elm_image$Image$fromList2d = function (l) {
	return A2(
		$justgook$elm_image$Image$Internal$ImageData$ImageRaw,
		$justgook$elm_image$Image$Internal$Meta$FromData(
			{
				color: $justgook$elm_image$Image$Internal$Meta$FromDataChannel4($justgook$elm_image$Image$Internal$Meta$FromDataBitDepth8),
				height: $elm$core$List$length(l),
				width: A2(
					$elm$core$Maybe$withDefault,
					0,
					A2(
						$elm$core$Maybe$map,
						$elm$core$List$length,
						$elm$core$List$head(l)))
			}),
		$justgook$elm_image$Image$Internal$Array2d$fromList2D(l));
};
var $pablohirafuji$elm_qrcode$QRCode$Render$Raster$moduleToPixel = F2(
	function (options, isDark) {
		return isDark ? options.darkColor : options.lightColor;
	});
var $pablohirafuji$elm_qrcode$QRCode$Render$Raster$toImageWithOptions = F2(
	function (options, matrix) {
		var moduleSize = A2($elm$core$Basics$max, 1, options.moduleSize);
		return $justgook$elm_image$Image$fromList2d(
			$elm$core$List$concat(
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$map(
							A2(
								$elm$core$Basics$composeR,
								$pablohirafuji$elm_qrcode$QRCode$Render$Raster$moduleToPixel(options),
								$elm$core$List$repeat(moduleSize))),
						A2(
							$elm$core$Basics$composeR,
							$elm$core$List$concat,
							$elm$core$List$repeat(moduleSize))),
					A2($pablohirafuji$elm_qrcode$QRCode$Render$Raster$addQuietZone, options.quietZoneSize, matrix))));
	});
var $pablohirafuji$elm_qrcode$QRCode$toImageWithOptions = F2(
	function (config, _v0) {
		var matrix = _v0.a.matrix;
		return A2($pablohirafuji$elm_qrcode$QRCode$Render$Raster$toImageWithOptions, config, matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$toImage = $pablohirafuji$elm_qrcode$QRCode$toImageWithOptions($pablohirafuji$elm_qrcode$QRCode$defaultImageOptions);
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $danfishgold$base64_bytes$Decode$lowest6BitsMask = 63;
var $elm$core$Char$fromCode = _Char_fromCode;
var $danfishgold$base64_bytes$Decode$unsafeToChar = function (n) {
	if (n <= 25) {
		return $elm$core$Char$fromCode(65 + n);
	} else {
		if (n <= 51) {
			return $elm$core$Char$fromCode(97 + (n - 26));
		} else {
			if (n <= 61) {
				return $elm$core$Char$fromCode(48 + (n - 52));
			} else {
				switch (n) {
					case 62:
						return _Utils_chr('+');
					case 63:
						return _Utils_chr('/');
					default:
						return _Utils_chr('\u0000');
				}
			}
		}
	}
};
var $danfishgold$base64_bytes$Decode$bitsToChars = F2(
	function (bits, missing) {
		var s = $danfishgold$base64_bytes$Decode$unsafeToChar(bits & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var r = $danfishgold$base64_bytes$Decode$unsafeToChar((bits >>> 6) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var q = $danfishgold$base64_bytes$Decode$unsafeToChar((bits >>> 12) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var p = $danfishgold$base64_bytes$Decode$unsafeToChar(bits >>> 18);
		switch (missing) {
			case 0:
				return A2(
					$elm$core$String$cons,
					p,
					A2(
						$elm$core$String$cons,
						q,
						A2(
							$elm$core$String$cons,
							r,
							$elm$core$String$fromChar(s))));
			case 1:
				return A2(
					$elm$core$String$cons,
					p,
					A2(
						$elm$core$String$cons,
						q,
						A2($elm$core$String$cons, r, '=')));
			case 2:
				return A2(
					$elm$core$String$cons,
					p,
					A2($elm$core$String$cons, q, '=='));
			default:
				return '';
		}
	});
var $danfishgold$base64_bytes$Decode$bitsToCharSpecialized = F4(
	function (bits1, bits2, bits3, accum) {
		var z = $danfishgold$base64_bytes$Decode$unsafeToChar((bits3 >>> 6) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var y = $danfishgold$base64_bytes$Decode$unsafeToChar((bits3 >>> 12) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var x = $danfishgold$base64_bytes$Decode$unsafeToChar(bits3 >>> 18);
		var w = $danfishgold$base64_bytes$Decode$unsafeToChar(bits3 & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var s = $danfishgold$base64_bytes$Decode$unsafeToChar(bits1 & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var r = $danfishgold$base64_bytes$Decode$unsafeToChar((bits1 >>> 6) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var q = $danfishgold$base64_bytes$Decode$unsafeToChar((bits1 >>> 12) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var p = $danfishgold$base64_bytes$Decode$unsafeToChar(bits1 >>> 18);
		var d = $danfishgold$base64_bytes$Decode$unsafeToChar(bits2 & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var c = $danfishgold$base64_bytes$Decode$unsafeToChar((bits2 >>> 6) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var b = $danfishgold$base64_bytes$Decode$unsafeToChar((bits2 >>> 12) & $danfishgold$base64_bytes$Decode$lowest6BitsMask);
		var a = $danfishgold$base64_bytes$Decode$unsafeToChar(bits2 >>> 18);
		return A2(
			$elm$core$String$cons,
			x,
			A2(
				$elm$core$String$cons,
				y,
				A2(
					$elm$core$String$cons,
					z,
					A2(
						$elm$core$String$cons,
						w,
						A2(
							$elm$core$String$cons,
							a,
							A2(
								$elm$core$String$cons,
								b,
								A2(
									$elm$core$String$cons,
									c,
									A2(
										$elm$core$String$cons,
										d,
										A2(
											$elm$core$String$cons,
											p,
											A2(
												$elm$core$String$cons,
												q,
												A2(
													$elm$core$String$cons,
													r,
													A2($elm$core$String$cons, s, accum))))))))))));
	});
var $danfishgold$base64_bytes$Decode$decode18Help = F5(
	function (a, b, c, d, e) {
		var combined6 = ((255 & d) << 16) | e;
		var combined5 = d >>> 8;
		var combined4 = 16777215 & c;
		var combined3 = ((65535 & b) << 8) | (c >>> 24);
		var combined2 = ((255 & a) << 16) | (b >>> 16);
		var combined1 = a >>> 8;
		return A4(
			$danfishgold$base64_bytes$Decode$bitsToCharSpecialized,
			combined3,
			combined2,
			combined1,
			A4($danfishgold$base64_bytes$Decode$bitsToCharSpecialized, combined6, combined5, combined4, ''));
	});
var $elm$bytes$Bytes$Decode$map5 = F6(
	function (func, _v0, _v1, _v2, _v3, _v4) {
		var decodeA = _v0.a;
		var decodeB = _v1.a;
		var decodeC = _v2.a;
		var decodeD = _v3.a;
		var decodeE = _v4.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v5 = A2(decodeA, bites, offset);
					var aOffset = _v5.a;
					var a = _v5.b;
					var _v6 = A2(decodeB, bites, aOffset);
					var bOffset = _v6.a;
					var b = _v6.b;
					var _v7 = A2(decodeC, bites, bOffset);
					var cOffset = _v7.a;
					var c = _v7.b;
					var _v8 = A2(decodeD, bites, cOffset);
					var dOffset = _v8.a;
					var d = _v8.b;
					var _v9 = A2(decodeE, bites, dOffset);
					var eOffset = _v9.a;
					var e = _v9.b;
					return _Utils_Tuple2(
						eOffset,
						A5(func, a, b, c, d, e));
				}));
	});
var $elm$bytes$Bytes$BE = {$: 'BE'};
var $elm$bytes$Bytes$Decode$unsignedInt16 = function (endianness) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_u16(
			_Utils_eq(endianness, $elm$bytes$Bytes$LE)));
};
var $danfishgold$base64_bytes$Decode$u16BE = $elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$BE);
var $elm$bytes$Bytes$Decode$unsignedInt32 = function (endianness) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_u32(
			_Utils_eq(endianness, $elm$bytes$Bytes$LE)));
};
var $danfishgold$base64_bytes$Decode$u32BE = $elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE);
var $danfishgold$base64_bytes$Decode$decode18Bytes = A6($elm$bytes$Bytes$Decode$map5, $danfishgold$base64_bytes$Decode$decode18Help, $danfishgold$base64_bytes$Decode$u32BE, $danfishgold$base64_bytes$Decode$u32BE, $danfishgold$base64_bytes$Decode$u32BE, $danfishgold$base64_bytes$Decode$u32BE, $danfishgold$base64_bytes$Decode$u16BE);
var $elm$bytes$Bytes$Decode$map2 = F3(
	function (func, _v0, _v1) {
		var decodeA = _v0.a;
		var decodeB = _v1.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v2 = A2(decodeA, bites, offset);
					var aOffset = _v2.a;
					var a = _v2.b;
					var _v3 = A2(decodeB, bites, aOffset);
					var bOffset = _v3.a;
					var b = _v3.b;
					return _Utils_Tuple2(
						bOffset,
						A2(func, a, b));
				}));
	});
var $elm$bytes$Bytes$Decode$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var decodeA = _v0.a;
		var decodeB = _v1.a;
		var decodeC = _v2.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v3 = A2(decodeA, bites, offset);
					var aOffset = _v3.a;
					var a = _v3.b;
					var _v4 = A2(decodeB, bites, aOffset);
					var bOffset = _v4.a;
					var b = _v4.b;
					var _v5 = A2(decodeC, bites, bOffset);
					var cOffset = _v5.a;
					var c = _v5.b;
					return _Utils_Tuple2(
						cOffset,
						A3(func, a, b, c));
				}));
	});
var $danfishgold$base64_bytes$Decode$loopHelp = function (_v0) {
	var remaining = _v0.remaining;
	var string = _v0.string;
	if (remaining >= 18) {
		return A2(
			$elm$bytes$Bytes$Decode$map,
			function (result) {
				return $elm$bytes$Bytes$Decode$Loop(
					{
						remaining: remaining - 18,
						string: _Utils_ap(string, result)
					});
			},
			$danfishgold$base64_bytes$Decode$decode18Bytes);
	} else {
		if (remaining >= 3) {
			var helper = F3(
				function (a, b, c) {
					var combined = ((a << 16) | (b << 8)) | c;
					return $elm$bytes$Bytes$Decode$Loop(
						{
							remaining: remaining - 3,
							string: _Utils_ap(
								string,
								A2($danfishgold$base64_bytes$Decode$bitsToChars, combined, 0))
						});
				});
			return A4($elm$bytes$Bytes$Decode$map3, helper, $elm$bytes$Bytes$Decode$unsignedInt8, $elm$bytes$Bytes$Decode$unsignedInt8, $elm$bytes$Bytes$Decode$unsignedInt8);
		} else {
			if (!remaining) {
				return $elm$bytes$Bytes$Decode$succeed(
					$elm$bytes$Bytes$Decode$Done(string));
			} else {
				if (remaining === 2) {
					var helper = F2(
						function (a, b) {
							var combined = (a << 16) | (b << 8);
							return $elm$bytes$Bytes$Decode$Done(
								_Utils_ap(
									string,
									A2($danfishgold$base64_bytes$Decode$bitsToChars, combined, 1)));
						});
					return A3($elm$bytes$Bytes$Decode$map2, helper, $elm$bytes$Bytes$Decode$unsignedInt8, $elm$bytes$Bytes$Decode$unsignedInt8);
				} else {
					return A2(
						$elm$bytes$Bytes$Decode$map,
						function (a) {
							return $elm$bytes$Bytes$Decode$Done(
								_Utils_ap(
									string,
									A2($danfishgold$base64_bytes$Decode$bitsToChars, a << 16, 2)));
						},
						$elm$bytes$Bytes$Decode$unsignedInt8);
				}
			}
		}
	}
};
var $danfishgold$base64_bytes$Decode$decoder = function (width) {
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		{remaining: width, string: ''},
		$danfishgold$base64_bytes$Decode$loopHelp);
};
var $elm$bytes$Bytes$width = _Bytes_width;
var $danfishgold$base64_bytes$Decode$fromBytes = function (bytes) {
	return A2(
		$elm$bytes$Bytes$Decode$decode,
		$danfishgold$base64_bytes$Decode$decoder(
			$elm$bytes$Bytes$width(bytes)),
		bytes);
};
var $danfishgold$base64_bytes$Base64$fromBytes = $danfishgold$base64_bytes$Decode$fromBytes;
var $justgook$elm_image$Image$Internal$ImageData$RGBA = {$: 'RGBA'};
var $justgook$elm_image$Image$Internal$ImageData$RightDown = {$: 'RightDown'};
var $justgook$elm_image$Image$Internal$ImageData$defaultOptions = {format: $justgook$elm_image$Image$Internal$ImageData$RGBA, order: $justgook$elm_image$Image$Internal$ImageData$RightDown};
var $elm$bytes$Bytes$Encode$Bytes = function (a) {
	return {$: 'Bytes', a: a};
};
var $elm$bytes$Bytes$Encode$bytes = $elm$bytes$Bytes$Encode$Bytes;
var $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case = function (i) {
	switch (i) {
		case 0:
			return 0;
		case 1:
			return 498536548;
		case 2:
			return 997073096;
		case 3:
			return 651767980;
		case 4:
			return 1994146192;
		case 5:
			return 1802195444;
		case 6:
			return 1303535960;
		case 7:
			return 1342533948;
		case 8:
			return 3988292384;
		case 9:
			return 4027552580;
		case 10:
			return 3604390888;
		case 11:
			return 3412177804;
		case 12:
			return 2607071920;
		case 13:
			return 2262029012;
		case 14:
			return 2685067896;
		default:
			return 3183342108;
	}
};
var $folkertdev$elm_flate$Checksum$Crc32$step = F2(
	function (_byte, crc) {
		var a = (crc ^ _byte) >>> 0;
		var b = ((a >>> 4) ^ $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case(a & 15)) >>> 0;
		var c = (b >>> 4) ^ $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case(b & 15);
		return c;
	});
var $folkertdev$elm_flate$Checksum$Crc32$crc32Help = function (_v0) {
	var remaining = _v0.remaining;
	var crc = _v0.crc;
	return (remaining >= 8) ? A3(
		$elm$bytes$Bytes$Decode$map2,
		F2(
			function (word1, word2) {
				var byte8 = 255 & word2;
				var byte7 = 255 & (word2 >>> 8);
				var byte6 = 255 & (word2 >>> 16);
				var byte5 = 255 & (word2 >>> 24);
				var byte4 = 255 & word1;
				var byte3 = 255 & (word1 >>> 8);
				var byte2 = 255 & (word1 >>> 16);
				var byte1 = 255 & (word1 >>> 24);
				return $elm$bytes$Bytes$Decode$Loop(
					{
						crc: A2(
							$folkertdev$elm_flate$Checksum$Crc32$step,
							byte8,
							A2(
								$folkertdev$elm_flate$Checksum$Crc32$step,
								byte7,
								A2(
									$folkertdev$elm_flate$Checksum$Crc32$step,
									byte6,
									A2(
										$folkertdev$elm_flate$Checksum$Crc32$step,
										byte5,
										A2(
											$folkertdev$elm_flate$Checksum$Crc32$step,
											byte4,
											A2(
												$folkertdev$elm_flate$Checksum$Crc32$step,
												byte3,
												A2(
													$folkertdev$elm_flate$Checksum$Crc32$step,
													byte2,
													A2($folkertdev$elm_flate$Checksum$Crc32$step, byte1, crc)))))))),
						remaining: remaining - 8
					});
			}),
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_byte) {
			return $elm$bytes$Bytes$Decode$Loop(
				{
					crc: A2($folkertdev$elm_flate$Checksum$Crc32$step, _byte, crc),
					remaining: remaining - 1
				});
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done((crc ^ 4294967295) >>> 0)));
};
var $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32 = function (buffer) {
	var length = $elm$bytes$Bytes$width(buffer);
	var initialCrc = 4294967295;
	return (!length) ? 0 : A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$bytes$Bytes$Decode$decode,
			A2(
				$elm$bytes$Bytes$Decode$loop,
				{crc: initialCrc, remaining: length},
				$folkertdev$elm_flate$Checksum$Crc32$crc32Help),
			buffer));
};
var $folkertdev$elm_flate$Checksum$Crc32$crc32 = $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32;
var $folkertdev$elm_flate$Flate$crc32 = $folkertdev$elm_flate$Checksum$Crc32$crc32;
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 'Seq', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $elm$bytes$Bytes$Encode$U32 = F2(
	function (a, b) {
		return {$: 'U32', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt32 = $elm$bytes$Bytes$Encode$U32;
var $justgook$elm_image$Image$Internal$PNG$encodeChunk = F2(
	function (kind, data) {
		var length = $elm$bytes$Bytes$width(data);
		var kindAndData = $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				_List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, kind),
						$elm$bytes$Bytes$Encode$bytes(data)
					])));
		return $elm$bytes$Bytes$Encode$sequence(
			_List_fromArray(
				[
					A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, length),
					$elm$bytes$Bytes$Encode$bytes(kindAndData),
					A2(
					$elm$bytes$Bytes$Encode$unsignedInt32,
					$elm$bytes$Bytes$BE,
					$folkertdev$elm_flate$Flate$crc32(kindAndData))
				]));
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $folkertdev$elm_flate$Flate$Dynamic = function (a) {
	return {$: 'Dynamic', a: a};
};
var $folkertdev$elm_flate$Flate$WithWindowSize = function (a) {
	return {$: 'WithWindowSize', a: a};
};
var $folkertdev$elm_flate$Checksum$Adler32$a32 = {base: 65521, nmax: 5552};
var $folkertdev$elm_flate$Checksum$Adler32$step8Bytes = F5(
	function (remaining, s1, s2, word1, word2) {
		var byte8 = 255 & word2;
		var byte7 = 255 & (word2 >>> 8);
		var byte6 = 255 & (word2 >>> 16);
		var byte5 = 255 & (word2 >>> 24);
		var byte4 = 255 & word1;
		var byte3 = 255 & (word1 >>> 8);
		var byte2 = 255 & (word1 >>> 16);
		var byte1 = 255 & (word1 >>> 24);
		var s1a_1 = s1 + byte1;
		var s1a_2 = s1a_1 + byte2;
		var s1a_3 = s1a_2 + byte3;
		var s1a_4 = s1a_3 + byte4;
		var s2a_1 = s2 + s1a_1;
		var s2a_2 = s2a_1 + s1a_2;
		var s2a_3 = s2a_2 + s1a_3;
		var s2a_4 = s2a_3 + s1a_4;
		var s1b_1 = s1a_4 + byte5;
		var s1b_2 = s1b_1 + byte6;
		var s1b_3 = s1b_2 + byte7;
		var s1b_4 = s1b_3 + byte8;
		var s2b_1 = s2a_4 + s1b_1;
		var s2b_2 = s2b_1 + s1b_2;
		var s2b_3 = s2b_2 + s1b_3;
		var s2b_4 = s2b_3 + s1b_4;
		return $elm$bytes$Bytes$Decode$Loop(
			{remaining: remaining - 8, s1: s1b_4, s2: s2b_4});
	});
var $folkertdev$elm_flate$Checksum$Adler32$processChunkHelp = function (_v0) {
	var remaining = _v0.remaining;
	var s1 = _v0.s1;
	var s2 = _v0.s2;
	return (remaining >= 8) ? A3(
		$elm$bytes$Bytes$Decode$map2,
		A3($folkertdev$elm_flate$Checksum$Adler32$step8Bytes, remaining, s1, s2),
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_byte) {
			return $elm$bytes$Bytes$Decode$Loop(
				{remaining: remaining - 1, s1: s1 + _byte, s2: (s1 + _byte) + s2});
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(
			{s1: s1 % $folkertdev$elm_flate$Checksum$Adler32$a32.base, s2: s2 % $folkertdev$elm_flate$Checksum$Adler32$a32.base})));
};
var $folkertdev$elm_flate$Checksum$Adler32$processChunk = function (config) {
	return A2($elm$bytes$Bytes$Decode$loop, config, $folkertdev$elm_flate$Checksum$Adler32$processChunkHelp);
};
var $folkertdev$elm_flate$Checksum$Adler32$chunkedFold = function (_v0) {
	var bufferSize = _v0.bufferSize;
	var maxBlockSize = _v0.maxBlockSize;
	var go = function (_v1) {
		var remainingLength = _v1.remainingLength;
		var s1 = _v1.s1;
		var s2 = _v1.s2;
		return (!remainingLength) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(
				{s1: s1, s2: s2})) : ((_Utils_cmp(remainingLength, maxBlockSize) < 0) ? A2(
			$elm$bytes$Bytes$Decode$map,
			$elm$bytes$Bytes$Decode$Done,
			$folkertdev$elm_flate$Checksum$Adler32$processChunk(
				{remaining: remainingLength, s1: s1, s2: s2})) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (result) {
				return $elm$bytes$Bytes$Decode$Loop(
					{remainingLength: remainingLength - maxBlockSize, s1: result.s1, s2: result.s2});
			},
			$folkertdev$elm_flate$Checksum$Adler32$processChunk(
				{remaining: maxBlockSize, s1: s1, s2: s2})));
	};
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		{remainingLength: bufferSize, s1: 1, s2: 0},
		go);
};
var $folkertdev$elm_flate$Checksum$Adler32$adler32 = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		$folkertdev$elm_flate$Checksum$Adler32$chunkedFold(
			{
				bufferSize: $elm$bytes$Bytes$width(buffer),
				maxBlockSize: $folkertdev$elm_flate$Checksum$Adler32$a32.nmax
			}),
		buffer);
	if (_v0.$ === 'Nothing') {
		return 0;
	} else {
		var s1 = _v0.a.s1;
		var s2 = _v0.a.s2;
		return ((s2 << 16) | s1) >>> 0;
	}
};
var $elm$bytes$Bytes$Decode$bytes = function (n) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_bytes(n));
};
var $folkertdev$elm_flate$Deflate$Internal$chunksHelp = F2(
	function (chunkSize, _v0) {
		var sizeRemaining = _v0.a;
		var accum = _v0.b;
		return (!sizeRemaining) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(_List_Nil)) : ((_Utils_cmp(chunkSize, sizeRemaining) > -1) ? A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Done(
					$elm$core$List$reverse(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(true, _new),
							accum)));
			},
			$elm$bytes$Bytes$Decode$bytes(sizeRemaining)) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(
						sizeRemaining - chunkSize,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(false, _new),
							accum)));
			},
			$elm$bytes$Bytes$Decode$bytes(chunkSize)));
	});
var $folkertdev$elm_flate$Deflate$Internal$chunks = F2(
	function (chunkSize, buffer) {
		var _v0 = A2(
			$elm$bytes$Bytes$Decode$decode,
			A2(
				$elm$bytes$Bytes$Decode$loop,
				_Utils_Tuple2(
					$elm$bytes$Bytes$width(buffer),
					_List_Nil),
				$folkertdev$elm_flate$Deflate$Internal$chunksHelp(chunkSize)),
			buffer);
		if (_v0.$ === 'Nothing') {
			return _List_fromArray(
				[
					_Utils_Tuple2(
					true,
					$elm$bytes$Bytes$Encode$encode(
						$elm$bytes$Bytes$Encode$sequence(_List_Nil)))
				]);
		} else {
			if (!_v0.a.b) {
				return _List_fromArray(
					[
						_Utils_Tuple2(
						true,
						$elm$bytes$Bytes$Encode$encode(
							$elm$bytes$Bytes$Encode$sequence(_List_Nil)))
					]);
			} else {
				var value = _v0.a;
				return value;
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Internal$default_block_size = 1024 * 1024;
var $folkertdev$elm_flate$Deflate$BitWriter$empty = {bitsWritten: 0, encoders: _List_Nil, tag: 0};
var $folkertdev$elm_flate$Deflate$Symbol$code = function (symbol) {
	switch (symbol.$) {
		case 'Literal':
			var _byte = symbol.a;
			return _byte;
		case 'EndOfBlock':
			return 256;
		default:
			var length = symbol.a;
			return ((length >= 3) && (length <= 10)) ? ((257 + length) - 3) : (((length >= 11) && (length <= 18)) ? (265 + (((length - 11) / 2) | 0)) : (((length >= 19) && (length <= 34)) ? (269 + (((length - 19) / 4) | 0)) : (((length >= 35) && (length <= 66)) ? (273 + (((length - 35) / 8) | 0)) : (((length >= 67) && (length <= 130)) ? (277 + (((length - 67) / 16) | 0)) : (((length >= 131) && (length <= 257)) ? (281 + (((length - 131) / 32) | 0)) : ((length === 258) ? 285 : (-1)))))));
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$distance = function (symbol) {
	if (symbol.$ === 'Share') {
		var distance_ = symbol.b;
		if (distance_ <= 4) {
			return $elm$core$Maybe$Just(
				_Utils_Tuple3(distance_ - 1, 0, 0));
		} else {
			var go = F3(
				function (extraBits, code_, base) {
					go:
					while (true) {
						if (_Utils_cmp(base * 2, distance_) < 0) {
							var $temp$extraBits = extraBits + 1,
								$temp$code_ = code_ + 2,
								$temp$base = base * 2;
							extraBits = $temp$extraBits;
							code_ = $temp$code_;
							base = $temp$base;
							continue go;
						} else {
							return _Utils_Tuple3(extraBits, code_, base);
						}
					}
				});
			var _v1 = A3(go, 1, 4, 4);
			var extraBits = _v1.a;
			var code_ = _v1.b;
			var base = _v1.c;
			var delta = (distance_ - base) - 1;
			var half = (base / 2) | 0;
			return (_Utils_cmp(distance_, base + half) < 1) ? $elm$core$Maybe$Just(
				_Utils_Tuple3(
					code_,
					extraBits,
					A2($elm$core$Basics$modBy, half, delta))) : $elm$core$Maybe$Just(
				_Utils_Tuple3(
					code_ + 1,
					extraBits,
					A2($elm$core$Basics$modBy, half, delta)));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$update = F3(
	function (index, tagger, array) {
		var _v0 = A2($elm$core$Array$get, index, array);
		if (_v0.$ === 'Nothing') {
			return array;
		} else {
			var value = _v0.a;
			return A3(
				$elm$core$Array$set,
				index,
				tagger(value),
				array);
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$dynamicFindFrequencies = F2(
	function (symbol, _v0) {
		var literalCounts = _v0.a;
		var distanceCounts = _v0.b;
		var emptyDistanceCount = _v0.c;
		var _v1 = $folkertdev$elm_flate$Deflate$Symbol$distance(symbol);
		if (_v1.$ === 'Nothing') {
			return _Utils_Tuple3(
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					function (v) {
						return v + 1;
					},
					literalCounts),
				distanceCounts,
				emptyDistanceCount);
		} else {
			var _v2 = _v1.a;
			var d = _v2.a;
			return _Utils_Tuple3(
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					function (v) {
						return v + 1;
					},
					literalCounts),
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					d,
					function (v) {
						return v + 1;
					},
					distanceCounts),
				false);
		}
	});
var $elm$core$List$sortWith = _List_sortWith;
var $folkertdev$elm_flate$Huffman$calcOptimalMaxBitWidth = function (frequencies) {
	var heapModificationLoop = function (heap) {
		heapModificationLoop:
		while (true) {
			if (!heap.b) {
				return 0;
			} else {
				if (!heap.b.b) {
					var _v1 = heap.a;
					var value = _v1.b;
					return A2($elm$core$Basics$max, 1, value);
				} else {
					var _v2 = heap.a;
					var weight1 = _v2.a;
					var width1 = _v2.b;
					var _v3 = heap.b;
					var _v4 = _v3.a;
					var weight2 = _v4.a;
					var width2 = _v4.b;
					var rest = _v3.b;
					var $temp$heap = A2(
						$elm$core$List$sortWith,
						F2(
							function (a, b) {
								return A2($elm$core$Basics$compare, b, a);
							}),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								weight1 + weight2,
								1 + A2($elm$core$Basics$max, width1, width2)),
							rest));
					heap = $temp$heap;
					continue heapModificationLoop;
				}
			}
		}
	};
	var createHeapFolder = F2(
		function (freq, heap) {
			return (freq > 0) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(-freq, 0),
				heap) : heap;
		});
	var createHeap = A3($elm$core$Array$foldl, createHeapFolder, _List_Nil, frequencies);
	return heapModificationLoop(createHeap);
};
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		nodeList: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		nodeListSize: (len / $elm$core$Array$branchFactor) | 0,
		tail: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeLoop = F3(
	function (xarr, yarr, accum) {
		mergeLoop:
		while (true) {
			var _v0 = _Utils_Tuple2(xarr, yarr);
			if (!_v0.a.b) {
				return A2(
					$elm$core$Array$append,
					accum,
					$elm$core$Array$fromList(yarr));
			} else {
				if (!_v0.b.b) {
					return A2(
						$elm$core$Array$append,
						accum,
						$elm$core$Array$fromList(xarr));
				} else {
					var _v1 = _v0.a;
					var x = _v1.a;
					var xrest = _v1.b;
					var _v2 = _v0.b;
					var y = _v2.a;
					var yrest = _v2.b;
					if (_Utils_cmp(x.weight, y.weight) < 0) {
						var $temp$xarr = xrest,
							$temp$yarr = yarr,
							$temp$accum = A2($elm$core$Array$push, x, accum);
						xarr = $temp$xarr;
						yarr = $temp$yarr;
						accum = $temp$accum;
						continue mergeLoop;
					} else {
						var $temp$xarr = xarr,
							$temp$yarr = yrest,
							$temp$accum = A2($elm$core$Array$push, y, accum);
						xarr = $temp$xarr;
						yarr = $temp$yarr;
						accum = $temp$accum;
						continue mergeLoop;
					}
				}
			}
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$merge = F2(
	function (x, y) {
		return A3(
			$folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeLoop,
			$elm$core$Array$toList(x),
			$elm$core$Array$toList(y),
			$elm$core$Array$empty);
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeNodes = F2(
	function (node1, node2) {
		return {
			symbols: A2($elm$core$Array$append, node1.symbols, node2.symbols),
			weight: node1.weight + node2.weight
		};
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$package = function (nodes) {
	if ($elm$core$Array$length(nodes) >= 2) {
		var newLen = ($elm$core$Array$length(nodes) / 2) | 0;
		var loop = F2(
			function (currentNodes, accum) {
				loop:
				while (true) {
					if (currentNodes.b && currentNodes.b.b) {
						var self = currentNodes.a;
						var _v1 = currentNodes.b;
						var other = _v1.a;
						var rest = _v1.b;
						var $temp$currentNodes = rest,
							$temp$accum = A2(
							$elm$core$List$cons,
							A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeNodes, self, other),
							accum);
						currentNodes = $temp$currentNodes;
						accum = $temp$accum;
						continue loop;
					} else {
						return $elm$core$Array$fromList(
							$elm$core$List$reverse(accum));
					}
				}
			});
		return A2(
			loop,
			$elm$core$Array$toList(nodes),
			_List_Nil);
	} else {
		return nodes;
	}
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$singletonNode = F2(
	function (symbol, weight) {
		return {
			symbols: A2($elm$core$Array$repeat, 1, symbol),
			weight: weight
		};
	});
var $elm_community$list_extra$List$Extra$stableSortWith = F2(
	function (pred, list) {
		var predWithIndex = F2(
			function (_v1, _v2) {
				var a1 = _v1.a;
				var i1 = _v1.b;
				var a2 = _v2.a;
				var i2 = _v2.b;
				var result = A2(pred, a1, a2);
				if (result.$ === 'EQ') {
					return A2($elm$core$Basics$compare, i1, i2);
				} else {
					return result;
				}
			});
		var listWithIndex = A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, a) {
					return _Utils_Tuple2(a, i);
				}),
			list);
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$first,
			A2($elm$core$List$sortWith, predWithIndex, listWithIndex));
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$update = F3(
	function (index, tagger, array) {
		var _v0 = A2($elm$core$Array$get, index, array);
		if (_v0.$ === 'Nothing') {
			return array;
		} else {
			var value = _v0.a;
			return A3(
				$elm$core$Array$set,
				index,
				tagger(value),
				array);
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$calculate = F2(
	function (maxBitWidth, frequencies) {
		var source = $elm$core$Array$fromList(
			A2(
				$elm_community$list_extra$List$Extra$stableSortWith,
				F2(
					function (a, b) {
						return A2($elm$core$Basics$compare, a.weight, b.weight);
					}),
				$elm$core$Array$toList(
					A2(
						$elm$core$Array$map,
						function (_v3) {
							var symbol = _v3.a;
							var weight = _v3.b;
							return A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$singletonNode, symbol, weight);
						},
						A2(
							$elm$core$Array$filter,
							function (_v2) {
								var f = _v2.b;
								return f > 0;
							},
							A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, frequencies))))));
		var weighted = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, w) {
					return A2(
						$folkertdev$elm_flate$LengthLimitedHuffmanCodes$merge,
						$folkertdev$elm_flate$LengthLimitedHuffmanCodes$package(w),
						source);
				}),
			source,
			A2($elm$core$List$range, 0, maxBitWidth - 2));
		var loop = F2(
			function (symbols, accum) {
				loop:
				while (true) {
					if (!symbols.b) {
						return accum;
					} else {
						var symbol = symbols.a;
						var rest = symbols.b;
						var $temp$symbols = rest,
							$temp$accum = A3(
							$folkertdev$elm_flate$LengthLimitedHuffmanCodes$update,
							symbol,
							function (v) {
								return v + 1;
							},
							accum);
						symbols = $temp$symbols;
						accum = $temp$accum;
						continue loop;
					}
				}
			});
		var allSymbols = A2(
			$elm$core$List$concatMap,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.symbols;
				},
				$elm$core$Array$toList),
			$elm$core$Array$toList(
				$folkertdev$elm_flate$LengthLimitedHuffmanCodes$package(weighted)));
		return A2(
			loop,
			allSymbols,
			A2(
				$elm$core$Array$repeat,
				$elm$core$Array$length(frequencies),
				0));
	});
var $folkertdev$elm_flate$Huffman$Tree = function (a) {
	return {$: 'Tree', a: a};
};
var $folkertdev$elm_flate$Huffman$Code = function (a) {
	return {$: 'Code', a: a};
};
var $folkertdev$elm_flate$Huffman$codeFromRecord = $folkertdev$elm_flate$Huffman$Code;
var $folkertdev$elm_flate$Huffman$new = function (n) {
	return $folkertdev$elm_flate$Huffman$Tree(
		A2(
			$elm$core$Array$repeat,
			n,
			$folkertdev$elm_flate$Huffman$codeFromRecord(
				{bits: 0, width: 0})));
};
var $folkertdev$elm_flate$Huffman$inverseEndianLoop = F4(
	function (i, limit, f, t) {
		inverseEndianLoop:
		while (true) {
			if (_Utils_cmp(i, limit) < 0) {
				var $temp$i = i + 1,
					$temp$limit = limit,
					$temp$f = f >> 1,
					$temp$t = (f & 1) | (t << 1);
				i = $temp$i;
				limit = $temp$limit;
				f = $temp$f;
				t = $temp$t;
				continue inverseEndianLoop;
			} else {
				return t;
			}
		}
	});
var $folkertdev$elm_flate$Huffman$inverseEndian = function (_v0) {
	var width = _v0.a.width;
	var bits = _v0.a.bits;
	var inverseBits = A4($folkertdev$elm_flate$Huffman$inverseEndianLoop, 0, width, bits, 0);
	return $folkertdev$elm_flate$Huffman$Code(
		{bits: inverseBits, width: width});
};
var $folkertdev$elm_flate$Huffman$setMapping = F3(
	function (symbol, code, _v0) {
		var array = _v0.a;
		return $folkertdev$elm_flate$Huffman$Tree(
			A3(
				$elm$core$Array$set,
				symbol,
				$folkertdev$elm_flate$Huffman$inverseEndian(code),
				array));
	});
var $folkertdev$elm_flate$Huffman$restoreCanonicalHuffmanCodes = F2(
	function (bitWidths, tree) {
		var symbols = A2(
			$elm_community$list_extra$List$Extra$stableSortWith,
			F2(
				function (_v4, _v5) {
					var a = _v4.b;
					var b = _v5.b;
					return A2($elm$core$Basics$compare, a, b);
				}),
			$elm$core$Array$toList(
				A2(
					$elm$core$Array$filter,
					function (_v3) {
						var codeBitWidth = _v3.b;
						return codeBitWidth > 0;
					},
					A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, bitWidths))));
		var loop = F2(
			function (_v1, _v2) {
				var symbol = _v1.a;
				var bitWidth = _v1.b;
				var code = _v2.a;
				var prevWidth = _v2.b;
				var currentTree = _v2.c;
				var newBits = code << (bitWidth - prevWidth);
				var nextCode = $folkertdev$elm_flate$Huffman$Code(
					{bits: newBits, width: bitWidth});
				return _Utils_Tuple3(
					newBits + 1,
					bitWidth,
					A3($folkertdev$elm_flate$Huffman$setMapping, symbol, nextCode, currentTree));
			});
		return function (_v0) {
			var x = _v0.c;
			return x;
		}(
			A3(
				$elm$core$List$foldl,
				loop,
				_Utils_Tuple3(0, 0, tree),
				symbols));
	});
var $folkertdev$elm_flate$Huffman$fromBitWidths = function (bitWidths) {
	var symbolCount = function (v) {
		return v + 1;
	}(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$first,
				function (a) {
					return A2(
						$elm$core$Array$get,
						$elm$core$Array$length(a) - 1,
						a);
				}(
					A2(
						$elm$core$Array$filter,
						function (e) {
							return e.b > 0;
						},
						A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, bitWidths))))));
	return A2(
		$folkertdev$elm_flate$Huffman$restoreCanonicalHuffmanCodes,
		bitWidths,
		$folkertdev$elm_flate$Huffman$new(symbolCount));
};
var $folkertdev$elm_flate$Huffman$fromFrequencies = F2(
	function (symbolFrequencies, maxBitWidth_) {
		var maxBitWidth = A2(
			$elm$core$Basics$min,
			maxBitWidth_,
			$folkertdev$elm_flate$Huffman$calcOptimalMaxBitWidth(symbolFrequencies));
		var codeBitWidhts = A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$calculate, maxBitWidth, symbolFrequencies);
		return $folkertdev$elm_flate$Huffman$fromBitWidths(codeBitWidhts);
	});
var $folkertdev$elm_flate$Deflate$Symbol$buildDynamicHuffmanCodec = function (symbols) {
	var _v0 = A3(
		$elm$core$Array$foldl,
		$folkertdev$elm_flate$Deflate$Symbol$dynamicFindFrequencies,
		_Utils_Tuple3(
			A2($elm$core$Array$repeat, 286, 0),
			A2($elm$core$Array$repeat, 30, 0),
			true),
		symbols);
	var literalCounts = _v0.a;
	var distanceCounts = _v0.b;
	var emptyDistanceCount = _v0.c;
	return {
		distance: emptyDistanceCount ? A2(
			$folkertdev$elm_flate$Huffman$fromFrequencies,
			A3($elm$core$Array$set, 0, 1, distanceCounts),
			15) : A2($folkertdev$elm_flate$Huffman$fromFrequencies, distanceCounts, 15),
		literal: A2($folkertdev$elm_flate$Huffman$fromFrequencies, literalCounts, 15)
	};
};
var $folkertdev$elm_flate$Deflate$Symbol$EndOfBlock = {$: 'EndOfBlock'};
var $folkertdev$elm_flate$Deflate$Symbol$Literal = function (a) {
	return {$: 'Literal', a: a};
};
var $folkertdev$elm_flate$Deflate$Symbol$Share = F2(
	function (a, b) {
		return {$: 'Share', a: a, b: b};
	});
var $folkertdev$elm_flate$Deflate$Internal$codeToSymbol = function (code) {
	if (code.$ === 'Literal') {
		var v = code.a;
		return $folkertdev$elm_flate$Deflate$Symbol$Literal(v);
	} else {
		var length = code.a;
		var backwardDistance = code.b;
		return A2($folkertdev$elm_flate$Deflate$Symbol$Share, length, backwardDistance);
	}
};
var $folkertdev$elm_flate$LZ77$Literal = function (a) {
	return {$: 'Literal', a: a};
};
var $folkertdev$elm_flate$LZ77$Pointer = F2(
	function (a, b) {
		return {$: 'Pointer', a: a, b: b};
	});
var $folkertdev$elm_flate$PrefixTable$Small = function (a) {
	return {$: 'Small', a: a};
};
var $folkertdev$elm_flate$PrefixTable$Large = function (a) {
	return {$: 'Large', a: a};
};
var $folkertdev$elm_flate$PrefixTable$LargePrefixTable = function (a) {
	return {$: 'LargePrefixTable', a: a};
};
var $folkertdev$elm_flate$PrefixTable$insertInList = F6(
	function (i, array, p2, position, remaining, accum) {
		insertInList:
		while (true) {
			if (!remaining.b) {
				var newPositions = A2(
					$elm$core$List$cons,
					_Utils_Tuple2(p2, position),
					accum);
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Large(
						$folkertdev$elm_flate$PrefixTable$LargePrefixTable(
							A3($elm$core$Array$set, i, newPositions, array))),
					$elm$core$Maybe$Nothing);
			} else {
				var current = remaining.a;
				var key = current.a;
				var oldValue = current.b;
				var rest = remaining.b;
				if (!(key - p2)) {
					var newPositions = _Utils_ap(
						accum,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(key, position),
							rest));
					return _Utils_Tuple2(
						$folkertdev$elm_flate$PrefixTable$Large(
							$folkertdev$elm_flate$PrefixTable$LargePrefixTable(
								A3($elm$core$Array$set, i, newPositions, array))),
						$elm$core$Maybe$Just(oldValue));
				} else {
					var $temp$i = i,
						$temp$array = array,
						$temp$p2 = p2,
						$temp$position = position,
						$temp$remaining = rest,
						$temp$accum = A2($elm$core$List$cons, current, accum);
					i = $temp$i;
					array = $temp$array;
					p2 = $temp$p2;
					position = $temp$position;
					remaining = $temp$remaining;
					accum = $temp$accum;
					continue insertInList;
				}
			}
		}
	});
var $folkertdev$elm_flate$PrefixTable$insert = F3(
	function (_v0, position, ptable) {
		var prefix_ = _v0.a;
		var prefix = 16777215 & (prefix_ >>> 0);
		if (ptable.$ === 'Small') {
			var dict = ptable.a;
			var _v2 = A2($elm$core$Dict$get, prefix, dict);
			if (_v2.$ === 'Nothing') {
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Small(
						A3($elm$core$Dict$insert, prefix, position, dict)),
					$elm$core$Maybe$Nothing);
			} else {
				var oldValue = _v2.a;
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Small(
						A3($elm$core$Dict$insert, prefix, position, dict)),
					$elm$core$Maybe$Just(oldValue));
			}
		} else {
			var array = ptable.a.a;
			var index = prefix >> 8;
			var _v3 = A2($elm$core$Array$get, index, array);
			if (_v3.$ === 'Nothing') {
				return _Utils_Tuple2(ptable, $elm$core$Maybe$Nothing);
			} else {
				var positions = _v3.a;
				return A6($folkertdev$elm_flate$PrefixTable$insertInList, index, array, 255 & prefix, position, positions, _List_Nil);
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$length = function (_v0) {
	var array = _v0.a;
	var finalSize = _v0.b;
	var finalBytes = _v0.c;
	var _v1 = $elm$core$Array$length(array) * 4;
	if (!_v1) {
		return finalSize;
	} else {
		var l = _v1;
		return l + finalSize;
	}
};
var $folkertdev$elm_flate$Experimental$ByteArray$get = F2(
	function (index, _v0) {
		var array = _v0.a;
		var finalSize = _v0.b;
		var finalBytes = _v0.c;
		var offset = index % 4;
		if (_Utils_cmp(
			index,
			($elm$core$Array$length(array) * 4) + finalSize) > -1) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (_Utils_cmp(
				index,
				$elm$core$Array$length(array) * 4) > -1) {
				return $elm$core$Maybe$Just(255 & (finalBytes >>> (8 * (3 - offset))));
			} else {
				var internalIndex = (index / 4) | 0;
				var _v1 = A2($elm$core$Array$get, internalIndex, array);
				if (_v1.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var int32 = _v1.a;
					return $elm$core$Maybe$Just(255 & (int32 >>> (8 * (3 - offset))));
				}
			}
		}
	});
var $folkertdev$elm_flate$LZ77$longestCommonPrefixLoop = F5(
	function (i, j, limit, accum, array) {
		longestCommonPrefixLoop:
		while (true) {
			if (_Utils_cmp(i, limit) < 0) {
				var _v0 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, i, array);
				if (_v0.$ === 'Nothing') {
					return accum;
				} else {
					var value1 = _v0.a;
					var _v1 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, j, array);
					if (_v1.$ === 'Nothing') {
						return accum;
					} else {
						var value2 = _v1.a;
						if (!(value1 - value2)) {
							var $temp$i = i + 1,
								$temp$j = j + 1,
								$temp$limit = limit,
								$temp$accum = accum + 1,
								$temp$array = array;
							i = $temp$i;
							j = $temp$j;
							limit = $temp$limit;
							accum = $temp$accum;
							array = $temp$array;
							continue longestCommonPrefixLoop;
						} else {
							return accum;
						}
					}
				}
			} else {
				return accum;
			}
		}
	});
var $folkertdev$elm_flate$LZ77$max_length = 258;
var $folkertdev$elm_flate$LZ77$longestCommonPrefix = F3(
	function (i, j, array) {
		var remaining = A2(
			$elm$core$Basics$min,
			$folkertdev$elm_flate$LZ77$max_length - 3,
			$folkertdev$elm_flate$Experimental$ByteArray$length(array) - j);
		return A5($folkertdev$elm_flate$LZ77$longestCommonPrefixLoop, i, j, i + remaining, 0, array);
	});
var $folkertdev$elm_flate$PrefixTable$OutOfBounds = {$: 'OutOfBounds'};
var $folkertdev$elm_flate$PrefixTable$Prefix = F2(
	function (a, b) {
		return {$: 'Prefix', a: a, b: b};
	});
var $folkertdev$elm_flate$PrefixTable$PrefixCode = function (a) {
	return {$: 'PrefixCode', a: a};
};
var $folkertdev$elm_flate$PrefixTable$Trailing1 = function (a) {
	return {$: 'Trailing1', a: a};
};
var $folkertdev$elm_flate$PrefixTable$Trailing2 = F2(
	function (a, b) {
		return {$: 'Trailing2', a: a, b: b};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$getInt32 = F2(
	function (index, _v0) {
		var array = _v0.a;
		var finalBytes = _v0.c;
		var size = $elm$core$Array$length(array);
		return (!(index - size)) ? $elm$core$Maybe$Just(finalBytes) : A2($elm$core$Array$get, index, array);
	});
var $folkertdev$elm_flate$PrefixTable$prefixAt = F2(
	function (k, input) {
		var size = $folkertdev$elm_flate$Experimental$ByteArray$length(input);
		if (_Utils_cmp(k + 2, size) > -1) {
			if (_Utils_cmp(k, size) > -1) {
				return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
			} else {
				if (_Utils_cmp(k + 1, size) > -1) {
					var _v0 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k, input);
					if (_v0.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var value = _v0.a;
						return $folkertdev$elm_flate$PrefixTable$Trailing1(value);
					}
				} else {
					var _v1 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k, input);
					if (_v1.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var v1 = _v1.a;
						var _v2 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k + 1, input);
						if (_v2.$ === 'Nothing') {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var v2 = _v2.a;
							return A2($folkertdev$elm_flate$PrefixTable$Trailing2, v1, v2);
						}
					}
				}
			}
		} else {
			var offset = k % 4;
			var internalIndex = (k / 4) | 0;
			switch (offset) {
				case 0:
					var _v4 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v4.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v4.a;
						var first = 255 & ((int32 >> 24) >>> 0);
						var code = int32 >> 8;
						return A2(
							$folkertdev$elm_flate$PrefixTable$Prefix,
							first,
							$folkertdev$elm_flate$PrefixTable$PrefixCode(code));
					}
				case 1:
					var _v5 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v5.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v5.a;
						var first = 255 & ((255 & (int32 >> 16)) >>> 0);
						var code = 16777215 & int32;
						return A2(
							$folkertdev$elm_flate$PrefixTable$Prefix,
							first,
							$folkertdev$elm_flate$PrefixTable$PrefixCode(code));
					}
				case 2:
					var _v6 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v6.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v6.a;
						var _v7 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex + 1, input);
						if (_v7.$ === 'Nothing') {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var nextInt32 = _v7.a;
							var first = 255 & ((255 & (int32 >> 8)) >>> 0);
							var code = 16777215 & (((255 & (nextInt32 >> 24)) | ((65535 & int32) << 8)) >>> 0);
							return A2(
								$folkertdev$elm_flate$PrefixTable$Prefix,
								first,
								$folkertdev$elm_flate$PrefixTable$PrefixCode(code));
						}
					}
				default:
					var _v8 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v8.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v8.a;
						var _v9 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex + 1, input);
						if (_v9.$ === 'Nothing') {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var nextInt32 = _v9.a;
							var first = 255 & ((255 & int32) >>> 0);
							var code = (65535 & (nextInt32 >> 16)) | ((255 & int32) << 16);
							return A2(
								$folkertdev$elm_flate$PrefixTable$Prefix,
								first,
								$folkertdev$elm_flate$PrefixTable$PrefixCode(code));
						}
					}
			}
		}
	});
var $folkertdev$elm_flate$LZ77$updatePrefixTableLoop = F4(
	function (k, limit, buffer, prefixTable) {
		updatePrefixTableLoop:
		while (true) {
			if (_Utils_cmp(k, limit) < 0) {
				var _v0 = A2($folkertdev$elm_flate$PrefixTable$prefixAt, k, buffer);
				if (_v0.$ === 'Prefix') {
					var code = _v0.b;
					var _v1 = A3($folkertdev$elm_flate$PrefixTable$insert, code, k, prefixTable);
					var newPrefixTable = _v1.a;
					var $temp$k = k + 1,
						$temp$limit = limit,
						$temp$buffer = buffer,
						$temp$prefixTable = newPrefixTable;
					k = $temp$k;
					limit = $temp$limit;
					buffer = $temp$buffer;
					prefixTable = $temp$prefixTable;
					continue updatePrefixTableLoop;
				} else {
					return prefixTable;
				}
			} else {
				return prefixTable;
			}
		}
	});
var $folkertdev$elm_flate$LZ77$flushLoop = F5(
	function (i, windowSize, buffer, prefixTable, encoders) {
		flushLoop:
		while (true) {
			var _v0 = A2($folkertdev$elm_flate$PrefixTable$prefixAt, i, buffer);
			switch (_v0.$) {
				case 'OutOfBounds':
					return encoders;
				case 'Trailing1':
					var p1 = _v0.a;
					return A2(
						$elm$core$Array$push,
						$folkertdev$elm_flate$LZ77$Literal(p1),
						encoders);
				case 'Trailing2':
					var p1 = _v0.a;
					var p2 = _v0.b;
					return A2(
						$elm$core$Array$push,
						$folkertdev$elm_flate$LZ77$Literal(p2),
						A2(
							$elm$core$Array$push,
							$folkertdev$elm_flate$LZ77$Literal(p1),
							encoders));
				default:
					var p1 = _v0.a;
					var key = _v0.b;
					var _v1 = A3($folkertdev$elm_flate$PrefixTable$insert, key, i, prefixTable);
					var newPrefixTable = _v1.a;
					var matched = _v1.b;
					if (matched.$ === 'Just') {
						var j = matched.a;
						var distance = i - j;
						if ((distance - windowSize) <= 0) {
							var length = 3 + A3($folkertdev$elm_flate$LZ77$longestCommonPrefix, i + 3, j + 3, buffer);
							var newEncoders = A2(
								$elm$core$Array$push,
								A2($folkertdev$elm_flate$LZ77$Pointer, length, distance),
								encoders);
							var newerPrefixTable = A4($folkertdev$elm_flate$LZ77$updatePrefixTableLoop, i + 1, i + length, buffer, newPrefixTable);
							var $temp$i = i + length,
								$temp$windowSize = windowSize,
								$temp$buffer = buffer,
								$temp$prefixTable = newerPrefixTable,
								$temp$encoders = newEncoders;
							i = $temp$i;
							windowSize = $temp$windowSize;
							buffer = $temp$buffer;
							prefixTable = $temp$prefixTable;
							encoders = $temp$encoders;
							continue flushLoop;
						} else {
							var $temp$i = i + 1,
								$temp$windowSize = windowSize,
								$temp$buffer = buffer,
								$temp$prefixTable = newPrefixTable,
								$temp$encoders = A2(
								$elm$core$Array$push,
								$folkertdev$elm_flate$LZ77$Literal(p1),
								encoders);
							i = $temp$i;
							windowSize = $temp$windowSize;
							buffer = $temp$buffer;
							prefixTable = $temp$prefixTable;
							encoders = $temp$encoders;
							continue flushLoop;
						}
					} else {
						var $temp$i = i + 1,
							$temp$windowSize = windowSize,
							$temp$buffer = buffer,
							$temp$prefixTable = newPrefixTable,
							$temp$encoders = A2(
							$elm$core$Array$push,
							$folkertdev$elm_flate$LZ77$Literal(p1),
							encoders);
						i = $temp$i;
						windowSize = $temp$windowSize;
						buffer = $temp$buffer;
						prefixTable = $temp$prefixTable;
						encoders = $temp$encoders;
						continue flushLoop;
					}
			}
		}
	});
var $folkertdev$elm_flate$PrefixTable$max_distance = 32768;
var $folkertdev$elm_flate$PrefixTable$max_window_size = $folkertdev$elm_flate$PrefixTable$max_distance;
var $folkertdev$elm_flate$PrefixTable$newLargePrefixTable = $folkertdev$elm_flate$PrefixTable$LargePrefixTable(
	A2($elm$core$Array$repeat, 65535, _List_Nil));
var $folkertdev$elm_flate$PrefixTable$new = function (nbytes) {
	return (_Utils_cmp(nbytes, $folkertdev$elm_flate$PrefixTable$max_window_size) < 0) ? $folkertdev$elm_flate$PrefixTable$Small($elm$core$Dict$empty) : $folkertdev$elm_flate$PrefixTable$Large($folkertdev$elm_flate$PrefixTable$newLargePrefixTable);
};
var $folkertdev$elm_flate$LZ77$flush = F2(
	function (windowSize, buffer) {
		var codes = A5(
			$folkertdev$elm_flate$LZ77$flushLoop,
			0,
			windowSize,
			buffer,
			$folkertdev$elm_flate$PrefixTable$new(
				$folkertdev$elm_flate$Experimental$ByteArray$length(buffer)),
			$elm$core$Array$empty);
		return codes;
	});
var $folkertdev$elm_flate$Experimental$ByteArray$ByteArray = F3(
	function (a, b, c) {
		return {$: 'ByteArray', a: a, b: b, c: c};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$empty = A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, $elm$core$Array$empty, 0, 0);
var $elm$bytes$Bytes$Decode$andThen = F2(
	function (callback, _v0) {
		var decodeA = _v0.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v1 = A2(decodeA, bites, offset);
					var newOffset = _v1.a;
					var a = _v1.b;
					var _v2 = callback(a);
					var decodeB = _v2.a;
					return A2(decodeB, bites, newOffset);
				}));
	});
var $folkertdev$elm_flate$Experimental$ByteArray$fromBytesHelp = function (_v0) {
	var remaining = _v0.a;
	var array = _v0.b;
	if (remaining >= 40) {
		return A2(
			$elm$bytes$Bytes$Decode$andThen,
			$elm$core$Basics$identity,
			A6(
				$elm$bytes$Bytes$Decode$map5,
				F5(
					function (a, b, c, d, e) {
						return A6(
							$elm$bytes$Bytes$Decode$map5,
							F5(
								function (f, g, h, i, j) {
									return $elm$bytes$Bytes$Decode$Loop(
										_Utils_Tuple2(
											remaining - 40,
											A2(
												$elm$core$Array$append,
												array,
												$elm$core$Array$fromList(
													_List_fromArray(
														[a, b, c, d, e, f, g, h, i, j])))));
								}),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE));
					}),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE)));
	} else {
		if (remaining >= 20) {
			return A6(
				$elm$bytes$Bytes$Decode$map5,
				F5(
					function (a, b, c, d, e) {
						return $elm$bytes$Bytes$Decode$Loop(
							_Utils_Tuple2(
								remaining - 20,
								A2(
									$elm$core$Array$push,
									e,
									A2(
										$elm$core$Array$push,
										d,
										A2(
											$elm$core$Array$push,
											c,
											A2(
												$elm$core$Array$push,
												b,
												A2($elm$core$Array$push, a, array)))))));
					}),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE));
		} else {
			if (remaining >= 4) {
				return A2(
					$elm$bytes$Bytes$Decode$map,
					function (a) {
						return $elm$bytes$Bytes$Decode$Loop(
							_Utils_Tuple2(
								remaining - 4,
								A2($elm$core$Array$push, a, array)));
					},
					$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE));
			} else {
				switch (remaining) {
					case 0:
						return $elm$bytes$Bytes$Decode$succeed(
							$elm$bytes$Bytes$Decode$Done(
								_Utils_Tuple3(0, 0, array)));
					case 1:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_byte) {
								return $elm$bytes$Bytes$Decode$Done(
									_Utils_Tuple3(1, _byte << 24, array));
							},
							$elm$bytes$Bytes$Decode$unsignedInt8);
					case 2:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_byte) {
								return $elm$bytes$Bytes$Decode$Done(
									_Utils_Tuple3(2, _byte << 16, array));
							},
							$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$BE));
					default:
						return A3(
							$elm$bytes$Bytes$Decode$map2,
							F2(
								function (bytes, _byte) {
									return $elm$bytes$Bytes$Decode$Done(
										_Utils_Tuple3(3, (bytes << 16) | (_byte << 8), array));
								}),
							$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt8);
				}
			}
		}
	}
};
var $folkertdev$elm_flate$Experimental$ByteArray$fromBytes = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(
				$elm$bytes$Bytes$width(buffer),
				$elm$core$Array$empty),
			$folkertdev$elm_flate$Experimental$ByteArray$fromBytesHelp),
		buffer);
	if (_v0.$ === 'Nothing') {
		return $folkertdev$elm_flate$Experimental$ByteArray$empty;
	} else {
		var _v1 = _v0.a;
		var finalSize = _v1.a;
		var finalBytes = _v1.b;
		var array = _v1.c;
		return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
	}
};
var $folkertdev$elm_flate$LZ77$encodeWithOptions = F2(
	function (_v0, buffer) {
		var windowSize = _v0.windowSize;
		return A2(
			$folkertdev$elm_flate$LZ77$flush,
			windowSize,
			$folkertdev$elm_flate$Experimental$ByteArray$fromBytes(buffer));
	});
var $folkertdev$elm_flate$ByteArray$decodeByteArrayHelp = function (_v0) {
	var remaining = _v0.a;
	var accum = _v0.b;
	return (remaining >= 4) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			var byte4 = 255 & (_new >>> 0);
			var byte3 = 255 & ((_new >> 8) >>> 0);
			var byte2 = 255 & ((_new >> 16) >>> 0);
			var byte1 = 255 & ((_new >> 24) >>> 0);
			var newAccum = A2(
				$elm$core$Array$push,
				byte4,
				A2(
					$elm$core$Array$push,
					byte3,
					A2(
						$elm$core$Array$push,
						byte2,
						A2($elm$core$Array$push, byte1, accum))));
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(remaining - 4, newAccum));
		},
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					remaining - 1,
					A2($elm$core$Array$push, _new, accum)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(accum)));
};
var $folkertdev$elm_flate$ByteArray$decoder = function (n) {
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		_Utils_Tuple2(n, $elm$core$Array$empty),
		$folkertdev$elm_flate$ByteArray$decodeByteArrayHelp);
};
var $folkertdev$elm_flate$ByteArray$fromBytes = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		$folkertdev$elm_flate$ByteArray$decoder(
			$elm$bytes$Bytes$width(buffer)),
		buffer);
	if (_v0.$ === 'Nothing') {
		return $elm$core$Array$empty;
	} else {
		var value = _v0.a;
		return value;
	}
};
var $folkertdev$elm_flate$Deflate$Internal$compress = F2(
	function (maybeWindowSize, buf) {
		if (maybeWindowSize.$ === 'Nothing') {
			return A2(
				$elm$core$Array$push,
				$folkertdev$elm_flate$Deflate$Symbol$EndOfBlock,
				A2(
					$elm$core$Array$map,
					$folkertdev$elm_flate$Deflate$Symbol$Literal,
					$folkertdev$elm_flate$ByteArray$fromBytes(buf)));
		} else {
			var windowSize = maybeWindowSize.a;
			return A2(
				$elm$core$Array$push,
				$folkertdev$elm_flate$Deflate$Symbol$EndOfBlock,
				A2(
					$elm$core$Array$map,
					$folkertdev$elm_flate$Deflate$Internal$codeToSymbol,
					A2(
						$folkertdev$elm_flate$LZ77$encodeWithOptions,
						{windowSize: windowSize},
						buf)));
		}
	});
var $elm$bytes$Bytes$Encode$U16 = F2(
	function (a, b) {
		return {$: 'U16', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt16 = $elm$bytes$Bytes$Encode$U16;
var $folkertdev$elm_flate$Deflate$BitWriter$flushIfNeeded = F3(
	function (tag, bitsWritten, encoders) {
		return (bitsWritten >= 16) ? {
			bitsWritten: bitsWritten - 16,
			encoders: A2(
				$elm$core$List$cons,
				A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, tag),
				encoders),
			tag: tag >> 16
		} : {bitsWritten: bitsWritten, encoders: encoders, tag: tag};
	});
var $folkertdev$elm_flate$Deflate$BitWriter$writeBits = F3(
	function (bitwidth, bits, state) {
		return A3($folkertdev$elm_flate$Deflate$BitWriter$flushIfNeeded, state.tag | (bits << state.bitsWritten), state.bitsWritten + bitwidth, state.encoders);
	});
var $folkertdev$elm_flate$Huffman$encode = F2(
	function (symbol, _v0) {
		var table = _v0.a;
		var _v1 = A2($elm$core$Array$get, symbol, table);
		if (_v1.$ === 'Nothing') {
			return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 0, 0);
		} else {
			var width = _v1.a.a.width;
			var bits = _v1.a.a.bits;
			return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, width, bits);
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$extraLength = function (symbol) {
	if (symbol.$ === 'Share') {
		var length = symbol.a;
		return (((length >= 3) && (length <= 10)) || (length === 258)) ? $elm$core$Maybe$Nothing : (((length >= 11) && (length <= 18)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				1,
				A2($elm$core$Basics$modBy, 2, length - 11))) : (((length >= 19) && (length <= 34)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				2,
				A2($elm$core$Basics$modBy, 4, length - 19))) : (((length >= 35) && (length <= 66)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				3,
				A2($elm$core$Basics$modBy, 8, length - 35))) : (((length >= 67) && (length <= 130)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				4,
				A2($elm$core$Basics$modBy, 16, length - 67))) : (((length >= 131) && (length <= 257)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				5,
				A2($elm$core$Basics$modBy, 32, length - 131))) : $elm$core$Maybe$Nothing)))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$encode = F3(
	function (symbol, htrees, bitWriter) {
		var maybeExtra = function () {
			var _v2 = $folkertdev$elm_flate$Deflate$Symbol$extraLength(symbol);
			if (_v2.$ === 'Nothing') {
				return $elm$core$Basics$identity;
			} else {
				var _v3 = _v2.a;
				var bits = _v3.a;
				var extra = _v3.b;
				return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, bits, extra);
			}
		}();
		var maybeDistance = function () {
			var _v0 = $folkertdev$elm_flate$Deflate$Symbol$distance(symbol);
			if (_v0.$ === 'Nothing') {
				return $elm$core$Basics$identity;
			} else {
				var _v1 = _v0.a;
				var code_ = _v1.a;
				var bits = _v1.b;
				var extra = _v1.c;
				return A2(
					$elm$core$Basics$composeR,
					A2($folkertdev$elm_flate$Huffman$encode, code_, htrees.distance),
					(bits > 0) ? A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, bits, extra) : $elm$core$Basics$identity);
			}
		}();
		return maybeDistance(
			maybeExtra(
				A3(
					$folkertdev$elm_flate$Huffman$encode,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					htrees.literal,
					bitWriter)));
	});
var $folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order = _List_fromArray(
	[16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var $folkertdev$elm_flate$Deflate$Symbol$calculateCodes = function (runLengths) {
	var loop2 = F3(
		function (r, c, codes) {
			loop2:
			while (true) {
				if (c >= 3) {
					var n = A2($elm$core$Basics$min, 6, c);
					var $temp$r = r,
						$temp$c = c - n,
						$temp$codes = A2(
						$elm$core$Array$push,
						_Utils_Tuple3(16, 2, n - 3),
						codes);
					r = $temp$r;
					c = $temp$c;
					codes = $temp$codes;
					continue loop2;
				} else {
					return A2(
						$elm$core$Array$append,
						codes,
						A2(
							$elm$core$Array$repeat,
							c,
							_Utils_Tuple3(r.value, 0, 0)));
				}
			}
		});
	var loop1 = F2(
		function (c, codes) {
			loop1:
			while (true) {
				if (c >= 11) {
					var n = A2($elm$core$Basics$min, 138, c);
					var $temp$c = c - n,
						$temp$codes = A2(
						$elm$core$Array$push,
						_Utils_Tuple3(18, 7, n - 11),
						codes);
					c = $temp$c;
					codes = $temp$codes;
					continue loop1;
				} else {
					if (c >= 3) {
						return A2(
							$elm$core$Array$push,
							_Utils_Tuple3(17, 3, c - 3),
							codes);
					} else {
						return A2(
							$elm$core$Array$append,
							codes,
							A2(
								$elm$core$Array$repeat,
								c,
								_Utils_Tuple3(0, 0, 0)));
					}
				}
			}
		});
	var folder = F2(
		function (r, codes) {
			return (!r.value) ? A2(loop1, r.count, codes) : A3(
				loop2,
				r,
				r.count - 1,
				A2(
					$elm$core$Array$push,
					_Utils_Tuple3(r.value, 0, 0),
					codes));
		});
	return A3($elm$core$Array$foldl, folder, $elm$core$Array$empty, runLengths);
};
var $folkertdev$elm_flate$Huffman$getWidth = function (_v0) {
	var width = _v0.a.width;
	return width;
};
var $folkertdev$elm_flate$Huffman$lookup = F2(
	function (symbol, _v0) {
		var array = _v0.a;
		return A2($elm$core$Array$get, symbol, array);
	});
var $folkertdev$elm_flate$Deflate$Symbol$calculateRunLengths = F2(
	function (lengths, accum) {
		calculateRunLengths:
		while (true) {
			if (!lengths.b) {
				return A3($elm$core$List$foldr, $elm$core$Array$push, $elm$core$Array$empty, accum);
			} else {
				var _v1 = lengths.a;
				var e = _v1.a;
				var size = _v1.b;
				var rest = lengths.b;
				var list = A2(
					$elm$core$List$indexedMap,
					$elm$core$Tuple$pair,
					A2(
						$elm$core$List$map,
						function (x) {
							return A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$map,
									$folkertdev$elm_flate$Huffman$getWidth,
									A2($folkertdev$elm_flate$Huffman$lookup, x, e)));
						},
						A2($elm$core$List$range, 0, size - 1)));
				var folder = F2(
					function (_v3, runLengths) {
						var i = _v3.a;
						var c = _v3.b;
						if (!runLengths.b) {
							return A2(
								$elm$core$List$cons,
								{count: 1, value: c},
								runLengths);
						} else {
							var last = runLengths.a;
							var remaining = runLengths.b;
							return _Utils_eq(last.value, c) ? A2(
								$elm$core$List$cons,
								{count: last.count + 1, value: last.value},
								remaining) : A2(
								$elm$core$List$cons,
								{count: 1, value: c},
								runLengths);
						}
					});
				var $temp$lengths = rest,
					$temp$accum = A3($elm$core$List$foldl, folder, accum, list);
				lengths = $temp$lengths;
				accum = $temp$accum;
				continue calculateRunLengths;
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$buildBitWidthCodes = F3(
	function (literalCodeCount, distanceCodeCount, trees) {
		var runLengths = A2(
			$folkertdev$elm_flate$Deflate$Symbol$calculateRunLengths,
			_List_fromArray(
				[
					_Utils_Tuple2(trees.literal, literalCodeCount),
					_Utils_Tuple2(trees.distance, distanceCodeCount)
				]),
			_List_Nil);
		return $folkertdev$elm_flate$Deflate$Symbol$calculateCodes(runLengths);
	});
var $folkertdev$elm_flate$Deflate$Symbol$positionLoop = F3(
	function (predicate, i, elements) {
		positionLoop:
		while (true) {
			if (!elements.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = elements.a;
				var xs = elements.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(i);
				} else {
					var $temp$predicate = predicate,
						$temp$i = i + 1,
						$temp$elements = xs;
					predicate = $temp$predicate;
					i = $temp$i;
					elements = $temp$elements;
					continue positionLoop;
				}
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$position = F2(
	function (predicate, elements) {
		return A3($folkertdev$elm_flate$Deflate$Symbol$positionLoop, predicate, 0, elements);
	});
var $folkertdev$elm_flate$Huffman$positionFromTheEnd = F2(
	function (predicated, array) {
		var folder = F2(
			function (element, _v1) {
				var index = _v1.a;
				var accum = _v1.b;
				if (accum.$ === 'Just') {
					return _Utils_Tuple2(index, accum);
				} else {
					return predicated(element) ? _Utils_Tuple2(
						index,
						$elm$core$Maybe$Just(index)) : _Utils_Tuple2(index - 1, $elm$core$Maybe$Nothing);
				}
			});
		var finalIndex = $elm$core$Array$length(array) - 1;
		return A2(
			$elm$core$Maybe$map,
			function (v) {
				return finalIndex - v;
			},
			A3(
				$elm$core$Array$foldr,
				folder,
				_Utils_Tuple2(finalIndex, $elm$core$Maybe$Nothing),
				array).b);
	});
var $folkertdev$elm_flate$Huffman$usedMaxSymbol = function (_v0) {
	var array = _v0.a;
	return A2(
		$elm$core$Maybe$map,
		function (trailingZeros) {
			return ($elm$core$Array$length(array) - 1) - trailingZeros;
		},
		A2(
			$folkertdev$elm_flate$Huffman$positionFromTheEnd,
			function (_v1) {
				var value = _v1.a;
				return value.width > 0;
			},
			array));
};
var $folkertdev$elm_flate$Deflate$Symbol$writeDynamicHuffmanCodec = F2(
	function (trees, bitWriter) {
		var literal_code_count = A2(
			$elm$core$Basics$max,
			257,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$folkertdev$elm_flate$Huffman$usedMaxSymbol(trees.literal)) + 1);
		var distance_code_count = A2(
			$elm$core$Basics$max,
			1,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$folkertdev$elm_flate$Huffman$usedMaxSymbol(trees.distance)) + 1);
		var codes = A3(
			$folkertdev$elm_flate$Deflate$Symbol$buildBitWidthCodes,
			literal_code_count,
			distance_code_count,
			{distance: trees.distance, literal: trees.literal});
		var codeCounts = A3(
			$elm$core$Array$foldl,
			function (_v2) {
				var i = _v2.a;
				return A2(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					i,
					function (v) {
						return v + 1;
					});
			},
			A2($elm$core$Array$repeat, 19, 0),
			codes);
		var bitWidthEncoder = A2($folkertdev$elm_flate$Huffman$fromFrequencies, codeCounts, 7);
		var bitwidthCodeCount = A2(
			$elm$core$Basics$max,
			4,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$map,
					function (trailingZeros) {
						return 19 - trailingZeros;
					},
					A2(
						$folkertdev$elm_flate$Deflate$Symbol$position,
						function (i) {
							var _v1 = A2($folkertdev$elm_flate$Huffman$lookup, i, bitWidthEncoder);
							if (_v1.$ === 'Nothing') {
								return false;
							} else {
								var value = _v1.a;
								return $folkertdev$elm_flate$Huffman$getWidth(value) > 0;
							}
						},
						$elm$core$List$reverse($folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order)))));
		var v1 = function (writer) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (i, current) {
						var width = _Utils_eq(
							A2($elm$core$Array$get, i, codeCounts),
							$elm$core$Maybe$Just(0)) ? 0 : A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Maybe$map,
								$folkertdev$elm_flate$Huffman$getWidth,
								A2($folkertdev$elm_flate$Huffman$lookup, i, bitWidthEncoder)));
						return A3($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 3, width, current);
					}),
				writer,
				A2($elm$core$List$take, bitwidthCodeCount, $folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order));
		};
		var v2 = function (writer) {
			return A3(
				$elm$core$Array$foldl,
				F2(
					function (_v0, current) {
						var code_ = _v0.a;
						var bits = _v0.b;
						var extra = _v0.c;
						return (bits > 0) ? A3(
							$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
							bits,
							extra,
							A3($folkertdev$elm_flate$Huffman$encode, code_, bitWidthEncoder, current)) : A3($folkertdev$elm_flate$Huffman$encode, code_, bitWidthEncoder, current);
					}),
				writer,
				codes);
		};
		return v2(
			v1(
				A3(
					$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
					4,
					bitwidthCodeCount - 4,
					A3(
						$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
						5,
						distance_code_count - 1,
						A3($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 5, literal_code_count - 257, bitWriter)))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeCompressDynamic = F3(
	function (maybeWindowSize, buf, bitWriter) {
		var compressed = A2($folkertdev$elm_flate$Deflate$Internal$compress, maybeWindowSize, buf);
		var huffmanTree = $folkertdev$elm_flate$Deflate$Symbol$buildDynamicHuffmanCodec(compressed);
		var huffmanTreeWriter = A2($folkertdev$elm_flate$Deflate$Symbol$writeDynamicHuffmanCodec, huffmanTree, bitWriter);
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (symbol, first) {
					return A3($folkertdev$elm_flate$Deflate$Symbol$encode, symbol, huffmanTree, first);
				}),
			huffmanTreeWriter,
			compressed);
	});
var $folkertdev$elm_flate$Deflate$BitWriter$writeBit = function (b) {
	if (!b) {
		return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 1, 0);
	} else {
		return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 1, 1);
	}
};
var $folkertdev$elm_flate$Deflate$Internal$encodeDynamicBlock = F3(
	function (windowSize, _v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		return A3(
			$folkertdev$elm_flate$Deflate$Internal$encodeCompressDynamic,
			windowSize,
			buffer,
			A3(
				$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
				2,
				2,
				A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter)));
	});
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 'U8', a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $folkertdev$elm_flate$Deflate$BitWriter$flushLoop = F3(
	function (tag, bitsWritten, encoders) {
		flushLoop:
		while (true) {
			if (bitsWritten > 0) {
				var $temp$tag = tag >> 8,
					$temp$bitsWritten = A2($elm$core$Basics$max, 0, bitsWritten - 8),
					$temp$encoders = A2(
					$elm$core$List$cons,
					$elm$bytes$Bytes$Encode$unsignedInt8(tag),
					encoders);
				tag = $temp$tag;
				bitsWritten = $temp$bitsWritten;
				encoders = $temp$encoders;
				continue flushLoop;
			} else {
				return {bitsWritten: bitsWritten, encoders: encoders, tag: tag};
			}
		}
	});
var $folkertdev$elm_flate$Deflate$BitWriter$flush = function (state) {
	return A3($folkertdev$elm_flate$Deflate$BitWriter$flushLoop, state.tag, state.bitsWritten, state.encoders);
};
var $folkertdev$elm_flate$Deflate$BitWriter$run = function (state) {
	return $elm$core$List$reverse(state.encoders);
};
var $folkertdev$elm_flate$Deflate$Internal$encodeDynamic = F2(
	function (windowSize, buffer) {
		var encodedChunks = A2(
			$elm$core$List$map,
			$folkertdev$elm_flate$Deflate$Internal$encodeDynamicBlock(windowSize),
			A2($folkertdev$elm_flate$Deflate$Internal$chunks, $folkertdev$elm_flate$Deflate$Internal$default_block_size, buffer));
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				$folkertdev$elm_flate$Deflate$BitWriter$run(
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$elm$core$List$foldl,
							F2(
								function (chunk, first) {
									return chunk(first);
								}),
							$folkertdev$elm_flate$Deflate$BitWriter$empty,
							encodedChunks)))));
	});
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size = 65535;
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $folkertdev$elm_flate$ByteArray$fasterEncodeFolderR = F2(
	function (_byte, _v0) {
		var bytesOnAccum = _v0.a;
		var accum = _v0.b;
		var encoders = _v0.c;
		switch (bytesOnAccum) {
			case 0:
				var value = 255 & _byte;
				return _Utils_Tuple3(1, value, encoders);
			case 1:
				var value = accum | ((255 & _byte) << 8);
				return _Utils_Tuple3(2, value, encoders);
			case 2:
				var value = accum | ((255 & _byte) << 16);
				return _Utils_Tuple3(3, value, encoders);
			default:
				var value = accum | ((255 & _byte) << 24);
				return _Utils_Tuple3(
					0,
					0,
					A2(
						$elm$core$List$cons,
						A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, value),
						encoders));
		}
	});
var $folkertdev$elm_flate$ByteArray$fasterEncodeR = function (_v0) {
	var bytesOnAccum = _v0.a;
	var accum = _v0.b;
	var otherEncoders = _v0.c;
	var encoders = function () {
		switch (bytesOnAccum) {
			case 0:
				return otherEncoders;
			case 1:
				return A2(
					$elm$core$List$cons,
					$elm$bytes$Bytes$Encode$unsignedInt8(accum),
					otherEncoders);
			case 2:
				return A2(
					$elm$core$List$cons,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, accum),
					otherEncoders);
			default:
				var otherBytes = accum >> 8;
				var firstByte = 255 & accum;
				return A2(
					$elm$core$List$cons,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, otherBytes),
					A2(
						$elm$core$List$cons,
						$elm$bytes$Bytes$Encode$unsignedInt8(firstByte),
						otherEncoders));
		}
	}();
	return encoders;
};
var $folkertdev$elm_flate$ByteArray$toBytes = function (array) {
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			$folkertdev$elm_flate$ByteArray$fasterEncodeR(
				A3(
					$elm$core$Array$foldr,
					$folkertdev$elm_flate$ByteArray$fasterEncodeFolderR,
					_Utils_Tuple3(0, 0, _List_Nil),
					array))));
};
var $folkertdev$elm_flate$Deflate$BitWriter$writeEncoder = F2(
	function (encoder, state) {
		return {
			bitsWritten: state.bitsWritten,
			encoders: A2($elm$core$List$cons, encoder, state.encoders),
			tag: state.tag
		};
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeRawBlock = F2(
	function (_v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		var byteArray = $folkertdev$elm_flate$ByteArray$fromBytes(buffer);
		var size = A2(
			$elm$core$Basics$min,
			$elm$core$Array$length(byteArray),
			$folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size);
		var sliced = A3($elm$core$Array$slice, 0, size, byteArray);
		return A2(
			$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
			$elm$bytes$Bytes$Encode$bytes(
				$folkertdev$elm_flate$ByteArray$toBytes(sliced)),
			A2(
				$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
				A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, ~size),
				A2(
					$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, size),
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
							2,
							0,
							A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter))))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeRaw = function (buffer) {
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			$folkertdev$elm_flate$Deflate$BitWriter$run(
				A3(
					$elm$core$List$foldl,
					F2(
						function (chunk, first) {
							return A2($folkertdev$elm_flate$Deflate$Internal$encodeRawBlock, chunk, first);
						}),
					$folkertdev$elm_flate$Deflate$BitWriter$empty,
					A2(
						$folkertdev$elm_flate$Deflate$Internal$chunks,
						A2($elm$core$Basics$min, $folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size, $folkertdev$elm_flate$Deflate$Internal$default_block_size),
						buffer)))));
};
var $folkertdev$elm_flate$Huffman$fromList = A2(
	$elm$core$Basics$composeL,
	A2($elm$core$Basics$composeL, $folkertdev$elm_flate$Huffman$Tree, $elm$core$Array$fromList),
	$elm$core$List$map($folkertdev$elm_flate$Huffman$codeFromRecord));
var $folkertdev$elm_flate$Huffman$hardcodedStaticHuffmanTree = {
	distance: $folkertdev$elm_flate$Huffman$fromList(
		_List_fromArray(
			[
				{bits: 0, width: 5},
				{bits: 16, width: 5},
				{bits: 8, width: 5},
				{bits: 24, width: 5},
				{bits: 4, width: 5},
				{bits: 20, width: 5},
				{bits: 12, width: 5},
				{bits: 28, width: 5},
				{bits: 2, width: 5},
				{bits: 18, width: 5},
				{bits: 10, width: 5},
				{bits: 26, width: 5},
				{bits: 6, width: 5},
				{bits: 22, width: 5},
				{bits: 14, width: 5},
				{bits: 30, width: 5},
				{bits: 1, width: 5},
				{bits: 17, width: 5},
				{bits: 9, width: 5},
				{bits: 25, width: 5},
				{bits: 5, width: 5},
				{bits: 21, width: 5},
				{bits: 13, width: 5},
				{bits: 29, width: 5},
				{bits: 3, width: 5},
				{bits: 19, width: 5},
				{bits: 11, width: 5},
				{bits: 27, width: 5},
				{bits: 7, width: 5},
				{bits: 23, width: 5}
			])),
	literal: $folkertdev$elm_flate$Huffman$fromList(
		_List_fromArray(
			[
				{bits: 12, width: 8},
				{bits: 140, width: 8},
				{bits: 76, width: 8},
				{bits: 204, width: 8},
				{bits: 44, width: 8},
				{bits: 172, width: 8},
				{bits: 108, width: 8},
				{bits: 236, width: 8},
				{bits: 28, width: 8},
				{bits: 156, width: 8},
				{bits: 92, width: 8},
				{bits: 220, width: 8},
				{bits: 60, width: 8},
				{bits: 188, width: 8},
				{bits: 124, width: 8},
				{bits: 252, width: 8},
				{bits: 2, width: 8},
				{bits: 130, width: 8},
				{bits: 66, width: 8},
				{bits: 194, width: 8},
				{bits: 34, width: 8},
				{bits: 162, width: 8},
				{bits: 98, width: 8},
				{bits: 226, width: 8},
				{bits: 18, width: 8},
				{bits: 146, width: 8},
				{bits: 82, width: 8},
				{bits: 210, width: 8},
				{bits: 50, width: 8},
				{bits: 178, width: 8},
				{bits: 114, width: 8},
				{bits: 242, width: 8},
				{bits: 10, width: 8},
				{bits: 138, width: 8},
				{bits: 74, width: 8},
				{bits: 202, width: 8},
				{bits: 42, width: 8},
				{bits: 170, width: 8},
				{bits: 106, width: 8},
				{bits: 234, width: 8},
				{bits: 26, width: 8},
				{bits: 154, width: 8},
				{bits: 90, width: 8},
				{bits: 218, width: 8},
				{bits: 58, width: 8},
				{bits: 186, width: 8},
				{bits: 122, width: 8},
				{bits: 250, width: 8},
				{bits: 6, width: 8},
				{bits: 134, width: 8},
				{bits: 70, width: 8},
				{bits: 198, width: 8},
				{bits: 38, width: 8},
				{bits: 166, width: 8},
				{bits: 102, width: 8},
				{bits: 230, width: 8},
				{bits: 22, width: 8},
				{bits: 150, width: 8},
				{bits: 86, width: 8},
				{bits: 214, width: 8},
				{bits: 54, width: 8},
				{bits: 182, width: 8},
				{bits: 118, width: 8},
				{bits: 246, width: 8},
				{bits: 14, width: 8},
				{bits: 142, width: 8},
				{bits: 78, width: 8},
				{bits: 206, width: 8},
				{bits: 46, width: 8},
				{bits: 174, width: 8},
				{bits: 110, width: 8},
				{bits: 238, width: 8},
				{bits: 30, width: 8},
				{bits: 158, width: 8},
				{bits: 94, width: 8},
				{bits: 222, width: 8},
				{bits: 62, width: 8},
				{bits: 190, width: 8},
				{bits: 126, width: 8},
				{bits: 254, width: 8},
				{bits: 1, width: 8},
				{bits: 129, width: 8},
				{bits: 65, width: 8},
				{bits: 193, width: 8},
				{bits: 33, width: 8},
				{bits: 161, width: 8},
				{bits: 97, width: 8},
				{bits: 225, width: 8},
				{bits: 17, width: 8},
				{bits: 145, width: 8},
				{bits: 81, width: 8},
				{bits: 209, width: 8},
				{bits: 49, width: 8},
				{bits: 177, width: 8},
				{bits: 113, width: 8},
				{bits: 241, width: 8},
				{bits: 9, width: 8},
				{bits: 137, width: 8},
				{bits: 73, width: 8},
				{bits: 201, width: 8},
				{bits: 41, width: 8},
				{bits: 169, width: 8},
				{bits: 105, width: 8},
				{bits: 233, width: 8},
				{bits: 25, width: 8},
				{bits: 153, width: 8},
				{bits: 89, width: 8},
				{bits: 217, width: 8},
				{bits: 57, width: 8},
				{bits: 185, width: 8},
				{bits: 121, width: 8},
				{bits: 249, width: 8},
				{bits: 5, width: 8},
				{bits: 133, width: 8},
				{bits: 69, width: 8},
				{bits: 197, width: 8},
				{bits: 37, width: 8},
				{bits: 165, width: 8},
				{bits: 101, width: 8},
				{bits: 229, width: 8},
				{bits: 21, width: 8},
				{bits: 149, width: 8},
				{bits: 85, width: 8},
				{bits: 213, width: 8},
				{bits: 53, width: 8},
				{bits: 181, width: 8},
				{bits: 117, width: 8},
				{bits: 245, width: 8},
				{bits: 13, width: 8},
				{bits: 141, width: 8},
				{bits: 77, width: 8},
				{bits: 205, width: 8},
				{bits: 45, width: 8},
				{bits: 173, width: 8},
				{bits: 109, width: 8},
				{bits: 237, width: 8},
				{bits: 29, width: 8},
				{bits: 157, width: 8},
				{bits: 93, width: 8},
				{bits: 221, width: 8},
				{bits: 61, width: 8},
				{bits: 189, width: 8},
				{bits: 125, width: 8},
				{bits: 253, width: 8},
				{bits: 19, width: 9},
				{bits: 275, width: 9},
				{bits: 147, width: 9},
				{bits: 403, width: 9},
				{bits: 83, width: 9},
				{bits: 339, width: 9},
				{bits: 211, width: 9},
				{bits: 467, width: 9},
				{bits: 51, width: 9},
				{bits: 307, width: 9},
				{bits: 179, width: 9},
				{bits: 435, width: 9},
				{bits: 115, width: 9},
				{bits: 371, width: 9},
				{bits: 243, width: 9},
				{bits: 499, width: 9},
				{bits: 11, width: 9},
				{bits: 267, width: 9},
				{bits: 139, width: 9},
				{bits: 395, width: 9},
				{bits: 75, width: 9},
				{bits: 331, width: 9},
				{bits: 203, width: 9},
				{bits: 459, width: 9},
				{bits: 43, width: 9},
				{bits: 299, width: 9},
				{bits: 171, width: 9},
				{bits: 427, width: 9},
				{bits: 107, width: 9},
				{bits: 363, width: 9},
				{bits: 235, width: 9},
				{bits: 491, width: 9},
				{bits: 27, width: 9},
				{bits: 283, width: 9},
				{bits: 155, width: 9},
				{bits: 411, width: 9},
				{bits: 91, width: 9},
				{bits: 347, width: 9},
				{bits: 219, width: 9},
				{bits: 475, width: 9},
				{bits: 59, width: 9},
				{bits: 315, width: 9},
				{bits: 187, width: 9},
				{bits: 443, width: 9},
				{bits: 123, width: 9},
				{bits: 379, width: 9},
				{bits: 251, width: 9},
				{bits: 507, width: 9},
				{bits: 7, width: 9},
				{bits: 263, width: 9},
				{bits: 135, width: 9},
				{bits: 391, width: 9},
				{bits: 71, width: 9},
				{bits: 327, width: 9},
				{bits: 199, width: 9},
				{bits: 455, width: 9},
				{bits: 39, width: 9},
				{bits: 295, width: 9},
				{bits: 167, width: 9},
				{bits: 423, width: 9},
				{bits: 103, width: 9},
				{bits: 359, width: 9},
				{bits: 231, width: 9},
				{bits: 487, width: 9},
				{bits: 23, width: 9},
				{bits: 279, width: 9},
				{bits: 151, width: 9},
				{bits: 407, width: 9},
				{bits: 87, width: 9},
				{bits: 343, width: 9},
				{bits: 215, width: 9},
				{bits: 471, width: 9},
				{bits: 55, width: 9},
				{bits: 311, width: 9},
				{bits: 183, width: 9},
				{bits: 439, width: 9},
				{bits: 119, width: 9},
				{bits: 375, width: 9},
				{bits: 247, width: 9},
				{bits: 503, width: 9},
				{bits: 15, width: 9},
				{bits: 271, width: 9},
				{bits: 143, width: 9},
				{bits: 399, width: 9},
				{bits: 79, width: 9},
				{bits: 335, width: 9},
				{bits: 207, width: 9},
				{bits: 463, width: 9},
				{bits: 47, width: 9},
				{bits: 303, width: 9},
				{bits: 175, width: 9},
				{bits: 431, width: 9},
				{bits: 111, width: 9},
				{bits: 367, width: 9},
				{bits: 239, width: 9},
				{bits: 495, width: 9},
				{bits: 31, width: 9},
				{bits: 287, width: 9},
				{bits: 159, width: 9},
				{bits: 415, width: 9},
				{bits: 95, width: 9},
				{bits: 351, width: 9},
				{bits: 223, width: 9},
				{bits: 479, width: 9},
				{bits: 63, width: 9},
				{bits: 319, width: 9},
				{bits: 191, width: 9},
				{bits: 447, width: 9},
				{bits: 127, width: 9},
				{bits: 383, width: 9},
				{bits: 255, width: 9},
				{bits: 511, width: 9},
				{bits: 0, width: 7},
				{bits: 64, width: 7},
				{bits: 32, width: 7},
				{bits: 96, width: 7},
				{bits: 16, width: 7},
				{bits: 80, width: 7},
				{bits: 48, width: 7},
				{bits: 112, width: 7},
				{bits: 8, width: 7},
				{bits: 72, width: 7},
				{bits: 40, width: 7},
				{bits: 104, width: 7},
				{bits: 24, width: 7},
				{bits: 88, width: 7},
				{bits: 56, width: 7},
				{bits: 120, width: 7},
				{bits: 4, width: 7},
				{bits: 68, width: 7},
				{bits: 36, width: 7},
				{bits: 100, width: 7},
				{bits: 20, width: 7},
				{bits: 84, width: 7},
				{bits: 52, width: 7},
				{bits: 116, width: 7},
				{bits: 3, width: 8},
				{bits: 131, width: 8},
				{bits: 67, width: 8},
				{bits: 195, width: 8},
				{bits: 35, width: 8},
				{bits: 163, width: 8},
				{bits: 99, width: 8},
				{bits: 227, width: 8}
			]))
};
var $folkertdev$elm_flate$Deflate$Internal$encodeCompressStatic = F3(
	function (maybeWindowSize, buf, bitWriter) {
		var huffmanTrees = $folkertdev$elm_flate$Huffman$hardcodedStaticHuffmanTree;
		var compressed = A2($folkertdev$elm_flate$Deflate$Internal$compress, maybeWindowSize, buf);
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (symbol, first) {
					return A3($folkertdev$elm_flate$Deflate$Symbol$encode, symbol, huffmanTrees, first);
				}),
			bitWriter,
			compressed);
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeStaticBlock = F3(
	function (windowSize, _v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		return A3(
			$folkertdev$elm_flate$Deflate$Internal$encodeCompressStatic,
			windowSize,
			buffer,
			A3(
				$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
				2,
				1,
				A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter)));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeStatic = F2(
	function (windowSize, buffer) {
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				$folkertdev$elm_flate$Deflate$BitWriter$run(
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$elm$core$List$foldl,
							F2(
								function (chunk, first) {
									return A3($folkertdev$elm_flate$Deflate$Internal$encodeStaticBlock, windowSize, chunk, first);
								}),
							$folkertdev$elm_flate$Deflate$BitWriter$empty,
							A2($folkertdev$elm_flate$Deflate$Internal$chunks, $folkertdev$elm_flate$Deflate$Internal$default_block_size, buffer))))));
	});
var $folkertdev$elm_flate$Flate$deflateWithOptions = F2(
	function (encoding, buffer) {
		switch (encoding.$) {
			case 'Raw':
				return $folkertdev$elm_flate$Deflate$Internal$encodeRaw(buffer);
			case 'Static':
				if (encoding.a.$ === 'NoCompression') {
					var _v1 = encoding.a;
					return A2($folkertdev$elm_flate$Deflate$Internal$encodeStatic, $elm$core$Maybe$Nothing, buffer);
				} else {
					var w = encoding.a.a;
					return A2(
						$folkertdev$elm_flate$Deflate$Internal$encodeStatic,
						$elm$core$Maybe$Just(w),
						buffer);
				}
			default:
				if (encoding.a.$ === 'NoCompression') {
					var _v2 = encoding.a;
					return A2($folkertdev$elm_flate$Deflate$Internal$encodeDynamic, $elm$core$Maybe$Nothing, buffer);
				} else {
					var w = encoding.a.a;
					return A2(
						$folkertdev$elm_flate$Deflate$Internal$encodeDynamic,
						$elm$core$Maybe$Just(w),
						buffer);
				}
		}
	});
var $elm$core$Basics$pow = _Basics_pow;
var $folkertdev$elm_flate$Flate$deflateZlibWithOptions = F2(
	function (encoding, buffer) {
		var windowSizeHelp = function (size) {
			var kb = 1024;
			return (size <= 256) ? 0 : ((size <= 512) ? 1 : ((_Utils_cmp(size, 1 * kb) < 1) ? 2 : ((_Utils_cmp(size, 2 * kb) < 1) ? 3 : ((_Utils_cmp(size, 4 * kb) < 1) ? 4 : ((_Utils_cmp(size, 8 * kb) < 1) ? 5 : ((_Utils_cmp(size, 16 * kb) < 1) ? 6 : ((_Utils_cmp(size, 32 * kb) < 1) ? 7 : 0)))))));
		};
		var windowSize = function () {
			switch (encoding.$) {
				case 'Raw':
					return 0;
				case 'Static':
					if (encoding.a.$ === 'NoCompression') {
						var _v1 = encoding.a;
						return 0;
					} else {
						var size = encoding.a.a;
						return windowSizeHelp(size);
					}
				default:
					if (encoding.a.$ === 'NoCompression') {
						var _v2 = encoding.a;
						return 0;
					} else {
						var size = encoding.a.a;
						return windowSizeHelp(size);
					}
			}
		}();
		var mask16 = function (value) {
			return value & (A2($elm$core$Basics$pow, 2, 16) - 1);
		};
		var encodedTrailer = _List_fromArray(
			[
				A2(
				$elm$bytes$Bytes$Encode$unsignedInt32,
				$elm$bytes$Bytes$BE,
				$folkertdev$elm_flate$Checksum$Adler32$adler32(buffer))
			]);
		var data = A2($folkertdev$elm_flate$Flate$deflateWithOptions, encoding, buffer);
		var compressionLevel = 2;
		var cmf = (windowSize << 4) | 8;
		var check = (cmf << 8) + (compressionLevel << 6);
		var flag = (!(!A2($elm$core$Basics$modBy, 31, check))) ? ((compressionLevel << 6) + (31 - A2($elm$core$Basics$modBy, 31, check))) : (compressionLevel << 6);
		var encodedHeader = _List_fromArray(
			[
				$elm$bytes$Bytes$Encode$unsignedInt8(cmf),
				$elm$bytes$Bytes$Encode$unsignedInt8(flag)
			]);
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				_Utils_ap(
					encodedHeader,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$bytes$Bytes$Encode$bytes(data)
							]),
						encodedTrailer))));
	});
var $folkertdev$elm_flate$LZ77$max_distance = 32768;
var $folkertdev$elm_flate$LZ77$maxWindowSize = $folkertdev$elm_flate$LZ77$max_distance;
var $folkertdev$elm_flate$Flate$deflateZlib = $folkertdev$elm_flate$Flate$deflateZlibWithOptions(
	$folkertdev$elm_flate$Flate$Dynamic(
		$folkertdev$elm_flate$Flate$WithWindowSize($folkertdev$elm_flate$LZ77$maxWindowSize)));
var $justgook$elm_image$Image$Internal$PNG$packIntoInt32 = F4(
	function (r, g, b, a) {
		return (((255 & r) << 24) | ((255 & g) << 16)) | (((255 & b) << 8) | (255 & a));
	});
var $justgook$elm_image$Image$Internal$PNG$encodePixel32 = F2(
	function (px, prev) {
		var r = px >>> 24;
		var prevR = prev >>> 24;
		var prevG = 255 & (prev >> 16);
		var prevB = 255 & (prev >> 8);
		var prevA = 255 & prev;
		var g = 255 & (px >> 16);
		var b = 255 & (px >> 8);
		var a = 255 & px;
		return A2(
			$elm$bytes$Bytes$Encode$unsignedInt32,
			$elm$bytes$Bytes$BE,
			A4($justgook$elm_image$Image$Internal$PNG$packIntoInt32, r - prevR, g - prevG, b - prevB, a - prevA));
	});
var $justgook$elm_image$Image$Internal$PNG$encodeIDAT = F2(
	function (_v0, arr) {
		var order = _v0.order;
		var scanLineFilter = $elm$bytes$Bytes$Encode$unsignedInt8(1);
		var _v1 = function () {
			switch (order.$) {
				case 'RightDown':
					return _Utils_Tuple2($elm$core$Array$foldl, $elm$core$Array$foldl);
				case 'RightUp':
					return _Utils_Tuple2($elm$core$Array$foldr, $elm$core$Array$foldl);
				case 'LeftDown':
					return _Utils_Tuple2($elm$core$Array$foldl, $elm$core$Array$foldr);
				default:
					return _Utils_Tuple2($elm$core$Array$foldr, $elm$core$Array$foldr);
			}
		}();
		var fold1 = _v1.a;
		var fold2 = _v1.b;
		return A3(
			$elm$core$Basics$composeR,
			$elm$core$List$reverse,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$concatMap($elm$core$List$reverse),
				A2(
					$elm$core$Basics$composeR,
					$elm$bytes$Bytes$Encode$sequence,
					A2(
						$elm$core$Basics$composeR,
						$elm$bytes$Bytes$Encode$encode,
						A2($elm$core$Basics$composeR, $folkertdev$elm_flate$Flate$deflateZlib, $elm$bytes$Bytes$Encode$bytes)))),
			A3(
				fold1,
				F2(
					function (sArr, acc) {
						return function (_v4) {
							var line = _v4.b;
							return A2($elm$core$List$cons, line, acc);
						}(
							A3(
								fold2,
								F2(
									function (px, _v3) {
										var prev = _v3.a;
										var acc2 = _v3.b;
										var packed = A2($justgook$elm_image$Image$Internal$PNG$encodePixel32, px, prev);
										return _Utils_Tuple2(
											px,
											A2($elm$core$List$cons, packed, acc2));
									}),
								_Utils_Tuple2(
									0,
									_List_fromArray(
										[scanLineFilter])),
								sArr));
					}),
				_List_Nil,
				arr));
	});
var $justgook$elm_image$Image$Internal$PNG$encodeIHDR = F3(
	function (width, height, _v0) {
		var format = _v0.format;
		var interlace = 0;
		var _v1 = function () {
			switch (format.$) {
				case 'RGBA':
					return _Utils_Tuple2(8, 6);
				case 'RGB':
					return _Utils_Tuple2(8, 2);
				case 'LUMINANCE_ALPHA':
					return _Utils_Tuple2(16, 0);
				default:
					return _Utils_Tuple2(8, 0);
			}
		}();
		var depth = _v1.a;
		var color = _v1.b;
		return $elm$bytes$Bytes$Encode$sequence(
			_List_fromArray(
				[
					A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, width),
					A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, height),
					$elm$bytes$Bytes$Encode$unsignedInt8(depth),
					$elm$bytes$Bytes$Encode$unsignedInt8(color),
					$elm$bytes$Bytes$Encode$unsignedInt8(0),
					$elm$bytes$Bytes$Encode$unsignedInt8(0),
					$elm$bytes$Bytes$Encode$unsignedInt8(interlace)
				]));
	});
var $justgook$elm_image$Image$Internal$PNG$encodeSignature = $elm$bytes$Bytes$Encode$sequence(
	_List_fromArray(
		[
			$elm$bytes$Bytes$Encode$unsignedInt8(137),
			$elm$bytes$Bytes$Encode$unsignedInt8(80),
			$elm$bytes$Bytes$Encode$unsignedInt8(78),
			$elm$bytes$Bytes$Encode$unsignedInt8(71),
			$elm$bytes$Bytes$Encode$unsignedInt8(13),
			$elm$bytes$Bytes$Encode$unsignedInt8(10),
			$elm$bytes$Bytes$Encode$unsignedInt8(26),
			$elm$bytes$Bytes$Encode$unsignedInt8(10)
		]));
var $justgook$elm_image$Image$Internal$ImageData$toArray2d = function (image) {
	toArray2d:
	while (true) {
		if (image.$ === 'ImageRaw') {
			var arr = image.b;
			return arr;
		} else {
			var meta = image.a;
			var fn = image.b;
			var _v1 = fn(meta);
			if (_v1.$ === 'Lazy') {
				return $elm$core$Array$empty;
			} else {
				var newData = _v1;
				var $temp$image = newData;
				image = $temp$image;
				continue toArray2d;
			}
		}
	}
};
var $justgook$elm_image$Image$Internal$PNG$encode = function (imgData) {
	var opt = $justgook$elm_image$Image$Internal$ImageData$defaultOptions;
	var chunkIEND = A2(
		$justgook$elm_image$Image$Internal$PNG$encodeChunk,
		1229278788,
		$elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(_List_Nil)));
	var arr = $justgook$elm_image$Image$Internal$ImageData$toArray2d(imgData);
	var chunkIDAT = A2(
		$justgook$elm_image$Image$Internal$PNG$encodeChunk,
		1229209940,
		$elm$bytes$Bytes$Encode$encode(
			A2($justgook$elm_image$Image$Internal$PNG$encodeIDAT, opt, arr)));
	var height = $elm$core$Array$length(arr);
	var width = A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Maybe$map,
			$elm$core$Array$length,
			A2($elm$core$Array$get, 0, arr)));
	var chunkIHDR = A2(
		$justgook$elm_image$Image$Internal$PNG$encodeChunk,
		1229472850,
		$elm$bytes$Bytes$Encode$encode(
			A3($justgook$elm_image$Image$Internal$PNG$encodeIHDR, width, height, opt)));
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			_List_fromArray(
				[$justgook$elm_image$Image$Internal$PNG$encodeSignature, chunkIHDR, chunkIDAT, chunkIEND])));
};
var $justgook$elm_image$Image$Internal$ImageData$map = F2(
	function (fn, image) {
		map:
		while (true) {
			if (image.$ === 'ImageRaw') {
				var meta = image.a;
				var arr = image.b;
				return A2(
					$justgook$elm_image$Image$Internal$ImageData$ImageRaw,
					meta,
					A2(
						$elm$core$Array$map,
						$elm$core$Array$map(fn),
						arr));
			} else {
				var meta = image.a;
				var fn_ = image.b;
				var _v1 = fn_(meta);
				if (_v1.$ === 'Lazy') {
					return image;
				} else {
					var newData = _v1;
					var $temp$fn = fn,
						$temp$image = newData;
					fn = $temp$fn;
					image = $temp$image;
					continue map;
				}
			}
		}
	});
var $justgook$elm_image$Image$Internal$Pixel$addAlphaChannel = $justgook$elm_image$Image$Internal$ImageData$map(
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Bitwise$shiftLeftBy(8),
		$elm$core$Basics$add(255)));
var $justgook$elm_image$Image$Internal$ImageData$getInfo = function (image) {
	if (image.$ === 'ImageRaw') {
		var meta = image.a;
		return meta;
	} else {
		var meta = image.a;
		return meta;
	}
};
var $justgook$elm_image$Image$Internal$Pixel$px8AlphaTo32 = function (px_) {
	var px = px_ >>> 8;
	return (255 & px_) + ((px + ((px + ((px + (px << 8)) << 8)) << 8)) << 8);
};
var $justgook$elm_image$Image$Internal$Pixel$px8to32 = function (px) {
	return 255 + ((px + ((px + ((px + (px << 8)) << 8)) << 8)) << 8);
};
var $justgook$elm_image$Image$Internal$Pixel$toBit32 = function (image) {
	var _v0 = $justgook$elm_image$Image$Internal$ImageData$getInfo(image);
	switch (_v0.$) {
		case 'Png':
			var color = _v0.a.color;
			switch (color.$) {
				case 'Greyscale':
					return image;
				case 'TrueColour':
					return image;
				case 'IndexedColour':
					return image;
				case 'GreyscaleAlpha':
					return A2($justgook$elm_image$Image$Internal$ImageData$map, $justgook$elm_image$Image$Internal$Pixel$px8AlphaTo32, image);
				default:
					return image;
			}
		case 'Bmp':
			var bitsPerPixel = _v0.a.bitsPerPixel;
			switch (bitsPerPixel.$) {
				case 'BmpBitsPerPixel8':
					return A2($justgook$elm_image$Image$Internal$ImageData$map, $justgook$elm_image$Image$Internal$Pixel$px8to32, image);
				case 'BmpBitsPerPixel16':
					return image;
				case 'BmpBitsPerPixel24':
					return $justgook$elm_image$Image$Internal$Pixel$addAlphaChannel(image);
				default:
					return image;
			}
		case 'Gif':
			return image;
		default:
			var color = _v0.a.color;
			switch (color.$) {
				case 'FromDataChannel1':
					return image;
				case 'FromDataChannel2':
					return image;
				case 'FromDataChannel3':
					return image;
				default:
					return image;
			}
	}
};
var $justgook$elm_image$Image$Advanced$toPng32 = A2($elm$core$Basics$composeR, $justgook$elm_image$Image$Internal$Pixel$toBit32, $justgook$elm_image$Image$Internal$PNG$encode);
var $justgook$elm_image$Image$toPngUrl = A2(
	$elm$core$Basics$composeR,
	$justgook$elm_image$Image$Advanced$toPng32,
	A2(
		$elm$core$Basics$composeR,
		$danfishgold$base64_bytes$Base64$fromBytes,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Maybe$withDefault(''),
			$elm$core$Basics$append('data:image/png;base64,'))));
var $author$project$ImportExport$getQRCodeUrl = function (message) {
	return $elm$core$Result$toMaybe(
		A2(
			$elm$core$Result$map,
			function (qrCode) {
				return $justgook$elm_image$Image$toPngUrl(
					$pablohirafuji$elm_qrcode$QRCode$toImage(qrCode));
			},
			$pablohirafuji$elm_qrcode$QRCode$fromString(message)));
};
var $author$project$ImportExport$encodeErgebnis = function (model) {
	var zusatzbedarfItems = _Utils_ap(model.kind.mehrbedarf, model.kind.sonderbedarf);
	var sonderbedarfSum = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (item) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$author$project$Utils$Format$formatInputToFloat(item.kosten));
			},
			model.kind.sonderbedarf));
	var qrCodeBase64 = $author$project$ImportExport$getQRCodeUrl(
		$author$project$ImportExport$encodeModeltoQRCode(model));
	var mehrbedarfSum = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (item) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$author$project$Utils$Format$formatInputToFloat(item.kosten));
			},
			model.kind.mehrbedarf));
	var zusatzbedarfSum = mehrbedarfSum + sonderbedarfSum;
	var kindergeldBetreuungsanteilAusgleich = $author$project$Constants$getKindergeld(model.jahr) / 4;
	var kindEinkuenfteSum = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (item) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$author$project$Utils$Format$formatInputToFloat(item.kosten));
			},
			model.kind.einkuenfte));
	var ergebnis = $author$project$Calculation$calculateAusgleichsanspruch(model);
	var regelbedarfValue = A2($elm$core$Maybe$withDefault, 0, ergebnis.regelbedarf);
	var zusatzbedarfVonMutterAnVater = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (item) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$author$project$Utils$Format$formatInputToFloat(item.kosten)) * ergebnis.haftungsanteilMutter;
			},
			A2(
				$elm$core$List$filter,
				function (item) {
					return _Utils_eq(
						item.bezahltVon,
						$elm$core$Maybe$Just($author$project$Types$Vater));
				},
				zusatzbedarfItems)));
	var zusatzbedarfVonVaterAnMutter = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (item) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$author$project$Utils$Format$formatInputToFloat(item.kosten)) * ergebnis.haftungsanteilVater;
			},
			A2(
				$elm$core$List$filter,
				function (item) {
					return _Utils_eq(
						item.bezahltVon,
						$elm$core$Maybe$Just($author$project$Types$Mutter));
				},
				zusatzbedarfItems)));
	var encodeElternteil = function (person) {
		var p = function () {
			if (person.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		var einkommen = $author$project$Elternteil$calculateEinkommen(p);
		var abzuege = $author$project$Elternteil$sumAbzugsposten(p.abzugsposten);
		var bereinigt = einkommen - abzuege;
		var verteilbarerBetrag = A3($author$project$Calculation$calculateVerteilbarerBetrag, bereinigt, person, model);
		var _v4 = function () {
			if (person.$ === 'Vater') {
				return _Utils_Tuple2(ergebnis.haftungsanteilVater * 100, ergebnis.baranteilVater);
			} else {
				return _Utils_Tuple2(ergebnis.haftungsanteilMutter * 100, ergebnis.baranteilMutter);
			}
		}();
		var haftungsanteil = _v4.a;
		var baranteil = _v4.b;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'haupttaetigkeit',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(
							A2(
								$elm$core$Maybe$withDefault,
								0,
								$author$project$Utils$Format$formatInputToFloat(p.haupttaetigkeit))))),
					_Utils_Tuple2(
					'weitereEinkuenfte',
					A2(
						$elm$json$Json$Encode$list,
						$author$project$ImportExport$encodeStringFieldType,
						A2(
							$elm$core$List$filter,
							function (item) {
								return !$elm$core$String$isEmpty(item.kosten);
							},
							p.weitereEinkuenfte))),
					_Utils_Tuple2(
					'weitereEinkuenfteGesamt',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(
							$author$project$Elternteil$calculateWeitereEinkuenfte(p.weitereEinkuenfte)))),
					_Utils_Tuple2(
					'einkommen',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(einkommen))),
					_Utils_Tuple2(
					'abzugsposten',
					A2(
						$elm$json$Json$Encode$list,
						$author$project$ImportExport$encodeStringFieldType,
						A2(
							$elm$core$List$filter,
							function (item) {
								return !$elm$core$String$isEmpty(item.kosten);
							},
							p.abzugsposten))),
					_Utils_Tuple2(
					'abzuegeGesamt',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(abzuege))),
					_Utils_Tuple2(
					'bereinigtesEinkommen',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(bereinigt))),
					_Utils_Tuple2(
					'selbstbehalt',
					$author$project$ImportExport$encodeSelbstbehalt(p.selbstbehalt)),
					_Utils_Tuple2(
					'haftungsanteil',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(haftungsanteil))),
					_Utils_Tuple2(
					'baranteil',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(baranteil))),
					_Utils_Tuple2(
					'betreuungsanteil',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(ergebnis.betreuungsanteil))),
					_Utils_Tuple2(
					'verteilbarerBetrag',
					$elm$json$Json$Encode$string(
						$author$project$Utils$Format$formatEuroRounded(verteilbarerBetrag)))
				]));
	};
	var differenzNachAnrechnung = $elm$core$Basics$abs(ergebnis.anteilVaterGesamtbedarf - ergebnis.anteilMutterGesamtbedarf);
	var bedarfOhneZusatzbedarf = A2($elm$core$Basics$max, 0, regelbedarfValue - kindEinkuenfteSum);
	var auszugleichenderBetragNachAnrechnung = differenzNachAnrechnung / 2;
	var anteilVaterOhneZusatzbedarf = ergebnis.haftungsanteilVater * bedarfOhneZusatzbedarf;
	var anteilMutterOhneZusatzbedarf = ergebnis.haftungsanteilMutter * bedarfOhneZusatzbedarf;
	var differenzOhneZusatzbedarf = $elm$core$Basics$abs(anteilVaterOhneZusatzbedarf - anteilMutterOhneZusatzbedarf);
	var auszugleichenderBetragOhneZusatzbedarf = differenzOhneZusatzbedarf / 2;
	var anspruchsberechtigtOhneZusatzbedarf = (_Utils_cmp(anteilVaterOhneZusatzbedarf, anteilMutterOhneZusatzbedarf) > 0) ? $author$project$Types$Mutter : $author$project$Types$Vater;
	var nichtAnspruchsberechtigtOhneZusatzbedarf = _Utils_eq(anspruchsberechtigtOhneZusatzbedarf, $author$project$Types$Vater) ? $author$project$Types$Mutter : $author$project$Types$Vater;
	var anspruchsberechtigtNachAnrechnung = (_Utils_cmp(ergebnis.anteilVaterGesamtbedarf, ergebnis.anteilMutterGesamtbedarf) > 0) ? $author$project$Types$Mutter : $author$project$Types$Vater;
	var ausgleichsanspruchNachAnrechnung = _Utils_eq(anspruchsberechtigtNachAnrechnung, $author$project$Types$Mutter) ? (_Utils_eq(model.kindergeldEmpfaenger, $author$project$Types$Vater) ? (auszugleichenderBetragNachAnrechnung + kindergeldBetreuungsanteilAusgleich) : (auszugleichenderBetragNachAnrechnung - kindergeldBetreuungsanteilAusgleich)) : (_Utils_eq(model.kindergeldEmpfaenger, $author$project$Types$Mutter) ? (auszugleichenderBetragNachAnrechnung + kindergeldBetreuungsanteilAusgleich) : (auszugleichenderBetragNachAnrechnung - kindergeldBetreuungsanteilAusgleich));
	var nichtAnspruchsberechtigtNachAnrechnung = _Utils_eq(anspruchsberechtigtNachAnrechnung, $author$project$Types$Vater) ? $author$project$Types$Mutter : $author$project$Types$Vater;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'jahr',
				$elm$json$Json$Encode$string(model.jahr)),
				_Utils_Tuple2(
				'monat',
				$elm$json$Json$Encode$string(model.monat)),
				_Utils_Tuple2(
				'vater',
				encodeElternteil($author$project$Types$Vater)),
				_Utils_Tuple2(
				'mutter',
				encodeElternteil($author$project$Types$Mutter)),
				_Utils_Tuple2(
				'gesamtEinkommen',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.gesamtEinkommen))),
				_Utils_Tuple2(
				'verteilbarerBetragGesamt',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.verteilbarerBetragGesamt))),
				_Utils_Tuple2(
				'kindsalter',
				$elm$json$Json$Encode$int(model.kind.alter)),
				_Utils_Tuple2(
				'regelbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(
						A2($elm$core$Maybe$withDefault, 0, ergebnis.regelbedarf)))),
				_Utils_Tuple2(
				'customRegelbedarf',
				$elm$json$Json$Encode$bool(model.customRegelbedarf)),
				_Utils_Tuple2(
				'kindeinkuenfte',
				A2(
					$elm$json$Json$Encode$list,
					$author$project$ImportExport$encodeStringFieldType,
					A2(
						$elm$core$List$filter,
						function (item) {
							return !$elm$core$String$isEmpty(item.kosten);
						},
						model.kind.einkuenfte))),
				_Utils_Tuple2(
				'einkuenfteGesamt',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(
						$elm$core$List$sum(
							A2(
								$elm$core$List$map,
								function (item) {
									return A2(
										$elm$core$Maybe$withDefault,
										0,
										$author$project$Utils$Format$formatInputToFloat(item.kosten));
								},
								model.kind.einkuenfte))))),
				_Utils_Tuple2(
				'mehrbedarf',
				A2(
					$elm$json$Json$Encode$list,
					$author$project$ImportExport$encodeZusatzbedarf,
					A2(
						$elm$core$List$filter,
						function (item) {
							return !$elm$core$String$isEmpty(item.kosten);
						},
						model.kind.mehrbedarf))),
				_Utils_Tuple2(
				'sonderbedarf',
				A2(
					$elm$json$Json$Encode$list,
					$author$project$ImportExport$encodeZusatzbedarf,
					A2(
						$elm$core$List$filter,
						function (item) {
							return !$elm$core$String$isEmpty(item.kosten);
						},
						model.kind.sonderbedarf))),
				_Utils_Tuple2(
				'erbrachteLeistungen',
				A2(
					$elm$json$Json$Encode$list,
					$author$project$ImportExport$encodeZusatzbedarf,
					A2(
						$elm$core$List$filter,
						function (item) {
							return !$elm$core$String$isEmpty(item.kosten);
						},
						model.kind.erbrachteLeistungen))),
				_Utils_Tuple2(
				'sonderbedarfSum',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(sonderbedarfSum))),
				_Utils_Tuple2(
				'mehrbedarfSum',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(mehrbedarfSum))),
				_Utils_Tuple2(
				'zusatzbedarfSum',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(zusatzbedarfSum))),
				_Utils_Tuple2(
				'gesamtbedarf_ohneGetrageneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.gesamtKindbedarf_ohneGetrageneZusatzbedarf))),
				_Utils_Tuple2(
				'gesamtbedarf_mitGetrageneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf))),
				_Utils_Tuple2(
				'kindergeld',
				$elm$json$Json$Encode$int(
					$author$project$Constants$getKindergeld(model.jahr))),
				_Utils_Tuple2(
				'kindergeldEmpfaenger',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$personToString(model.kindergeldEmpfaenger))),
				_Utils_Tuple2(
				'anspruchsberechtigt',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$personToString(ergebnis.anspruchsberechtigt))),
				_Utils_Tuple2(
				'nichtanspruchsberechtigt',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$personToString(ergebnis.nichtanspruchsberechtigt))),
				_Utils_Tuple2(
				'haftungsbetragVater',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsbetragVater))),
				_Utils_Tuple2(
				'haftungsbetragMutter',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsbetragMutter))),
				_Utils_Tuple2(
				'haftungsbetragVaterVorBegrenzung',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsbetragVaterVorBegrenzung))),
				_Utils_Tuple2(
				'haftungsbetragMutterVorBegrenzung',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsbetragMutterVorBegrenzung))),
				_Utils_Tuple2(
				'anteilVaterGesamtbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.anteilVaterGesamtbedarf))),
				_Utils_Tuple2(
				'anteilMutterGesamtbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.anteilMutterGesamtbedarf))),
				_Utils_Tuple2(
				'haftungsbetragVaterSpiegel',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(
						A2($elm$core$Maybe$withDefault, 0, model.haftungsbetragVaterSpiegel)))),
				_Utils_Tuple2(
				'haftungsbetragMutterSpiegel',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(
						A2($elm$core$Maybe$withDefault, 0, model.haftungsbetragMutterSpiegel)))),
				_Utils_Tuple2(
				'differenzAnteil',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.differenzAnteil))),
				_Utils_Tuple2(
				'bedarfOhneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(bedarfOhneZusatzbedarf))),
				_Utils_Tuple2(
				'anteilVaterOhneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(anteilVaterOhneZusatzbedarf))),
				_Utils_Tuple2(
				'anteilMutterOhneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(anteilMutterOhneZusatzbedarf))),
				_Utils_Tuple2(
				'differenzOhneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(differenzOhneZusatzbedarf))),
				_Utils_Tuple2(
				'auszugleichenderBetragOhneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(auszugleichenderBetragOhneZusatzbedarf))),
				_Utils_Tuple2(
				'anspruchsberechtigtOhneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$personToString(anspruchsberechtigtOhneZusatzbedarf))),
				_Utils_Tuple2(
				'nichtAnspruchsberechtigtOhneZusatzbedarf',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$personToString(nichtAnspruchsberechtigtOhneZusatzbedarf))),
				_Utils_Tuple2(
				'zusatzbedarfVonVaterAnMutter',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(zusatzbedarfVonVaterAnMutter))),
				_Utils_Tuple2(
				'zusatzbedarfVonMutterAnVater',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(zusatzbedarfVonMutterAnVater))),
				_Utils_Tuple2(
				'differenzNachAnrechnung',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(differenzNachAnrechnung))),
				_Utils_Tuple2(
				'auszugleichenderBetragNachAnrechnung',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(auszugleichenderBetragNachAnrechnung))),
				_Utils_Tuple2(
				'anspruchsberechtigtNachAnrechnung',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$personToString(anspruchsberechtigtNachAnrechnung))),
				_Utils_Tuple2(
				'nichtAnspruchsberechtigtNachAnrechnung',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$personToString(nichtAnspruchsberechtigtNachAnrechnung))),
				_Utils_Tuple2(
				'haftungsbetragVaterInput',
				$elm$json$Json$Encode$string(model.haftungsbetragVaterInput)),
				_Utils_Tuple2(
				'haftungsbetragMutterInput',
				$elm$json$Json$Encode$string(model.haftungsbetragMutterInput)),
				_Utils_Tuple2(
				'hftInput',
				$elm$json$Json$Encode$string(
					function () {
						var _v0 = model.haftungsbetragQuelle;
						if (_v0.$ === 'Just') {
							if (_v0.a.$ === 'Vorschlag') {
								var _v1 = _v0.a;
								return 'Vorschlag';
							} else {
								var _v2 = _v0.a;
								return 'Individuell';
							}
						} else {
							return '';
						}
					}())),
				_Utils_Tuple2(
				'kindergeldBetreuungsanteilAusgleich',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(kindergeldBetreuungsanteilAusgleich))),
				_Utils_Tuple2(
				'ausgleichsanspruchNachAnrechnung',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ausgleichsanspruchNachAnrechnung))),
				_Utils_Tuple2(
				'abzufuehrendesKindergeld',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.abzufuehrendesKindergeld))),
				_Utils_Tuple2(
				'abzVon',
				$elm$json$Json$Encode$string(
					$author$project$Elternteil$getDativElternTitle(ergebnis.anspruchsberechtigt))),
				_Utils_Tuple2(
				'abzAn',
				$elm$json$Json$Encode$string(
					$author$project$Elternteil$getAkusativElternTitle(ergebnis.nichtanspruchsberechtigt))),
				_Utils_Tuple2(
				'auszugleichenderBetrag',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(ergebnis.auszugleichenderBetrag))),
				_Utils_Tuple2(
				'haelftigesKindergeld',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(
						$author$project$Constants$getKindergeld(model.jahr) / 2))),
				_Utils_Tuple2(
				'ausgleichsanspruch',
				$elm$json$Json$Encode$string(
					$author$project$Utils$Format$formatEuroRounded(
						A2($elm$core$Maybe$withDefault, 0, ergebnis.ausgleichsanspruch)))),
				_Utils_Tuple2(
				'qrCodeBase64',
				function () {
					if (qrCodeBase64.$ === 'Just') {
						var base64 = qrCodeBase64.a;
						return $elm$json$Json$Encode$string(base64);
					} else {
						return $elm$json$Json$Encode$null;
					}
				}()),
				_Utils_Tuple2(
				'freitext',
				$elm$json$Json$Encode$string(model.freitext))
			]));
};
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $author$project$Main$generatePdf = _Platform_outgoingPort('generatePdf', $elm$core$Basics$identity);
var $author$project$Utils$Validation$calculateAge = F3(
	function (calculationMonth, calculationYear, birthday) {
		var baseAge = calculationYear - birthday.year;
		return (_Utils_cmp(birthday.month, calculationMonth) > 0) ? (baseAge - 1) : baseAge;
	});
var $author$project$Utils$Validation$monthToInt = function (month) {
	var _v0 = $elm$core$String$trim(month);
	switch (_v0) {
		case '1':
			return $elm$core$Maybe$Just(1);
		case '01':
			return $elm$core$Maybe$Just(1);
		case 'Januar':
			return $elm$core$Maybe$Just(1);
		case '2':
			return $elm$core$Maybe$Just(2);
		case '02':
			return $elm$core$Maybe$Just(2);
		case 'Februar':
			return $elm$core$Maybe$Just(2);
		case '3':
			return $elm$core$Maybe$Just(3);
		case '03':
			return $elm$core$Maybe$Just(3);
		case 'März':
			return $elm$core$Maybe$Just(3);
		case 'Maerz':
			return $elm$core$Maybe$Just(3);
		case '4':
			return $elm$core$Maybe$Just(4);
		case '04':
			return $elm$core$Maybe$Just(4);
		case 'April':
			return $elm$core$Maybe$Just(4);
		case '5':
			return $elm$core$Maybe$Just(5);
		case '05':
			return $elm$core$Maybe$Just(5);
		case 'Mai':
			return $elm$core$Maybe$Just(5);
		case '6':
			return $elm$core$Maybe$Just(6);
		case '06':
			return $elm$core$Maybe$Just(6);
		case 'Juni':
			return $elm$core$Maybe$Just(6);
		case '7':
			return $elm$core$Maybe$Just(7);
		case '07':
			return $elm$core$Maybe$Just(7);
		case 'Juli':
			return $elm$core$Maybe$Just(7);
		case '8':
			return $elm$core$Maybe$Just(8);
		case '08':
			return $elm$core$Maybe$Just(8);
		case 'August':
			return $elm$core$Maybe$Just(8);
		case '9':
			return $elm$core$Maybe$Just(9);
		case '09':
			return $elm$core$Maybe$Just(9);
		case 'September':
			return $elm$core$Maybe$Just(9);
		case '10':
			return $elm$core$Maybe$Just(10);
		case 'Oktober':
			return $elm$core$Maybe$Just(10);
		case '11':
			return $elm$core$Maybe$Just(11);
		case 'November':
			return $elm$core$Maybe$Just(11);
		case '12':
			return $elm$core$Maybe$Just(12);
		case 'Dezember':
			return $elm$core$Maybe$Just(12);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Utils$Validation$inputAgeOrBirthdayToAge = F3(
	function (calculationMonth, calculationYear, value) {
		var trimmedValue = $elm$core$String$trim(value);
		var _v0 = $elm$core$String$toInt(trimmedValue);
		if (_v0.$ === 'Just') {
			var age = _v0.a;
			return $author$project$Utils$Validation$isValidAge(age) ? $elm$core$Maybe$Just(age) : $elm$core$Maybe$Nothing;
		} else {
			return A2(
				$elm$core$Maybe$andThen,
				function (age) {
					return $author$project$Utils$Validation$isValidAge(age) ? $elm$core$Maybe$Just(age) : $elm$core$Maybe$Nothing;
				},
				A4(
					$elm$core$Maybe$map3,
					$author$project$Utils$Validation$calculateAge,
					$author$project$Utils$Validation$monthToInt(calculationMonth),
					$elm$core$String$toInt(calculationYear),
					$author$project$Utils$Validation$parseBirthday(trimmedValue)));
		}
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$openPdfBlob = _Platform_outgoingPort('openPdfBlob', $elm$json$Json$Encode$string);
var $author$project$Main$recalculateKindAlter = F3(
	function (monat, jahr, kind) {
		return _Utils_update(
			kind,
			{
				alter: A2(
					$elm$core$Maybe$withDefault,
					kind.alter,
					A3($author$project$Utils$Validation$inputAgeOrBirthdayToAge, monat, jahr, kind.alterInput))
			});
	});
var $author$project$Kind$removeAt = F2(
	function (index, list) {
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$second,
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var i = _v0.a;
					return !_Utils_eq(i, index);
				},
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, list)));
	});
var $author$project$Kind$removeBedarf = F3(
	function (bedarfsTyp, index, model) {
		var modelPerson = model.kind;
		var currentList = function () {
			switch (bedarfsTyp.$) {
				case 'Mehrbedarf':
					return model.kind.mehrbedarf;
				case 'Sonderbedarf':
					return model.kind.sonderbedarf;
				default:
					return model.kind.erbrachteLeistungen;
			}
		}();
		var newList = A2($author$project$Kind$removeAt, index, currentList);
		var updatedData = function () {
			switch (bedarfsTyp.$) {
				case 'Mehrbedarf':
					return _Utils_update(
						modelPerson,
						{mehrbedarf: newList});
				case 'Sonderbedarf':
					return _Utils_update(
						modelPerson,
						{sonderbedarf: newList});
				default:
					return _Utils_update(
						modelPerson,
						{erbrachteLeistungen: newList});
			}
		}();
		return _Utils_update(
			model,
			{error: $elm$core$Maybe$Nothing, kind: updatedData});
	});
var $author$project$Elternteil$removeAt = F2(
	function (index, list) {
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$second,
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var i = _v0.a;
					return !_Utils_eq(i, index);
				},
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, list)));
	});
var $author$project$Elternteil$removePosten = F4(
	function (person, postenType, index, model) {
		var modelPerson = function () {
			if (person.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		var postenListe = function () {
			switch (postenType.$) {
				case 'Abzugsposten':
					return modelPerson.abzugsposten;
				case 'WeitereEinkuenfte':
					return modelPerson.weitereEinkuenfte;
				default:
					return modelPerson.einkommenZumDurchschnittsberechnung;
			}
		}();
		var newList = A2($author$project$Elternteil$removeAt, index, postenListe);
		var updatedData = function () {
			switch (postenType.$) {
				case 'Abzugsposten':
					return _Utils_update(
						modelPerson,
						{abzugsposten: newList});
				case 'WeitereEinkuenfte':
					return _Utils_update(
						modelPerson,
						{weitereEinkuenfte: newList});
				default:
					return _Utils_update(
						modelPerson,
						{einkommenZumDurchschnittsberechnung: newList});
			}
		}();
		if (person.$ === 'Vater') {
			return _Utils_update(
				model,
				{error: $elm$core$Maybe$Nothing, vater: updatedData});
		} else {
			return _Utils_update(
				model,
				{error: $elm$core$Maybe$Nothing, mutter: updatedData});
		}
	});
var $author$project$Main$resetHaftungswerte = function (model) {
	return _Utils_update(
		model,
		{haftungsbetragMutterInput: '', haftungsbetragMutterSpiegel: $elm$core$Maybe$Nothing, haftungsbetragMutterUebernommen: $elm$core$Maybe$Nothing, haftungsbetragQuelle: $elm$core$Maybe$Nothing, haftungsbetragVaterInput: '', haftungsbetragVaterSpiegel: $elm$core$Maybe$Nothing, haftungsbetragVaterUebernommen: $elm$core$Maybe$Nothing, vorschlagHft: false});
};
var $author$project$Main$sendImageForQRDecode = _Platform_outgoingPort('sendImageForQRDecode', $elm$json$Json$Encode$string);
var $author$project$Main$startCameraScanner = _Platform_outgoingPort(
	'startCameraScanner',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$stopCameraScanner = _Platform_outgoingPort(
	'stopCameraScanner',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Utils$Format$stringToPerson = function (str) {
	switch (str) {
		case 'Vater':
			return $author$project$Types$Vater;
		case 'Mutter':
			return $author$project$Types$Mutter;
		default:
			return $author$project$Types$Vater;
	}
};
var $elm$core$Debug$toString = _Debug_toString;
var $elm$file$File$toString = _File_toString;
var $elm$file$File$toUrl = _File_toUrl;
var $author$project$Elternteil$toggleSelbstbehaltOption = function (person) {
	return _Utils_update(
		person,
		{showSelbstbehaltOptions: !person.showSelbstbehaltOptions});
};
var $author$project$Kind$updateBedarf = F4(
	function (bedarfsTyp, index, field, model) {
		var modelPerson = model.kind;
		var currentList = function () {
			switch (bedarfsTyp.$) {
				case 'Mehrbedarf':
					return model.kind.mehrbedarf;
				case 'Sonderbedarf':
					return model.kind.sonderbedarf;
				default:
					return model.kind.erbrachteLeistungen;
			}
		}();
		var updatedPosten = A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, index) ? _Utils_update(
						item,
						{bezahltVon: field.bezahltVon, bezeichnung: field.bezeichnung, kosten: field.kosten}) : item;
				}),
			currentList);
		var updatedData = function () {
			switch (bedarfsTyp.$) {
				case 'Mehrbedarf':
					return _Utils_update(
						modelPerson,
						{mehrbedarf: updatedPosten});
				case 'Sonderbedarf':
					return _Utils_update(
						modelPerson,
						{sonderbedarf: updatedPosten});
				default:
					return _Utils_update(
						modelPerson,
						{erbrachteLeistungen: updatedPosten});
			}
		}();
		return _Utils_update(
			model,
			{kind: updatedData});
	});
var $author$project$Main$updateElternDaten = F5(
	function (model, haupttaetigkeit, weitereEinkuenfte, abzugsposten, selbstbehalt) {
		return _Utils_update(
			model,
			{abzugsposten: abzugsposten, haupttaetigkeit: haupttaetigkeit, selbstbehalt: selbstbehalt, weitereEinkuenfte: weitereEinkuenfte});
	});
var $author$project$Main$updateKindDaten = F6(
	function (alter, alterInput, mehrbedarf, sonderbedarf, regelbedarf, kind) {
		return _Utils_update(
			kind,
			{alter: alter, alterInput: alterInput, mehrbedarf: mehrbedarf, regelbedarf: regelbedarf, sonderbedarf: sonderbedarf});
	});
var $author$project$Elternteil$updatePosten = F5(
	function (person, personType, index, field, model) {
		var modelPerson = function () {
			if (person.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		var postenListe = function () {
			switch (personType.$) {
				case 'Abzugsposten':
					return modelPerson.abzugsposten;
				case 'WeitereEinkuenfte':
					return modelPerson.weitereEinkuenfte;
				default:
					return modelPerson.einkommenZumDurchschnittsberechnung;
			}
		}();
		var updatedPosten = A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, item) {
					return _Utils_eq(i, index) ? _Utils_update(
						item,
						{bezeichnung: field.bezeichnung, kosten: field.kosten}) : item;
				}),
			postenListe);
		var updatedData = function () {
			switch (personType.$) {
				case 'Abzugsposten':
					return _Utils_update(
						modelPerson,
						{abzugsposten: updatedPosten});
				case 'WeitereEinkuenfte':
					return _Utils_update(
						modelPerson,
						{weitereEinkuenfte: updatedPosten});
				default:
					return _Utils_update(
						modelPerson,
						{einkommenZumDurchschnittsberechnung: updatedPosten});
			}
		}();
		if (person.$ === 'Vater') {
			return _Utils_update(
				model,
				{vater: updatedData});
		} else {
			return _Utils_update(
				model,
				{mutter: updatedData});
		}
	});
var $author$project$Constants$selbstbehalte = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'2023',
			$elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2('Notwendig (nicht erwerbstätig)', '1120'),
						_Utils_Tuple2('Notwendig', '1370'),
						_Utils_Tuple2('Angemessen', '1650')
					]))),
			_Utils_Tuple2(
			'2024',
			$elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2('Notwendig (nicht erwerbstätig)', '1200'),
						_Utils_Tuple2('Notwendig', '1450'),
						_Utils_Tuple2('Angemessen', '1750')
					]))),
			_Utils_Tuple2(
			'2025',
			$elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2('Notwendig (nicht erwerbstätig)', '1200'),
						_Utils_Tuple2('Notwendig', '1450'),
						_Utils_Tuple2('Angemessen', '1750')
					]))),
			_Utils_Tuple2(
			'2026',
			$elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2('Notwendig (nicht erwerbstätig)', '1200'),
						_Utils_Tuple2('Notwendig', '1450'),
						_Utils_Tuple2('Angemessen', '1750')
					])))
		]));
var $author$project$Constants$getSelbstbehalt = F2(
	function (jahr, typ) {
		var _v0 = A2($elm$core$Dict$get, jahr, $author$project$Constants$selbstbehalte);
		if (_v0.$ === 'Just') {
			var typDict = _v0.a;
			var _v1 = A2($elm$core$Dict$get, typ, typDict);
			if (_v1.$ === 'Just') {
				var betrag = _v1.a;
				return betrag;
			} else {
				return '0';
			}
		} else {
			return '0';
		}
	});
var $author$project$Elternteil$updateSelbstbehalt = F2(
	function (selb, jahr) {
		switch (selb.$) {
			case 'Benutzerdefiniert':
				var val = selb.a;
				return $author$project$Types$Benutzerdefiniert(val);
			case 'Angemessen':
				return $author$project$Types$Angemessen(
					A2($author$project$Constants$getSelbstbehalt, jahr, 'Angemessen'));
			case 'NotwendigErwerbstaetig':
				return $author$project$Types$NotwendigErwerbstaetig(
					A2($author$project$Constants$getSelbstbehalt, jahr, 'Notwendig'));
			default:
				return $author$project$Types$NotwendigNichtErwerbstaetig(
					A2($author$project$Constants$getSelbstbehalt, jahr, 'Notwendig (nicht erwerbstätig)'));
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'UpdateHaftungsbetragInput':
				var person = msg.a;
				var inputValue = msg.b;
				if (person.$ === 'Vater') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{haftungsbetragVaterInput: inputValue}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{haftungsbetragMutterInput: inputValue}),
						$elm$core$Platform$Cmd$none);
				}
			case 'ApplyHaftungsbetraege':
				var vater = msg.a;
				var mutter = msg.b;
				var quelle = msg.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							haftungsbetragMutterUebernommen: $elm$core$Maybe$Just(mutter),
							haftungsbetragQuelle: $elm$core$Maybe$Just(quelle),
							haftungsbetragVaterUebernommen: $elm$core$Maybe$Just(vater)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Update':
				var a = msg.a;
				switch (a.$) {
					case 'UpdateMonat':
						var val = a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									kind: A3($author$project$Main$recalculateKindAlter, val, model.jahr, model.kind),
									monat: val,
									showErgebnis: false
								}),
							$elm$core$Platform$Cmd$none);
					case 'UpdateJahr':
						var val = a.a;
						var updatedSelbstbehaltVater = A2($author$project$Elternteil$updateSelbstbehalt, model.vater.selbstbehalt, val);
						var updatedVater = A5($author$project$Main$updateElternDaten, model.vater, model.vater.haupttaetigkeit, model.vater.weitereEinkuenfte, model.vater.abzugsposten, updatedSelbstbehaltVater);
						var updatedSelbstbehaltMutter = A2($author$project$Elternteil$updateSelbstbehalt, model.mutter.selbstbehalt, val);
						var updatedMutter = A5($author$project$Main$updateElternDaten, model.mutter, model.mutter.haupttaetigkeit, model.mutter.weitereEinkuenfte, model.mutter.abzugsposten, updatedSelbstbehaltMutter);
						var showTabelle = false;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									jahr: val,
									kind: A3($author$project$Main$recalculateKindAlter, model.monat, val, model.kind),
									mutter: updatedMutter,
									showErgebnis: showTabelle,
									vater: updatedVater
								}),
							$elm$core$Platform$Cmd$none);
					case 'UpdateFreitext':
						var val = a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{freitext: val, showErgebnis: false}),
							$elm$core$Platform$Cmd$none);
					case 'UpdateKindergeldEmpfaenger':
						var person = a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{kindergeldEmpfaenger: person, showErgebnis: false}),
							$elm$core$Platform$Cmd$none);
					default:
						var val = a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{jahr: val.year, monat: val.month}),
							$elm$core$Platform$Cmd$none);
				}
			case 'UpdateKindDaten':
				var a = msg.a;
				var modelKind = model.kind;
				switch (a.$) {
					case 'UpdateAlter':
						var alterInput = a.a;
						var alter = A2(
							$elm$core$Maybe$withDefault,
							model.kind.alter,
							A3($author$project$Utils$Validation$inputAgeOrBirthdayToAge, model.monat, model.jahr, alterInput));
						var updatedKind = A6($author$project$Main$updateKindDaten, alter, alterInput, model.kind.mehrbedarf, model.kind.sonderbedarf, model.kind.regelbedarf, model.kind);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{kind: updatedKind, showErgebnis: false}),
							$elm$core$Platform$Cmd$none);
					case 'AddEinkuenfte':
						if ($elm$core$List$length(model.kind.einkuenfte) < 5) {
							var newList = _List_fromArray(
								[
									{bezeichnung: '', kosten: ''}
								]);
							var updatedKind = _Utils_update(
								modelKind,
								{
									einkuenfte: _Utils_ap(model.kind.einkuenfte, newList)
								});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{error: $elm$core$Maybe$Nothing, kind: updatedKind, showErgebnis: false}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just('Zu viele Posten (Max. 5)'),
										showErgebnis: false
									}),
								$elm$core$Platform$Cmd$none);
						}
					case 'RemoveEinkuenfte':
						var index = a.a;
						var newList = A2($author$project$Kind$removeAt, index, model.kind.einkuenfte);
						var updatedKind = _Utils_update(
							modelKind,
							{einkuenfte: newList});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{error: $elm$core$Maybe$Nothing, kind: updatedKind, showErgebnis: false}),
							$elm$core$Platform$Cmd$none);
					case 'UpdateEinkuenfte':
						var index = a.a;
						var field = a.b;
						var updatedEinkuenfte = A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, item) {
									return _Utils_eq(i, index) ? _Utils_update(
										item,
										{bezeichnung: field.bezeichnung, kosten: field.kosten}) : item;
								}),
							model.kind.einkuenfte);
						var updatedKind = _Utils_update(
							modelKind,
							{einkuenfte: updatedEinkuenfte});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{kind: updatedKind, showErgebnis: false}),
							$elm$core$Platform$Cmd$none);
					case 'ChangeBedarf':
						var action = a.a;
						switch (action.$) {
							case 'AddBedarf':
								var typ = action.a;
								return _Utils_Tuple2(
									A2($author$project$Kind$addBedarf, typ, model),
									$elm$core$Platform$Cmd$none);
							case 'RemoveBedarf':
								var typ = action.a;
								var index = action.b;
								return _Utils_Tuple2(
									A3($author$project$Kind$removeBedarf, typ, index, model),
									$elm$core$Platform$Cmd$none);
							default:
								var typ = action.a;
								var index = action.b;
								var field = action.c;
								return _Utils_Tuple2(
									A4($author$project$Kind$updateBedarf, typ, index, field, model),
									$elm$core$Platform$Cmd$none);
						}
					default:
						var val = a.a;
						var updatedKind = A6($author$project$Main$updateKindDaten, model.kind.alter, model.kind.alterInput, model.kind.mehrbedarf, model.kind.sonderbedarf, val, model.kind);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{kind: updatedKind, showErgebnis: false}),
							$elm$core$Platform$Cmd$none);
				}
			case 'UpdateElternDaten':
				var person = msg.a;
				var aktion = msg.b;
				var _v5 = _Utils_Tuple2(person, aktion);
				if (_v5.a.$ === 'Vater') {
					switch (_v5.b.$) {
						case 'UpdateHaupttaetigkeit':
							var _v6 = _v5.a;
							var haupttaetigkeit = _v5.b.a;
							var updatedVater = A5($author$project$Main$updateElternDaten, model.vater, haupttaetigkeit, model.vater.weitereEinkuenfte, model.vater.abzugsposten, model.vater.selbstbehalt);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{showErgebnis: false, vater: updatedVater}),
								$elm$core$Platform$Cmd$none);
						case 'UpdateSelbstbehalt':
							var _v8 = _v5.a;
							var selb = _v5.b.a;
							var updatedVater = A5(
								$author$project$Main$updateElternDaten,
								model.vater,
								model.vater.haupttaetigkeit,
								model.vater.weitereEinkuenfte,
								model.vater.abzugsposten,
								A2($author$project$Elternteil$updateSelbstbehalt, selb, model.jahr));
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{showErgebnis: false, vater: updatedVater}),
								$elm$core$Platform$Cmd$none);
						case 'ApplyDurchschnittseinkommen':
							var _v10 = _v5.a;
							var _v11 = _v5.b;
							var _v12 = $author$project$Main$calculateDurchschnittseinkommen(model.vater.einkommenZumDurchschnittsberechnung);
							if (_v12.$ === 'Just') {
								var durchschnitt = _v12.a;
								var updatedVater = A5(
									$author$project$Main$updateElternDaten,
									model.vater,
									$author$project$Utils$Format$formatEuroRounded(durchschnitt),
									model.vater.weitereEinkuenfte,
									model.vater.abzugsposten,
									model.vater.selbstbehalt);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{showErgebnis: false, vater: updatedVater}),
									$elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						default:
							var _v16 = _v5.a;
							var a = _v5.b.a;
							switch (a.$) {
								case 'AddPosten':
									var postenType = a.a;
									return _Utils_Tuple2(
										A3($author$project$Elternteil$addPosten, $author$project$Types$Vater, postenType, model),
										$elm$core$Platform$Cmd$none);
								case 'RemovePosten':
									var postenType = a.a;
									var index = a.b;
									return _Utils_Tuple2(
										A4($author$project$Elternteil$removePosten, $author$project$Types$Vater, postenType, index, model),
										$elm$core$Platform$Cmd$none);
								default:
									var postenType = a.a;
									var index = a.b;
									var field = a.c;
									return _Utils_Tuple2(
										A5($author$project$Elternteil$updatePosten, $author$project$Types$Vater, postenType, index, field, model),
										$elm$core$Platform$Cmd$none);
							}
					}
				} else {
					switch (_v5.b.$) {
						case 'UpdateHaupttaetigkeit':
							var _v7 = _v5.a;
							var haupttaetigkeit = _v5.b.a;
							var updatedMutter = A5($author$project$Main$updateElternDaten, model.mutter, haupttaetigkeit, model.mutter.weitereEinkuenfte, model.mutter.abzugsposten, model.mutter.selbstbehalt);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mutter: updatedMutter, showErgebnis: false}),
								$elm$core$Platform$Cmd$none);
						case 'UpdateSelbstbehalt':
							var _v9 = _v5.a;
							var selb = _v5.b.a;
							var updatedMutter = A5(
								$author$project$Main$updateElternDaten,
								model.mutter,
								model.mutter.haupttaetigkeit,
								model.mutter.weitereEinkuenfte,
								model.mutter.abzugsposten,
								A2($author$project$Elternteil$updateSelbstbehalt, selb, model.jahr));
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mutter: updatedMutter, showErgebnis: false}),
								$elm$core$Platform$Cmd$none);
						case 'ApplyDurchschnittseinkommen':
							var _v13 = _v5.a;
							var _v14 = _v5.b;
							var _v15 = $author$project$Main$calculateDurchschnittseinkommen(model.mutter.einkommenZumDurchschnittsberechnung);
							if (_v15.$ === 'Just') {
								var durchschnitt = _v15.a;
								var updatedMutter = A5(
									$author$project$Main$updateElternDaten,
									model.mutter,
									$author$project$Utils$Format$formatEuroRounded(durchschnitt),
									model.mutter.weitereEinkuenfte,
									model.mutter.abzugsposten,
									model.mutter.selbstbehalt);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{mutter: updatedMutter, showErgebnis: false}),
									$elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						default:
							var _v18 = _v5.a;
							var a = _v5.b.a;
							switch (a.$) {
								case 'AddPosten':
									var postenType = a.a;
									return _Utils_Tuple2(
										A3($author$project$Elternteil$addPosten, $author$project$Types$Mutter, postenType, model),
										$elm$core$Platform$Cmd$none);
								case 'UpdatePosten':
									var postenType = a.a;
									var index = a.b;
									var field = a.c;
									return _Utils_Tuple2(
										A5($author$project$Elternteil$updatePosten, $author$project$Types$Mutter, postenType, index, field, model),
										$elm$core$Platform$Cmd$none);
								default:
									var postenType = a.a;
									var index = a.b;
									return _Utils_Tuple2(
										A4($author$project$Elternteil$removePosten, $author$project$Types$Mutter, postenType, index, model),
										$elm$core$Platform$Cmd$none);
							}
					}
				}
			case 'ImportFile':
				var a = msg.a;
				switch (a.$) {
					case 'OpenFile':
						var fileType = a.a;
						if (fileType.$ === 'ImageFile') {
							return _Utils_Tuple2(
								model,
								A2(
									$elm$file$File$Select$file,
									_List_fromArray(
										['image/*']),
									A2(
										$elm$core$Basics$composeL,
										$author$project$Types$ImportFile,
										$author$project$Types$OnFileSelected($author$project$Types$ImageFile))));
						} else {
							return _Utils_Tuple2(
								model,
								A2(
									$elm$file$File$Select$file,
									_List_fromArray(
										['application/json']),
									A2(
										$elm$core$Basics$composeL,
										$author$project$Types$ImportFile,
										$author$project$Types$OnFileSelected($author$project$Types$JsonFile))));
						}
					case 'OnFileSelected':
						var fileType = a.a;
						var file = a.b;
						if (fileType.$ === 'ImageFile') {
							return _Utils_Tuple2(
								model,
								A2(
									$elm$core$Task$perform,
									A2($elm$core$Basics$composeL, $author$project$Types$ImportFile, $author$project$Types$OnFileRead),
									$elm$file$File$toUrl(file)));
						} else {
							return _Utils_Tuple2(
								model,
								A2(
									$elm$core$Task$perform,
									A2($elm$core$Basics$composeL, $author$project$Types$ImportFile, $author$project$Types$QRDecoded),
									$elm$file$File$toString(file)));
						}
					case 'OnFileRead':
						var imageDataUrl = a.a;
						return _Utils_Tuple2(
							model,
							$author$project$Main$sendImageForQRDecode(imageDataUrl));
					case 'QRDecoded':
						var result = a.a;
						var _v23 = A2($elm$json$Json$Decode$decodeString, $author$project$ImportExport$decodeQRCodeData, result);
						if (_v23.$ === 'Ok') {
							var decodedData = _v23.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										customRegelbedarf: decodedData.customRegelbedarf,
										error: $elm$core$Maybe$Nothing,
										freitext: decodedData.freitext,
										jahr: decodedData.jahr,
										kind: decodedData.kind,
										kindergeldEmpfaenger: $author$project$Utils$Format$stringToPerson(decodedData.kindergeldEmpfaenger),
										monat: decodedData.monat,
										mutter: decodedData.mutter,
										qrIsProcessing: false,
										qrResult: $elm$core$Maybe$Just(result),
										showCameraScanner: false,
										showErgebnis: false,
										vater: decodedData.vater
									}),
								$author$project$Main$stopCameraScanner(_Utils_Tuple0));
						} else {
							var err = _v23.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										error: $elm$core$Maybe$Just(
											'Error decoding QR code: ' + $elm$core$Debug$toString(err)),
										qrIsProcessing: false,
										qrResult: $elm$core$Maybe$Nothing
									}),
								$elm$core$Platform$Cmd$none);
						}
					default:
						var errorMsg = a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just(errorMsg),
									qrIsProcessing: false,
									qrResult: $elm$core$Maybe$Nothing,
									showCameraScanner: false
								}),
							$elm$core$Platform$Cmd$none);
				}
			case 'CameraScanner':
				var a = msg.a;
				switch (a.$) {
					case 'OpenCameraContainer':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{error: $elm$core$Maybe$Nothing, qrIsProcessing: true, showCameraScanner: true}),
							$author$project$Main$startCameraScanner(_Utils_Tuple0));
					case 'StartCameraScanner':
						return _Utils_Tuple2(
							model,
							$author$project$Main$startCameraScanner(_Utils_Tuple0));
					case 'StopCameraScanner':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{qrIsProcessing: false, showCameraScanner: false}),
							$author$project$Main$stopCameraScanner(_Utils_Tuple0));
					default:
						var isStarted = a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{qrIsProcessing: false, showCameraScanner: isStarted}),
							$elm$core$Platform$Cmd$none);
				}
			case 'ToggleView':
				var a = msg.a;
				switch (a.$) {
					case 'ViewErgebnis':
						var neuesBerechnungsModel = $author$project$Main$resetHaftungswerte(model);
						if (!$author$project$Utils$Validation$areInputsValid(neuesBerechnungsModel)) {
							return _Utils_Tuple2(
								_Utils_update(
									neuesBerechnungsModel,
									{
										error: $elm$core$Maybe$Just('Bitte geben Sie mindestens ein Einkommen ein oder korrigieren Sie rot markierte Felder.'),
										showErgebnis: false
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							if (neuesBerechnungsModel.customRegelbedarf) {
								var ergebnisVorAenderung = $author$project$Calculation$calculateAusgleichsanspruch(neuesBerechnungsModel);
								return _Utils_Tuple2(
									_Utils_update(
										neuesBerechnungsModel,
										{
											error: $elm$core$Maybe$Nothing,
											haftungsbetragMutterSpiegel: $elm$core$Maybe$Just(ergebnisVorAenderung.haftungsbetragMutter),
											haftungsbetragVaterSpiegel: $elm$core$Maybe$Just(ergebnisVorAenderung.haftungsbetragVater),
											showErgebnis: true
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								var regelbedarf = A3(
									$author$project$Constants$getRegelbedarf,
									neuesBerechnungsModel.jahr,
									$author$project$Elternteil$calculateGesamtEinkommen(neuesBerechnungsModel),
									neuesBerechnungsModel.kind.alter);
								if (regelbedarf.$ === 'Nothing') {
									return _Utils_Tuple2(
										_Utils_update(
											neuesBerechnungsModel,
											{
												error: $elm$core$Maybe$Just('Das Einkommen der Eltern übersteigt die Beträge für die Regelbedarfssätze aus der Düsseldorfer Tabelle. Bitte tragen Sie unter dem Reiter Kind einen individuellen Regelbedarf ein!'),
												showErgebnis: false
											}),
										$elm$core$Platform$Cmd$none);
								} else {
									var ergebnisVorAenderung = $author$project$Calculation$calculateAusgleichsanspruch(neuesBerechnungsModel);
									return _Utils_Tuple2(
										_Utils_update(
											neuesBerechnungsModel,
											{
												error: $elm$core$Maybe$Nothing,
												haftungsbetragMutterSpiegel: $elm$core$Maybe$Just(ergebnisVorAenderung.haftungsbetragMutter),
												haftungsbetragVaterSpiegel: $elm$core$Maybe$Just(ergebnisVorAenderung.haftungsbetragVater),
												showErgebnis: true
											}),
										$elm$core$Platform$Cmd$none);
								}
							}
						}
					case 'ToggleSelbstbehaltOptions':
						var person = a.a;
						if (person.$ === 'Vater') {
							var updatedVater = $author$project$Elternteil$toggleSelbstbehaltOption(model.vater);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{vater: updatedVater}),
								$elm$core$Platform$Cmd$none);
						} else {
							var updatedMutter = $author$project$Elternteil$toggleSelbstbehaltOption(model.mutter);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{mutter: updatedMutter}),
								$elm$core$Platform$Cmd$none);
						}
					case 'ToggleUeberUns':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showUeberUns: !model.showUeberUns}),
							$elm$core$Platform$Cmd$none);
					case 'ToggleSaveModal':
						return function (m) {
							return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
						}(
							_Utils_update(
								model,
								{modalExportOpen: !model.modalExportOpen}));
					case 'Select':
						var tab = a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{activeTab: tab}),
							$elm$core$Platform$Cmd$none);
					case 'ToggleCustomRegelbedarf':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{customRegelbedarf: !model.customRegelbedarf, showErgebnis: false}),
							$elm$core$Platform$Cmd$none);
					case 'ToggleDurchschnittseinkommen':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{durchschnittseinkommen: !model.durchschnittseinkommen}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{vorschlagHft: !model.vorschlagHft}),
							$elm$core$Platform$Cmd$none);
				}
			case 'Export':
				var a = msg.a;
				switch (a.$) {
					case 'ExportPdf':
						return _Utils_Tuple2(
							model,
							$author$project$Main$generatePdf(
								$author$project$ImportExport$encodeErgebnis(model)));
					case 'CopyJsonToClipboard':
						var jsonString = $author$project$ImportExport$encodeModeltoQRCode(model);
						return _Utils_Tuple2(
							model,
							$author$project$Main$copyToClipboard(jsonString));
					case 'DownloadJson':
						return _Utils_Tuple2(
							model,
							$author$project$Main$downloadFile(
								{
									content: $author$project$ImportExport$encodeModeltoQRCode(model),
									mimeType: 'application/json',
									name: 'Ausgleichsanspruch.json'
								}));
					default:
						var pngData = $author$project$ImportExport$getQRCodeUrl(
							$author$project$ImportExport$encodeModeltoQRCode(model));
						return _Utils_Tuple2(
							model,
							$author$project$Main$downloadFile(
								{
									content: A2($elm$core$Maybe$withDefault, '', pngData),
									mimeType: 'image/png',
									name: 'Ausgleichsanspruch.png'
								}));
				}
			default:
				return _Utils_Tuple2(
					model,
					$author$project$Main$openPdfBlob('Skript_ASGLA.pdf'));
		}
	});
var $author$project$Types$StopCameraScanner = {$: 'StopCameraScanner'};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$View$Components$cameraScanner = function (model) {
	return model.showCameraScanner ? A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal is-active')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-background'),
						$elm$html$Html$Events$onClick(
						$author$project$Types$CameraScanner($author$project$Types$StopCameraScanner))
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-content')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('box has-background-dark')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('has-text-centered mb-4')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('has-text-white')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('QR-Code im Rahmen positionieren – automatischer Scan ...')
											])),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('has-text-white')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Hinweis: Sollte der QR-Code Scan mit der Kamera nicht funktionieren, beachten Sie die Hilfestellung im Skript.')
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('qr-camera-reader'),
										$elm$html$Html$Attributes$class('has-background-black'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'max-width', '450px'),
										A2($elm$html$Html$Attributes$style, 'min-height', '260px'),
										A2($elm$html$Html$Attributes$style, 'margin', '0 auto')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('has-text-centered mt-4')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('has-text-warning has-text-weight-bold')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.qrIsProcessing ? 'Kamera wird gestartet...' : 'Kamera bereit')
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-close is-large'),
						A2($elm$html$Html$Attributes$attribute, 'aria-label', 'close'),
						$elm$html$Html$Events$onClick(
						$author$project$Types$CameraScanner($author$project$Types$StopCameraScanner))
					]),
				_List_Nil)
			])) : $elm$html$Html$text('');
};
var $author$project$Types$OpenCameraContainer = {$: 'OpenCameraContainer'};
var $author$project$Types$OpenFile = function (a) {
	return {$: 'OpenFile', a: a};
};
var $author$project$Types$OpenSkriptPdf = {$: 'OpenSkriptPdf'};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$View$Components$importFileSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mx-5')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('is-flex is-justify-content-space-between is-align-items-flex-start'),
						A2($elm$html$Html$Attributes$style, 'gap', '2rem'),
						A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '1.5rem')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('button is-text'),
								A2($elm$html$Html$Attributes$style, 'background-color', '#bbddc1'),
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Events$onClick($author$project$Types$OpenSkriptPdf)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Skript/Anleitung')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('buttons is-flex is-justify-content-flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('button is-primary tooltip-container'),
										$elm$html$Html$Events$onClick(
										$author$project$Types$ImportFile(
											$author$project$Types$OpenFile($author$project$Types$JsonFile)))
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('icon')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$i,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('fas fa-file-upload')
													]),
												_List_Nil)
											])),
										$elm$html$Html$text('Import JSON File'),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('tooltip-text')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Importiert Eingabedaten aus einer zuvor gespeicherten JSON-Datei (lokal, ohne Datenweitergabe).')
											]))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('button is-primary tooltip-container'),
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('is-loading', model.qrIsProcessing)
											])),
										$elm$html$Html$Events$onClick(
										$author$project$Types$ImportFile(
											$author$project$Types$OpenFile($author$project$Types$ImageFile))),
										$elm$html$Html$Attributes$disabled(model.qrIsProcessing)
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('icon')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$i,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('fas fa-qrcode')
													]),
												_List_Nil)
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('ml-2')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.qrIsProcessing ? 'Processing... ' : 'QR-Code importieren '),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('tooltip-text')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Importiert Eingabedaten aus einem zuvor gespeicherten QR-Code (lokal, ohne Datenweitergabe).')
													]))
											]))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('button is-primary tooltip-container'),
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('is-loading', model.qrIsProcessing)
											])),
										$elm$html$Html$Events$onClick(
										$author$project$Types$CameraScanner($author$project$Types$OpenCameraContainer)),
										$elm$html$Html$Attributes$disabled(model.qrIsProcessing)
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('icon')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$i,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('fas fa-camera')
													]),
												_List_Nil)
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('ml-2')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.qrIsProcessing ? 'Processing...' : 'QR-Code Scannen'),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('tooltip-text')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Öffnet die Kamera, um einen QR-Code mit Eingabedaten zu scannen (lokal, ohne Datenweitergabe).')
													]))
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('field')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$textarea,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('textarea'),
										$elm$html$Html$Attributes$placeholder('JSON-String hier einfügen'),
										$elm$html$Html$Attributes$rows(1),
										$elm$html$Html$Events$onInput(
										function (input) {
											return $author$project$Types$ImportFile(
												$author$project$Types$QRDecoded(input));
										})
									]),
								_List_Nil)
							]))
					])),
				function () {
				var _v0 = model.qrResult;
				if (_v0.$ === 'Just') {
					var result = _v0.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('notification is-success mt-4')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('content')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h4,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('title is-5')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Datenimport erfolgreich!')
											]))
									]))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				function () {
				var _v1 = model.error;
				if (_v1.$ === 'Just') {
					var errorMsg = _v1.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('notification is-danger mt-4')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('content')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h4,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('title is-5')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Error:')
											])),
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(errorMsg)
											]))
									]))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}()
			]));
};
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Types$Export = function (a) {
	return {$: 'Export', a: a};
};
var $author$project$Types$ExportPdf = {$: 'ExportPdf'};
var $elm$html$Html$br = _VirtualDom_node('br');
var $author$project$Constants$zahlungsdeckelTabelle2023 = {
	eintraege: _List_fromArray(
		[
			{
			altersgruppe: '0-5',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 1900, einkommenVon: 0, regelbedarf: 312},
					{einkommenBis: 2300, einkommenVon: 1901, regelbedarf: 334},
					{einkommenBis: 2700, einkommenVon: 2301, regelbedarf: 356},
					{einkommenBis: 3100, einkommenVon: 2701, regelbedarf: 378},
					{einkommenBis: 3500, einkommenVon: 3101, regelbedarf: 400},
					{einkommenBis: 3900, einkommenVon: 3501, regelbedarf: 435},
					{einkommenBis: 4300, einkommenVon: 3901, regelbedarf: 470},
					{einkommenBis: 4700, einkommenVon: 4301, regelbedarf: 505},
					{einkommenBis: 5100, einkommenVon: 4701, regelbedarf: 540},
					{einkommenBis: 5500, einkommenVon: 5101, regelbedarf: 575},
					{einkommenBis: 6200, einkommenVon: 5501, regelbedarf: 610},
					{einkommenBis: 7000, einkommenVon: 6201, regelbedarf: 645},
					{einkommenBis: 8000, einkommenVon: 7001, regelbedarf: 680},
					{einkommenBis: 9500, einkommenVon: 8001, regelbedarf: 715},
					{einkommenBis: 11000, einkommenVon: 9501, regelbedarf: 749}
				])
		},
			{
			altersgruppe: '6-11',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 1900, einkommenVon: 0, regelbedarf: 377},
					{einkommenBis: 2300, einkommenVon: 1901, regelbedarf: 403},
					{einkommenBis: 2700, einkommenVon: 2301, regelbedarf: 428},
					{einkommenBis: 3100, einkommenVon: 2701, regelbedarf: 453},
					{einkommenBis: 3500, einkommenVon: 3101, regelbedarf: 478},
					{einkommenBis: 3900, einkommenVon: 3501, regelbedarf: 518},
					{einkommenBis: 4300, einkommenVon: 3901, regelbedarf: 558},
					{einkommenBis: 4700, einkommenVon: 4301, regelbedarf: 598},
					{einkommenBis: 5100, einkommenVon: 4701, regelbedarf: 639},
					{einkommenBis: 5500, einkommenVon: 5101, regelbedarf: 679},
					{einkommenBis: 6200, einkommenVon: 5501, regelbedarf: 719},
					{einkommenBis: 7000, einkommenVon: 6201, regelbedarf: 759},
					{einkommenBis: 8000, einkommenVon: 7001, regelbedarf: 799},
					{einkommenBis: 9500, einkommenVon: 8001, regelbedarf: 839},
					{einkommenBis: 11000, einkommenVon: 9501, regelbedarf: 879}
				])
		},
			{
			altersgruppe: '12-17',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 1900, einkommenVon: 0, regelbedarf: 463},
					{einkommenBis: 2300, einkommenVon: 1901, regelbedarf: 493},
					{einkommenBis: 2700, einkommenVon: 2301, regelbedarf: 522},
					{einkommenBis: 3100, einkommenVon: 2701, regelbedarf: 552},
					{einkommenBis: 3500, einkommenVon: 3101, regelbedarf: 581},
					{einkommenBis: 3900, einkommenVon: 3501, regelbedarf: 628},
					{einkommenBis: 4300, einkommenVon: 3901, regelbedarf: 675},
					{einkommenBis: 4700, einkommenVon: 4301, regelbedarf: 722},
					{einkommenBis: 5100, einkommenVon: 4701, regelbedarf: 769},
					{einkommenBis: 5500, einkommenVon: 5101, regelbedarf: 816},
					{einkommenBis: 6200, einkommenVon: 5501, regelbedarf: 863},
					{einkommenBis: 7000, einkommenVon: 6201, regelbedarf: 910},
					{einkommenBis: 8000, einkommenVon: 7001, regelbedarf: 957},
					{einkommenBis: 9500, einkommenVon: 8001, regelbedarf: 1004},
					{einkommenBis: 11000, einkommenVon: 9501, regelbedarf: 1051}
				])
		},
			{
			altersgruppe: '18+',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 1900, einkommenVon: 0, regelbedarf: 378},
					{einkommenBis: 2300, einkommenVon: 1901, regelbedarf: 410},
					{einkommenBis: 2700, einkommenVon: 2301, regelbedarf: 441},
					{einkommenBis: 3100, einkommenVon: 2701, regelbedarf: 473},
					{einkommenBis: 3500, einkommenVon: 3101, regelbedarf: 504},
					{einkommenBis: 3900, einkommenVon: 3501, regelbedarf: 554},
					{einkommenBis: 4300, einkommenVon: 3901, regelbedarf: 605},
					{einkommenBis: 4700, einkommenVon: 4301, regelbedarf: 655},
					{einkommenBis: 5100, einkommenVon: 4701, regelbedarf: 705},
					{einkommenBis: 5500, einkommenVon: 5101, regelbedarf: 755},
					{einkommenBis: 6200, einkommenVon: 5501, regelbedarf: 806},
					{einkommenBis: 7000, einkommenVon: 6201, regelbedarf: 856},
					{einkommenBis: 8000, einkommenVon: 7001, regelbedarf: 906},
					{einkommenBis: 9500, einkommenVon: 8001, regelbedarf: 956},
					{einkommenBis: 11000, einkommenVon: 9501, regelbedarf: 1006}
				])
		}
		]),
	jahr: '2023'
};
var $author$project$Constants$zahlungsdeckelTabelle2024 = {
	eintraege: _List_fromArray(
		[
			{
			altersgruppe: '0-5',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 355},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 379},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 403},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 427},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 451},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 490},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 528},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 567},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 605},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 643},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 682},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 720},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 759},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 797},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 835}
				])
		},
			{
			altersgruppe: '6-11',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 426},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 454},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 482},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 509},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 537},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 581},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 625},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 669},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 713},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 757},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 801},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 845},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 889},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 933},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 977}
				])
		},
			{
			altersgruppe: '12-17',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 520},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 553},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 585},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 617},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 649},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 701},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 753},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 804},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 856},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 907},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 959},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1011},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1062},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1114},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1165}
				])
		},
			{
			altersgruppe: '18+',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 439},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 474},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 508},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 543},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 577},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 632},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 688},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 743},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 798},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 853},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 908},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 963},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1018},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1073},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1128}
				])
		}
		]),
	jahr: '2024'
};
var $author$project$Constants$zahlungsdeckelTabelle2025 = {
	eintraege: _List_fromArray(
		[
			{
			altersgruppe: '0-5',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 354.5},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 379.5},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 403.5},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 427.5},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 451.5},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 489.5},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 528.5},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 567.5},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 605.5},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 644.5},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 682.5},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 721.5},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 759.5},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 798.5},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 836.5}
				])
		},
			{
			altersgruppe: '6-11',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 426.5},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 454.5},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 482.5},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 510.5},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 537.5},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 582.5},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 626.5},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 670.5},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 715.5},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 759.5},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 803.5},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 848.5},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 892.5},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 936.5},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 980.5}
				])
		},
			{
			altersgruppe: '12-17',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 521.5},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 554.5},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 586.5},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 619.5},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 651.5},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 703.5},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 755.5},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 807.5},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 859.5},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 911.5},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 963.5},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1015.5},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1067.5},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1119.5},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1170.5}
				])
		},
			{
			altersgruppe: '18+',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 438},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 473},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 508},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 542},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 577},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 633},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 688},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 743},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 799},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 854},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 910},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 965},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1021},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1076},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1131}
				])
		}
		]),
	jahr: '2025'
};
var $author$project$Constants$zahlungsdeckelTabelle2026 = {
	eintraege: _List_fromArray(
		[
			{
			altersgruppe: '0-5',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 356.5},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 381.5},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 405.5},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 429.5},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 454.5},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 493.5},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 531.5},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 570.5},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 609.5},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 648.5},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 687.5},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 726.5},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 765.5},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 804.5},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 842.5}
				])
		},
			{
			altersgruppe: '6-11',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 428.5},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 456.5},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 484.5},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 512.5},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 540.5},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 585.5},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 629.5},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 674.5},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 719.5},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 763.5},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 808.5},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 853.5},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 897.5},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 942.5},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 986.5}
				])
		},
			{
			altersgruppe: '12-17',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 523.5},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 556.5},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 589.5},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 621.5},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 654.5},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 706.5},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 759.5},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 811.5},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 863.5},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 915.5},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 968.5},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 1020.5},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1072.5},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1124.5},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1176.5}
				])
		},
			{
			altersgruppe: '18+',
			einkommensgruppen: _List_fromArray(
				[
					{einkommenBis: 2100, einkommenVon: 0, regelbedarf: 439},
					{einkommenBis: 2500, einkommenVon: 2101, regelbedarf: 474},
					{einkommenBis: 2900, einkommenVon: 2501, regelbedarf: 509},
					{einkommenBis: 3300, einkommenVon: 2901, regelbedarf: 544},
					{einkommenBis: 3700, einkommenVon: 3301, regelbedarf: 579},
					{einkommenBis: 4100, einkommenVon: 3701, regelbedarf: 635},
					{einkommenBis: 4500, einkommenVon: 4101, regelbedarf: 691},
					{einkommenBis: 4900, einkommenVon: 4501, regelbedarf: 747},
					{einkommenBis: 5300, einkommenVon: 4901, regelbedarf: 802},
					{einkommenBis: 5700, einkommenVon: 5301, regelbedarf: 858},
					{einkommenBis: 6400, einkommenVon: 5701, regelbedarf: 914},
					{einkommenBis: 7200, einkommenVon: 6401, regelbedarf: 970},
					{einkommenBis: 8200, einkommenVon: 7201, regelbedarf: 1026},
					{einkommenBis: 9700, einkommenVon: 8201, regelbedarf: 1082},
					{einkommenBis: 11200, einkommenVon: 9701, regelbedarf: 1137}
				])
		}
		]),
	jahr: '2026'
};
var $author$project$Constants$getTabelleForYearHoechsbetrag = function (jahr) {
	switch (jahr) {
		case '2023':
			return $elm$core$Maybe$Just($author$project$Constants$zahlungsdeckelTabelle2023);
		case '2024':
			return $elm$core$Maybe$Just($author$project$Constants$zahlungsdeckelTabelle2024);
		case '2025':
			return $elm$core$Maybe$Just($author$project$Constants$zahlungsdeckelTabelle2025);
		case '2026':
			return $elm$core$Maybe$Just($author$project$Constants$zahlungsdeckelTabelle2026);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Constants$getHoechstbetrag = F3(
	function (jahr, income, alter) {
		return A2(
			$elm$core$Maybe$andThen,
			function (eintrag) {
				return $elm$core$List$head(
					A2(
						$elm$core$List$filterMap,
						$author$project$Constants$matchIncome(income),
						eintrag.einkommensgruppen));
			},
			A2(
				$elm$core$Maybe$andThen,
				function (tabelle) {
					return $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (e) {
								return _Utils_eq(
									e.altersgruppe,
									$author$project$Constants$getAltersgruppe(alter));
							},
							tabelle.eintraege));
				},
				$author$project$Constants$getTabelleForYearHoechsbetrag(jahr)));
	});
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$View$Components$viewBegrenzungHinweis = F4(
	function (elternteilGenitiv, urspruenglicherBetrag, begrenzterBetrag, verteilbarerBetrag) {
		return (_Utils_cmp(urspruenglicherBetrag, begrenzterBetrag) > 0) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('notification is-warning is-light mt-2')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					'Der ursprünglich berechnete Haftungsbetrag ' + (elternteilGenitiv + (' von ' + ($author$project$Utils$Format$formatEuroRounded(urspruenglicherBetrag) + (' € übersteigt den verteilbaren Betrag von ' + ($author$project$Utils$Format$formatEuroRounded(verteilbarerBetrag) + ' €. Der Haftungsbetrag wurde entsprechend begrenzt.'))))))
				])) : $elm$html$Html$text('');
	});
var $author$project$Types$ApplyHaftungsbetraege = F3(
	function (a, b, c) {
		return {$: 'ApplyHaftungsbetraege', a: a, b: b, c: c};
	});
var $author$project$Types$ToggleView = function (a) {
	return {$: 'ToggleView', a: a};
};
var $author$project$Types$ToggleVorschlagHft = {$: 'ToggleVorschlagHft'};
var $author$project$Types$Vorschlag = {$: 'Vorschlag'};
var $author$project$Types$Individuell = {$: 'Individuell'};
var $author$project$Types$UpdateHaftungsbetragInput = F2(
	function (a, b) {
		return {$: 'UpdateHaftungsbetragInput', a: a, b: b};
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$Components$viewVorschlagHaftungsanteil = F4(
	function (model, ergebnis, elterenteil, vorschlag) {
		var vorschlagVater = _Utils_eq(elterenteil, $author$project$Types$Vater) ? vorschlag : A2($elm$core$Maybe$withDefault, ergebnis.haftungsbetragVater, model.haftungsbetragVaterSpiegel);
		var vorschlagMutter = _Utils_eq(elterenteil, $author$project$Types$Mutter) ? vorschlag : A2($elm$core$Maybe$withDefault, ergebnis.haftungsbetragMutter, model.haftungsbetragMutterSpiegel);
		var vaterWert = A2(
			$elm$core$Maybe$withDefault,
			vorschlagVater,
			$author$project$Utils$Format$formatInputToFloat(model.haftungsbetragVaterInput));
		var mutterWert = A2(
			$elm$core$Maybe$withDefault,
			vorschlagMutter,
			$author$project$Utils$Format$formatInputToFloat(model.haftungsbetragMutterInput));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-4'),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '1rem'),
					A2($elm$html$Html$Attributes$style, 'background-color', '#f5f5f5'),
					A2($elm$html$Html$Attributes$style, 'padding', '1rem'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('field')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Vater (€)')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder(
									$author$project$Utils$Format$formatEuroRounded(vorschlagVater)),
									$elm$html$Html$Attributes$value(model.haftungsbetragVaterInput),
									$elm$html$Html$Events$onInput(
									$author$project$Types$UpdateHaftungsbetragInput($author$project$Types$Vater))
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('field')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Mutter (€)')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder(
									$author$project$Utils$Format$formatEuroRounded(vorschlagMutter)),
									$elm$html$Html$Attributes$value(model.haftungsbetragMutterInput),
									$elm$html$Html$Events$onInput(
									$author$project$Types$UpdateHaftungsbetragInput($author$project$Types$Mutter))
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('button is-primary'),
							$elm$html$Html$Attributes$type_('button'),
							$elm$html$Html$Events$onClick(
							A3($author$project$Types$ApplyHaftungsbetraege, vaterWert, mutterWert, $author$project$Types$Individuell))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Werte Übernehmen')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Bitte nutzen Sie diese Funktion nur, wenn Sie einem ausnahmsweisen Sonderfall haben.')
						]))
				]));
	});
var $author$project$View$Components$viewHHinweisAnteilEltern = F6(
	function (model, ergebnis, elterenteil, einkommen, anteilVater, anteilMutter) {
		var spiegelWert = _Utils_eq(elterenteil, $author$project$Types$Vater) ? A2($elm$core$Maybe$withDefault, 0, model.haftungsbetragVaterSpiegel) : A2($elm$core$Maybe$withDefault, 0, model.haftungsbetragMutterSpiegel);
		var hoechstbetrag = A3($author$project$Constants$getHoechstbetrag, model.jahr, einkommen, model.kind.alter);
		var mutterWert = _Utils_eq(elterenteil, $author$project$Types$Mutter) ? A2($elm$core$Maybe$withDefault, 0, hoechstbetrag) : anteilMutter;
		var vaterWert = _Utils_eq(elterenteil, $author$project$Types$Vater) ? A2($elm$core$Maybe$withDefault, 0, hoechstbetrag) : anteilVater;
		var elternText = function () {
			if (elterenteil.$ === 'Vater') {
				return 'Kindsvater';
			} else {
				return 'Kindsmutter';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notification is-info'),
							A2($elm$html$Html$Attributes$style, 'background-color', '#ddddeb')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Der Haftungsbetrag von ' + (elternText + (' (' + ($author$project$Utils$Format$formatEuroRounded(spiegelWert) + ' €) ist höher als der Zahlungsbetrag, der im Residenzmodell zu leisten wäre. Daher wird der Haftungsanteil auf diesen Zahlungsbetrag gedeckelt.')))),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mt-2')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Daher der Haftungsanteil von ' + (elternText + (': ' + ($author$project$Utils$Format$formatEuroRounded(
										A2($elm$core$Maybe$withDefault, 0, hoechstbetrag)) + ' €'))))
								]))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('button is-small mt-2'),
							$elm$html$Html$Attributes$type_('button'),
							$elm$html$Html$Events$onClick(
							A3($author$project$Types$ApplyHaftungsbetraege, vaterWert, mutterWert, $author$project$Types$Vorschlag))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Vorgeschlagenen Haftungsanteil übernehmen')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('button is-small mt-2'),
							$elm$html$Html$Attributes$type_('button'),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ToggleView($author$project$Types$ToggleVorschlagHft))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Stattdessen Haftungsanteile für Eltern individuell festsetzen')
						])),
					model.vorschlagHft ? A4(
					$author$project$View$Components$viewVorschlagHaftungsanteil,
					model,
					ergebnis,
					elterenteil,
					A2($elm$core$Maybe$withDefault, 0, hoechstbetrag)) : $elm$html$Html$text('')
				]));
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$View$Components$viewZusatzbedarfLeistungen = F2(
	function (model, ergebnis) {
		var zusatzbedarfItems = _Utils_ap(
			A2(
				$elm$core$List$map,
				function (item) {
					return _Utils_Tuple2('Mehrbedarf', item);
				},
				model.kind.mehrbedarf),
			_Utils_ap(
				A2(
					$elm$core$List$map,
					function (item) {
						return _Utils_Tuple2('Sonderbedarf', item);
					},
					model.kind.sonderbedarf),
				A2(
					$elm$core$List$map,
					function (item) {
						return _Utils_Tuple2('Erbrachte Leistung', item);
					},
					model.kind.erbrachteLeistungen)));
		var sumItems = function (items) {
			return $elm$core$List$sum(
				A2(
					$elm$core$List$map,
					function (_v5) {
						var item = _v5.b;
						return A2(
							$elm$core$Maybe$withDefault,
							0,
							$author$project$Utils$Format$formatInputToFloat(item.kosten));
					},
					items));
		};
		var renderItem = function (_v4) {
			var typ = _v4.a;
			var item = _v4.b;
			return A2(
				$elm$html$Html$li,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$strong,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(typ + ': ')
							])),
						$elm$html$Html$text(
						($elm$core$String$isEmpty(
							$elm$core$String$trim(item.bezeichnung)) ? 'Ohne Bezeichnung' : item.bezeichnung) + (' - ' + ($author$project$Utils$Format$formatEuroRounded(
							A2(
								$elm$core$Maybe$withDefault,
								0,
								$author$project$Utils$Format$formatInputToFloat(item.kosten))) + ' €')))
					]));
		};
		var renderItems = function (items) {
			return $elm$core$List$isEmpty(items) ? $elm$html$Html$text('Keine') : A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2($elm$core$List$map, renderItem, items));
		};
		var isFilledZusatzbedarf = function (_v3) {
			var item = _v3.b;
			return (!$elm$core$String$isEmpty(
				$elm$core$String$trim(item.kosten))) && (!(!A2(
				$elm$core$Maybe$withDefault,
				0,
				$author$project$Utils$Format$formatInputToFloat(item.kosten))));
		};
		var paidBy = function (person) {
			return A2(
				$elm$core$List$filter,
				isFilledZusatzbedarf,
				A2(
					$elm$core$List$filter,
					function (_v2) {
						var item = _v2.b;
						return _Utils_eq(
							item.bezahltVon,
							$elm$core$Maybe$Just(person));
					},
					zusatzbedarfItems));
		};
		var paidByMutter = sumItems(
			paidBy($author$project$Types$Mutter));
		var paidByVater = sumItems(
			paidBy($author$project$Types$Vater));
		var abzugVater = function () {
			var _v1 = model.kindergeldEmpfaenger;
			if (_v1.$ === 'Vater') {
				return $author$project$Constants$getKindergeld(model.jahr) / 2;
			} else {
				return 0;
			}
		}();
		var abzugMutter = function () {
			var _v0 = model.kindergeldEmpfaenger;
			if (_v0.$ === 'Mutter') {
				return $author$project$Constants$getKindergeld(model.jahr) / 2;
			} else {
				return 0;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h4,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('title is-6')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Bereits getragene Zusatzbedarfe und erbrachte Leistungen')
						])),
					A2(
					$elm$html$Html$table,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('table is-striped is-bordered is-hoverable is-fullwidth')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$thead,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$th,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('has-text-left')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Vater')
												])),
											A2(
											$elm$html$Html$th,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('has-text-left')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Mutter')
												]))
										]))
								])),
							A2(
							$elm$html$Html$tbody,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													renderItems(
													paidBy($author$project$Types$Vater))
												])),
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													renderItems(
													paidBy($author$project$Types$Mutter))
												]))
										])),
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text(
															'Summe: ' + ($author$project$Utils$Format$formatEuroRounded(paidByVater) + ' €'))
														]))
												])),
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text(
															'Summe: ' + ($author$project$Utils$Format$formatEuroRounded(paidByMutter) + ' €'))
														]))
												]))
										])),
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Anrechnung hälftiges Kindergeld beim Kindergeldempfänger: ')
												])),
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Anrechnung hälftiges Kindergeld beim Kindergeldempfänger: ')
												]))
										])),
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													'' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsbetragVater) + (' - ' + ($author$project$Utils$Format$formatEuroRounded(paidByVater) + (' + ' + ($author$project$Utils$Format$formatEuroRounded(abzugVater) + (' = ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.anteilVaterGesamtbedarf) + ' €'))))))))
												])),
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													'' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsbetragMutter) + (' - ' + ($author$project$Utils$Format$formatEuroRounded(paidByMutter) + (' + ' + ($author$project$Utils$Format$formatEuroRounded(abzugMutter) + (' = ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.anteilMutterGesamtbedarf) + ' €'))))))))
												]))
										])),
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Haftungsbetrag nach Anrechnung ' + ($author$project$Utils$Format$personToString($author$project$Types$Vater) + (': ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.anteilVaterGesamtbedarf) + ' €'))))
												])),
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Haftungsbetrag nach Anrechnung ' + ($author$project$Utils$Format$personToString($author$project$Types$Mutter) + (': ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.anteilMutterGesamtbedarf) + ' €'))))
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$View$Components$showErgebnis = function (model) {
	var rowWithLines = F2(
		function (lines, value) {
			return A2(
				$elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$td,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('has-text-left'),
								A2($elm$html$Html$Attributes$style, 'padding', '0.5rem'),
								A2($elm$html$Html$Attributes$style, 'vertical-align', 'top')
							]),
						A2(
							$elm$core$List$intersperse,
							A2($elm$html$Html$br, _List_Nil, _List_Nil),
							A2($elm$core$List$map, $elm$html$Html$text, lines))),
						A2(
						$elm$html$Html$td,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('has-text-right'),
								A2($elm$html$Html$Attributes$style, 'padding', '0.5rem')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(value)
							]))
					]));
		});
	var row = F2(
		function (label, value) {
			return A2(
				$elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$td,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('has-text-left'),
								A2($elm$html$Html$Attributes$style, 'padding', '0.5rem'),
								A2($elm$html$Html$Attributes$style, 'vertical-align', 'top')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(label)
							])),
						A2(
						$elm$html$Html$td,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('has-text-right'),
								A2($elm$html$Html$Attributes$style, 'padding', '0.5rem')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(value)
							]))
					]));
		});
	var nichtKindergeldEmpfänger = function () {
		var _v10 = model.kindergeldEmpfaenger;
		if (_v10.$ === 'Vater') {
			return $author$project$Types$Mutter;
		} else {
			return $author$project$Types$Vater;
		}
	}();
	var kindergeldBetreuungsanteil = $author$project$Constants$getKindergeld(model.jahr) / 4;
	var kindEinkuenfteSum = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (item) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$author$project$Utils$Format$formatInputToFloat(item.kosten));
			},
			model.kind.einkuenfte));
	var kindEinkuenfteUeberschrift = 'Abzug ' + (((model.kind.alter < 18) ? 'hälftiger' : 'vollständiger') + (' Einkünfte des Kindes iHv. ' + ($author$project$Utils$Format$formatEuroRounded(kindEinkuenfteSum) + ' €')));
	var kindEinkuenftePositionen = A2(
		$elm$core$List$filter,
		function (item) {
			return !(!A2(
				$elm$core$Maybe$withDefault,
				0,
				$author$project$Utils$Format$formatInputToFloat(item.kosten)));
		},
		model.kind.einkuenfte);
	var kindEinkuenfteZeilen = A2(
		$elm$core$List$cons,
		kindEinkuenfteUeberschrift,
		A2(
			$elm$core$List$map,
			function (item) {
				return '\u00A0\u00A0' + (($elm$core$String$isEmpty(
					$elm$core$String$trim(item.bezeichnung)) ? 'Ohne Bezeichnung' : item.bezeichnung) + (' (' + ($author$project$Utils$Format$formatEuroRounded(
					A2(
						$elm$core$Maybe$withDefault,
						0,
						$author$project$Utils$Format$formatInputToFloat(item.kosten))) + ' €)')));
			},
			kindEinkuenftePositionen));
	var header = F2(
		function (label1, label2) {
			return A2(
				$elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$th,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('has-text-left has-text-centered')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(label1)
							])),
						A2(
						$elm$html$Html$th,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('has-text-right has-text-centered')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(label2)
							]))
					]));
		});
	var ergebnis = $author$project$Calculation$calculateAusgleichsanspruch(model);
	var hoechstbetragFallback = A2($elm$core$Maybe$withDefault, 0, ergebnis.regelbedarf) - ((model.kind.alter < 18) ? ($author$project$Constants$getKindergeld(model.jahr) / 2) : $author$project$Constants$getKindergeld(model.jahr));
	var hoechstbetragMutter = A2(
		$elm$core$Maybe$withDefault,
		hoechstbetragFallback,
		A3($author$project$Constants$getHoechstbetrag, model.jahr, ergebnis.bereinigtesEinkommenMutter, model.kind.alter));
	var hoechstbetragVater = A2(
		$elm$core$Maybe$withDefault,
		hoechstbetragFallback,
		A3($author$project$Constants$getHoechstbetrag, model.jahr, ergebnis.bereinigtesEinkommenVater, model.kind.alter));
	var renderPersonSection = F2(
		function (title, person) {
			var weitereEinkuenfte = function () {
				if (person.$ === 'Vater') {
					return ergebnis.weitereEinkuenfteVater;
				} else {
					return ergebnis.weitereEinkuenfteMutter;
				}
			}();
			var verteilbarerBetrag = function () {
				if (person.$ === 'Vater') {
					return ergebnis.verteilbarerBetragVater;
				} else {
					return ergebnis.verteilbarerBetragMutter;
				}
			}();
			var textPerson = function () {
				if (person.$ === 'Vater') {
					return 'den Kindsvater';
				} else {
					return 'die Kindsmutter';
				}
			}();
			var modelPerson = function () {
				if (person.$ === 'Vater') {
					return model.vater;
				} else {
					return model.mutter;
				}
			}();
			var selbstbehaltText = function () {
				var _v5 = modelPerson.selbstbehalt;
				switch (_v5.$) {
					case 'Angemessen':
						return 'angemessener Selbstbehalt';
					case 'NotwendigErwerbstaetig':
						return 'notwendiger Selbstbehalt (erwerbstätig)';
					case 'NotwendigNichtErwerbstaetig':
						return 'notwendiger Selbstbehalt (nicht erwerbstätig)';
					default:
						return 'benutzerdefinierter Selbstbehalt';
				}
			}();
			var selbstbehaltTextMitArtikel = function () {
				var _v4 = modelPerson.selbstbehalt;
				switch (_v4.$) {
					case 'Angemessen':
						return 'angemessene Selbstbehalt';
					case 'NotwendigErwerbstaetig':
						return 'notwendige Selbstbehalt (erwerbstätig)';
					case 'NotwendigNichtErwerbstaetig':
						return 'notwendige Selbstbehalt (nicht erwerbstätig)';
					default:
						return 'benutzerdefinierte Selbstbehalt';
				}
			}();
			var gesamtAbzug = function () {
				if (person.$ === 'Vater') {
					return ergebnis.gesamtAbzugVater;
				} else {
					return ergebnis.gesamtAbzugMutter;
				}
			}();
			var einkommen = function () {
				if (person.$ === 'Vater') {
					return ergebnis.einkommenVater;
				} else {
					return ergebnis.einkommenMutter;
				}
			}();
			var bereinigtesEinkommen = function () {
				if (person.$ === 'Vater') {
					return ergebnis.bereinigtesEinkommenVater;
				} else {
					return ergebnis.bereinigtesEinkommenMutter;
				}
			}();
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('title is-5')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(title)
							])),
						A2(
						$elm$html$Html$table,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('table is-striped is-bordered is-hoverable'),
								A2($elm$html$Html$Attributes$style, 'width', '100%')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$thead,
								_List_Nil,
								_List_fromArray(
									[
										A2(header, 'Bezeichnung', 'Betrag')
									])),
								A2(
								$elm$html$Html$tbody,
								_List_Nil,
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											row,
											'Einkommen',
											$author$project$Utils$Format$formatEuroRounded(einkommen) + ' €'),
											A2(
											row,
											'\u00A0\u00A0Einkünfte aus Haupttätigkeit',
											$author$project$Utils$Format$formatEuroRounded(
												A2(
													$elm$core$Maybe$withDefault,
													0,
													$author$project$Utils$Format$formatInputToFloat(modelPerson.haupttaetigkeit))) + ' €'),
											A2(
											row,
											'\u00A0\u00A0Weitere Einkünfte Gesamt',
											$author$project$Utils$Format$formatEuroRounded(weitereEinkuenfte) + ' €')
										]),
									_Utils_ap(
										A2(
											$elm$core$List$map,
											function (item) {
												return A2(
													row,
													'\u00A0\u00A0\u00A0\u00A0' + item.bezeichnung,
													$author$project$Utils$Format$formatEuroRounded(
														A2(
															$elm$core$Maybe$withDefault,
															0.0,
															$author$project$Utils$Format$formatInputToFloat(item.kosten))) + ' €');
											},
											A2(
												$elm$core$List$filter,
												function (item) {
													return (!$elm$core$String$isEmpty(item.kosten)) && (item.kosten !== '0,00');
												},
												modelPerson.weitereEinkuenfte)),
										_Utils_ap(
											A2(
												$elm$core$List$cons,
												A2(
													row,
													'Abzug Gesamt',
													$author$project$Utils$Format$formatEuroRounded(gesamtAbzug) + ' €'),
												A2(
													$elm$core$List$map,
													function (item) {
														return A2(
															row,
															'\u00A0\u00A0Abzug ' + item.bezeichnung,
															$author$project$Utils$Format$formatEuroRounded(
																A2(
																	$elm$core$Maybe$withDefault,
																	0.0,
																	$author$project$Utils$Format$formatInputToFloat(item.kosten))) + ' €');
													},
													A2(
														$elm$core$List$filter,
														function (item) {
															return (!$elm$core$String$isEmpty(item.kosten)) && (item.kosten !== '0,00');
														},
														modelPerson.abzugsposten))),
											_List_fromArray(
												[
													A2(
													row,
													'Bereinigtes Einkommen',
													$author$project$Utils$Format$formatEuroRounded(bereinigtesEinkommen) + ' €'),
													A2(
													row,
													'Selbstbehalt (' + (selbstbehaltText + ')'),
													$author$project$Utils$Format$formatEuroRounded(
														A2(
															$elm$core$Maybe$withDefault,
															0.0,
															$author$project$Utils$Format$formatInputToFloat(
																$author$project$Utils$Format$renderSelbstbehaltBetrag(modelPerson.selbstbehalt)))) + ' €'),
													A2(
													row,
													'= verteilbarer Betrag ',
													$author$project$Utils$Format$formatEuroRounded(verteilbarerBetrag) + ' €')
												])))))
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mt-4')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Für ' + (textPerson + (' wurde der ' + (selbstbehaltTextMitArtikel + ' berücksichtigt.'))))
							]))
					]));
		});
	var differenzNachAnrechnung = $elm$core$Basics$abs(ergebnis.anteilVaterGesamtbedarf - ergebnis.anteilMutterGesamtbedarf);
	var auszugleichenderBetragNachAnrechnung = differenzNachAnrechnung / 2;
	var anzurechnendeKindEinkuenfte = (model.kind.alter < 18) ? (kindEinkuenfteSum / 2) : kindEinkuenfteSum;
	var anspruchsberechtigtNachAnrechnung = (_Utils_cmp(ergebnis.anteilVaterGesamtbedarf, ergebnis.anteilMutterGesamtbedarf) > 0) ? $author$project$Types$Mutter : $author$project$Types$Vater;
	var ausgleichsanspruchNachAnrechnung = _Utils_eq(anspruchsberechtigtNachAnrechnung, $author$project$Types$Mutter) ? (_Utils_eq(model.kindergeldEmpfaenger, $author$project$Types$Vater) ? (auszugleichenderBetragNachAnrechnung + ($author$project$Constants$getKindergeld(model.jahr) / 4)) : (auszugleichenderBetragNachAnrechnung - ($author$project$Constants$getKindergeld(model.jahr) / 4))) : (_Utils_eq(model.kindergeldEmpfaenger, $author$project$Types$Mutter) ? (auszugleichenderBetragNachAnrechnung + ($author$project$Constants$getKindergeld(model.jahr) / 4)) : (auszugleichenderBetragNachAnrechnung - ($author$project$Constants$getKindergeld(model.jahr) / 4)));
	var kindergeldWirdAddiert = _Utils_eq(anspruchsberechtigtNachAnrechnung, nichtKindergeldEmpfänger);
	var ausgleichsanspruchRechenzeichen = kindergeldWirdAddiert ? '+' : '-';
	var ausgleichsanspruchZwischenschritt = $author$project$Utils$Format$formatEuroRounded(auszugleichenderBetragNachAnrechnung) + (' € ' + (ausgleichsanspruchRechenzeichen + (' ' + ($author$project$Utils$Format$formatEuroRounded(kindergeldBetreuungsanteil) + (' € = ' + ($author$project$Utils$Format$formatEuroRounded(ausgleichsanspruchNachAnrechnung) + ' €'))))));
	var nichtAnspruchsberechtigtNachAnrechnung = _Utils_eq(anspruchsberechtigtNachAnrechnung, $author$project$Types$Vater) ? $author$project$Types$Mutter : $author$project$Types$Vater;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mt-5'),
				A2($elm$html$Html$Attributes$style, 'margin', '1rem')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('is-flex is-justify-content-space-between is-align-items-center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('title is-4 mb-0')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Ausgleichsanspruch Berechnung')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('button is-primary'),
								$elm$html$Html$Attributes$type_('button'),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Export PDF'),
								$elm$html$Html$Attributes$title('Export PDF'),
								$elm$html$Html$Events$onClick(
								$author$project$Types$Export($author$project$Types$ExportPdf))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('icon')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas fa-file-export')
											]),
										_List_Nil)
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('columns is-variable is-3')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column')
							]),
						_List_fromArray(
							[
								A2(renderPersonSection, 'Vater', $author$project$Types$Vater)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column')
							]),
						_List_fromArray(
							[
								A2(renderPersonSection, 'Mutter', $author$project$Types$Mutter)
							]))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mt-4')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Relevantes Gesamteinkommen für den Regelbedarf: ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.gesamtEinkommen) + ' €'))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mt-4')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Verteilbarer Betrag Gesamt: ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.verteilbarerBetragGesamt) + ' €'))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('columns is-variable is-3')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mt-4')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Haftungsanteil Vater: ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsanteilVater * 100) + '%'))
									])),
								(!ergebnis.haftungsanteilVater) ? A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mt-4 has-text-danger')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Da der Haftungsanteil des Vaters bei 0 Prozent liegt, berechnet sich der Regelbedarf des Kindes allein aufgrund des Einkommens der Mutter.')
									])) : ((!ergebnis.haftungsanteilMutter) ? A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mt-4 has-text-danger')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Da der Haftungsanteil der Mutter bei 0 Prozent liegt, berechnet sich der Regelbedarf des Kindes allein aufgrund des Einkommens des Vaters.')
									])) : $elm$html$Html$text(''))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mt-4')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Haftungsanteil Mutter: ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsanteilMutter * 100) + '%'))
									]))
							]))
					])),
				A2($elm$html$Html$hr, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$h4,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('title is-5 mt-5')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Bedarf des Kindes (Alter: ' + ($elm$core$String$fromInt(model.kind.alter) + ' Jahre)'))
					])),
				A2(
				$elm$html$Html$table,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table is-striped is-bordered is-hoverable is-fullwidth')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$thead,
						_List_Nil,
						_List_fromArray(
							[
								A2(header, 'Bezeichnung', 'Betrag')
							])),
						A2(
						$elm$html$Html$tbody,
						_List_Nil,
						_Utils_ap(
							_List_fromArray(
								[
									A2(
									row,
									'Regelbedarf' + (model.customRegelbedarf ? '**' : ''),
									$author$project$Utils$Format$formatEuroRounded(
										A2($elm$core$Maybe$withDefault, 0, ergebnis.regelbedarf)) + ' €'),
									A2(
									row,
									'Zusatzbedarf',
									$author$project$Utils$Format$formatEuroRounded(
										$elm$core$List$sum(
											A2(
												$elm$core$List$map,
												function (item) {
													return A2(
														$elm$core$Maybe$withDefault,
														0,
														$author$project$Utils$Format$formatInputToFloat(item.kosten));
												},
												model.kind.mehrbedarf)) + $elm$core$List$sum(
											A2(
												$elm$core$List$map,
												function (item) {
													return A2(
														$elm$core$Maybe$withDefault,
														0,
														$author$project$Utils$Format$formatInputToFloat(item.kosten));
												},
												model.kind.sonderbedarf))) + ' €'),
									A2(
									row,
									'davon Mehrbedarf',
									$author$project$Utils$Format$formatEuroRounded(
										$elm$core$List$sum(
											A2(
												$elm$core$List$map,
												function (item) {
													return A2(
														$elm$core$Maybe$withDefault,
														0,
														$author$project$Utils$Format$formatInputToFloat(item.kosten));
												},
												model.kind.mehrbedarf))) + ' €')
								]),
							_Utils_ap(
								A2(
									$elm$core$List$map,
									function (item) {
										return A2(
											row,
											'\u00A0\u00A0' + (item.bezeichnung + (' \u00A0\u00A0 (Bereits bezahlt von: ' + (A2(
												$elm$core$Maybe$withDefault,
												'Nicht angegeben',
												A2($elm$core$Maybe$map, $author$project$Utils$Format$personToString, item.bezahltVon)) + ')'))),
											$author$project$Utils$Format$formatEuroRounded(
												A2(
													$elm$core$Maybe$withDefault,
													0,
													$author$project$Utils$Format$formatInputToFloat(item.kosten))) + ' €');
									},
									A2(
										$elm$core$List$filter,
										function (item) {
											return (!$elm$core$String$isEmpty(item.kosten)) && (item.kosten !== '0,00');
										},
										model.kind.mehrbedarf)),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											row,
											'davon Sonderbedarf',
											$author$project$Utils$Format$formatEuroRounded(
												$elm$core$List$sum(
													A2(
														$elm$core$List$map,
														function (item) {
															return A2(
																$elm$core$Maybe$withDefault,
																0,
																$author$project$Utils$Format$formatInputToFloat(item.kosten));
														},
														model.kind.sonderbedarf))) + ' €')
										]),
									_Utils_ap(
										A2(
											$elm$core$List$map,
											function (item) {
												return A2(
													row,
													'\u00A0\u00A0' + (item.bezeichnung + ('\u00A0\u00A0 (Bereits bezahlt von: ' + (A2(
														$elm$core$Maybe$withDefault,
														'Nicht angegeben',
														A2($elm$core$Maybe$map, $author$project$Utils$Format$personToString, item.bezahltVon)) + ')'))),
													$author$project$Utils$Format$formatEuroRounded(
														A2(
															$elm$core$Maybe$withDefault,
															0,
															$author$project$Utils$Format$formatInputToFloat(item.kosten))) + ' €');
											},
											A2(
												$elm$core$List$filter,
												function (item) {
													return (!$elm$core$String$isEmpty(item.kosten)) && (item.kosten !== '0,00');
												},
												model.kind.sonderbedarf)),
										_Utils_ap(
											(!$elm$core$List$isEmpty(kindEinkuenftePositionen)) ? _List_fromArray(
												[
													A2(
													rowWithLines,
													kindEinkuenfteZeilen,
													$author$project$Utils$Format$formatEuroRounded(anzurechnendeKindEinkuenfte) + ' €')
												]) : _List_Nil,
											_List_fromArray(
												[
													A2(
													row,
													'Abzug hälftiges Kindergeld',
													$author$project$Utils$Format$formatEuroRounded(
														$author$project$Constants$getKindergeld(model.jahr) / 2) + ' €'),
													A2(
													row,
													'Gesamtbedarf',
													$author$project$Utils$Format$formatEuroRounded(ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf) + ' €')
												])))))))
					])),
				A2($elm$html$Html$hr, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('columns is-variable is-3 mt-4')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Anteil Vater am Gesamtbedarf: ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsbetragVater) + ' €'))
									])),
								A4($author$project$View$Components$viewBegrenzungHinweis, 'Vaters', ergebnis.haftungsbetragVaterVorBegrenzung, ergebnis.haftungsbetragVater, ergebnis.verteilbarerBetragVater),
								(_Utils_cmp(
								A2($elm$core$Maybe$withDefault, 0, model.haftungsbetragVaterSpiegel),
								hoechstbetragVater) > 0) ? A6($author$project$View$Components$viewHHinweisAnteilEltern, model, ergebnis, $author$project$Types$Vater, ergebnis.bereinigtesEinkommenVater, ergebnis.haftungsbetragVater, ergebnis.haftungsbetragMutter) : $elm$html$Html$text('')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Anteil Mutter am Gesamtbedarf: ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.haftungsbetragMutter) + ' €'))
									])),
								A4($author$project$View$Components$viewBegrenzungHinweis, 'Mutters', ergebnis.haftungsbetragMutterVorBegrenzung, ergebnis.haftungsbetragMutter, ergebnis.verteilbarerBetragMutter),
								(_Utils_cmp(
								A2($elm$core$Maybe$withDefault, 0, model.haftungsbetragMutterSpiegel),
								hoechstbetragMutter) > 0) ? A6($author$project$View$Components$viewHHinweisAnteilEltern, model, ergebnis, $author$project$Types$Mutter, ergebnis.bereinigtesEinkommenMutter, ergebnis.haftungsbetragVater, ergebnis.haftungsbetragMutter) : $elm$html$Html$text('')
							]))
					])),
				((ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf - ergebnis.verteilbarerBetragGesamt) > 0) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#ff0000'),
								$elm$html$Html$Attributes$class('has-text-centered')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Ungedeckter Kindsbedarf: ' + ($author$project$Utils$Format$formatEuroRounded(ergebnis.gesamtKindbedarf_mitGetrageneZusatzbedarf - ergebnis.verteilbarerBetragGesamt) + ' €'))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('notification mt-4')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Hinweis: Der Bedarf des Kindes ist höher als der verteilbare Betrag.'),
										function () {
										var _v0 = model.vater.selbstbehalt;
										if (_v0.$ === 'Angemessen') {
											return $elm$html$Html$text(' Es sollte gegebenenfalls in Erwägung gezogen werden, statt des angemessenen Selbstbehalts den notwendigen Selbstbehalt anzusetzen.');
										} else {
											return $elm$html$Html$text(' Da der Bedarf des Kindes nicht durch die Eltern gedeckt werden kann, sollte geprüft werden, ob Ergänzen weitere finanzielle Unterstützungsmöglichkeiten in Anspruch genommen werden können, z. B. durch die Inanspruchnahme sozialrechtlicher Leistungen.');
										}
									}()
									]))
							]))
					])) : $elm$html$Html$text(''),
				A2($author$project$View$Components$viewZusatzbedarfLeistungen, model, ergebnis),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mt-4')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Differenz: ' + ($author$project$Utils$Format$formatEuroRounded(differenzNachAnrechnung) + ' €'))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mt-4')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Auszugleichender Betrag (1/2) von ' + ($author$project$Utils$Format$personToString(nichtAnspruchsberechtigtNachAnrechnung) + (' zu leisten an ' + ($author$project$Utils$Format$personToString(anspruchsberechtigtNachAnrechnung) + (': ' + ($author$project$Utils$Format$formatEuroRounded(auszugleichenderBetragNachAnrechnung) + ' €'))))))
					])),
				A2(
				$elm$html$Html$h4,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('title is-5 mt-5')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Kindergeldverrechnung ')
					])),
				A2(
				$elm$html$Html$table,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table is-striped is-bordered is-hoverable is-fullwidth')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$thead,
						_List_Nil,
						_List_fromArray(
							[
								A2(header, 'Bezeichnung', 'Betrag')
							])),
						A2(
						$elm$html$Html$tbody,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								row,
								'Kindergeld',
								$author$project$Utils$Format$formatEuroRounded(
									$author$project$Constants$getKindergeld(model.jahr)) + ' €'),
								A2(
								row,
								'Kindergeldempfänger',
								$author$project$Utils$Format$personToString(model.kindergeldEmpfaenger)),
								A2(
								row,
								'Betreuungsanteil Mutter',
								$author$project$Utils$Format$formatEuroRounded(ergebnis.betreuungsanteil) + ' €'),
								A2(
								row,
								'Baranteil Mutter',
								$author$project$Utils$Format$formatEuroRounded(ergebnis.baranteilMutter) + ' €'),
								A2(
								row,
								'Betreuungsanteil Vater',
								$author$project$Utils$Format$formatEuroRounded(ergebnis.betreuungsanteil) + ' €'),
								A2(
								row,
								'Baranteil Vater',
								$author$project$Utils$Format$formatEuroRounded(ergebnis.baranteilVater) + ' €')
							]))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mt-4')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Durch den Abzug des hälftigen Kindergeldes vom Bedarf wurde der Baranteil bereits abgegolten. Verbleibend ist allein die Verrechnung des Betreuungsanteils in Höhe von ' + ($author$project$Utils$Format$formatEuroRounded(kindergeldBetreuungsanteil) + (' € von ' + ($author$project$Utils$Format$personToString(model.kindergeldEmpfaenger) + (' an ' + ($author$project$Utils$Format$personToString(nichtKindergeldEmpfänger) + ': '))))))
					])),
				A2(
				$elm$html$Html$table,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table is-striped is-bordered is-hoverable is-fullwidth mt-4')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$thead,
						_List_Nil,
						_List_fromArray(
							[
								A2(header, 'Zwischenschritt', 'Betrag')
							])),
						A2(
						$elm$html$Html$tbody,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								row,
								'Auszugleichender Betrag (1/2)',
								$author$project$Utils$Format$formatEuroRounded(auszugleichenderBetragNachAnrechnung) + ' €'),
								A2(
								row,
								'Betreuungsanteil Kindergeld von ' + ($author$project$Utils$Format$personToString(model.kindergeldEmpfaenger) + (' an ' + $author$project$Utils$Format$personToString(nichtKindergeldEmpfänger))),
								ausgleichsanspruchRechenzeichen + (' ' + ($author$project$Utils$Format$formatEuroRounded(kindergeldBetreuungsanteil) + ' €'))),
								A2(row, 'Rechnung Ausgleichsanspruch', ausgleichsanspruchZwischenschritt)
							]))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mt-4')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Der Ausgleichsanspruch ist auf volle Euro aufzurunden.')
					])),
				A2($elm$html$Html$hr, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('box content has-text-weight-bold mt-4 has-text-centered'),
						A2($elm$html$Html$Attributes$style, 'border', '1px solid #ccc'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'padding', '1rem')
					]),
				_List_fromArray(
					[
						(ausgleichsanspruchNachAnrechnung < 0) ? $elm$html$Html$text(
						'Daher insgesamt von ' + ($author$project$Utils$Format$personToString(anspruchsberechtigtNachAnrechnung) + (' an ' + ($author$project$Utils$Format$personToString(nichtAnspruchsberechtigtNachAnrechnung) + (' zu leistende Ausgleichszahlung: ' + ($author$project$Utils$Format$formatEuroRounded(
							$elm$core$Basics$ceiling(
								$elm$core$Basics$abs(ausgleichsanspruchNachAnrechnung))) + ' €')))))) : $elm$html$Html$text(
						'Daher insgesamt von ' + ($author$project$Utils$Format$personToString(nichtAnspruchsberechtigtNachAnrechnung) + (' an ' + ($author$project$Utils$Format$personToString(anspruchsberechtigtNachAnrechnung) + (' zu leistende Ausgleichszahlung: ' + ($author$project$Utils$Format$formatEuroRounded(
							$elm$core$Basics$ceiling(ausgleichsanspruchNachAnrechnung)) + ' €'))))))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('title is-5 mt-5')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Erläuterungen und Anmerkungen:'),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('is-size-6 mt-3'),
								A2($elm$html$Html$Attributes$style, 'font-weight', 'normal'),
								A2($elm$html$Html$Attributes$style, 'white-space', 'pre-wrap')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(model.freitext)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				model.customRegelbedarf ? _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('is-5 mt-5')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('** Individueller Regelbedarf wurde verwendet.')
							]))
					]) : _List_Nil),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('button is-primary'),
						$elm$html$Html$Attributes$type_('button'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '1rem'),
						$elm$html$Html$Events$onClick(
						$author$project$Types$Export($author$project$Types$ExportPdf))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Export PDF')
					]))
			]));
};
var $author$project$Types$ToggleUeberUns = {$: 'ToggleUeberUns'};
var $elm$html$Html$header = _VirtualDom_node('header');
var $author$project$View$Components$ueberUns = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('content'),
			A2($elm$html$Html$Attributes$style, 'padding', '1rem')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('title is-4')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('ASGLA-Rechner – Zur Berechnung des Kindesunterhalts in Sachsen-Anhalt')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Wir entwickeln einen Rechner, der die Berechnung von Unterhaltsansprüchen für Kinder im Wechselmodell transparent und nachvollziehbar macht und gleichzeitig den Berechnungsaufwand erheblich reduziert.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Jährlich werden in Deutschland zahlreiche Unterhaltsberechnungen für das Wechselmodell erstellt, und fast jede davon ist eine Herausforderung. Warum? Weil die Berechnung nach aktuellen Gerichtsleitlinien so komplex ist, dass selbst erfahrene Jurist:innen regelmäßig zum Taschenrechner greifen müssen.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Unser digitaler Rechner löst dieses Problem für alle Beteiligten: In wenigen Klicks erhalten Eltern eine verlässliche erste Einschätzung ihrer finanziellen Situation, während Richter:innen und Jugendämter ihre Berechnungen standardisiert und effizient durchführen können.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Ihre Daten bleiben dabei vollständig geschützt: Das integrierte QR-Code-System ermöglicht die sichere lokale Speicherung direkt auf Ihrem Gerät – ohne zentrale Server, ohne Datenweitergabe.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Ein Tool, zwei Perspektiven, eine gemeinsame Basis für faire Entscheidungen.')
				])),
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('title is-4 mt-5')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Hintergrund')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Das Projekt wurde von Steuerrechtler:in Viselle Wöhlert initiiert, die im Januar 2025 einen ersten Python-Prototyp entwickelte.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Seit März 2025 wird sie dabei professionell unterstützt: Adelia Arvinta, Entwickler:in, übernimmt die moderne Webentwicklung in Elm und implementiert nutzerfreundliche Funktionen. Luis Bartsch, Student der Rechtswissenschaften an der Uni Halle und ehemalige wissenschaftliche Hilfskraft des JTC Legal Tech Labs, gewährleistet die rechtliche Korrektheit sowie kommunikative Zusammenarbeit mit wichtigen Praxispartner:innen.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Diese interdisziplinäre Zusammenarbeit zwischen Recht, Technik und Praxis stellt sicher, dass das Tool sowohl juristisch fundiert als auch intuitiv bedienbar ist.')
				])),
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('title is-4 mt-5')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Aktueller Stand')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Der Rechner wird in enger Zusammenarbeit mit Jugendämtern, Richter:innen, Eltern sowie Fachanwält:innen für Familienrecht getestet und optimiert.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Der Rechner steht allen Interessierten kostenlos zur Verfügung. Wir freuen uns über Ihr Feedback und laden Sie ein, das Tool zu testen und bei der Weiterentwicklung mitzuwirken.')
				])),
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('title is-4 mt-5')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Kontakt ')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Kontakt: legaltech@jtc.uni-halle.de')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Martin-Luther-Universität Halle-Wittenberg')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Juristische und Wirtschaftswissenschaftliche Fakultät')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Adresse: Große Steinstraße 79/80, 06108 Halle (Saale)')
				])),
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('title is-4 mt-5')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Team')
				])),
			A2(
			$elm$html$Html$ul,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Viselle Wöhlert')
						])),
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Adelia Arvinta')
						])),
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Luis Bartsch')
						])),
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('in Zusammenarbeit mit dem JTC Halle')
						]))
				])),
			A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('has-text-danger mt-5')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Hinweis: Der Rechner ersetzt keine rechtliche Beratung und erhebt keinen Anspruch auf Vollständigkeit oder Richtigkeit im Einzelfall.')
				]))
		]));
var $author$project$View$Components$ueberUnsSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card'),
				A2($elm$html$Html$Attributes$style, 'margin-top', '-1rem')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$header,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('card-header'),
						$elm$html$Html$Events$onClick(
						$author$project$Types$ToggleView($author$project$Types$ToggleUeberUns))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('card-header-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Über uns')
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('card-header-icon')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(
										'fas ' + (model.showUeberUns ? 'fa-angle-up' : 'fa-angle-down'))
									]),
								_List_Nil)
							]))
					])),
				model.showUeberUns ? $author$project$View$Components$ueberUns : $elm$html$Html$text('')
			]));
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$View$Layout$viewFooter = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background-color', '#000000'),
			A2($elm$html$Html$Attributes$style, 'color', '#ffffff'),
			A2($elm$html$Html$Attributes$style, 'width', '100%')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns is-vcentered is-mobile'),
							A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src('assets/JTCLogo.png'),
									$elm$html$Html$Attributes$alt('JTC Logo'),
									A2($elm$html$Html$Attributes$style, 'max-height', '30px'),
									A2($elm$html$Html$Attributes$style, 'filter', 'brightness(0) invert(1)'),
									A2($elm$html$Html$Attributes$style, 'margin-left', '2rem')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('buttons is-pulled-right'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0rem')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('button is-text footer-link'),
													A2($elm$html$Html$Attributes$style, 'font-size', '14px'),
													$elm$html$Html$Attributes$href('https://jtc.uni-halle.de/impressum/'),
													$elm$html$Html$Attributes$target('_blank'),
													$elm$html$Html$Attributes$rel('noopener noreferrer')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Impressum')
												])),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('button is-text footer-link'),
													A2($elm$html$Html$Attributes$style, 'font-size', '14px'),
													$elm$html$Html$Attributes$href('https://jtc.uni-halle.de/datenschutz/'),
													$elm$html$Html$Attributes$target('_blank'),
													$elm$html$Html$Attributes$rel('noopener noreferrer')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Datenschutz')
												])),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('button is-text footer-link'),
													A2($elm$html$Html$Attributes$style, 'font-size', '14px'),
													$elm$html$Html$Attributes$href('https://jtc.uni-halle.de/kontakt/'),
													$elm$html$Html$Attributes$target('_blank'),
													$elm$html$Html$Attributes$rel('noopener noreferrer')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Kontakt')
												])),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('button is-text footer-link'),
													A2($elm$html$Html$Attributes$style, 'font-size', '14px'),
													$elm$html$Html$Attributes$href('https://jtc.uni-halle.de/asgla-rechner/'),
													$elm$html$Html$Attributes$target('_blank'),
													$elm$html$Html$Attributes$rel('noopener noreferrer')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Link zum Projekt')
												]))
										]))
								]))
						]))
				]))
		]));
var $author$project$Types$ToggleSaveModal = {$: 'ToggleSaveModal'};
var $author$project$Types$UpdateFreitext = function (a) {
	return {$: 'UpdateFreitext', a: a};
};
var $author$project$Types$ViewErgebnis = {$: 'ViewErgebnis'};
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$View$Layout$hasStufensprungAlterAmJahresende = function (model) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (alter) {
				return A2(
					$elm$core$List$member,
					alter,
					_List_fromArray(
						[6, 12, 18]));
			},
			A3($author$project$Utils$Validation$inputAgeOrBirthdayToAge, 'Dezember', model.jahr, model.kind.alterInput)));
};
var $author$project$Types$CopyJsonToClipboard = {$: 'CopyJsonToClipboard'};
var $author$project$Types$DownloadJson = {$: 'DownloadJson'};
var $author$project$Types$DownloadQrCode = {$: 'DownloadQrCode'};
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $author$project$ImportExport$createQRCodeImage = function (message) {
	var _v0 = $author$project$ImportExport$getQRCodeUrl(message);
	if (_v0.$ === 'Just') {
		var base64Url = _v0.a;
		return A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src(base64Url),
					$elm$html$Html$Attributes$width(200),
					$elm$html$Html$Attributes$height(200)
				]),
			_List_Nil);
	} else {
		return $elm$html$Html$text('Fehler bei der QR-Code-Erzeugung.');
	}
};
var $author$project$View$Components$showQRCode = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mt-4')
			]),
		_List_fromArray(
			[
				$author$project$ImportExport$createQRCodeImage(
				$author$project$ImportExport$encodeModeltoQRCode(model))
			]));
};
var $author$project$View$Components$saveModal = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal is-active')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-background'),
						$elm$html$Html$Events$onClick(
						$author$project$Types$ToggleView($author$project$Types$ToggleSaveModal))
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$header,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('modal-card-head')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('modal-card-title')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Eingabe zwischenspeichern')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('delete'),
										$elm$html$Html$Attributes$type_('button'),
										$elm$html$Html$Events$onClick(
										$author$project$Types$ToggleView($author$project$Types$ToggleSaveModal))
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$section,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('modal-card-body')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('field')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('QR Code:')
											])),
										$author$project$View$Components$showQRCode(model),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('button is-small mr-2'),
												$elm$html$Html$Attributes$type_('button'),
												$elm$html$Html$Events$onClick(
												$author$project$Types$Export($author$project$Types$DownloadQrCode))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('QR Code speichern')
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('field'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '1rem')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('JSON String:')
											])),
										A2(
										$elm$html$Html$textarea,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('textarea is-family-monospace'),
												$elm$html$Html$Attributes$readonly(true),
												$elm$html$Html$Attributes$value(
												$author$project$ImportExport$encodeModeltoQRCode(model))
											]),
										_List_Nil),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('button is-small mt-2'),
												$elm$html$Html$Attributes$type_('button'),
												$elm$html$Html$Events$onClick(
												$author$project$Types$Export($author$project$Types$CopyJsonToClipboard))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Copy')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('button is-small mt-2'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5rem'),
												$elm$html$Html$Attributes$type_('button'),
												$elm$html$Html$Events$onClick(
												$author$project$Types$Export($author$project$Types$DownloadJson))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('JSON speichern')
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Types$ToggleDurchschnittseinkommen = {$: 'ToggleDurchschnittseinkommen'};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $author$project$View$Components$showTooltip = function (tooltipText) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('tooltip-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$i,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fas fa-question-circle')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('tooltip-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(tooltipText)
					]))
			]));
};
var $author$project$View$Components$viewCheckboxDurchschnittseinkommen = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('field'),
				A2($elm$html$Html$Attributes$style, 'margin-top', '1rem')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('checkbox')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('checkbox'),
										$elm$html$Html$Attributes$checked(model.durchschnittseinkommen),
										$elm$html$Html$Events$onClick(
										$author$project$Types$ToggleView($author$project$Types$ToggleDurchschnittseinkommen))
									]),
								_List_Nil),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ml-2')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Statt Monatsberechnung Durchschnittsberechnung durchführen')
									])),
								$author$project$View$Components$showTooltip('Aktivieren Sie diese Option, um die durchschnittliche Monatszahlung zu berechnen.')
							]))
					]))
			]));
};
var $author$project$Types$UpdateMonat = function (a) {
	return {$: 'UpdateMonat', a: a};
};
var $author$project$View$Components$monate = _List_fromArray(
	['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']);
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $author$project$View$Components$viewMonth = F2(
	function (columnClass, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(columnClass)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Monat * '),
							$author$project$View$Components$showTooltip('Wählen Sie den Monat aus, für den die Berechnung durchgeführt werden soll.')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('select is-fullwidth')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$select,
									_List_fromArray(
										[
											$elm$html$Html$Events$onInput(
											A2($elm$core$Basics$composeL, $author$project$Types$Update, $author$project$Types$UpdateMonat)),
											$elm$html$Html$Attributes$value(model.monat)
										]),
									A2(
										$elm$core$List$map,
										function (m) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(m)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(m)
													]));
										},
										$author$project$View$Components$monate))
								]))
						]))
				]));
	});
var $author$project$Types$Middle = {$: 'Middle'};
var $author$project$Types$Right = {$: 'Right'};
var $author$project$Types$Abzugsposten = {$: 'Abzugsposten'};
var $author$project$Types$ApplyDurchschnittseinkommen = {$: 'ApplyDurchschnittseinkommen'};
var $author$project$Types$EinkommenzumDurchschnittsberechnung = {$: 'EinkommenzumDurchschnittsberechnung'};
var $author$project$Types$UpdateElternDaten = F2(
	function (a, b) {
		return {$: 'UpdateElternDaten', a: a, b: b};
	});
var $author$project$Types$AddPosten = function (a) {
	return {$: 'AddPosten', a: a};
};
var $author$project$Types$ChangePosten = function (a) {
	return {$: 'ChangePosten', a: a};
};
var $author$project$Types$RemovePosten = F2(
	function (a, b) {
		return {$: 'RemovePosten', a: a, b: b};
	});
var $author$project$Types$UpdatePosten = F3(
	function (a, b, c) {
		return {$: 'UpdatePosten', a: a, b: b, c: c};
	});
var $author$project$View$Eltern$moneyHelp = function (value) {
	var _v0 = $author$project$Utils$Validation$validateMoney(value);
	if (_v0.$ === 'Just') {
		var message = _v0.a;
		return A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('help is-danger')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(message)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$View$Eltern$viewElternPosten = F5(
	function (postenType, model, p, index, eingabe) {
		var modelPerson = function () {
			if (p.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		var typeList = function () {
			switch (postenType.$) {
				case 'Abzugsposten':
					return modelPerson.abzugsposten;
				case 'WeitereEinkuenfte':
					return modelPerson.weitereEinkuenfte;
				default:
					return modelPerson.einkommenZumDurchschnittsberechnung;
			}
		}();
		var maxPosten = function () {
			if (postenType.$ === 'EinkommenzumDurchschnittsberechnung') {
				return 12;
			} else {
				return 5;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('entry-row')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('field has-addons entry-controls')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('control entry-cost')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$classList(
											_List_fromArray(
												[
													_Utils_Tuple2('input', true),
													_Utils_Tuple2('entry-input', true),
													_Utils_Tuple2(
													'is-danger',
													!_Utils_eq(
														$author$project$Utils$Validation$validateMoney(eingabe.kosten),
														$elm$core$Maybe$Nothing))
												])),
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$placeholder('Kosten (€)'),
											$elm$html$Html$Attributes$value(eingabe.kosten),
											$elm$html$Html$Events$onInput(
											function (newKosten) {
												return A2(
													$author$project$Types$UpdateElternDaten,
													p,
													$author$project$Types$ChangePosten(
														A3(
															$author$project$Types$UpdatePosten,
															postenType,
															index,
															_Utils_update(
																eingabe,
																{kosten: newKosten}))));
											})
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('control is-expanded entry-label')
								]),
							_List_fromArray(
								[
									function () {
									switch (postenType.$) {
										case 'WeitereEinkuenfte':
											var selectId = function () {
												if (p.$ === 'Vater') {
													return 'weitereEinkuenfteVater' + $elm$core$String$fromInt(index);
												} else {
													return 'weitereEinkuenfteMutter' + $elm$core$String$fromInt(index);
												}
											}();
											var currentBezeichnung = eingabe.bezeichnung;
											return A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('select is-fullwidth')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$select,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$attribute, 'key', selectId),
																$elm$html$Html$Attributes$id(selectId),
																$elm$html$Html$Attributes$class('input entry-input'),
																$elm$html$Html$Attributes$value(currentBezeichnung),
																$elm$html$Html$Events$onInput(
																function (newBezeichnung) {
																	return A2(
																		$author$project$Types$UpdateElternDaten,
																		p,
																		$author$project$Types$ChangePosten(
																			A3(
																				$author$project$Types$UpdatePosten,
																				postenType,
																				index,
																				_Utils_update(
																					eingabe,
																					{bezeichnung: newBezeichnung}))));
																})
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$option,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$value(' '),
																		$elm$html$Html$Attributes$selected(currentBezeichnung === ' ')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Bitte wählen')
																	])),
																A2(
																$elm$html$Html$option,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$value('Nebentätigkeit'),
																		$elm$html$Html$Attributes$selected(currentBezeichnung === 'Nebentätigkeit')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Nebentätigkeit')
																	])),
																A2(
																$elm$html$Html$option,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$value('Überstundenvergütungen'),
																		$elm$html$Html$Attributes$selected(currentBezeichnung === 'Überstundenvergütungen')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Überstundenvergütungen')
																	])),
																A2(
																$elm$html$Html$option,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$value('Sozialleistungen'),
																		$elm$html$Html$Attributes$selected(currentBezeichnung === 'Sozialleistungen')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Sozialleistungen')
																	])),
																A2(
																$elm$html$Html$option,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$value('Selbstständige Tätigkeit'),
																		$elm$html$Html$Attributes$selected(currentBezeichnung === 'Selbstständige Tätigkeit')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Selbstständige Tätigkeit')
																	])),
																A2(
																$elm$html$Html$option,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$value('1/12 Steuererstattung'),
																		$elm$html$Html$Attributes$selected(currentBezeichnung === '1/12 Steuererstattung')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('1/12 Steuererstattung')
																	])),
																A2(
																$elm$html$Html$option,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$value('Fiktives Einkommen'),
																		$elm$html$Html$Attributes$selected(currentBezeichnung === 'Fiktives Einkommen')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Fiktives Einkommen')
																	])),
																A2(
																$elm$html$Html$option,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$value('Sonstige Einkünfte'),
																		$elm$html$Html$Attributes$selected(currentBezeichnung === 'Sonstige Einkünfte')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Sonstige Einkünfte')
																	]))
															]))
													]));
										case 'Abzugsposten':
											return A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('input  entry-input'),
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$placeholder('Bezeichnung z.B. Fahrtkosten'),
														$elm$html$Html$Attributes$value(eingabe.bezeichnung),
														$elm$html$Html$Events$onInput(
														function (newBezeichnung) {
															return A2(
																$author$project$Types$UpdateElternDaten,
																p,
																$author$project$Types$ChangePosten(
																	A3(
																		$author$project$Types$UpdatePosten,
																		postenType,
																		index,
																		{bezeichnung: newBezeichnung, kosten: eingabe.kosten})));
														})
													]),
												_List_Nil);
										default:
											return A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('input  entry-input'),
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$placeholder('Bezeichnung z.B. Monat 1'),
														$elm$html$Html$Attributes$value(eingabe.bezeichnung),
														$elm$html$Html$Events$onInput(
														function (newBezeichnung) {
															return A2(
																$author$project$Types$UpdateElternDaten,
																p,
																$author$project$Types$ChangePosten(
																	A3(
																		$author$project$Types$UpdatePosten,
																		postenType,
																		index,
																		{bezeichnung: newBezeichnung, kosten: eingabe.kosten})));
														})
													]),
												_List_Nil);
									}
								}()
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('control')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									($elm$core$List$length(typeList) === 1) ? _List_fromArray(
										[
											$elm$html$Html$Attributes$class('button is-light  entry-action entry-remove'),
											$elm$html$Html$Attributes$type_('button')
										]) : _List_fromArray(
										[
											$elm$html$Html$Attributes$class('button is-primary  entry-action entry-remove'),
											$elm$html$Html$Events$onClick(
											A2(
												$author$project$Types$UpdateElternDaten,
												p,
												$author$project$Types$ChangePosten(
													A2($author$project$Types$RemovePosten, postenType, index)))),
											$elm$html$Html$Attributes$type_('button')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('-')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('control')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(
											(_Utils_cmp(
												$elm$core$List$length(typeList),
												maxPosten) > -1) ? 'button is-light entry-action entry-add' : 'button is-primary entry-action entry-add'),
											$elm$html$Html$Attributes$type_('button'),
											$elm$html$Html$Events$onClick(
											A2(
												$author$project$Types$UpdateElternDaten,
												p,
												$author$project$Types$ChangePosten(
													$author$project$Types$AddPosten(postenType))))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('+')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$View$Eltern$moneyHelp(eingabe.kosten)
						]))
				]));
	});
var $author$project$View$Eltern$viewDurchschnittseinkommen = F2(
	function (model, p) {
		var modelPerson = function () {
			if (p.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		var hasInvalidEinkommen = A2(
			$elm$core$List$any,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.kosten;
				},
				A2(
					$elm$core$Basics$composeR,
					$author$project$Utils$Validation$validateMoney,
					$elm$core$Basics$neq($elm$core$Maybe$Nothing))),
			modelPerson.einkommenZumDurchschnittsberechnung);
		var einkommenWerte = A2(
			$elm$core$List$filterMap,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.kosten;
				},
				$author$project$Utils$Format$formatInputToFloat),
			modelPerson.einkommenZumDurchschnittsberechnung);
		var durchschnitt = $elm$core$List$isEmpty(einkommenWerte) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
			$elm$core$List$sum(einkommenWerte) / $elm$core$List$length(einkommenWerte));
		return model.durchschnittseinkommen ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('field'),
					A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('box'),
							A2($elm$html$Html$Attributes$style, 'padding', '0.75rem')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Einkommen zum Durchschnittsberechnung')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('control')
								]),
							A2(
								$elm$core$List$indexedMap,
								A3($author$project$View$Eltern$viewElternPosten, $author$project$Types$EinkommenzumDurchschnittsberechnung, model, p),
								modelPerson.einkommenZumDurchschnittsberechnung)),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('help')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Durchschnitt: ' + (A2(
										$elm$core$Maybe$withDefault,
										'0,00',
										A2($elm$core$Maybe$map, $author$project$Utils$Format$formatEuroRounded, durchschnitt)) + ' €'))
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('button is-primary'),
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$disabled(
									_Utils_eq(durchschnitt, $elm$core$Maybe$Nothing) || hasInvalidEinkommen),
									$elm$html$Html$Events$onClick(
									A2($author$project$Types$UpdateElternDaten, p, $author$project$Types$ApplyDurchschnittseinkommen))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Fertig')
								]))
						]))
				])) : $elm$html$Html$text('');
	});
var $author$project$Types$UpdateHaupttaetigkeit = function (a) {
	return {$: 'UpdateHaupttaetigkeit', a: a};
};
var $author$project$View$Eltern$viewEinkommenMonat = F3(
	function (model, textLabel, p) {
		var modelPerson = function () {
			if (p.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('field'),
					A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(textLabel + ' (€) '),
							$author$project$View$Components$showTooltip('Monatliches Nettoeinkommen aus der Haupttätigkeit (z.B. Gehalt, Lohn)')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('input', true),
											_Utils_Tuple2(
											'is-danger',
											!_Utils_eq(
												$author$project$Utils$Validation$validateMoney(modelPerson.haupttaetigkeit),
												$elm$core$Maybe$Nothing))
										])),
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder('z.B. 5000'),
									$elm$html$Html$Attributes$value(modelPerson.haupttaetigkeit),
									$elm$html$Html$Events$onInput(
									function (val) {
										return A2(
											$author$project$Types$UpdateElternDaten,
											p,
											$author$project$Types$UpdateHaupttaetigkeit(val));
									})
								]),
							_List_Nil),
							$author$project$View$Eltern$moneyHelp(modelPerson.haupttaetigkeit)
						]))
				]));
	});
var $author$project$Types$ToggleSelbstbehaltOptions = function (a) {
	return {$: 'ToggleSelbstbehaltOptions', a: a};
};
var $author$project$Types$UpdateSelbstbehalt = function (a) {
	return {$: 'UpdateSelbstbehalt', a: a};
};
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $author$project$Utils$Format$selbstbehaltToString = function (typ) {
	switch (typ.$) {
		case 'Angemessen':
			return 'Angemessen';
		case 'NotwendigNichtErwerbstaetig':
			return 'Notwendig (nicht erwerbstätig)';
		case 'NotwendigErwerbstaetig':
			return 'Notwendig';
		default:
			return 'Benutzerdefiniert';
	}
};
var $author$project$View$Eltern$selbstbehaltTypEqual = F2(
	function (a, b) {
		var _v0 = _Utils_Tuple2(a, b);
		_v0$4:
		while (true) {
			switch (_v0.a.$) {
				case 'Angemessen':
					if (_v0.b.$ === 'Angemessen') {
						return true;
					} else {
						break _v0$4;
					}
				case 'NotwendigErwerbstaetig':
					if (_v0.b.$ === 'NotwendigErwerbstaetig') {
						return true;
					} else {
						break _v0$4;
					}
				case 'NotwendigNichtErwerbstaetig':
					if (_v0.b.$ === 'NotwendigNichtErwerbstaetig') {
						return true;
					} else {
						break _v0$4;
					}
				default:
					if (_v0.b.$ === 'Benutzerdefiniert') {
						return true;
					} else {
						break _v0$4;
					}
			}
		}
		return false;
	});
var $author$project$View$Eltern$viewSelbstbehalt = F2(
	function (model, person) {
		var modelPerson = function () {
			if (person.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		var selbstbehalt = modelPerson.selbstbehalt;
		var typText = function () {
			switch (selbstbehalt.$) {
				case 'Angemessen':
					return 'der angemessene Selbstbehalt';
				case 'NotwendigNichtErwerbstaetig':
					return 'der notwendige Selbstbehalt für nicht erwerbstätige Personen';
				case 'NotwendigErwerbstaetig':
					return 'der notwendige Selbstbehalt für erwerbstätige Personen';
				default:
					return 'ein benutzerdefinierter Selbstbehalt';
			}
		}();
		var jahr = model.jahr;
		var elternText = function () {
			if (person.$ === 'Vater') {
				return 'Kindsvater';
			} else {
				return 'Kindsmutter';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('box mt-5'),
					A2($elm$html$Html$Attributes$style, 'background-color', 'rgba(105, 166, 180, 0.3)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('content')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('is-size-6'),
									A2($elm$html$Html$Attributes$style, 'color', '#1b3a57')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Für den ' + (elternText + (' wird ' + (typText + (' von ' + ($author$project$Utils$Format$renderSelbstbehaltBetrag(selbstbehalt) + (' € berücksichtigt. (Jahr: ' + (jahr + ') ')))))))),
									$author$project$View$Components$showTooltip('Der Selbstbehalt ist der Betrag, der dem unterhaltspflichtigen Elternteil mindestens verbleiben muss, um seinen eigenen Lebensunterhalt zu sichern.')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('field')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('control')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('button'),
											$elm$html$Html$Attributes$class('button is-primary is-small'),
											$elm$html$Html$Events$onClick(
											$author$project$Types$ToggleView(
												$author$project$Types$ToggleSelbstbehaltOptions(person)))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Ändern')
										]))
								]))
						])),
					function () {
					if (modelPerson.showSelbstbehaltOptions) {
						var radioName = function () {
							if (person.$ === 'Vater') {
								return 'selbstbehaltVater';
							} else {
								return 'selbstbehaltMutter';
							}
						}();
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('field mt-4')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('control')
										]),
									_Utils_ap(
										A2(
											$elm$core$List$map,
											function (typOption) {
												return A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('field')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('control')
																]),
															_List_fromArray(
																[
																	A2(
																	$author$project$View$Eltern$selbstbehaltTypEqual,
																	typOption,
																	$author$project$Types$NotwendigErwerbstaetig('0')) ? A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('is-flex is-align-items-center')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$label,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('radio mr-4')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$input,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$type_('radio'),
																							$elm$html$Html$Attributes$name(radioName),
																							$elm$html$Html$Attributes$checked(
																							A2($author$project$View$Eltern$selbstbehaltTypEqual, typOption, selbstbehalt) || (A2(
																								$author$project$View$Eltern$selbstbehaltTypEqual,
																								typOption,
																								$author$project$Types$NotwendigErwerbstaetig('0')) && A2(
																								$author$project$View$Eltern$selbstbehaltTypEqual,
																								selbstbehalt,
																								$author$project$Types$NotwendigNichtErwerbstaetig('0')))),
																							$elm$html$Html$Events$onClick(
																							A2(
																								$author$project$Types$UpdateElternDaten,
																								person,
																								$author$project$Types$UpdateSelbstbehalt(typOption)))
																						]),
																					_List_Nil),
																					$elm$html$Html$text(
																					' ' + $author$project$Utils$Format$selbstbehaltToString(typOption))
																				])),
																			(A2(
																			$author$project$View$Eltern$selbstbehaltTypEqual,
																			modelPerson.selbstbehalt,
																			$author$project$Types$NotwendigErwerbstaetig('0')) || A2(
																			$author$project$View$Eltern$selbstbehaltTypEqual,
																			modelPerson.selbstbehalt,
																			$author$project$Types$NotwendigNichtErwerbstaetig('0'))) ? A2(
																			$elm$html$Html$label,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('checkbox')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$input,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$type_('checkbox'),
																							$elm$html$Html$Attributes$checked(
																							A2(
																								$author$project$View$Eltern$selbstbehaltTypEqual,
																								modelPerson.selbstbehalt,
																								$author$project$Types$NotwendigNichtErwerbstaetig('0'))),
																							$elm$html$Html$Events$onClick(
																							A2(
																								$author$project$View$Eltern$selbstbehaltTypEqual,
																								modelPerson.selbstbehalt,
																								$author$project$Types$NotwendigNichtErwerbstaetig('0')) ? A2(
																								$author$project$Types$UpdateElternDaten,
																								person,
																								$author$project$Types$UpdateSelbstbehalt(
																									$author$project$Types$NotwendigErwerbstaetig(
																										A2($author$project$Constants$getSelbstbehalt, jahr, 'Notwendig')))) : A2(
																								$author$project$Types$UpdateElternDaten,
																								person,
																								$author$project$Types$UpdateSelbstbehalt(
																									$author$project$Types$NotwendigNichtErwerbstaetig(
																										A2($author$project$Constants$getSelbstbehalt, jahr, 'Notwendig (nicht erwerbstätig)')))))
																						]),
																					_List_Nil),
																					$elm$html$Html$text(' Nicht Erwerbstätig')
																				])) : $elm$html$Html$text('')
																		])) : A2(
																	$elm$html$Html$label,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('radio')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$type_('radio'),
																					$elm$html$Html$Attributes$name(radioName),
																					$elm$html$Html$Attributes$checked(
																					A2($author$project$View$Eltern$selbstbehaltTypEqual, typOption, selbstbehalt) || (A2(
																						$author$project$View$Eltern$selbstbehaltTypEqual,
																						typOption,
																						$author$project$Types$NotwendigErwerbstaetig('0')) && A2(
																						$author$project$View$Eltern$selbstbehaltTypEqual,
																						selbstbehalt,
																						$author$project$Types$NotwendigNichtErwerbstaetig('0')))),
																					$elm$html$Html$Events$onClick(
																					A2(
																						$author$project$Types$UpdateElternDaten,
																						person,
																						$author$project$Types$UpdateSelbstbehalt(typOption)))
																				]),
																			_List_Nil),
																			$elm$html$Html$text(
																			' ' + $author$project$Utils$Format$selbstbehaltToString(typOption))
																		]))
																]))
														]));
											},
											_List_fromArray(
												[
													$author$project$Types$Angemessen('0'),
													$author$project$Types$NotwendigErwerbstaetig('0'),
													$author$project$Types$Benutzerdefiniert('0')
												])),
										A2(
											$author$project$View$Eltern$selbstbehaltTypEqual,
											modelPerson.selbstbehalt,
											$author$project$Types$Benutzerdefiniert('0')) ? _List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field mt-3')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('control')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$input,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$type_('text'),
																		$elm$html$Html$Attributes$classList(
																		_List_fromArray(
																			[
																				_Utils_Tuple2('input', true),
																				_Utils_Tuple2(
																				'is-danger',
																				!_Utils_eq(
																					$author$project$Utils$Validation$validateMoney(
																						$author$project$Utils$Format$renderSelbstbehaltBetrag(modelPerson.selbstbehalt)),
																					$elm$core$Maybe$Nothing))
																			])),
																		$elm$html$Html$Attributes$placeholder('Betrag in €'),
																		$elm$html$Html$Attributes$value(
																		$author$project$Utils$Format$renderSelbstbehaltBetrag(modelPerson.selbstbehalt)),
																		$elm$html$Html$Events$onInput(
																		function (val) {
																			return A2(
																				$author$project$Types$UpdateElternDaten,
																				person,
																				$author$project$Types$UpdateSelbstbehalt(
																					$author$project$Types$Benutzerdefiniert(val)));
																		})
																	]),
																_List_Nil),
																$author$project$View$Eltern$moneyHelp(
																$author$project$Utils$Format$renderSelbstbehaltBetrag(modelPerson.selbstbehalt))
															]))
													]))
											]) : _List_Nil))
								]));
					} else {
						return $elm$html$Html$text('');
					}
				}()
				]));
	});
var $author$project$Types$WeitereEinkuenfte = {$: 'WeitereEinkuenfte'};
var $author$project$View$Eltern$viewWeitereEinkuenfte = F2(
	function (model, p) {
		var modelPerson = function () {
			if (p.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('field')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Weitere Einkünfte (€) '),
							$author$project$View$Components$showTooltip('Hierzu gehören z.B. Mieteinnahmen, Kapitalerträge, Steuererstattungen (1/12 je Monat), Elterngeld, etc. ' + 'Auch der Wohnvorteil durch mietfreies Wohnen im eigenen Heim ist hier zu berücksichtigen.')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					A2(
						$elm$core$List$indexedMap,
						A3($author$project$View$Eltern$viewElternPosten, $author$project$Types$WeitereEinkuenfte, model, p),
						modelPerson.weitereEinkuenfte))
				]));
	});
var $author$project$View$Eltern$viewEltern = F2(
	function (model, p) {
		var modelPerson = function () {
			if (p.$ === 'Vater') {
				return model.vater;
			} else {
				return model.mutter;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column is-half')
								]),
							_List_fromArray(
								[
									function () {
									var _v0 = model.durchschnittseinkommen;
									if (_v0) {
										return A2(
											$elm$html$Html$div,
											_List_Nil,
											_List_fromArray(
												[
													A3($author$project$View$Eltern$viewEinkommenMonat, model, 'Durchschnittliches Einkommen', p),
													A2($author$project$View$Eltern$viewDurchschnittseinkommen, model, p)
												]));
									} else {
										return A2(
											$elm$html$Html$div,
											_List_Nil,
											_List_fromArray(
												[
													A3($author$project$View$Eltern$viewEinkommenMonat, model, 'Haupttätigkeit', p),
													A2($author$project$View$Eltern$viewWeitereEinkuenfte, model, p)
												]));
									}
								}()
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column is-half')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('field'),
											A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$label,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('label')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Abzugsposten '),
													$author$project$View$Components$showTooltip('Zu den Abzügen vom Nettoeinkommen gehören Schulden (soweit berücksichtigungsfähig) und Belastungen, insb. Altersvorsorge-Leistungen, berufsbedingte Fahrtkosten, etc.).' + ' Üblicherweise werden 5 % des Nettoeinkommens als pauschale berufsbedingte Aufwendungen abgezogen, soweit höhere Kosten nicht konkret nachgewiesen sind.')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('control')
												]),
											A2(
												$elm$core$List$indexedMap,
												A3($author$project$View$Eltern$viewElternPosten, $author$project$Types$Abzugsposten, model, p),
												modelPerson.abzugsposten))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('field')
						]),
					_List_fromArray(
						[
							A2($author$project$View$Eltern$viewSelbstbehalt, model, p)
						]))
				]));
	});
var $author$project$Types$ErbrachteLeistungen = {$: 'ErbrachteLeistungen'};
var $author$project$Types$Mehrbedarf = {$: 'Mehrbedarf'};
var $author$project$Types$Sonderbedarf = {$: 'Sonderbedarf'};
var $author$project$Types$ToggleCustomRegelbedarf = {$: 'ToggleCustomRegelbedarf'};
var $author$project$Types$UpdateAlter = function (a) {
	return {$: 'UpdateAlter', a: a};
};
var $author$project$Types$UpdateKindDaten = function (a) {
	return {$: 'UpdateKindDaten', a: a};
};
var $author$project$Types$UpdateKindergeldEmpfaenger = function (a) {
	return {$: 'UpdateKindergeldEmpfaenger', a: a};
};
var $author$project$Types$AddBedarf = function (a) {
	return {$: 'AddBedarf', a: a};
};
var $author$project$Types$ChangeBedarf = function (a) {
	return {$: 'ChangeBedarf', a: a};
};
var $author$project$Types$RemoveBedarf = F2(
	function (a, b) {
		return {$: 'RemoveBedarf', a: a, b: b};
	});
var $author$project$Types$UpdateBedarf = F3(
	function (a, b, c) {
		return {$: 'UpdateBedarf', a: a, b: b, c: c};
	});
var $author$project$View$Kind$moneyHelp = function (value) {
	var _v0 = $author$project$Utils$Validation$validateMoney(value);
	if (_v0.$ === 'Just') {
		var message = _v0.a;
		return A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('help is-danger')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(message)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$View$Kind$viewBedarf = F4(
	function (bedarfsTyp, model, index, eingabe) {
		var radioName = function () {
			switch (bedarfsTyp.$) {
				case 'Mehrbedarf':
					return 'mehrbedarfBezahltVon' + $elm$core$String$fromInt(index);
				case 'Sonderbedarf':
					return 'sonderbedarfBezahltVon' + $elm$core$String$fromInt(index);
				default:
					return 'erbrachteLeistungenBezahltVon' + $elm$core$String$fromInt(index);
			}
		}();
		var modelPerson = model.kind;
		var typeList = function () {
			switch (bedarfsTyp.$) {
				case 'Mehrbedarf':
					return modelPerson.mehrbedarf;
				case 'Sonderbedarf':
					return modelPerson.sonderbedarf;
				default:
					return modelPerson.erbrachteLeistungen;
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('field has-addons entry-row'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control entry-cost'),
							A2($elm$html$Html$Attributes$style, 'width', '20%')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('input', true),
											_Utils_Tuple2('entry-input', true),
											_Utils_Tuple2(
											'is-danger',
											!_Utils_eq(
												$author$project$Utils$Validation$validateMoney(eingabe.kosten),
												$elm$core$Maybe$Nothing))
										])),
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder('Kosten (€)'),
									$elm$html$Html$Attributes$value(eingabe.kosten),
									$elm$html$Html$Events$onInput(
									function (newKosten) {
										return $author$project$Types$UpdateKindDaten(
											$author$project$Types$ChangeBedarf(
												A3(
													$author$project$Types$UpdateBedarf,
													bedarfsTyp,
													index,
													_Utils_update(
														eingabe,
														{kosten: newKosten}))));
									})
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control entry-label'),
							A2($elm$html$Html$Attributes$style, 'width', '23%')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input entry-input'),
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder('Bezeichnung z.B. Musikschule'),
									$elm$html$Html$Attributes$value(eingabe.bezeichnung),
									$elm$html$Html$Events$onInput(
									function (newBezeichnung) {
										return $author$project$Types$UpdateKindDaten(
											$author$project$Types$ChangeBedarf(
												A3(
													$author$project$Types$UpdateBedarf,
													bedarfsTyp,
													index,
													_Utils_update(
														eingabe,
														{bezeichnung: newBezeichnung}))));
									})
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							($elm$core$List$length(typeList) === 1) ? _List_fromArray(
								[
									$elm$html$Html$Attributes$class('button is-light entry-action entry-remove'),
									$elm$html$Html$Attributes$type_('button')
								]) : _List_fromArray(
								[
									$elm$html$Html$Attributes$class('button is-primary entry-action entry-remove'),
									$elm$html$Html$Events$onClick(
									$author$project$Types$UpdateKindDaten(
										$author$project$Types$ChangeBedarf(
											A2($author$project$Types$RemoveBedarf, bedarfsTyp, index)))),
									$elm$html$Html$Attributes$type_('button')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('-')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									($elm$core$List$length(typeList) >= 5) ? 'button is-light entry-action entry-add' : 'button is-primary entry-action entry-add'),
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Events$onClick(
									$author$project$Types$UpdateKindDaten(
										$author$project$Types$ChangeBedarf(
											$author$project$Types$AddBedarf(bedarfsTyp))))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('+')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control'),
							A2($elm$html$Html$Attributes$style, 'margin-left', '1.5rem'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'gap', '1rem')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'gap', '1rem')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('has-text-weight-light'),
											A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Bereits bezahlt von:')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('field is-grouped')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('field is-narrow')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('control')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('buttons has-addons is-flex-wrap-wrap')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$label,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('button'),
																			$elm$html$Html$Attributes$classList(
																			_List_fromArray(
																				[
																					_Utils_Tuple2(
																					'is-primary is-selected',
																					_Utils_eq(
																						eingabe.bezahltVon,
																						$elm$core$Maybe$Just($author$project$Types$Vater))),
																					_Utils_Tuple2(
																					'is-light',
																					!_Utils_eq(
																						eingabe.bezahltVon,
																						$elm$core$Maybe$Just($author$project$Types$Vater)))
																				])),
																			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
																			A2($elm$html$Html$Attributes$style, 'margin-bottom', '0'),
																			A2(
																			$elm$html$Html$Attributes$style,
																			'border-bottom',
																			_Utils_eq(
																				eingabe.bezahltVon,
																				$elm$core$Maybe$Just($author$project$Types$Vater)) ? '3px solid rgb(67, 67, 67)' : '3px solid transparent'),
																			$elm$html$Html$Events$onClick(
																			$author$project$Types$UpdateKindDaten(
																				$author$project$Types$ChangeBedarf(
																					A3(
																						$author$project$Types$UpdateBedarf,
																						bedarfsTyp,
																						index,
																						_Utils_update(
																							eingabe,
																							{
																								bezahltVon: $elm$core$Maybe$Just($author$project$Types$Vater)
																							})))))
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$type_('radio'),
																					$elm$html$Html$Attributes$name(radioName),
																					$elm$html$Html$Attributes$value('Vater'),
																					$elm$html$Html$Attributes$checked(
																					_Utils_eq(
																						eingabe.bezahltVon,
																						$elm$core$Maybe$Just($author$project$Types$Vater))),
																					A2($elm$html$Html$Attributes$style, 'display', 'none')
																				]),
																			_List_Nil),
																			$elm$html$Html$text('Vater')
																		])),
																	A2(
																	$elm$html$Html$label,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('button'),
																			$elm$html$Html$Attributes$classList(
																			_List_fromArray(
																				[
																					_Utils_Tuple2(
																					'is-primary is-selected',
																					_Utils_eq(
																						eingabe.bezahltVon,
																						$elm$core$Maybe$Just($author$project$Types$Mutter))),
																					_Utils_Tuple2(
																					'is-light',
																					!_Utils_eq(
																						eingabe.bezahltVon,
																						$elm$core$Maybe$Just($author$project$Types$Mutter)))
																				])),
																			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
																			A2($elm$html$Html$Attributes$style, 'margin-bottom', '0'),
																			A2(
																			$elm$html$Html$Attributes$style,
																			'border-bottom',
																			_Utils_eq(
																				eingabe.bezahltVon,
																				$elm$core$Maybe$Just($author$project$Types$Mutter)) ? '3px solid rgb(67, 67, 67)' : '3px solid transparent'),
																			$elm$html$Html$Events$onClick(
																			$author$project$Types$UpdateKindDaten(
																				$author$project$Types$ChangeBedarf(
																					A3(
																						$author$project$Types$UpdateBedarf,
																						bedarfsTyp,
																						index,
																						_Utils_update(
																							eingabe,
																							{
																								bezahltVon: $elm$core$Maybe$Just($author$project$Types$Mutter)
																							})))))
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$type_('radio'),
																					$elm$html$Html$Attributes$name(radioName),
																					$elm$html$Html$Attributes$value('Mutter'),
																					$elm$html$Html$Attributes$checked(
																					_Utils_eq(
																						eingabe.bezahltVon,
																						$elm$core$Maybe$Just($author$project$Types$Mutter))),
																					A2($elm$html$Html$Attributes$style, 'display', 'none')
																				]),
																			_List_Nil),
																			$elm$html$Html$text('Mutter')
																		])),
																	A2(
																	$elm$html$Html$label,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('button'),
																			$elm$html$Html$Attributes$classList(
																			_List_fromArray(
																				[
																					_Utils_Tuple2(
																					'is-primary is-selected',
																					_Utils_eq(eingabe.bezahltVon, $elm$core$Maybe$Nothing)),
																					_Utils_Tuple2(
																					'is-light',
																					!_Utils_eq(eingabe.bezahltVon, $elm$core$Maybe$Nothing))
																				])),
																			A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
																			A2($elm$html$Html$Attributes$style, 'margin-bottom', '0'),
																			A2(
																			$elm$html$Html$Attributes$style,
																			'border-bottom',
																			_Utils_eq(eingabe.bezahltVon, $elm$core$Maybe$Nothing) ? '3px solid rgb(67, 67, 67)' : '3px solid transparent'),
																			$elm$html$Html$Events$onClick(
																			$author$project$Types$UpdateKindDaten(
																				$author$project$Types$ChangeBedarf(
																					A3(
																						$author$project$Types$UpdateBedarf,
																						bedarfsTyp,
																						index,
																						_Utils_update(
																							eingabe,
																							{bezahltVon: $elm$core$Maybe$Nothing})))))
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$type_('radio'),
																					$elm$html$Html$Attributes$name(radioName),
																					$elm$html$Html$Attributes$value('Nicht angegeben'),
																					$elm$html$Html$Attributes$checked(
																					_Utils_eq(eingabe.bezahltVon, $elm$core$Maybe$Nothing)),
																					A2($elm$html$Html$Attributes$style, 'display', 'none')
																				]),
																			_List_Nil),
																			$elm$html$Html$text('Wurde noch nicht bezahlt')
																		]))
																]))
														]))
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'flex-basis', '100%')
						]),
					_List_fromArray(
						[
							$author$project$View$Kind$moneyHelp(eingabe.kosten)
						]))
				]));
	});
var $author$project$Types$UpdateRegelbedarf = function (a) {
	return {$: 'UpdateRegelbedarf', a: a};
};
var $author$project$View$Kind$requiredMoneyHelp = function (value) {
	var _v0 = $author$project$Utils$Validation$validateRequiredMoney(value);
	if (_v0.$ === 'Just') {
		var message = _v0.a;
		return A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('help is-danger')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(message)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$View$Kind$viewIndividuelleRegelbedarf = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('field'),
				A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('label')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Individueller Regelbedarf für das Kind (€) ')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('control'),
						A2($elm$html$Html$Attributes$style, 'width', '50%')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('input', true),
										_Utils_Tuple2('is-fullwidth', true),
										_Utils_Tuple2(
										'is-danger',
										!_Utils_eq(
											$author$project$Utils$Validation$validateRequiredMoney(model.kind.regelbedarf),
											$elm$core$Maybe$Nothing))
									])),
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('z.B. 1500'),
								$elm$html$Html$Attributes$value(model.kind.regelbedarf),
								$elm$html$Html$Events$onInput(
								function (val) {
									return $author$project$Types$UpdateKindDaten(
										$author$project$Types$UpdateRegelbedarf(val));
								})
							]),
						_List_Nil),
						$author$project$View$Kind$requiredMoneyHelp(model.kind.regelbedarf)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', 'red'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '0.5rem')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Bitte nutzen Sie diese Funktion nur, wenn Sie einen ausnahmsweisen Sonderfall haben!')
					]))
			]));
};
var $author$project$Types$AddEinkuenfte = {$: 'AddEinkuenfte'};
var $author$project$Types$RemoveEinkuenfte = function (a) {
	return {$: 'RemoveEinkuenfte', a: a};
};
var $author$project$Types$UpdateEinkuenfte = F2(
	function (a, b) {
		return {$: 'UpdateEinkuenfte', a: a, b: b};
	});
var $author$project$View$Kind$viewKindEinkuenfte = F3(
	function (model, index, eingabe) {
		var modelPerson = model.kind;
		var typeList = modelPerson.einkuenfte;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('field has-addons entry-row'),
					A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control entry-cost'),
							A2($elm$html$Html$Attributes$style, 'width', '20%')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('input', true),
											_Utils_Tuple2('entry-input', true),
											_Utils_Tuple2(
											'is-danger',
											!_Utils_eq(
												$author$project$Utils$Validation$validateMoney(eingabe.kosten),
												$elm$core$Maybe$Nothing))
										])),
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder('Kosten (€)'),
									$elm$html$Html$Attributes$value(eingabe.kosten),
									$elm$html$Html$Events$onInput(
									function (newKosten) {
										return $author$project$Types$UpdateKindDaten(
											A2(
												$author$project$Types$UpdateEinkuenfte,
												index,
												_Utils_update(
													eingabe,
													{kosten: newKosten})));
									})
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control entry-label'),
							A2($elm$html$Html$Attributes$style, 'width', '23%')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input entry-input'),
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder('Bezeichnung'),
									$elm$html$Html$Attributes$value(eingabe.bezeichnung),
									$elm$html$Html$Events$onInput(
									function (newBezeichnung) {
										return $author$project$Types$UpdateKindDaten(
											A2(
												$author$project$Types$UpdateEinkuenfte,
												index,
												{bezeichnung: newBezeichnung, kosten: eingabe.kosten}));
									})
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							($elm$core$List$length(typeList) === 1) ? _List_fromArray(
								[
									$elm$html$Html$Attributes$class('button is-light entry-action entry-remove'),
									$elm$html$Html$Attributes$type_('button')
								]) : _List_fromArray(
								[
									$elm$html$Html$Attributes$class('button is-primary entry-action entry-remove'),
									$elm$html$Html$Events$onClick(
									$author$project$Types$UpdateKindDaten(
										$author$project$Types$RemoveEinkuenfte(index))),
									$elm$html$Html$Attributes$type_('button')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('-')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									($elm$core$List$length(typeList) >= 5) ? 'button is-light entry-action entry-add' : 'button is-primary entry-action entry-add'),
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Events$onClick(
									$author$project$Types$UpdateKindDaten($author$project$Types$AddEinkuenfte))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('+')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'flex-basis', '100%')
						]),
					_List_fromArray(
						[
							$author$project$View$Kind$moneyHelp(eingabe.kosten)
						]))
				]));
	});
var $author$project$View$Kind$viewKind = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('content')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('field'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Alter / Geburtsdatum des Kindes* '),
										$author$project$View$Components$showTooltip('Geben Sie hier entweder das Alter des Kindes in Jahren zum Zeitpunkt der Berechnung oder das Geburtsdatum im Format TT.MM.JJJJ ein.')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('control'),
										A2($elm$html$Html$Attributes$style, 'width', '50%')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$classList(
												_List_fromArray(
													[
														_Utils_Tuple2('input', true),
														_Utils_Tuple2('entry-input', true),
														_Utils_Tuple2(
														'is-danger',
														!_Utils_eq(
															$author$project$Utils$Validation$validateAgeOrBirthday(model.kind.alterInput),
															$elm$core$Maybe$Nothing))
													])),
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$placeholder('z.B. 5 oder 12.12.2000'),
												$elm$html$Html$Attributes$value(model.kind.alterInput),
												$elm$html$Html$Events$onInput(
												function (val) {
													return $author$project$Types$UpdateKindDaten(
														$author$project$Types$UpdateAlter(val));
												})
											]),
										_List_Nil),
										function () {
										var _v0 = $author$project$Utils$Validation$validateAgeOrBirthday(model.kind.alterInput);
										if (_v0.$ === 'Just') {
											var error = _v0.a;
											return A2(
												$elm$html$Html$p,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('help is-danger')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(error)
													]));
										} else {
											return $elm$html$Html$text('');
										}
									}()
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Kindergeld Empfänger '),
								$author$project$View$Components$showTooltip('Elternteil, der das Kindergeld für das Kind erhält')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control'),
								A2($elm$html$Html$Attributes$style, 'width', '50%')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('select is-fullwidth')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												$elm$html$Html$Events$onInput(
												function (val) {
													return $author$project$Types$Update(
														$author$project$Types$UpdateKindergeldEmpfaenger(
															$author$project$Utils$Format$stringToPerson(val)));
												})
											]),
										A2(
											$elm$core$List$map,
											function (person) {
												return A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$value(
															$author$project$Utils$Format$personToString(person)),
															$elm$html$Html$Attributes$selected(
															_Utils_eq(person, model.kindergeldEmpfaenger))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															$author$project$Utils$Format$personToString(person))
														]));
											},
											_List_fromArray(
												[$author$project$Types$Vater, $author$project$Types$Mutter])))
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Kind Einkünfte (€) '),
								$author$project$View$Components$showTooltip('Hierzu gehören zum Beispiel Ausbildungsgeld oder BAföG-Zahlungen, allerdings sind eigene Einkünfte des Kindes nur soweit anzusetzen, wie es unter Berücksichtigung der wirtschaftlichen Verhältnisse der Billigkeit entspricht. Daher sind z.B. taschengeld-erhöhende Schülerjob-Zahlungen nicht anzusetzen und bei weiteren Einkünften ggfl. nicht der vollständige Betrag.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control')
							]),
						A2(
							$elm$core$List$indexedMap,
							$author$project$View$Kind$viewKindEinkuenfte(model),
							model.kind.einkuenfte))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '1.5rem')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Kind Mehrbedarf (€) '),
								$author$project$View$Components$showTooltip('Monatlicher Mehrbedarf des Kindes (z.B. für besondere Ausgaben wie Nachhilfe, medizinische Kosten)')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control')
							]),
						A2(
							$elm$core$List$indexedMap,
							A2($author$project$View$Kind$viewBedarf, $author$project$Types$Mehrbedarf, model),
							model.kind.mehrbedarf))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Kind Sonderbedarf (€) '),
								$author$project$View$Components$showTooltip('Einmaliger Sonderbedarf des Kindes (z.B. für größere Anschaffungen oder besondere Ereignisse)')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control')
							]),
						A2(
							$elm$core$List$indexedMap,
							A2($author$project$View$Kind$viewBedarf, $author$project$Types$Sonderbedarf, model),
							model.kind.sonderbedarf))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Weitere bereits erbrachte Leistungen der Eltern (€) '),
								$author$project$View$Components$showTooltip('Weitere bereits erbrachte Leistungen der Eltern (z.B. Kleidung, Essensgeld (Kita, Schule))')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control')
							]),
						A2(
							$elm$core$List$indexedMap,
							A2($author$project$View$Kind$viewBedarf, $author$project$Types$ErbrachteLeistungen, model),
							model.kind.erbrachteLeistungen))
					])),
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('checkbox label')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('checkbox'),
								$elm$html$Html$Attributes$checked(model.customRegelbedarf),
								$elm$html$Html$Events$onClick(
								$author$project$Types$ToggleView($author$project$Types$ToggleCustomRegelbedarf)),
								A2($elm$html$Html$Attributes$style, 'transform', 'scale(1.75)'),
								A2($elm$html$Html$Attributes$style, 'margin-right', '0.5rem'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '0.5rem')
							]),
						_List_Nil),
						$elm$html$Html$text('   Stattdessen individuellen Regelbedarf festsetzen'),
						$author$project$View$Components$showTooltip('Der ASGLA-Rechner setzt automatisch den Regelbedarf nach der Düsseldorfer Tabelle an.\n\nDa die Tabelle nur ein Nettoeinkommen bis 11.200 EUR berücksichtigt, müssen Eltern mit einem höheren Nettoeinkommen einen individuellen Bedarf ansetzen, der die Tabelle denklogisch unter Berücksichtigung des jeweiligen Einzelfalles fortsetzt.\n\nZudem wird nach den Leitlinien des OLG Naumburg in Sachsen-Anhalt kein Bedarfskontrollbetrag angewendet. Für Eltern in deren OLG-Bezirk der Bedarfskontrollbetrag angewendet wird, kann dieser durch Ansetzen eines individuellen Regelbedarfs berücksichtigt werden.')
					])),
				model.customRegelbedarf ? $author$project$View$Kind$viewIndividuelleRegelbedarf(model) : $elm$html$Html$text('')
			]));
};
var $author$project$View$Layout$tabContent = F2(
	function (tab, model) {
		var content = function () {
			switch (tab.$) {
				case 'Left':
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'padding', '1.5rem')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('title is-5')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Vater - Einkünfte und Abzüge')
									])),
								A2($author$project$View$Eltern$viewEltern, model, $author$project$Types$Vater)
							]));
				case 'Middle':
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'padding', '1.5rem')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('title is-5')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Mutter - Einkünfte und Abzüge')
									])),
								A2($author$project$View$Eltern$viewEltern, model, $author$project$Types$Mutter)
							]));
				default:
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'padding', '1.5rem')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('title is-5')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Bedarf Kind')
									])),
								$author$project$View$Kind$viewKind(model)
							]));
			}
		}();
		var bgColor = function () {
			var _v0 = model.activeTab;
			switch (_v0.$) {
				case 'Left':
					return 'rgba(9, 170, 195, 0.5)';
				case 'Middle':
					return 'rgba(249, 163, 116, 0.5)';
				default:
					return 'rgba(187, 221, 193, 0.5)';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background-color', bgColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '0 0 8px 8px'),
					A2($elm$html$Html$Attributes$style, 'overflow', 'visible'),
					A2($elm$html$Html$Attributes$style, 'color', 'black')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('p-4')
						]),
					_List_fromArray(
						[content]))
				]));
	});
var $author$project$Types$Select = function (a) {
	return {$: 'Select', a: a};
};
var $author$project$View$Layout$tabItem = F4(
	function (tab, label, icon, active) {
		var textColor = _Utils_eq(tab, active) ? 'white' : 'black';
		var tabColor = function () {
			switch (tab.$) {
				case 'Left':
					return '#69a6b4';
				case 'Middle':
					return '#f9a374';
				default:
					return '#bbddc1';
			}
		}();
		var liStyles = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', tabColor),
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px 8px 0 0'),
				A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
			]);
		return A2(
			$elm$html$Html$li,
			_Utils_ap(
				liStyles,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Types$ToggleView(
							$author$project$Types$Select(tab)))
					])),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', textColor)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('icon')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$i,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(icon),
											A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(label)
								]))
						]))
				]));
	});
var $author$project$View$Layout$viewTabs = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('tabs-mobile'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '0')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('tabs m-0')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$ul,
								_List_Nil,
								_List_fromArray(
									[
										A4($author$project$View$Layout$tabItem, $author$project$Types$Left, 'Einkünfte Vater', 'fas fa-user', model.activeTab),
										A4($author$project$View$Layout$tabItem, $author$project$Types$Middle, 'Einkünfte Mutter', 'fas fa-user', model.activeTab),
										A4($author$project$View$Layout$tabItem, $author$project$Types$Right, 'Bedarf Kind', 'fas fa-child', model.activeTab)
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('tabs-desktop')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('tabs is-fullwidth m-0')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$ul,
								_List_Nil,
								_List_fromArray(
									[
										A4($author$project$View$Layout$tabItem, $author$project$Types$Left, 'Einkünfte Vater', 'fas fa-user', model.activeTab),
										A4($author$project$View$Layout$tabItem, $author$project$Types$Middle, 'Einkünfte Mutter', 'fas fa-user', model.activeTab),
										A4($author$project$View$Layout$tabItem, $author$project$Types$Right, 'Bedarf Kind', 'fas fa-child', model.activeTab)
									]))
							]))
					])),
				A2($author$project$View$Layout$tabContent, model.activeTab, model)
			]));
};
var $author$project$Types$UpdateJahr = function (a) {
	return {$: 'UpdateJahr', a: a};
};
var $author$project$View$Components$jahre = _List_fromArray(
	['2023', '2024', '2025', '2026']);
var $author$project$View$Components$viewYear = F2(
	function (columnClass, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(columnClass)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Jahr * '),
							$author$project$View$Components$showTooltip('Wählen Sie das Jahr aus, für das die Berechnung durchgeführt werden soll.')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('control')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('select is-fullwidth')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$select,
									_List_fromArray(
										[
											$elm$html$Html$Events$onInput(
											A2($elm$core$Basics$composeL, $author$project$Types$Update, $author$project$Types$UpdateJahr)),
											$elm$html$Html$Attributes$value(model.jahr)
										]),
									A2(
										$elm$core$List$map,
										function (j) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(j)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(j)
													]));
										},
										$author$project$View$Components$jahre))
								]))
						]))
				]));
	});
var $author$project$View$Layout$viewForm = function (model) {
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin-top', '2rem')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('columns')
					]),
				model.durchschnittseinkommen ? _List_fromArray(
					[
						A2($author$project$View$Components$viewYear, 'column is-12', model)
					]) : _List_fromArray(
					[
						A2($author$project$View$Components$viewMonth, 'column is-half', model),
						A2($author$project$View$Components$viewYear, 'column is-half', model)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('columns')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('column is-half')
							]),
						_List_fromArray(
							[
								$author$project$View$Components$viewCheckboxDurchschnittseinkommen(model)
							]))
					])),
				$author$project$View$Layout$viewTabs(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('label'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '2rem')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Zusätzliche Informationen')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$textarea,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('textarea'),
										$elm$html$Html$Attributes$placeholder('Geben Sie hier zusätzliche Informationen oder Anmerkungen ein...'),
										$elm$html$Html$Events$onInput(
										A2($elm$core$Basics$composeL, $author$project$Types$Update, $author$project$Types$UpdateFreitext)),
										$elm$html$Html$Attributes$value(model.freitext)
									]),
								_List_Nil)
							]))
					])),
				model.modalExportOpen ? $author$project$View$Components$saveModal(model) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field')
					]),
				_List_fromArray(
					[
						(model.durchschnittseinkommen && $author$project$View$Layout$hasStufensprungAlterAmJahresende(model)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('notification is-warning is-light')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Hinweis: Das Kind ist zum 31.12. des zu berechnenden Jahres 6, 12 oder 18 Jahre alt. Dies bedeutet, im laufenden Jahr liegt ein Stufensprung in der Düsseldorfer Tabelle vor. Aufgrund dessen sind 2 Berechnungen vorzunehmen!')
							])) : $elm$html$Html$text(''),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('is-flex is-justify-content-space-between is-align-items-center'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '1rem')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('buttons')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('control')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('button is-primary calculate-button'),
														$elm$html$Html$Attributes$type_('button'),
														$elm$html$Html$Events$onClick(
														$author$project$Types$ToggleView($author$project$Types$ViewErgebnis))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Berechnen')
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('control')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('button is-primary'),
														$elm$html$Html$Attributes$type_('button'),
														$elm$html$Html$Events$onClick(
														$author$project$Types$ToggleView($author$project$Types$ToggleSaveModal))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Eingabe Zwischenspeichern')
													]))
											]))
									]))
							]))
					]))
			]));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$View$Layout$viewHeader = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('box mb-5')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('is-hidden-tablet')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns is-mobile is-vcentered')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/JTCLogo_klein.png'),
											$elm$html$Html$Attributes$alt('JTC Logo'),
											A2($elm$html$Html$Attributes$style, 'max-height', '50px')
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('has-text-right')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$img,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$src('assets/MLULogo_klein.png'),
													$elm$html$Html$Attributes$alt('MLU Logo'),
													A2($elm$html$Html$Attributes$style, 'max-height', '25px')
												]),
											_List_Nil)
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns is-mobile has-text-right'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '-3rem')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('has-text-right'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.8rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Finanziert von der Europäischen Union 🇪🇺')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns is-mobile is-vcentered')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column is-8')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('title is-4 mb-3')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('ASGLA-Rechner')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('has-text-right'),
											A2($elm$html$Html$Attributes$style, 'margin-top', '0rem')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$img,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$src('assets/vignette.png'),
													$elm$html$Html$Attributes$alt('ASGLA-Rechner'),
													A2($elm$html$Html$Attributes$style, 'max-height', '120px')
												]),
											_List_Nil)
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns is-mobile')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '-2rem')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('subtitle is-6 mb-3')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Zur Berechnung des Ausgleichsanspruchs für den Unterhalt im Wechselmodell')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns is-mobile')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '-2rem')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('button jtc-primary mt-2'),
											$elm$html$Html$Attributes$href('https://jtc.uni-halle.de/asgla-rechner/'),
											$elm$html$Html$Attributes$target('_blank'),
											$elm$html$Html$Attributes$rel('noopener noreferrer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Mehr Informationen')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('has-text-centered')
						]),
					_List_Nil)
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('is-hidden-mobile')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns is-vcentered'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '1rem')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column ')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/JTCLogo.png'),
											$elm$html$Html$Attributes$alt('JTC Logo'),
											A2($elm$html$Html$Attributes$style, 'max-height', '100px')
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('has-text-right')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.5rem')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$img,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$src('assets/MLULogo.png'),
															$elm$html$Html$Attributes$alt('MLU Logo'),
															A2($elm$html$Html$Attributes$style, 'max-height', '35px')
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '0.9rem')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Finanziert von der Europäischen Union 🇪🇺')
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('columns is-vcentered'),
							A2($elm$html$Html$Attributes$style, 'padding', '1rem')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('title is-3 mb-4')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('ASGLA-Rechner')
										])),
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('subtitle is-5 mb-3')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Zur Berechnung des Ausgleichsanspruchs für den Unterhalt im Wechselmodell')
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('button jtc-primary mt-3'),
											$elm$html$Html$Attributes$href('https://jtc.uni-halle.de/asgla-rechner/'),
											$elm$html$Html$Attributes$target('_blank'),
											$elm$html$Html$Attributes$rel('noopener noreferrer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Mehr Informationen')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column is-narrow')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src('assets/vignette.png'),
											$elm$html$Html$Attributes$alt('Illustration'),
											A2($elm$html$Html$Attributes$style, 'max-height', '200px')
										]),
									_List_Nil)
								]))
						]))
				]))
		]));
var $author$project$Main$view = function (model) {
	return {
		body: _List_fromArray(
			[
				A2(
				$elm$html$Html$section,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('section  is-hidden-mobile'),
						A2($elm$html$Html$Attributes$style, 'background-image', 'url(\'assets/background.png\')'),
						A2($elm$html$Html$Attributes$style, 'background-size', 'cover'),
						A2($elm$html$Html$Attributes$style, 'background-repeat', 'no-repeat'),
						A2($elm$html$Html$Attributes$style, 'background-position', 'center'),
						A2($elm$html$Html$Attributes$style, 'background-attachment', 'fixed'),
						A2($elm$html$Html$Attributes$style, 'position', 'relative'),
						A2($elm$html$Html$Attributes$style, 'background-color', 'rgba(255, 255, 255)'),
						A2($elm$html$Html$Attributes$style, 'min-height', '100vh'),
						A2($elm$html$Html$Attributes$style, 'padding', '2rem')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'top', '0'),
								A2($elm$html$Html$Attributes$style, 'left', '0'),
								A2($elm$html$Html$Attributes$style, 'right', '0'),
								A2($elm$html$Html$Attributes$style, 'bottom', '0'),
								A2($elm$html$Html$Attributes$style, 'background-color', 'rgba(0, 0, 0, 0.4)'),
								A2($elm$html$Html$Attributes$style, 'z-index', '1')
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('container'),
								A2($elm$html$Html$Attributes$style, 'position', 'relative'),
								A2($elm$html$Html$Attributes$style, 'z-index', '2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('box'),
										A2($elm$html$Html$Attributes$style, 'background-color', ' rgb(254, 234, 210)'),
										A2($elm$html$Html$Attributes$style, 'padding', '1.5rem'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '1.5rem'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '18px')
									]),
								_List_fromArray(
									[
										$author$project$View$Layout$viewHeader,
										$author$project$View$Components$ueberUnsSection(model),
										$author$project$View$Components$importFileSection(model),
										$author$project$View$Layout$viewForm(model),
										function () {
										var _v0 = model.error;
										if (_v0.$ === 'Just') {
											var msg = _v0.a;
											return A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('notification is-danger '),
														A2($elm$html$Html$Attributes$style, 'margin-top', '1rem')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(msg)
													]));
										} else {
											return $elm$html$Html$text('');
										}
									}(),
										model.showErgebnis ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('box'),
												A2($elm$html$Html$Attributes$style, 'margin', '1rem')
											]),
										_List_fromArray(
											[
												$author$project$View$Components$showErgebnis(model)
											])) : $elm$html$Html$text('')
									]))
							]))
					])),
				A2(
				$elm$html$Html$section,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('section is-hidden-tablet'),
						A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(254, 234, 210)'),
						A2($elm$html$Html$Attributes$style, 'min-height', '100vh'),
						A2($elm$html$Html$Attributes$style, 'padding', '0.5rem')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('container')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('box'),
										A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(254, 234, 210)'),
										A2($elm$html$Html$Attributes$style, 'padding', '0.75rem'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.75rem'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '12px')
									]),
								_List_fromArray(
									[
										$author$project$View$Layout$viewHeader,
										$author$project$View$Components$ueberUnsSection(model),
										$author$project$View$Components$importFileSection(model),
										$author$project$View$Layout$viewForm(model),
										function () {
										var _v1 = model.error;
										if (_v1.$ === 'Just') {
											var msg = _v1.a;
											return A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('notification is-danger'),
														A2($elm$html$Html$Attributes$style, 'margin-top', '1rem')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(msg)
													]));
										} else {
											return $elm$html$Html$text('');
										}
									}(),
										model.showErgebnis ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('box'),
												A2($elm$html$Html$Attributes$style, 'margin', '1rem')
											]),
										_List_fromArray(
											[
												$author$project$View$Components$showErgebnis(model)
											])) : $elm$html$Html$text('')
									]))
							]))
					])),
				$author$project$View$Components$cameraScanner(model),
				$author$project$View$Layout$viewFooter
			]),
		title: 'ASGLA-Rechner'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));