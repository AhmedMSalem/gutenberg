/**
 * External dependencies
 */
const { createMacro } = require( 'babel-plugin-macros' );
const { existsSync, readFileSync } = require( 'fs' );
const { mapKeys, pick } = require( 'lodash' );
const { dirname, join, relative } = require( 'path' );

function getFilename( [ filenamePath ], state ) {
	const filename = filenamePath.evaluate().value;

	return join(
		relative( process.cwd(), dirname( state.file.opts.filename ) ),
		filename
	);
}

function readMetadata( filename ) {
	if ( ! existsSync( filename ) ) {
		throw new Error( `Invalid file name provided: ${ filename }.` );
	}

	const metadataRaw = readFileSync( filename, 'utf8' );

	return JSON.parse( metadataRaw );
}

function formatMetadata( metadata, types ) {
	const aliases = {
		styleVariations: 'styles',
	};
	const replaceWithAlias = ( _, key ) => {
		return aliases[ key ] || key;
	};
	const whitelistedProperties = [
		'name',
		'title',
		'category',
		'parent',
		'icon',
		'description',
		'keywords',
		'attributes',
		'styles',
	];

	const metadataFiltered = pick(
		mapKeys( metadata, replaceWithAlias ),
		whitelistedProperties
	);

	const metadataNode = types.valueToNode( metadataFiltered );
	/*const translatedProperties = [
		'title',
		'description',
		'keywords',
	];*/

	return metadataNode;
}

function babelBlockMacro( { references, state, babel } ) {
	const { types } = babel;
	references.default.forEach( ( referencePath ) => {
		if ( referencePath.parentPath.type === 'CallExpression' ) {
			const metadata = readMetadata(
				getFilename( referencePath.parentPath.get( 'arguments' ), state )
			);

			referencePath.parentPath.replaceWith( formatMetadata( metadata, types ) );
		} else {
			throw new Error(
				`@wordpress/babel-block.macro can only be used as function call. You tried ${ referencePath.parentPath.type }.`,
			);
		}
	} );
}

module.exports = createMacro( babelBlockMacro );
