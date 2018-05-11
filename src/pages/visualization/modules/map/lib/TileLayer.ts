import * as L from 'leaflet';

const TileLayer = L.TileLayer.extend({
  options: {
    errorTileUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=` // tslint:disable-line
  },

  initialize(opts = {}) {
    const options = L.setOptions(this, opts);
    L.TileLayer.prototype.initialize.call(this, options.url, options);

    this.on('load', this.onLoad, this);
  },

  // Fire ready event when all tiles are loaded
  onLoad() {
    this.fire('ready');
    this.off('load', this.onLoad, this);
  }
});

export const tileLayer = options => {
  return new TileLayer(options);
};
