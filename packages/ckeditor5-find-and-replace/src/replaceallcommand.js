/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module link/replaceallcommand
 */

import { updateFindResultFromRange, findByTextCallback } from './utils';
import { Collection } from 'ckeditor5/src/utils';
import ReplaceCommand from './replacecommand';

/**
 * Replace all command. It is used by the {@link module:findandreplace/findandreplace~FindAndReplace link feature}.
 *
 * @extends module:core/command~Command
 */
export default class ReplaceAllCommand extends ReplaceCommand {
	/**
	 * Creates a new `ReplaceAllCommand` instance.
	 *
	 * @param {module:core/editor/editor~Editor} editor Editor on which this command will be used.
	 */
	constructor( editor ) {
		super( editor );

		// Replace command is always enabled.
		this.isEnabled = true;
	}

	/**
	 * Replaces all find results by a string or a callback.
	 *
	 * @param {String} newText
	 * @param {String} oldText
	 */
	execute( newText, oldText ) {
		const { editor } = this;
		const { model } = editor;
		const range = model.createRangeIn( model.document.getRoot() );

		const results = oldText instanceof Collection ?
			oldText : updateFindResultFromRange( range, model, findByTextCallback( oldText ) );

		if ( !results ) {
			return;
		}

		this.editor.model.change( () => {
			[ ...results ].forEach( searchResult => {
				// Just reuse logic from replace command to replace a single match.
				super.execute( newText, searchResult );
			} );
		} );
	}
}
