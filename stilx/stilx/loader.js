"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = loader;

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _enhancedResolve = _interopRequireDefault(require("enhanced-resolve"));

var EvalCache = _interopRequireWildcard(require("./babel/eval-cache"));

var _module = _interopRequireDefault(require("./babel/module"));

var _logger = require("./babel/utils/logger");

var _transform = _interopRequireDefault(require("./transform"));

var _cache = require("./cache");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function () {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * This file contains a Webpack loader for Linaria.
 * It uses the transform.ts function to generate class names from source code,
 * returns transformed code without template literals and attaches generated source maps
 */
const outputCssLoader = require.resolve("./outputCssLoader");

function loader(content, inputSourceMap) {
  var _this$_compilation, _result$sourceMap2;

  // tell Webpack this loader is async
  this.async();
  (0, _logger.debug)("loader", this.resourcePath);
  EvalCache.clearForFile(this.resourcePath);
  const {
    sourceMap = undefined,
    preprocessor = undefined,
    extension = ".linaria.css",
    cacheProvider,
    ...rest
  } = _loaderUtils.default.getOptions(this) || {};
  const outputFilename = this.resourcePath.replace(/\.[^.]+$/, extension);
  const resolveOptions = {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  };

  const resolveSync = _enhancedResolve.default.create.sync(
    // this._compilation is a deprecated API
    // However there seems to be no other way to access webpack's resolver
    // There is this.resolve, but it's asynchronous
    // Another option is to read the webpack.config.js, but it won't work for programmatic usage
    // This API is used by many loaders/plugins, so hope we're safe for a while
    (
      (_this$_compilation = this._compilation) === null || _this$_compilation === void 0
        ? void 0
        : _this$_compilation.options.resolve
    )
      ? {
          ...resolveOptions,
          alias: this._compilation.options.resolve.alias,
          modules: this._compilation.options.resolve.modules,
        }
      : resolveOptions
  );

  let result;
  const originalResolveFilename = _module.default._resolveFilename;

  try {
    // Use webpack's resolution when evaluating modules
    _module.default._resolveFilename = (id, { filename }) => {
      const result = resolveSync(_path.default.dirname(filename), id);
      this.addDependency(result);
      return result;
    };

    result = (0, _transform.default)(content, {
      filename: _path.default.relative(process.cwd(), this.resourcePath),
      inputSourceMap: inputSourceMap !== null && inputSourceMap !== void 0 ? inputSourceMap : undefined,
      pluginOptions: rest,
      preprocessor,
    });
  } finally {
    // Restore original behaviour
    _module.default._resolveFilename = originalResolveFilename;
  }

  if (result.cssText) {
    var _result$dependencies;

    let { cssText } = result;

    if (sourceMap) {
      cssText += `/*# sourceMappingURL=data:application/json;base64,${Buffer.from(
        result.cssSourceMapText || ""
      ).toString("base64")}*/`;
    }

    if (
      (_result$dependencies = result.dependencies) === null || _result$dependencies === void 0
        ? void 0
        : _result$dependencies.length
    ) {
      result.dependencies.forEach((dep) => {
        try {
          const f = resolveSync(_path.default.dirname(this.resourcePath), dep);
          this.addDependency(f);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`[linaria] failed to add dependency for: ${dep}`, e);
        }
      });
    }

    (0, _cache.getCacheInstance)(cacheProvider)
      .then((cacheInstance) => cacheInstance.set(this.resourcePath, cssText))
      .then(() => {
        var _result$sourceMap;

        const request = `${outputFilename}!=!${outputCssLoader}?cacheProvider=${encodeURIComponent(
          cacheProvider !== null && cacheProvider !== void 0 ? cacheProvider : ""
        )}!${this.resourcePath}`;

        const stringifiedRequest = _loaderUtils.default.stringifyRequest(this, request);

        return this.callback(
          null,
          `${result.code}\n\nrequire(${stringifiedRequest});`,
          (_result$sourceMap = result.sourceMap) !== null && _result$sourceMap !== void 0
            ? _result$sourceMap
            : undefined
        );
      })
      .catch((err) => this.callback(err));
    return;
  }

  this.callback(
    null,
    result.code,
    (_result$sourceMap2 = result.sourceMap) !== null && _result$sourceMap2 !== void 0 ? _result$sourceMap2 : undefined
  );
}
//# sourceMappingURL=loader.js.map
