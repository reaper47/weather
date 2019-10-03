from flask_assets import Bundle

CSS = '../frontend/css'
JS = '../frontend/js'
NODE = '../frontend/node_modules'

bundles = {
    'main_css': Bundle(f'{CSS}/LiveChart.css',
                       f'{NODE}/bulma/css/bulma.min.css',
                       f'{NODE}/chart.js/dist/Chart.min.css',
                       filters='cssmin', output='gen/packed.css'),
    'main_js': Bundle(f'{JS}/LiveChart.js',
                      f'{NODE}/chart.js/dist/Chart.bundle.min.js',
                      filters='jsmin', output='gen/packed.js')
}
