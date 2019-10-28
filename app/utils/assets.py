from flask_assets import Bundle

CSS = '../frontend/css'
JS = '../frontend/js'
NODE = '../frontend/node_modules'

bundles = {
    'main_css': Bundle(f'{CSS}/LiveChart.css',
                       f'{CSS}/live.css',
                       f'{CSS}/main.css',
                       f'{CSS}/media_queries.css',
                       f'{NODE}/bulma/css/bulma.min.css',
                       f'{NODE}/bulma-switch/dist/css/bulma-switch.min.css',
                       f'{NODE}/chart.js/dist/Chart.min.css',
                       filters='cssmin', output='gen/packed.css'),
    'main_js': Bundle(f'{NODE}/chart.js/dist/Chart.bundle.min.js',
                      f'{NODE}/deepmerge/dist/umd.js',
                      f'{JS}/main.js',
                      f'{JS}/modals.js',
                      f'{JS}/live.js',
                      f'{JS}/charts/chart_globals.js',
                      f'{JS}/charts/LiveChart.js',
                      f'{JS}/charts/LiveChart_T.js',
                      f'{JS}/charts/LiveChart_RH.js',
                      f'{JS}/charts/LiveChart_Rain.js',
                      f'{JS}/charts/LiveChart_Rain_RH.js',
                      f'{JS}/charts/LiveChart_Rain_Light.js',
                      f'{JS}/charts/LiveChart_HI.js',
                      f'{JS}/charts/LiveChart_T_RH.js',
                      f'{JS}/charts/LiveChart_T_HI.js',
                      f'{JS}/charts/LiveChart_T_Rain.js',
                      f'{JS}/charts/LiveChart_T_Light.js',
                      f'{JS}/charts/LiveChart_HI_RH.js',
                      f'{JS}/charts/LiveChart_HI_Rain.js',
                      f'{JS}/charts/LiveChart_HI_Light.js',
                      f'{JS}/charts/LiveChart_Light.js',
                      f'{JS}/charts/LiveChart_Light_RH.js',
                      filters='jsmin', output='gen/packed.js')
}
