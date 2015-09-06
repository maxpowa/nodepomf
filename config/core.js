var config = module.exports;

// Directory to store uploaded files
config.UPLOAD_DIRECTORY = './files';

// Database filename
// Only SQLITE is supported right now
config.DB_FILENAME = './database.db';

config.SITE_NAME = 'NPomf';

// Main URL (User-facing)
config.URL = 'http://localhost:3000/';
// URL to access uploaded files
// Different from URL if you're serving uploaded files from a different subdomain
config.FILE_URL = 'http://localhost:3000/';

// Only open to localhost, you can should put this behind nginx or similar
config.IFACES = '127.0.0.1';

// Maximum number of files to upload at once
// Default: 10
config.MAX_UPLOAD_COUNT = 10;

// Maximum file size (in bytes)
// Default: 100MB (100000000)
config.MAX_UPLOAD_SIZE = 100000000;

// Filename key length
// Can be changed without affecting existing files
// Default: 6
config.KEY_LENGTH = 6;

config.BANNED_EXTS = [
	'exe',
	'scr',
	'vbs',
	'bat',
	'cmd',
	'html',
	'htm',
	'msi'
];

// Two dot extensions
config.COMPLEX_EXTS = [
	'.tar.gz',
	'.tar.bz',
	'.tar.bz2',
	'.tar.xz',
	'.user.js'
];
