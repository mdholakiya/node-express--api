/* Replace with your SQL commands */
-- Table: public.todo

-- DROP TABLE IF EXISTS public.todo;

CREATE TABLE IF NOT EXISTS public.todo
(
    cus_id integer NOT NULL,
    email character varying(30) COLLATE pg_catalog."default" NOT NULL,
    contat numeric,
    id integer NOT NULL,
    title character varying(50) COLLATE pg_catalog."default",
    discription character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT todo_pkey PRIMARY KEY (id),
    CONSTRAINT todo_cus_id_fkey FOREIGN KEY (cus_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.todo
    OWNER to postgres;

-- INSERT DATA
INSERT INTO public.todo(
	  cus_id,email, contat,id,title, discription)
	VALUES (1,'qq@gmail.com', '3456781245',1, 'todo task', 'done task');