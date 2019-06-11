/**
 * External dependencies
 */
import plugin from 'babel-plugin-macros';
import pluginTester from 'babel-plugin-tester';

pluginTester( {
	plugin,
	babelOptions: {
		babelrc: false,
		filename: __filename,
		presets: [ '@wordpress/babel-preset-default' ],
	},
	tests: {
		'valid metadata file name': {
			code: `
				import macro from '../macro';
				const metadata = macro( './fixtures/block.json' );
			`,
			snapshot: true,
		},
		'invalid metadata file name': {
			code: `
				import macro from '../macro';
				const metadata = macro( './invalid-file.json' );
			`,
			error: 'Invalid file name provided: packages/babel-block.macro/test/invalid-file.json.',
		},
		'invalid usage: as function argument': {
			code: `
				import macro from '../macro';
        		const metadata = doSomething( macro );
      		`,
			error: true,
		},
		'invalid usage: missing file path': {
			code: `
				import macro from '../macro';
				const metadata = macro;
			`,
			error: true,
		},
	},
} );
