PGDMP  ;                    |           sakura-cafe    16.2    16.2 a    k           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            l           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            m           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            n           1262    33287    sakura-cafe    DATABASE     �   CREATE DATABASE "sakura-cafe" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Ukrainian_Ukraine.1251';
    DROP DATABASE "sakura-cafe";
                postgres    false            o           0    0    DATABASE "sakura-cafe"    COMMENT     <   COMMENT ON DATABASE "sakura-cafe" IS 'SakuraCafe Database';
                   postgres    false    4974            s           1247    33384    order_status_enum    TYPE     �   CREATE TYPE public.order_status_enum AS ENUM (
    'на розгляді',
    'прийнято',
    'відхилено',
    'скасовано'
);
 $   DROP TYPE public.order_status_enum;
       public          postgres    false            y           1247    33470    user_role_enum    TYPE     T   CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'user',
    'guest'
);
 !   DROP TYPE public.user_role_enum;
       public          postgres    false            �            1259    33327    category    TABLE     _   CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.category;
       public         heap    postgres    false            �            1259    33326    category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.category_id_seq;
       public          postgres    false    222            p           0    0    category_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;
          public          postgres    false    221            �            1259    41766    feedback    TABLE     �   CREATE TABLE public.feedback (
    id integer NOT NULL,
    subject character varying NOT NULL,
    message text NOT NULL,
    "isProcessed" boolean DEFAULT false NOT NULL,
    user_id integer,
    date timestamp with time zone
);
    DROP TABLE public.feedback;
       public         heap    postgres    false            �            1259    41765    feedback_id_seq    SEQUENCE     �   CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.feedback_id_seq;
       public          postgres    false    234            q           0    0    feedback_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;
          public          postgres    false    233            �            1259    33356    food    TABLE     �   CREATE TABLE public.food (
    id integer NOT NULL,
    name character varying NOT NULL,
    rating numeric(2,1) DEFAULT '0'::numeric NOT NULL,
    image character varying NOT NULL,
    category_id integer,
    price integer DEFAULT 0 NOT NULL
);
    DROP TABLE public.food;
       public         heap    postgres    false            �            1259    33355    food_id_seq    SEQUENCE     �   CREATE SEQUENCE public.food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.food_id_seq;
       public          postgres    false    226            r           0    0    food_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.food_id_seq OWNED BY public.food.id;
          public          postgres    false    225            �            1259    41687    food_ingredient    TABLE     j   CREATE TABLE public.food_ingredient (
    food_id integer NOT NULL,
    ingredient_id integer NOT NULL
);
 #   DROP TABLE public.food_ingredient;
       public         heap    postgres    false            �            1259    33338 
   ingredient    TABLE     �   CREATE TABLE public.ingredient (
    id integer NOT NULL,
    title character varying NOT NULL,
    image character varying NOT NULL
);
    DROP TABLE public.ingredient;
       public         heap    postgres    false            �            1259    33337    ingredient_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.ingredient_id_seq;
       public          postgres    false    224            s           0    0    ingredient_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.ingredient_id_seq OWNED BY public.ingredient.id;
          public          postgres    false    223            �            1259    33394    order    TABLE     �   CREATE TABLE public."order" (
    id integer NOT NULL,
    status public.order_status_enum DEFAULT 'на розгляді'::public.order_status_enum NOT NULL,
    date timestamp with time zone,
    tray_id integer
);
    DROP TABLE public."order";
       public         heap    postgres    false    883    883            �            1259    33393    order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.order_id_seq;
       public          postgres    false    231            t           0    0    order_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.order_id_seq OWNED BY public."order".id;
          public          postgres    false    230            �            1259    33376    rating    TABLE     �   CREATE TABLE public.rating (
    id integer NOT NULL,
    rate integer DEFAULT 0 NOT NULL,
    user_id integer,
    food_id integer
);
    DROP TABLE public.rating;
       public         heap    postgres    false            �            1259    33375    rating_id_seq    SEQUENCE     �   CREATE SEQUENCE public.rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.rating_id_seq;
       public          postgres    false    229            u           0    0    rating_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.rating_id_seq OWNED BY public.rating.id;
          public          postgres    false    228            �            1259    33309    token    TABLE     z   CREATE TABLE public.token (
    id integer NOT NULL,
    refresh_token character varying NOT NULL,
    user_id integer
);
    DROP TABLE public.token;
       public         heap    postgres    false            �            1259    33308    token_id_seq    SEQUENCE     �   CREATE SEQUENCE public.token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.token_id_seq;
       public          postgres    false    218            v           0    0    token_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.token_id_seq OWNED BY public.token.id;
          public          postgres    false    217            �            1259    33320    tray    TABLE     K   CREATE TABLE public.tray (
    id integer NOT NULL,
    user_id integer
);
    DROP TABLE public.tray;
       public         heap    postgres    false            �            1259    33369 	   tray_food    TABLE     ^   CREATE TABLE public.tray_food (
    tray_id integer NOT NULL,
    food_id integer NOT NULL
);
    DROP TABLE public.tray_food;
       public         heap    postgres    false            �            1259    33319    tray_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tray_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.tray_id_seq;
       public          postgres    false    220            w           0    0    tray_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.tray_id_seq OWNED BY public.tray.id;
          public          postgres    false    219            �            1259    33296    user    TABLE     ,  CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role public.user_role_enum DEFAULT 'guest'::public.user_role_enum NOT NULL,
    activation_link character varying NOT NULL
);
    DROP TABLE public."user";
       public         heap    postgres    false    889    889            �            1259    33295    user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.user_id_seq;
       public          postgres    false    216            x           0    0    user_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
          public          postgres    false    215            �           2604    33330    category id    DEFAULT     j   ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);
 :   ALTER TABLE public.category ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    41769    feedback id    DEFAULT     j   ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);
 :   ALTER TABLE public.feedback ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    234    234            �           2604    33359    food id    DEFAULT     b   ALTER TABLE ONLY public.food ALTER COLUMN id SET DEFAULT nextval('public.food_id_seq'::regclass);
 6   ALTER TABLE public.food ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225    226            �           2604    33341    ingredient id    DEFAULT     n   ALTER TABLE ONLY public.ingredient ALTER COLUMN id SET DEFAULT nextval('public.ingredient_id_seq'::regclass);
 <   ALTER TABLE public.ingredient ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    33397    order id    DEFAULT     f   ALTER TABLE ONLY public."order" ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);
 9   ALTER TABLE public."order" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    230    231            �           2604    33379 	   rating id    DEFAULT     f   ALTER TABLE ONLY public.rating ALTER COLUMN id SET DEFAULT nextval('public.rating_id_seq'::regclass);
 8   ALTER TABLE public.rating ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228    229            �           2604    33312    token id    DEFAULT     d   ALTER TABLE ONLY public.token ALTER COLUMN id SET DEFAULT nextval('public.token_id_seq'::regclass);
 7   ALTER TABLE public.token ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �           2604    33323    tray id    DEFAULT     b   ALTER TABLE ONLY public.tray ALTER COLUMN id SET DEFAULT nextval('public.tray_id_seq'::regclass);
 6   ALTER TABLE public.tray ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �           2604    33299    user id    DEFAULT     d   ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
 8   ALTER TABLE public."user" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            \          0    33327    category 
   TABLE DATA                 public          postgres    false    222   �m       h          0    41766    feedback 
   TABLE DATA                 public          postgres    false    234   hn       `          0    33356    food 
   TABLE DATA                 public          postgres    false    226   �q       f          0    41687    food_ingredient 
   TABLE DATA                 public          postgres    false    232   �z       ^          0    33338 
   ingredient 
   TABLE DATA                 public          postgres    false    224   ~       e          0    33394    order 
   TABLE DATA                 public          postgres    false    231   D�       c          0    33376    rating 
   TABLE DATA                 public          postgres    false    229   C�       X          0    33309    token 
   TABLE DATA                 public          postgres    false    218   ��       Z          0    33320    tray 
   TABLE DATA                 public          postgres    false    220   ڍ       a          0    33369 	   tray_food 
   TABLE DATA                 public          postgres    false    227   B�       V          0    33296    user 
   TABLE DATA                 public          postgres    false    216   �       y           0    0    category_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.category_id_seq', 20, true);
          public          postgres    false    221            z           0    0    feedback_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.feedback_id_seq', 7, true);
          public          postgres    false    233            {           0    0    food_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.food_id_seq', 65, true);
          public          postgres    false    225            |           0    0    ingredient_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.ingredient_id_seq', 99, true);
          public          postgres    false    223            }           0    0    order_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.order_id_seq', 56, true);
          public          postgres    false    230            ~           0    0    rating_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.rating_id_seq', 138, true);
          public          postgres    false    228                       0    0    token_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.token_id_seq', 201, true);
          public          postgres    false    217            �           0    0    tray_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.tray_id_seq', 97, true);
          public          postgres    false    219            �           0    0    user_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.user_id_seq', 41, true);
          public          postgres    false    215            �           2606    33400 $   order PK_1031171c13130102495201e3e20 
   CONSTRAINT     f   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."order" DROP CONSTRAINT "PK_1031171c13130102495201e3e20";
       public            postgres    false    231            �           2606    33365 #   food PK_26d12de4b6576ff08d30c281837 
   CONSTRAINT     c   ALTER TABLE ONLY public.food
    ADD CONSTRAINT "PK_26d12de4b6576ff08d30c281837" PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.food DROP CONSTRAINT "PK_26d12de4b6576ff08d30c281837";
       public            postgres    false    226            �           2606    33345 )   ingredient PK_6f1e945604a0b59f56a57570e98 
   CONSTRAINT     i   ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.ingredient DROP CONSTRAINT "PK_6f1e945604a0b59f56a57570e98";
       public            postgres    false    224            �           2606    33316 $   token PK_82fae97f905930df5d62a702fc9 
   CONSTRAINT     d   ALTER TABLE ONLY public.token
    ADD CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.token DROP CONSTRAINT "PK_82fae97f905930df5d62a702fc9";
       public            postgres    false    218            �           2606    41774 '   feedback PK_8389f9e087a57689cd5be8b2b13 
   CONSTRAINT     g   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.feedback DROP CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13";
       public            postgres    false    234            �           2606    41705 .   food_ingredient PK_845d113afb7fd95a6a0cbe3693f 
   CONSTRAINT     �   ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT "PK_845d113afb7fd95a6a0cbe3693f" PRIMARY KEY (food_id, ingredient_id);
 Z   ALTER TABLE ONLY public.food_ingredient DROP CONSTRAINT "PK_845d113afb7fd95a6a0cbe3693f";
       public            postgres    false    232    232            �           2606    33334 '   category PK_9c4e4a89e3674fc9f382d733f03 
   CONSTRAINT     g   ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.category DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03";
       public            postgres    false    222            �           2606    33325 #   tray PK_bedf63adc3ec40438409f0041c7 
   CONSTRAINT     c   ALTER TABLE ONLY public.tray
    ADD CONSTRAINT "PK_bedf63adc3ec40438409f0041c7" PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.tray DROP CONSTRAINT "PK_bedf63adc3ec40438409f0041c7";
       public            postgres    false    220            �           2606    33305 #   user PK_cace4a159ff9f2512dd42373760 
   CONSTRAINT     e   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760";
       public            postgres    false    216            �           2606    41752 (   tray_food PK_eb8dde4f56f23c61af558644c19 
   CONSTRAINT     v   ALTER TABLE ONLY public.tray_food
    ADD CONSTRAINT "PK_eb8dde4f56f23c61af558644c19" PRIMARY KEY (tray_id, food_id);
 T   ALTER TABLE ONLY public.tray_food DROP CONSTRAINT "PK_eb8dde4f56f23c61af558644c19";
       public            postgres    false    227    227            �           2606    33382 %   rating PK_ecda8ad32645327e4765b43649e 
   CONSTRAINT     e   ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public.rating DROP CONSTRAINT "PK_ecda8ad32645327e4765b43649e";
       public            postgres    false    229            �           2606    33402 $   order REL_ca0ccec06d3c73bca505c2fc5c 
   CONSTRAINT     f   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "REL_ca0ccec06d3c73bca505c2fc5c" UNIQUE (tray_id);
 R   ALTER TABLE ONLY public."order" DROP CONSTRAINT "REL_ca0ccec06d3c73bca505c2fc5c";
       public            postgres    false    231            �           2606    33318 $   token REL_e50ca89d635960fda2ffeb1763 
   CONSTRAINT     d   ALTER TABLE ONLY public.token
    ADD CONSTRAINT "REL_e50ca89d635960fda2ffeb1763" UNIQUE (user_id);
 P   ALTER TABLE ONLY public.token DROP CONSTRAINT "REL_e50ca89d635960fda2ffeb1763";
       public            postgres    false    218            �           2606    33367 #   food UQ_0f9580637d3bcdd0c9d6558de0d 
   CONSTRAINT     `   ALTER TABLE ONLY public.food
    ADD CONSTRAINT "UQ_0f9580637d3bcdd0c9d6558de0d" UNIQUE (name);
 O   ALTER TABLE ONLY public.food DROP CONSTRAINT "UQ_0f9580637d3bcdd0c9d6558de0d";
       public            postgres    false    226            �           2606    33336 '   category UQ_23c05c292c439d77b0de816b500 
   CONSTRAINT     d   ALTER TABLE ONLY public.category
    ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE (name);
 S   ALTER TABLE ONLY public.category DROP CONSTRAINT "UQ_23c05c292c439d77b0de816b500";
       public            postgres    false    222            �           2606    33307 #   user UQ_e12875dfb3b1d92d7d7c5377e22 
   CONSTRAINT     c   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22";
       public            postgres    false    216            �           2606    33347 )   ingredient UQ_e2c3fac5074c0f34f133fad5445 
   CONSTRAINT     g   ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT "UQ_e2c3fac5074c0f34f133fad5445" UNIQUE (title);
 U   ALTER TABLE ONLY public.ingredient DROP CONSTRAINT "UQ_e2c3fac5074c0f34f133fad5445";
       public            postgres    false    224            �           1259    41734    IDX_19acf1df3516d0726e74f60d69    INDEX     e   CREATE INDEX "IDX_19acf1df3516d0726e74f60d69" ON public.food_ingredient USING btree (ingredient_id);
 4   DROP INDEX public."IDX_19acf1df3516d0726e74f60d69";
       public            postgres    false    232            �           1259    41754    IDX_797437d9a615c3575665421a81    INDEX     Y   CREATE INDEX "IDX_797437d9a615c3575665421a81" ON public.tray_food USING btree (food_id);
 4   DROP INDEX public."IDX_797437d9a615c3575665421a81";
       public            postgres    false    227            �           1259    41753    IDX_93372718af6a97e071fabade7f    INDEX     Y   CREATE INDEX "IDX_93372718af6a97e071fabade7f" ON public.tray_food USING btree (tray_id);
 4   DROP INDEX public."IDX_93372718af6a97e071fabade7f";
       public            postgres    false    227            �           1259    41728    IDX_a8934e3b61e91680d4909da3e0    INDEX     _   CREATE INDEX "IDX_a8934e3b61e91680d4909da3e0" ON public.food_ingredient USING btree (food_id);
 4   DROP INDEX public."IDX_a8934e3b61e91680d4909da3e0";
       public            postgres    false    232            �           2606    41775 '   feedback FK_121c67d42dd543cca0809f59901    FK CONSTRAINT     �   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT "FK_121c67d42dd543cca0809f59901" FOREIGN KEY (user_id) REFERENCES public."user"(id);
 S   ALTER TABLE ONLY public.feedback DROP CONSTRAINT "FK_121c67d42dd543cca0809f59901";
       public          postgres    false    4758    216    234            �           2606    33423 #   food FK_12d79e4940385900bdee7453bd0    FK CONSTRAINT     �   ALTER TABLE ONLY public.food
    ADD CONSTRAINT "FK_12d79e4940385900bdee7453bd0" FOREIGN KEY (category_id) REFERENCES public.category(id);
 O   ALTER TABLE ONLY public.food DROP CONSTRAINT "FK_12d79e4940385900bdee7453bd0";
       public          postgres    false    222    226    4768            �           2606    33438 %   rating FK_17618c8d69b7e2e287bf9f8fbb3    FK CONSTRAINT     �   ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "FK_17618c8d69b7e2e287bf9f8fbb3" FOREIGN KEY (user_id) REFERENCES public."user"(id);
 Q   ALTER TABLE ONLY public.rating DROP CONSTRAINT "FK_17618c8d69b7e2e287bf9f8fbb3";
       public          postgres    false    216    4758    229            �           2606    41735 .   food_ingredient FK_19acf1df3516d0726e74f60d69f    FK CONSTRAINT     �   ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT "FK_19acf1df3516d0726e74f60d69f" FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(id);
 Z   ALTER TABLE ONLY public.food_ingredient DROP CONSTRAINT "FK_19acf1df3516d0726e74f60d69f";
       public          postgres    false    4772    224    232            �           2606    33443 %   rating FK_67ee8d4eb10bf7df276a6bcbd7a    FK CONSTRAINT     �   ALTER TABLE ONLY public.rating
    ADD CONSTRAINT "FK_67ee8d4eb10bf7df276a6bcbd7a" FOREIGN KEY (food_id) REFERENCES public.food(id);
 Q   ALTER TABLE ONLY public.rating DROP CONSTRAINT "FK_67ee8d4eb10bf7df276a6bcbd7a";
       public          postgres    false    226    229    4776            �           2606    41760 (   tray_food FK_797437d9a615c3575665421a814    FK CONSTRAINT     �   ALTER TABLE ONLY public.tray_food
    ADD CONSTRAINT "FK_797437d9a615c3575665421a814" FOREIGN KEY (food_id) REFERENCES public.food(id);
 T   ALTER TABLE ONLY public.tray_food DROP CONSTRAINT "FK_797437d9a615c3575665421a814";
       public          postgres    false    226    4776    227            �           2606    33408 #   tray FK_8f9c6ce7f7174ec4de890a49baa    FK CONSTRAINT     �   ALTER TABLE ONLY public.tray
    ADD CONSTRAINT "FK_8f9c6ce7f7174ec4de890a49baa" FOREIGN KEY (user_id) REFERENCES public."user"(id);
 O   ALTER TABLE ONLY public.tray DROP CONSTRAINT "FK_8f9c6ce7f7174ec4de890a49baa";
       public          postgres    false    216    220    4758            �           2606    41755 (   tray_food FK_93372718af6a97e071fabade7fa    FK CONSTRAINT     �   ALTER TABLE ONLY public.tray_food
    ADD CONSTRAINT "FK_93372718af6a97e071fabade7fa" FOREIGN KEY (tray_id) REFERENCES public.tray(id) ON UPDATE CASCADE ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.tray_food DROP CONSTRAINT "FK_93372718af6a97e071fabade7fa";
       public          postgres    false    220    4766    227            �           2606    41729 .   food_ingredient FK_a8934e3b61e91680d4909da3e0e    FK CONSTRAINT     �   ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT "FK_a8934e3b61e91680d4909da3e0e" FOREIGN KEY (food_id) REFERENCES public.food(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.food_ingredient DROP CONSTRAINT "FK_a8934e3b61e91680d4909da3e0e";
       public          postgres    false    232    4776    226            �           2606    33448 $   order FK_ca0ccec06d3c73bca505c2fc5cf    FK CONSTRAINT     �   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_ca0ccec06d3c73bca505c2fc5cf" FOREIGN KEY (tray_id) REFERENCES public.tray(id);
 R   ALTER TABLE ONLY public."order" DROP CONSTRAINT "FK_ca0ccec06d3c73bca505c2fc5cf";
       public          postgres    false    231    4766    220            �           2606    33403 $   token FK_e50ca89d635960fda2ffeb17639    FK CONSTRAINT     �   ALTER TABLE ONLY public.token
    ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY (user_id) REFERENCES public."user"(id);
 P   ALTER TABLE ONLY public.token DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639";
       public          postgres    false    4758    218    216            \   �   x���v
Q���W((M��L�KN,IM�/�T��L�Q�K�M�Ts�	uV�0�QP���b�Ŏ���5��<I�nҾ�¾�/� C����.v\�qaYN04�z��~��`�?膆{/N��@�� 3�\�z��.6��#�)s/l �d��� �� HѤ�      h   _  x����nQ��<�m7�8%@
F\4�t��Tc�[Cajjk4P���&M����e�9P�S���¹o�w�*���w�=�|������ګ-����B}�l��;�]�����n�R���{�p`�v��g[jq�������vq�R��]z�;����z����M���T��S_R�����!9񹫊n�K~�F>tM�,�㺁/��A���+II'�+���r*�R�\&�[�$2���d:��Il��z���'�E>���s�z������#<��;h�uU�c1�m�
�1��)H���G׺NCY���œK�
oF�1�=l��h��	>�E��1[�x��3�����tU�3������������5}���Wr���n�S.���qk�� ����D�g��+*	E�ra9�gl�@�`ԝ���k�˹��������"���a�f68��F�})d��M��s@��Bt|�ÐS�M�����G�M�_���>�>�b��p|dL��^�6B�3�dє6�;4��:9�ڽ��
���X��a�&�<'�B� �
SKZ@��B}l�#�u��hR����>Y��u���\� `f?pA��g��V�?΀���մc�[U�s<��4i9�c�O|�L|�X�{xӄ��� !���,.��'�%�|�,���;����圻���}�H����g��Ȣh2H�u�ϣY5�/y,�hw�|�fAZmb�u4Ew䓩���WW-c�n�-t�0t�4���'�+�g'6�Y�eL�IoY�!OP-�2��NRàEQ�2���	�	�z4 |�g'��L���E�Z���^���߱q���������R�D�q6�Ǌ�~����      `   �  x��YM�\G��W�.�4e��*�b��%$آ���ز]l'6KA�D�=��C����/��G���y�:3�Mj1��V�t��{�=������g����OW�}�n�{�����|��(|X�V����=Z��i
������������?����}��rG�������w��t�9YM߮�W�zz�y6���O��[G+}��F2VY,�Rh�u�e����h��n��~��O|@���ѭ;?,d�o�����l��.��;�o6�b�)0.+1M*1oSbѤ,�<���-� ؚ�O���)�>�y�']�`2W�t�y�Nj^��^��������`��N7��&g3�5i��M,E/��Q3'sd$)�T|�F@��m��y<�i`�r���q{�^�)Z�<��K�U�dLAô�9%<�AK��Q�8>�F�v�ٜlN���׭����t�!���5��B`��~v�9c�KU�3"�%d�F`�\����o��rz��_5�g��W�<�l2�C	�&q-��s���F: � 7����9��M_/���̒���BW�����E�˦8nu�F��&1���G����	s'�z[�ʈ���ѳZ4�$H�@�xU�t.j�nF��GZ0��~��V�IÌ�и�9�!B?������R?�ҫ�^�����N��<xr�*Τ-�W�Ŝ9��
�(2�u��Q-x���L^�<Z�}���&�X�4F*�WJ��Ԉ�f������A�{�az�jôy8c��aR1�b�R����H+�)X�SZ6��"1�|:��I����R
$�WXJ��R�����W�pI7dF~�h@�J�4S�&p�*�+֑uY�!~�l�dʆ�(+�}�v1��e���Lx�Pt��.(F�8e�,df�!����AM_��N 嘕x�'�g��;�[$w�1�\��ӐQCJ1�e�<9Hoz���9��9�|��l:�^(�r@���^,,Z���%)��\/�R�.�_�M��|U��3ʓ� ��|��X��-p�C!`��B��?<��9��.l	�i���(��f��ȴ���+��m�v?�ې.�W��UC�%fo4)�HQB�Ab
9���Q���q�v �o1�u�ӌ����~=K"D��,ZŖ�!C�����U�ĥY�t@��^�IǸ^���X��#U��J��̰���L�.΅�d5K�#v�۹>Bи���O���� TϬZ�+�bv�a�8�
�h�����_�Y\�T׀^�P��XЮ����A�-��Ѷ&���o��^�;�u3�}�_,�:�^
:ډ���Pkl�x�u�K�#,������*+SK�vͫ+�~�q.�T��L	�ӄ!_�
�u����F���6奚�$�n�C&�3��'Ŭ�[��#d������u׎)ϐ�N6���{�l�Q�X!-nhg]L�2Z�vx�؛.*�i��S�g�+֣��[�fO����#&@�0��8O��ûʘ�U'��0�H"3��+�%$�,��82�M�fKn@F$$c:�mv[�#.aV�z۞�>0jEJX˄J�$l�	@���jaM��vb\+Ħ�y��Q�\�Vj�3��8	l]ㅎin��6ob�.�]��k�k�Qp�d} s��O�&��*P\F����lV��WuE\�"�F���I2/,g�B�e���6��~���-hs.Zd�+G��2�n��D�c乨����&�kz��дu֒dJ
���	$���H*�|�����HG�;]����kМ�܆;��Nc�B��`�T`5Vg���S_�y���Y�U�=�Y��Z{]Y(��J!ey;`i�vH���ߪ�nO���x	�()aU�Q�;��e����.�Ɉ�#��*�~�:�|�e����3Ӽ�j��M),�AĲ1���
�j�&D��v�����;8�������
�j]��vw�&�]:�!.���?�)���\��7?z@�v�$`�\`&���BOB��P����d���)��0mu
*�7w*%�H���+�
� �N5�T�?>	W�&w���=\[D�c���� �����t���ə���!�9��Q��=���n�b̢�1㍆�����eҾX(�t`DFd@�[[�F͟�<�e�hw������m`�X���eͨim�D��G�<���㮥W���3$e�y3�55���X�H!1�J:pL#��B?iθ���������L�v�g����6�;>�+0��%�%ȭq�u�ĪC      f   m  x����jU1��y��-��d%�	�tP[�
�*iE��͊o��=x��__rn��^�;ݼ�{���ˏǯ��=?�~|����������ſ�/O�?����Oo�~��=�8/O����ō�	�V�$�`c�
�� �!0d 悅�U	k�Rc��H3;���S�,a�g�|��T�a������� �e �Ly��NV�DOX�<+�9n3Y �L��-(��B�,���X�`��.�gU�� T9P�(MV@�+U�Bm�	s��dj�e&@�fvl���.+��+���Ej�"5z���R�Ϥ�/R�)���e��`3@
�"���H�_���%^C�B
���?���%^+;��!�\ �2 R�',X ��)�C
��3�셼=y{��`��`��|Ve4�UDȫ��3k�9.Xem�Ɂ��@�IYRVǒ���y�ԐJ8��%Ī��
)CJ�X
��N;ejL�	}V���jnV)w��;���R�J�R�B�kA�J�o��������5����JXc��0Vru�'S�i��U�|ELXS�i�X�N+�BO+􄱤]�{g��0��M�S��U@�]Cj��Jg>�mw�4�����t����/�	�9&��3)��X ��k��:�4dmYS..֙�^E$�`�v�h�+̈́���0j&�M
�&�$vȓ�6[��c�U�ƒ6aj��>cI[dҦ�jԵ��ff�X9I��O��ق5P6��|�k��/a�E���(��ܚ����2ix{��)O6�@I(	c�1d�鳄�������Y�X?�2i���,�.�K�u��}����a�g	c��O�Хv�R;%l����m{��0gf�Ѭ2i�:m_[�T�nØ�M ajn�%*f����_�O�      ^     x��Zˎ����gH4�{W+�,X ED
$��"G��썝 B@FJ�"��2�=x<��7�W��m�U��<ǒ����T���x�_��{���~�{�w�������Vo�w�߽t���{����Wv7~��n/�~�ӟ��7w/�����/������������E|�%�dZ�U+�wZ�T�h)I����W�^{�ŗ����wp����η������O9�kڴ"��E%aU�"�ZE&�������v����������2����u���B�B��Bk��������9B_m���nkg�������-	�pl�Q�"Z��ERU��Y��Y�u��,�j���*��&r�U$��d�*�� 4]`���soD�+�)-z͸j�(�UW���g���3�̛h\5��$)b(g�UZ�^��Ւ��y��	�|���o�4n��$r՘�ܕt���-���'�]v�=؍��=��r�A� l�p[���wIH*���K�vA�s���h;�8�̖���1E`�$�K2m�2&I� �D��M�;���n��<D�}�]l看n]�Ihc��rY�f��k�%�/nA.���k�B���ޜt_��Э R�n��wМ$�y�Wb@�߷� �����~�uJY�2�.L:�M����wE����}���>�.�v�o<��8�
�ՈioI5�Y��	"$KZŤ�_ 6z�ܿ�'\l�->�αE���Zdc� ��ƅ(���(�� �[( �v�,�����,B�.x'#lm���c��b��)/�e�ߗ��e|�#��&�����MԢ��G�Qx�<�<���v) G������-�(��|#2��UQ�n�@�_"0p70�'z�6�����C�� P~ebQ�8`����1So��SMԸ�Q �FDU�H��e�%��$~����3tR�h��7�o��
���{`��}���;@�w~T��M$Ղ ��Ib�4�`� �z
i�0O�⨂�,$�$����]�U��S��4�ł�fbT���=P�Ԏ�B�ڤC9@t���㜳\@Άf;� �݉ɩz#+�PI\~��z�dJ1� � p|��Of��ʪ)����!uu�r�A�9�����xɀ���Cg��<�Y$��l� ���Y�!�Eɑ������₱hj#��!�\���Idih��5�T�]ت)��qf�� @�T���8�G�@� u�mU�r��/@ ; �ΐc��?�,c���t��s�l��U���<lH��,���>��w>)�c�d
��u��1�h���W���vځ���~g�;�7@z,XU�	��P��eA�8�|ζ�h�{(2��/��W>���@���_�oWC�?�8@����Aա�-�8�_eQ$%X�Ӓ��ICW��O�-@zW�8!�^n�{"�"5W�=G�kg���74!��)_Ā�3�>�j]��Q����'{L ���
.�qJ�{<����s/Ϋ��t���Z�ef���
̩1	��Y���=�����)��)i.�L�� H� ��XX?�2f7��7�x����!+�IF�	��� "|\���Z�&@�Q���2�+��@n��tv[Ы���`����Q�j	�G�
�@��a����o��r�O�����G�����*��.:�п(��pe��E@M�d+5$����!,U�暬�y��;l��^���5*c�gڡ ���&��WTXq^���s��h�8VP2La;z/U0o�dkU�`2?��wqN��y�u6����z��	*��P*�f���˹`��L��<W�*ʮ2�?b�+|UU��� ���<���'�������;�@:R��;u-������l����������r�i)<��O��iŹ�A�c�N�U}�$XN�2��+�L��s�
 .�5o��g �qkP���m�{�H"� @��(�`��:����|��1S�\�|2�@C{Uս��4p<]Э֬ªK-��V��@����!AUƙJ�������׫��c:�[�y�a��K����QZ	�	�_`�hT����vs+:�����Gc���.E�RdL���F��b`@C��LM-�xо�=�������=��mA�e-�q�ƴ�`���g���g��D�巪�MM"��K��t=��@�XzM$H�42M@s��F?d�Z�z��[ �¯Q���ə:��̕�Rd�T���0��+*�|<پ�=�t[��K>K�"�� t��:�ǂ�tDᇣ�s��v�����}q�����?��p�P���hup��B<.>��_N�=A�U2����@(!��&���d^�伉)�?�+�
UEЯ�5�?6���6X�� �:��37v*���2����;6_�6�p$ZЁ���	�ͼsJ�T��p���`_o2<4���׼ y�]���9?~��2�A}�gL� �I��Z]��/`:��=:���
�W}�P�_��:z��^vp���O}�}�,U���EC�'^���5���j�[�^!�����\h�)
�ʆ��x�i�����/�7&����:���Y�V:w��4O
�0gl�YP
�r�5� ��`r�N��Dw:�ޯ�]$]	6���'���*�i�);��(���ˣ'�^��g,����&
�W,<~���%@{[�--��8 �[��<��ճ��׿��6༂<z
�&�� ���5�bƂ���AnecZ��޷�Y-�*�9�~YДq ��e��= ��A2�O��j9����Uu=��n<b�Ӌ�@N4�%���p|5C雰`���ߡ�/��8���n�)n����d�ꡭ��P
�
�<��w�VY�B�~��1�Cw�9̡�jL� ~�y����s	t��
�羅U��.E�b*���+�t�#��Ƽ��#�[��;p�������v<�?�Q�VW�,����<!L�;^G���&����qz����7�a|ћc�%�'P�O�sI�J����_x�NW��      e   �   x��лn�@��_1�{��^���RPXB �G��R�D�� ����x(d�������Lq�8�7��/#��|,�oɌ5��(N�J"�Y�-�&Da�����k�a��w��rl�z����-q�9X6)�\*��� �/\_H�<��%};��d��)��;<�~�Ou�����#�Ҿ���S��$����:��m����d��́����g��	v5�M�3ϻw�7�?��;      c   d  x���AK�@���{l!ȼ��M�'=���^Em��X����b����$���y��[�֋�MZ�6w�����:>��?��l�m���k��{w|:����c�on�4Ц<>����Y^��6ل�	8s�
�}X�\9�p5�e�kS�pJ����@�!�]����
���rQ�e�e���˄h@���Px��R��E:
e�B� ��B������|T���>oe�S>��k�T�)6���M8�T?�ڀ.x�����C���*��Ϫ>�1���3��4;��Z\�L�7��)���)��}�����A�KC�z�z>(}d�c����~���R�������;�[��S�B      X     x��M��0 D����Ԅ���&Ɠ[q���7c�H���_�����̛&�y�&>̓�"S��70g�<oyW��o��<��L�t�)`�{�`ߙ����kD��F��'��8D�RJM: �Yw�j,
�v�zh�]yFK�2���5�ITw���T��4&�Sl�N�~���ƢmÐQ2
Y=�_��M��<E��5I�
Z��y9oS�~5�.�S����f�;1hU��B�_�}�
7˹Caiyx�,ϵ���i�Ԉ�S,�|5�L� ��g`      Z   X   x���v
Q���W((M��L�+)J�T��L�Q(-N-��L�Ts�	uVа4�Q01д��$M�1P�!��Lȳ͔<mf�i3�j�� �_�      a   �   x���=
�@��>���@�'��E��D0�V� ��h���
o�if��ݴ]�i�a/���1ݖ���{���(��q�O=�r��M/���|�� (WHp�O+H%�N�h�� ��� �ƨ@�!�B���ihK� U�@B�h 
QO[���)�3��5�>��:�+@c4 ��苤@D{�@BT��^�1*m
Y����1      V   R  x��O�N�@��B$-n���"��"��b1\��g�B�lK��}D����P�Ȯw����f2����2�0�o =:!u�c�gmУb��#LC�8�OI��Y64vZ�&�cH�C��ٽa��9Э_�������_��n�MXNh�#囀��$bR9vJJ=s�:�������^�︂9��¡�2���v�޴��E��s��؋h� !RD�呪H�����\M�,K�&E�n��5���B�`�8�̪��9�8,�Uly�ծ^�^�,��)�&��Zd�~���2����8�G[�g-�U�Ot"A�����<⊢U�.m�~ ʘ�     