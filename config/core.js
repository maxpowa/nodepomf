var config = module.exports;

// Directory to store uploaded files
config.UPLOAD_DIRECTORY = './files';

// Database filename
// Only SQLITE is supported right now
config.DB_FILENAME = './database.db';

// Maximum file size (in bytes)
// Default: 100MB (100000000)
config.MAX_UPLOAD_SIZE = 100000000;

config.SITE_NAME = 'NPomf';
config.HELLO = "Ohayō!";
config.TAGLINE = "More kawaii than Pomf?!";
config.DESCRIPTION = "Upload whatever you want here, as long as it's under "+
										 config.MAX_UPLOAD_SIZE/1000000 + "MB.<br/> "+
										 "Please read our <a href='/faq'>FAQ</a>, as we may "+
										 "remove files under specific circumstances.";

// Main URL (User-facing)
config.URL = 'http://localhost:3000/';
// URL to access uploaded files
// Different from URL if you're serving uploaded files from a different subdomain
// If you serve from a different directory/subdomain this app won't be able
// to actually serve the files, NGINX or something must do that. This is just
// for generating links to uploaded files.
config.FILE_URL = 'http://localhost:3000/f/';

// Only open to localhost, you can should put this behind nginx or similar
config.IFACES = '127.0.0.1';

// Contact name & email, for contact page
config.CONTACTS = [
	"<b>A Shit</b><br/>"+
	"<a href='mailto:my.waifu@is.shit'>my.waifu@is.shit</a><br/>"+
	"<a href='http://twitter.com/shit_waifu'>@shit_waifu</a>",
	""
];

// Maximum number of files to upload at once
// Default: 10
config.MAX_UPLOAD_COUNT = 10;

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
