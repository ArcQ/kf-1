/**
 * Type definitions for main configs
 * @module config
 */
/**
 * main config definition defined at src/config.json
 * @typedef {Object} MainConfig
 * @property {GameConfig} game - global game config parameters
 */

/**
 * game config definition defined at src/config.json
 * @typedef {Object} GameConfig
 * @property {string} defaultScene - Indicates whether the Courage component is present.
 * @property {Point} aspectRatio - defaut aspect ratio for screens based on mobile
 * @property {Point} disableResponsive - for resizing screens on web
 */

/**
 * point
 * @typedef {Object} Coord
 * @property {Number} x - x-coordinate
 * @property {Number} y - y-coordinate
 */
