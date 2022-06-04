const CracoLinariaPlugin = require("craco-linaria");
const { getLoader, loaderByName, throwUnexpectedConfigError } = require("@craco/craco");
const { cosmiconfigSync } = require("cosmiconfig");
const path = require("path");

function overrideWebpackConfig({ context, pluginOptions, webpackConfig }) {
  const throwError = (message, githubIssueQuery) =>
    throwUnexpectedConfigError({
      packageName: "craco-linaria",
      githubRepo: "jedmao/craco-linaria",
      message,
      githubIssueQuery,
    });

  if (!webpackConfig.module) {
    throwError(`Can't find 'module' key in the ${context.env} webpack config!`, "webpack+module");
  }

  const { isFound, match: babelLoaderMatch } = getLoader(webpackConfig, loaderByName("babel-loader"));

  // console.log(babelLoaderMatch);

  if (!isFound) {
    throwError(`Can't find babel-loader in the ${context.env} webpack config!`, "webpack+babel-loader");
  }

  const oneOfRules = webpackConfig.module.rules.find((rule) => rule.oneOf);
  if (!oneOfRules) {
    throwError(
      `Can't find 'oneOf' rules under module.rules in the ${context.env} webpack config!`,
      "webpack+rules+oneOf"
    );
  }

  // oneOfRules.oneOf[1] = transformBabelLoader(babelLoaderMatch.loader, pluginOptions);
  oneOfRules.oneOf.unshift(transformBabelLoader(babelLoaderMatch.loader, pluginOptions));

  // console.log(oneOfRules.oneOf[1].rules);

  return webpackConfig;
}

function transformBabelLoader(loader, pluginOptions) {
  const options = loader.options || {};
  const presets = options.presets || [];
  options.presets = presets;
  const { babelOptions, ...linariaOptions } = pluginOptions || (cosmiconfigSync("linaria").search() || {}).config || {};

  // console.log(path.resolve(__dirname, "src"));
  console.log({ ...options });
  // console.log(...babelOptions);
  // console.log(...linariaOptions);

  // console.log(
  //   JSON.stringify(
  //     {
  //       test: loader.test,
  //       include: loader.include,
  //       rules: [
  //         {
  //           loader: loader.loader,
  //           options: {
  //             ...options,
  //             presets: presets.concat("linaria/babel"),
  //           },
  //         },
  //         {
  //           loader: "linaria/loader",
  //           options: {
  //             cacheDirectory: "src/.linaria_cache",
  //             sourceMap: process.env.NODE_ENV !== "production",
  //             babelOptions: {
  //               presets,
  //               ...babelOptions,
  //             },
  //             ...linariaOptions,
  //           },
  //         },
  //       ],
  //     },
  //     null,
  //     2
  //   )
  // );

  return {
    test: loader.test,
    include: loader.include,
    rules: [
      {
        loader: loader.loader,
        options: {
          ...options,
          presets: presets.concat("linaria/babel"),
        },
      },
      {
        loader: "linaria/loader",
        options: {
          cacheDirectory: "src/.linaria_cache",
          sourceMap: process.env.NODE_ENV !== "production",
          babelOptions: {
            presets,
            ...babelOptions,
          },
          ...linariaOptions,
        },
      },
    ],
  };
}

module.exports = {
  plugins: [
    {
      plugin: { overrideWebpackConfig: overrideWebpackConfig },
    },
  ],
};
