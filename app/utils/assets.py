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
                       f'{NODE}/chart.js/dist/Chart.min.css',
                       filters='cssmin', output='gen/packed.css'),
    'main_js': Bundle(f'{NODE}/chart.js/dist/Chart.bundle.min.js',
                      f'{NODE}/deepmerge/dist/umd.js',
                      f'{JS}/chart_globals.js',
                      f'{JS}/LiveChart.js',
                      f'{JS}/LiveChart_T.js',
                      f'{JS}/LiveChart_RH.js',
                      f'{JS}/LiveChart_HI.js',
                      f'{JS}/LiveChart_T_RH.js',
                      f'{JS}/LiveChart_T_HI.js',
                      f'{JS}/LiveChart_HI_RH.js',
                      filters='jsmin', output='gen/packed.js')
}
