import * as path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import SymlinkWebpackPlugin from 'symlink-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import globImporter from 'sass-glob-importer';
import { BannerPlugin } from 'webpack';

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
                    {
                        from: 'module.json'
                    }
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
            new BannerPlugin({
                banner: `# License information

    This work uses the following libraries with their licenses attached.
    
    # [EasyMDE](https://github.com/Ionaru/easy-markdown-editor)
    
    ## The MIT License (MIT)
    
    Copyright (c) 2015 Sparksuite, Inc.
    Copyright (c) 2017 Jeroen Akkerman.
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    © 2020 GitHub, Inc.
    
    # [Markdown-It](https://github.com/markdown-it/markdown-it)  
    
    ## The MIT License (MIT)
    
    Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
    
    # [Codemirror](https://codemirror.net/)
    
    ## The MIT License (MIT)
    
    MIT License
    
    Copyright (C) 2017 by Marijn Haverbeke <marijnh@gmail.com> and others
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    
    # [markdown-it-container](https://github.com/markdown-it/markdown-it-container)
    
    ## The MIT License (MIT)
    
    Copyright (c) 2015 Vitaly Puzrin, Alex Kocharin.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.`
            })
        ],
    };

    if (!isDevelopment) {
        config.devtool = "";
    }

    return config;
};

export default configuration;