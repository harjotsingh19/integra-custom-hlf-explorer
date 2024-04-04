# Use the navsandhu/exp:1.19 image as the base image
FROM hs/explorer:latest

# Add your configurations from the Docker Compose file

# Set environment variables
ENV DATABASE_HOST explorerdb.integra.com
ENV DATABASE_DATABASE fabricexplorer
ENV DATABASE_USERNAME hppoc
ENV DATABASE_PASSWD password
ENV LOG_LEVEL_APP debug
ENV LOG_LEVEL_DB debug
ENV LOG_LEVEL_CONSOLE info
ENV LOG_CONSOLE_STDOUT true
ENV DISCOVERY_AS_LOCALHOST false


COPY  ./config/explorer-connection-profile/config.json /opt/explorer/app/platform/fabric/config.json 
COPY  ./config/explorer-connection-profile/connection-profile /opt/explorer/app/platform/fabric/connection-profile 
COPY  ./wallet /opt/explorer/wallet 
COPY  ./crypto-config /opt/explorer/crypto-config 
COPY  ./build /opt/explorer/client/build 
COPY  ./app/env-config.js /opt/explorer/app/env-config.js 
COPY  ./app/cors-whitelist-domains.js /opt/explorer/app/cors-whitelist-domains.js 
COPY  ./app/main.js /opt/explorer/app/main.js 


# Expose port 80
EXPOSE 3006


# RUN /opt/explorer/transfer.sh

# Define the entry point and arguments for the shell script
# CMD [ /opt/explorer/transfer.sh"]

