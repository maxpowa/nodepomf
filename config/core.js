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
// config.URL = 'http://my.domain.is.moe/';
config.URL = 'http://localhost:3000/';
// URL to access uploaded files
// Different from URL if you're serving uploaded files from a different subdomain
// If you serve from a different directory/subdomain this app won't be able
// to actually serve the files, NGINX or something must do that. This is just
// for generating links to uploaded files.
// config.FILE_URL = 'http://a.my.domain.is.moe/';
config.FILE_URL = 'http://localhost:3000/f/';

// Only open to localhost, you can should put this behind nginx or similar
// config.IFACES = '0.0.0.0'; // Open to all interfaces (Not running behind nginx)
config.IFACES = '0.0.0.0';
// Run on 3000 and then proxy with nginx to 80, or just directly open to 80 (not recommended)
// config.PORT = '80';
config.PORT = '3000';

// Contact name & email, for contact page
config.CONTACTS = [
	"<b>A Shit</b><br/>"+
	"<a href='mailto:my.waifu@is.shit'>my.waifu@is.shit</a><br/>"+
	"<a href='http://twitter.com/shit_waifu'>@shit_waifu</a>",
	""
];

// Put your grills in public/images/grills and then link them here for them to randomly appear
// on rendered pages.
config.GRILLS = [
	"/images/grills/rory_mercury.png",
	"/images/grills/enju.png",
	"/images/grills/grill.png",
	"/images/grills/akemi_homura.png",
	"/images/grills/himawari_x_sakurako.png",
	"/images/grills/krul_tepes.png",
	"/images/grills/nazuna.png",
	"/images/grills/nori.png",
	"/images/grills/shoukaku_x_zuikaku.png"
];

// Maximum number of files to upload at once
// Default: 10
config.MAX_UPLOAD_COUNT = 10;

// Filename key length
// Can be changed without affecting existing files
// Default: 6
config.KEY_LENGTH = 6;

// Extensions that should be automatically rejected.
// This is totally optional, you can just do
// if you don't want to reject any extensions.
// config.BANNED_EXTS = [];
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

// Two dot extensions - for files that need both parts of the extension
// Some others might include .tar.lzma or .tar.lz . These are optional
// but may affect the way that users attempt to open files.
config.COMPLEX_EXTS = [
	'.tar.gz',
	'.tar.bz',
	'.tar.bz2',
	'.tar.xz',
	'.user.js'
];

// Github client id and secret keys, for Kanri authentication
config.GITHUB_CLIENT_ID = null;
config.GITHUB_CLIENT_SECRET = null;

// Session options for Kanri. !! YOU MUST SET THESE FOR KANRI TO WORK !!
// Set cookies are always signed with keys[0], while the other keys are
// valid for verification, allowing for key rotation.
// If you don't want to use key rotation, remove the 'keys' and use 'secret'
// instead.
// Documentation: https://github.com/expressjs/cookie-session#cookie-options
config.SESSION_OPTIONS = {
	name: 'kanri.session',
	keys: ['new key', 'old key in rotation'],
	maxAge: (86400 * 1000), // 1 day (milliseconds)
	secureProxy: false, // Should be true if you are proxying w/ nginx etc
	domain: undefined // You should set this to your domain
}

// Merge ENV in because we -hate- love RX14-chibi
for (var attr in process.env) {
	if (attr && attr.startsWith('NPOMF_')) {
		eattr = attr.replace('NPOMF_', '');
		config[eattr] = process.env[attr];
	}
}
