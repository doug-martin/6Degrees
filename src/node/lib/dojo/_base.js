/**
 * Based on implementation from dojoToolkit.org.
 */

var d = exports;

d.global = global;

d._extraNames = (extraNames = ["hasOwnProperty", "valueOf", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "constructor"]);
extraLen = extraNames.length;

d._mixin = function(/*Object*/ target, /*Object*/ source) {
    // summary:
    //		Adds all properties and methods of source to target. This addition
    //		is "prototype extension safe", so that instances of objects
    //		will not pass along prototype defaults.
    var name, s, i;
    for (name in source) {
        s = source[name];
        if (!(name in target) || (target[name] !== s)) {
            target[name] = s;
        }
    }
    return target; // Object
}

d.mixin = function(/*Object*/obj, /*Object...*/props) {
    if (!obj) {
        obj = {};
    }
    for (var i = 1, l = arguments.length; i < l; i++) {
        d._mixin(obj, arguments[i]);
    }
    return obj; // Object
}

d._getProp = function(/*Array*/parts, /*Boolean*/create, /*Object*/context) {
    var obj = context || d.global;
    for (var i = 0, p; obj && (p = parts[i]); i++) {       
        obj = (p in obj ? obj[p] : (create ? obj[p] = {} : undefined));
    }
    return obj; // mixed
}

d.setObject = function(/*String*/name, /*Object*/value, /*Object?*/context) {
    var parts = name.split("."), p = parts.pop(), obj = d._getProp(parts, true, context);
    return obj && p ? (obj[p] = value) : undefined; // Object
}

d.getObject = function(/*String*/name, /*Boolean?*/create, /*Object?*/context) {
    return d._getProp(name.split("."), create, context); // Object
}

d.exists = function(/*String*/name, /*Object?*/obj) {
    return !!d.getObject(name, false, obj); // Boolean
}

d["eval"] = function(/*String*/ scriptFragment) {
    //	summary:
    //		A legacy method created for use exclusively by internal Dojo methods. Do not use
    //		this method directly, the behavior of this eval will differ from the normal
    //		browser eval.
    //	description:
    //		Placed in a separate function to minimize size of trapped
    //		exceptions. Calling eval() directly from some other scope may
    //		complicate tracebacks on some platforms.
    //	returns:
    //		The result of the evaluation. Often `undefined`
    return d.global.eval ? d.global.eval(scriptFragment) : eval(scriptFragment); 	// Object
}
