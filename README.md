# hisptz touch - dashboard

##Prerequisites
  Make sure you have the following installed
  
  1. npm
  2. ionic
  3. cordova
  4. Emulator (android studio etc.) or android phone for testing
  
## Installation

  1.  `npm install`
  
  2. Run this script to install cordova plugins to access phone resources
    
     `sh installPlugins.sh`
     
  3. Start the emulator or open an app from the phone when connected in debug mode by running
  
    `ionic run android`
    
## troubleshoots
  In case you encounter error "bundle failed: 'ChartModule' is not exported by node_modules/angular2-highcharts/index.js" on build app, 
     
  Edit "node_modules/@ionic/app-scripts/config/rollup.config.js"
  
      
      replace commonjs(),  
      
  with 
  
      commonjs({
            namedExports: { 'node_modules/angular2-highcharts/index.js':['ChartModule']}
          }),
      

