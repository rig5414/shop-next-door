PGDMP  -                     }            mydb    17.4    17.4 1    E           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            F           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            G           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            H           1262    16386    mydb    DATABASE     j   CREATE DATABASE mydb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE mydb;
                     postgres    false                        2615    18356    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                     postgres    false            I           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                        postgres    false    5            J           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                        postgres    false    5            ^           1247    18380    OrderStatus    TYPE     m   CREATE TYPE public."OrderStatus" AS ENUM (
    'pending',
    'shipped',
    'completed',
    'cancelled'
);
     DROP TYPE public."OrderStatus";
       public               postgres    false    5            |           1247    20050    PaymentMethod    TYPE     U   CREATE TYPE public."PaymentMethod" AS ENUM (
    'mpesa',
    'airtel',
    'cod'
);
 "   DROP TYPE public."PaymentMethod";
       public               postgres    false    5            X           1247    18367    Role    TYPE     Q   CREATE TYPE public."Role" AS ENUM (
    'customer',
    'vendor',
    'admin'
);
    DROP TYPE public."Role";
       public               postgres    false    5            [           1247    18374 
   ShopStatus    TYPE     J   CREATE TYPE public."ShopStatus" AS ENUM (
    'active',
    'inactive'
);
    DROP TYPE public."ShopStatus";
       public               postgres    false    5            y           1247    18501    ShopType    TYPE     P   CREATE TYPE public."ShopType" AS ENUM (
    'local_shop',
    'grocery_shop'
);
    DROP TYPE public."ShopType";
       public               postgres    false    5            a           1247    18390    TransactionStatus    TYPE     b   CREATE TYPE public."TransactionStatus" AS ENUM (
    'pending',
    'successful',
    'failed'
);
 &   DROP TYPE public."TransactionStatus";
       public               postgres    false    5            �            1259    18421    Order    TABLE     K  CREATE TABLE public."Order" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    total numeric(65,30) NOT NULL,
    status public."OrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "shopId" text NOT NULL
);
    DROP TABLE public."Order";
       public         heap r       postgres    false    5    862            �            1259    18429 	   OrderItem    TABLE     �   CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    price numeric(65,30) NOT NULL
);
    DROP TABLE public."OrderItem";
       public         heap r       postgres    false    5            �            1259    18413    Product    TABLE     >  CREATE TABLE public."Product" (
    id text NOT NULL,
    price numeric(65,30) NOT NULL,
    stock integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "shopId" text NOT NULL,
    "catalogId" text NOT NULL
);
    DROP TABLE public."Product";
       public         heap r       postgres    false    5            �            1259    18486    ProductCatalog    TABLE     Z  CREATE TABLE public."ProductCatalog" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "defaultPrice" numeric(65,30) NOT NULL,
    image text NOT NULL,
    category text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 $   DROP TABLE public."ProductCatalog";
       public         heap r       postgres    false    5            �            1259    18405    Shop    TABLE     d  CREATE TABLE public."Shop" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    status public."ShopStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "vendorId" text NOT NULL,
    type public."ShopType" NOT NULL
);
    DROP TABLE public."Shop";
       public         heap r       postgres    false    5    889    859            �            1259    18436    Transaction    TABLE     �  CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "customerId" text NOT NULL,
    amount numeric(65,30) NOT NULL,
    status public."TransactionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    method public."PaymentMethod" DEFAULT 'cod'::public."PaymentMethod" NOT NULL,
    "phoneNumber" text
);
 !   DROP TABLE public."Transaction";
       public         heap r       postgres    false    892    892    5    865            �            1259    18397    User    TABLE     /  CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."User";
       public         heap r       postgres    false    856    5            �            1259    18357    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap r       postgres    false    5            ?          0    18421    Order 
   TABLE DATA           f   COPY public."Order" (id, "customerId", total, status, "createdAt", "updatedAt", "shopId") FROM stdin;
    public               postgres    false    221   �@       @          0    18429 	   OrderItem 
   TABLE DATA           R   COPY public."OrderItem" (id, "orderId", "productId", quantity, price) FROM stdin;
    public               postgres    false    222   C       >          0    18413    Product 
   TABLE DATA           f   COPY public."Product" (id, price, stock, "createdAt", "updatedAt", "shopId", "catalogId") FROM stdin;
    public               postgres    false    220   dE       B          0    18486    ProductCatalog 
   TABLE DATA           |   COPY public."ProductCatalog" (id, name, description, "defaultPrice", image, category, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    224   �I       =          0    18405    Shop 
   TABLE DATA           k   COPY public."Shop" (id, name, description, status, "createdAt", "updatedAt", "vendorId", type) FROM stdin;
    public               postgres    false    219   �T       A          0    18436    Transaction 
   TABLE DATA           �   COPY public."Transaction" (id, "orderId", "customerId", amount, status, "createdAt", "updatedAt", method, "phoneNumber") FROM stdin;
    public               postgres    false    223   �V       <          0    18397    User 
   TABLE DATA           [   COPY public."User" (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    218   wY       ;          0    18357    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public               postgres    false    217   M^       �           2606    18435    OrderItem OrderItem_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."OrderItem" DROP CONSTRAINT "OrderItem_pkey";
       public                 postgres    false    222            �           2606    18428    Order Order_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_pkey";
       public                 postgres    false    221            �           2606    18493 "   ProductCatalog ProductCatalog_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."ProductCatalog"
    ADD CONSTRAINT "ProductCatalog_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."ProductCatalog" DROP CONSTRAINT "ProductCatalog_pkey";
       public                 postgres    false    224            �           2606    18420    Product Product_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_pkey";
       public                 postgres    false    220            �           2606    18412    Shop Shop_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."Shop"
    ADD CONSTRAINT "Shop_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."Shop" DROP CONSTRAINT "Shop_pkey";
       public                 postgres    false    219            �           2606    18443    Transaction Transaction_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Transaction" DROP CONSTRAINT "Transaction_pkey";
       public                 postgres    false    223            �           2606    18404    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public                 postgres    false    218            �           2606    18365 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public                 postgres    false    217            �           1259    18494    ProductCatalog_name_key    INDEX     ]   CREATE UNIQUE INDEX "ProductCatalog_name_key" ON public."ProductCatalog" USING btree (name);
 -   DROP INDEX public."ProductCatalog_name_key";
       public                 postgres    false    224            �           1259    18445    Transaction_orderId_key    INDEX     _   CREATE UNIQUE INDEX "Transaction_orderId_key" ON public."Transaction" USING btree ("orderId");
 -   DROP INDEX public."Transaction_orderId_key";
       public                 postgres    false    223            �           1259    18444    User_email_key    INDEX     K   CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);
 $   DROP INDEX public."User_email_key";
       public                 postgres    false    218            �           2606    18466     OrderItem OrderItem_orderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public."OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";
       public               postgres    false    222    4760    221            �           2606    18471 "   OrderItem OrderItem_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 P   ALTER TABLE ONLY public."OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
       public               postgres    false    222    4758    220            �           2606    18456    Order Order_customerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_customerId_fkey";
       public               postgres    false    218    221    4754            �           2606    18461    Order Order_shopId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES public."Shop"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_shopId_fkey";
       public               postgres    false    221    4756    219            �           2606    18495    Product Product_catalogId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES public."ProductCatalog"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 L   ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_catalogId_fkey";
       public               postgres    false    220    4768    224            �           2606    18451    Product Product_shopId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES public."Shop"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_shopId_fkey";
       public               postgres    false    220    219    4756            �           2606    18446    Shop Shop_vendorId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Shop"
    ADD CONSTRAINT "Shop_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."Shop" DROP CONSTRAINT "Shop_vendorId_fkey";
       public               postgres    false    219    218    4754            �           2606    18481 '   Transaction Transaction_customerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 U   ALTER TABLE ONLY public."Transaction" DROP CONSTRAINT "Transaction_customerId_fkey";
       public               postgres    false    4754    218    223            �           2606    18476 $   Transaction Transaction_orderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 R   ALTER TABLE ONLY public."Transaction" DROP CONSTRAINT "Transaction_orderId_fkey";
       public               postgres    false    223    221    4760            ?   e  x�ŔKnG���"��&��,�4��m@Q$�G8�#�D�C���`�cU56kC���t���ӡ-�t�^ۧ��X@�P(��HY���]�u=�>��>���_��	H~!� �C�����9�@���\���Gޣ{���V�p9�t�C쌭2\�b�����{ס�`�6��7�_"�o��Ƌ~���Q��C��-J�6;P$_At?ԕ�� \Q(��sJ�$�t��s��	�*T�5VY��F8J��r~���9��_�D��r(�X�Zy~C�S��~�p8��0�8��b�E�K��f%���1����b0ƌ`#��u�<�/(k�%����<�����s�L?@s�0�P�`ӊY�W9C���$�*�qŵi��N��Ah����e��ֱ�pW���m5�X�I���2m*�o"XP�;��6����V��ԗ�qF�J_x��W,���j�y�hê�v�I+bb�=��Ϥ�/�w���{�Q��Y;K��L����~��Y�k� Y���	��n��������2�������]�^���F�V�n�]G�Z�� :LZevꚫ�e��jMƛ0������|A�����Qy	�$>~}z<�7�4      @   >  x���A�$!D��]����w�*���0ݫ
��y�Lk�%�FR�\�ލ��������bk�w�u���I:Kh��4�����j6#W�����L&��k��ަm,����>�s��B�����3G�J�l��N�K�/0�ܗ*_�R��q�w�tW
O�vcP�hݓ�����F�5�1eb�����vo^���x����z"m݅i\�Q`��aJ��p�\�m|u?ũ�\ N�X�B<�=%f�m�|cR.�����rx���]���g�Klw��ڔl�r����Sg�8��0����+io����؎Sg5i��7����`�ĸ���Yt2$83�����������FF��]|��q���O�=���h�8`�oL=R�s��돀��LPT���Q�:�S��Q5����e!�鍑[�pʪ�A���P��1�̓>��]��Dn�y*Z�&m��f>8�.*���
���
B�������l3 ΂R��^��*�p~���-_����L!��x.����vm^r�<L�
2q��Q��;���z�␪����@v�׍���:������|>���      >   y  x��WK��\K���?�`��$�����y{�\�&�]
��B�k��7;u� �&��`���Ue�K
���\�/e-�J�?T_j/����_�ٺ�8��S�-��k�g�Y��ؐ���E>[�>Z���Ͳ��g��m4rQ��٩����*�R¾	w-���]&��N�m%�m���v��y�:�.�<O���h��Q����}S�m_���	wb�I��;�>.�\���9t��^�G0��V/<x�}��#%*�h�����auF���{���v?cؤQ�>��J�,�$�s��U��@jj4�1��k��{�r�~�&>q��(m��j&Jï86��C���6ƣ@T���Ur�����k^�A���� Jf�#�����2���L��?=�E�����ț���N}n��7;G�Z������¬��(-��{.�Y��u-��Ӫ�P&���6�}6*�mSy\boA�w����B�a��$���]��]Ɲ##�J���:O�؄����M��c��?�RTL� ��t�D����}NTV�yV�$��,����|�#��Q�6����R�Z�}�� �Gr\h'mǝ�WND}Kˮ��nM����k�W�f- ���{�˾�`?�9���L����@��-��Yok�G���~w�y�4
K����߂����ެC�ѱ�%E�
k��-�s,�Sx��{����Jk5�{����������qC�އ��� |�l(z���"d!EZH�\��"���N{$t O��ڊV?Z����+l��+*HBxZ���s֞��NK��o���$��ėV>�Z�X(y��6�7��#��z`PO�Q��@���3�% �S(&00dE��xP!"P��o���i]~����̿���놟g��K�Z|����1�P��1�C��F��ge��oΜ5���ܞ�����ї�&���r��	B�%�e�˪|��TG��z�IЈ�C	�j}���=������FT���$fCj��y�{Y�_s�O���J�2�Ϝ��֣8n�<[\��q�Z���Z��{C�� ��A�@ϙ�_�..?5���d�/�/��}v���fy��_�ZЂ>����G1p�����G{      B   �
  x��Yۮ��|`N�~�/��d��a0�*������ק����e�Rh����T��]]5LU��%�LU���`�.!��\e���ҽ	�o�{5�������}����{_�pG�fw��#��î�Y�j��ݧ�c
ÿ��x$�	M��BuB<���wL�?�¼�"%F��*a=�ʣ-RIV�����0w�O�0����������u5�s�F��0]�N4Q�J�P��5��5��B^Me�wu�ɋq��v�/�p�t���,�� #&8�B��⁦��Nx��B���{?�#y:�n�t�p؅n���v����Z��i��a6����������v"?�5L'����e&�����qG�������׭�s�F��&WЊ�2��4Gò��&�ȋp�Т���w}]��[�*V��5�T4�X�0>ʂ΄�P��e)S�Ϟu�q���C�z�L<V�3
WEP�	�����͙�����H~8�i����K����;b��޿5�E�����X&ꥱTYê
Re�ȇ�7�bX�b�,�9fE��Ƅ\�xSAǅ�hQ\� �X3�h7�d�L~9��a&�05�������ہ���WG�e	M&2m��)+��Uɠ�bć��R]:�n��ǐ�pKa"p+i�V`Z$G��j&�B9c�NӸ��	�[�w]��
-d;\%:?'�r�.G���Ŝ�>�x���s�~��K鎗�M��[�f���e����'J.1��5'c�'��!����������%d3\-���*�8�*3�М���y!oP-���#��yq�@;GlKf�Z��T9V���2��u܃�'��}c�sj�uq�K�f��d����$�ዂmܥ0"b��:!�&ώ��݆uqK\"�wYL��S(IUE�9��[U��>�@�}����7���-�p��,VUT!�J%D�j�!x)�l  8D�ɋ}?}w,�c��w�k��f�5�|���]U�).�q��i���(>S�X�#D��[��Wg���		��k��
��ȼ��8'c��s����u�q?^ ��[Z���;4\.�G�V�j>Ha����E6�1�`�~����t���������Kρ[��.H'��A���
�Ό,1%�f��}ꗱ{�E�z�KZ���0��rK��_����ɧ�?U�NAo�����1VK	�_�8�*��H��jf�!�n�����t��ah�}?��}���|�I�,�m��7`���PQϐ;�[(wΩ�<��稬DڧC�k�������}�zd1#��g>#��,�5Ƚ���A�d$HZT �u)1+}`�(��1?t��Җ���RB�ΰ�D�g�w	�\x��6=^���!�e6�{�!&���q�n-ݛ~��NT��s��6���,=Fn���R�eO�v�j&�s�F�J��eEޅ}�^N�a=Sy�Ga)�q�����~��C�����`�Wa�1�D>~�5��4�"=˦�&��ƺKSC<֮`^��P��0�S4�9�p�<�>EV!�%��GL�߽��S���8�8�nj���G��r�����^*�j �T�g�Ţ��Kځqy��`3�0>t�ot6��1d+֪3w�Ӧ�P�J�H�TU�R�<����;�<����/azXWw�^o����V��#��`�?cP'd���,@��Z�v�p�e��1���i!��ͩ���ʾ~�?�lm��M�xA�A����Y�9�b�^N9��k�a�}�N8p[�0t˷�[r�_Q[	��XL;x�@�4X#fa,����j��ا���8f��qc�m�_��bw�U���0��(�:�Z	��8�^sf4�DyH�V��$�Z/��S[�zj�9Gm͸r�3�Q��pFK}�b�J�|����н�TP:��ߟ���zd��l���j#�<)�Ay*@������v�v{l� ��+��1v+R�-�-X���F�db���F�#��d���c�r]�u���7#v3mp���˥d*4pι�b*RZMޖ�P��#�KA�\��?o?��.a�����تW��{o�5���2��1K���!컿��ԞK��t���M�u爭�ZXg\��m@�������UUW��3�_�=A^/ˀ��nሼ�e+`�0����T��KAR/��Ų죊�TM~
�{>�v���x��~r׍���S���+/R���U��:�5BK�B6ɴ��O����oW]\���p���Ds-��v�J-.�\����Z��ƹ�����+��|����JW��ܯϲ�g����6?����(S{�Y{�ʛz�ٶ3>y�)��㾄��0���%~�4�G�_O)_۝�˓x^�13*L��߃��hf���)��a�B~xLu7�0���9������X�}��� ^L��8��vŋ��7_�������?����C7�x�C����B����V�򃺔 �XQ^�]���p*�s���*��]X��zY/�[AG�$(���Fe3��	\V�[�
�~6�e�^�uA^��!�c���M��{�V�FsH9C3kv&� �e5S9����~N�����<NN��#���}�
9y%1�yj��k�0�� ��.i0%y9N��0CA�fJ;��<Y��.o"�K�F��u�f��Q#2G�x��\$<�P�^*��}(>&t�_�����i)���?�<y�OZ��      =   �  x���9o1�k�W�K5�c;7I8H�*@�`H�V^c���J��"�����7�=���������
��z]FL�P�������O4��i�4�4�/+�r�uZ�e��T���`h�3�K&��� (Õ���Ko��/��Z���T���Pk ����JV����}>�ϻvN�)�66r2eh��εv7��Z��3M�2N��j������t���X�
��;\�N�N۽S�dp���:��:j��M�@Zgƌ���: &�f@k�T���ס�߄�����Ʋf�oܘ������&�Gl3��<��Zg}C�MXh�����_��~]V�-	���5�@C�έT����v���؅�؅̇�ZV$x
L��j!VE��=����(I]M���g�1��q���O�6�����F�u\�&���B�Z�o�\�N���}���"a���\j�c��F��J���o��n�g�-      A   �  x���M�7�ךS��O���x#�T`�p����d�0���j�[ů�Zc�M��Ta͘�i[Srk�!�8�_; ���:�/��#i���תM�9���_�|8�W�׫}�qN~�~|m��X?1?�|tz�_��?�}��E4ծ3��v�^p�]�����V�p!��Y�2�9����5��P%Z��{N��|36׼F�>�-Qw}���^Auҭ�4v#��@���E�����# G�j�ǁ�)ǜl]{�m�i3�YZ�m�a�C0-S6K�S��)�t�sO8ePA�e=�c���CV���v� �x�*�e���u�Y�X�wg�G���e>y���ƍd�%���E��qo���/*L��W�mo#�SǊ�vP��ʟ�0�0햷�޽�K�ɿ޴�V<7��*[�ty3O��z����$������^Y��6o�A�@Y�tWL����q*1ҭ�$�Q�y?�)�e=�==vc�&C�[���o�����U�]�s�X|9h�o|��ŭءV�f)� �j�Ua�YՅ{�)L����� �]P���T�B>{�OV�>�c��)VU���S��cD����lX�t���Ym޽��z�����
��~z�"Y�ҥ,\��)��������?=�^��������8�T�Y�sԫFn'�㜆�*�g����)���ULM.�n���e�iT���o���y�=�^��2z��:<?P�^��\�[��ח���e��i      <   �  x��W9[I�[�b����P��00 �mҧ4����~k�� �pQ�U��~���Y�4�$y,���ͱ�¤�E�J��r��ơ�qĖ�=]���%���J��?�N6���C�Z���p%�}�&˙���f����a���!�y9�ӻ�(��u�Lb�IL8&�`d@�@�>�W�ʂ��j�L�^�BK�96Z,'�1C�	*2�����i���d^7�4��.� ���?�?F�����MawE�HOG�q�=<iM�;;ME��r��a���˲�	�a&
j���&�O�2� �<9�7:��2M�Ytи���u��կǴ+m:�F��4��2,��س�b	�W�}@G��*�7���h��Cf���L�*;��7X*,�`g����`�O�k���2���[�ͻ�w�����Y��_���jRϚ��}����5�b�G����l��χ{���Ë=�*����(�S��M��E
�6�KعȰ%^���E���q�n�]��2j�<KJ��V`���V[�ѥD(��k�q��-�{H�[���F�����3k�I�%=ڹ+�U^�j^6-ڼ��+n=zkɀ!"z-Xj3�J�sL� ��J�Il-rV]����/�Ӄ����?�W}uvu1�������o�r��֗׫��~%G-���ez/��1�?�{,���V�Q���>YPv�2,!�����A��i[��f_��[�A��c���[���MPw��'A1�=G�uU���h �:j�(O
d���Ag%<�2��cЌ��ҷeqP�g%�&��ӟ��{pB%j��(�@eH��Z�&s���tYW�,N�g�J�O_��-�f�=���b�u���a�
j:�4�Έ
ܡ[�q��ؽ�մE/���#/���cF�,pfħ�V&����o�9P&{��#j�$�����e�t����ձ�����a5O#rU����=��烣ͤ���_t�)g���@T�H�7ܼ�6��.�G��`i�9j��0>xX�&[�SV2ڈv]�V��N��r�o^�O���7�iL���=0>G)��hÃ�$P?�e��H�N\�,��Yj��^����,��+Ы�ځ��3�{�k�g�{Ⱦ� �W�8I:%�G���fŸNa���������!YW�
Hó�Jḥ�X0��M�����=�(t2OMٹ^���kL����?w���DH��������b6�      ;   )  x�}�[N#1E��U�?�^~T1+@j��6 I��O� f@ɲ�m�|Ͻ6'�*6J�����}&n�%HuS��2���%7�ѻ����+x/5�Z%�ȓ���Jv�AZHn��{�j��~��E�HRחS��X��;?ϛ�ߗ�mP)o5p�Y��I��2��KH����R9mZՉU��:�����`��j>'�L3�T�8�V@����<�UA![�?�p��������ϫ����~��pO�a�yoӗ�S)%/����>Jhϸ��6s�����Mu2��"�Qi�qdP�c�h�c�H��=��'��(�����_Oc���P��tE)0z���k	�E��8R�Z��Mm�j���#��;�MI�0�FI:I�J�f�P�[�p��Up��}�}�%,,4����ԏ�\�n�';���Z)κ�d뜇���/&�%v�f��_ib'��f���d#��5.���Y��16�>k\X�.Ԁl� ��a*�	��v)��h%�������8���q�?��1u<�/P��$�W���v�����     