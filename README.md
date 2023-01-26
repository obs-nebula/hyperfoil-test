# hyperfoil-test


WIP

```
random-data-service : rds
data-changer-service: dcs
data-filter-service : dfs
display-data-service: dds
postgreesql         : pg
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

