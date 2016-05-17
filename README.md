# NotPomf
NodeJS rewrite of [nokonoko/Pomf](https://github.com/nokonoko/Pomf/).

# Install
For the purposes of this guide, we won't cover setting up Nginx, Node,
or NPM.  So we'll just assume you already have them all running well.

## Setting Up
Assuming you already have Node and NPM working, setting up npomf is easy:
```
$ git clone https://github.com/maxpowa/npomf.git  
$ cd npomf  
$ npm install  
```
That's it. You can now run the app with `npm start`

### Docker
```
docker pull maxpowa/npomf
```
Start the container as you would normally.

## Configuring npomf
In the config folder, you will find all of the files that effect the operation
of the application. Most config options should be self-explanatory or will have
extensive documentation on them.

### Docker
For configuring in docker, you can specify environment variables to overwrite 
the existing config by adding NPOMF_<CONFIG_VALUE> to your env. You can also
create a volume over the config file with 

`-v <path/to/your/core.js>:/usr/src/app/config/core.js`

## Nginx Config
Usually, you want to run a NodeJS app behind a proxy like nginx. Configuring
nginx with npomf is easy.
```
# Point the 'server' option here to your npomf instance
upstream npomf {
  server 127.0.0.1:3000;
  keepalive 128;
}

# This defines the vhost, configure based on your setup
server {
  listen       80;
  server_name  my.public.server;

  location / {
    proxy_pass http://npomf/;
    proxy_redirect off;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;
  }

}
```
For SSL support, add another server block after the previous one containing the
following.
```
server {
  listen       443;
  server_name  my.public.server;

  # If you're worried about SSL you should know to point the
  # 'ssl_certificate' and 'ssl_certificate_key' to your own
  # locations
  ssl_certificate      /etc/nginx/ssl/server.crt;
  ssl_certificate_key  /etc/nginx/ssl/server.key;

  location / {
    proxy_pass http://npomf/;
    proxy_redirect off;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;
  }
}
```
In production, nginx should handle serving uploaded files. Depending on
your configuration, your nginx config might look different. The example
given below is a stripped down version of aww.moe's configuration. You
may want to consider adding CSP headers, gzip compression or expiration
headers along with the charset.
```
upstream npomf {
  server 127.0.0.1:3000;
  keepalive 128;
}
server {
  listen 80;
  listen [::]:80 ipv6only=on;

  server_name your.site;

  location / {
    root /path/to/npomf/files;
    try_files $uri @npomf;

    charset UTF-8;
  }

  location @npomf {
    proxy_pass http://npomf/;
    proxy_redirect off;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;
  }
}
```
In the nginx main config, you'll have to change the `client_max_body_size` in
order to allow uploads larger than 1MB. You should change it to whatever you
choose as the max upload size in the config file.
```
http {
  ...
  client_max_body_size 100m;
  ...
}
```
