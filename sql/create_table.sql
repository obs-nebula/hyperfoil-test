CREATE TABLE IF NOT EXISTS messages (
  id SERIAL,
  msg varchar(500) NOT NULL,
  PRIMARY KEY (id)
);