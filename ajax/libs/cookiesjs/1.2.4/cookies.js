var cookies = function (data, opt) {
  function defaults (obj, defs) {
    obj = obj || {};
    for (var key in defs) {
      if (obj[key] === undefined) {
        obj[key] = defs[key];
      }
    }
    return obj;
  }

  defaults(cookies, {
    expires: 365 * 24 * 3600,
    path: '/',
    secure: window.location.protocol === 'https:',

    // Advanced
    nulltoremove: true,
    autojson: true,
    autoencode: true,
    encode: function (val) {
      return encodeURIComponent(val);
    },
    decode: function (val) {
      return decodeURIComponent(val);
    }
  });

  opt = defaults(opt, cookies);

  function expires (time) {
    var expires = time;
    if (!(expires instanceof Date)) {
      expires = new Date();
      expires.setTime(expires.getTime() + (time * 1000));
    }
    return expires.toUTCString();
  }

  if (typeof data === 'string') {
    var value = document.cookie.split(/;\s*/)
      .map(opt.autoencode ? opt.decode : function (d) { return d; })
      .map(function (part) { return part.split('='); })
      .reduce(function (parts, part) {
        parts[part[0]] = part[1];
        return parts;
      }, {})[data];
    if (!opt.autojson) return value;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  // Set each of the cookies
  for (var key in data) {
    var expired = data[key] === undefined || (opt.nulltoremove && data[key] === null);
    var str = opt.autojson ? JSON.stringify(data[key]) : data[key];
    var encoded = opt.autoencode ? opt.encode(str) : str;
    if (expired) encoded = '';
    var res = opt.encode(key) + '=' + encoded +
      (opt.expires ? (';expires=' + expires(expired ? -10000 : opt.expires)) : '') +
      ';path=' + opt.path +
      (opt.domain ? (';domain=' + opt.domain) : '') +
      (opt.secure ? ';secure' : '');
    if (opt.test) opt.test(res);
    document.cookie = res;
  }
  return cookies;
};

(function webpackUniversalModuleDefinition (root) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = cookies;
  } else if (typeof define === 'function' && define.amd) {
    define('cookies', [], cookies);
  } else if (typeof exports === 'object') {
    exports['cookies'] = cookies;
  } else {
    root['cookies'] = cookies;
  }
})(this);
