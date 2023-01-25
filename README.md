# hyperfoil-test

```
random-data-service : rds
data-changer-service: dcs
data-filter-service : dfs
display-data-service: dds
```

```mermaid
graph TD;
  rds---->dcs;
  dcs---->kafka;
  dfs---->kafka;
  dds---->8081;
```
