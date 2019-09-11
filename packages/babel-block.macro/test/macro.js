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
		'valid metadata file': {
			code: `
				import blockMetadata from '../macro';
				const metadata = blockMetadata( './fixtures/block.json' );
			`,
			snapshot: true,
		},
		'valid metadata file with i18n support': {
			code: `
				import blockMetadata from '../macro';
				const metadata = blockMetadata( './fixtures/block-i18n.json' );
			`,
			snapshot: true,
		},
		'valid metadata file with i18n support and default text domain': {
			code: `
				import blockMetadata from '../macro';
				const metadata = blockMetadata( './fixtures/block-i18n-default.json' );
			`,
			snapshot: true,
		},
		'invalid metadata file name': {
			code: `
				import blockMetadata from '../macro';
				const metadata = blockMetadata( './invalid-file.json' );
			`,
			error: 'Invalid file name provided: packages/babel-block.macro/test/invalid-file.json.',
		},
		'invalid usage: as function argument': {
			code: `
				import blockMetadata from '../macro';
        		const metadata = doSomething( blockMetadata );
      		`,
			error: true,
		},
		'invalid usage: missing file path': {
			code: `
				import blockMetadata from '../macro';
				const metadata = blockMetadata;
			`,
			error: true,
		},
	},
} );
