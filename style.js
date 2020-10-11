const _ = require('./utils');

module.exports = class Style {
  constructor(style) {
    const styles = this.styles = _.arrify(style);
    this.true = Boolean(styles.length);
    const values = this.values = new Set
    for (const style of styles) {
      if (!style) continue
      for (const key in style) {
        this.values.add(style[key]);
      }
    }
  }

  has(key) {
    for (const style of this.styles) {
      if (!style) continue
      if (key in style) return true;
    }
    false;
  }

  get(key) {
    const styles = [];
    for (const style of this.styles) {
      if (!style) continue
      if (key in style) styles.push(style[key]);
    }
    if (styles.length) return styles;
  }
}
