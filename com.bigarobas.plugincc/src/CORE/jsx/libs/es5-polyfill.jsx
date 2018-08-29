// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Référence : http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
  
      var k;
  
      // 1. Soit O le résultat de l'appel à ToObject avec
      //    this en argument.
      if (this == null) {
        throw new TypeError('"this" vaut null ou n est pas défini');
      }
  
      var O = Object(this);
  
      // 2. Soit lenValue le résultat de l'appel de la
      //    méthode interne Get de O avec l'argument
      //    "length".
      // 3. Soit len le résultat de ToUint32(lenValue).
      var len = O.length >>> 0;
  
      // 4. Si len vaut 0, on renvoie -1.
      if (len === 0) {
        return -1;
      }
  
      // 5. Si l'argument fromIndex a été utilisé, soit
      //    n le résultat de ToInteger(fromIndex)
      //    0 sinon
      var n = +fromIndex || 0;
  
      if (Math.abs(n) === Infinity) {
        n = 0;
      }
  
      // 6. Si n >= len, on renvoie -1.
      if (n >= len) {
        return -1;
      }
  
      // 7. Si n >= 0, soit k égal à n.
      // 8. Sinon, si n<0, soit k égal à len - abs(n).
      //    Si k est inférieur à 0, on ramène k égal à 0.
      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
  
      // 9. On répète tant que k < len
      while (k < len) {
        // a. Soit Pk égal à ToString(k).
        //    Ceci est implicite pour l'opérande gauche de in
        // b. Soit kPresent le résultat de l'appel de la
        //    méthode interne HasProperty de O avec Pk en
        //    argument. Cette étape peut être combinée avec
        //    l'étape c
        // c. Si kPresent vaut true, alors
        //    i.  soit elementK le résultat de l'appel de la
        //        méthode interne Get de O avec ToString(k) en
        //        argument
        //   ii.  Soit same le résultat de l'application de
        //        l'algorithme d'égalité stricte entre
        //        searchElement et elementK.
        //  iii.  Si same vaut true, on renvoie k.
        if (k in O && O[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  }

  
  // Production steps of ECMA-262, Edition 5, 15.4.4.15
// Reference: http://es5.github.io/#x15.4.4.15
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
      'use strict';
  
      if (this === void 0 || this === null) {
        throw new TypeError();
      }
  
      var n, k,
        t = Object(this),
        len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
  
      n = len - 1;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {
          n = 0;
        }
        else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
  
      for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }