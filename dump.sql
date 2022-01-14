CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar(50) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL UNIQUE,
	"token" uuid NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "subscriptions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"day" integer NOT NULL,
	"adress_id" integer NOT NULL,
	"subscription_date" DATE NOT NULL,
	CONSTRAINT "subscriptions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "plans" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "items" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "items_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "delivery_items" (
	"id" serial NOT NULL,
	"subscription_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	CONSTRAINT "delivery_items_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "deliveries" (
	"id" serial,
	"subscription_id" integer NOT NULL,
	"expected_date" DATE NOT NULL,
	"delivered" bool NOT NULL DEFAULT 'false',
	"delivered_date" DATE,
	CONSTRAINT "deliveries_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "ratings" (
	"id" serial NOT NULL,
	"delivery_id" serial NOT NULL UNIQUE,
	"rating" integer,
	"comment" TEXT,
	CONSTRAINT "ratings_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "adresses" (
	"id" serial NOT NULL,
	"name" varchar(50) NOT NULL,
	"adress" TEXT NOT NULL,
	"zipcode" varchar(8) NOT NULL,
	"city_id" integer NOT NULL,
	CONSTRAINT "adresses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "problems" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "problems_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "delivery_problems" (
	"id" serial NOT NULL,
	"rating_id" integer NOT NULL,
	"problem_id" integer NOT NULL,
	CONSTRAINT "delivery_problems_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "cities" (
	"id" serial NOT NULL UNIQUE,
	"name" TEXT NOT NULL UNIQUE,
	"state_id" integer NOT NULL,
	CONSTRAINT "cities_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "states" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"uf" varchar(2) NOT NULL UNIQUE,
	CONSTRAINT "states_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk1" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk2" FOREIGN KEY ("adress_id") REFERENCES "adresses"("id");



ALTER TABLE "delivery_items" ADD CONSTRAINT "delivery_items_fk0" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id");
ALTER TABLE "delivery_items" ADD CONSTRAINT "delivery_items_fk1" FOREIGN KEY ("item_id") REFERENCES "items"("id");

ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk0" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id");

ALTER TABLE "ratings" ADD CONSTRAINT "ratings_fk0" FOREIGN KEY ("delivery_id") REFERENCES "deliveries"("id");

ALTER TABLE "adresses" ADD CONSTRAINT "adresses_fk0" FOREIGN KEY ("city_id") REFERENCES "cities"("id");


ALTER TABLE "delivery_problems" ADD CONSTRAINT "delivery_problems_fk0" FOREIGN KEY ("rating_id") REFERENCES "ratings"("id");
ALTER TABLE "delivery_problems" ADD CONSTRAINT "delivery_problems_fk1" FOREIGN KEY ("problem_id") REFERENCES "problems"("id");

ALTER TABLE "cities" ADD CONSTRAINT "cities_fk0" FOREIGN KEY ("state_id") REFERENCES "states"("id");

INSERT INTO "items" (name) VALUES ("Chás"), ("Incensos"), ("Produtos orgânicos");
INSERT INTO "plans" (name) VALUES ("Semanal"), ("Mensal");
INSERT INTO "problems" (name) VALUES ("Entrega atrasada"), ("Não gostei do que recebi");
INSERT INTO "states" (name, uf) VALUES ("Acre","AC"), ("Alagoas","AL"), ("Amapá","AP"), ("Amazonas","AM"), ("Bahia","BA"), ("Ceará","CE"), ("Espírito Santo","ES"), ("Goiás","GO"), ("Maranhão","MA"), ("Mato Grosso","MT"), ("Mato Grosso do Sul","MS"), ("Minas Gerais","MG"), ("Pará","PA"), ("Paraíba","PB"), ("Paraná","PR"), ("Pernambuco","PE"), ("Piauí","PI"), ("Rio de Janeiro","RJ"), ("Rio Grande do Norte","RN"), ("Rio Grande do Sul","RS"), ("Rondônia","RO"), ("Roraima","RR"), ("Santa Catarina","SC"), ("São Paulo","SP"), ("Sergipe","SE"), ("Tocantins","TO"), ("Distrito Federal","DF");
