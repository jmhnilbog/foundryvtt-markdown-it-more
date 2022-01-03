import * as path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import SymlinkWebpackPlugin from 'symlink-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import globImporter from 'sass-glob-importer';

import glob from 'glob';


const allTemplates = () => {
    return glob
        .sync('**/*.html', { cwd: path.join(__dirname, 'static/templates') })
        .map((file) => `"modules/template/templates/${file}"`)
        .join(', ');
};

const configuration = (env: any) => {
    const defaults = {
        watch: false,
        mode: 'development',
    };

    const environment = { ...defaults, ...env };
    const isDevelopment = environment.mode === 'development';

    const config = {
        entry: './src/index.ts',
        watch: environment.watch,
        devtool: 'inline-source-map',
        stats: 'minimal',
        mode: environment.mode,
        resolve: {
            extensions: ['.wasm', '.mjs', '.ts', '.js', '.json'],
        },
        output: {
            filename: 'module.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '',
        },
        devServer: {
            hot: true,
            devMiddleware: {
                writeToDisk: true,
            },
            proxy: [
                {
                    context: (pathname: string) => {
                        return !pathname.match('^/sockjs');
                    },
                    target: 'http://localhost:30000',
                    ws: true,
                },
            ],
        },
        module: {
            rules: [
                isDevelopment
                    ? { test: /\.html$/, loader: 'raw-loader' }
                    : { test: /\.html$/, loader: 'null-loader' },
                {
                    test: /\.ts$/,
                    use: [
                        'ts-loader',
                        'webpack-import-glob-loader',
                        'source-map-loader',
                        {
                            loader: 'string-replace-loader',
                            options: {
                                search: '"__ALL_TEMPLATES__"',
                                replace: allTemplates,
                            },
                        },
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader || 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isDevelopment,
                                url: false,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment,
                                sassOptions: {
                                    // includePaths: require('bourbon').includePaths,
                                    importer: globImporter(),
                                },
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ESLintPlugin({
                extensions: ['ts'],
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: 'static',
                        noErrorOnMissing: true,
                    },
                ],
            }),
            new SymlinkWebpackPlugin([
                { origin: '../packs', symlink: 'packs', force: true },
            ]),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: 'styles/[name].css',
                chunkFilename: 'styles/[id].css',
            }),
        ],
    };

    if (!isDevelopment) {
        config.devtool = "";
    }

    return config;
};

export default configuration;