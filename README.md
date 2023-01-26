# hyperfoil-test

```
random-data-service  : rds - express                : auto-instrumentation
data-changer-service : dcs - fastify, kafkajs       : auto-instrumentation, manual-instrumentation
data-filter-service  : dfs - kafkajs, socket.io, pg : auto-instrumentation, manual-instrumentation
display-data-service : dds - hapi, socket.io, pg    : auto-instrumentation
postgres             : pg
```

```mermaid
graph TD;
  rds--Sends important msg to-->dcs;
  dcs--Changes the msg and sends to-->kafka;
  dfs--Consumes the msg and apply a filter-->kafka;
  dfs--Saves filtered msg in-->PG;
  dfs--Hey we have a msg!-->dds;
  dds--cool! makes a db query-->PG;
  dds--Was fooled by dfs-->void;
```

Open a terminal and run:

```console
docker-compose up
```

Open other terminal and run

```console
curl 0.0.0.0:8080
```

