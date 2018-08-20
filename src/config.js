System.config({
  transpiler: 'typescript',
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  map: {
    app: "./src",
    
    '@angular/core': 'npm:@angular/core@5.0.0/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common@5.0.0/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler@5.0.0/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser@5.0.0/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@5.0.0/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http@5.0.0/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router@5.0.0/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms@5.0.0/bundles/forms.umd.js',
    
    '@angular/core/testing': 'npm:@angular/core@5.0.0/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common/bundles@5.0.0/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler@5.0.0/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser@5.0.0/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic@5.0.0/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http@5.0.0/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router@5.0.0/bundles/router-testing.umd.js',
    
    'rxjs': 'npm:rxjs',
    
    '@agm/core': 'npm:@agm/core/core.umd.js'
  },
  //packages defines our app package
  packages: {
    app: {
      main: './app/main.ts',
      defaultExtension: 'ts'
    },
    rxjs: {
      defaultExtension: 'js'
    }
  },
  paths: {
    'npm:': 'https://unpkg.com/'
  }
});