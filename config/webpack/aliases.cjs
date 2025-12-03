const path = require('path');

module.exports = {
  '@': path.resolve(process.cwd(), 'src'),
  '@components': path.resolve(process.cwd(), 'src/renderer/components'),
  '@buttons': path.resolve(process.cwd(), 'src/renderer/components/ui/buttons'),
  '@input': path.resolve(process.cwd(), 'src/renderer/components/ui/input'),
  '@display': path.resolve(process.cwd(), 'src/renderer/components/ui/display'),
  '@ui': path.resolve(process.cwd(), 'src/renderer/components/ui'),
  '@services': path.resolve(process.cwd(), 'src/services'),
  '@styles': path.resolve(process.cwd(), 'src/renderer/styles'),
  '@classes': path.resolve(process.cwd(), 'src/renderer/classes'),
  '@hooks': path.resolve(process.cwd(), 'src/renderer/hooks'),
  '@types': path.resolve(process.cwd(), 'src/types'),
  '@constants': path.resolve(process.cwd(), 'src/renderer/constants'),
  '@utils': path.resolve(process.cwd(), 'src/utils'),
};
