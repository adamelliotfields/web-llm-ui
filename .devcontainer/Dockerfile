FROM mcr.microsoft.com/devcontainers/typescript-node:22

# add bun bin to path
ENV PATH "/home/node/.bun/bin:${PATH}"

# set node user/group
USER 1000:1000

# workdir
WORKDIR /workspaces/web-llm-ui

# install bun
RUN curl -fsSL https://bun.sh/install | bash

# ports
EXPOSE 4173 5173
