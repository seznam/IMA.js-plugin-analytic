import Abstract from './abstract.js';

/**
 * Dot
 *
 * @class Dot
 * @namespace Module.Analytic
 * @module Module
 * @submodule Module.Analytic
 *
 * @extends Module.Analytic.Abstract
 */
export default class Dot extends Abstract {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Window} window
	 * @param {Core.Interface.Dispatcher} dispatcher
	 * @param {Object<string, string>} EVENTS
	 * @param {Object<string, *>} config
	 */
	constructor(window, dispatcher, EVENTS, config) {
		super(window, dispatcher, EVENTS, config);
	}

	/**
	 * Install analytic script to page.
	 *
	 * @method install
	 * @param {string} [url='//h.imedia.cz/js/dot-small.js']
	 * @param {string} [id='dot']
	 */
	install(url = '//h.imedia.cz/js/dot-small.js', id = 'DOT') {
		super.install(url, id);
	}

	/**
	 * Returns data-dot-data structure for element from defined params.
	 *
	 * @method getDotDataForElement
	 * @param {Object<string, string|number|boolean>} params
	 * @return {string}
	 */
	getDOTDataForElement(params) {
		var dotPairs = [];

		for (let key of Object.keys(params)) {
			let value = params[key];

			dotPairs.push(`"${key}":"${value}"`);
		}

		return `{${dotPairs.join(',')}}`;
	}

	/**
	 * Hit event to analytic with defined data. If analytic is not configured then
	 * defer hit to storage.
	 *
	 * @override
	 * @method hit
	 * @param {Object<string, *>} data
	 */
	hit(data) {
		if (this.isEnabled()) {
			this._window.getWindow().DOT.hit('event', { d: data });
		} else {
			this._deferHit(data);
		}
	}

	/**
	 * Hit page view event to analytic witd defined data.
	 *
	 * @method hitPageView
	 * @param {Object<string, *>} pageData
	 */
	hitPageView(pageData) {
		let data = {
			action: 'impress',
			page: pageData.route.getName(),
			params: pageData.params
		};

		this.hit(data);
	}

	/**
	 * Configuration DOT analyst
	 *
	 * @override
	 * @protected
	 * @method _configuration
	 */
	_configuration() {
		if (!this._window.isClient() ||
				!this._window.getWindow().DOT ||
				!this._config.service ||
				this.isEnabled()) {
			return;
		}

		this._enable = true;
		this._window.getWindow().DOT.cfg(this._config);
		this._dispatcher.fire(this._EVENTS.LOADED, { type: 'dot' }, true);
	}
}