FROM larrycai/openldap

ADD ./data/structure.ldif /ldap/structure.ldif
ADD ./data/users.ldif /ldap/users.ldif

RUN service slapd start ;\
    sleep 2;\
    cd /ldap &&\
    ldapadd -Y EXTERNAL -H ldapi:/// -f structure.ldif  &&\
    ldapadd -x -D cn=admin,dc=openstack,dc=org -w password -c -f users.ldif