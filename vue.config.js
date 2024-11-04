const path = require('path'); // path 모듈 불러오기
const Dotenv = require('dotenv-webpack');
const glob = require('glob-all');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    port: 8081, // 또는 원하는 포트 번호
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/')
      },
      fallback: {
        "process": require.resolve("process/browser")
      }
    },
    optimization: {
      minimize: true, // 코드 최소화
      splitChunks: {
        chunks: 'all', // 코드 스플리팅
      },
    },
    plugins: [
      new PurgeCSSPlugin({
        paths: glob.sync([
          path.join(__dirname, './src/**/*.vue'),
          path.join(__dirname, './public/index.html'),
        ]),
        safelist: {
          standard: ['body', 'html'], // PurgeCSS에서 안전하게 유지할 클래스들
          deep: [/splide/, /splide__/],
        },
      }),
      new Dotenv(), // .env 파일 로드를 위한 설정 추가
    ],
  },
  // Vue 컴파일러 설정
  // Vue 3에서 productionMode 설정 추가
  chainWebpack: (config) => {
    // 기존 vue-loader 설정
    config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          options.compilerOptions = {
            productionMode: true,
            ...(options.compilerOptions || {}),
          };
          return options;
        });

    // Splide CSS를 위한 규칙
    config.module
        .rule('splide-css')
        .test(/\.css$/)
        .include
        .add(/node_modules\/@splidejs/)
        .end()
        .use('vue-style-loader')
        .loader('vue-style-loader')
        .end()
        .use('css-loader')
        .loader('css-loader')
        .options({
          sourceMap: process.env.NODE_ENV !== 'production'
        })
        .end();
  },
  css: {
    // dev/prod 모두에서 CSS 추출
    extract: process.env.NODE_ENV === 'production',
    sourceMap: process.env.NODE_ENV !== 'production',
    loaderOptions: {
      css: {
        importLoaders: 1
      }
    }
  }
});