FROM node:4.2.1-onbuild

VOLUME ["/usr/src/app/files", "/usr/src/app/database.db"]

ENV PORT 80
EXPOSE 80
