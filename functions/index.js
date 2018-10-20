module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/api.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// The entry point for the Express based API.\n\nconst express = __webpack_require__(/*! express */ \"express\");\nconst cors = __webpack_require__(/*! cors */ \"cors\");\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nconst login = __webpack_require__(/*! ./routes/login.js */ \"./src/routes/login.js\");\nconst admin = __webpack_require__(/*! ./routes/admin.js */ \"./src/routes/admin.js\");\nconst functions = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\n\n// exports.helloWorld = functions.https.onRequest((request, response) => {\n//  response.send(\"Hello from Firebase!\");\n// });\n\nconst app = express();\n\n// Automatically allow cross-origin requests (as suggested by firebase docs)\napp.use(cors({ origin: true }));\n\n// parse body as json\napp.use(\n  bodyParser.urlencoded({\n    extended: true\n  })\n);\napp.use(bodyParser.json());\n\napp.use(\"/login\", login);\napp.use(\"/admin\", admin);\n\n// module.exports = app;\nexports.api = functions.https.onRequest(app);\n\n//# sourceURL=webpack:///./src/api.js?");

/***/ }),

/***/ "./src/middlewares/authMiddleware.js":
/*!*******************************************!*\
  !*** ./src/middlewares/authMiddleware.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// A basic middleware function to verify json web tokens.\n\nconst functions = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\nmodule.exports = (req, res, next) => {\n  const jwt_secret = functions.config().auth.secret;\n  const token = req.body.token;\n\n  if (!token)\n    return res.status(401).send({ auth: false, message: \"No token provided\" });\n\n  return jwt.verify(token, jwt_secret, err => {\n    if (err) return res.status(200).send({ message: \"There was a problem\" });\n\n    return next();\n  });\n};\n\n\n//# sourceURL=webpack:///./src/middlewares/authMiddleware.js?");

/***/ }),

/***/ "./src/routes/admin.js":
/*!*****************************!*\
  !*** ./src/routes/admin.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Admin API end-points for your dashboard front-end.\n// ============================================================\n//\n// Create your API end-points here.\n\nconst express = __webpack_require__(/*! express */ \"express\");\nconst admin = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\nconst authMiddleware = __webpack_require__(/*! ../middlewares/authMiddleware.js */ \"./src/middlewares/authMiddleware.js\");\n\nconst router = express.Router();\nadmin.initializeApp();\n\n// this will restrict the access of admin routes to only authenticated clients\nrouter.use(authMiddleware);\n\nrouter.get(\"/\", (req, res) =>\n  res.status(200).send({\n    message: \"Welcome to the dashboard\"\n  })\n);\n\nrouter.post(\"/\", (req, res) => {\n  return res.status(200).send({\n    message: req.body.value\n      ? `Response from server: ${req.body.value}`\n      : \"Welcome to the dashboard via POST\"\n  });\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack:///./src/routes/admin.js?");

/***/ }),

/***/ "./src/routes/login.js":
/*!*****************************!*\
  !*** ./src/routes/login.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// This router provides login related functionality to the app.\n// ============================================================\n//\n// Edit this file to customize your authentication flow.\n\nconst express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst functions = __webpack_require__(/*! firebase-functions */ \"firebase-functions\");\nconst bcrypt = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\nrouter.get(\"/\", (req, res) => {\n  return res.status(200).send({ message: \"Not allowed\" });\n});\n\n// This method accepts username and passwords and returns a valid JWT if the\n// user credential matches to one set in Firebase environment.\n//\n// Note: The users who can authenticate using the following method are the ones\n// which are exported into the Firebase environment using `firebase config:set`\nrouter.post(\"/\", (req, res) => {\n  // Check if 'user' and 'password' fields are present in the request\n  if (!req.body.user) {\n    return res.status(200).send({ message: \"Bad request\" });\n  }\n  if (!req.body.password) {\n    return res.status(200).send({ message: \"Bad request\" });\n  }\n\n  const user = req.body.user;\n  const pass = functions.config().users[req.body.user]; // generated from bcrypt.hashSync(plaintextpassword, 8)\n  const jwt_secret = functions.config().auth.secret;\n\n  // If password is not found for the provided user, it means it is not a valid\n  // admin user hence return an error\n  if (!pass) {\n    return res.status(200).send({ message: \"No such user\" });\n  }\n\n  // if (user !== req.body.user)\n  //   return res.status(200).send({ message: \"Username or password incorrect\" });\n  // if (!req.body.password)\n  //   return res.status(200).send({ message: \"Password missing\" });\n\n  const passValid = bcrypt.compareSync(req.body.password, pass);\n  if (!passValid)\n    return res.status(200).send({\n      auth: false,\n      message: \"Username or password incorrect\"\n    });\n\n  const token = jwt.sign({ id: user }, jwt_secret, {\n    expiresIn: 86400 // expires in 24 hours\n  });\n\n  return res.status(200).send({\n    auth: true,\n    token: token\n  });\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack:///./src/routes/login.js?");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcryptjs\");\n\n//# sourceURL=webpack:///external_%22bcryptjs%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "firebase-admin":
/*!*********************************!*\
  !*** external "firebase-admin" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-admin\");\n\n//# sourceURL=webpack:///external_%22firebase-admin%22?");

/***/ }),

/***/ "firebase-functions":
/*!*************************************!*\
  !*** external "firebase-functions" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-functions\");\n\n//# sourceURL=webpack:///external_%22firebase-functions%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ })

/******/ });